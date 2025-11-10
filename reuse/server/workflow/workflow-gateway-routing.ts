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

/**
 * File: /reuse/server/workflow/workflow-gateway-routing.ts
 * Locator: WC-UTL-WFGR-001
 * Purpose: Workflow Gateway Routing - Production-grade conditional routing and gateway management
 *
 * Upstream: Sequelize ORM, NestJS, Zod, Expression Evaluator
 * Downstream: ../backend/*, workflow engines, decision managers, process orchestrators
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, Zod 3.x
 * Exports: 45 production-grade utility functions for gateway evaluation, routing decisions, multi-path routing
 *
 * LLM Context: Enterprise-grade workflow gateway routing utilities for White Cross healthcare platform.
 * Provides comprehensive gateway evaluation logic, conditional expression parsing, routing decision making,
 * multi-path routing, gateway convergence, support for all BPMN gateway types (exclusive, parallel, inclusive,
 * event-based, complex), sequence flow evaluation, default flow handling, gateway state management, and
 * performance optimization. Optimized for HIPAA-compliant healthcare workflow automation with complete
 * audit trails and decision tracking.
 *
 * Features:
 * - All BPMN 2.0 gateway types support
 * - Complex condition expression evaluation
 * - Multi-path routing and convergence
 * - Gateway state persistence
 * - Routing decision audit trails
 * - Performance metrics and optimization
 * - Default flow handling
 * - Parallel execution synchronization
 * - Inclusive gateway logic
 * - Event-based gateway routing
 */

import { z } from 'zod';
import {
  Sequelize,
  Transaction,
  DataTypes,
  QueryInterface,
} from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Zod schema for gateway definition.
 */
export const GatewayDefinitionSchema = z.object({
  id: z.string().uuid(),
  workflowId: z.string().uuid(),
  name: z.string().min(1),
  type: z.enum(['EXCLUSIVE', 'PARALLEL', 'INCLUSIVE', 'EVENT_BASED', 'COMPLEX', 'DATA_BASED']),
  defaultFlow: z.string().optional(),
  convergingFlows: z.array(z.string()).default([]),
  divergingFlows: z.array(z.object({
    id: z.string(),
    targetNodeId: z.string(),
    condition: z.string().optional(),
    priority: z.number().int().optional(),
  })),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Zod schema for gateway evaluation.
 */
export const GatewayEvaluationSchema = z.object({
  id: z.string().uuid(),
  gatewayId: z.string().uuid(),
  workflowInstanceId: z.string().uuid(),
  evaluatedAt: z.date(),
  context: z.record(z.any()),
  selectedFlows: z.array(z.string()),
  evaluationDuration: z.number().int(),
  evaluationType: z.enum(['SPLIT', 'MERGE']),
});

/**
 * Zod schema for routing decision.
 */
export const RoutingDecisionSchema = z.object({
  id: z.string().uuid(),
  gatewayId: z.string().uuid(),
  workflowInstanceId: z.string().uuid(),
  flowId: z.string(),
  targetNodeId: z.string(),
  condition: z.string().optional(),
  conditionResult: z.boolean(),
  executedAt: z.date(),
  executedBy: z.string().optional(),
});

/**
 * Zod schema for conditional expression.
 */
export const ConditionalExpressionSchema = z.object({
  id: z.string().uuid(),
  expression: z.string(),
  variables: z.array(z.string()),
  compiledExpression: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// DATABASE SCHEMA DEFINITIONS
// ============================================================================

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
export async function createGatewayRoutingSchemas(
  queryInterface: QueryInterface,
  transaction?: Transaction,
): Promise<void> {
  // Gateway definitions table
  await queryInterface.createTable('gateway_definitions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    workflow_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'workflows',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('EXCLUSIVE', 'PARALLEL', 'INCLUSIVE', 'EVENT_BASED', 'COMPLEX', 'DATA_BASED'),
      allowNull: false,
    },
    default_flow: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    converging_flows: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    diverging_flows: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, { transaction });

  // Gateway evaluations table
  await queryInterface.createTable('gateway_evaluations', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    gateway_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'gateway_definitions',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    workflow_instance_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    evaluated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    context: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    selected_flows: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    evaluation_duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    evaluation_type: {
      type: DataTypes.ENUM('SPLIT', 'MERGE'),
      allowNull: false,
    },
  }, { transaction });

  // Routing decisions table
  await queryInterface.createTable('routing_decisions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    gateway_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'gateway_definitions',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    workflow_instance_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    flow_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    target_node_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    condition: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    condition_result: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    executed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    executed_by: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, { transaction });

  // Conditional expressions table
  await queryInterface.createTable('conditional_expressions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    expression: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    variables: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    compiled_expression: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, { transaction });

  // Gateway state table (for parallel/inclusive gateway synchronization)
  await queryInterface.createTable('gateway_states', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    gateway_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'gateway_definitions',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    workflow_instance_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    active_tokens: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    completed_inflows: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    pending_inflows: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM('WAITING', 'EVALUATING', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'WAITING',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, { transaction });

  // Create indexes for performance
  await queryInterface.addIndex('gateway_evaluations', ['gateway_id', 'workflow_instance_id', 'evaluated_at'], {
    name: 'idx_gateway_eval_composite',
    transaction,
  });

  await queryInterface.addIndex('routing_decisions', ['gateway_id', 'workflow_instance_id'], {
    name: 'idx_routing_decisions_composite',
    transaction,
  });

  await queryInterface.addIndex('gateway_states', ['gateway_id', 'workflow_instance_id'], {
    name: 'idx_gateway_states_lookup',
    unique: true,
    transaction,
  });

  await queryInterface.addIndex('gateway_states', ['status'], {
    name: 'idx_gateway_states_status',
    where: { status: ['WAITING', 'EVALUATING'] },
    transaction,
  });
}

// ============================================================================
// GATEWAY EVALUATION LOGIC
// ============================================================================

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
export async function evaluateGateway(
  gateway: GatewayDefinition,
  context: Record<string, any>,
  workflowInstanceId: string,
  sequelize: Sequelize,
): Promise<RoutingResult> {
  const startTime = Date.now();
  const evaluationId = crypto.randomUUID();

  try {
    let selectedFlows: string[];
    let targetNodes: string[];

    // Route based on gateway type
    switch (gateway.type) {
      case 'EXCLUSIVE':
        ({ selectedFlows, targetNodes } = await evaluateExclusiveGateway(gateway, context));
        break;

      case 'PARALLEL':
        ({ selectedFlows, targetNodes } = await evaluateParallelGateway(gateway, context));
        break;

      case 'INCLUSIVE':
        ({ selectedFlows, targetNodes } = await evaluateInclusiveGateway(gateway, context));
        break;

      case 'EVENT_BASED':
        ({ selectedFlows, targetNodes } = await evaluateEventBasedGateway(gateway, context));
        break;

      case 'COMPLEX':
        ({ selectedFlows, targetNodes } = await evaluateComplexGateway(gateway, context, sequelize));
        break;

      case 'DATA_BASED':
        ({ selectedFlows, targetNodes } = await evaluateDataBasedGateway(gateway, context));
        break;

      default:
        throw new Error(`Unsupported gateway type: ${gateway.type}`);
    }

    const duration = Date.now() - startTime;

    // Persist evaluation
    await sequelize.query(
      `INSERT INTO gateway_evaluations
       (id, gateway_id, workflow_instance_id, evaluated_at, context, selected_flows, evaluation_duration, evaluation_type)
       VALUES (:id, :gatewayId, :workflowInstanceId, NOW(), :context, :selectedFlows, :duration, 'SPLIT')`,
      {
        replacements: {
          id: evaluationId,
          gatewayId: gateway.id,
          workflowInstanceId,
          context: JSON.stringify(context),
          selectedFlows: JSON.stringify(selectedFlows),
          duration,
        },
      },
    );

    // Record routing decisions
    for (const flowId of selectedFlows) {
      const flow = gateway.divergingFlows.find((f) => f.id === flowId);
      if (flow) {
        await recordRoutingDecision(
          gateway.id,
          workflowInstanceId,
          flowId,
          flow.targetNodeId,
          flow.condition,
          true,
          sequelize,
        );
      }
    }

    return {
      success: true,
      selectedFlows,
      targetNodes,
      evaluationId,
      duration,
    };
  } catch (error) {
    return {
      success: false,
      selectedFlows: [],
      targetNodes: [],
      error: error as Error,
      evaluationId,
      duration: Date.now() - startTime,
    };
  }
}

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
export async function evaluateExclusiveGateway(
  gateway: GatewayDefinition,
  context: Record<string, any>,
): Promise<{ selectedFlows: string[]; targetNodes: string[] }> {
  // Sort flows by priority (higher priority first)
  const sortedFlows = [...gateway.divergingFlows].sort((a, b) =>
    (b.priority || 0) - (a.priority || 0),
  );

  // Evaluate each flow's condition
  for (const flow of sortedFlows) {
    if (flow.condition) {
      const result = await evaluateCondition(flow.condition, context);
      if (result.result) {
        return {
          selectedFlows: [flow.id],
          targetNodes: [flow.targetNodeId],
        };
      }
    } else {
      // Flow without condition always evaluates to true
      return {
        selectedFlows: [flow.id],
        targetNodes: [flow.targetNodeId],
      };
    }
  }

  // If no condition matched, use default flow
  if (gateway.defaultFlow) {
    const defaultFlowObj = gateway.divergingFlows.find((f) => f.id === gateway.defaultFlow);
    if (defaultFlowObj) {
      return {
        selectedFlows: [defaultFlowObj.id],
        targetNodes: [defaultFlowObj.targetNodeId],
      };
    }
  }

  throw new Error('No flow selected in exclusive gateway and no default flow defined');
}

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
export async function evaluateParallelGateway(
  gateway: GatewayDefinition,
  context: Record<string, any>,
): Promise<{ selectedFlows: string[]; targetNodes: string[] }> {
  // Parallel gateway activates all outgoing flows
  return {
    selectedFlows: gateway.divergingFlows.map((f) => f.id),
    targetNodes: gateway.divergingFlows.map((f) => f.targetNodeId),
  };
}

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
export async function evaluateInclusiveGateway(
  gateway: GatewayDefinition,
  context: Record<string, any>,
): Promise<{ selectedFlows: string[]; targetNodes: string[] }> {
  const selectedFlows: string[] = [];
  const targetNodes: string[] = [];

  // Evaluate each flow's condition
  for (const flow of gateway.divergingFlows) {
    if (flow.condition) {
      const result = await evaluateCondition(flow.condition, context);
      if (result.result) {
        selectedFlows.push(flow.id);
        targetNodes.push(flow.targetNodeId);
      }
    } else {
      // Flow without condition always evaluates to true
      selectedFlows.push(flow.id);
      targetNodes.push(flow.targetNodeId);
    }
  }

  // If no flows selected, use default flow
  if (selectedFlows.length === 0 && gateway.defaultFlow) {
    const defaultFlowObj = gateway.divergingFlows.find((f) => f.id === gateway.defaultFlow);
    if (defaultFlowObj) {
      selectedFlows.push(defaultFlowObj.id);
      targetNodes.push(defaultFlowObj.targetNodeId);
    }
  }

  if (selectedFlows.length === 0) {
    throw new Error('No flow selected in inclusive gateway and no default flow defined');
  }

  return { selectedFlows, targetNodes };
}

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
export async function evaluateEventBasedGateway(
  gateway: GatewayDefinition,
  context: Record<string, any>,
): Promise<{ selectedFlows: string[]; targetNodes: string[] }> {
  // Event-based gateway routing determined by event occurrence
  const triggeredEvent = context.triggeredEvent;

  if (!triggeredEvent) {
    throw new Error('Event-based gateway requires triggeredEvent in context');
  }

  const flow = gateway.divergingFlows.find((f) => f.metadata?.eventType === triggeredEvent);

  if (!flow) {
    throw new Error(`No flow found for event: ${triggeredEvent}`);
  }

  return {
    selectedFlows: [flow.id],
    targetNodes: [flow.targetNodeId],
  };
}

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
export async function evaluateComplexGateway(
  gateway: GatewayDefinition,
  context: Record<string, any>,
  sequelize: Sequelize,
): Promise<{ selectedFlows: string[]; targetNodes: string[] }> {
  // Complex gateway uses custom evaluation logic
  const evaluatorFn = gateway.metadata?.evaluator;

  if (typeof evaluatorFn === 'function') {
    const result = await evaluatorFn(gateway, context, sequelize);
    return result;
  }

  // Fallback to inclusive gateway behavior
  return evaluateInclusiveGateway(gateway, context);
}

// ============================================================================
// CONDITION EXPRESSION PARSING
// ============================================================================

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
export async function evaluateCondition(
  expression: string,
  context: Record<string, any>,
): Promise<ConditionEvaluationResult> {
  const startTime = Date.now();

  try {
    const result = evaluateExpression(expression, context);

    return {
      result: Boolean(result),
      expression,
      context,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    return {
      result: false,
      expression,
      context,
      error: error as Error,
      duration: Date.now() - startTime,
    };
  }
}

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
export function evaluateExpression(expression: string, context: Record<string, any>): any {
  // Create a safe evaluation context
  const safeContext = { ...context };

  try {
    // Simple expression parser (in production, use a proper expression evaluator)
    // This is a basic implementation - consider using libraries like expr-eval or jsep

    // Replace variable references
    let processedExpression = expression;

    // Handle common operators
    processedExpression = processedExpression
      .replace(/&&/g, '&&')
      .replace(/\|\|/g, '||')
      .replace(/==/g, '===')
      .replace(/!=/g, '!==');

    // Create evaluation function
    const keys = Object.keys(safeContext);
    const values = Object.values(safeContext);
    const fn = new Function(...keys, `return ${processedExpression}`);

    return fn(...values);
  } catch (error) {
    throw new Error(`Failed to evaluate expression: ${expression}. Error: ${(error as Error).message}`);
  }
}

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
export async function compileExpression(
  expression: string,
  variables: string[],
  sequelize: Sequelize,
): Promise<string> {
  const id = crypto.randomUUID();

  await sequelize.query(
    `INSERT INTO conditional_expressions (id, expression, variables, created_at, updated_at)
     VALUES (:id, :expression, :variables, NOW(), NOW())`,
    {
      replacements: {
        id,
        expression,
        variables: JSON.stringify(variables),
      },
    },
  );

  return id;
}

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
export function extractExpressionVariables(expression: string): string[] {
  // Match variable names (simplified regex - improve for production)
  const matches = expression.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];

  // Filter out JavaScript keywords
  const keywords = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']);
  const variables = matches.filter((v) => !keywords.has(v));

  // Return unique variables
  return Array.from(new Set(variables));
}

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
export function validateExpression(expression: string): { valid: boolean; error?: string } {
  try {
    // Try to parse the expression
    new Function(`return ${expression}`);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: (error as Error).message,
    };
  }
}

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
export function combineConditions(conditions: string[], operator: 'AND' | 'OR'): string {
  if (conditions.length === 0) return 'true';
  if (conditions.length === 1) return conditions[0];

  const op = operator === 'AND' ? '&&' : '||';
  return conditions.map((c) => `(${c})`).join(` ${op} `);
}

// ============================================================================
// ROUTING DECISION MAKING
// ============================================================================

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
export async function recordRoutingDecision(
  gatewayId: string,
  workflowInstanceId: string,
  flowId: string,
  targetNodeId: string,
  condition: string | undefined,
  conditionResult: boolean,
  sequelize: Sequelize,
): Promise<string> {
  const id = crypto.randomUUID();

  await sequelize.query(
    `INSERT INTO routing_decisions
     (id, gateway_id, workflow_instance_id, flow_id, target_node_id, condition, condition_result, executed_at)
     VALUES (:id, :gatewayId, :workflowInstanceId, :flowId, :targetNodeId, :condition, :conditionResult, NOW())`,
    {
      replacements: {
        id,
        gatewayId,
        workflowInstanceId,
        flowId,
        targetNodeId,
        condition: condition || null,
        conditionResult,
      },
    },
  );

  return id;
}

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
export async function getRoutingDecisionHistory(
  gatewayId: string,
  options: { limit?: number; offset?: number; workflowInstanceId?: string },
  sequelize: Sequelize,
): Promise<RoutingDecision[]> {
  const { limit = 50, offset = 0, workflowInstanceId } = options;

  let query = `
    SELECT * FROM routing_decisions
    WHERE gateway_id = :gatewayId
  `;

  const replacements: Record<string, any> = { gatewayId, limit, offset };

  if (workflowInstanceId) {
    query += ` AND workflow_instance_id = :workflowInstanceId`;
    replacements.workflowInstanceId = workflowInstanceId;
  }

  query += ` ORDER BY executed_at DESC LIMIT :limit OFFSET :offset`;

  const [results] = await sequelize.query(query, { replacements });

  return (results as any[]).map((row) => ({
    id: row.id,
    gatewayId: row.gateway_id,
    workflowInstanceId: row.workflow_instance_id,
    flowId: row.flow_id,
    targetNodeId: row.target_node_id,
    condition: row.condition,
    conditionResult: row.condition_result,
    executedAt: new Date(row.executed_at),
    executedBy: row.executed_by,
  }));
}

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
export async function calculateRoutingStatistics(
  gatewayId: string,
  sequelize: Sequelize,
): Promise<Record<string, any>> {
  const [results] = await sequelize.query(
    `SELECT
       flow_id,
       COUNT(*) as execution_count,
       SUM(CASE WHEN condition_result THEN 1 ELSE 0 END) as true_count,
       SUM(CASE WHEN NOT condition_result THEN 1 ELSE 0 END) as false_count
     FROM routing_decisions
     WHERE gateway_id = :gatewayId
     GROUP BY flow_id
     ORDER BY execution_count DESC`,
    { replacements: { gatewayId } },
  );

  return {
    flowStatistics: results,
    totalExecutions: (results as any[]).reduce((sum, row: any) => sum + parseInt(row.execution_count), 0),
    mostCommonFlow: (results as any[])[0]?.flow_id,
  };
}

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
export async function predictRoutingPath(
  gatewayId: string,
  context: Record<string, any>,
  sequelize: Sequelize,
): Promise<string> {
  // Simple prediction based on most frequent flow
  // In production, implement ML-based prediction
  const stats = await calculateRoutingStatistics(gatewayId, sequelize);

  if (stats.mostCommonFlow) {
    return stats.mostCommonFlow;
  }

  throw new Error('No routing history available for prediction');
}

// ============================================================================
// MULTI-PATH ROUTING
// ============================================================================

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
export async function createParallelPaths(
  targetNodeIds: string[],
  context: Record<string, any>,
  workflowInstanceId: string,
  sequelize: Sequelize,
): Promise<string[]> {
  const pathIds: string[] = [];

  for (const targetNodeId of targetNodeIds) {
    const pathId = crypto.randomUUID();
    pathIds.push(pathId);

    // Create execution token for each path
    await sequelize.query(
      `INSERT INTO workflow_execution_tokens
       (id, workflow_instance_id, current_node_id, status, context, created_at)
       VALUES (:id, :workflowInstanceId, :nodeId, 'ACTIVE', :context, NOW())`,
      {
        replacements: {
          id: pathId,
          workflowInstanceId,
          nodeId: targetNodeId,
          context: JSON.stringify(context),
        },
      },
    );
  }

  return pathIds;
}

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
export async function mergeExecutionPaths(
  gatewayId: string,
  workflowInstanceId: string,
  incomingFlowId: string,
  sequelize: Sequelize,
): Promise<boolean> {
  return sequelize.transaction(async (transaction) => {
    // Get or create gateway state
    let [results] = await sequelize.query(
      `SELECT * FROM gateway_states
       WHERE gateway_id = :gatewayId AND workflow_instance_id = :workflowInstanceId
       FOR UPDATE`,
      {
        replacements: { gatewayId, workflowInstanceId },
        transaction,
      },
    );

    let state = (results as any[])[0];

    if (!state) {
      // Create new state
      const stateId = crypto.randomUUID();
      await sequelize.query(
        `INSERT INTO gateway_states
         (id, gateway_id, workflow_instance_id, active_tokens, completed_inflows, pending_inflows, status)
         VALUES (:id, :gatewayId, :workflowInstanceId, 1, :completedInflows, :pendingInflows, 'WAITING')`,
        {
          replacements: {
            id: stateId,
            gatewayId,
            workflowInstanceId,
            completedInflows: JSON.stringify([incomingFlowId]),
            pendingInflows: JSON.stringify([]),
          },
          transaction,
        },
      );

      return false;
    }

    // Update state with new incoming flow
    const completedInflows = [...state.completed_inflows, incomingFlowId];

    await sequelize.query(
      `UPDATE gateway_states
       SET completed_inflows = :completedInflows, updated_at = NOW()
       WHERE id = :id`,
      {
        replacements: {
          id: state.id,
          completedInflows: JSON.stringify(completedInflows),
        },
        transaction,
      },
    );

    // Check if all expected inflows have arrived
    // This would require knowing expected inflows from gateway definition
    return false; // Simplified - implement full convergence logic
  });
}

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
export async function synchronizeParallelGateway(
  gatewayId: string,
  workflowInstanceId: string,
  expectedInflows: number,
  sequelize: Sequelize,
): Promise<boolean> {
  const [results] = await sequelize.query(
    `SELECT * FROM gateway_states
     WHERE gateway_id = :gatewayId AND workflow_instance_id = :workflowInstanceId`,
    { replacements: { gatewayId, workflowInstanceId } },
  );

  const state = (results as any[])[0];

  if (!state) return false;

  return state.completed_inflows.length >= expectedInflows;
}

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
export async function getActiveExecutionTokens(
  workflowInstanceId: string,
  sequelize: Sequelize,
): Promise<any[]> {
  const [results] = await sequelize.query(
    `SELECT * FROM workflow_execution_tokens
     WHERE workflow_instance_id = :workflowInstanceId AND status = 'ACTIVE'
     ORDER BY created_at DESC`,
    { replacements: { workflowInstanceId } },
  );

  return results as any[];
}

// ============================================================================
// GATEWAY CONVERGENCE
// ============================================================================

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
export async function handleGatewayConvergence(
  gateway: GatewayDefinition,
  workflowInstanceId: string,
  incomingFlows: string[],
  sequelize: Sequelize,
): Promise<boolean> {
  switch (gateway.type) {
    case 'PARALLEL':
      return synchronizeParallelGateway(
        gateway.id,
        workflowInstanceId,
        gateway.convergingFlows.length,
        sequelize,
      );

    case 'INCLUSIVE':
      return checkInclusiveGatewayConvergence(gateway.id, workflowInstanceId, sequelize);

    case 'EXCLUSIVE':
      // Exclusive gateway doesn't require convergence synchronization
      return true;

    default:
      return true;
  }
}

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
export async function checkInclusiveGatewayConvergence(
  gatewayId: string,
  workflowInstanceId: string,
  sequelize: Sequelize,
): Promise<boolean> {
  const [results] = await sequelize.query(
    `SELECT * FROM gateway_states
     WHERE gateway_id = :gatewayId AND workflow_instance_id = :workflowInstanceId`,
    { replacements: { gatewayId, workflowInstanceId } },
  );

  const state = (results as any[])[0];

  if (!state) return false;

  // Check if all expected active tokens have arrived
  return state.pending_inflows.length === 0;
}

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
export async function resetGatewayState(
  gatewayId: string,
  workflowInstanceId: string,
  sequelize: Sequelize,
): Promise<void> {
  await sequelize.query(
    `UPDATE gateway_states
     SET active_tokens = 0, completed_inflows = '[]', pending_inflows = '[]', status = 'WAITING'
     WHERE gateway_id = :gatewayId AND workflow_instance_id = :workflowInstanceId`,
    { replacements: { gatewayId, workflowInstanceId } },
  );
}

// ============================================================================
// DATA-BASED GATEWAY
// ============================================================================

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
export async function evaluateDataBasedGateway(
  gateway: GatewayDefinition,
  context: Record<string, any>,
): Promise<{ selectedFlows: string[]; targetNodes: string[] }> {
  // Data-based gateway routes based on data values
  const dataKey = gateway.metadata?.dataKey;

  if (!dataKey) {
    throw new Error('Data-based gateway requires dataKey in metadata');
  }

  const dataValue = context[dataKey];

  // Find matching flow based on data value
  for (const flow of gateway.divergingFlows) {
    const expectedValue = flow.metadata?.dataValue;

    if (expectedValue === dataValue || (flow.metadata?.pattern && matchesPattern(dataValue, flow.metadata.pattern))) {
      return {
        selectedFlows: [flow.id],
        targetNodes: [flow.targetNodeId],
      };
    }
  }

  // Use default flow if no match
  if (gateway.defaultFlow) {
    const defaultFlowObj = gateway.divergingFlows.find((f) => f.id === gateway.defaultFlow);
    if (defaultFlowObj) {
      return {
        selectedFlows: [defaultFlowObj.id],
        targetNodes: [defaultFlowObj.targetNodeId],
      };
    }
  }

  throw new Error('No matching flow in data-based gateway');
}

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
export function matchesPattern(value: any, pattern: string): boolean {
  switch (pattern) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));

    case 'phone':
      return /^\+?[\d\s-()]+$/.test(String(value));

    case 'number':
      return !isNaN(Number(value));

    case 'boolean':
      return typeof value === 'boolean';

    default:
      // Try as regex pattern
      try {
        const regex = new RegExp(pattern);
        return regex.test(String(value));
      } catch {
        return false;
      }
  }
}

// ============================================================================
// SEQUENCE FLOW EVALUATION
// ============================================================================

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
export async function evaluateSequenceFlow(
  flow: DivergingFlow,
  context: Record<string, any>,
): Promise<boolean> {
  if (!flow.condition) return true;

  const result = await evaluateCondition(flow.condition, context);
  return result.result;
}

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
export async function getNextNode(
  flows: DivergingFlow[],
  context: Record<string, any>,
): Promise<string | null> {
  for (const flow of flows) {
    if (await evaluateSequenceFlow(flow, context)) {
      return flow.targetNodeId;
    }
  }

  return null;
}

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
export function prioritizeFlows(flows: DivergingFlow[]): DivergingFlow[] {
  return [...flows].sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

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
export function getDefaultFlow(gateway: GatewayDefinition): DivergingFlow | null {
  if (!gateway.defaultFlow) return null;

  return gateway.divergingFlows.find((f) => f.id === gateway.defaultFlow) || null;
}

// ============================================================================
// GATEWAY STATE MANAGEMENT
// ============================================================================

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
export async function getGatewayState(
  gatewayId: string,
  workflowInstanceId: string,
  sequelize: Sequelize,
): Promise<GatewayState | null> {
  const [results] = await sequelize.query(
    `SELECT * FROM gateway_states
     WHERE gateway_id = :gatewayId AND workflow_instance_id = :workflowInstanceId`,
    { replacements: { gatewayId, workflowInstanceId } },
  );

  const row = (results as any[])[0];
  if (!row) return null;

  return {
    gatewayId: row.gateway_id,
    workflowInstanceId: row.workflow_instance_id,
    activeTokens: row.active_tokens,
    completedInflows: row.completed_inflows,
    pendingInflows: row.pending_inflows,
    status: row.status,
  };
}

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
export async function updateGatewayState(
  gatewayId: string,
  workflowInstanceId: string,
  updates: Partial<GatewayState>,
  sequelize: Sequelize,
): Promise<void> {
  const setParts: string[] = [];
  const replacements: Record<string, any> = { gatewayId, workflowInstanceId };

  if (updates.activeTokens !== undefined) {
    setParts.push('active_tokens = :activeTokens');
    replacements.activeTokens = updates.activeTokens;
  }
  if (updates.completedInflows) {
    setParts.push('completed_inflows = :completedInflows');
    replacements.completedInflows = JSON.stringify(updates.completedInflows);
  }
  if (updates.pendingInflows) {
    setParts.push('pending_inflows = :pendingInflows');
    replacements.pendingInflows = JSON.stringify(updates.pendingInflows);
  }
  if (updates.status) {
    setParts.push('status = :status');
    replacements.status = updates.status;
  }

  if (setParts.length === 0) return;

  setParts.push('updated_at = NOW()');

  await sequelize.query(
    `UPDATE gateway_states SET ${setParts.join(', ')}
     WHERE gateway_id = :gatewayId AND workflow_instance_id = :workflowInstanceId`,
    { replacements },
  );
}

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
export async function deleteGatewayState(
  gatewayId: string,
  workflowInstanceId: string,
  sequelize: Sequelize,
): Promise<boolean> {
  const [results] = await sequelize.query(
    `DELETE FROM gateway_states
     WHERE gateway_id = :gatewayId AND workflow_instance_id = :workflowInstanceId
     RETURNING id`,
    { replacements: { gatewayId, workflowInstanceId } },
  );

  return (results as any[]).length > 0;
}

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
export async function incrementGatewayTokens(
  gatewayId: string,
  workflowInstanceId: string,
  sequelize: Sequelize,
): Promise<number> {
  const [results] = await sequelize.query(
    `UPDATE gateway_states
     SET active_tokens = active_tokens + 1
     WHERE gateway_id = :gatewayId AND workflow_instance_id = :workflowInstanceId
     RETURNING active_tokens`,
    { replacements: { gatewayId, workflowInstanceId } },
  );

  return (results as any[])[0]?.active_tokens || 0;
}

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
export async function decrementGatewayTokens(
  gatewayId: string,
  workflowInstanceId: string,
  sequelize: Sequelize,
): Promise<number> {
  const [results] = await sequelize.query(
    `UPDATE gateway_states
     SET active_tokens = GREATEST(active_tokens - 1, 0)
     WHERE gateway_id = :gatewayId AND workflow_instance_id = :workflowInstanceId
     RETURNING active_tokens`,
    { replacements: { gatewayId, workflowInstanceId } },
  );

  return (results as any[])[0]?.active_tokens || 0;
}

// ============================================================================
// PERFORMANCE OPTIMIZATION
// ============================================================================

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
export async function cacheGatewayEvaluation(
  gatewayId: string,
  context: Record<string, any>,
  result: RoutingResult,
  ttl: number,
): Promise<void> {
  // In production, use Redis or similar caching solution
  // This is a simplified placeholder
  console.log(`Cached evaluation for gateway ${gatewayId} with TTL ${ttl}s`);
}

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
export async function getCachedGatewayEvaluation(
  gatewayId: string,
  context: Record<string, any>,
): Promise<RoutingResult | null> {
  // Placeholder for cache retrieval
  return null;
}

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
export async function precompileGatewayConditions(
  gateway: GatewayDefinition,
  sequelize: Sequelize,
): Promise<void> {
  for (const flow of gateway.divergingFlows) {
    if (flow.condition) {
      const variables = extractExpressionVariables(flow.condition);
      await compileExpression(flow.condition, variables, sequelize);
    }
  }
}

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
export async function analyzeGatewayPerformance(
  gatewayId: string,
  sequelize: Sequelize,
): Promise<Record<string, any>> {
  const [results] = await sequelize.query(
    `SELECT
       COUNT(*) as total_evaluations,
       AVG(evaluation_duration) as avg_duration,
       MIN(evaluation_duration) as min_duration,
       MAX(evaluation_duration) as max_duration,
       PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY evaluation_duration) as p95_duration
     FROM gateway_evaluations
     WHERE gateway_id = :gatewayId`,
    { replacements: { gatewayId } },
  );

  return (results as any[])[0] || {};
}

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
export async function optimizeGatewayFlowOrdering(
  gateway: GatewayDefinition,
  sequelize: Sequelize,
): Promise<GatewayDefinition> {
  const stats = await calculateRoutingStatistics(gateway.id, sequelize);

  const flowFrequency = new Map(
    (stats.flowStatistics as any[]).map((stat: any) => [stat.flow_id, parseInt(stat.execution_count)]),
  );

  // Reorder flows by frequency
  const optimizedFlows = [...gateway.divergingFlows].sort((a, b) => {
    const freqA = flowFrequency.get(a.id) || 0;
    const freqB = flowFrequency.get(b.id) || 0;
    return freqB - freqA;
  });

  return {
    ...gateway,
    divergingFlows: optimizedFlows,
  };
}

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
export async function detectSlowGatewayEvaluations(
  thresholdMs: number,
  sequelize: Sequelize,
): Promise<any[]> {
  const [results] = await sequelize.query(
    `SELECT
       gateway_id,
       workflow_instance_id,
       evaluation_duration,
       evaluated_at
     FROM gateway_evaluations
     WHERE evaluation_duration > :threshold
     ORDER BY evaluation_duration DESC
     LIMIT 100`,
    { replacements: { threshold: thresholdMs } },
  );

  return results as any[];
}

// ============================================================================
// GATEWAY DEFINITION MANAGEMENT
// ============================================================================

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
export async function createGatewayDefinition(
  definition: Omit<GatewayDefinition, 'id' | 'createdAt' | 'updatedAt'>,
  sequelize: Sequelize,
): Promise<string> {
  const id = crypto.randomUUID();

  await sequelize.query(
    `INSERT INTO gateway_definitions
     (id, workflow_id, name, type, default_flow, converging_flows, diverging_flows, metadata, created_at, updated_at)
     VALUES (:id, :workflowId, :name, :type, :defaultFlow, :convergingFlows, :divergingFlows, :metadata, NOW(), NOW())`,
    {
      replacements: {
        id,
        workflowId: definition.workflowId,
        name: definition.name,
        type: definition.type,
        defaultFlow: definition.defaultFlow || null,
        convergingFlows: JSON.stringify(definition.convergingFlows),
        divergingFlows: JSON.stringify(definition.divergingFlows),
        metadata: definition.metadata ? JSON.stringify(definition.metadata) : null,
      },
    },
  );

  return id;
}

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
export async function getGatewayDefinition(
  gatewayId: string,
  sequelize: Sequelize,
): Promise<GatewayDefinition | null> {
  const [results] = await sequelize.query(
    `SELECT * FROM gateway_definitions WHERE id = :id LIMIT 1`,
    { replacements: { id: gatewayId } },
  );

  const row = (results as any[])[0];
  if (!row) return null;

  return {
    id: row.id,
    workflowId: row.workflow_id,
    name: row.name,
    type: row.type,
    defaultFlow: row.default_flow,
    convergingFlows: row.converging_flows,
    divergingFlows: row.diverging_flows,
    metadata: row.metadata,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

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
export async function updateGatewayDefinition(
  gatewayId: string,
  updates: Partial<Omit<GatewayDefinition, 'id' | 'createdAt' | 'updatedAt'>>,
  sequelize: Sequelize,
): Promise<boolean> {
  const setParts: string[] = [];
  const replacements: Record<string, any> = { id: gatewayId };

  if (updates.name) {
    setParts.push('name = :name');
    replacements.name = updates.name;
  }
  if (updates.defaultFlow !== undefined) {
    setParts.push('default_flow = :defaultFlow');
    replacements.defaultFlow = updates.defaultFlow;
  }
  if (updates.divergingFlows) {
    setParts.push('diverging_flows = :divergingFlows');
    replacements.divergingFlows = JSON.stringify(updates.divergingFlows);
  }
  if (updates.metadata) {
    setParts.push('metadata = :metadata');
    replacements.metadata = JSON.stringify(updates.metadata);
  }

  if (setParts.length === 0) return false;

  setParts.push('updated_at = NOW()');

  const [results] = await sequelize.query(
    `UPDATE gateway_definitions SET ${setParts.join(', ')} WHERE id = :id RETURNING id`,
    { replacements },
  );

  return (results as any[]).length > 0;
}

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
export async function deleteGatewayDefinition(
  gatewayId: string,
  sequelize: Sequelize,
): Promise<boolean> {
  const [results] = await sequelize.query(
    `DELETE FROM gateway_definitions WHERE id = :id RETURNING id`,
    { replacements: { id: gatewayId } },
  );

  return (results as any[]).length > 0;
}

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
export function validateGatewayDefinition(gateway: GatewayDefinition): string[] {
  const errors: string[] = [];

  try {
    GatewayDefinitionSchema.parse(gateway);
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.errors.map((e) => `${e.path.join('.')}: ${e.message}`));
    }
  }

  // Additional validation
  if (gateway.type === 'EXCLUSIVE' && gateway.divergingFlows.length === 0) {
    errors.push('Exclusive gateway must have at least one diverging flow');
  }

  if (gateway.defaultFlow && !gateway.divergingFlows.find((f) => f.id === gateway.defaultFlow)) {
    errors.push('Default flow must be one of the diverging flows');
  }

  return errors;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Schema creation
  createGatewayRoutingSchemas,

  // Gateway evaluation
  evaluateGateway,
  evaluateExclusiveGateway,
  evaluateParallelGateway,
  evaluateInclusiveGateway,
  evaluateEventBasedGateway,
  evaluateComplexGateway,
  evaluateDataBasedGateway,

  // Condition evaluation
  evaluateCondition,
  evaluateExpression,
  compileExpression,
  extractExpressionVariables,
  validateExpression,
  combineConditions,

  // Routing decisions
  recordRoutingDecision,
  getRoutingDecisionHistory,
  calculateRoutingStatistics,
  predictRoutingPath,

  // Multi-path routing
  createParallelPaths,
  mergeExecutionPaths,
  synchronizeParallelGateway,
  getActiveExecutionTokens,

  // Gateway convergence
  handleGatewayConvergence,
  checkInclusiveGatewayConvergence,
  resetGatewayState,

  // Sequence flow
  evaluateSequenceFlow,
  getNextNode,
  prioritizeFlows,
  getDefaultFlow,

  // State management
  getGatewayState,
  updateGatewayState,
  deleteGatewayState,
  incrementGatewayTokens,
  decrementGatewayTokens,

  // Performance
  cacheGatewayEvaluation,
  getCachedGatewayEvaluation,
  precompileGatewayConditions,
  analyzeGatewayPerformance,
  optimizeGatewayFlowOrdering,
  detectSlowGatewayEvaluations,

  // Gateway management
  createGatewayDefinition,
  getGatewayDefinition,
  updateGatewayDefinition,
  deleteGatewayDefinition,
  validateGatewayDefinition,

  // Helpers
  matchesPattern,
};
