/**
 * LOC: WFSM-001
 * File: /reuse/workflow-statemachine-kit.ts
 *
 * UPSTREAM (imports from):
 *   - xstate
 *   - @nestjs/common
 *   - @nestjs/event-emitter
 *   - sequelize / sequelize-typescript
 *   - zod
 *
 * DOWNSTREAM (imported by):
 *   - Workflow services
 *   - State management modules
 *   - Business process handlers
 *   - Approval flow services
 *   - Task orchestration systems
 */
import { createMachine, interpret, State, StateNode, Interpreter, EventObject, StateMachine, AnyEventObject, assign, send, sendParent } from 'xstate';
/**
 * Zod schema for state definition.
 */
export declare const StateDefinitionSchema: any;
/**
 * Zod schema for transition validation.
 */
export declare const TransitionSchema: any;
/**
 * Zod schema for workflow definition.
 */
export declare const WorkflowDefinitionSchema: any;
/**
 * Zod schema for state persistence.
 */
export declare const StatePersistenceSchema: any;
/**
 * Zod schema for workflow execution context.
 */
export declare const WorkflowContextSchema: any;
/**
 * Zod schema for timeout configuration.
 */
export declare const TimeoutConfigSchema: any;
export interface StateDefinition {
    id: string;
    type?: 'atomic' | 'compound' | 'parallel' | 'final' | 'history';
    initial?: string;
    states?: Record<string, StateDefinition>;
    on?: Record<string, string | TransitionConfig>;
    entry?: string[];
    exit?: string[];
    invoke?: InvokeConfig;
    after?: Record<number, string>;
    always?: AlwaysTransition[];
    meta?: Record<string, any>;
}
export interface TransitionConfig {
    target: string;
    cond?: string | ((context: any, event: any) => boolean);
    actions?: string[] | Array<(context: any, event: any) => void>;
}
export interface InvokeConfig {
    src: string | ((context: any, event: any) => Promise<any>);
    onDone?: string;
    onError?: string;
}
export interface AlwaysTransition {
    target: string;
    cond?: string | ((context: any, event: any) => boolean);
}
export interface WorkflowDefinition {
    id: string;
    name: string;
    version: string;
    description?: string;
    states: Record<string, StateDefinition>;
    initialState: string;
    finalStates: string[];
    transitions: Transition[];
    guards?: Record<string, (context: any, event: any) => boolean>;
    actions?: Record<string, (context: any, event: any) => void>;
    services?: Record<string, (context: any, event: any) => Promise<any>>;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface Transition {
    from: string;
    to: string;
    event: string;
    guard?: string | ((context: any, event: any) => boolean);
    actions?: string[] | Array<(context: any, event: any) => void>;
    metadata?: Record<string, any>;
}
export interface WorkflowInstance {
    id: string;
    workflowId: string;
    currentState: string;
    context: Record<string, any>;
    history: StateHistoryEntry[];
    version: string;
    status: 'running' | 'completed' | 'failed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    completedAt?: Date;
    error?: string;
}
export interface StateHistoryEntry {
    state: string;
    event?: string;
    timestamp: Date;
    actor?: string;
    metadata?: Record<string, any>;
    context?: Record<string, any>;
}
export interface WorkflowContext {
    instanceId: string;
    workflowId: string;
    currentState: string;
    data: Record<string, any>;
    metadata?: Record<string, any>;
    startedAt: Date;
    startedBy?: string;
    completedAt?: Date;
    error?: string;
}
export interface TimeoutConfig {
    state: string;
    duration: number;
    action: 'transition' | 'fail' | 'compensate';
    targetState?: string;
    onTimeout?: string | (() => void);
}
export interface StateMachineConfig<TContext = any, TEvent extends EventObject = AnyEventObject> {
    id: string;
    initial: string;
    context?: TContext;
    states: Record<string, StateNode<TContext, any, TEvent>>;
    on?: Record<string, any>;
    guards?: Record<string, (context: TContext, event: TEvent) => boolean>;
    actions?: Record<string, (context: TContext, event: TEvent) => void>;
    services?: Record<string, (context: TContext, event: TEvent) => Promise<any>>;
}
export interface WorkflowTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    states: Record<string, StateDefinition>;
    initialState: string;
    variables: TemplateVariable[];
    metadata?: Record<string, any>;
}
export interface TemplateVariable {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
    required: boolean;
    defaultValue?: any;
    description?: string;
}
export interface ParallelStateConfig {
    id: string;
    states: Record<string, StateDefinition>;
    onDone?: string;
    onError?: string;
}
export interface CompensationConfig {
    state: string;
    compensationAction: string | ((context: any) => Promise<void>);
    trigger: 'always' | 'on_error' | 'manual';
}
/**
 * 1. Creates a fluent state machine builder with type safety.
 *
 * @example
 * const machine = createStateMachineBuilder<UserContext>('user-registration')
 *   .initialState('idle')
 *   .state('idle', (s) => s
 *     .on('SUBMIT', 'validating')
 *   )
 *   .state('validating', (s) => s
 *     .invoke('validateUser', {
 *       onDone: 'creating',
 *       onError: 'error',
 *     })
 *   )
 *   .finalState('created')
 *   .build();
 */
export declare function createStateMachineBuilder<TContext = any>(id: string): {
    initialState(stateName: string): /*elided*/ any;
    state(name: string, config: (stateBuilder: any) => any): /*elided*/ any;
    finalState(name: string): /*elided*/ any;
    guard(name: string, fn: (context: TContext, event: any) => boolean): /*elided*/ any;
    action(name: string, fn: (context: TContext, event: any) => void): /*elided*/ any;
    service(name: string, fn: (context: TContext, event: any) => Promise<any>): /*elided*/ any;
    build(): StateMachine<TContext, any, any>;
};
/**
 * 2. Creates a state machine from a workflow definition.
 *
 * @example
 * const machine = createMachineFromWorkflow(workflowDefinition);
 */
export declare function createMachineFromWorkflow<TContext = any>(workflow: WorkflowDefinition): StateMachine<TContext, any, any>;
/**
 * 3. Creates a hierarchical state machine with nested states.
 *
 * @example
 * const machine = createHierarchicalMachine('order', {
 *   pending: {
 *     initial: 'awaiting_payment',
 *     states: {
 *       awaiting_payment: {},
 *       payment_processing: {},
 *     },
 *   },
 *   fulfilled: { type: 'final' },
 * });
 */
export declare function createHierarchicalMachine<TContext = any>(id: string, states: Record<string, StateDefinition>, initialState?: string): StateMachine<TContext, any, any>;
/**
 * 4. Creates a parallel state machine for concurrent state execution.
 *
 * @example
 * const machine = createParallelMachine('document-review', {
 *   technical_review: {
 *     initial: 'pending',
 *     states: { pending: {}, approved: { type: 'final' } },
 *   },
 *   legal_review: {
 *     initial: 'pending',
 *     states: { pending: {}, approved: { type: 'final' } },
 *   },
 * });
 */
export declare function createParallelMachine<TContext = any>(id: string, states: Record<string, StateDefinition>, config?: ParallelStateConfig): StateMachine<TContext, any, any>;
/**
 * 5. Creates a state machine with history support.
 *
 * @example
 * const machine = createMachineWithHistory('user-session', {
 *   active: {
 *     initial: 'browsing',
 *     states: {
 *       browsing: {},
 *       checkout: {},
 *       hist: { type: 'history', history: 'shallow' },
 *     },
 *   },
 *   inactive: {
 *     on: { RESUME: 'active.hist' },
 *   },
 * });
 */
export declare function createMachineWithHistory<TContext = any>(id: string, states: Record<string, StateDefinition>, initialState: string): StateMachine<TContext, any, any>;
/**
 * 6. Validates if a transition is allowed from current state.
 *
 * @example
 * const isValid = validateTransition(machine, 'idle', 'SUBMIT', context);
 */
export declare function validateTransition<TContext = any>(machine: StateMachine<TContext, any, any>, fromState: string, event: string, context?: TContext): boolean;
/**
 * 7. Gets all valid transitions from a given state.
 *
 * @example
 * const transitions = getValidTransitions(machine, 'pending');
 */
export declare function getValidTransitions<TContext = any>(machine: StateMachine<TContext, any, any>, fromState: string, context?: TContext): string[];
/**
 * 8. Validates transition with custom guard conditions.
 *
 * @example
 * const isAllowed = validateTransitionWithGuard(
 *   transition,
 *   context,
 *   (ctx, event) => ctx.user.role === 'admin'
 * );
 */
export declare function validateTransitionWithGuard<TContext = any>(transition: Transition, context: TContext, event?: any): boolean;
/**
 * 9. Creates a transition validator with multiple conditions.
 *
 * @example
 * const validator = createTransitionValidator([
 *   (ctx, event) => ctx.isAuthenticated,
 *   (ctx, event) => ctx.user.permissions.includes('edit'),
 * ]);
 */
export declare function createTransitionValidator<TContext = any>(guards: Array<(context: TContext, event: any) => boolean>): (context: TContext, event: any) => boolean;
/**
 * 10. Validates state machine configuration for errors.
 *
 * @example
 * const errors = validateMachineConfig(machineConfig);
 */
export declare function validateMachineConfig(config: any): string[];
/**
 * 11. Persists state machine state to storage.
 *
 * @example
 * await persistState(workflowId, instanceId, state, context);
 */
export declare function persistState<TContext = any>(workflowId: string, instanceId: string, state: string, context: TContext, history: StateHistoryEntry[], version: string, storage: StateStorage): Promise<void>;
/**
 * 12. Restores state machine state from storage.
 *
 * @example
 * const restored = await restoreState(workflowId, instanceId, storage);
 */
export declare function restoreState<TContext = any>(workflowId: string, instanceId: string, storage: StateStorage): Promise<{
    state: string;
    context: TContext;
    history: StateHistoryEntry[];
} | null>;
/**
 * 13. Creates a state storage interface for custom implementations.
 */
export interface StateStorage {
    save(data: any): Promise<void>;
    load(workflowId: string, instanceId: string): Promise<any | null>;
    delete(workflowId: string, instanceId: string): Promise<void>;
    list(workflowId: string): Promise<any[]>;
}
/**
 * 14. Creates an in-memory state storage implementation.
 *
 * @example
 * const storage = createInMemoryStorage();
 */
export declare function createInMemoryStorage(): StateStorage;
/**
 * 15. Creates a snapshot of current state machine state.
 *
 * @example
 * const snapshot = createStateSnapshot(machine, state, context);
 */
export declare function createStateSnapshot<TContext = any>(machine: StateMachine<TContext, any, any>, state: State<TContext, any>, metadata?: Record<string, any>): any;
/**
 * 16. Creates a workflow execution engine with event handling.
 *
 * @example
 * const engine = createWorkflowEngine(machine, { persist: true });
 * await engine.start(initialContext);
 * await engine.send({ type: 'SUBMIT', data: formData });
 */
export declare function createWorkflowEngine<TContext = any>(machine: StateMachine<TContext, any, any>, options?: {
    persist?: boolean;
    storage?: StateStorage;
    onTransition?: (state: State<TContext, any>) => void;
    onError?: (error: Error) => void;
}): {
    start(context?: TContext): any;
    send(event: any): void;
    stop(): void;
    getState(): any;
    subscribe(listener: (state: State<TContext, any>) => void): any;
    on(event: string, handler: (...args: any[]) => void): void;
    off(event: string, handler: (...args: any[]) => void): void;
};
/**
 * 17. Executes a workflow with automatic state persistence.
 *
 * @example
 * const result = await executeWorkflow(workflowDef, context, storage);
 */
export declare function executeWorkflow<TContext = any>(workflow: WorkflowDefinition, context: TContext, storage?: StateStorage, options?: {
    instanceId?: string;
    onStateChange?: (state: string, context: TContext) => void;
}): Promise<WorkflowInstance>;
/**
 * 18. Resumes a paused workflow from storage.
 *
 * @example
 * const instance = await resumeWorkflow(workflowId, instanceId, storage);
 */
export declare function resumeWorkflow(workflowId: string, instanceId: string, workflow: WorkflowDefinition, storage: StateStorage): Promise<WorkflowInstance | null>;
/**
 * 19. Cancels a running workflow instance.
 *
 * @example
 * await cancelWorkflow(instanceId, engine, storage);
 */
export declare function cancelWorkflow(instanceId: string, engine: any, storage?: StateStorage, reason?: string): Promise<void>;
/**
 * 20. Creates a workflow instance with timeout handling.
 *
 * @example
 * const instance = await executeWorkflowWithTimeout(workflow, context, 30000);
 */
export declare function executeWorkflowWithTimeout<TContext = any>(workflow: WorkflowDefinition, context: TContext, timeoutMs: number, storage?: StateStorage): Promise<WorkflowInstance>;
/**
 * 21. Adds a history entry to the workflow instance.
 *
 * @example
 * addHistoryEntry(instance, 'approved', 'APPROVE', 'user123');
 */
export declare function addHistoryEntry(instance: WorkflowInstance, state: string, event?: string, actor?: string, metadata?: Record<string, any>): void;
/**
 * 22. Gets the complete state history for a workflow instance.
 *
 * @example
 * const history = getStateHistory(instance, { limit: 10 });
 */
export declare function getStateHistory(instance: WorkflowInstance, options?: {
    limit?: number;
    fromDate?: Date;
    toDate?: Date;
}): StateHistoryEntry[];
/**
 * 23. Gets state transitions between two specific states.
 *
 * @example
 * const transitions = getTransitionsBetween(instance, 'pending', 'approved');
 */
export declare function getTransitionsBetween(instance: WorkflowInstance, fromState: string, toState: string): StateHistoryEntry[];
/**
 * 24. Calculates time spent in each state.
 *
 * @example
 * const times = calculateStateTimings(instance);
 */
export declare function calculateStateTimings(instance: WorkflowInstance): Record<string, number>;
/**
 * 25. Creates a state history visualization.
 *
 * @example
 * const viz = visualizeHistory(instance);
 */
export declare function visualizeHistory(instance: WorkflowInstance): string;
/**
 * 26. Rolls back workflow to a previous state.
 *
 * @example
 * await rollbackToState(instance, 'pending', machine, storage);
 */
export declare function rollbackToState<TContext = any>(instance: WorkflowInstance, targetState: string, machine: StateMachine<TContext, any, any>, storage?: StateStorage): Promise<void>;
/**
 * 27. Executes compensation actions for failed workflows.
 *
 * @example
 * await compensateWorkflow(instance, compensationActions);
 */
export declare function compensateWorkflow(instance: WorkflowInstance, compensationActions: CompensationConfig[]): Promise<void>;
/**
 * 28. Creates a saga pattern for distributed transactions.
 *
 * @example
 * const saga = createSaga([
 *   { action: createOrder, compensation: cancelOrder },
 *   { action: chargePayment, compensation: refundPayment },
 * ]);
 */
export declare function createSaga(steps: Array<{
    action: (context: any) => Promise<any>;
    compensation: (context: any) => Promise<void>;
}>): {
    execute(context: any): Promise<{
        success: boolean;
        context: any;
        error?: Error;
    }>;
};
/**
 * 29. Adds timeout configuration to a state.
 *
 * @example
 * const config = addStateTimeout('pending', 30000, 'expired');
 */
export declare function addStateTimeout(state: string, durationMs: number, targetState: string, action?: () => void): TimeoutConfig;
/**
 * 30. Creates a timeout monitor for workflow instances.
 *
 * @example
 * const monitor = createTimeoutMonitor(timeoutConfigs);
 * monitor.start(instance, engine);
 */
export declare function createTimeoutMonitor(configs: TimeoutConfig[]): {
    start(instance: WorkflowInstance, engine: any): void;
    stop(state?: string): void;
};
/**
 * 31. Sets a deadline for workflow completion.
 *
 * @example
 * await setWorkflowDeadline(instance, new Date('2024-12-31'), engine);
 */
export declare function setWorkflowDeadline(instance: WorkflowInstance, deadline: Date, engine: any, onDeadline?: () => void): Promise<void>;
/**
 * 32. Creates a workflow template for reusable workflows.
 *
 * @example
 * const template = createWorkflowTemplate('approval-flow', {
 *   states: { pending: {}, approved: {}, rejected: {} },
 *   variables: [{ name: 'approver', type: 'string', required: true }],
 * });
 */
export declare function createWorkflowTemplate(name: string, config: {
    states: Record<string, StateDefinition>;
    initialState: string;
    variables: TemplateVariable[];
    description?: string;
    category?: string;
}): WorkflowTemplate;
/**
 * 33. Instantiates a workflow from a template with variable substitution.
 *
 * @example
 * const workflow = instantiateTemplate(template, {
 *   approver: 'john@example.com',
 *   requiredApprovals: 2,
 * });
 */
export declare function instantiateTemplate(template: WorkflowTemplate, variables: Record<string, any>): WorkflowDefinition;
/**
 * 34. Creates a multi-step approval workflow template.
 *
 * @example
 * const template = createApprovalWorkflowTemplate(['manager', 'director', 'vp']);
 */
export declare function createApprovalWorkflowTemplate(approvers: string[]): WorkflowTemplate;
/**
 * 35. Generates a Mermaid diagram for workflow visualization.
 *
 * @example
 * const diagram = generateMermaidDiagram(workflow);
 */
export declare function generateMermaidDiagram(workflow: WorkflowDefinition): string;
/**
 * 36. Generates a DOT graph for workflow visualization.
 *
 * @example
 * const dot = generateDotGraph(workflow);
 */
export declare function generateDotGraph(workflow: WorkflowDefinition): string;
/**
 * 37. Generates a JSON representation of workflow structure.
 *
 * @example
 * const json = exportWorkflowAsJson(workflow);
 */
export declare function exportWorkflowAsJson(workflow: WorkflowDefinition): string;
/**
 * 38. Imports a workflow from JSON definition.
 *
 * @example
 * const workflow = importWorkflowFromJson(jsonString);
 */
export declare function importWorkflowFromJson(json: string): WorkflowDefinition;
/**
 * 39. Merges multiple workflows into a composite workflow.
 *
 * @example
 * const composite = mergeWorkflows([workflow1, workflow2], 'sequential');
 */
export declare function mergeWorkflows(workflows: WorkflowDefinition[], strategy: 'sequential' | 'parallel'): WorkflowDefinition;
/**
 * 40. Creates a workflow middleware for intercepting state transitions.
 *
 * @example
 * const middleware = createWorkflowMiddleware({
 *   before: (from, to, event) => console.log(`Transitioning from ${from} to ${to}`),
 *   after: (state, context) => console.log(`Now in ${state}`),
 * });
 */
export declare function createWorkflowMiddleware(config: {
    before?: (from: string, to: string, event: any, context: any) => Promise<void> | void;
    after?: (state: string, context: any) => Promise<void> | void;
    onError?: (error: Error, context: any) => Promise<void> | void;
}): {
    execute(fromState: string, toState: string, event: any, context: any, transition: () => Promise<any>): Promise<any>;
};
export { createMachine, interpret, State, StateMachine, Interpreter, assign, send, sendParent, };
//# sourceMappingURL=workflow-statemachine-kit.d.ts.map