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
    escalateAfter: number;
    escalateTo: string;
    escalationType: 'user' | 'group' | 'role';
    notifyBefore?: number;
}
interface TimeoutConfig {
    duration: number;
    action: 'fail' | 'compensate' | 'retry' | 'escalate' | 'custom';
    handler?: (context: WorkflowContext) => Promise<void>;
    warningThreshold?: number;
}
interface SLAConfig {
    target: number;
    warning: number;
    critical: number;
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
    target: string;
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
    position?: {
        x: number;
        y: number;
    };
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
export declare const createWorkflowDefinition: (definition: Partial<WorkflowDefinition>) => WorkflowDefinition;
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
export declare const validateWorkflowDefinition: (definition: WorkflowDefinition) => {
    valid: boolean;
    errors: string[];
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
export declare const versionWorkflow: (currentDefinition: WorkflowDefinition, changes: Partial<WorkflowDefinition>, newVersion: string) => WorkflowDefinition;
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
export declare const compileWorkflow: (definition: WorkflowDefinition) => {
    definition: WorkflowDefinition;
    executionPlan: Map<string, any>;
    optimizations: Record<string, any>;
    estimatedDuration?: number;
};
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
export declare const createStateMachine: (id: string, initialState: string, states: StateDefinition[], transitions: StateTransition[]) => StateMachine;
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
export declare const transitionState: (stateMachine: StateMachine, event: string, context?: any) => Promise<StateMachine>;
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
export declare const validateStateTransition: (stateMachine: StateMachine, event: string) => boolean;
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
export declare const evaluateGuardCondition: (transition: StateTransition, context: any) => boolean;
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
export declare const executeWorkflowStep: (step: WorkflowStep, context: WorkflowContext) => Promise<any>;
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
export declare const chainWorkflowSteps: (steps: WorkflowStep[], context: WorkflowContext) => Promise<any[]>;
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
export declare const createConditionalStep: (id: string, branches: BranchCondition[], defaultStep?: WorkflowStep) => WorkflowStep;
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
export declare const createLoopStep: (id: string, loopSteps: WorkflowStep[], condition: (context: WorkflowContext) => boolean, maxIterations?: number) => WorkflowStep;
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
export declare const executeParallelSteps: (steps: WorkflowStep[], context: WorkflowContext, config?: ParallelExecutionConfig) => Promise<any[]>;
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
export declare const createForkJoin: (parallelSteps: WorkflowStep[], joinStep: WorkflowStep, aggregator: (results: any[]) => any) => WorkflowStep;
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
export declare const raceSteps: (steps: WorkflowStep[], context: WorkflowContext) => Promise<{
    result: any;
    stepId: string;
}>;
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
export declare const aggregateParallelResults: (results: any[], strategy?: "merge" | "array" | "first" | "custom", customAggregator?: (results: any[]) => any) => any;
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
export declare const evaluateBranch: (branch: BranchCondition, context: WorkflowContext) => Promise<{
    shouldBranch: boolean;
    target?: string;
}>;
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
export declare const createSwitchCase: (id: string, discriminator: string | ((context: WorkflowContext) => string), cases: Map<string, string>, defaultTarget?: string) => WorkflowStep;
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
export declare const routeDynamically: (context: WorkflowContext, router: (context: WorkflowContext) => string, routes: Map<string, WorkflowStep>) => Promise<string>;
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
export declare const mergeBranches: (branchResults: any[], strategy?: "union" | "intersection" | "priority" | "custom", customMerger?: (results: any[]) => any) => any;
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
export declare const createSaga: (id: string, steps: SagaStep[], compensationOrder?: "reverse" | "priority") => SagaDefinition;
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
export declare const executeCompensation: (saga: SagaDefinition, executedSteps: Array<{
    stepId: string;
    result: any;
}>, context: any) => Promise<{
    compensated: string[];
    failed: string[];
}>;
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
export declare const rollbackWorkflow: (saga: SagaDefinition, workflow: WorkflowInstance) => Promise<{
    success: boolean;
    compensatedSteps: string[];
}>;
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
export declare const defineTransactionBoundary: (id: string, steps: WorkflowStep[], options?: {
    isolationLevel?: string;
    timeout?: number;
    onCommit?: (context: WorkflowContext) => Promise<void>;
    onRollback?: (context: WorkflowContext) => Promise<void>;
}) => WorkflowStep;
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
export declare const assignHumanTask: (task: HumanTask, assignee: string, assigneeType: "user" | "group" | "role") => Promise<TaskAssignment>;
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
export declare const escalateTask: (task: HumanTask, reason: string) => Promise<HumanTask>;
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
export declare const delegateTask: (task: HumanTask, delegateTo: string, reason: string) => Promise<HumanTask>;
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
export declare const completeHumanTask: (task: HumanTask, actionId: string, resultData: any, completedBy: string) => Promise<HumanTask>;
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
export declare const emitWorkflowEvent: (type: string, workflowId: string, payload: any, correlationId?: string) => WorkflowEvent;
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
export declare const subscribeToEvent: (eventTypes: string | string[], handler: (event: WorkflowEvent) => Promise<void>, options?: {
    filter?: (event: WorkflowEvent) => boolean;
    priority?: number;
}) => {
    unsubscribe: () => void;
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
export declare const correlateEvent: (event: WorkflowEvent, waitingInstances: WorkflowInstance[]) => WorkflowInstance | null;
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
export declare const persistWorkflowEvent: (event: WorkflowEvent, metadata?: Record<string, any>) => Promise<{
    eventId: string;
    persisted: boolean;
}>;
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
export declare const configureTimeout: (duration: number, action?: "fail" | "compensate" | "retry" | "escalate" | "custom", handler?: (context: WorkflowContext) => Promise<void>) => TimeoutConfig;
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
export declare const trackDeadline: (workflow: WorkflowInstance, deadline: Date, options?: {
    warningBefore?: number;
    onWarning?: () => Promise<void>;
    onMiss?: () => Promise<void>;
}) => {
    deadline: Date;
    timeRemaining: number;
    isOverdue: boolean;
    check: () => Promise<void>;
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
export declare const monitorSLA: (workflow: WorkflowInstance, slaConfig: SLAConfig) => {
    config: SLAConfig;
    elapsed: number;
    status: "on-track" | "warning" | "critical" | "breached";
    check: () => Promise<void>;
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
export declare const handleTimeout: (config: TimeoutConfig, context: WorkflowContext) => Promise<void>;
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
export declare const persistWorkflowState: (workflow: WorkflowInstance) => Promise<{
    id: string;
    persisted: boolean;
}>;
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
export declare const recoverWorkflowState: (workflowId: string) => Promise<WorkflowInstance | null>;
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
export declare const createCheckpoint: (workflow: WorkflowInstance, reason?: string) => Promise<WorkflowCheckpoint>;
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
export declare const getWorkflowHistory: (workflowId: string, options?: {
    fromDate?: Date;
    toDate?: Date;
    status?: string[];
}) => Promise<WorkflowHistoryEntry[]>;
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
export declare const generateWorkflowGraph: (definition: WorkflowDefinition, instance?: WorkflowInstance) => WorkflowVisualization;
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
export declare const generateStateDiagram: (stateMachine: StateMachine) => WorkflowVisualization;
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
export declare const createExecutionTimeline: (workflow: WorkflowInstance) => ExecutionTimeline;
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
export declare const collectWorkflowMetrics: (definitionId: string, instances: WorkflowInstance[]) => WorkflowMetrics;
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
export declare const invokeSubprocess: (config: SubprocessConfig, parentContext: WorkflowContext) => Promise<{
    instanceId: string;
    result?: any;
}>;
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
export declare const coordinateSubprocesses: (subprocesses: SubprocessConfig[], parentContext: WorkflowContext, strategy?: "sequential" | "parallel" | "race") => Promise<Array<{
    instanceId: string;
    result?: any;
}>>;
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
export declare const communicateWithParent: (subprocessId: string, parentWorkflowId: string, message: any) => Promise<void>;
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
export declare const terminateSubprocess: (subprocessId: string, reason: string, compensate?: boolean) => Promise<{
    terminated: boolean;
    compensated: boolean;
}>;
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
export declare const createAuditTrail: (workflowId: string, action: string, userId: string, resourceType: string, resourceId: string, changes?: Record<string, any>) => HIPAAAuditTrail;
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
export declare const logWorkflowAccess: (workflowId: string, userId: string, accessType: "read" | "write" | "execute" | "admin", metadata?: {
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    sessionId?: string;
}) => Promise<HIPAAAuditTrail>;
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
export declare const encryptWorkflowData: (data: any, options?: {
    algorithm?: string;
    keyRotation?: boolean;
    auditEncryption?: boolean;
}) => Promise<{
    encrypted: string;
    keyId: string;
    algorithm: string;
}>;
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
export declare const validateHIPAACompliance: (definition: WorkflowDefinition, instance?: WorkflowInstance) => {
    compliant: boolean;
    violations: string[];
    warnings: string[];
};
declare const _default: {
    createWorkflowDefinition: (definition: Partial<WorkflowDefinition>) => WorkflowDefinition;
    validateWorkflowDefinition: (definition: WorkflowDefinition) => {
        valid: boolean;
        errors: string[];
    };
    versionWorkflow: (currentDefinition: WorkflowDefinition, changes: Partial<WorkflowDefinition>, newVersion: string) => WorkflowDefinition;
    compileWorkflow: (definition: WorkflowDefinition) => {
        definition: WorkflowDefinition;
        executionPlan: Map<string, any>;
        optimizations: Record<string, any>;
        estimatedDuration?: number;
    };
    createStateMachine: (id: string, initialState: string, states: StateDefinition[], transitions: StateTransition[]) => StateMachine;
    transitionState: (stateMachine: StateMachine, event: string, context?: any) => Promise<StateMachine>;
    validateStateTransition: (stateMachine: StateMachine, event: string) => boolean;
    evaluateGuardCondition: (transition: StateTransition, context: any) => boolean;
    executeWorkflowStep: (step: WorkflowStep, context: WorkflowContext) => Promise<any>;
    chainWorkflowSteps: (steps: WorkflowStep[], context: WorkflowContext) => Promise<any[]>;
    createConditionalStep: (id: string, branches: BranchCondition[], defaultStep?: WorkflowStep) => WorkflowStep;
    createLoopStep: (id: string, loopSteps: WorkflowStep[], condition: (context: WorkflowContext) => boolean, maxIterations?: number) => WorkflowStep;
    executeParallelSteps: (steps: WorkflowStep[], context: WorkflowContext, config?: ParallelExecutionConfig) => Promise<any[]>;
    createForkJoin: (parallelSteps: WorkflowStep[], joinStep: WorkflowStep, aggregator: (results: any[]) => any) => WorkflowStep;
    raceSteps: (steps: WorkflowStep[], context: WorkflowContext) => Promise<{
        result: any;
        stepId: string;
    }>;
    aggregateParallelResults: (results: any[], strategy?: "merge" | "array" | "first" | "custom", customAggregator?: (results: any[]) => any) => any;
    evaluateBranch: (branch: BranchCondition, context: WorkflowContext) => Promise<{
        shouldBranch: boolean;
        target?: string;
    }>;
    createSwitchCase: (id: string, discriminator: string | ((context: WorkflowContext) => string), cases: Map<string, string>, defaultTarget?: string) => WorkflowStep;
    routeDynamically: (context: WorkflowContext, router: (context: WorkflowContext) => string, routes: Map<string, WorkflowStep>) => Promise<string>;
    mergeBranches: (branchResults: any[], strategy?: "union" | "intersection" | "priority" | "custom", customMerger?: (results: any[]) => any) => any;
    createSaga: (id: string, steps: SagaStep[], compensationOrder?: "reverse" | "priority") => SagaDefinition;
    executeCompensation: (saga: SagaDefinition, executedSteps: Array<{
        stepId: string;
        result: any;
    }>, context: any) => Promise<{
        compensated: string[];
        failed: string[];
    }>;
    rollbackWorkflow: (saga: SagaDefinition, workflow: WorkflowInstance) => Promise<{
        success: boolean;
        compensatedSteps: string[];
    }>;
    defineTransactionBoundary: (id: string, steps: WorkflowStep[], options?: {
        isolationLevel?: string;
        timeout?: number;
        onCommit?: (context: WorkflowContext) => Promise<void>;
        onRollback?: (context: WorkflowContext) => Promise<void>;
    }) => WorkflowStep;
    assignHumanTask: (task: HumanTask, assignee: string, assigneeType: "user" | "group" | "role") => Promise<TaskAssignment>;
    escalateTask: (task: HumanTask, reason: string) => Promise<HumanTask>;
    delegateTask: (task: HumanTask, delegateTo: string, reason: string) => Promise<HumanTask>;
    completeHumanTask: (task: HumanTask, actionId: string, resultData: any, completedBy: string) => Promise<HumanTask>;
    emitWorkflowEvent: (type: string, workflowId: string, payload: any, correlationId?: string) => WorkflowEvent;
    subscribeToEvent: (eventTypes: string | string[], handler: (event: WorkflowEvent) => Promise<void>, options?: {
        filter?: (event: WorkflowEvent) => boolean;
        priority?: number;
    }) => {
        unsubscribe: () => void;
    };
    correlateEvent: (event: WorkflowEvent, waitingInstances: WorkflowInstance[]) => WorkflowInstance | null;
    persistWorkflowEvent: (event: WorkflowEvent, metadata?: Record<string, any>) => Promise<{
        eventId: string;
        persisted: boolean;
    }>;
    configureTimeout: (duration: number, action?: "fail" | "compensate" | "retry" | "escalate" | "custom", handler?: (context: WorkflowContext) => Promise<void>) => TimeoutConfig;
    trackDeadline: (workflow: WorkflowInstance, deadline: Date, options?: {
        warningBefore?: number;
        onWarning?: () => Promise<void>;
        onMiss?: () => Promise<void>;
    }) => {
        deadline: Date;
        timeRemaining: number;
        isOverdue: boolean;
        check: () => Promise<void>;
    };
    monitorSLA: (workflow: WorkflowInstance, slaConfig: SLAConfig) => {
        config: SLAConfig;
        elapsed: number;
        status: "on-track" | "warning" | "critical" | "breached";
        check: () => Promise<void>;
    };
    handleTimeout: (config: TimeoutConfig, context: WorkflowContext) => Promise<void>;
    persistWorkflowState: (workflow: WorkflowInstance) => Promise<{
        id: string;
        persisted: boolean;
    }>;
    recoverWorkflowState: (workflowId: string) => Promise<WorkflowInstance | null>;
    createCheckpoint: (workflow: WorkflowInstance, reason?: string) => Promise<WorkflowCheckpoint>;
    getWorkflowHistory: (workflowId: string, options?: {
        fromDate?: Date;
        toDate?: Date;
        status?: string[];
    }) => Promise<WorkflowHistoryEntry[]>;
    generateWorkflowGraph: (definition: WorkflowDefinition, instance?: WorkflowInstance) => WorkflowVisualization;
    generateStateDiagram: (stateMachine: StateMachine) => WorkflowVisualization;
    createExecutionTimeline: (workflow: WorkflowInstance) => ExecutionTimeline;
    collectWorkflowMetrics: (definitionId: string, instances: WorkflowInstance[]) => WorkflowMetrics;
    invokeSubprocess: (config: SubprocessConfig, parentContext: WorkflowContext) => Promise<{
        instanceId: string;
        result?: any;
    }>;
    coordinateSubprocesses: (subprocesses: SubprocessConfig[], parentContext: WorkflowContext, strategy?: "sequential" | "parallel" | "race") => Promise<Array<{
        instanceId: string;
        result?: any;
    }>>;
    communicateWithParent: (subprocessId: string, parentWorkflowId: string, message: any) => Promise<void>;
    terminateSubprocess: (subprocessId: string, reason: string, compensate?: boolean) => Promise<{
        terminated: boolean;
        compensated: boolean;
    }>;
    createAuditTrail: (workflowId: string, action: string, userId: string, resourceType: string, resourceId: string, changes?: Record<string, any>) => HIPAAAuditTrail;
    logWorkflowAccess: (workflowId: string, userId: string, accessType: "read" | "write" | "execute" | "admin", metadata?: {
        ipAddress?: string;
        userAgent?: string;
        location?: string;
        sessionId?: string;
    }) => Promise<HIPAAAuditTrail>;
    encryptWorkflowData: (data: any, options?: {
        algorithm?: string;
        keyRotation?: boolean;
        auditEncryption?: boolean;
    }) => Promise<{
        encrypted: string;
        keyId: string;
        algorithm: string;
    }>;
    validateHIPAACompliance: (definition: WorkflowDefinition, instance?: WorkflowInstance) => {
        compliant: boolean;
        violations: string[];
        warnings: string[];
    };
};
export default _default;
//# sourceMappingURL=nestjs-oracle-workflow-kit.d.ts.map