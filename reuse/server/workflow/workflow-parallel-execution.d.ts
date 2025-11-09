/**
 * LOC: WF-PAR-001
 * File: /reuse/server/workflow/workflow-parallel-execution.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/swagger (v11.2.1)
 *   - class-validator (v0.14.2)
 *   - class-transformer (v0.5.1)
 *   - rxjs (v7.8.1)
 *
 * DOWNSTREAM (imported by):
 *   - Workflow orchestration services
 *   - Process automation controllers
 *   - Parallel task execution modules
 *   - Workflow engine services
 */
import { Observable } from 'rxjs';
/**
 * Parallel gateway split types
 */
export declare enum ParallelSplitType {
    AND = "AND",// All branches execute
    OR = "OR",// At least one branch executes
    CONDITIONAL = "CONDITIONAL"
}
/**
 * Parallel join types
 */
export declare enum ParallelJoinType {
    ALL = "ALL",// Wait for all branches
    ANY = "ANY",// Wait for any branch
    N_OF_M = "N_OF_M",// Wait for N out of M branches
    MAJORITY = "MAJORITY",// Wait for majority of branches
    TIMEOUT = "TIMEOUT"
}
/**
 * Branch execution status
 */
export declare enum BranchStatus {
    PENDING = "PENDING",
    RUNNING = "RUNNING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    TIMEOUT = "TIMEOUT"
}
/**
 * Parallel gateway state
 */
export declare enum GatewayState {
    IDLE = "IDLE",
    SPLITTING = "SPLITTING",
    EXECUTING = "EXECUTING",
    SYNCHRONIZING = "SYNCHRONIZING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
/**
 * Resource allocation strategy
 */
export declare enum ResourceAllocationStrategy {
    FAIR = "FAIR",// Equal resources to all branches
    PRIORITY = "PRIORITY",// Based on branch priority
    DYNAMIC = "DYNAMIC",// Based on runtime metrics
    RESERVED = "RESERVED"
}
/**
 * Parallel gateway configuration DTO
 */
export declare class ParallelGatewayConfigDto {
    gatewayId: string;
    name: string;
    splitType: ParallelSplitType;
    joinType: ParallelJoinType;
    maxConcurrentBranches?: number;
    joinTimeoutMs?: number;
    requiredCompletions?: number;
    allowPartialJoin?: boolean;
    resourceStrategy?: ResourceAllocationStrategy;
    metadata?: Record<string, any>;
}
/**
 * Parallel branch definition DTO
 */
export declare class ParallelBranchDto {
    branchId: string;
    name: string;
    priority?: number;
    condition?: string;
    timeoutMs?: number;
    resources?: Record<string, number>;
    config?: Record<string, any>;
    retryOnFailure?: boolean;
    maxRetries?: number;
}
/**
 * Branch execution context
 */
export interface BranchExecutionContext {
    branchId: string;
    gatewayId: string;
    instanceId: string;
    startTime: Date;
    data: Record<string, any>;
    variables: Record<string, any>;
    parentContext?: Record<string, any>;
}
/**
 * Branch execution result
 */
export interface BranchExecutionResult {
    branchId: string;
    status: BranchStatus;
    result?: any;
    error?: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    metrics?: BranchMetrics;
}
/**
 * Branch execution metrics
 */
export interface BranchMetrics {
    executionTime: number;
    resourceUsage: Record<string, number>;
    throughput?: number;
    errorCount?: number;
    retryCount?: number;
}
/**
 * Parallel gateway instance
 */
export interface ParallelGatewayInstance {
    instanceId: string;
    gatewayId: string;
    state: GatewayState;
    splitTime?: Date;
    joinTime?: Date;
    branches: Map<string, BranchExecutionResult>;
    totalBranches: number;
    completedBranches: number;
    failedBranches: number;
    tokens: Map<string, ParallelToken>;
    resources: ResourcePool;
    metadata?: Record<string, any>;
}
/**
 * Parallel execution token
 */
export interface ParallelToken {
    tokenId: string;
    branchId: string;
    gatewayId: string;
    createdAt: Date;
    arrivedAt?: Date;
    status: 'ACTIVE' | 'CONSUMED' | 'EXPIRED';
    data?: Record<string, any>;
}
/**
 * Resource pool for parallel execution
 */
export interface ResourcePool {
    poolId: string;
    totalCapacity: Record<string, number>;
    availableCapacity: Record<string, number>;
    allocations: Map<string, Record<string, number>>;
    strategy: ResourceAllocationStrategy;
}
/**
 * Thread pool configuration
 */
export interface ThreadPoolConfig {
    minThreads: number;
    maxThreads: number;
    queueSize: number;
    keepAliveMs: number;
    rejectPolicy: 'ABORT' | 'CALLER_RUNS' | 'DISCARD' | 'DISCARD_OLDEST';
}
/**
 * Parallel execution monitor
 */
export interface ParallelExecutionMonitor {
    gatewayId: string;
    instanceId: string;
    activeBranches: number;
    completedBranches: number;
    failedBranches: number;
    averageExecutionTime: number;
    resourceUtilization: Record<string, number>;
    throughput: number;
    lastUpdate: Date;
}
/**
 * 1. Creates a parallel gateway split operation
 *
 * @param {ParallelGatewayConfigDto} config - Gateway configuration
 * @param {ParallelBranchDto[]} branches - Branches to execute
 * @returns {Promise<ParallelGatewayInstance>} Gateway instance
 *
 * @example
 * ```typescript
 * const gateway = await createParallelGateway(config, branches);
 * console.log(`Created gateway ${gateway.instanceId} with ${gateway.totalBranches} branches`);
 * ```
 */
export declare function createParallelGateway(config: ParallelGatewayConfigDto, branches: ParallelBranchDto[]): Promise<ParallelGatewayInstance>;
/**
 * 2. Executes AND split - all branches execute in parallel
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {ParallelBranchDto[]} branches - Branches to split
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<Map<string, BranchExecutionContext>>} Branch contexts
 *
 * @example
 * ```typescript
 * const contexts = await executeAndSplit(instance, branches, { patientId: '123' });
 * console.log(`Started ${contexts.size} parallel branches`);
 * ```
 */
export declare function executeAndSplit(instance: ParallelGatewayInstance, branches: ParallelBranchDto[], context: Record<string, any>): Promise<Map<string, BranchExecutionContext>>;
/**
 * 3. Executes OR split - at least one branch must execute
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {ParallelBranchDto[]} branches - Branches to evaluate
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<Map<string, BranchExecutionContext>>} Selected branch contexts
 *
 * @example
 * ```typescript
 * const contexts = await executeOrSplit(instance, branches, { urgency: 'high' });
 * console.log(`Selected ${contexts.size} branches for execution`);
 * ```
 */
export declare function executeOrSplit(instance: ParallelGatewayInstance, branches: ParallelBranchDto[], context: Record<string, any>): Promise<Map<string, BranchExecutionContext>>;
/**
 * 4. Executes conditional split - branches based on conditions
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {ParallelBranchDto[]} branches - Branches with conditions
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<Map<string, BranchExecutionContext>>} Active branch contexts
 *
 * @example
 * ```typescript
 * const contexts = await executeConditionalSplit(instance, branches, context);
 * console.log(`Activated ${contexts.size} conditional branches`);
 * ```
 */
export declare function executeConditionalSplit(instance: ParallelGatewayInstance, branches: ParallelBranchDto[], context: Record<string, any>): Promise<Map<string, BranchExecutionContext>>;
/**
 * 5. Evaluates branch activation condition
 *
 * @param {string} condition - Condition expression
 * @param {Record<string, any>} context - Evaluation context
 * @returns {boolean} Whether condition is met
 *
 * @example
 * ```typescript
 * const shouldActivate = evaluateCondition('priority > 5', { priority: 8 });
 * console.log(`Branch activation: ${shouldActivate}`);
 * ```
 */
export declare function evaluateCondition(condition: string, context: Record<string, any>): boolean;
/**
 * 6. Creates parallel branch execution context
 *
 * @param {ParallelBranchDto} branch - Branch definition
 * @param {string} instanceId - Gateway instance ID
 * @param {Record<string, any>} parentContext - Parent context
 * @returns {BranchExecutionContext} Branch context
 *
 * @example
 * ```typescript
 * const context = createBranchContext(branch, instanceId, parentData);
 * console.log(`Created context for branch ${context.branchId}`);
 * ```
 */
export declare function createBranchContext(branch: ParallelBranchDto, instanceId: string, parentContext: Record<string, any>): BranchExecutionContext;
/**
 * 7. Prioritizes branch execution order
 *
 * @param {ParallelBranchDto[]} branches - Branches to prioritize
 * @returns {ParallelBranchDto[]} Sorted branches by priority
 *
 * @example
 * ```typescript
 * const sorted = prioritizeBranches(branches);
 * console.log(`Highest priority: ${sorted[0].name}`);
 * ```
 */
export declare function prioritizeBranches(branches: ParallelBranchDto[]): ParallelBranchDto[];
/**
 * 8. Creates isolated execution scope for branch
 *
 * @param {BranchExecutionContext} context - Branch context
 * @returns {Record<string, any>} Isolated scope
 *
 * @example
 * ```typescript
 * const scope = createIsolatedScope(context);
 * scope.localVar = 'value'; // Doesn't affect parent
 * ```
 */
export declare function createIsolatedScope(context: BranchExecutionContext): Record<string, any>;
/**
 * 9. Clones branch for retry execution
 *
 * @param {ParallelBranchDto} branch - Original branch
 * @param {number} attemptNumber - Retry attempt number
 * @returns {ParallelBranchDto} Cloned branch
 *
 * @example
 * ```typescript
 * const retryBranch = cloneBranchForRetry(failedBranch, 2);
 * console.log(`Created retry attempt ${attemptNumber}`);
 * ```
 */
export declare function cloneBranchForRetry(branch: ParallelBranchDto, attemptNumber: number): ParallelBranchDto;
/**
 * 10. Validates branch configuration
 *
 * @param {ParallelBranchDto} branch - Branch to validate
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * ```typescript
 * validateBranchConfig(branch); // Throws if invalid
 * ```
 */
export declare function validateBranchConfig(branch: ParallelBranchDto): void;
/**
 * 11. Executes branches concurrently with thread pool
 *
 * @param {ParallelBranchDto[]} branches - Branches to execute
 * @param {BranchExecutionContext[]} contexts - Execution contexts
 * @param {ThreadPoolConfig} poolConfig - Thread pool configuration
 * @returns {Promise<BranchExecutionResult[]>} Execution results
 *
 * @example
 * ```typescript
 * const results = await executeConcurrent(branches, contexts, poolConfig);
 * console.log(`Completed ${results.length} branches`);
 * ```
 */
export declare function executeConcurrent(branches: ParallelBranchDto[], contexts: BranchExecutionContext[], poolConfig: ThreadPoolConfig): Promise<BranchExecutionResult[]>;
/**
 * 12. Executes single branch with timeout
 *
 * @param {ParallelBranchDto} branch - Branch to execute
 * @param {BranchExecutionContext} context - Execution context
 * @returns {Promise<BranchExecutionResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await executeBranch(branch, context);
 * console.log(`Branch ${result.branchId}: ${result.status}`);
 * ```
 */
export declare function executeBranch(branch: ParallelBranchDto, context: BranchExecutionContext): Promise<BranchExecutionResult>;
/**
 * 13. Executes branch business logic
 *
 * @param {ParallelBranchDto} branch - Branch definition
 * @param {BranchExecutionContext} context - Execution context
 * @returns {Promise<any>} Branch result
 *
 * @example
 * ```typescript
 * const result = await executeBranchLogic(branch, context);
 * console.log(`Branch completed with result:`, result);
 * ```
 */
export declare function executeBranchLogic(branch: ParallelBranchDto, context: BranchExecutionContext): Promise<any>;
/**
 * 14. Creates timeout promise
 *
 * @param {number} ms - Timeout duration in milliseconds
 * @returns {Promise<never>} Rejection promise
 *
 * @example
 * ```typescript
 * await Promise.race([operation(), createTimeout(5000)]);
 * ```
 */
export declare function createTimeout(ms: number): Promise<never>;
/**
 * 15. Monitors concurrent execution progress
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {ParallelExecutionMonitor} Execution monitor
 *
 * @example
 * ```typescript
 * const monitor = monitorConcurrentExecution(instance);
 * console.log(`Active: ${monitor.activeBranches}, Completed: ${monitor.completedBranches}`);
 * ```
 */
export declare function monitorConcurrentExecution(instance: ParallelGatewayInstance): ParallelExecutionMonitor;
/**
 * 16. Waits for all branches to complete (AND join)
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {number} timeoutMs - Join timeout
 * @returns {Promise<boolean>} Whether all branches completed
 *
 * @example
 * ```typescript
 * const allCompleted = await waitForAllBranches(instance, 60000);
 * console.log(`All branches completed: ${allCompleted}`);
 * ```
 */
export declare function waitForAllBranches(instance: ParallelGatewayInstance, timeoutMs: number): Promise<boolean>;
/**
 * 17. Waits for any branch to complete (OR join)
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {number} timeoutMs - Join timeout
 * @returns {Promise<BranchExecutionResult | null>} First completed branch
 *
 * @example
 * ```typescript
 * const first = await waitForAnyBranch(instance, 30000);
 * console.log(`First completion: ${first?.branchId}`);
 * ```
 */
export declare function waitForAnyBranch(instance: ParallelGatewayInstance, timeoutMs: number): Promise<BranchExecutionResult | null>;
/**
 * 18. Waits for N out of M branches to complete
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {number} requiredCompletions - Required number of completions
 * @param {number} timeoutMs - Join timeout
 * @returns {Promise<boolean>} Whether requirement met
 *
 * @example
 * ```typescript
 * const met = await waitForNOfM(instance, 3, 60000);
 * console.log(`3 out of ${instance.totalBranches} completed: ${met}`);
 * ```
 */
export declare function waitForNOfM(instance: ParallelGatewayInstance, requiredCompletions: number, timeoutMs: number): Promise<boolean>;
/**
 * 19. Waits for majority of branches to complete
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {number} timeoutMs - Join timeout
 * @returns {Promise<boolean>} Whether majority completed
 *
 * @example
 * ```typescript
 * const majority = await waitForMajority(instance, 60000);
 * console.log(`Majority completed: ${majority}`);
 * ```
 */
export declare function waitForMajority(instance: ParallelGatewayInstance, timeoutMs: number): Promise<boolean>;
/**
 * 20. Executes gateway join with timeout
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {ParallelJoinType} joinType - Join strategy
 * @param {number} timeoutMs - Join timeout
 * @param {number} requiredCompletions - For N_OF_M join
 * @returns {Promise<boolean>} Whether join succeeded
 *
 * @example
 * ```typescript
 * const success = await executeGatewayJoin(instance, ParallelJoinType.ALL, 60000);
 * console.log(`Join ${success ? 'succeeded' : 'failed'}`);
 * ```
 */
export declare function executeGatewayJoin(instance: ParallelGatewayInstance, joinType: ParallelJoinType, timeoutMs: number, requiredCompletions?: number): Promise<boolean>;
/**
 * 21. Creates synchronization token for branch
 *
 * @param {string} branchId - Branch identifier
 * @param {string} gatewayId - Gateway identifier
 * @returns {ParallelToken} Synchronization token
 *
 * @example
 * ```typescript
 * const token = createParallelToken(branchId, gatewayId);
 * console.log(`Token ${token.tokenId} created for branch ${branchId}`);
 * ```
 */
export declare function createParallelToken(branchId: string, gatewayId: string): ParallelToken;
/**
 * 22. Consumes token on branch completion
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {string} branchId - Branch identifier
 * @returns {ParallelToken | null} Consumed token
 *
 * @example
 * ```typescript
 * const token = consumeToken(instance, branchId);
 * console.log(`Token consumed for branch ${branchId}`);
 * ```
 */
export declare function consumeToken(instance: ParallelGatewayInstance, branchId: string): ParallelToken | null;
/**
 * 23. Counts active tokens at gateway
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {number} Number of active tokens
 *
 * @example
 * ```typescript
 * const active = countActiveTokens(instance);
 * console.log(`${active} tokens waiting at gateway`);
 * ```
 */
export declare function countActiveTokens(instance: ParallelGatewayInstance): number;
/**
 * 24. Counts consumed tokens at gateway
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {number} Number of consumed tokens
 *
 * @example
 * ```typescript
 * const consumed = countConsumedTokens(instance);
 * console.log(`${consumed} branches have arrived`);
 * ```
 */
export declare function countConsumedTokens(instance: ParallelGatewayInstance): number;
/**
 * 25. Synchronizes branch completion
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {BranchExecutionResult} result - Branch execution result
 *
 * @example
 * ```typescript
 * synchronizeBranchCompletion(instance, result);
 * console.log(`Branch ${result.branchId} synchronized`);
 * ```
 */
export declare function synchronizeBranchCompletion(instance: ParallelGatewayInstance, result: BranchExecutionResult): void;
/**
 * 26. Tracks branch execution progress
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {string} branchId - Branch identifier
 * @param {BranchStatus} status - Current status
 *
 * @example
 * ```typescript
 * trackBranchProgress(instance, branchId, BranchStatus.RUNNING);
 * ```
 */
export declare function trackBranchProgress(instance: ParallelGatewayInstance, branchId: string, status: BranchStatus): void;
/**
 * 27. Gets completion percentage
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {number} Completion percentage (0-100)
 *
 * @example
 * ```typescript
 * const pct = getCompletionPercentage(instance);
 * console.log(`${pct}% complete`);
 * ```
 */
export declare function getCompletionPercentage(instance: ParallelGatewayInstance): number;
/**
 * 28. Gets pending branches
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {BranchExecutionResult[]} Pending branches
 *
 * @example
 * ```typescript
 * const pending = getPendingBranches(instance);
 * console.log(`${pending.length} branches still pending`);
 * ```
 */
export declare function getPendingBranches(instance: ParallelGatewayInstance): BranchExecutionResult[];
/**
 * 29. Gets failed branches
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {BranchExecutionResult[]} Failed branches
 *
 * @example
 * ```typescript
 * const failed = getFailedBranches(instance);
 * console.log(`${failed.length} branches failed`);
 * ```
 */
export declare function getFailedBranches(instance: ParallelGatewayInstance): BranchExecutionResult[];
/**
 * 30. Checks if all branches completed successfully
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {boolean} Whether all succeeded
 *
 * @example
 * ```typescript
 * const allSuccess = areAllBranchesSuccessful(instance);
 * console.log(`All successful: ${allSuccess}`);
 * ```
 */
export declare function areAllBranchesSuccessful(instance: ParallelGatewayInstance): boolean;
/**
 * 31. Handles partial join on timeout
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {boolean} allowPartial - Whether to allow partial join
 * @returns {boolean} Whether partial join succeeded
 *
 * @example
 * ```typescript
 * const success = handlePartialJoin(instance, true);
 * console.log(`Partial join: ${success}`);
 * ```
 */
export declare function handlePartialJoin(instance: ParallelGatewayInstance, allowPartial: boolean): boolean;
/**
 * 32. Collects results from completed branches
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {Record<string, any>} Branch results map
 *
 * @example
 * ```typescript
 * const results = collectCompletedResults(instance);
 * console.log(`Collected ${Object.keys(results).length} results`);
 * ```
 */
export declare function collectCompletedResults(instance: ParallelGatewayInstance): Record<string, any>;
/**
 * 33. Merges results from parallel branches
 *
 * @param {Record<string, any>} results - Branch results
 * @param {string} strategy - Merge strategy
 * @returns {Record<string, any>} Merged result
 *
 * @example
 * ```typescript
 * const merged = mergeParallelResults(results, 'concat');
 * console.log('Merged results:', merged);
 * ```
 */
export declare function mergeParallelResults(results: Record<string, any>, strategy?: 'concat' | 'merge' | 'first' | 'last'): Record<string, any>;
/**
 * 34. Handles incomplete branches on timeout
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {BranchExecutionResult[]} Incomplete branches
 *
 * @example
 * ```typescript
 * const incomplete = handleIncompleteBranches(instance);
 * console.log(`${incomplete.length} branches incomplete`);
 * ```
 */
export declare function handleIncompleteBranches(instance: ParallelGatewayInstance): BranchExecutionResult[];
/**
 * 35. Creates partial completion report
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {object} Partial completion report
 *
 * @example
 * ```typescript
 * const report = createPartialCompletionReport(instance);
 * console.log(`Completion: ${report.completionRate}%`);
 * ```
 */
export declare function createPartialCompletionReport(instance: ParallelGatewayInstance): {
    totalBranches: number;
    completedBranches: number;
    failedBranches: number;
    incompleteBranches: number;
    completionRate: number;
    successRate: number;
};
/**
 * 36. Creates resource pool for parallel execution
 *
 * @param {ResourceAllocationStrategy} strategy - Allocation strategy
 * @returns {ResourcePool} Resource pool
 *
 * @example
 * ```typescript
 * const pool = createResourcePool(ResourceAllocationStrategy.FAIR);
 * console.log(`Created resource pool with ${strategy} allocation`);
 * ```
 */
export declare function createResourcePool(strategy: ResourceAllocationStrategy): ResourcePool;
/**
 * 37. Allocates resources to branch
 *
 * @param {ResourcePool} pool - Resource pool
 * @param {string} branchId - Branch identifier
 * @param {Record<string, number>} required - Required resources
 * @returns {boolean} Whether allocation succeeded
 *
 * @example
 * ```typescript
 * const allocated = allocateResources(pool, branchId, { cpu: 20, memory: 256 });
 * console.log(`Resources allocated: ${allocated}`);
 * ```
 */
export declare function allocateResources(pool: ResourcePool, branchId: string, required: Record<string, number>): boolean;
/**
 * 38. Releases resources from completed branch
 *
 * @param {ResourcePool} pool - Resource pool
 * @param {string} branchId - Branch identifier
 *
 * @example
 * ```typescript
 * releaseResources(pool, branchId);
 * console.log(`Resources released for branch ${branchId}`);
 * ```
 */
export declare function releaseResources(pool: ResourcePool, branchId: string): void;
/**
 * 39. Calculates resource utilization
 *
 * @param {ResourcePool} pool - Resource pool
 * @returns {Record<string, number>} Utilization percentages
 *
 * @example
 * ```typescript
 * const util = calculateResourceUtilization(pool);
 * console.log(`CPU: ${util.cpu}%, Memory: ${util.memory}%`);
 * ```
 */
export declare function calculateResourceUtilization(pool: ResourcePool): Record<string, number>;
/**
 * 40. Optimizes resource allocation
 *
 * @param {ResourcePool} pool - Resource pool
 * @param {ParallelBranchDto[]} branches - Branches to optimize
 * @returns {Map<string, Record<string, number>>} Optimized allocations
 *
 * @example
 * ```typescript
 * const allocations = optimizeResourceAllocation(pool, branches);
 * console.log(`Optimized allocations for ${branches.length} branches`);
 * ```
 */
export declare function optimizeResourceAllocation(pool: ResourcePool, branches: ParallelBranchDto[]): Map<string, Record<string, number>>;
/**
 * 41. Calculates throughput metrics
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {number} Branches per second
 *
 * @example
 * ```typescript
 * const throughput = calculateThroughput(instance);
 * console.log(`Throughput: ${throughput} branches/sec`);
 * ```
 */
export declare function calculateThroughput(instance: ParallelGatewayInstance): number;
/**
 * 42. Calculates branch metrics
 *
 * @param {Date} startTime - Branch start time
 * @param {Date} endTime - Branch end time
 * @param {BranchExecutionContext} context - Execution context
 * @returns {BranchMetrics} Branch metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateBranchMetrics(start, end, context);
 * console.log(`Execution time: ${metrics.executionTime}ms`);
 * ```
 */
export declare function calculateBranchMetrics(startTime: Date, endTime: Date, context: BranchExecutionContext): BranchMetrics;
/**
 * 43. Creates execution timeline
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {object[]} Timeline events
 *
 * @example
 * ```typescript
 * const timeline = createExecutionTimeline(instance);
 * console.log(`Timeline has ${timeline.length} events`);
 * ```
 */
export declare function createExecutionTimeline(instance: ParallelGatewayInstance): Array<{
    timestamp: Date;
    event: string;
    branchId?: string;
    details?: any;
}>;
/**
 * 44. Generates execution report
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {object} Detailed execution report
 *
 * @example
 * ```typescript
 * const report = generateExecutionReport(instance);
 * console.log(`Report: ${report.status}, Duration: ${report.totalDuration}ms`);
 * ```
 */
export declare function generateExecutionReport(instance: ParallelGatewayInstance): {
    instanceId: string;
    gatewayId: string;
    status: GatewayState;
    totalBranches: number;
    completedBranches: number;
    failedBranches: number;
    successRate: number;
    totalDuration?: number;
    averageBranchDuration?: number;
    resourceUtilization: Record<string, number>;
    timeline: any[];
};
/**
 * 45. Streams real-time execution updates
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {Observable<ParallelExecutionMonitor>} Update stream
 *
 * @example
 * ```typescript
 * const updates$ = streamExecutionUpdates(instance);
 * updates$.subscribe(monitor => console.log('Update:', monitor));
 * ```
 */
export declare function streamExecutionUpdates(instance: ParallelGatewayInstance): Observable<ParallelExecutionMonitor>;
declare const _default: {
    createParallelGateway: typeof createParallelGateway;
    executeAndSplit: typeof executeAndSplit;
    executeOrSplit: typeof executeOrSplit;
    executeConditionalSplit: typeof executeConditionalSplit;
    evaluateCondition: typeof evaluateCondition;
    createBranchContext: typeof createBranchContext;
    prioritizeBranches: typeof prioritizeBranches;
    createIsolatedScope: typeof createIsolatedScope;
    cloneBranchForRetry: typeof cloneBranchForRetry;
    validateBranchConfig: typeof validateBranchConfig;
    executeConcurrent: typeof executeConcurrent;
    executeBranch: typeof executeBranch;
    executeBranchLogic: typeof executeBranchLogic;
    createTimeout: typeof createTimeout;
    monitorConcurrentExecution: typeof monitorConcurrentExecution;
    waitForAllBranches: typeof waitForAllBranches;
    waitForAnyBranch: typeof waitForAnyBranch;
    waitForNOfM: typeof waitForNOfM;
    waitForMajority: typeof waitForMajority;
    executeGatewayJoin: typeof executeGatewayJoin;
    createParallelToken: typeof createParallelToken;
    consumeToken: typeof consumeToken;
    countActiveTokens: typeof countActiveTokens;
    countConsumedTokens: typeof countConsumedTokens;
    synchronizeBranchCompletion: typeof synchronizeBranchCompletion;
    trackBranchProgress: typeof trackBranchProgress;
    getCompletionPercentage: typeof getCompletionPercentage;
    getPendingBranches: typeof getPendingBranches;
    getFailedBranches: typeof getFailedBranches;
    areAllBranchesSuccessful: typeof areAllBranchesSuccessful;
    handlePartialJoin: typeof handlePartialJoin;
    collectCompletedResults: typeof collectCompletedResults;
    mergeParallelResults: typeof mergeParallelResults;
    handleIncompleteBranches: typeof handleIncompleteBranches;
    createPartialCompletionReport: typeof createPartialCompletionReport;
    createResourcePool: typeof createResourcePool;
    allocateResources: typeof allocateResources;
    releaseResources: typeof releaseResources;
    calculateResourceUtilization: typeof calculateResourceUtilization;
    optimizeResourceAllocation: typeof optimizeResourceAllocation;
    calculateThroughput: typeof calculateThroughput;
    calculateBranchMetrics: typeof calculateBranchMetrics;
    createExecutionTimeline: typeof createExecutionTimeline;
    generateExecutionReport: typeof generateExecutionReport;
    streamExecutionUpdates: typeof streamExecutionUpdates;
};
export default _default;
//# sourceMappingURL=workflow-parallel-execution.d.ts.map