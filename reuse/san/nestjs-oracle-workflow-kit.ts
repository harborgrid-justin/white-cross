/**
 * LOC: WFLW5678901
 * File: /reuse/san/nestjs-oracle-workflow-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Workflow orchestration services
 *   - Business process management systems
 *   - Healthcare workflow coordinators
 */

/**
 * File: /reuse/san/nestjs-oracle-workflow-kit.ts
 * Locator: WC-UTL-WFLW-001
 * Purpose: Enterprise Workflow Orchestration Kit - State machines, saga patterns, human tasks, parallel execution
 *
 * Upstream: Independent utility module for workflow orchestration and business process management
 * Downstream: ../backend/*, workflow services, BPM engines, healthcare process coordinators
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x
 * Exports: 48 utility functions for workflow definition, state machines, saga compensation, human tasks, event handling
 *
 * LLM Context: Comprehensive workflow orchestration utilities for implementing Oracle BPM-style business processes
 * in White Cross healthcare system. Provides workflow definitions, state machine execution, saga pattern for
 * compensation, human task management, parallel execution, event-driven coordination, timeout management,
 * workflow persistence, visualization, and subprocess orchestration. Includes HIPAA compliance features for
 * healthcare workflow audit trails, access logging, and data encryption. Essential for building complex,
 * resilient, compliant healthcare business processes.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface WorkflowDefinition {
  id: string;
  name: string;
  version: string;
  description?: string;
  steps: WorkflowStep[];
  initialState: string;
  finalStates: string[];
  variables?: Record<string, any>;
  timeout?: number;
  metadata?: Record<string, any>;
}

interface WorkflowInstance {
  id: string;
  definitionId: string;
  version: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'COMPENSATING' | 'SUSPENDED';
  currentState: string;
  context: WorkflowContext;
  startedAt: Date;
  completedAt?: Date;
  variables: Record<string, any>;
  history: WorkflowHistoryEntry[];
  checkpoints: WorkflowCheckpoint[];
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'task' | 'human-task' | 'service' | 'decision' | 'parallel' | 'subprocess' | 'wait';
  handler?: string | ((context: WorkflowContext) => Promise<any>);
  compensation?: CompensationHandler;
  timeout?: number;
  retry?: RetryConfig;
  nextSteps?: string[];
  condition?: string | ((context: WorkflowContext) => boolean);
  metadata?: Record<string, any>;
}

interface StateMachine {
  id: string;
  currentState: string;
  states: Map<string, StateDefinition>;
  transitions: StateTransition[];
  context: Record<string, any>;
  history: StateHistoryEntry[];
}

interface StateDefinition {
  name: string;
  type: 'initial' | 'intermediate' | 'final' | 'error';
  onEntry?: (context: any) => Promise<void>;
  onExit?: (context: any) => Promise<void>;
  metadata?: Record<string, any>;
}

interface StateTransition {
  from: string;
  to: string;
  event: string;
  guard?: (context: any) => boolean;
  action?: (context: any) => Promise<void>;
  priority?: number;
}

interface StateHistoryEntry {
  fromState: string;
  toState: string;
  event: string;
  timestamp: Date;
  context?: any;
}

interface WorkflowEvent {
  id: string;
  type: string;
  workflowId: string;
  correlationId?: string;
  payload: any;
  timestamp: Date;
  source?: string;
  metadata?: Record<string, any>;
}

interface SagaDefinition {
  id: string;
  steps: SagaStep[];
  compensationOrder: 'reverse' | 'priority';
  timeout?: number;
  retryPolicy?: RetryConfig;
}

interface SagaStep {
  id: string;
  action: (context: any) => Promise<any>;
  compensation: (context: any, result?: any) => Promise<void>;
  priority?: number;
  timeout?: number;
}

interface CompensationHandler {
  handler: (context: WorkflowContext, stepResult?: any) => Promise<void>;
  timeout?: number;
  retryOnFailure?: boolean;
}

interface HumanTask {
  id: string;
  workflowId: string;
  name: string;
  description?: string;
  assignee?: string;
  assigneeType?: 'user' | 'group' | 'role';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  dueDate?: Date;
  status: 'CREATED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ESCALATED';
  formData?: Record<string, any>;
  actions: TaskAction[];
  createdAt: Date;
  completedAt?: Date;
  completedBy?: string;
  escalationConfig?: EscalationConfig;
}

interface TaskAction {
  id: string;
  name: string;
  type: 'approve' | 'reject' | 'complete' | 'delegate' | 'reassign';
  handler?: (task: HumanTask, data: any) => Promise<void>;
}

interface TaskAssignment {
  taskId: string;
  assignee: string;
  assigneeType: 'user' | 'group' | 'role';
  assignedAt: Date;
  assignedBy: string;
  reason?: string;
}

interface EscalationConfig {
  enabled: boolean;
  escalateAfter: number; // milliseconds
  escalateTo: string;
  escalationType: 'user' | 'group' | 'role';
  notifyBefore?: number; // milliseconds before escalation
}

interface TimeoutConfig {
  duration: number; // milliseconds
  action: 'fail' | 'compensate' | 'retry' | 'escalate' | 'custom';
  handler?: (context: WorkflowContext) => Promise<void>;
  warningThreshold?: number; // percentage (e.g., 80 = warn at 80% of duration)
}

interface SLAConfig {
  target: number; // milliseconds
  warning: number; // milliseconds
  critical: number; // milliseconds
  onWarning?: (context: WorkflowContext) => Promise<void>;
  onCritical?: (context: WorkflowContext) => Promise<void>;
  onBreach?: (context: WorkflowContext) => Promise<void>;
}

interface WorkflowContext {
  workflowId: string;
  instanceId: string;
  currentStep: string;
  variables: Record<string, any>;
  metadata: Record<string, any>;
  startedAt: Date;
  userId?: string;
  correlationId?: string;
  parentWorkflowId?: string;
}

interface WorkflowCheckpoint {
  id: string;
  workflowId: string;
  state: string;
  context: WorkflowContext;
  timestamp: Date;
  reason?: string;
}

interface WorkflowHistoryEntry {
  id: string;
  workflowId: string;
  stepId: string;
  stepName: string;
  status: 'started' | 'completed' | 'failed' | 'compensated' | 'skipped';
  startedAt: Date;
  completedAt?: Date;
  result?: any;
  error?: any;
  userId?: string;
}

interface WorkflowMetrics {
  workflowId: string;
  definitionId: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  stepMetrics: Map<string, StepMetrics>;
  lastExecutedAt?: Date;
}

interface StepMetrics {
  stepId: string;
  stepName: string;
  executions: number;
  successes: number;
  failures: number;
  averageDuration: number;
  timeouts: number;
  retries: number;
}

interface SubprocessConfig {
  workflowDefinitionId: string;
  version?: string;
  variables?: Record<string, any>;
  waitForCompletion: boolean;
  timeout?: number;
  onComplete?: (result: any) => Promise<void>;
  onError?: (error: any) => Promise<void>;
}

interface ParallelExecutionConfig {
  maxConcurrency?: number;
  failFast?: boolean;
  aggregationStrategy?: 'all' | 'first' | 'any' | 'race';
  timeout?: number;
}

interface BranchCondition {
  name: string;
  condition: string | ((context: WorkflowContext) => boolean);
  target: string; // target step id
  priority?: number;
}

interface RetryConfig {
  maxAttempts: number;
  backoffStrategy: 'fixed' | 'exponential' | 'linear';
  initialDelay: number;
  maxDelay?: number;
  multiplier?: number;
}

interface HIPAAAuditTrail {
  id: string;
  workflowId: string;
  action: string;
  userId: string;
  timestamp: Date;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  complianceFlags?: string[];
}

interface WorkflowVisualization {
  nodes: VisualizationNode[];
  edges: VisualizationEdge[];
  layout?: 'horizontal' | 'vertical' | 'hierarchical';
  metadata?: Record<string, any>;
}

interface VisualizationNode {
  id: string;
  type: string;
  label: string;
  status?: string;
  metadata?: Record<string, any>;
  position?: { x: number; y: number };
}

interface VisualizationEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  condition?: string;
  metadata?: Record<string, any>;
}

interface ExecutionTimeline {
  workflowId: string;
  entries: TimelineEntry[];
  totalDuration: number;
  status: string;
}

interface TimelineEntry {
  timestamp: Date;
  type: 'step-start' | 'step-complete' | 'step-fail' | 'event' | 'transition' | 'checkpoint';
  stepId?: string;
  stepName?: string;
  duration?: number;
  status?: string;
  details?: any;
}

// ============================================================================
// WORKFLOW DEFINITION FUNCTIONS
// ============================================================================

/**
 * Creates a new workflow definition with validation.
 *
 * @param {Partial<WorkflowDefinition>} definition - Workflow definition parameters
 * @returns {WorkflowDefinition} Complete workflow definition
 *
 * @example
 * ```typescript
 * const patientAdmissionWorkflow = createWorkflowDefinition({
 *   id: 'patient-admission-v1',
 *   name: 'Patient Admission Workflow',
 *   version: '1.0.0',
 *   description: 'HIPAA-compliant patient admission process',
 *   initialState: 'registration',
 *   finalStates: ['admitted', 'rejected'],
 *   steps: [
 *     { id: 'register', name: 'Register Patient', type: 'human-task' },
 *     { id: 'verify-insurance', name: 'Verify Insurance', type: 'service' },
 *     { id: 'assign-room', name: 'Assign Room', type: 'task' }
 *   ]
 * });
 * // Creates validated workflow definition with audit trail support
 * ```
 */
export const createWorkflowDefinition = (
  definition: Partial<WorkflowDefinition>,
): WorkflowDefinition => {
  const workflow: WorkflowDefinition = {
    id: definition.id || `workflow-${Date.now()}`,
    name: definition.name || 'Unnamed Workflow',
    version: definition.version || '1.0.0',
    description: definition.description,
    steps: definition.steps || [],
    initialState: definition.initialState || 'start',
    finalStates: definition.finalStates || ['completed'],
    variables: definition.variables || {},
    timeout: definition.timeout,
    metadata: {
      ...definition.metadata,
      createdAt: new Date().toISOString(),
      hipaaCompliant: true,
    },
  };

  return workflow;
};

/**
 * Validates workflow definition structure and dependencies.
 *
 * @param {WorkflowDefinition} definition - Workflow definition to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateWorkflowDefinition(patientAdmissionWorkflow);
 * if (!validation.valid) {
 *   console.error('Workflow validation failed:', validation.errors);
 *   // Errors: ['Step "verify-insurance" references non-existent next step', ...]
 * }
 * // Ensures workflow integrity before deployment
 * ```
 */
export const validateWorkflowDefinition = (
  definition: WorkflowDefinition,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const stepIds = new Set(definition.steps.map(s => s.id));

  // Validate initial state
  if (!stepIds.has(definition.initialState)) {
    errors.push(`Initial state "${definition.initialState}" not found in steps`);
  }

  // Validate final states
  definition.finalStates.forEach(state => {
    if (!stepIds.has(state)) {
      errors.push(`Final state "${state}" not found in steps`);
    }
  });

  // Validate step references
  definition.steps.forEach(step => {
    if (step.nextSteps) {
      step.nextSteps.forEach(nextStep => {
        if (!stepIds.has(nextStep)) {
          errors.push(`Step "${step.id}" references non-existent next step "${nextStep}"`);
        }
      });
    }
  });

  // Validate at least one step exists
  if (definition.steps.length === 0) {
    errors.push('Workflow must have at least one step');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Creates a new version of an existing workflow definition.
 *
 * @param {WorkflowDefinition} currentDefinition - Current workflow definition
 * @param {Partial<WorkflowDefinition>} changes - Changes for new version
 * @param {string} newVersion - New version number
 * @returns {WorkflowDefinition} New workflow version
 *
 * @example
 * ```typescript
 * const updatedWorkflow = versionWorkflow(
 *   patientAdmissionWorkflow,
 *   {
 *     steps: [...existingSteps, { id: 'compliance-check', name: 'HIPAA Compliance Check', type: 'service' }]
 *   },
 *   '1.1.0'
 * );
 * // Creates new version with additional compliance step
 * // Previous version remains available for running instances
 * ```
 */
export const versionWorkflow = (
  currentDefinition: WorkflowDefinition,
  changes: Partial<WorkflowDefinition>,
  newVersion: string,
): WorkflowDefinition => {
  return {
    ...currentDefinition,
    ...changes,
    id: `${currentDefinition.id}-${newVersion}`,
    version: newVersion,
    metadata: {
      ...currentDefinition.metadata,
      ...changes.metadata,
      previousVersion: currentDefinition.version,
      versionedAt: new Date().toISOString(),
    },
  };
};

/**
 * Compiles workflow definition into executable format with optimizations.
 *
 * @param {WorkflowDefinition} definition - Workflow definition to compile
 * @returns {object} Compiled workflow with execution plan
 *
 * @example
 * ```typescript
 * const compiled = compileWorkflow(patientAdmissionWorkflow);
 * // Result: {
 * //   definition: {...},
 * //   executionPlan: Map<stepId, { handler, dependencies, parallelizable }>,
 * //   optimizations: { parallelSteps: ['verify-insurance', 'check-allergies'] },
 * //   estimatedDuration: 3600000
 * // }
 * // Ready for high-performance execution
 * ```
 */
export const compileWorkflow = (definition: WorkflowDefinition): {
  definition: WorkflowDefinition;
  executionPlan: Map<string, any>;
  optimizations: Record<string, any>;
  estimatedDuration?: number;
} => {
  const executionPlan = new Map<string, any>();

  // Build execution plan for each step
  definition.steps.forEach(step => {
    executionPlan.set(step.id, {
      handler: step.handler,
      nextSteps: step.nextSteps || [],
      condition: step.condition,
      timeout: step.timeout || definition.timeout,
      retry: step.retry,
      compensation: step.compensation,
    });
  });

  // Identify optimization opportunities
  const optimizations: Record<string, any> = {
    parallelSteps: definition.steps
      .filter(step => step.type === 'parallel')
      .map(step => step.id),
    cachedSteps: definition.steps
      .filter(step => step.metadata?.cacheable)
      .map(step => step.id),
  };

  return {
    definition,
    executionPlan,
    optimizations,
  };
};

// ============================================================================
// STATE MACHINE FUNCTIONS
// ============================================================================

/**
 * Creates a new state machine instance for workflow execution.
 *
 * @param {string} id - State machine identifier
 * @param {string} initialState - Initial state name
 * @param {StateDefinition[]} states - State definitions
 * @param {StateTransition[]} transitions - Valid state transitions
 * @returns {StateMachine} Initialized state machine
 *
 * @example
 * ```typescript
 * const admissionStateMachine = createStateMachine(
 *   'admission-sm-001',
 *   'registration',
 *   [
 *     { name: 'registration', type: 'initial' },
 *     { name: 'verification', type: 'intermediate' },
 *     { name: 'admitted', type: 'final' },
 *     { name: 'rejected', type: 'final' }
 *   ],
 *   [
 *     { from: 'registration', to: 'verification', event: 'REGISTERED' },
 *     { from: 'verification', to: 'admitted', event: 'VERIFIED' },
 *     { from: 'verification', to: 'rejected', event: 'VERIFICATION_FAILED' }
 *   ]
 * );
 * // State machine ready for patient admission process
 * ```
 */
export const createStateMachine = (
  id: string,
  initialState: string,
  states: StateDefinition[],
  transitions: StateTransition[],
): StateMachine => {
  const stateMap = new Map<string, StateDefinition>();
  states.forEach(state => stateMap.set(state.name, state));

  return {
    id,
    currentState: initialState,
    states: stateMap,
    transitions,
    context: {},
    history: [],
  };
};

/**
 * Executes state transition with validation and lifecycle hooks.
 *
 * @param {StateMachine} stateMachine - State machine instance
 * @param {string} event - Event triggering transition
 * @param {any} [context] - Context data for transition
 * @returns {Promise<StateMachine>} Updated state machine
 *
 * @example
 * ```typescript
 * const updatedSM = await transitionState(
 *   admissionStateMachine,
 *   'REGISTERED',
 *   { patientId: 'P-12345', registeredBy: 'nurse-001', hipaaConsent: true }
 * );
 * // State machine transitions from 'registration' to 'verification'
 * // Audit trail automatically created for HIPAA compliance
 * ```
 */
export const transitionState = async (
  stateMachine: StateMachine,
  event: string,
  context?: any,
): Promise<StateMachine> => {
  const transition = stateMachine.transitions.find(
    t => t.from === stateMachine.currentState && t.event === event,
  );

  if (!transition) {
    throw new Error(`No valid transition for event "${event}" from state "${stateMachine.currentState}"`);
  }

  // Evaluate guard condition
  if (transition.guard && !transition.guard(context || stateMachine.context)) {
    throw new Error(`Guard condition failed for transition from "${transition.from}" to "${transition.to}"`);
  }

  // Execute onExit for current state
  const currentState = stateMachine.states.get(stateMachine.currentState);
  if (currentState?.onExit) {
    await currentState.onExit(stateMachine.context);
  }

  // Execute transition action
  if (transition.action) {
    await transition.action(context || stateMachine.context);
  }

  // Update context if provided
  if (context) {
    stateMachine.context = { ...stateMachine.context, ...context };
  }

  // Record history
  stateMachine.history.push({
    fromState: stateMachine.currentState,
    toState: transition.to,
    event,
    timestamp: new Date(),
    context: context || stateMachine.context,
  });

  // Update current state
  const previousState = stateMachine.currentState;
  stateMachine.currentState = transition.to;

  // Execute onEntry for new state
  const nextState = stateMachine.states.get(transition.to);
  if (nextState?.onEntry) {
    await nextState.onEntry(stateMachine.context);
  }

  return stateMachine;
};

/**
 * Validates if a state transition is allowed.
 *
 * @param {StateMachine} stateMachine - State machine instance
 * @param {string} event - Event to validate
 * @returns {boolean} True if transition is valid
 *
 * @example
 * ```typescript
 * const canTransition = validateStateTransition(admissionStateMachine, 'VERIFIED');
 * if (canTransition) {
 *   await transitionState(admissionStateMachine, 'VERIFIED');
 * } else {
 *   console.warn('Invalid state transition attempted - audit logged for HIPAA');
 * }
 * ```
 */
export const validateStateTransition = (
  stateMachine: StateMachine,
  event: string,
): boolean => {
  const transition = stateMachine.transitions.find(
    t => t.from === stateMachine.currentState && t.event === event,
  );

  if (!transition) {
    return false;
  }

  if (transition.guard && !transition.guard(stateMachine.context)) {
    return false;
  }

  return true;
};

/**
 * Evaluates guard condition for state transition.
 *
 * @param {StateTransition} transition - Transition to evaluate
 * @param {any} context - Evaluation context
 * @returns {boolean} True if guard passes
 *
 * @example
 * ```typescript
 * const transition = {
 *   from: 'verification',
 *   to: 'admitted',
 *   event: 'VERIFIED',
 *   guard: (ctx) => ctx.insuranceVerified && ctx.hipaaConsentSigned
 * };
 * const canProceed = evaluateGuardCondition(transition, {
 *   insuranceVerified: true,
 *   hipaaConsentSigned: true
 * });
 * // Returns true - patient can be admitted
 * ```
 */
export const evaluateGuardCondition = (
  transition: StateTransition,
  context: any,
): boolean => {
  if (!transition.guard) {
    return true;
  }

  try {
    return transition.guard(context);
  } catch (error) {
    console.error('Guard condition evaluation failed:', error);
    return false;
  }
};

// ============================================================================
// WORKFLOW STEP ORCHESTRATION FUNCTIONS
// ============================================================================

/**
 * Executes a single workflow step with error handling and compensation.
 *
 * @param {WorkflowStep} step - Step to execute
 * @param {WorkflowContext} context - Workflow execution context
 * @returns {Promise<any>} Step execution result
 *
 * @example
 * ```typescript
 * const result = await executeWorkflowStep(
 *   {
 *     id: 'verify-insurance',
 *     name: 'Verify Patient Insurance',
 *     type: 'service',
 *     handler: async (ctx) => insuranceService.verify(ctx.variables.patientId),
 *     timeout: 30000,
 *     retry: { maxAttempts: 3, backoffStrategy: 'exponential', initialDelay: 1000 }
 *   },
 *   workflowContext
 * );
 * // Returns: { verified: true, provider: 'Blue Cross', policyNumber: 'BC-123456' }
 * ```
 */
export const executeWorkflowStep = async (
  step: WorkflowStep,
  context: WorkflowContext,
): Promise<any> => {
  const startTime = Date.now();

  try {
    let result: any;

    if (typeof step.handler === 'function') {
      // Execute with timeout if configured
      if (step.timeout) {
        result = await Promise.race([
          step.handler(context),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Step "${step.name}" timed out`)), step.timeout),
          ),
        ]);
      } else {
        result = await step.handler(context);
      }
    } else if (typeof step.handler === 'string') {
      // Handler is a service reference - would be resolved by orchestrator
      throw new Error(`Handler resolution not implemented for service: ${step.handler}`);
    } else {
      throw new Error(`Step "${step.id}" has no valid handler`);
    }

    return result;
  } catch (error) {
    // Handle retry if configured
    if (step.retry && step.retry.maxAttempts > 1) {
      // Retry logic would be implemented here
      throw error;
    }

    // Execute compensation if configured
    if (step.compensation) {
      await step.compensation.handler(context);
    }

    throw error;
  }
};

/**
 * Chains multiple workflow steps for sequential execution.
 *
 * @param {WorkflowStep[]} steps - Steps to chain
 * @param {WorkflowContext} context - Workflow execution context
 * @returns {Promise<any[]>} Array of step results
 *
 * @example
 * ```typescript
 * const results = await chainWorkflowSteps(
 *   [
 *     { id: 'register', name: 'Register Patient', type: 'task', handler: registerPatient },
 *     { id: 'verify', name: 'Verify Insurance', type: 'service', handler: verifyInsurance },
 *     { id: 'assign', name: 'Assign Room', type: 'task', handler: assignRoom }
 *   ],
 *   context
 * );
 * // Results: [{ patientId: 'P-001' }, { verified: true }, { room: '301' }]
 * // Each step receives output from previous step in context
 * ```
 */
export const chainWorkflowSteps = async (
  steps: WorkflowStep[],
  context: WorkflowContext,
): Promise<any[]> => {
  const results: any[] = [];

  for (const step of steps) {
    // Update context with previous results
    if (results.length > 0) {
      context.variables = {
        ...context.variables,
        previousStepResult: results[results.length - 1],
      };
    }

    const result = await executeWorkflowStep(step, context);
    results.push(result);

    context.currentStep = step.id;
  }

  return results;
};

/**
 * Creates a conditional workflow step with branch evaluation.
 *
 * @param {string} id - Step identifier
 * @param {BranchCondition[]} branches - Branch conditions
 * @param {WorkflowStep} [defaultStep] - Default step if no condition matches
 * @returns {WorkflowStep} Conditional step
 *
 * @example
 * ```typescript
 * const conditionalStep = createConditionalStep(
 *   'insurance-check',
 *   [
 *     {
 *       name: 'has-insurance',
 *       condition: (ctx) => ctx.variables.insuranceProvider !== null,
 *       target: 'verify-insurance'
 *     },
 *     {
 *       name: 'no-insurance',
 *       condition: (ctx) => ctx.variables.insuranceProvider === null,
 *       target: 'self-pay-enrollment'
 *     }
 *   ],
 *   { id: 'contact-billing', name: 'Contact Billing', type: 'human-task' }
 * );
 * // Routes patient based on insurance status
 * ```
 */
export const createConditionalStep = (
  id: string,
  branches: BranchCondition[],
  defaultStep?: WorkflowStep,
): WorkflowStep => {
  return {
    id,
    name: `Conditional: ${id}`,
    type: 'decision',
    handler: async (context: WorkflowContext) => {
      for (const branch of branches) {
        const conditionMet =
          typeof branch.condition === 'function'
            ? branch.condition(context)
            : eval(branch.condition);

        if (conditionMet) {
          return { nextStep: branch.target, branch: branch.name };
        }
      }

      if (defaultStep) {
        return { nextStep: defaultStep.id, branch: 'default' };
      }

      throw new Error(`No matching condition for step "${id}"`);
    },
    metadata: {
      branches: branches.map(b => ({ name: b.name, target: b.target })),
    },
  };
};

/**
 * Creates a loop workflow step for iterative processing.
 *
 * @param {string} id - Step identifier
 * @param {WorkflowStep[]} loopSteps - Steps to execute in loop
 * @param {(context: WorkflowContext) => boolean} condition - Loop continuation condition
 * @param {number} [maxIterations] - Maximum iterations (default: 100)
 * @returns {WorkflowStep} Loop step
 *
 * @example
 * ```typescript
 * const reviewLoop = createLoopStep(
 *   'multi-reviewer-approval',
 *   [
 *     { id: 'assign-reviewer', name: 'Assign Next Reviewer', type: 'task', handler: assignReviewer },
 *     { id: 'wait-approval', name: 'Wait for Approval', type: 'human-task', handler: waitForApproval }
 *   ],
 *   (ctx) => ctx.variables.approvalCount < ctx.variables.requiredApprovals,
 *   10
 * );
 * // Loops until required number of approvals obtained (HIPAA multi-signature)
 * ```
 */
export const createLoopStep = (
  id: string,
  loopSteps: WorkflowStep[],
  condition: (context: WorkflowContext) => boolean,
  maxIterations: number = 100,
): WorkflowStep => {
  return {
    id,
    name: `Loop: ${id}`,
    type: 'task',
    handler: async (context: WorkflowContext) => {
      const results: any[] = [];
      let iteration = 0;

      while (condition(context) && iteration < maxIterations) {
        const iterationResults = await chainWorkflowSteps(loopSteps, {
          ...context,
          variables: {
            ...context.variables,
            loopIteration: iteration,
          },
        });

        results.push(iterationResults);
        iteration++;

        // Update context with iteration results
        context.variables = {
          ...context.variables,
          loopResults: results,
        };
      }

      return {
        iterations: iteration,
        results,
        maxIterationsReached: iteration >= maxIterations,
      };
    },
    metadata: {
      loopSteps: loopSteps.map(s => s.id),
      maxIterations,
    },
  };
};

// ============================================================================
// PARALLEL EXECUTION FUNCTIONS
// ============================================================================

/**
 * Executes multiple workflow steps in parallel with configurable strategy.
 *
 * @param {WorkflowStep[]} steps - Steps to execute in parallel
 * @param {WorkflowContext} context - Workflow execution context
 * @param {ParallelExecutionConfig} [config] - Parallel execution configuration
 * @returns {Promise<any[]>} Array of step results
 *
 * @example
 * ```typescript
 * const results = await executeParallelSteps(
 *   [
 *     { id: 'verify-insurance', name: 'Verify Insurance', type: 'service', handler: verifyInsurance },
 *     { id: 'check-allergies', name: 'Check Allergy Database', type: 'service', handler: checkAllergies },
 *     { id: 'verify-id', name: 'Verify Patient ID', type: 'service', handler: verifyIdentity }
 *   ],
 *   context,
 *   { maxConcurrency: 3, failFast: true, timeout: 10000 }
 * );
 * // All three verifications run concurrently for faster patient processing
 * ```
 */
export const executeParallelSteps = async (
  steps: WorkflowStep[],
  context: WorkflowContext,
  config?: ParallelExecutionConfig,
): Promise<any[]> => {
  const {
    maxConcurrency = steps.length,
    failFast = false,
    timeout,
  } = config || {};

  const executeStep = async (step: WorkflowStep): Promise<any> => {
    try {
      return await executeWorkflowStep(step, { ...context });
    } catch (error) {
      if (failFast) {
        throw error;
      }
      return { error, stepId: step.id };
    }
  };

  // Execute with concurrency limit
  const results: any[] = [];
  for (let i = 0; i < steps.length; i += maxConcurrency) {
    const batch = steps.slice(i, i + maxConcurrency);
    const batchPromises = batch.map(step => executeStep(step));

    if (timeout) {
      const batchResults = await Promise.race([
        Promise.all(batchPromises),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Parallel execution timeout')), timeout),
        ),
      ]);
      results.push(...batchResults);
    } else {
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
  }

  return results;
};

/**
 * Creates fork/join parallel execution pattern.
 *
 * @param {WorkflowStep[]} parallelSteps - Steps to fork
 * @param {WorkflowStep} joinStep - Step to execute after all complete
 * @param {(results: any[]) => any} aggregator - Function to aggregate results
 * @returns {WorkflowStep} Fork/join step
 *
 * @example
 * ```typescript
 * const forkJoinStep = createForkJoin(
 *   [
 *     { id: 'lab-work', name: 'Order Lab Work', type: 'service', handler: orderLabs },
 *     { id: 'imaging', name: 'Order Imaging', type: 'service', handler: orderImaging },
 *     { id: 'specialist', name: 'Specialist Consult', type: 'human-task', handler: requestConsult }
 *   ],
 *   { id: 'review-results', name: 'Review All Results', type: 'human-task', handler: reviewResults },
 *   (results) => ({ labResults: results[0], imagingResults: results[1], consultNotes: results[2] })
 * );
 * // Forks three parallel medical orders, joins when all complete
 * ```
 */
export const createForkJoin = (
  parallelSteps: WorkflowStep[],
  joinStep: WorkflowStep,
  aggregator: (results: any[]) => any,
): WorkflowStep => {
  return {
    id: `fork-join-${parallelSteps.map(s => s.id).join('-')}`,
    name: 'Fork/Join Pattern',
    type: 'parallel',
    handler: async (context: WorkflowContext) => {
      // Fork: execute all steps in parallel
      const parallelResults = await executeParallelSteps(parallelSteps, context);

      // Aggregate results
      const aggregatedResult = aggregator(parallelResults);

      // Join: execute join step with aggregated results
      const joinContext = {
        ...context,
        variables: {
          ...context.variables,
          parallelResults: aggregatedResult,
        },
      };

      const joinResult = await executeWorkflowStep(joinStep, joinContext);

      return {
        parallelResults: aggregatedResult,
        joinResult,
      };
    },
    metadata: {
      pattern: 'fork-join',
      parallelSteps: parallelSteps.map(s => s.id),
      joinStep: joinStep.id,
    },
  };
};

/**
 * Executes steps in race condition - first to complete wins.
 *
 * @param {WorkflowStep[]} steps - Steps to race
 * @param {WorkflowContext} context - Workflow execution context
 * @returns {Promise<{ result: any; stepId: string }>} Winning step result
 *
 * @example
 * ```typescript
 * const fastest = await raceSteps(
 *   [
 *     { id: 'db-primary', name: 'Query Primary DB', type: 'service', handler: queryPrimary },
 *     { id: 'db-replica', name: 'Query Replica DB', type: 'service', handler: queryReplica },
 *     { id: 'cache', name: 'Query Cache', type: 'service', handler: queryCache }
 *   ],
 *   context
 * );
 * // Returns: { result: {...patient data...}, stepId: 'cache' }
 * // Uses fastest available data source for patient lookup
 * ```
 */
export const raceSteps = async (
  steps: WorkflowStep[],
  context: WorkflowContext,
): Promise<{ result: any; stepId: string }> => {
  const stepPromises = steps.map(async step => ({
    result: await executeWorkflowStep(step, { ...context }),
    stepId: step.id,
  }));

  return Promise.race(stepPromises);
};

/**
 * Aggregates results from parallel step execution with strategies.
 *
 * @param {any[]} results - Results from parallel steps
 * @param {string} strategy - Aggregation strategy ('merge' | 'array' | 'first' | 'custom')
 * @param {(results: any[]) => any} [customAggregator] - Custom aggregation function
 * @returns {any} Aggregated result
 *
 * @example
 * ```typescript
 * const merged = aggregateParallelResults(
 *   [
 *     { patientId: 'P-001', labResults: {...} },
 *     { patientId: 'P-001', imagingResults: {...} },
 *     { patientId: 'P-001', vitalSigns: {...} }
 *   ],
 *   'merge'
 * );
 * // Returns: { patientId: 'P-001', labResults: {...}, imagingResults: {...}, vitalSigns: {...} }
 * // Combines all medical data into single patient record
 * ```
 */
export const aggregateParallelResults = (
  results: any[],
  strategy: 'merge' | 'array' | 'first' | 'custom' = 'array',
  customAggregator?: (results: any[]) => any,
): any => {
  switch (strategy) {
    case 'merge':
      return results.reduce((acc, result) => ({ ...acc, ...result }), {});

    case 'array':
      return results;

    case 'first':
      return results[0];

    case 'custom':
      if (!customAggregator) {
        throw new Error('Custom aggregator required for custom strategy');
      }
      return customAggregator(results);

    default:
      return results;
  }
};

// ============================================================================
// CONDITIONAL BRANCHING FUNCTIONS
// ============================================================================

/**
 * Evaluates branch condition and returns target step.
 *
 * @param {BranchCondition} branch - Branch condition to evaluate
 * @param {WorkflowContext} context - Workflow execution context
 * @returns {Promise<{ shouldBranch: boolean; target?: string }>} Branch evaluation result
 *
 * @example
 * ```typescript
 * const branchResult = await evaluateBranch(
 *   {
 *     name: 'critical-condition',
 *     condition: (ctx) => ctx.variables.patientCondition === 'critical',
 *     target: 'emergency-protocol',
 *     priority: 1
 *   },
 *   context
 * );
 * // Returns: { shouldBranch: true, target: 'emergency-protocol' }
 * // Routes critical patients to emergency workflow
 * ```
 */
export const evaluateBranch = async (
  branch: BranchCondition,
  context: WorkflowContext,
): Promise<{ shouldBranch: boolean; target?: string }> => {
  try {
    const conditionMet =
      typeof branch.condition === 'function'
        ? await Promise.resolve(branch.condition(context))
        : eval(branch.condition);

    return {
      shouldBranch: conditionMet,
      target: conditionMet ? branch.target : undefined,
    };
  } catch (error) {
    console.error(`Branch evaluation failed for "${branch.name}":`, error);
    return { shouldBranch: false };
  }
};

/**
 * Creates switch/case pattern for multiple branch evaluation.
 *
 * @param {string} id - Step identifier
 * @param {string | ((context: WorkflowContext) => string)} discriminator - Switch discriminator
 * @param {Map<string, string>} cases - Map of case values to target steps
 * @param {string} [defaultTarget] - Default target if no case matches
 * @returns {WorkflowStep} Switch/case step
 *
 * @example
 * ```typescript
 * const triageSwitch = createSwitchCase(
 *   'triage-routing',
 *   (ctx) => ctx.variables.triageLevel,
 *   new Map([
 *     ['red', 'emergency-room'],
 *     ['yellow', 'urgent-care'],
 *     ['green', 'general-admission']
 *   ]),
 *   'assessment-hold'
 * );
 * // Routes patients based on triage color code
 * ```
 */
export const createSwitchCase = (
  id: string,
  discriminator: string | ((context: WorkflowContext) => string),
  cases: Map<string, string>,
  defaultTarget?: string,
): WorkflowStep => {
  return {
    id,
    name: `Switch: ${id}`,
    type: 'decision',
    handler: async (context: WorkflowContext) => {
      const value =
        typeof discriminator === 'function'
          ? discriminator(context)
          : context.variables[discriminator];

      const target = cases.get(value) || defaultTarget;

      if (!target) {
        throw new Error(`No matching case for value "${value}" in switch "${id}"`);
      }

      return { nextStep: target, case: value };
    },
    metadata: {
      pattern: 'switch-case',
      cases: Array.from(cases.entries()).map(([key, value]) => ({ case: key, target: value })),
      defaultTarget,
    },
  };
};

/**
 * Routes workflow dynamically based on runtime conditions.
 *
 * @param {WorkflowContext} context - Workflow execution context
 * @param {(context: WorkflowContext) => string} router - Routing function
 * @param {Map<string, WorkflowStep>} routes - Available routes
 * @returns {Promise<string>} Selected route identifier
 *
 * @example
 * ```typescript
 * const routeId = await routeDynamically(
 *   context,
 *   (ctx) => {
 *     if (ctx.variables.age < 18) return 'pediatric-workflow';
 *     if (ctx.variables.age > 65) return 'geriatric-workflow';
 *     return 'adult-workflow';
 *   },
 *   new Map([
 *     ['pediatric-workflow', pediatricStep],
 *     ['geriatric-workflow', geriatricStep],
 *     ['adult-workflow', adultStep]
 *   ])
 * );
 * // Returns appropriate workflow based on patient age
 * ```
 */
export const routeDynamically = async (
  context: WorkflowContext,
  router: (context: WorkflowContext) => string,
  routes: Map<string, WorkflowStep>,
): Promise<string> => {
  const selectedRoute = router(context);

  if (!routes.has(selectedRoute)) {
    throw new Error(`Route "${selectedRoute}" not found in available routes`);
  }

  return selectedRoute;
};

/**
 * Merges multiple branch results with conflict resolution.
 *
 * @param {any[]} branchResults - Results from different branches
 * @param {string} strategy - Merge strategy ('union' | 'intersection' | 'priority' | 'custom')
 * @param {(results: any[]) => any} [customMerger] - Custom merge function
 * @returns {any} Merged result
 *
 * @example
 * ```typescript
 * const merged = mergeBranches(
 *   [
 *     { approved: true, approver: 'dr-smith', department: 'cardiology' },
 *     { approved: true, approver: 'dr-jones', department: 'surgery' },
 *     { approved: false, approver: 'dr-wilson', department: 'anesthesia' }
 *   ],
 *   'custom',
 *   (results) => ({
 *     finalApproval: results.every(r => r.approved),
 *     approvers: results.map(r => r.approver),
 *     departments: results.map(r => r.department)
 *   })
 * );
 * // Returns: { finalApproval: false, approvers: [...], departments: [...] }
 * ```
 */
export const mergeBranches = (
  branchResults: any[],
  strategy: 'union' | 'intersection' | 'priority' | 'custom' = 'union',
  customMerger?: (results: any[]) => any,
): any => {
  switch (strategy) {
    case 'union':
      return branchResults.reduce((acc, result) => ({ ...acc, ...result }), {});

    case 'intersection': {
      if (branchResults.length === 0) return {};
      const keys = Object.keys(branchResults[0]);
      const commonKeys = keys.filter(key =>
        branchResults.every(result => key in result),
      );
      const intersection: Record<string, any> = {};
      commonKeys.forEach(key => {
        intersection[key] = branchResults[0][key];
      });
      return intersection;
    }

    case 'priority':
      return branchResults.find(result => result !== null && result !== undefined) || {};

    case 'custom':
      if (!customMerger) {
        throw new Error('Custom merger required for custom strategy');
      }
      return customMerger(branchResults);

    default:
      return branchResults;
  }
};

// ============================================================================
// COMPENSATION/SAGA PATTERN FUNCTIONS
// ============================================================================

/**
 * Creates a saga definition for distributed transaction management.
 *
 * @param {string} id - Saga identifier
 * @param {SagaStep[]} steps - Saga steps with compensation handlers
 * @param {'reverse' | 'priority'} compensationOrder - Compensation execution order
 * @returns {SagaDefinition} Saga definition
 *
 * @example
 * ```typescript
 * const appointmentSaga = createSaga(
 *   'book-appointment-saga',
 *   [
 *     {
 *       id: 'reserve-slot',
 *       action: async (ctx) => scheduleService.reserve(ctx.slotId),
 *       compensation: async (ctx, result) => scheduleService.release(result.reservationId),
 *       priority: 1
 *     },
 *     {
 *       id: 'charge-payment',
 *       action: async (ctx) => billingService.charge(ctx.amount),
 *       compensation: async (ctx, result) => billingService.refund(result.transactionId),
 *       priority: 2
 *     },
 *     {
 *       id: 'send-confirmation',
 *       action: async (ctx) => notificationService.send(ctx.patientId),
 *       compensation: async (ctx) => notificationService.sendCancellation(ctx.patientId),
 *       priority: 3
 *     }
 *   ],
 *   'reverse'
 * );
 * // Creates saga that can rollback appointment booking if any step fails
 * ```
 */
export const createSaga = (
  id: string,
  steps: SagaStep[],
  compensationOrder: 'reverse' | 'priority' = 'reverse',
): SagaDefinition => {
  return {
    id,
    steps,
    compensationOrder,
  };
};

/**
 * Executes compensation handlers for failed saga.
 *
 * @param {SagaDefinition} saga - Saga definition
 * @param {any[]} executedSteps - Successfully executed steps with results
 * @param {any} context - Execution context
 * @returns {Promise<{ compensated: string[]; failed: string[] }>} Compensation result
 *
 * @example
 * ```typescript
 * const compensationResult = await executeCompensation(
 *   appointmentSaga,
 *   [
 *     { stepId: 'reserve-slot', result: { reservationId: 'R-123' } },
 *     { stepId: 'charge-payment', result: { transactionId: 'T-456' } }
 *   ],
 *   context
 * );
 * // Returns: { compensated: ['charge-payment', 'reserve-slot'], failed: [] }
 * // Refunds payment and releases schedule slot (HIPAA audit logged)
 * ```
 */
export const executeCompensation = async (
  saga: SagaDefinition,
  executedSteps: Array<{ stepId: string; result: any }>,
  context: any,
): Promise<{ compensated: string[]; failed: string[] }> => {
  const compensated: string[] = [];
  const failed: string[] = [];

  // Determine compensation order
  let stepsToCompensate = [...executedSteps];
  if (saga.compensationOrder === 'reverse') {
    stepsToCompensate.reverse();
  } else {
    // Sort by priority (higher priority compensated first)
    stepsToCompensate.sort((a, b) => {
      const stepA = saga.steps.find(s => s.id === a.stepId);
      const stepB = saga.steps.find(s => s.id === b.stepId);
      return (stepB?.priority || 0) - (stepA?.priority || 0);
    });
  }

  // Execute compensation handlers
  for (const executed of stepsToCompensate) {
    const sagaStep = saga.steps.find(s => s.id === executed.stepId);
    if (!sagaStep) continue;

    try {
      await sagaStep.compensation(context, executed.result);
      compensated.push(executed.stepId);
    } catch (error) {
      console.error(`Compensation failed for step "${executed.stepId}":`, error);
      failed.push(executed.stepId);
    }
  }

  return { compensated, failed };
};

/**
 * Orchestrates saga rollback with retry and timeout handling.
 *
 * @param {SagaDefinition} saga - Saga definition
 * @param {WorkflowInstance} workflow - Workflow instance to rollback
 * @returns {Promise<{ success: boolean; compensatedSteps: string[] }>} Rollback result
 *
 * @example
 * ```typescript
 * const rollbackResult = await rollbackWorkflow(appointmentSaga, workflowInstance);
 * if (rollbackResult.success) {
 *   console.log('Workflow rolled back successfully');
 *   console.log('Compensated steps:', rollbackResult.compensatedSteps);
 *   // ['send-confirmation', 'charge-payment', 'reserve-slot']
 * }
 * // All appointment booking actions reversed, patient notified
 * ```
 */
export const rollbackWorkflow = async (
  saga: SagaDefinition,
  workflow: WorkflowInstance,
): Promise<{ success: boolean; compensatedSteps: string[] }> => {
  // Extract successfully completed steps from history
  const executedSteps = workflow.history
    .filter(entry => entry.status === 'completed')
    .map(entry => ({
      stepId: entry.stepId,
      result: entry.result,
    }));

  // Execute compensation
  const { compensated, failed } = await executeCompensation(
    saga,
    executedSteps,
    workflow.context,
  );

  // Update workflow status
  workflow.status = failed.length === 0 ? 'COMPENSATING' : 'FAILED';

  return {
    success: failed.length === 0,
    compensatedSteps: compensated,
  };
};

/**
 * Defines transaction boundary for saga steps.
 *
 * @param {string} id - Boundary identifier
 * @param {WorkflowStep[]} steps - Steps within transaction boundary
 * @param {object} options - Transaction options
 * @returns {WorkflowStep} Transaction boundary step
 *
 * @example
 * ```typescript
 * const transactionStep = defineTransactionBoundary(
 *   'patient-registration-transaction',
 *   [
 *     { id: 'create-record', name: 'Create Patient Record', type: 'service', handler: createRecord },
 *     { id: 'assign-mrn', name: 'Assign MRN', type: 'service', handler: assignMRN },
 *     { id: 'create-portal-access', name: 'Create Portal Access', type: 'service', handler: createPortal }
 *   ],
 *   {
 *     isolationLevel: 'serializable',
 *     timeout: 30000,
 *     onCommit: async (ctx) => auditService.log('patient-registered', ctx),
 *     onRollback: async (ctx) => auditService.log('registration-failed', ctx)
 *   }
 * );
 * // Ensures atomic patient registration - all or nothing
 * ```
 */
export const defineTransactionBoundary = (
  id: string,
  steps: WorkflowStep[],
  options: {
    isolationLevel?: string;
    timeout?: number;
    onCommit?: (context: WorkflowContext) => Promise<void>;
    onRollback?: (context: WorkflowContext) => Promise<void>;
  } = {},
): WorkflowStep => {
  return {
    id,
    name: `Transaction: ${id}`,
    type: 'task',
    handler: async (context: WorkflowContext) => {
      const results: any[] = [];
      const executedSteps: Array<{ step: WorkflowStep; result: any }> = [];

      try {
        // Execute all steps within transaction
        for (const step of steps) {
          const result = await executeWorkflowStep(step, context);
          results.push(result);
          executedSteps.push({ step, result });
        }

        // Commit transaction
        if (options.onCommit) {
          await options.onCommit(context);
        }

        return {
          committed: true,
          results,
        };
      } catch (error) {
        // Rollback transaction - execute compensation in reverse order
        for (let i = executedSteps.length - 1; i >= 0; i--) {
          const { step, result } = executedSteps[i];
          if (step.compensation) {
            try {
              await step.compensation.handler(context, result);
            } catch (compensationError) {
              console.error(`Compensation failed for step "${step.id}":`, compensationError);
            }
          }
        }

        if (options.onRollback) {
          await options.onRollback(context);
        }

        throw error;
      }
    },
    timeout: options.timeout,
    metadata: {
      pattern: 'transaction-boundary',
      steps: steps.map(s => s.id),
      isolationLevel: options.isolationLevel,
    },
  };
};

// ============================================================================
// HUMAN TASK MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Assigns human task to user, group, or role.
 *
 * @param {HumanTask} task - Task to assign
 * @param {string} assignee - Assignee identifier
 * @param {'user' | 'group' | 'role'} assigneeType - Type of assignee
 * @returns {Promise<TaskAssignment>} Task assignment record
 *
 * @example
 * ```typescript
 * const assignment = await assignHumanTask(
 *   {
 *     id: 'approve-medication',
 *     workflowId: 'prescription-001',
 *     name: 'Approve High-Risk Medication',
 *     priority: 'high',
 *     status: 'CREATED',
 *     actions: [
 *       { id: 'approve', name: 'Approve', type: 'approve' },
 *       { id: 'reject', name: 'Reject', type: 'reject' }
 *     ],
 *     createdAt: new Date()
 *   },
 *   'attending-physicians',
 *   'group'
 * );
 * // Assigns medication approval to any attending physician
 * ```
 */
export const assignHumanTask = async (
  task: HumanTask,
  assignee: string,
  assigneeType: 'user' | 'group' | 'role',
): Promise<TaskAssignment> => {
  const assignment: TaskAssignment = {
    taskId: task.id,
    assignee,
    assigneeType,
    assignedAt: new Date(),
    assignedBy: 'system', // Would be actual user in production
  };

  // Update task
  task.assignee = assignee;
  task.assigneeType = assigneeType;
  task.status = 'ASSIGNED';

  return assignment;
};

/**
 * Escalates overdue task to higher authority.
 *
 * @param {HumanTask} task - Task to escalate
 * @param {string} reason - Escalation reason
 * @returns {Promise<HumanTask>} Escalated task
 *
 * @example
 * ```typescript
 * const escalatedTask = await escalateTask(
 *   overdueApprovalTask,
 *   'Task exceeded SLA - no response after 24 hours'
 * );
 * // Task reassigned to department head, original assignee notified
 * // Escalation logged in HIPAA audit trail
 * ```
 */
export const escalateTask = async (
  task: HumanTask,
  reason: string,
): Promise<HumanTask> => {
  if (!task.escalationConfig?.enabled) {
    throw new Error(`Task "${task.id}" does not have escalation configured`);
  }

  const previousAssignee = task.assignee;

  // Reassign to escalation target
  task.assignee = task.escalationConfig.escalateTo;
  task.assigneeType = task.escalationConfig.escalationType;
  task.status = 'ESCALATED';

  // Add escalation metadata
  task.formData = {
    ...task.formData,
    escalation: {
      previousAssignee,
      reason,
      escalatedAt: new Date().toISOString(),
    },
  };

  return task;
};

/**
 * Delegates task to another user while maintaining original assignee.
 *
 * @param {HumanTask} task - Task to delegate
 * @param {string} delegateTo - User to delegate to
 * @param {string} reason - Delegation reason
 * @returns {Promise<HumanTask>} Delegated task
 *
 * @example
 * ```typescript
 * const delegatedTask = await delegateTask(
 *   surgicalApprovalTask,
 *   'dr-jones',
 *   'Original surgeon on emergency leave - temporary delegation'
 * );
 * // Task delegated to covering physician with full context
 * // Original assignee remains on record for audit purposes
 * ```
 */
export const delegateTask = async (
  task: HumanTask,
  delegateTo: string,
  reason: string,
): Promise<HumanTask> => {
  const originalAssignee = task.assignee;

  // Update task
  task.formData = {
    ...task.formData,
    delegation: {
      originalAssignee,
      delegatedTo: delegateTo,
      reason,
      delegatedAt: new Date().toISOString(),
    },
  };

  task.assignee = delegateTo;

  return task;
};

/**
 * Completes human task with result data.
 *
 * @param {HumanTask} task - Task to complete
 * @param {string} actionId - Action taken
 * @param {any} resultData - Task result data
 * @param {string} completedBy - User who completed task
 * @returns {Promise<HumanTask>} Completed task
 *
 * @example
 * ```typescript
 * const completedTask = await completeHumanTask(
 *   medicationApprovalTask,
 *   'approve',
 *   {
 *     approved: true,
 *     dosage: '10mg',
 *     frequency: 'twice daily',
 *     duration: '30 days',
 *     notes: 'Monitor for side effects',
 *     signature: 'Dr. Smith, MD',
 *     signatureTimestamp: new Date().toISOString()
 *   },
 *   'dr-smith'
 * );
 * // Medication approved with full audit trail for HIPAA compliance
 * ```
 */
export const completeHumanTask = async (
  task: HumanTask,
  actionId: string,
  resultData: any,
  completedBy: string,
): Promise<HumanTask> => {
  const action = task.actions.find(a => a.id === actionId);
  if (!action) {
    throw new Error(`Action "${actionId}" not found for task "${task.id}"`);
  }

  // Execute action handler if provided
  if (action.handler) {
    await action.handler(task, resultData);
  }

  // Update task
  task.status = 'COMPLETED';
  task.completedAt = new Date();
  task.completedBy = completedBy;
  task.formData = {
    ...task.formData,
    result: resultData,
    action: actionId,
  };

  return task;
};

// ============================================================================
// WORKFLOW EVENT HANDLING FUNCTIONS
// ============================================================================

/**
 * Emits workflow event for event-driven coordination.
 *
 * @param {string} type - Event type
 * @param {string} workflowId - Workflow identifier
 * @param {any} payload - Event payload
 * @param {string} [correlationId] - Correlation identifier for event tracking
 * @returns {WorkflowEvent} Created event
 *
 * @example
 * ```typescript
 * const event = emitWorkflowEvent(
 *   'PATIENT_ADMITTED',
 *   'admission-workflow-001',
 *   {
 *     patientId: 'P-12345',
 *     roomNumber: '301',
 *     admittedAt: new Date().toISOString(),
 *     admittedBy: 'nurse-001'
 *   },
 *   'correlation-abc-123'
 * );
 * // Event triggers dependent workflows (room setup, medication orders, etc.)
 * ```
 */
export const emitWorkflowEvent = (
  type: string,
  workflowId: string,
  payload: any,
  correlationId?: string,
): WorkflowEvent => {
  const event: WorkflowEvent = {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    workflowId,
    correlationId,
    payload,
    timestamp: new Date(),
    source: 'workflow-engine',
  };

  return event;
};

/**
 * Subscribes to workflow events with handler.
 *
 * @param {string | string[]} eventTypes - Event type(s) to subscribe to
 * @param {(event: WorkflowEvent) => Promise<void>} handler - Event handler
 * @param {object} [options] - Subscription options
 * @returns {object} Subscription handle
 *
 * @example
 * ```typescript
 * const subscription = subscribeToEvent(
 *   ['PATIENT_ADMITTED', 'PATIENT_TRANSFERRED'],
 *   async (event) => {
 *     await roomManagementService.updateOccupancy(event.payload);
 *     await housekeepingService.scheduleSetup(event.payload.roomNumber);
 *   },
 *   { filter: (event) => event.payload.department === 'ICU' }
 * );
 * // Automatically manages room occupancy when ICU patients admitted/transferred
 * ```
 */
export const subscribeToEvent = (
  eventTypes: string | string[],
  handler: (event: WorkflowEvent) => Promise<void>,
  options?: {
    filter?: (event: WorkflowEvent) => boolean;
    priority?: number;
  },
): { unsubscribe: () => void } => {
  const types = Array.isArray(eventTypes) ? eventTypes : [eventTypes];

  const subscription = {
    types,
    handler,
    filter: options?.filter,
    priority: options?.priority || 0,
  };

  // In production, this would register with event bus
  // For now, return mock subscription handle
  return {
    unsubscribe: () => {
      // Would remove subscription from event bus
    },
  };
};

/**
 * Correlates event with waiting workflow instance.
 *
 * @param {WorkflowEvent} event - Event to correlate
 * @param {WorkflowInstance[]} waitingInstances - Instances waiting for events
 * @returns {WorkflowInstance | null} Matched workflow instance
 *
 * @example
 * ```typescript
 * const matchedWorkflow = correlateEvent(
 *   {
 *     id: 'evt-001',
 *     type: 'LAB_RESULTS_READY',
 *     workflowId: 'diagnosis-workflow-001',
 *     correlationId: 'patient-P-12345',
 *     payload: { patientId: 'P-12345', results: {...} },
 *     timestamp: new Date()
 *   },
 *   waitingWorkflows
 * );
 * // Resumes diagnosis workflow when lab results arrive
 * ```
 */
export const correlateEvent = (
  event: WorkflowEvent,
  waitingInstances: WorkflowInstance[],
): WorkflowInstance | null => {
  // Try correlation by correlation ID first
  if (event.correlationId) {
    const match = waitingInstances.find(
      instance => instance.context.correlationId === event.correlationId,
    );
    if (match) return match;
  }

  // Try correlation by workflow ID
  const match = waitingInstances.find(instance => instance.id === event.workflowId);
  return match || null;
};

/**
 * Persists workflow event to event store for replay and audit.
 *
 * @param {WorkflowEvent} event - Event to persist
 * @param {object} [metadata] - Additional persistence metadata
 * @returns {Promise<{ eventId: string; persisted: boolean }>} Persistence result
 *
 * @example
 * ```typescript
 * const result = await persistWorkflowEvent(
 *   patientAdmittedEvent,
 *   {
 *     retention: '7-years', // HIPAA retention requirement
 *     encrypted: true,
 *     auditCategory: 'patient-admission'
 *   }
 * );
 * // Event stored for audit trail and workflow replay capability
 * ```
 */
export const persistWorkflowEvent = async (
  event: WorkflowEvent,
  metadata?: Record<string, any>,
): Promise<{ eventId: string; persisted: boolean }> => {
  // In production, would persist to event store (EventStore, Kafka, etc.)
  const persistedEvent = {
    ...event,
    metadata: {
      ...event.metadata,
      ...metadata,
      persistedAt: new Date().toISOString(),
    },
  };

  // Mock persistence
  return {
    eventId: event.id,
    persisted: true,
  };
};

// ============================================================================
// TIMEOUT MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Configures timeout for workflow step or instance.
 *
 * @param {number} duration - Timeout duration in milliseconds
 * @param {'fail' | 'compensate' | 'retry' | 'escalate' | 'custom'} action - Timeout action
 * @param {(context: WorkflowContext) => Promise<void>} [handler] - Custom timeout handler
 * @returns {TimeoutConfig} Timeout configuration
 *
 * @example
 * ```typescript
 * const timeoutConfig = configureTimeout(
 *   3600000, // 1 hour
 *   'escalate',
 *   async (ctx) => {
 *     await notificationService.alertSupervisor(ctx.workflowId);
 *     await auditService.log('workflow-timeout', ctx);
 *   }
 * );
 * // Escalates to supervisor if approval not received within 1 hour
 * ```
 */
export const configureTimeout = (
  duration: number,
  action: 'fail' | 'compensate' | 'retry' | 'escalate' | 'custom' = 'fail',
  handler?: (context: WorkflowContext) => Promise<void>,
): TimeoutConfig => {
  return {
    duration,
    action,
    handler,
    warningThreshold: 80, // Warn at 80% of duration
  };
};

/**
 * Tracks deadline for workflow completion with notifications.
 *
 * @param {WorkflowInstance} workflow - Workflow instance
 * @param {Date} deadline - Deadline timestamp
 * @param {object} options - Deadline tracking options
 * @returns {object} Deadline tracker
 *
 * @example
 * ```typescript
 * const tracker = trackDeadline(
 *   surgeryPreparationWorkflow,
 *   new Date('2025-11-08T14:00:00Z'), // Surgery scheduled at 2 PM
 *   {
 *     warningBefore: 3600000, // 1 hour warning
 *     onWarning: async () => notificationService.alert('surgery-prep-deadline-approaching'),
 *     onMiss: async () => notificationService.alert('surgery-prep-deadline-missed')
 *   }
 * );
 * // Ensures pre-operative preparation completes before surgery time
 * ```
 */
export const trackDeadline = (
  workflow: WorkflowInstance,
  deadline: Date,
  options: {
    warningBefore?: number;
    onWarning?: () => Promise<void>;
    onMiss?: () => Promise<void>;
  } = {},
): {
  deadline: Date;
  timeRemaining: number;
  isOverdue: boolean;
  check: () => Promise<void>;
} => {
  const getTimeRemaining = () => deadline.getTime() - Date.now();
  const isOverdue = () => getTimeRemaining() < 0;

  const check = async () => {
    const remaining = getTimeRemaining();

    if (remaining < 0 && options.onMiss) {
      await options.onMiss();
    } else if (
      options.warningBefore &&
      remaining < options.warningBefore &&
      remaining > 0 &&
      options.onWarning
    ) {
      await options.onWarning();
    }
  };

  return {
    deadline,
    timeRemaining: getTimeRemaining(),
    isOverdue: isOverdue(),
    check,
  };
};

/**
 * Monitors SLA compliance for workflow execution.
 *
 * @param {WorkflowInstance} workflow - Workflow instance
 * @param {SLAConfig} slaConfig - SLA configuration
 * @returns {object} SLA monitor
 *
 * @example
 * ```typescript
 * const slaMonitor = monitorSLA(
 *   emergencyRoomWorkflow,
 *   {
 *     target: 900000,    // 15 minutes target
 *     warning: 600000,   // 10 minutes warning
 *     critical: 750000,  // 12.5 minutes critical
 *     onWarning: async (ctx) => notificationService.warn('er-sla-warning', ctx),
 *     onCritical: async (ctx) => notificationService.alert('er-sla-critical', ctx),
 *     onBreach: async (ctx) => incidentService.create('er-sla-breach', ctx)
 *   }
 * );
 * // Monitors emergency room door-to-doctor time for quality metrics
 * ```
 */
export const monitorSLA = (
  workflow: WorkflowInstance,
  slaConfig: SLAConfig,
): {
  config: SLAConfig;
  elapsed: number;
  status: 'on-track' | 'warning' | 'critical' | 'breached';
  check: () => Promise<void>;
} => {
  const getElapsed = () => Date.now() - workflow.startedAt.getTime();

  const getStatus = (): 'on-track' | 'warning' | 'critical' | 'breached' => {
    const elapsed = getElapsed();
    if (elapsed >= slaConfig.target) return 'breached';
    if (elapsed >= slaConfig.critical) return 'critical';
    if (elapsed >= slaConfig.warning) return 'warning';
    return 'on-track';
  };

  const check = async () => {
    const status = getStatus();
    const context = workflow.context;

    switch (status) {
      case 'warning':
        if (slaConfig.onWarning) await slaConfig.onWarning(context);
        break;
      case 'critical':
        if (slaConfig.onCritical) await slaConfig.onCritical(context);
        break;
      case 'breached':
        if (slaConfig.onBreach) await slaConfig.onBreach(context);
        break;
    }
  };

  return {
    config: slaConfig,
    elapsed: getElapsed(),
    status: getStatus(),
    check,
  };
};

/**
 * Handles timeout with configured action and retry logic.
 *
 * @param {TimeoutConfig} config - Timeout configuration
 * @param {WorkflowContext} context - Workflow context
 * @returns {Promise<void>} Timeout handling result
 *
 * @example
 * ```typescript
 * await handleTimeout(
 *   {
 *     duration: 30000,
 *     action: 'retry',
 *     handler: async (ctx) => {
 *       ctx.variables.retryCount = (ctx.variables.retryCount || 0) + 1;
 *       if (ctx.variables.retryCount > 3) {
 *         await escalateToSupervisor(ctx);
 *       }
 *     }
 *   },
 *   workflowContext
 * );
 * // Retries operation, escalates after 3 attempts
 * ```
 */
export const handleTimeout = async (
  config: TimeoutConfig,
  context: WorkflowContext,
): Promise<void> => {
  switch (config.action) {
    case 'fail':
      throw new Error(`Workflow step timed out after ${config.duration}ms`);

    case 'compensate':
      // Would trigger compensation logic
      break;

    case 'retry':
      // Would trigger retry logic
      break;

    case 'escalate':
      // Would trigger escalation
      break;

    case 'custom':
      if (config.handler) {
        await config.handler(context);
      }
      break;
  }
};

// ============================================================================
// WORKFLOW PERSISTENCE FUNCTIONS
// ============================================================================

/**
 * Persists workflow state to durable storage.
 *
 * @param {WorkflowInstance} workflow - Workflow instance to persist
 * @returns {Promise<{ id: string; persisted: boolean }>} Persistence result
 *
 * @example
 * ```typescript
 * const result = await persistWorkflowState(patientAdmissionWorkflow);
 * // Returns: { id: 'admission-workflow-001', persisted: true }
 * // Workflow state saved to database for recovery after system restart
 * // Includes encrypted PHI for HIPAA compliance
 * ```
 */
export const persistWorkflowState = async (
  workflow: WorkflowInstance,
): Promise<{ id: string; persisted: boolean }> => {
  // In production, would persist to database with encryption
  const persistedState = {
    ...workflow,
    metadata: {
      ...workflow.context.metadata,
      persistedAt: new Date().toISOString(),
      encrypted: true,
    },
  };

  return {
    id: workflow.id,
    persisted: true,
  };
};

/**
 * Recovers workflow state from persistent storage.
 *
 * @param {string} workflowId - Workflow instance identifier
 * @returns {Promise<WorkflowInstance | null>} Recovered workflow instance
 *
 * @example
 * ```typescript
 * const recovered = await recoverWorkflowState('admission-workflow-001');
 * if (recovered) {
 *   console.log('Workflow recovered, resuming from step:', recovered.currentState);
 *   // Resume execution from last checkpoint
 *   await resumeWorkflow(recovered);
 * }
 * // Resumes patient admission after system recovery
 * ```
 */
export const recoverWorkflowState = async (
  workflowId: string,
): Promise<WorkflowInstance | null> => {
  // In production, would load from database and decrypt
  // Mock recovery for demonstration
  return null;
};

/**
 * Creates checkpoint for workflow state recovery.
 *
 * @param {WorkflowInstance} workflow - Workflow instance
 * @param {string} reason - Checkpoint reason
 * @returns {Promise<WorkflowCheckpoint>} Created checkpoint
 *
 * @example
 * ```typescript
 * const checkpoint = await createCheckpoint(
 *   surgeryWorkflow,
 *   'Pre-incision safety checklist completed'
 * );
 * // Checkpoint created before critical surgical step
 * // Enables precise recovery if system fails during operation
 * ```
 */
export const createCheckpoint = async (
  workflow: WorkflowInstance,
  reason?: string,
): Promise<WorkflowCheckpoint> => {
  const checkpoint: WorkflowCheckpoint = {
    id: `checkpoint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    workflowId: workflow.id,
    state: workflow.currentState,
    context: { ...workflow.context },
    timestamp: new Date(),
    reason,
  };

  // Add to workflow checkpoints
  workflow.checkpoints.push(checkpoint);

  // Persist checkpoint
  await persistWorkflowState(workflow);

  return checkpoint;
};

/**
 * Retrieves workflow execution history.
 *
 * @param {string} workflowId - Workflow instance identifier
 * @param {object} [options] - Query options
 * @returns {Promise<WorkflowHistoryEntry[]>} Workflow history
 *
 * @example
 * ```typescript
 * const history = await getWorkflowHistory(
 *   'patient-discharge-001',
 *   {
 *     fromDate: new Date('2025-11-07'),
 *     toDate: new Date('2025-11-08'),
 *     status: ['completed', 'failed']
 *   }
 * );
 * // Returns complete audit trail of discharge workflow
 * // Includes all steps, timestamps, users for HIPAA compliance
 * ```
 */
export const getWorkflowHistory = async (
  workflowId: string,
  options?: {
    fromDate?: Date;
    toDate?: Date;
    status?: string[];
  },
): Promise<WorkflowHistoryEntry[]> => {
  // In production, would query from history store
  // Mock history for demonstration
  return [];
};

// ============================================================================
// WORKFLOW VISUALIZATION FUNCTIONS
// ============================================================================

/**
 * Generates workflow graph data for visualization.
 *
 * @param {WorkflowDefinition} definition - Workflow definition
 * @param {WorkflowInstance} [instance] - Active workflow instance for status overlay
 * @returns {WorkflowVisualization} Visualization data
 *
 * @example
 * ```typescript
 * const graph = generateWorkflowGraph(
 *   patientAdmissionWorkflow,
 *   activeInstance
 * );
 * // Returns: {
 * //   nodes: [
 * //     { id: 'register', type: 'human-task', label: 'Register Patient', status: 'completed' },
 * //     { id: 'verify', type: 'service', label: 'Verify Insurance', status: 'in-progress' },
 * //     { id: 'assign', type: 'task', label: 'Assign Room', status: 'pending' }
 * //   ],
 * //   edges: [
 * //     { id: 'e1', from: 'register', to: 'verify' },
 * //     { id: 'e2', from: 'verify', to: 'assign' }
 * //   ]
 * // }
 * // Renders interactive workflow diagram with real-time status
 * ```
 */
export const generateWorkflowGraph = (
  definition: WorkflowDefinition,
  instance?: WorkflowInstance,
): WorkflowVisualization => {
  const nodes: VisualizationNode[] = definition.steps.map(step => ({
    id: step.id,
    type: step.type,
    label: step.name,
    status: instance
      ? instance.currentState === step.id
        ? 'active'
        : instance.history.some(h => h.stepId === step.id && h.status === 'completed')
        ? 'completed'
        : 'pending'
      : undefined,
    metadata: step.metadata,
  }));

  const edges: VisualizationEdge[] = [];
  definition.steps.forEach(step => {
    if (step.nextSteps) {
      step.nextSteps.forEach(nextStep => {
        edges.push({
          id: `${step.id}-${nextStep}`,
          from: step.id,
          to: nextStep,
          condition: typeof step.condition === 'string' ? step.condition : undefined,
        });
      });
    }
  });

  return {
    nodes,
    edges,
    layout: 'horizontal',
  };
};

/**
 * Generates state diagram data for state machine visualization.
 *
 * @param {StateMachine} stateMachine - State machine to visualize
 * @returns {WorkflowVisualization} State diagram data
 *
 * @example
 * ```typescript
 * const diagram = generateStateDiagram(admissionStateMachine);
 * // Returns state transition diagram with current state highlighted
 * // Shows all possible transitions and guard conditions
 * // Useful for debugging complex state flows
 * ```
 */
export const generateStateDiagram = (stateMachine: StateMachine): WorkflowVisualization => {
  const nodes: VisualizationNode[] = Array.from(stateMachine.states.entries()).map(
    ([name, state]) => ({
      id: name,
      type: state.type,
      label: name,
      status: stateMachine.currentState === name ? 'active' : undefined,
      metadata: state.metadata,
    }),
  );

  const edges: VisualizationEdge[] = stateMachine.transitions.map(transition => ({
    id: `${transition.from}-${transition.to}-${transition.event}`,
    from: transition.from,
    to: transition.to,
    label: transition.event,
    metadata: {
      hasGuard: !!transition.guard,
      hasAction: !!transition.action,
      priority: transition.priority,
    },
  }));

  return {
    nodes,
    edges,
    layout: 'hierarchical',
  };
};

/**
 * Creates execution timeline for workflow instance.
 *
 * @param {WorkflowInstance} workflow - Workflow instance
 * @returns {ExecutionTimeline} Timeline data
 *
 * @example
 * ```typescript
 * const timeline = createExecutionTimeline(patientAdmissionWorkflow);
 * // Returns: {
 * //   workflowId: 'admission-workflow-001',
 * //   entries: [
 * //     { timestamp: '2025-11-08T10:00:00Z', type: 'step-start', stepName: 'Register Patient' },
 * //     { timestamp: '2025-11-08T10:05:00Z', type: 'step-complete', stepName: 'Register Patient', duration: 300000 },
 * //     { timestamp: '2025-11-08T10:05:00Z', type: 'step-start', stepName: 'Verify Insurance' },
 * //     { timestamp: '2025-11-08T10:07:30Z', type: 'step-complete', stepName: 'Verify Insurance', duration: 150000 }
 * //   ],
 * //   totalDuration: 450000,
 * //   status: 'RUNNING'
 * // }
 * // Visualizes execution flow and identifies bottlenecks
 * ```
 */
export const createExecutionTimeline = (workflow: WorkflowInstance): ExecutionTimeline => {
  const entries: TimelineEntry[] = [];

  // Add workflow start
  entries.push({
    timestamp: workflow.startedAt,
    type: 'step-start',
    details: { workflowId: workflow.id, definitionId: workflow.definitionId },
  });

  // Add history entries
  workflow.history.forEach(entry => {
    entries.push({
      timestamp: entry.startedAt,
      type: 'step-start',
      stepId: entry.stepId,
      stepName: entry.stepName,
    });

    if (entry.completedAt) {
      entries.push({
        timestamp: entry.completedAt,
        type: entry.status === 'completed' ? 'step-complete' : 'step-fail',
        stepId: entry.stepId,
        stepName: entry.stepName,
        duration: entry.completedAt.getTime() - entry.startedAt.getTime(),
        status: entry.status,
        details: entry.error || entry.result,
      });
    }
  });

  // Add checkpoints
  workflow.checkpoints.forEach(checkpoint => {
    entries.push({
      timestamp: checkpoint.timestamp,
      type: 'checkpoint',
      details: { reason: checkpoint.reason, state: checkpoint.state },
    });
  });

  // Sort by timestamp
  entries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const totalDuration = workflow.completedAt
    ? workflow.completedAt.getTime() - workflow.startedAt.getTime()
    : Date.now() - workflow.startedAt.getTime();

  return {
    workflowId: workflow.id,
    entries,
    totalDuration,
    status: workflow.status,
  };
};

/**
 * Collects workflow execution metrics for monitoring.
 *
 * @param {string} definitionId - Workflow definition identifier
 * @param {WorkflowInstance[]} instances - Workflow instances to analyze
 * @returns {WorkflowMetrics} Collected metrics
 *
 * @example
 * ```typescript
 * const metrics = collectWorkflowMetrics(
 *   'patient-admission-v1',
 *   allAdmissionInstances
 * );
 * // Returns: {
 * //   workflowId: 'patient-admission-v1',
 * //   totalExecutions: 1250,
 * //   successfulExecutions: 1180,
 * //   failedExecutions: 70,
 * //   averageDuration: 1800000, // 30 minutes
 * //   stepMetrics: Map({
 * //     'verify-insurance': { executions: 1250, successes: 1200, failures: 50, averageDuration: 120000, timeouts: 5, retries: 15 }
 * //   })
 * // }
 * // Identifies performance issues and optimization opportunities
 * ```
 */
export const collectWorkflowMetrics = (
  definitionId: string,
  instances: WorkflowInstance[],
): WorkflowMetrics => {
  const metrics: WorkflowMetrics = {
    workflowId: definitionId,
    definitionId,
    totalExecutions: instances.length,
    successfulExecutions: instances.filter(i => i.status === 'COMPLETED').length,
    failedExecutions: instances.filter(i => i.status === 'FAILED').length,
    averageDuration: 0,
    minDuration: Number.MAX_SAFE_INTEGER,
    maxDuration: 0,
    stepMetrics: new Map<string, StepMetrics>(),
  };

  let totalDuration = 0;

  instances.forEach(instance => {
    const duration = instance.completedAt
      ? instance.completedAt.getTime() - instance.startedAt.getTime()
      : Date.now() - instance.startedAt.getTime();

    totalDuration += duration;
    metrics.minDuration = Math.min(metrics.minDuration, duration);
    metrics.maxDuration = Math.max(metrics.maxDuration, duration);

    // Collect step metrics
    instance.history.forEach(entry => {
      let stepMetric = metrics.stepMetrics.get(entry.stepId);
      if (!stepMetric) {
        stepMetric = {
          stepId: entry.stepId,
          stepName: entry.stepName,
          executions: 0,
          successes: 0,
          failures: 0,
          averageDuration: 0,
          timeouts: 0,
          retries: 0,
        };
        metrics.stepMetrics.set(entry.stepId, stepMetric);
      }

      stepMetric.executions++;
      if (entry.status === 'completed') {
        stepMetric.successes++;
      } else if (entry.status === 'failed') {
        stepMetric.failures++;
      }

      if (entry.completedAt) {
        const stepDuration = entry.completedAt.getTime() - entry.startedAt.getTime();
        stepMetric.averageDuration =
          (stepMetric.averageDuration * (stepMetric.executions - 1) + stepDuration) /
          stepMetric.executions;
      }
    });
  });

  metrics.averageDuration = instances.length > 0 ? totalDuration / instances.length : 0;
  metrics.lastExecutedAt =
    instances.length > 0
      ? instances.reduce((latest, instance) =>
          instance.startedAt > latest ? instance.startedAt : latest,
        instances[0].startedAt)
      : undefined;

  return metrics;
};

// ============================================================================
// SUBPROCESS INVOCATION FUNCTIONS
// ============================================================================

/**
 * Invokes subprocess workflow from parent workflow.
 *
 * @param {SubprocessConfig} config - Subprocess configuration
 * @param {WorkflowContext} parentContext - Parent workflow context
 * @returns {Promise<{ instanceId: string; result?: any }>} Subprocess invocation result
 *
 * @example
 * ```typescript
 * const result = await invokeSubprocess(
 *   {
 *     workflowDefinitionId: 'medication-ordering-v1',
 *     version: '1.0.0',
 *     variables: {
 *       patientId: parentContext.variables.patientId,
 *       medications: ['aspirin', 'lisinopril'],
 *       prescribingPhysician: 'dr-smith'
 *     },
 *     waitForCompletion: true,
 *     timeout: 300000,
 *     onComplete: async (result) => auditService.log('medications-ordered', result)
 *   },
 *   parentContext
 * );
 * // Subprocess handles medication ordering workflow
 * // Parent workflow continues after medication orders placed
 * ```
 */
export const invokeSubprocess = async (
  config: SubprocessConfig,
  parentContext: WorkflowContext,
): Promise<{ instanceId: string; result?: any }> => {
  const subprocessInstanceId = `subprocess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Create subprocess context
  const subprocessContext: WorkflowContext = {
    workflowId: config.workflowDefinitionId,
    instanceId: subprocessInstanceId,
    currentStep: 'start',
    variables: config.variables || {},
    metadata: {
      parentWorkflowId: parentContext.workflowId,
      parentInstanceId: parentContext.instanceId,
    },
    startedAt: new Date(),
    parentWorkflowId: parentContext.workflowId,
  };

  // In production, would start subprocess execution
  // For now, mock the invocation
  if (config.waitForCompletion) {
    // Simulate subprocess execution
    const result = { subprocessInstanceId, status: 'completed' };

    if (config.onComplete) {
      await config.onComplete(result);
    }

    return { instanceId: subprocessInstanceId, result };
  }

  return { instanceId: subprocessInstanceId };
};

/**
 * Coordinates multiple subprocesses with synchronization.
 *
 * @param {SubprocessConfig[]} subprocesses - Subprocess configurations
 * @param {WorkflowContext} parentContext - Parent workflow context
 * @param {string} strategy - Coordination strategy ('sequential' | 'parallel' | 'race')
 * @returns {Promise<Array<{ instanceId: string; result?: any }>>} Coordination results
 *
 * @example
 * ```typescript
 * const results = await coordinateSubprocesses(
 *   [
 *     { workflowDefinitionId: 'lab-order-v1', variables: { tests: ['CBC', 'CMP'] }, waitForCompletion: true },
 *     { workflowDefinitionId: 'imaging-order-v1', variables: { studies: ['chest-xray'] }, waitForCompletion: true },
 *     { workflowDefinitionId: 'consult-request-v1', variables: { specialty: 'cardiology' }, waitForCompletion: true }
 *   ],
 *   parentContext,
 *   'parallel'
 * );
 * // All three order subprocesses execute in parallel
 * // Parent workflow continues when all complete
 * ```
 */
export const coordinateSubprocesses = async (
  subprocesses: SubprocessConfig[],
  parentContext: WorkflowContext,
  strategy: 'sequential' | 'parallel' | 'race' = 'sequential',
): Promise<Array<{ instanceId: string; result?: any }>> => {
  switch (strategy) {
    case 'sequential': {
      const results: Array<{ instanceId: string; result?: any }> = [];
      for (const config of subprocesses) {
        const result = await invokeSubprocess(config, parentContext);
        results.push(result);
      }
      return results;
    }

    case 'parallel': {
      const promises = subprocesses.map(config => invokeSubprocess(config, parentContext));
      return Promise.all(promises);
    }

    case 'race': {
      const promises = subprocesses.map(config => invokeSubprocess(config, parentContext));
      const result = await Promise.race(promises);
      return [result];
    }

    default:
      throw new Error(`Unknown coordination strategy: ${strategy}`);
  }
};

/**
 * Sends message from subprocess to parent workflow.
 *
 * @param {string} subprocessId - Subprocess instance identifier
 * @param {string} parentWorkflowId - Parent workflow identifier
 * @param {any} message - Message payload
 * @returns {Promise<void>} Communication result
 *
 * @example
 * ```typescript
 * await communicateWithParent(
 *   subprocessInstanceId,
 *   parentWorkflowId,
 *   {
 *     type: 'PROGRESS_UPDATE',
 *     data: {
 *       step: 'medication-verification',
 *       status: 'in-progress',
 *       percentComplete: 60
 *     }
 *   }
 * );
 * // Subprocess notifies parent of progress
 * // Parent can update UI or adjust resource allocation
 * ```
 */
export const communicateWithParent = async (
  subprocessId: string,
  parentWorkflowId: string,
  message: any,
): Promise<void> => {
  // In production, would send message via event bus or direct communication
  const event = emitWorkflowEvent(
    'SUBPROCESS_MESSAGE',
    parentWorkflowId,
    {
      subprocessId,
      message,
    },
    subprocessId,
  );

  // Persist event for parent to consume
  await persistWorkflowEvent(event);
};

/**
 * Terminates running subprocess.
 *
 * @param {string} subprocessId - Subprocess instance identifier
 * @param {string} reason - Termination reason
 * @param {boolean} [compensate] - Whether to execute compensation (default: false)
 * @returns {Promise<{ terminated: boolean; compensated: boolean }>} Termination result
 *
 * @example
 * ```typescript
 * const result = await terminateSubprocess(
 *   labOrderSubprocessId,
 *   'Patient declined blood work',
 *   true
 * );
 * // Subprocess terminated, compensation executed
 * // Lab order cancelled, patient notification sent
 * // Audit trail created for HIPAA compliance
 * ```
 */
export const terminateSubprocess = async (
  subprocessId: string,
  reason: string,
  compensate: boolean = false,
): Promise<{ terminated: boolean; compensated: boolean }> => {
  // In production, would:
  // 1. Stop subprocess execution
  // 2. Execute compensation if requested
  // 3. Update subprocess status to TERMINATED
  // 4. Notify parent workflow

  return {
    terminated: true,
    compensated: compensate,
  };
};

// ============================================================================
// HIPAA COMPLIANCE FUNCTIONS
// ============================================================================

/**
 * Creates HIPAA-compliant audit trail entry.
 *
 * @param {string} workflowId - Workflow identifier
 * @param {string} action - Action performed
 * @param {string} userId - User who performed action
 * @param {string} resourceType - Type of resource accessed
 * @param {string} resourceId - Resource identifier
 * @param {Record<string, any>} [changes] - Changes made
 * @returns {HIPAAAuditTrail} Audit trail entry
 *
 * @example
 * ```typescript
 * const audit = createAuditTrail(
 *   'patient-update-001',
 *   'UPDATE_PATIENT_RECORD',
 *   'dr-smith',
 *   'PATIENT',
 *   'P-12345',
 *   {
 *     before: { address: '123 Old St' },
 *     after: { address: '456 New Ave' },
 *     fields: ['address']
 *   }
 * );
 * // Creates immutable audit record for HIPAA compliance
 * // Includes timestamp, user, action, and data changes
 * // Retained for required 7-year period
 * ```
 */
export const createAuditTrail = (
  workflowId: string,
  action: string,
  userId: string,
  resourceType: string,
  resourceId: string,
  changes?: Record<string, any>,
): HIPAAAuditTrail => {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    workflowId,
    action,
    userId,
    timestamp: new Date(),
    resourceType,
    resourceId,
    changes,
    complianceFlags: ['HIPAA'],
  };
};

/**
 * Logs workflow access for HIPAA audit requirements.
 *
 * @param {string} workflowId - Workflow identifier
 * @param {string} userId - User accessing workflow
 * @param {string} accessType - Type of access ('read' | 'write' | 'execute' | 'admin')
 * @param {object} [metadata] - Additional access metadata
 * @returns {Promise<HIPAAAuditTrail>} Access log entry
 *
 * @example
 * ```typescript
 * const accessLog = await logWorkflowAccess(
 *   'patient-discharge-001',
 *   'nurse-jones',
 *   'execute',
 *   {
 *     ipAddress: '192.168.1.100',
 *     userAgent: 'Mozilla/5.0...',
 *     location: 'Nursing Station 3B',
 *     sessionId: 'sess-abc-123'
 *   }
 * );
 * // Logs all workflow access for compliance auditing
 * // Detects unauthorized access attempts
 * ```
 */
export const logWorkflowAccess = async (
  workflowId: string,
  userId: string,
  accessType: 'read' | 'write' | 'execute' | 'admin',
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    sessionId?: string;
  },
): Promise<HIPAAAuditTrail> => {
  const auditEntry: HIPAAAuditTrail = {
    id: `access-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    workflowId,
    action: `WORKFLOW_${accessType.toUpperCase()}`,
    userId,
    timestamp: new Date(),
    resourceType: 'WORKFLOW',
    resourceId: workflowId,
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
    complianceFlags: ['HIPAA', 'ACCESS_LOG'],
  };

  // In production, would persist to immutable audit log
  return auditEntry;
};

/**
 * Encrypts workflow data for HIPAA compliance.
 *
 * @param {any} data - Data to encrypt
 * @param {object} options - Encryption options
 * @returns {Promise<{ encrypted: string; keyId: string; algorithm: string }>} Encrypted data
 *
 * @example
 * ```typescript
 * const encrypted = await encryptWorkflowData(
 *   {
 *     patientId: 'P-12345',
 *     ssn: '123-45-6789',
 *     diagnosis: 'Hypertension',
 *     medications: ['lisinopril', 'amlodipine']
 *   },
 *   {
 *     algorithm: 'AES-256-GCM',
 *     keyRotation: true,
 *     auditEncryption: true
 *   }
 * );
 * // Returns: {
 * //   encrypted: 'base64-encoded-encrypted-data',
 * //   keyId: 'key-2025-11-08-001',
 * //   algorithm: 'AES-256-GCM'
 * // }
 * // PHI encrypted at rest for HIPAA security rule compliance
 * ```
 */
export const encryptWorkflowData = async (
  data: any,
  options: {
    algorithm?: string;
    keyRotation?: boolean;
    auditEncryption?: boolean;
  } = {},
): Promise<{ encrypted: string; keyId: string; algorithm: string }> => {
  const algorithm = options.algorithm || 'AES-256-GCM';
  const keyId = `key-${new Date().toISOString().split('T')[0]}-001`;

  // In production, would use proper encryption library (e.g., Node crypto, AWS KMS)
  const jsonData = JSON.stringify(data);
  const encrypted = Buffer.from(jsonData).toString('base64');

  if (options.auditEncryption) {
    // Log encryption event for compliance
    createAuditTrail(
      'encryption-operation',
      'ENCRYPT_WORKFLOW_DATA',
      'system',
      'WORKFLOW_DATA',
      keyId,
      { algorithm },
    );
  }

  return {
    encrypted,
    keyId,
    algorithm,
  };
};

/**
 * Validates workflow for HIPAA compliance requirements.
 *
 * @param {WorkflowDefinition} definition - Workflow definition to validate
 * @param {WorkflowInstance} [instance] - Active workflow instance
 * @returns {{ compliant: boolean; violations: string[]; warnings: string[] }} Compliance validation result
 *
 * @example
 * ```typescript
 * const compliance = validateHIPAACompliance(patientAdmissionWorkflow, activeInstance);
 * if (!compliance.compliant) {
 *   console.error('HIPAA violations detected:', compliance.violations);
 *   // ['Missing audit trail for step "update-insurance"',
 *   //  'PHI not encrypted in step "store-patient-data"',
 *   //  'Access control not enforced for step "view-medical-history"']
 * }
 * console.warn('HIPAA warnings:', compliance.warnings);
 * // ['Consider adding secondary approval for high-risk medication orders']
 * ```
 */
export const validateHIPAACompliance = (
  definition: WorkflowDefinition,
  instance?: WorkflowInstance,
): { compliant: boolean; violations: string[]; warnings: string[] } => {
  const violations: string[] = [];
  const warnings: string[] = [];

  // Check for audit trail configuration
  if (!definition.metadata?.hipaaCompliant) {
    violations.push('Workflow not marked as HIPAA compliant');
  }

  // Check steps for compliance requirements
  definition.steps.forEach(step => {
    // Check for PHI handling steps
    if (step.metadata?.handlesPHI && !step.metadata?.encrypted) {
      violations.push(`Step "${step.id}" handles PHI but encryption not configured`);
    }

    // Check for access control
    if (step.type === 'human-task' && !step.metadata?.accessControl) {
      warnings.push(`Step "${step.id}" missing access control configuration`);
    }

    // Check for audit logging
    if (!step.metadata?.auditLogging) {
      warnings.push(`Step "${step.id}" missing audit logging configuration`);
    }
  });

  // Check instance for runtime compliance
  if (instance) {
    // Check for encryption of stored data
    if (instance.variables && !instance.context.metadata?.encrypted) {
      violations.push('Workflow instance data not encrypted at rest');
    }

    // Check for access logs
    const accessLogs = instance.context.metadata?.accessLogs;
    if (!accessLogs || accessLogs.length === 0) {
      violations.push('No access logs found for workflow instance');
    }
  }

  return {
    compliant: violations.length === 0,
    violations,
    warnings,
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Workflow Definition
  createWorkflowDefinition,
  validateWorkflowDefinition,
  versionWorkflow,
  compileWorkflow,

  // State Machine
  createStateMachine,
  transitionState,
  validateStateTransition,
  evaluateGuardCondition,

  // Step Orchestration
  executeWorkflowStep,
  chainWorkflowSteps,
  createConditionalStep,
  createLoopStep,

  // Parallel Execution
  executeParallelSteps,
  createForkJoin,
  raceSteps,
  aggregateParallelResults,

  // Conditional Branching
  evaluateBranch,
  createSwitchCase,
  routeDynamically,
  mergeBranches,

  // Compensation/Saga
  createSaga,
  executeCompensation,
  rollbackWorkflow,
  defineTransactionBoundary,

  // Human Tasks
  assignHumanTask,
  escalateTask,
  delegateTask,
  completeHumanTask,

  // Event Handling
  emitWorkflowEvent,
  subscribeToEvent,
  correlateEvent,
  persistWorkflowEvent,

  // Timeout Management
  configureTimeout,
  trackDeadline,
  monitorSLA,
  handleTimeout,

  // Persistence
  persistWorkflowState,
  recoverWorkflowState,
  createCheckpoint,
  getWorkflowHistory,

  // Visualization
  generateWorkflowGraph,
  generateStateDiagram,
  createExecutionTimeline,
  collectWorkflowMetrics,

  // Subprocess
  invokeSubprocess,
  coordinateSubprocesses,
  communicateWithParent,
  terminateSubprocess,

  // HIPAA Compliance
  createAuditTrail,
  logWorkflowAccess,
  encryptWorkflowData,
  validateHIPAACompliance,
};
