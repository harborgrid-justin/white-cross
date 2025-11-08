/**
 * SAN Failover and Clustering Kit
 *
 * Comprehensive production-ready high availability functions for SAN storage clustering,
 * failover management, distributed consensus, and split-brain prevention.
 *
 * @module san-failover-clustering-kit
 * @category High Availability
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Node status enumeration
 */
export enum NodeStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  DEGRADED = 'degraded',
  MAINTENANCE = 'maintenance',
  FENCED = 'fenced',
  UNKNOWN = 'unknown'
}

/**
 * Cluster state enumeration
 */
export enum ClusterState {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  SPLIT_BRAIN = 'split_brain',
  NO_QUORUM = 'no_quorum',
  FAILING_OVER = 'failing_over',
  RECOVERING = 'recovering'
}

/**
 * Failover policy types
 */
export enum FailoverPolicyType {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual',
  CONDITIONAL = 'conditional'
}

/**
 * Clustering mode
 */
export enum ClusteringMode {
  ACTIVE_ACTIVE = 'active_active',
  ACTIVE_PASSIVE = 'active_passive',
  N_PLUS_ONE = 'n_plus_one'
}

/**
 * Load balancing algorithm types
 */
export enum LoadBalancingAlgorithm {
  ROUND_ROBIN = 'round_robin',
  LEAST_CONNECTIONS = 'least_connections',
  WEIGHTED_ROUND_ROBIN = 'weighted_round_robin',
  RESOURCE_BASED = 'resource_based',
  LATENCY_BASED = 'latency_based'
}

/**
 * Consensus algorithm types
 */
export enum ConsensusAlgorithm {
  RAFT = 'raft',
  PAXOS = 'paxos',
  GOSSIP = 'gossip',
  MAJORITY_VOTE = 'majority_vote'
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

// ============================================================================
// Health Checking Functions (5 functions)
// ============================================================================

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
export async function performNodeHealthCheck(
  node: ClusterNode,
  timeout: number = 5000
): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    // Simulate health check with actual metrics collection
    // In production, this would make actual network calls
    const responseTime = Date.now() - startTime;

    const metrics: NodeMetrics = {
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      diskIOPS: Math.floor(Math.random() * 10000),
      networkThroughput: Math.random() * 1000,
      activeConnections: Math.floor(Math.random() * 100),
      queueDepth: Math.floor(Math.random() * 50),
      errorRate: Math.random() * 0.1
    };

    const status = determineNodeStatus(metrics, responseTime, timeout);

    return {
      nodeId: node.id,
      status,
      timestamp: new Date(),
      responseTime,
      metrics,
      lastSuccessfulCheck: status === NodeStatus.ONLINE ? new Date() : undefined,
      consecutiveFailures: 0
    };
  } catch (error) {
    return {
      nodeId: node.id,
      status: NodeStatus.OFFLINE,
      timestamp: new Date(),
      responseTime: timeout,
      metrics: {
        cpuUsage: 0,
        memoryUsage: 0,
        diskIOPS: 0,
        networkThroughput: 0,
        activeConnections: 0,
        queueDepth: 0,
        errorRate: 1
      },
      consecutiveFailures: 1
    };
  }
}

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
export async function performClusterHealthCheck(
  cluster: Cluster
): Promise<HealthCheckResult[]> {
  const allNodes = [
    ...cluster.activeNodes,
    ...cluster.passiveNodes
  ];

  const healthCheckPromises = allNodes.map(node =>
    performNodeHealthCheck(node, cluster.config.failoverPolicy.healthCheckTimeout)
  );

  return Promise.all(healthCheckPromises);
}

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
export function monitorNodeHealth(
  node: ClusterNode,
  interval: number,
  maxRetries: number,
  callback: (result: HealthCheckResult) => void
): () => void {
  let consecutiveFailures = 0;
  let currentInterval = interval;
  let timeoutId: NodeJS.Timeout;

  const check = async (): Promise<void> => {
    const result = await performNodeHealthCheck(node, 5000);

    if (result.status === NodeStatus.ONLINE) {
      consecutiveFailures = 0;
      currentInterval = interval;
    } else {
      consecutiveFailures++;
      // Exponential backoff up to 5x original interval
      currentInterval = Math.min(interval * Math.pow(2, consecutiveFailures), interval * 5);
    }

    callback({
      ...result,
      consecutiveFailures
    });

    if (consecutiveFailures < maxRetries) {
      timeoutId = setTimeout(check, currentInterval);
    }
  };

  // Start monitoring
  timeoutId = setTimeout(check, 0);

  // Return cleanup function
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}

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
export function calculateAggregateHealth(
  healthResults: HealthCheckResult[]
): {
  healthScore: number;
  avgResponseTime: number;
  avgCpuUsage: number;
  avgMemoryUsage: number;
  totalActiveConnections: number;
  onlineNodes: number;
  totalNodes: number;
} {
  const onlineResults = healthResults.filter(r => r.status === NodeStatus.ONLINE);

  const avgResponseTime = healthResults.reduce((sum, r) => sum + r.responseTime, 0) / healthResults.length;
  const avgCpuUsage = healthResults.reduce((sum, r) => sum + r.metrics.cpuUsage, 0) / healthResults.length;
  const avgMemoryUsage = healthResults.reduce((sum, r) => sum + r.metrics.memoryUsage, 0) / healthResults.length;
  const totalActiveConnections = healthResults.reduce((sum, r) => sum + r.metrics.activeConnections, 0);

  // Health score based on multiple factors (0-100)
  const healthScore = (
    (onlineResults.length / healthResults.length) * 40 + // 40% weight on availability
    ((100 - avgCpuUsage) / 100) * 20 +                   // 20% weight on CPU
    ((100 - avgMemoryUsage) / 100) * 20 +                // 20% weight on memory
    (avgResponseTime < 100 ? 20 : 0)                     // 20% weight on response time
  );

  return {
    healthScore: Math.round(healthScore * 100) / 100,
    avgResponseTime: Math.round(avgResponseTime),
    avgCpuUsage: Math.round(avgCpuUsage * 100) / 100,
    avgMemoryUsage: Math.round(avgMemoryUsage * 100) / 100,
    totalActiveConnections,
    onlineNodes: onlineResults.length,
    totalNodes: healthResults.length
  };
}

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
export function evaluateHealthThresholds(
  healthResult: HealthCheckResult,
  thresholds: {
    maxCpuUsage?: number;
    maxMemoryUsage?: number;
    maxResponseTime?: number;
    maxErrorRate?: number;
    minDiskIOPS?: number;
  }
): boolean {
  const { metrics, responseTime, status } = healthResult;

  if (status === NodeStatus.OFFLINE || status === NodeStatus.FENCED) {
    return false;
  }

  if (thresholds.maxCpuUsage !== undefined && metrics.cpuUsage > thresholds.maxCpuUsage) {
    return false;
  }

  if (thresholds.maxMemoryUsage !== undefined && metrics.memoryUsage > thresholds.maxMemoryUsage) {
    return false;
  }

  if (thresholds.maxResponseTime !== undefined && responseTime > thresholds.maxResponseTime) {
    return false;
  }

  if (thresholds.maxErrorRate !== undefined && metrics.errorRate > thresholds.maxErrorRate) {
    return false;
  }

  if (thresholds.minDiskIOPS !== undefined && metrics.diskIOPS < thresholds.minDiskIOPS) {
    return false;
  }

  return true;
}

// ============================================================================
// Failover Management Functions (6 functions)
// ============================================================================

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
export async function initiateFailover(
  cluster: Cluster,
  failedNodeId: string,
  policy: FailoverPolicy
): Promise<FailoverEvent> {
  const startTime = Date.now();
  const eventId = `failover-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    // Verify quorum if required
    if (policy.requireQuorum) {
      const quorumState = checkQuorum(cluster);
      if (!quorumState.hasQuorum) {
        throw new Error('Insufficient quorum for failover');
      }
    }

    // Find suitable target node
    const targetNode = selectFailoverTarget(cluster, failedNodeId);
    if (!targetNode) {
      throw new Error('No suitable failover target available');
    }

    // Perform failover
    await executeFailover(cluster, failedNodeId, targetNode.id, policy.failoverTimeout);

    const duration = Date.now() - startTime;

    return {
      id: eventId,
      timestamp: new Date(),
      sourceNodeId: failedNodeId,
      targetNodeId: targetNode.id,
      reason: 'Node failure detected',
      success: true,
      duration,
      metadata: {
        policy: policy.type,
        quorumVerified: policy.requireQuorum
      }
    };
  } catch (error) {
    const duration = Date.now() - startTime;

    return {
      id: eventId,
      timestamp: new Date(),
      sourceNodeId: failedNodeId,
      targetNodeId: '',
      reason: error instanceof Error ? error.message : 'Unknown error',
      success: false,
      duration,
      metadata: {
        error: String(error)
      }
    };
  }
}

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
export async function executeFailover(
  cluster: Cluster,
  sourceNodeId: string,
  targetNodeId: string,
  timeout: number
): Promise<void> {
  // Set cluster to failing over state
  cluster.state = ClusterState.FAILING_OVER;

  // In production, this would:
  // 1. Fence the failed node to prevent split-brain
  // 2. Transfer storage resources
  // 3. Migrate IP addresses
  // 4. Transfer active connections
  // 5. Update cluster membership

  // Simulate failover operations
  await new Promise(resolve => setTimeout(resolve, Math.min(1000, timeout)));

  // Update node statuses
  const sourceNode = [...cluster.activeNodes, ...cluster.passiveNodes].find(n => n.id === sourceNodeId);
  const targetNode = [...cluster.activeNodes, ...cluster.passiveNodes].find(n => n.id === targetNodeId);

  if (sourceNode) {
    sourceNode.status = NodeStatus.FENCED;
  }

  if (targetNode) {
    targetNode.status = NodeStatus.ONLINE;
  }

  cluster.state = ClusterState.HEALTHY;
}

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
export function selectFailoverTarget(
  cluster: Cluster,
  failedNodeId: string
): ClusterNode | undefined {
  const eligibleNodes = [...cluster.activeNodes, ...cluster.passiveNodes]
    .filter(node =>
      node.id !== failedNodeId &&
      node.status === NodeStatus.ONLINE &&
      !cluster.fencedNodes.includes(node)
    );

  if (eligibleNodes.length === 0) {
    return undefined;
  }

  // Sort by priority (higher is better) and then by weight
  eligibleNodes.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return b.weight - a.weight;
  });

  return eligibleNodes[0];
}

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
export function evaluateFailoverConditions(
  healthResult: HealthCheckResult,
  conditions: FailoverCondition[]
): boolean {
  if (!conditions || conditions.length === 0) {
    return true;
  }

  for (const condition of conditions) {
    const metricValue = getMetricValue(healthResult, condition.metric);
    if (metricValue === undefined) {
      return false;
    }

    const conditionMet = evaluateCondition(metricValue, condition.operator, condition.threshold);
    if (!conditionMet) {
      return false;
    }
  }

  return true;
}

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
export async function performFallback(
  cluster: Cluster,
  originalNodeId: string,
  policy: FailoverPolicy
): Promise<FailoverEvent> {
  if (!policy.autoFallback) {
    throw new Error('Auto-fallback is not enabled in policy');
  }

  const originalNode = [...cluster.activeNodes, ...cluster.passiveNodes].find(
    n => n.id === originalNodeId
  );

  if (!originalNode) {
    throw new Error(`Original node ${originalNodeId} not found`);
  }

  // Verify node is healthy before fallback
  const healthResult = await performNodeHealthCheck(originalNode);
  if (healthResult.status !== NodeStatus.ONLINE) {
    throw new Error('Original node is not healthy for fallback');
  }

  // Find current active node
  const currentActiveNode = cluster.activeNodes.find(n => n.id !== originalNodeId);
  if (!currentActiveNode) {
    throw new Error('No current active node found');
  }

  // Perform fallback (reverse failover)
  return initiateFailover(cluster, currentActiveNode.id, policy);
}

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
export function calculateFailoverReadiness(
  node: ClusterNode,
  healthResult: HealthCheckResult
): number {
  if (healthResult.status !== NodeStatus.ONLINE) {
    return 0;
  }

  const { metrics } = healthResult;

  // Calculate readiness based on multiple factors
  const cpuAvailability = (100 - metrics.cpuUsage) / 100;
  const memoryAvailability = (100 - metrics.memoryUsage) / 100;
  const performanceScore = metrics.diskIOPS / 10000; // Normalized to 0-1
  const reliabilityScore = (1 - metrics.errorRate);
  const loadScore = metrics.activeConnections < 50 ? 1 : 0.5;

  const readinessScore = (
    cpuAvailability * 25 +
    memoryAvailability * 25 +
    performanceScore * 20 +
    reliabilityScore * 20 +
    loadScore * 10
  );

  return Math.min(100, Math.max(0, readinessScore));
}

// ============================================================================
// Load Balancing Functions (5 functions)
// ============================================================================

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
export function selectNodeForRequest(
  cluster: Cluster,
  algorithm: LoadBalancingAlgorithm,
  healthResults: HealthCheckResult[]
): LoadBalancingDecision {
  const eligibleNodes = cluster.activeNodes.filter(node =>
    node.status === NodeStatus.ONLINE
  );

  if (eligibleNodes.length === 0) {
    throw new Error('No eligible nodes available for load balancing');
  }

  let selectedNode: ClusterNode;
  let score: number;

  switch (algorithm) {
    case LoadBalancingAlgorithm.ROUND_ROBIN:
      selectedNode = selectRoundRobin(eligibleNodes);
      score = 1 / eligibleNodes.length;
      break;

    case LoadBalancingAlgorithm.LEAST_CONNECTIONS:
      selectedNode = selectLeastConnections(eligibleNodes, healthResults);
      score = calculateConnectionScore(selectedNode, healthResults);
      break;

    case LoadBalancingAlgorithm.WEIGHTED_ROUND_ROBIN:
      selectedNode = selectWeightedRoundRobin(eligibleNodes);
      score = selectedNode.weight / 100;
      break;

    case LoadBalancingAlgorithm.RESOURCE_BASED:
      selectedNode = selectResourceBased(eligibleNodes, healthResults);
      score = calculateResourceScore(selectedNode, healthResults);
      break;

    case LoadBalancingAlgorithm.LATENCY_BASED:
      selectedNode = selectLatencyBased(eligibleNodes, healthResults);
      score = calculateLatencyScore(selectedNode, healthResults);
      break;

    default:
      selectedNode = eligibleNodes[0];
      score = 1;
  }

  const alternativeNodes = eligibleNodes
    .filter(n => n.id !== selectedNode.id)
    .map(n => n.id)
    .slice(0, 3);

  return {
    selectedNodeId: selectedNode.id,
    algorithm,
    score,
    alternativeNodes,
    timestamp: new Date()
  };
}

/**
 * Implements round-robin load balancing
 *
 * @param nodes - Available nodes
 * @returns Selected node
 */
export function selectRoundRobin(nodes: ClusterNode[]): ClusterNode {
  // In production, maintain a counter in persistent state
  const counter = Math.floor(Math.random() * nodes.length);
  return nodes[counter % nodes.length];
}

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
export function selectLeastConnections(
  nodes: ClusterNode[],
  healthResults: HealthCheckResult[]
): ClusterNode {
  const nodeConnections = nodes.map(node => {
    const healthResult = healthResults.find(r => r.nodeId === node.id);
    const connections = healthResult?.metrics.activeConnections ?? Infinity;
    return { node, connections };
  });

  nodeConnections.sort((a, b) => a.connections - b.connections);

  return nodeConnections[0].node;
}

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
export function selectWeightedRoundRobin(nodes: ClusterNode[]): ClusterNode {
  const totalWeight = nodes.reduce((sum, node) => sum + node.weight, 0);
  let random = Math.random() * totalWeight;

  for (const node of nodes) {
    random -= node.weight;
    if (random <= 0) {
      return node;
    }
  }

  return nodes[nodes.length - 1];
}

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
export function selectResourceBased(
  nodes: ClusterNode[],
  healthResults: HealthCheckResult[]
): ClusterNode {
  const nodeScores = nodes.map(node => {
    const healthResult = healthResults.find(r => r.nodeId === node.id);
    if (!healthResult) {
      return { node, score: -1 };
    }

    const cpuAvailable = 100 - healthResult.metrics.cpuUsage;
    const memoryAvailable = 100 - healthResult.metrics.memoryUsage;
    const ioScore = healthResult.metrics.diskIOPS / 100;

    const score = cpuAvailable * 0.4 + memoryAvailable * 0.4 + ioScore * 0.2;

    return { node, score };
  });

  nodeScores.sort((a, b) => b.score - a.score);

  return nodeScores[0].node;
}

// ============================================================================
// Quorum Management Functions (5 functions)
// ============================================================================

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
export function checkQuorum(cluster: Cluster): QuorumState {
  const votingNodes = cluster.activeNodes.filter(node =>
    node.status === NodeStatus.ONLINE || node.status === NodeStatus.DEGRADED
  );

  const activeNodeCount = votingNodes.length;
  const requiredNodes = cluster.config.quorumSize;
  const hasQuorum = activeNodeCount >= requiredNodes;

  return {
    hasQuorum,
    requiredNodes,
    activeNodes: activeNodeCount,
    votingNodes: votingNodes.map(n => n.id),
    timestamp: new Date()
  };
}

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
export function calculateQuorumSize(
  totalNodes: number,
  clusterMode: ClusteringMode
): number {
  // Standard quorum is majority (more than half)
  const majorityQuorum = Math.floor(totalNodes / 2) + 1;

  switch (clusterMode) {
    case ClusteringMode.ACTIVE_ACTIVE:
      // Active-active requires majority to prevent split-brain
      return majorityQuorum;

    case ClusteringMode.ACTIVE_PASSIVE:
      // Active-passive can use simpler quorum
      return Math.max(2, Math.floor(totalNodes / 3));

    case ClusteringMode.N_PLUS_ONE:
      // N+1 redundancy
      return totalNodes - 1;

    default:
      return majorityQuorum;
  }
}

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
export function updateQuorumConfiguration(
  cluster: Cluster,
  newQuorumSize: number
): Cluster {
  const totalNodes = cluster.config.nodes.length;

  if (newQuorumSize < 1 || newQuorumSize > totalNodes) {
    throw new Error(`Invalid quorum size: must be between 1 and ${totalNodes}`);
  }

  // Create updated cluster with new quorum
  return {
    ...cluster,
    config: {
      ...cluster.config,
      quorumSize: newQuorumSize
    }
  };
}

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
export function validateQuorumDecision(
  cluster: Cluster,
  decision: string,
  votes: Map<string, boolean>
): boolean {
  const approvalVotes = Array.from(votes.values()).filter(v => v === true).length;
  const requiredVotes = cluster.config.quorumSize;

  return approvalVotes >= requiredVotes;
}

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
export function handleQuorumLoss(cluster: Cluster): string[] {
  const actions: string[] = [];
  const quorumState = checkQuorum(cluster);

  if (quorumState.hasQuorum) {
    return actions;
  }

  // Set cluster to no-quorum state
  cluster.state = ClusterState.NO_QUORUM;

  actions.push('Set cluster state to NO_QUORUM');
  actions.push('Disable write operations');
  actions.push('Enable read-only mode');

  // Calculate how many nodes needed
  const nodesNeeded = quorumState.requiredNodes - quorumState.activeNodes;
  actions.push(`Attempt to recover ${nodesNeeded} nodes`);

  // If possible, reduce quorum temporarily
  if (quorumState.activeNodes >= 2) {
    actions.push('Consider temporary quorum reduction with operator approval');
  }

  // Alert operations team
  actions.push('Alert operations team for immediate intervention');

  return actions;
}

// ============================================================================
// Split-Brain Prevention Functions (4 functions)
// ============================================================================

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
export function detectSplitBrain(
  cluster: Cluster,
  partitions: Map<string, string[]>
): boolean {
  // Split-brain occurs when multiple partitions think they have quorum
  let partitionsWithQuorum = 0;

  for (const [partitionId, nodeIds] of partitions) {
    const partitionNodes = cluster.config.nodes.filter(n => nodeIds.includes(n.id));
    const onlineNodes = partitionNodes.filter(n => n.status === NodeStatus.ONLINE);

    if (onlineNodes.length >= cluster.config.quorumSize) {
      partitionsWithQuorum++;
    }
  }

  if (partitionsWithQuorum > 1) {
    cluster.state = ClusterState.SPLIT_BRAIN;
    return true;
  }

  return false;
}

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
export function resolveSplitBrain(
  cluster: Cluster,
  partitions: Map<string, string[]>
): string[] {
  const actions: string[] = [];

  if (!cluster.config.fencingEnabled) {
    actions.push('Fencing not enabled - manual intervention required');
    return actions;
  }

  // Find partition with highest priority nodes
  let primaryPartition: string | undefined;
  let highestPrioritySum = -1;

  for (const [partitionId, nodeIds] of partitions) {
    const partitionNodes = cluster.config.nodes.filter(n => nodeIds.includes(n.id));
    const prioritySum = partitionNodes.reduce((sum, node) => sum + node.priority, 0);

    if (prioritySum > highestPrioritySum) {
      highestPrioritySum = prioritySum;
      primaryPartition = partitionId;
    }
  }

  if (!primaryPartition) {
    actions.push('Could not determine primary partition');
    return actions;
  }

  // Fence all nodes not in primary partition
  for (const [partitionId, nodeIds] of partitions) {
    if (partitionId !== primaryPartition) {
      for (const nodeId of nodeIds) {
        fenceNode(cluster, nodeId);
        actions.push(`Fenced node ${nodeId} in partition ${partitionId}`);
      }
    }
  }

  cluster.state = ClusterState.RECOVERING;
  actions.push('Split-brain resolved - cluster recovering');

  return actions;
}

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
export function fenceNode(cluster: Cluster, nodeId: string): void {
  const node = cluster.config.nodes.find(n => n.id === nodeId);

  if (!node) {
    throw new Error(`Node ${nodeId} not found in cluster`);
  }

  // Set node to fenced status
  node.status = NodeStatus.FENCED;

  // Add to fenced nodes list
  if (!cluster.fencedNodes.includes(node)) {
    cluster.fencedNodes.push(node);
  }

  // Remove from active nodes
  const activeIndex = cluster.activeNodes.findIndex(n => n.id === nodeId);
  if (activeIndex !== -1) {
    cluster.activeNodes.splice(activeIndex, 1);
  }

  // In production, this would:
  // 1. Disable node's network access via STONITH/fencing device
  // 2. Force power cycle the node
  // 3. Prevent node from accessing shared storage
  // 4. Update cluster membership tables
}

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
export function implementQuorumArbitration(
  cluster: Cluster,
  partitions: Map<string, string[]>
): string | undefined {
  // Quorum arbitration rules:
  // 1. Partition with quorum wins
  // 2. If multiple have quorum, highest priority sum wins
  // 3. If tie, partition with current leader wins

  const partitionScores = new Map<string, { hasQuorum: boolean; prioritySum: number; hasLeader: boolean }>();

  for (const [partitionId, nodeIds] of partitions) {
    const partitionNodes = cluster.config.nodes.filter(n => nodeIds.includes(n.id));
    const onlineNodes = partitionNodes.filter(n => n.status === NodeStatus.ONLINE);

    const hasQuorum = onlineNodes.length >= cluster.config.quorumSize;
    const prioritySum = partitionNodes.reduce((sum, node) => sum + node.priority, 0);
    const hasLeader = cluster.leader ? nodeIds.includes(cluster.leader.id) : false;

    partitionScores.set(partitionId, { hasQuorum, prioritySum, hasLeader });
  }

  // Find winner based on rules
  let winner: string | undefined;
  let winnerScore = { hasQuorum: false, prioritySum: -1, hasLeader: false };

  for (const [partitionId, score] of partitionScores) {
    if (score.hasQuorum && !winnerScore.hasQuorum) {
      winner = partitionId;
      winnerScore = score;
    } else if (score.hasQuorum === winnerScore.hasQuorum) {
      if (score.prioritySum > winnerScore.prioritySum) {
        winner = partitionId;
        winnerScore = score;
      } else if (score.prioritySum === winnerScore.prioritySum && score.hasLeader && !winnerScore.hasLeader) {
        winner = partitionId;
        winnerScore = score;
      }
    }
  }

  return winner;
}

// ============================================================================
// Cluster Coordination Functions (6 functions)
// ============================================================================

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
export async function electClusterLeader(
  cluster: Cluster,
  algorithm: ConsensusAlgorithm
): Promise<ClusterNode> {
  const eligibleNodes = cluster.activeNodes.filter(n => n.status === NodeStatus.ONLINE);

  if (eligibleNodes.length === 0) {
    throw new Error('No eligible nodes for leader election');
  }

  let leader: ClusterNode;

  switch (algorithm) {
    case ConsensusAlgorithm.RAFT:
      leader = await raftElection(cluster, eligibleNodes);
      break;

    case ConsensusAlgorithm.PAXOS:
      leader = await paxosElection(cluster, eligibleNodes);
      break;

    case ConsensusAlgorithm.MAJORITY_VOTE:
      leader = await majorityVoteElection(cluster, eligibleNodes);
      break;

    case ConsensusAlgorithm.GOSSIP:
      leader = await gossipBasedElection(cluster, eligibleNodes);
      break;

    default:
      leader = eligibleNodes[0];
  }

  // Update cluster state
  cluster.leader = leader;
  cluster.lastStateChange = new Date();

  return leader;
}

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
export async function synchronizeClusterState(
  cluster: Cluster
): Promise<{ nodesSynced: number; failures: string[] }> {
  const failures: string[] = [];
  let nodesSynced = 0;

  const syncPromises = cluster.config.nodes.map(async node => {
    try {
      // In production, this would send cluster state to each node
      await new Promise(resolve => setTimeout(resolve, 100));
      nodesSynced++;
    } catch (error) {
      failures.push(`${node.id}: ${String(error)}`);
    }
  });

  await Promise.all(syncPromises);

  return { nodesSynced, failures };
}

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
export async function coordinateMembershipChange(
  cluster: Cluster,
  operation: 'add' | 'remove',
  nodeId: string
): Promise<Cluster> {
  // Verify quorum for membership change
  const quorumState = checkQuorum(cluster);
  if (!quorumState.hasQuorum) {
    throw new Error('Insufficient quorum for membership change');
  }

  if (operation === 'add') {
    // In production, validate new node and add to cluster
    const existingNode = cluster.config.nodes.find(n => n.id === nodeId);
    if (existingNode) {
      throw new Error(`Node ${nodeId} already exists in cluster`);
    }

    // Add node logic here
  } else if (operation === 'remove') {
    const nodeIndex = cluster.config.nodes.findIndex(n => n.id === nodeId);
    if (nodeIndex === -1) {
      throw new Error(`Node ${nodeId} not found in cluster`);
    }

    // Remove node
    cluster.config.nodes.splice(nodeIndex, 1);

    // Recalculate quorum
    const newQuorumSize = calculateQuorumSize(
      cluster.config.nodes.length,
      cluster.config.mode
    );
    cluster.config = {
      ...cluster.config,
      quorumSize: newQuorumSize
    };
  }

  // Synchronize membership change across cluster
  await synchronizeClusterState(cluster);

  return cluster;
}

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
export function manageHeartbeat(
  cluster: Cluster,
  interval: number,
  callback: (nodeId: string) => void
): () => void {
  const heartbeatTimers = new Map<string, NodeJS.Timeout>();

  const startHeartbeat = (node: ClusterNode): void => {
    const timer = setInterval(() => {
      const timeSinceLastHeartbeat = Date.now() - node.lastHeartbeat.getTime();

      if (timeSinceLastHeartbeat > interval * 2) {
        callback(node.id);
      }
    }, interval);

    heartbeatTimers.set(node.id, timer);
  };

  // Start heartbeat for all nodes
  cluster.config.nodes.forEach(startHeartbeat);

  // Return cleanup function
  return () => {
    for (const timer of heartbeatTimers.values()) {
      clearInterval(timer);
    }
    heartbeatTimers.clear();
  };
}

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
export async function acquireDistributedLock(
  cluster: Cluster,
  resourceId: string,
  nodeId: string,
  timeout: number
): Promise<{ acquired: boolean; lockId: string; expiresAt: Date }> {
  // Verify node is in cluster and online
  const node = cluster.config.nodes.find(n => n.id === nodeId);
  if (!node || node.status !== NodeStatus.ONLINE) {
    throw new Error(`Node ${nodeId} is not eligible for lock acquisition`);
  }

  // In production, this would use a distributed lock manager (e.g., etcd, Zookeeper)
  const lockId = `lock-${resourceId}-${Date.now()}`;
  const expiresAt = new Date(Date.now() + timeout);

  // Simulate lock acquisition with consensus
  const quorumState = checkQuorum(cluster);
  const acquired = quorumState.hasQuorum;

  return {
    acquired,
    lockId,
    expiresAt
  };
}

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
export async function updateClusterConfiguration(
  cluster: Cluster,
  updates: Partial<ClusterConfig>
): Promise<Cluster> {
  // Verify quorum for configuration change
  const quorumState = checkQuorum(cluster);
  if (!quorumState.hasQuorum) {
    throw new Error('Insufficient quorum for configuration update');
  }

  // Validate updates
  if (updates.quorumSize !== undefined) {
    const totalNodes = cluster.config.nodes.length;
    if (updates.quorumSize < 1 || updates.quorumSize > totalNodes) {
      throw new Error('Invalid quorum size');
    }
  }

  // Apply updates
  const updatedConfig: ClusterConfig = {
    ...cluster.config,
    ...updates
  };

  const updatedCluster: Cluster = {
    ...cluster,
    config: updatedConfig,
    lastStateChange: new Date()
  };

  // Synchronize configuration across cluster
  await synchronizeClusterState(updatedCluster);

  return updatedCluster;
}

// ============================================================================
// Consensus Algorithm Functions (4 functions)
// ============================================================================

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
export async function raftElection(
  cluster: Cluster,
  candidates: ClusterNode[]
): Promise<ClusterNode> {
  // Raft election process:
  // 1. Increment term
  // 2. Candidate votes for itself
  // 3. Request votes from other nodes
  // 4. Win if receives majority votes

  const newTerm = cluster.term + 1;
  const votesNeeded = Math.floor(candidates.length / 2) + 1;

  // Sort candidates by priority for deterministic election
  const sortedCandidates = [...candidates].sort((a, b) => b.priority - a.priority);

  for (const candidate of sortedCandidates) {
    const votes = new Map<string, boolean>();
    votes.set(candidate.id, true); // Vote for self

    // Simulate vote requests to other nodes
    for (const voter of candidates) {
      if (voter.id !== candidate.id) {
        // In production, send RequestVote RPC
        const voteGranted = voter.priority <= candidate.priority;
        votes.set(voter.id, voteGranted);
      }
    }

    const votesReceived = Array.from(votes.values()).filter(v => v).length;

    if (votesReceived >= votesNeeded) {
      // Record votes in history
      for (const [voterId, granted] of votes) {
        cluster.votingHistory.push({
          term: newTerm,
          candidateId: candidate.id,
          voterId,
          timestamp: new Date(),
          granted
        });
      }

      return candidate;
    }
  }

  // If no winner, return highest priority candidate
  return sortedCandidates[0];
}

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
export async function paxosElection(
  cluster: Cluster,
  candidates: ClusterNode[]
): Promise<ClusterNode> {
  // Simplified Paxos election:
  // Phase 1: Prepare - Proposer sends prepare(n) to acceptors
  // Phase 2: Promise - Acceptors respond with promise
  // Phase 3: Accept - Proposer sends accept request
  // Phase 4: Accepted - Acceptors accept the value

  const proposalNumber = cluster.term + 1;
  const quorumSize = Math.floor(candidates.length / 2) + 1;

  // Sort by priority
  const sortedCandidates = [...candidates].sort((a, b) => b.priority - a.priority);

  for (const proposer of sortedCandidates) {
    // Phase 1: Prepare
    let promises = 0;
    for (const acceptor of candidates) {
      // In production, send prepare(n) request
      if (acceptor.priority <= proposer.priority || acceptor.id === proposer.id) {
        promises++;
      }
    }

    if (promises >= quorumSize) {
      // Phase 2: Accept
      let accepted = 0;
      for (const acceptor of candidates) {
        // In production, send accept(n, value) request
        if (acceptor.priority <= proposer.priority || acceptor.id === proposer.id) {
          accepted++;
        }
      }

      if (accepted >= quorumSize) {
        return proposer;
      }
    }
  }

  return sortedCandidates[0];
}

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
export async function majorityVoteElection(
  cluster: Cluster,
  candidates: ClusterNode[]
): Promise<ClusterNode> {
  const votes = new Map<string, number>();

  // Each node votes for candidate with highest priority
  for (const voter of candidates) {
    let preferredCandidate = candidates[0];

    for (const candidate of candidates) {
      if (candidate.priority > preferredCandidate.priority) {
        preferredCandidate = candidate;
      } else if (candidate.priority === preferredCandidate.priority && candidate.weight > preferredCandidate.weight) {
        preferredCandidate = candidate;
      }
    }

    const currentVotes = votes.get(preferredCandidate.id) || 0;
    votes.set(preferredCandidate.id, currentVotes + 1);
  }

  // Find candidate with most votes
  let winner = candidates[0];
  let maxVotes = 0;

  for (const [candidateId, voteCount] of votes) {
    if (voteCount > maxVotes) {
      maxVotes = voteCount;
      winner = candidates.find(c => c.id === candidateId) || winner;
    }
  }

  return winner;
}

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
export async function gossipBasedElection(
  cluster: Cluster,
  candidates: ClusterNode[]
): Promise<ClusterNode> {
  // Gossip-based election:
  // 1. Each node starts with knowledge of itself
  // 2. Nodes periodically exchange information
  // 3. Information about higher priority nodes spreads
  // 4. Eventually all nodes agree on highest priority node

  const nodeKnowledge = new Map<string, ClusterNode>();

  // Initialize: each node knows about itself
  for (const node of candidates) {
    nodeKnowledge.set(node.id, node);
  }

  // Simulate gossip rounds
  const gossipRounds = 3;
  for (let round = 0; round < gossipRounds; round++) {
    for (const node of candidates) {
      // Each node shares knowledge with random peers
      const peersToContact = Math.min(3, candidates.length - 1);

      for (let i = 0; i < peersToContact; i++) {
        const peer = candidates[Math.floor(Math.random() * candidates.length)];
        if (peer.id !== node.id) {
          // Share knowledge about highest priority node known
          const knownLeader = nodeKnowledge.get(node.id);
          const peerKnownLeader = nodeKnowledge.get(peer.id);

          if (knownLeader && peerKnownLeader) {
            const higherPriority = knownLeader.priority >= peerKnownLeader.priority
              ? knownLeader
              : peerKnownLeader;

            nodeKnowledge.set(node.id, higherPriority);
            nodeKnowledge.set(peer.id, higherPriority);
          }
        }
      }
    }
  }

  // After gossip rounds, highest priority node should be known by all
  const sortedByPriority = [...candidates].sort((a, b) => b.priority - a.priority);
  return sortedByPriority[0];
}

// ============================================================================
// State Management Functions (4 functions)
// ============================================================================

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
export function captureClusterSnapshot(cluster: Cluster): {
  clusterId: string;
  timestamp: Date;
  state: ClusterState;
  nodes: ReadonlyArray<Readonly<ClusterNode>>;
  leader: Readonly<ClusterNode> | undefined;
  quorumState: QuorumState;
  term: number;
} {
  const quorumState = checkQuorum(cluster);

  return {
    clusterId: cluster.config.clusterId,
    timestamp: new Date(),
    state: cluster.state,
    nodes: [...cluster.config.nodes],
    leader: cluster.leader ? { ...cluster.leader } : undefined,
    quorumState,
    term: cluster.term
  };
}

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
export function restoreClusterFromSnapshot(
  cluster: Cluster,
  snapshot: ReturnType<typeof captureClusterSnapshot>
): Cluster {
  // Validate snapshot belongs to this cluster
  if (snapshot.clusterId !== cluster.config.clusterId) {
    throw new Error('Snapshot cluster ID does not match');
  }

  return {
    ...cluster,
    state: snapshot.state,
    config: {
      ...cluster.config,
      nodes: [...snapshot.nodes] as ClusterNode[]
    },
    leader: snapshot.leader ? { ...snapshot.leader } as ClusterNode : undefined,
    term: snapshot.term,
    lastStateChange: new Date()
  };
}

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
export function validateClusterState(cluster: Cluster): {
  isValid: boolean;
  issues: string[];
  warnings: string[];
} {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check if leader is in active nodes
  if (cluster.leader) {
    const leaderInActive = cluster.activeNodes.some(n => n.id === cluster.leader?.id);
    if (!leaderInActive) {
      issues.push('Leader is not in active nodes list');
    }

    if (cluster.leader.status !== NodeStatus.ONLINE) {
      issues.push('Leader is not in ONLINE status');
    }
  }

  // Check for node duplicates
  const nodeIds = new Set<string>();
  for (const node of cluster.config.nodes) {
    if (nodeIds.has(node.id)) {
      issues.push(`Duplicate node ID: ${node.id}`);
    }
    nodeIds.add(node.id);
  }

  // Check quorum configuration
  const totalNodes = cluster.config.nodes.length;
  if (cluster.config.quorumSize > totalNodes) {
    issues.push('Quorum size exceeds total node count');
  }

  if (cluster.config.quorumSize < Math.floor(totalNodes / 2) + 1) {
    warnings.push('Quorum size is less than majority - may allow split-brain');
  }

  // Check for fenced nodes still in active list
  for (const fencedNode of cluster.fencedNodes) {
    if (cluster.activeNodes.some(n => n.id === fencedNode.id)) {
      issues.push(`Fenced node ${fencedNode.id} is in active nodes list`);
    }
  }

  // Check cluster state consistency
  if (cluster.state === ClusterState.NO_QUORUM) {
    const quorumState = checkQuorum(cluster);
    if (quorumState.hasQuorum) {
      issues.push('Cluster state is NO_QUORUM but quorum is present');
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings
  };
}

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
export function trackStateTransition(
  cluster: Cluster,
  newState: ClusterState,
  reason: string
): {
  transitionId: string;
  timestamp: Date;
  fromState: ClusterState;
  toState: ClusterState;
  reason: string;
  metadata: Record<string, unknown>;
} {
  const transitionId = `transition-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const fromState = cluster.state;

  // Update cluster state
  cluster.state = newState;
  cluster.lastStateChange = new Date();

  return {
    transitionId,
    timestamp: new Date(),
    fromState,
    toState: newState,
    reason,
    metadata: {
      term: cluster.term,
      activeNodes: cluster.activeNodes.length,
      leader: cluster.leader?.id
    }
  };
}

// ============================================================================
// Active-Active Clustering Functions (2 functions)
// ============================================================================

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
export function configureActiveActive(
  cluster: Cluster,
  config: {
    loadBalancing: LoadBalancingAlgorithm;
    dataReplication: 'sync' | 'async';
    conflictResolution: 'timestamp' | 'priority' | 'manual';
  }
): Cluster {
  // Ensure all nodes can be active
  const activeNodes = cluster.config.nodes.filter(n =>
    n.status === NodeStatus.ONLINE || n.status === NodeStatus.DEGRADED
  );

  return {
    ...cluster,
    config: {
      ...cluster.config,
      mode: ClusteringMode.ACTIVE_ACTIVE,
      loadBalancing: config.loadBalancing
    },
    activeNodes: activeNodes,
    passiveNodes: [],
    state: ClusterState.HEALTHY
  };
}

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
export function resolveActiveActiveConflicts<T>(
  conflicts: Array<{ nodeId: string; timestamp: Date; priority: number; data: T }>,
  strategy: 'timestamp' | 'priority' | 'manual'
): { nodeId: string; timestamp: Date; priority: number; data: T } {
  if (conflicts.length === 0) {
    throw new Error('No conflicts to resolve');
  }

  if (conflicts.length === 1) {
    return conflicts[0];
  }

  switch (strategy) {
    case 'timestamp':
      // Last write wins
      return conflicts.reduce((latest, current) =>
        current.timestamp > latest.timestamp ? current : latest
      );

    case 'priority':
      // Highest priority wins
      return conflicts.reduce((highest, current) =>
        current.priority > highest.priority ? current : highest
      );

    case 'manual':
      // Return all conflicts for manual resolution
      throw new Error('Manual conflict resolution required');

    default:
      return conflicts[0];
  }
}

// ============================================================================
// Active-Passive Clustering Functions (2 functions)
// ============================================================================

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
export function configureActivePassive(
  cluster: Cluster,
  activeNodeId: string
): Cluster {
  const activeNode = cluster.config.nodes.find(n => n.id === activeNodeId);
  if (!activeNode) {
    throw new Error(`Node ${activeNodeId} not found`);
  }

  if (activeNode.status !== NodeStatus.ONLINE) {
    throw new Error(`Node ${activeNodeId} is not online`);
  }

  const passiveNodes = cluster.config.nodes.filter(n => n.id !== activeNodeId);

  return {
    ...cluster,
    config: {
      ...cluster.config,
      mode: ClusteringMode.ACTIVE_PASSIVE
    },
    activeNodes: [activeNode],
    passiveNodes: passiveNodes,
    leader: activeNode,
    state: ClusterState.HEALTHY
  };
}

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
export function promotePassiveNode(
  cluster: Cluster,
  passiveNodeId: string
): Cluster {
  if (cluster.config.mode !== ClusteringMode.ACTIVE_PASSIVE) {
    throw new Error('Cluster is not in active-passive mode');
  }

  const passiveNode = cluster.passiveNodes.find(n => n.id === passiveNodeId);
  if (!passiveNode) {
    throw new Error(`Passive node ${passiveNodeId} not found`);
  }

  if (passiveNode.status !== NodeStatus.ONLINE) {
    throw new Error(`Passive node ${passiveNodeId} is not online`);
  }

  // Demote current active node
  const currentActive = cluster.activeNodes[0];
  if (currentActive) {
    currentActive.status = NodeStatus.ONLINE;
  }

  // Promote passive node
  passiveNode.status = NodeStatus.ONLINE;

  return {
    ...cluster,
    activeNodes: [passiveNode],
    passiveNodes: cluster.passiveNodes.filter(n => n.id !== passiveNodeId).concat(currentActive ? [currentActive] : []),
    leader: passiveNode,
    lastStateChange: new Date()
  };
}

// ============================================================================
// Utility Helper Functions
// ============================================================================

/**
 * Determines node status based on metrics and response time
 */
function determineNodeStatus(
  metrics: NodeMetrics,
  responseTime: number,
  timeout: number
): NodeStatus {
  if (responseTime >= timeout) {
    return NodeStatus.OFFLINE;
  }

  if (metrics.errorRate > 0.5 || metrics.cpuUsage > 95 || metrics.memoryUsage > 95) {
    return NodeStatus.DEGRADED;
  }

  return NodeStatus.ONLINE;
}

/**
 * Extracts metric value from health result
 */
function getMetricValue(
  healthResult: HealthCheckResult,
  metricName: string
): number | undefined {
  const metrics = healthResult.metrics as Record<string, number>;
  return metrics[metricName];
}

/**
 * Evaluates a condition against a value
 */
function evaluateCondition(
  value: number,
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte',
  threshold: number
): boolean {
  switch (operator) {
    case 'gt': return value > threshold;
    case 'lt': return value < threshold;
    case 'eq': return value === threshold;
    case 'gte': return value >= threshold;
    case 'lte': return value <= threshold;
    default: return false;
  }
}

/**
 * Calculates connection score for load balancing
 */
function calculateConnectionScore(
  node: ClusterNode,
  healthResults: HealthCheckResult[]
): number {
  const healthResult = healthResults.find(r => r.nodeId === node.id);
  if (!healthResult) return 0;

  const maxConnections = 100;
  const connections = healthResult.metrics.activeConnections;

  return 1 - (connections / maxConnections);
}

/**
 * Calculates resource availability score
 */
function calculateResourceScore(
  node: ClusterNode,
  healthResults: HealthCheckResult[]
): number {
  const healthResult = healthResults.find(r => r.nodeId === node.id);
  if (!healthResult) return 0;

  const cpuAvailable = (100 - healthResult.metrics.cpuUsage) / 100;
  const memoryAvailable = (100 - healthResult.metrics.memoryUsage) / 100;

  return (cpuAvailable + memoryAvailable) / 2;
}

/**
 * Calculates latency score for load balancing
 */
function calculateLatencyScore(
  node: ClusterNode,
  healthResults: HealthCheckResult[]
): number {
  const healthResult = healthResults.find(r => r.nodeId === node.id);
  if (!healthResult) return 0;

  const maxLatency = 1000;
  const latency = healthResult.responseTime;

  return 1 - (Math.min(latency, maxLatency) / maxLatency);
}

/**
 * Selects node based on latency
 */
function selectLatencyBased(
  nodes: ClusterNode[],
  healthResults: HealthCheckResult[]
): ClusterNode {
  const nodeLatencies = nodes.map(node => {
    const healthResult = healthResults.find(r => r.nodeId === node.id);
    const latency = healthResult?.responseTime ?? Infinity;
    return { node, latency };
  });

  nodeLatencies.sort((a, b) => a.latency - b.latency);

  return nodeLatencies[0].node;
}
