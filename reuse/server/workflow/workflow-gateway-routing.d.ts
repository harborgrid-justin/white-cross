/**
 * LOC: WFGR-001
 * File: /reuse/server/workflow/workflow-gateway-routing.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize / sequelize-typescript
 *   - @nestjs/common
 *   - zod (validation)
 *   - expr-eval (expression evaluation)
 *
 * DOWNSTREAM (imported by):
 *   - Workflow execution engines
 *   - Business process automation services
 *   - Decision management systems
 *   - Process orchestration layers
 */
import { Sequelize, Transaction, QueryInterface } from 'sequelize';
/**
 * Zod schema for gateway definition.
 */
export declare const GatewayDefinitionSchema: any;
/**
 * Zod schema for gateway evaluation.
 */
export declare const GatewayEvaluationSchema: any;
/**
 * Zod schema for routing decision.
 */
export declare const RoutingDecisionSchema: any;
/**
 * Zod schema for conditional expression.
 */
export declare const ConditionalExpressionSchema: any;
export interface GatewayDefinition {
    id: string;
    workflowId: string;
    name: string;
    type: 'EXCLUSIVE' | 'PARALLEL' | 'INCLUSIVE' | 'EVENT_BASED' | 'COMPLEX' | 'DATA_BASED';
    defaultFlow?: string;
    convergingFlows: string[];
    divergingFlows: DivergingFlow[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface DivergingFlow {
    id: string;
    targetNodeId: string;
    condition?: string;
    priority?: number;
}
export interface GatewayEvaluation {
    id: string;
    gatewayId: string;
    workflowInstanceId: string;
    evaluatedAt: Date;
    context: Record<string, any>;
    selectedFlows: string[];
    evaluationDuration: number;
    evaluationType: 'SPLIT' | 'MERGE';
}
export interface RoutingDecision {
    id: string;
    gatewayId: string;
    workflowInstanceId: string;
    flowId: string;
    targetNodeId: string;
    condition?: string;
    conditionResult: boolean;
    executedAt: Date;
    executedBy?: string;
}
export interface ConditionalExpression {
    id: string;
    expression: string;
    variables: string[];
    compiledExpression?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface GatewayState {
    gatewayId: string;
    workflowInstanceId: string;
    activeTokens: number;
    completedInflows: string[];
    pendingInflows: string[];
    status: 'WAITING' | 'EVALUATING' | 'COMPLETED';
}
export interface RoutingResult {
    success: boolean;
    selectedFlows: string[];
    targetNodes: string[];
    error?: Error;
    evaluationId: string;
    duration: number;
}
export interface ConditionEvaluationResult {
    result: boolean;
    expression: string;
    context: Record<string, any>;
    error?: Error;
    duration: number;
}
/**
 * Creates database schemas for gateway routing management.
 * Includes tables for gateway definitions, evaluations, and routing decisions.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createGatewayRoutingSchemas(queryInterface, transaction);
 * ```
 */
export declare function createGatewayRoutingSchemas(queryInterface: QueryInterface, transaction?: Transaction): Promise<void>;
/**
 * 1. Evaluates a gateway and determines routing paths.
 * Main entry point for gateway routing logic.
 *
 * @param {GatewayDefinition} gateway - Gateway definition
 * @param {Record<string, any>} context - Workflow execution context
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<RoutingResult>} Routing evaluation result
 *
 * @example
 * ```typescript
 * const result = await evaluateGateway(gateway, { age: 65 }, instanceId, sequelize);
 * console.log('Selected flows:', result.selectedFlows);
 * ```
 */
export declare function evaluateGateway(gateway: GatewayDefinition, context: Record<string, any>, workflowInstanceId: string, sequelize: Sequelize): Promise<RoutingResult>;
/**
 * 2. Evaluates an exclusive (XOR) gateway.
 * Selects exactly one outgoing flow based on conditions.
 *
 * @param {GatewayDefinition} gateway - Gateway definition
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<{ selectedFlows: string[]; targetNodes: string[] }>} Selected flow and target
 *
 * @example
 * ```typescript
 * const { selectedFlows, targetNodes } = await evaluateExclusiveGateway(gateway, context);
 * ```
 */
export declare function evaluateExclusiveGateway(gateway: GatewayDefinition, context: Record<string, any>): Promise<{
    selectedFlows: string[];
    targetNodes: string[];
}>;
/**
 * 3. Evaluates a parallel (AND) gateway.
 * Activates all outgoing flows simultaneously.
 *
 * @param {GatewayDefinition} gateway - Gateway definition
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<{ selectedFlows: string[]; targetNodes: string[] }>} All flows and targets
 *
 * @example
 * ```typescript
 * const { selectedFlows, targetNodes } = await evaluateParallelGateway(gateway, context);
 * ```
 */
export declare function evaluateParallelGateway(gateway: GatewayDefinition, context: Record<string, any>): Promise<{
    selectedFlows: string[];
    targetNodes: string[];
}>;
/**
 * 4. Evaluates an inclusive (OR) gateway.
 * Activates all flows whose conditions evaluate to true.
 *
 * @param {GatewayDefinition} gateway - Gateway definition
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<{ selectedFlows: string[]; targetNodes: string[] }>} Selected flows and targets
 *
 * @example
 * ```typescript
 * const { selectedFlows, targetNodes } = await evaluateInclusiveGateway(gateway, context);
 * ```
 */
export declare function evaluateInclusiveGateway(gateway: GatewayDefinition, context: Record<string, any>): Promise<{
    selectedFlows: string[];
    targetNodes: string[];
}>;
/**
 * 5. Evaluates an event-based gateway.
 * Waits for first event to occur and routes accordingly.
 *
 * @param {GatewayDefinition} gateway - Gateway definition
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<{ selectedFlows: string[]; targetNodes: string[] }>} Selected flow based on event
 *
 * @example
 * ```typescript
 * const { selectedFlows, targetNodes } = await evaluateEventBasedGateway(gateway, context);
 * ```
 */
export declare function evaluateEventBasedGateway(gateway: GatewayDefinition, context: Record<string, any>): Promise<{
    selectedFlows: string[];
    targetNodes: string[];
}>;
/**
 * 6. Evaluates a complex gateway with custom logic.
 * Uses custom evaluation function for complex routing scenarios.
 *
 * @param {GatewayDefinition} gateway - Gateway definition
 * @param {Record<string, any>} context - Execution context
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ selectedFlows: string[]; targetNodes: string[] }>} Selected flows
 *
 * @example
 * ```typescript
 * const { selectedFlows, targetNodes } = await evaluateComplexGateway(gateway, context, sequelize);
 * ```
 */
export declare function evaluateComplexGateway(gateway: GatewayDefinition, context: Record<string, any>, sequelize: Sequelize): Promise<{
    selectedFlows: string[];
    targetNodes: string[];
}>;
/**
 * 7. Evaluates a conditional expression with context.
 * Parses and evaluates condition string against context data.
 *
 * @param {string} expression - Conditional expression
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<ConditionEvaluationResult>} Evaluation result
 *
 * @example
 * ```typescript
 * const result = await evaluateCondition('age >= 65 && status == "active"', { age: 70, status: 'active' });
 * console.log('Condition result:', result.result);
 * ```
 */
export declare function evaluateCondition(expression: string, context: Record<string, any>): Promise<ConditionEvaluationResult>;
/**
 * 8. Parses and evaluates a JavaScript-like expression.
 * Safe expression evaluation with context binding.
 *
 * @param {string} expression - Expression string
 * @param {Record<string, any>} context - Variable context
 * @returns {any} Evaluation result
 *
 * @example
 * ```typescript
 * const result = evaluateExpression('amount > 1000', { amount: 1500 });
 * ```
 */
export declare function evaluateExpression(expression: string, context: Record<string, any>): any;
/**
 * 9. Compiles a conditional expression for reuse.
 * Pre-compiles expression for performance optimization.
 *
 * @param {string} expression - Expression to compile
 * @param {string[]} variables - Expected variables
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<string>} Compiled expression ID
 *
 * @example
 * ```typescript
 * const expressionId = await compileExpression('amount > threshold', ['amount', 'threshold'], sequelize);
 * ```
 */
export declare function compileExpression(expression: string, variables: string[], sequelize: Sequelize): Promise<string>;
/**
 * 10. Extracts variables from a conditional expression.
 * Identifies all variable references in expression.
 *
 * @param {string} expression - Conditional expression
 * @returns {string[]} List of variable names
 *
 * @example
 * ```typescript
 * const vars = extractExpressionVariables('age >= 65 && status == "active"');
 * console.log(vars); // ['age', 'status']
 * ```
 */
export declare function extractExpressionVariables(expression: string): string[];
/**
 * 11. Validates a conditional expression syntax.
 * Checks expression for syntax errors without evaluation.
 *
 * @param {string} expression - Expression to validate
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const { valid, error } = validateExpression('age >= 65');
 * if (!valid) console.error('Invalid expression:', error);
 * ```
 */
export declare function validateExpression(expression: string): {
    valid: boolean;
    error?: string;
};
/**
 * 12. Creates a complex condition from multiple conditions.
 * Combines multiple conditions with logical operators.
 *
 * @param {string[]} conditions - Array of condition expressions
 * @param {string} operator - Logical operator ('AND' or 'OR')
 * @returns {string} Combined expression
 *
 * @example
 * ```typescript
 * const combined = combineConditions(['age >= 65', 'status == "active"'], 'AND');
 * console.log(combined); // '(age >= 65) && (status == "active")'
 * ```
 */
export declare function combineConditions(conditions: string[], operator: 'AND' | 'OR'): string;
/**
 * 13. Records a routing decision in the database.
 * Persists gateway routing decision for audit trail.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {string} flowId - Selected flow ID
 * @param {string} targetNodeId - Target node ID
 * @param {string} condition - Condition expression
 * @param {boolean} conditionResult - Condition evaluation result
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<string>} Decision record ID
 *
 * @example
 * ```typescript
 * await recordRoutingDecision(gatewayId, instanceId, flowId, targetId, 'age >= 65', true, sequelize);
 * ```
 */
export declare function recordRoutingDecision(gatewayId: string, workflowInstanceId: string, flowId: string, targetNodeId: string, condition: string | undefined, conditionResult: boolean, sequelize: Sequelize): Promise<string>;
/**
 * 14. Gets routing decision history for a gateway.
 * Retrieves past routing decisions with filtering.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {object} options - Query options
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<RoutingDecision[]>} Decision history
 *
 * @example
 * ```typescript
 * const history = await getRoutingDecisionHistory(gatewayId, { limit: 10 }, sequelize);
 * ```
 */
export declare function getRoutingDecisionHistory(gatewayId: string, options: {
    limit?: number;
    offset?: number;
    workflowInstanceId?: string;
}, sequelize: Sequelize): Promise<RoutingDecision[]>;
/**
 * 15. Calculates routing statistics for a gateway.
 * Analyzes routing patterns and flow selection frequencies.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Routing statistics
 *
 * @example
 * ```typescript
 * const stats = await calculateRoutingStatistics(gatewayId, sequelize);
 * console.log('Most common path:', stats.mostCommonFlow);
 * ```
 */
export declare function calculateRoutingStatistics(gatewayId: string, sequelize: Sequelize): Promise<Record<string, any>>;
/**
 * 16. Predicts most likely routing path based on history.
 * Uses historical data to predict flow selection.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {Record<string, any>} context - Current context
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<string>} Predicted flow ID
 *
 * @example
 * ```typescript
 * const predictedFlow = await predictRoutingPath(gatewayId, context, sequelize);
 * ```
 */
export declare function predictRoutingPath(gatewayId: string, context: Record<string, any>, sequelize: Sequelize): Promise<string>;
/**
 * 17. Creates multiple parallel execution paths.
 * Spawns concurrent workflow branches.
 *
 * @param {string[]} targetNodeIds - Target node IDs for parallel paths
 * @param {Record<string, any>} context - Execution context
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<string[]>} Created path instance IDs
 *
 * @example
 * ```typescript
 * const pathIds = await createParallelPaths(['node1', 'node2', 'node3'], context, instanceId, sequelize);
 * ```
 */
export declare function createParallelPaths(targetNodeIds: string[], context: Record<string, any>, workflowInstanceId: string, sequelize: Sequelize): Promise<string[]>;
/**
 * 18. Merges multiple execution paths at convergence point.
 * Synchronizes parallel branches.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {string} incomingFlowId - Incoming flow ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} Whether all paths converged
 *
 * @example
 * ```typescript
 * const converged = await mergeExecutionPaths(gatewayId, instanceId, flowId, sequelize);
 * if (converged) console.log('All paths synchronized');
 * ```
 */
export declare function mergeExecutionPaths(gatewayId: string, workflowInstanceId: string, incomingFlowId: string, sequelize: Sequelize): Promise<boolean>;
/**
 * 19. Synchronizes parallel gateway execution.
 * Waits for all parallel branches to complete.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {number} expectedInflows - Expected number of inflows
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} Whether synchronization is complete
 *
 * @example
 * ```typescript
 * const synced = await synchronizeParallelGateway(gatewayId, instanceId, 3, sequelize);
 * ```
 */
export declare function synchronizeParallelGateway(gatewayId: string, workflowInstanceId: string, expectedInflows: number, sequelize: Sequelize): Promise<boolean>;
/**
 * 20. Manages execution tokens for multi-path routing.
 * Tracks active execution paths in workflow.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Active execution tokens
 *
 * @example
 * ```typescript
 * const tokens = await getActiveExecutionTokens(instanceId, sequelize);
 * console.log(`${tokens.length} active paths`);
 * ```
 */
export declare function getActiveExecutionTokens(workflowInstanceId: string, sequelize: Sequelize): Promise<any[]>;
/**
 * 21. Handles gateway convergence for merging flows.
 * Manages the joining of multiple execution paths.
 *
 * @param {GatewayDefinition} gateway - Gateway definition
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {string[]} incomingFlows - Incoming flow IDs
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} Whether convergence is complete
 *
 * @example
 * ```typescript
 * const complete = await handleGatewayConvergence(gateway, instanceId, ['flow1', 'flow2'], sequelize);
 * ```
 */
export declare function handleGatewayConvergence(gateway: GatewayDefinition, workflowInstanceId: string, incomingFlows: string[], sequelize: Sequelize): Promise<boolean>;
/**
 * 22. Checks if inclusive gateway convergence is satisfied.
 * Determines when all active paths have reached convergence point.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} Whether convergence is satisfied
 *
 * @example
 * ```typescript
 * const satisfied = await checkInclusiveGatewayConvergence(gatewayId, instanceId, sequelize);
 * ```
 */
export declare function checkInclusiveGatewayConvergence(gatewayId: string, workflowInstanceId: string, sequelize: Sequelize): Promise<boolean>;
/**
 * 23. Resets gateway state after convergence.
 * Cleans up gateway state for reusability.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resetGatewayState(gatewayId, instanceId, sequelize);
 * ```
 */
export declare function resetGatewayState(gatewayId: string, workflowInstanceId: string, sequelize: Sequelize): Promise<void>;
/**
 * 24. Evaluates a data-based gateway using data patterns.
 * Routes based on data values and patterns.
 *
 * @param {GatewayDefinition} gateway - Gateway definition
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<{ selectedFlows: string[]; targetNodes: string[] }>} Selected flows
 *
 * @example
 * ```typescript
 * const { selectedFlows } = await evaluateDataBasedGateway(gateway, { dataType: 'JSON' });
 * ```
 */
export declare function evaluateDataBasedGateway(gateway: GatewayDefinition, context: Record<string, any>): Promise<{
    selectedFlows: string[];
    targetNodes: string[];
}>;
/**
 * 25. Checks if data value matches a pattern.
 * Pattern matching for data-based routing.
 *
 * @param {any} value - Data value
 * @param {string} pattern - Pattern to match
 * @returns {boolean} Whether value matches pattern
 *
 * @example
 * ```typescript
 * const matches = matchesPattern('test@example.com', 'email');
 * ```
 */
export declare function matchesPattern(value: any, pattern: string): boolean;
/**
 * 26. Evaluates sequence flow conditions.
 * Determines if flow can be activated.
 *
 * @param {DivergingFlow} flow - Flow definition
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<boolean>} Whether flow condition is satisfied
 *
 * @example
 * ```typescript
 * const canActivate = await evaluateSequenceFlow(flow, context);
 * ```
 */
export declare function evaluateSequenceFlow(flow: DivergingFlow, context: Record<string, any>): Promise<boolean>;
/**
 * 27. Gets next node ID based on flow evaluation.
 * Determines next execution node.
 *
 * @param {DivergingFlow[]} flows - Available flows
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<string | null>} Next node ID
 *
 * @example
 * ```typescript
 * const nextNode = await getNextNode(flows, context);
 * ```
 */
export declare function getNextNode(flows: DivergingFlow[], context: Record<string, any>): Promise<string | null>;
/**
 * 28. Prioritizes flows for evaluation.
 * Orders flows by priority for sequential evaluation.
 *
 * @param {DivergingFlow[]} flows - Flows to prioritize
 * @returns {DivergingFlow[]} Prioritized flows
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeFlows(gateway.divergingFlows);
 * ```
 */
export declare function prioritizeFlows(flows: DivergingFlow[]): DivergingFlow[];
/**
 * 29. Gets default flow for gateway.
 * Returns default flow definition.
 *
 * @param {GatewayDefinition} gateway - Gateway definition
 * @returns {DivergingFlow | null} Default flow
 *
 * @example
 * ```typescript
 * const defaultFlow = getDefaultFlow(gateway);
 * ```
 */
export declare function getDefaultFlow(gateway: GatewayDefinition): DivergingFlow | null;
/**
 * 30. Gets current gateway state.
 * Retrieves gateway execution state.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<GatewayState | null>} Gateway state
 *
 * @example
 * ```typescript
 * const state = await getGatewayState(gatewayId, instanceId, sequelize);
 * ```
 */
export declare function getGatewayState(gatewayId: string, workflowInstanceId: string, sequelize: Sequelize): Promise<GatewayState | null>;
/**
 * 31. Updates gateway state.
 * Modifies gateway execution state.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {Partial<GatewayState>} updates - State updates
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateGatewayState(gatewayId, instanceId, { status: 'COMPLETED' }, sequelize);
 * ```
 */
export declare function updateGatewayState(gatewayId: string, workflowInstanceId: string, updates: Partial<GatewayState>, sequelize: Sequelize): Promise<void>;
/**
 * 32. Deletes gateway state.
 * Removes gateway execution state.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} Whether state was deleted
 *
 * @example
 * ```typescript
 * await deleteGatewayState(gatewayId, instanceId, sequelize);
 * ```
 */
export declare function deleteGatewayState(gatewayId: string, workflowInstanceId: string, sequelize: Sequelize): Promise<boolean>;
/**
 * 33. Increments gateway token count.
 * Tracks active execution paths through gateway.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} New token count
 *
 * @example
 * ```typescript
 * const tokenCount = await incrementGatewayTokens(gatewayId, instanceId, sequelize);
 * ```
 */
export declare function incrementGatewayTokens(gatewayId: string, workflowInstanceId: string, sequelize: Sequelize): Promise<number>;
/**
 * 34. Decrements gateway token count.
 * Decreases active path count.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} New token count
 *
 * @example
 * ```typescript
 * const tokenCount = await decrementGatewayTokens(gatewayId, instanceId, sequelize);
 * ```
 */
export declare function decrementGatewayTokens(gatewayId: string, workflowInstanceId: string, sequelize: Sequelize): Promise<number>;
/**
 * 35. Caches gateway evaluation results.
 * Stores evaluation results for quick lookup.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {Record<string, any>} context - Execution context
 * @param {RoutingResult} result - Evaluation result
 * @param {number} ttl - Cache TTL in seconds
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cacheGatewayEvaluation(gatewayId, context, result, 3600);
 * ```
 */
export declare function cacheGatewayEvaluation(gatewayId: string, context: Record<string, any>, result: RoutingResult, ttl: number): Promise<void>;
/**
 * 36. Gets cached gateway evaluation result.
 * Retrieves cached evaluation if available.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<RoutingResult | null>} Cached result
 *
 * @example
 * ```typescript
 * const cached = await getCachedGatewayEvaluation(gatewayId, context);
 * ```
 */
export declare function getCachedGatewayEvaluation(gatewayId: string, context: Record<string, any>): Promise<RoutingResult | null>;
/**
 * 37. Pre-compiles gateway conditions for faster evaluation.
 * Optimizes expression parsing.
 *
 * @param {GatewayDefinition} gateway - Gateway definition
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await precompileGatewayConditions(gateway, sequelize);
 * ```
 */
export declare function precompileGatewayConditions(gateway: GatewayDefinition, sequelize: Sequelize): Promise<void>;
/**
 * 38. Analyzes gateway performance metrics.
 * Identifies slow gateways and bottlenecks.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await analyzeGatewayPerformance(gatewayId, sequelize);
 * console.log('Average evaluation time:', metrics.avgEvaluationTime);
 * ```
 */
export declare function analyzeGatewayPerformance(gatewayId: string, sequelize: Sequelize): Promise<Record<string, any>>;
/**
 * 39. Optimizes gateway flow ordering for performance.
 * Reorders flows based on historical selection frequency.
 *
 * @param {GatewayDefinition} gateway - Gateway definition
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<GatewayDefinition>} Optimized gateway
 *
 * @example
 * ```typescript
 * const optimized = await optimizeGatewayFlowOrdering(gateway, sequelize);
 * ```
 */
export declare function optimizeGatewayFlowOrdering(gateway: GatewayDefinition, sequelize: Sequelize): Promise<GatewayDefinition>;
/**
 * 40. Detects and reports slow gateway evaluations.
 * Identifies performance bottlenecks.
 *
 * @param {number} thresholdMs - Threshold in milliseconds
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Slow evaluations
 *
 * @example
 * ```typescript
 * const slowGateways = await detectSlowGatewayEvaluations(1000, sequelize);
 * ```
 */
export declare function detectSlowGatewayEvaluations(thresholdMs: number, sequelize: Sequelize): Promise<any[]>;
/**
 * 41. Creates a new gateway definition.
 * Stores gateway configuration in database.
 *
 * @param {Omit<GatewayDefinition, 'id' | 'createdAt' | 'updatedAt'>} definition - Gateway definition
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<string>} Created gateway ID
 *
 * @example
 * ```typescript
 * const gatewayId = await createGatewayDefinition({
 *   workflowId: 'workflow-123',
 *   name: 'Age Check',
 *   type: 'EXCLUSIVE',
 *   divergingFlows: [...]
 * }, sequelize);
 * ```
 */
export declare function createGatewayDefinition(definition: Omit<GatewayDefinition, 'id' | 'createdAt' | 'updatedAt'>, sequelize: Sequelize): Promise<string>;
/**
 * 42. Gets a gateway definition by ID.
 * Retrieves gateway configuration.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<GatewayDefinition | null>} Gateway definition
 *
 * @example
 * ```typescript
 * const gateway = await getGatewayDefinition(gatewayId, sequelize);
 * ```
 */
export declare function getGatewayDefinition(gatewayId: string, sequelize: Sequelize): Promise<GatewayDefinition | null>;
/**
 * 43. Updates a gateway definition.
 * Modifies gateway configuration.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {Partial<GatewayDefinition>} updates - Updates to apply
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} Whether update succeeded
 *
 * @example
 * ```typescript
 * await updateGatewayDefinition(gatewayId, { name: 'Updated Gateway' }, sequelize);
 * ```
 */
export declare function updateGatewayDefinition(gatewayId: string, updates: Partial<Omit<GatewayDefinition, 'id' | 'createdAt' | 'updatedAt'>>, sequelize: Sequelize): Promise<boolean>;
/**
 * 44. Deletes a gateway definition.
 * Removes gateway configuration.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} Whether deletion succeeded
 *
 * @example
 * ```typescript
 * await deleteGatewayDefinition(gatewayId, sequelize);
 * ```
 */
export declare function deleteGatewayDefinition(gatewayId: string, sequelize: Sequelize): Promise<boolean>;
/**
 * 45. Validates gateway definition.
 * Checks gateway configuration for errors.
 *
 * @param {GatewayDefinition} gateway - Gateway definition
 * @returns {string[]} Validation errors
 *
 * @example
 * ```typescript
 * const errors = validateGatewayDefinition(gateway);
 * if (errors.length > 0) console.error('Invalid gateway:', errors);
 * ```
 */
export declare function validateGatewayDefinition(gateway: GatewayDefinition): string[];
declare const _default: {
    createGatewayRoutingSchemas: typeof createGatewayRoutingSchemas;
    evaluateGateway: typeof evaluateGateway;
    evaluateExclusiveGateway: typeof evaluateExclusiveGateway;
    evaluateParallelGateway: typeof evaluateParallelGateway;
    evaluateInclusiveGateway: typeof evaluateInclusiveGateway;
    evaluateEventBasedGateway: typeof evaluateEventBasedGateway;
    evaluateComplexGateway: typeof evaluateComplexGateway;
    evaluateDataBasedGateway: typeof evaluateDataBasedGateway;
    evaluateCondition: typeof evaluateCondition;
    evaluateExpression: typeof evaluateExpression;
    compileExpression: typeof compileExpression;
    extractExpressionVariables: typeof extractExpressionVariables;
    validateExpression: typeof validateExpression;
    combineConditions: typeof combineConditions;
    recordRoutingDecision: typeof recordRoutingDecision;
    getRoutingDecisionHistory: typeof getRoutingDecisionHistory;
    calculateRoutingStatistics: typeof calculateRoutingStatistics;
    predictRoutingPath: typeof predictRoutingPath;
    createParallelPaths: typeof createParallelPaths;
    mergeExecutionPaths: typeof mergeExecutionPaths;
    synchronizeParallelGateway: typeof synchronizeParallelGateway;
    getActiveExecutionTokens: typeof getActiveExecutionTokens;
    handleGatewayConvergence: typeof handleGatewayConvergence;
    checkInclusiveGatewayConvergence: typeof checkInclusiveGatewayConvergence;
    resetGatewayState: typeof resetGatewayState;
    evaluateSequenceFlow: typeof evaluateSequenceFlow;
    getNextNode: typeof getNextNode;
    prioritizeFlows: typeof prioritizeFlows;
    getDefaultFlow: typeof getDefaultFlow;
    getGatewayState: typeof getGatewayState;
    updateGatewayState: typeof updateGatewayState;
    deleteGatewayState: typeof deleteGatewayState;
    incrementGatewayTokens: typeof incrementGatewayTokens;
    decrementGatewayTokens: typeof decrementGatewayTokens;
    cacheGatewayEvaluation: typeof cacheGatewayEvaluation;
    getCachedGatewayEvaluation: typeof getCachedGatewayEvaluation;
    precompileGatewayConditions: typeof precompileGatewayConditions;
    analyzeGatewayPerformance: typeof analyzeGatewayPerformance;
    optimizeGatewayFlowOrdering: typeof optimizeGatewayFlowOrdering;
    detectSlowGatewayEvaluations: typeof detectSlowGatewayEvaluations;
    createGatewayDefinition: typeof createGatewayDefinition;
    getGatewayDefinition: typeof getGatewayDefinition;
    updateGatewayDefinition: typeof updateGatewayDefinition;
    deleteGatewayDefinition: typeof deleteGatewayDefinition;
    validateGatewayDefinition: typeof validateGatewayDefinition;
    matchesPattern: typeof matchesPattern;
};
export default _default;
//# sourceMappingURL=workflow-gateway-routing.d.ts.map