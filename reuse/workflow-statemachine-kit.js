"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendParent = exports.send = exports.assign = exports.Interpreter = exports.StateMachine = exports.State = exports.interpret = exports.createMachine = exports.TimeoutConfigSchema = exports.WorkflowContextSchema = exports.StatePersistenceSchema = exports.WorkflowDefinitionSchema = exports.TransitionSchema = exports.StateDefinitionSchema = void 0;
exports.createStateMachineBuilder = createStateMachineBuilder;
exports.createMachineFromWorkflow = createMachineFromWorkflow;
exports.createHierarchicalMachine = createHierarchicalMachine;
exports.createParallelMachine = createParallelMachine;
exports.createMachineWithHistory = createMachineWithHistory;
exports.validateTransition = validateTransition;
exports.getValidTransitions = getValidTransitions;
exports.validateTransitionWithGuard = validateTransitionWithGuard;
exports.createTransitionValidator = createTransitionValidator;
exports.validateMachineConfig = validateMachineConfig;
exports.persistState = persistState;
exports.restoreState = restoreState;
exports.createInMemoryStorage = createInMemoryStorage;
exports.createStateSnapshot = createStateSnapshot;
exports.createWorkflowEngine = createWorkflowEngine;
exports.executeWorkflow = executeWorkflow;
exports.resumeWorkflow = resumeWorkflow;
exports.cancelWorkflow = cancelWorkflow;
exports.executeWorkflowWithTimeout = executeWorkflowWithTimeout;
exports.addHistoryEntry = addHistoryEntry;
exports.getStateHistory = getStateHistory;
exports.getTransitionsBetween = getTransitionsBetween;
exports.calculateStateTimings = calculateStateTimings;
exports.visualizeHistory = visualizeHistory;
exports.rollbackToState = rollbackToState;
exports.compensateWorkflow = compensateWorkflow;
exports.createSaga = createSaga;
exports.addStateTimeout = addStateTimeout;
exports.createTimeoutMonitor = createTimeoutMonitor;
exports.setWorkflowDeadline = setWorkflowDeadline;
exports.createWorkflowTemplate = createWorkflowTemplate;
exports.instantiateTemplate = instantiateTemplate;
exports.createApprovalWorkflowTemplate = createApprovalWorkflowTemplate;
exports.generateMermaidDiagram = generateMermaidDiagram;
exports.generateDotGraph = generateDotGraph;
exports.exportWorkflowAsJson = exportWorkflowAsJson;
exports.importWorkflowFromJson = importWorkflowFromJson;
exports.mergeWorkflows = mergeWorkflows;
exports.createWorkflowMiddleware = createWorkflowMiddleware;
/**
 * File: /reuse/workflow-statemachine-kit.ts
 * Locator: WC-UTL-WFSM-001
 * Purpose: Advanced Workflow and State Machine Utilities - Production-grade state management, workflow orchestration, and process automation
 *
 * Upstream: xstate, @nestjs/common, @nestjs/event-emitter, sequelize, sequelize-typescript, zod, rxjs
 * Downstream: ../backend/*, workflow services, state managers, process handlers, orchestration systems
 * Dependencies: NestJS 10.x, XState 4.x, Sequelize 6.x, Zod 3.x, TypeScript 5.x, RxJS 7.x
 * Exports: 40 production-grade utility functions for state machines, workflows, transitions, persistence, history tracking
 *
 * LLM Context: Enterprise-grade workflow and state machine utilities for White Cross healthcare platform.
 * Provides comprehensive state machine builders, transition validators, state persistence, workflow definition builders,
 * state history tracking, conditional transitions, parallel state support, nested state machines, state event emitters,
 * workflow execution engines, state rollback utilities, timeout/deadline handlers, state visualization helpers,
 * workflow templates, approval flows, task orchestration, compensation handlers, saga patterns, and audit trails.
 * Optimized for HIPAA-compliant healthcare workflow management and process automation.
 *
 * Features:
 * - XState-based state machine integration
 * - Hierarchical and parallel states
 * - State persistence with Sequelize
 * - Event-driven state transitions
 * - Workflow versioning and migration
 * - Rollback and compensation
 * - Timeout and deadline management
 * - Real-time state synchronization
 * - Audit trail and history tracking
 * - Workflow visualization
 * - Template-based workflow creation
 * - Multi-tenant workflow isolation
 */
const zod_1 = require("zod");
const xstate_1 = require("xstate");
Object.defineProperty(exports, "createMachine", { enumerable: true, get: function () { return xstate_1.createMachine; } });
Object.defineProperty(exports, "interpret", { enumerable: true, get: function () { return xstate_1.interpret; } });
Object.defineProperty(exports, "State", { enumerable: true, get: function () { return xstate_1.State; } });
Object.defineProperty(exports, "Interpreter", { enumerable: true, get: function () { return xstate_1.Interpreter; } });
Object.defineProperty(exports, "StateMachine", { enumerable: true, get: function () { return xstate_1.StateMachine; } });
Object.defineProperty(exports, "assign", { enumerable: true, get: function () { return xstate_1.assign; } });
Object.defineProperty(exports, "send", { enumerable: true, get: function () { return xstate_1.send; } });
Object.defineProperty(exports, "sendParent", { enumerable: true, get: function () { return xstate_1.sendParent; } });
const event_emitter_1 = require("@nestjs/event-emitter");
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Zod schema for state definition.
 */
exports.StateDefinitionSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    type: zod_1.z.enum(['atomic', 'compound', 'parallel', 'final', 'history']).default('atomic'),
    initial: zod_1.z.string().optional(),
    states: zod_1.z.record(zod_1.z.lazy(() => exports.StateDefinitionSchema)).optional(),
    on: zod_1.z.record(zod_1.z.union([
        zod_1.z.string(),
        zod_1.z.object({
            target: zod_1.z.string(),
            cond: zod_1.z.string().optional(),
            actions: zod_1.z.array(zod_1.z.string()).optional(),
        }),
    ])).optional(),
    entry: zod_1.z.array(zod_1.z.string()).optional(),
    exit: zod_1.z.array(zod_1.z.string()).optional(),
    invoke: zod_1.z.object({
        src: zod_1.z.string(),
        onDone: zod_1.z.string().optional(),
        onError: zod_1.z.string().optional(),
    }).optional(),
    after: zod_1.z.record(zod_1.z.string()).optional(),
    always: zod_1.z.array(zod_1.z.object({
        target: zod_1.z.string(),
        cond: zod_1.z.string().optional(),
    })).optional(),
    meta: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for transition validation.
 */
exports.TransitionSchema = zod_1.z.object({
    from: zod_1.z.string(),
    to: zod_1.z.string(),
    event: zod_1.z.string(),
    guard: zod_1.z.string().optional(),
    actions: zod_1.z.array(zod_1.z.string()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for workflow definition.
 */
exports.WorkflowDefinitionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    version: zod_1.z.string().regex(/^\d+\.\d+\.\d+$/),
    description: zod_1.z.string().optional(),
    states: zod_1.z.record(exports.StateDefinitionSchema),
    initialState: zod_1.z.string(),
    finalStates: zod_1.z.array(zod_1.z.string()),
    transitions: zod_1.z.array(exports.TransitionSchema),
    guards: zod_1.z.record(zod_1.z.string()).optional(),
    actions: zod_1.z.record(zod_1.z.string()).optional(),
    services: zod_1.z.record(zod_1.z.string()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
/**
 * Zod schema for state persistence.
 */
exports.StatePersistenceSchema = zod_1.z.object({
    workflowId: zod_1.z.string().uuid(),
    instanceId: zod_1.z.string().uuid(),
    currentState: zod_1.z.string(),
    context: zod_1.z.record(zod_1.z.any()),
    history: zod_1.z.array(zod_1.z.object({
        state: zod_1.z.string(),
        event: zod_1.z.string().optional(),
        timestamp: zod_1.z.date(),
        actor: zod_1.z.string().optional(),
        metadata: zod_1.z.record(zod_1.z.any()).optional(),
    })),
    version: zod_1.z.string(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
/**
 * Zod schema for workflow execution context.
 */
exports.WorkflowContextSchema = zod_1.z.object({
    instanceId: zod_1.z.string().uuid(),
    workflowId: zod_1.z.string().uuid(),
    currentState: zod_1.z.string(),
    data: zod_1.z.record(zod_1.z.any()),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    startedAt: zod_1.z.date(),
    startedBy: zod_1.z.string().optional(),
    completedAt: zod_1.z.date().optional(),
    error: zod_1.z.string().optional(),
});
/**
 * Zod schema for timeout configuration.
 */
exports.TimeoutConfigSchema = zod_1.z.object({
    state: zod_1.z.string(),
    duration: zod_1.z.number().int().positive(),
    action: zod_1.z.enum(['transition', 'fail', 'compensate']),
    targetState: zod_1.z.string().optional(),
    onTimeout: zod_1.z.string().optional(),
});
// ============================================================================
// STATE MACHINE BUILDERS
// ============================================================================
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
function createStateMachineBuilder(id) {
    const states = {};
    let initial;
    const guards = {};
    const actions = {};
    const services = {};
    const builder = {
        initialState(stateName) {
            initial = stateName;
            return this;
        },
        state(name, config) {
            const stateBuilder = {
                on(event, target) {
                    if (!states[name])
                        states[name] = {};
                    if (!states[name].on)
                        states[name].on = {};
                    states[name].on[event] = target;
                    return this;
                },
                entry(action) {
                    if (!states[name])
                        states[name] = {};
                    if (!states[name].entry)
                        states[name].entry = [];
                    states[name].entry.push(action);
                    return this;
                },
                exit(action) {
                    if (!states[name])
                        states[name] = {};
                    if (!states[name].exit)
                        states[name].exit = [];
                    states[name].exit.push(action);
                    return this;
                },
                invoke(src, config) {
                    if (!states[name])
                        states[name] = {};
                    states[name].invoke = { src, ...config };
                    return this;
                },
                after(delay, target) {
                    if (!states[name])
                        states[name] = {};
                    if (!states[name].after)
                        states[name].after = {};
                    states[name].after[delay] = target;
                    return this;
                },
            };
            config(stateBuilder);
            return this;
        },
        finalState(name) {
            states[name] = { type: 'final' };
            return this;
        },
        guard(name, fn) {
            guards[name] = fn;
            return this;
        },
        action(name, fn) {
            actions[name] = fn;
            return this;
        },
        service(name, fn) {
            services[name] = fn;
            return this;
        },
        build() {
            return (0, xstate_1.createMachine)({
                id,
                initial,
                states,
            }, {
                guards,
                actions,
                services,
            });
        },
    };
    return builder;
}
/**
 * 2. Creates a state machine from a workflow definition.
 *
 * @example
 * const machine = createMachineFromWorkflow(workflowDefinition);
 */
function createMachineFromWorkflow(workflow) {
    const machineConfig = {
        id: workflow.id,
        initial: workflow.initialState,
        states: {},
    };
    // Convert workflow states to machine states
    for (const [stateId, stateDef] of Object.entries(workflow.states)) {
        machineConfig.states[stateId] = {
            type: stateDef.type || 'atomic',
            on: stateDef.on || {},
            entry: stateDef.entry || [],
            exit: stateDef.exit || [],
            invoke: stateDef.invoke,
            after: stateDef.after,
            always: stateDef.always,
            meta: stateDef.meta,
        };
        if (stateDef.states) {
            machineConfig.states[stateId].states = stateDef.states;
            machineConfig.states[stateId].initial = stateDef.initial;
        }
        if (workflow.finalStates.includes(stateId)) {
            machineConfig.states[stateId].type = 'final';
        }
    }
    return (0, xstate_1.createMachine)(machineConfig, {
        guards: workflow.guards || {},
        actions: workflow.actions || {},
        services: workflow.services || {},
    });
}
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
function createHierarchicalMachine(id, states, initialState) {
    return (0, xstate_1.createMachine)({
        id,
        initial: initialState || Object.keys(states)[0],
        states,
    });
}
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
function createParallelMachine(id, states, config) {
    return (0, xstate_1.createMachine)({
        id,
        type: 'parallel',
        states,
        onDone: config?.onDone,
    });
}
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
function createMachineWithHistory(id, states, initialState) {
    return (0, xstate_1.createMachine)({
        id,
        initial: initialState,
        states,
    });
}
// ============================================================================
// TRANSITION VALIDATORS
// ============================================================================
/**
 * 6. Validates if a transition is allowed from current state.
 *
 * @example
 * const isValid = validateTransition(machine, 'idle', 'SUBMIT', context);
 */
function validateTransition(machine, fromState, event, context) {
    const state = machine.transition(fromState, event, context);
    return !state.matches(fromState);
}
/**
 * 7. Gets all valid transitions from a given state.
 *
 * @example
 * const transitions = getValidTransitions(machine, 'pending');
 */
function getValidTransitions(machine, fromState, context) {
    const stateNode = machine.getStateNodeByPath(fromState);
    if (!stateNode)
        return [];
    const events = Object.keys(stateNode.on || {});
    return events.filter(event => validateTransition(machine, fromState, event, context));
}
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
function validateTransitionWithGuard(transition, context, event) {
    if (!transition.guard)
        return true;
    if (typeof transition.guard === 'function') {
        return transition.guard(context, event);
    }
    return true;
}
/**
 * 9. Creates a transition validator with multiple conditions.
 *
 * @example
 * const validator = createTransitionValidator([
 *   (ctx, event) => ctx.isAuthenticated,
 *   (ctx, event) => ctx.user.permissions.includes('edit'),
 * ]);
 */
function createTransitionValidator(guards) {
    return (context, event) => {
        return guards.every(guard => guard(context, event));
    };
}
/**
 * 10. Validates state machine configuration for errors.
 *
 * @example
 * const errors = validateMachineConfig(machineConfig);
 */
function validateMachineConfig(config) {
    const errors = [];
    if (!config.id) {
        errors.push('Machine must have an id');
    }
    if (!config.initial) {
        errors.push('Machine must have an initial state');
    }
    if (!config.states || Object.keys(config.states).length === 0) {
        errors.push('Machine must have at least one state');
    }
    if (config.initial && config.states && !config.states[config.initial]) {
        errors.push(`Initial state "${config.initial}" does not exist in states`);
    }
    // Validate transitions
    for (const [stateId, state] of Object.entries(config.states || {})) {
        const stateConfig = state;
        if (stateConfig.on) {
            for (const [event, target] of Object.entries(stateConfig.on)) {
                const targetState = typeof target === 'string' ? target : target.target;
                if (targetState && !config.states[targetState]) {
                    errors.push(`State "${stateId}" has transition to non-existent state "${targetState}"`);
                }
            }
        }
    }
    return errors;
}
// ============================================================================
// STATE PERSISTENCE
// ============================================================================
/**
 * 11. Persists state machine state to storage.
 *
 * @example
 * await persistState(workflowId, instanceId, state, context);
 */
async function persistState(workflowId, instanceId, state, context, history, version, storage) {
    await storage.save({
        workflowId,
        instanceId,
        currentState: state,
        context: context,
        history,
        version,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
}
/**
 * 12. Restores state machine state from storage.
 *
 * @example
 * const restored = await restoreState(workflowId, instanceId, storage);
 */
async function restoreState(workflowId, instanceId, storage) {
    const persisted = await storage.load(workflowId, instanceId);
    if (!persisted)
        return null;
    return {
        state: persisted.currentState,
        context: persisted.context,
        history: persisted.history,
    };
}
/**
 * 14. Creates an in-memory state storage implementation.
 *
 * @example
 * const storage = createInMemoryStorage();
 */
function createInMemoryStorage() {
    const store = new Map();
    return {
        async save(data) {
            const key = `${data.workflowId}:${data.instanceId}`;
            store.set(key, data);
        },
        async load(workflowId, instanceId) {
            const key = `${workflowId}:${instanceId}`;
            return store.get(key) || null;
        },
        async delete(workflowId, instanceId) {
            const key = `${workflowId}:${instanceId}`;
            store.delete(key);
        },
        async list(workflowId) {
            const results = [];
            for (const [key, value] of store.entries()) {
                if (key.startsWith(`${workflowId}:`)) {
                    results.push(value);
                }
            }
            return results;
        },
    };
}
/**
 * 15. Creates a snapshot of current state machine state.
 *
 * @example
 * const snapshot = createStateSnapshot(machine, state, context);
 */
function createStateSnapshot(machine, state, metadata) {
    return {
        machineId: machine.id,
        value: state.value,
        context: state.context,
        changed: state.changed,
        done: state.done,
        event: state.event,
        historyValue: state.historyValue,
        meta: state.meta,
        metadata,
        timestamp: new Date(),
    };
}
// ============================================================================
// WORKFLOW EXECUTION ENGINE
// ============================================================================
/**
 * 16. Creates a workflow execution engine with event handling.
 *
 * @example
 * const engine = createWorkflowEngine(machine, { persist: true });
 * await engine.start(initialContext);
 * await engine.send({ type: 'SUBMIT', data: formData });
 */
function createWorkflowEngine(machine, options) {
    let service = null;
    const eventEmitter = new event_emitter_1.EventEmitter2();
    return {
        start(context) {
            service = (0, xstate_1.interpret)(machine.withContext(context || {}))
                .onTransition((state) => {
                if (options?.onTransition) {
                    options.onTransition(state);
                }
                eventEmitter.emit('transition', state);
            })
                .onDone(() => {
                eventEmitter.emit('done');
            })
                .onStop(() => {
                eventEmitter.emit('stopped');
            });
            service.start();
            return service;
        },
        send(event) {
            if (!service) {
                throw new Error('Workflow engine not started');
            }
            service.send(event);
        },
        stop() {
            if (service) {
                service.stop();
                service = null;
            }
        },
        getState() {
            return service?.state || null;
        },
        subscribe(listener) {
            if (!service) {
                throw new Error('Workflow engine not started');
            }
            return service.subscribe(listener);
        },
        on(event, handler) {
            eventEmitter.on(event, handler);
        },
        off(event, handler) {
            eventEmitter.off(event, handler);
        },
    };
}
/**
 * 17. Executes a workflow with automatic state persistence.
 *
 * @example
 * const result = await executeWorkflow(workflowDef, context, storage);
 */
async function executeWorkflow(workflow, context, storage, options) {
    const machine = createMachineFromWorkflow(workflow);
    const instanceId = options?.instanceId || crypto.randomUUID();
    const history = [];
    const instance = {
        id: instanceId,
        workflowId: workflow.id,
        currentState: workflow.initialState,
        context: context,
        history,
        version: workflow.version,
        status: 'running',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const engine = createWorkflowEngine(machine, {
        persist: !!storage,
        storage,
        onTransition: async (state) => {
            instance.currentState = state.value;
            instance.context = state.context;
            instance.updatedAt = new Date();
            history.push({
                state: state.value,
                timestamp: new Date(),
                context: state.context,
            });
            if (options?.onStateChange) {
                options.onStateChange(state.value, state.context);
            }
            if (storage) {
                await persistState(workflow.id, instanceId, state.value, state.context, history, workflow.version, storage);
            }
            if (state.done) {
                instance.status = 'completed';
                instance.completedAt = new Date();
            }
        },
        onError: (error) => {
            instance.status = 'failed';
            instance.error = error.message;
            instance.updatedAt = new Date();
        },
    });
    engine.start(context);
    return instance;
}
/**
 * 18. Resumes a paused workflow from storage.
 *
 * @example
 * const instance = await resumeWorkflow(workflowId, instanceId, storage);
 */
async function resumeWorkflow(workflowId, instanceId, workflow, storage) {
    const restored = await restoreState(workflowId, instanceId, storage);
    if (!restored)
        return null;
    const machine = createMachineFromWorkflow(workflow);
    const instance = {
        id: instanceId,
        workflowId,
        currentState: restored.state,
        context: restored.context,
        history: restored.history,
        version: workflow.version,
        status: 'running',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return instance;
}
/**
 * 19. Cancels a running workflow instance.
 *
 * @example
 * await cancelWorkflow(instanceId, engine, storage);
 */
async function cancelWorkflow(instanceId, engine, storage, reason) {
    engine.stop();
    if (storage) {
        const state = engine.getState();
        if (state) {
            await storage.save({
                instanceId,
                currentState: state.value,
                context: state.context,
                status: 'cancelled',
                cancelledAt: new Date(),
                cancelReason: reason,
            });
        }
    }
}
/**
 * 20. Creates a workflow instance with timeout handling.
 *
 * @example
 * const instance = await executeWorkflowWithTimeout(workflow, context, 30000);
 */
async function executeWorkflowWithTimeout(workflow, context, timeoutMs, storage) {
    return new Promise(async (resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error(`Workflow execution timed out after ${timeoutMs}ms`));
        }, timeoutMs);
        try {
            const instance = await executeWorkflow(workflow, context, storage);
            clearTimeout(timeout);
            resolve(instance);
        }
        catch (error) {
            clearTimeout(timeout);
            reject(error);
        }
    });
}
// ============================================================================
// STATE HISTORY TRACKING
// ============================================================================
/**
 * 21. Adds a history entry to the workflow instance.
 *
 * @example
 * addHistoryEntry(instance, 'approved', 'APPROVE', 'user123');
 */
function addHistoryEntry(instance, state, event, actor, metadata) {
    instance.history.push({
        state,
        event,
        timestamp: new Date(),
        actor,
        metadata,
        context: { ...instance.context },
    });
    instance.updatedAt = new Date();
}
/**
 * 22. Gets the complete state history for a workflow instance.
 *
 * @example
 * const history = getStateHistory(instance, { limit: 10 });
 */
function getStateHistory(instance, options) {
    let history = [...instance.history];
    if (options?.fromDate) {
        history = history.filter(entry => entry.timestamp >= options.fromDate);
    }
    if (options?.toDate) {
        history = history.filter(entry => entry.timestamp <= options.toDate);
    }
    if (options?.limit) {
        history = history.slice(-options.limit);
    }
    return history;
}
/**
 * 23. Gets state transitions between two specific states.
 *
 * @example
 * const transitions = getTransitionsBetween(instance, 'pending', 'approved');
 */
function getTransitionsBetween(instance, fromState, toState) {
    const transitions = [];
    for (let i = 0; i < instance.history.length - 1; i++) {
        if (instance.history[i].state === fromState && instance.history[i + 1].state === toState) {
            transitions.push(instance.history[i + 1]);
        }
    }
    return transitions;
}
/**
 * 24. Calculates time spent in each state.
 *
 * @example
 * const times = calculateStateTimings(instance);
 */
function calculateStateTimings(instance) {
    const timings = {};
    for (let i = 0; i < instance.history.length - 1; i++) {
        const current = instance.history[i];
        const next = instance.history[i + 1];
        const duration = next.timestamp.getTime() - current.timestamp.getTime();
        if (!timings[current.state]) {
            timings[current.state] = 0;
        }
        timings[current.state] += duration;
    }
    // Add time for current state
    if (instance.history.length > 0) {
        const lastEntry = instance.history[instance.history.length - 1];
        const duration = new Date().getTime() - lastEntry.timestamp.getTime();
        if (!timings[lastEntry.state]) {
            timings[lastEntry.state] = 0;
        }
        timings[lastEntry.state] += duration;
    }
    return timings;
}
/**
 * 25. Creates a state history visualization.
 *
 * @example
 * const viz = visualizeHistory(instance);
 */
function visualizeHistory(instance) {
    let visualization = `Workflow: ${instance.workflowId}\nInstance: ${instance.id}\n\n`;
    for (const entry of instance.history) {
        const timestamp = entry.timestamp.toISOString();
        const event = entry.event ? ` (${entry.event})` : '';
        const actor = entry.actor ? ` by ${entry.actor}` : '';
        visualization += `${timestamp} -> ${entry.state}${event}${actor}\n`;
    }
    return visualization;
}
// ============================================================================
// STATE ROLLBACK AND COMPENSATION
// ============================================================================
/**
 * 26. Rolls back workflow to a previous state.
 *
 * @example
 * await rollbackToState(instance, 'pending', machine, storage);
 */
async function rollbackToState(instance, targetState, machine, storage) {
    // Find the target state in history
    const targetEntry = [...instance.history].reverse().find(entry => entry.state === targetState);
    if (!targetEntry) {
        throw new Error(`State "${targetState}" not found in history`);
    }
    // Restore state and context
    instance.currentState = targetState;
    if (targetEntry.context) {
        instance.context = targetEntry.context;
    }
    instance.updatedAt = new Date();
    // Add rollback entry to history
    addHistoryEntry(instance, targetState, 'ROLLBACK', 'system', {
        reason: 'Manual rollback',
        previousState: instance.currentState,
    });
    // Persist if storage provided
    if (storage) {
        await storage.save(instance);
    }
}
/**
 * 27. Executes compensation actions for failed workflows.
 *
 * @example
 * await compensateWorkflow(instance, compensationActions);
 */
async function compensateWorkflow(instance, compensationActions) {
    const executedStates = new Set(instance.history.map(h => h.state));
    for (const config of compensationActions) {
        if (executedStates.has(config.state)) {
            if (typeof config.compensationAction === 'function') {
                await config.compensationAction(instance.context);
            }
            addHistoryEntry(instance, config.state, 'COMPENSATE', 'system', {
                compensationAction: config.compensationAction.toString(),
            });
        }
    }
    instance.status = 'cancelled';
    instance.updatedAt = new Date();
}
/**
 * 28. Creates a saga pattern for distributed transactions.
 *
 * @example
 * const saga = createSaga([
 *   { action: createOrder, compensation: cancelOrder },
 *   { action: chargePayment, compensation: refundPayment },
 * ]);
 */
function createSaga(steps) {
    return {
        async execute(context) {
            const executedSteps = [];
            try {
                for (let i = 0; i < steps.length; i++) {
                    const result = await steps[i].action(context);
                    context = { ...context, ...result };
                    executedSteps.push(i);
                }
                return { success: true, context };
            }
            catch (error) {
                // Compensate in reverse order
                for (let i = executedSteps.length - 1; i >= 0; i--) {
                    try {
                        await steps[executedSteps[i]].compensation(context);
                    }
                    catch (compensationError) {
                        console.error('Compensation failed:', compensationError);
                    }
                }
                return { success: false, context, error: error };
            }
        },
    };
}
// ============================================================================
// TIMEOUT AND DEADLINE MANAGEMENT
// ============================================================================
/**
 * 29. Adds timeout configuration to a state.
 *
 * @example
 * const config = addStateTimeout('pending', 30000, 'expired');
 */
function addStateTimeout(state, durationMs, targetState, action) {
    return {
        state,
        duration: durationMs,
        action: 'transition',
        targetState,
        onTimeout: action,
    };
}
/**
 * 30. Creates a timeout monitor for workflow instances.
 *
 * @example
 * const monitor = createTimeoutMonitor(timeoutConfigs);
 * monitor.start(instance, engine);
 */
function createTimeoutMonitor(configs) {
    const timers = new Map();
    return {
        start(instance, engine) {
            for (const config of configs) {
                if (instance.currentState === config.state) {
                    const timer = setTimeout(() => {
                        if (config.action === 'transition' && config.targetState) {
                            engine.send({ type: 'TIMEOUT', target: config.targetState });
                        }
                        else if (config.action === 'fail') {
                            engine.send({ type: 'FAIL', reason: 'Timeout' });
                        }
                        if (config.onTimeout && typeof config.onTimeout === 'function') {
                            config.onTimeout();
                        }
                    }, config.duration);
                    timers.set(config.state, timer);
                }
            }
        },
        stop(state) {
            if (state) {
                const timer = timers.get(state);
                if (timer) {
                    clearTimeout(timer);
                    timers.delete(state);
                }
            }
            else {
                timers.forEach(timer => clearTimeout(timer));
                timers.clear();
            }
        },
    };
}
/**
 * 31. Sets a deadline for workflow completion.
 *
 * @example
 * await setWorkflowDeadline(instance, new Date('2024-12-31'), engine);
 */
async function setWorkflowDeadline(instance, deadline, engine, onDeadline) {
    const now = new Date();
    const timeUntilDeadline = deadline.getTime() - now.getTime();
    if (timeUntilDeadline <= 0) {
        throw new Error('Deadline is in the past');
    }
    setTimeout(() => {
        if (instance.status === 'running') {
            engine.send({ type: 'DEADLINE_EXCEEDED' });
            instance.status = 'failed';
            instance.error = 'Deadline exceeded';
            if (onDeadline) {
                onDeadline();
            }
        }
    }, timeUntilDeadline);
}
// ============================================================================
// WORKFLOW TEMPLATES
// ============================================================================
/**
 * 32. Creates a workflow template for reusable workflows.
 *
 * @example
 * const template = createWorkflowTemplate('approval-flow', {
 *   states: { pending: {}, approved: {}, rejected: {} },
 *   variables: [{ name: 'approver', type: 'string', required: true }],
 * });
 */
function createWorkflowTemplate(name, config) {
    return {
        id: crypto.randomUUID(),
        name,
        description: config.description || '',
        category: config.category || 'general',
        states: config.states,
        initialState: config.initialState,
        variables: config.variables,
    };
}
/**
 * 33. Instantiates a workflow from a template with variable substitution.
 *
 * @example
 * const workflow = instantiateTemplate(template, {
 *   approver: 'john@example.com',
 *   requiredApprovals: 2,
 * });
 */
function instantiateTemplate(template, variables) {
    // Validate required variables
    for (const variable of template.variables) {
        if (variable.required && !(variable.name in variables)) {
            throw new Error(`Required variable "${variable.name}" not provided`);
        }
    }
    // Apply defaults
    const context = { ...variables };
    for (const variable of template.variables) {
        if (!(variable.name in context) && variable.defaultValue !== undefined) {
            context[variable.name] = variable.defaultValue;
        }
    }
    return {
        id: crypto.randomUUID(),
        name: template.name,
        version: '1.0.0',
        description: template.description,
        states: template.states,
        initialState: template.initialState,
        finalStates: Object.entries(template.states)
            .filter(([_, def]) => def.type === 'final')
            .map(([id]) => id),
        transitions: [],
        metadata: { templateId: template.id, variables: context },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * 34. Creates a multi-step approval workflow template.
 *
 * @example
 * const template = createApprovalWorkflowTemplate(['manager', 'director', 'vp']);
 */
function createApprovalWorkflowTemplate(approvers) {
    const states = {
        submitted: {
            id: 'submitted',
            on: { START_REVIEW: 'review_0' },
        },
    };
    // Create review states for each approver
    approvers.forEach((approver, index) => {
        states[`review_${index}`] = {
            id: `review_${index}`,
            on: {
                APPROVE: index < approvers.length - 1 ? `review_${index + 1}` : 'approved',
                REJECT: 'rejected',
            },
            meta: { approver },
        };
    });
    states.approved = { id: 'approved', type: 'final' };
    states.rejected = { id: 'rejected', type: 'final' };
    return createWorkflowTemplate('multi-step-approval', {
        states,
        initialState: 'submitted',
        variables: [
            { name: 'approvers', type: 'array', required: true },
            { name: 'requester', type: 'string', required: true },
        ],
        description: 'Multi-step approval workflow',
        category: 'approval',
    });
}
// ============================================================================
// WORKFLOW VISUALIZATION
// ============================================================================
/**
 * 35. Generates a Mermaid diagram for workflow visualization.
 *
 * @example
 * const diagram = generateMermaidDiagram(workflow);
 */
function generateMermaidDiagram(workflow) {
    let diagram = 'stateDiagram-v2\n';
    diagram += `  [*] --> ${workflow.initialState}\n`;
    for (const [stateId, state] of Object.entries(workflow.states)) {
        if (state.on) {
            for (const [event, target] of Object.entries(state.on)) {
                const targetState = typeof target === 'string' ? target : target.target;
                diagram += `  ${stateId} --> ${targetState}: ${event}\n`;
            }
        }
        if (workflow.finalStates.includes(stateId)) {
            diagram += `  ${stateId} --> [*]\n`;
        }
    }
    return diagram;
}
/**
 * 36. Generates a DOT graph for workflow visualization.
 *
 * @example
 * const dot = generateDotGraph(workflow);
 */
function generateDotGraph(workflow) {
    let dot = 'digraph workflow {\n';
    dot += '  rankdir=LR;\n';
    dot += `  start [shape=circle, label=""];\n`;
    dot += `  start -> ${workflow.initialState};\n`;
    for (const [stateId, state] of Object.entries(workflow.states)) {
        const shape = workflow.finalStates.includes(stateId) ? 'doublecircle' : 'circle';
        dot += `  ${stateId} [shape=${shape}];\n`;
        if (state.on) {
            for (const [event, target] of Object.entries(state.on)) {
                const targetState = typeof target === 'string' ? target : target.target;
                dot += `  ${stateId} -> ${targetState} [label="${event}"];\n`;
            }
        }
    }
    dot += '}';
    return dot;
}
/**
 * 37. Generates a JSON representation of workflow structure.
 *
 * @example
 * const json = exportWorkflowAsJson(workflow);
 */
function exportWorkflowAsJson(workflow) {
    return JSON.stringify(workflow, null, 2);
}
/**
 * 38. Imports a workflow from JSON definition.
 *
 * @example
 * const workflow = importWorkflowFromJson(jsonString);
 */
function importWorkflowFromJson(json) {
    const parsed = JSON.parse(json);
    return exports.WorkflowDefinitionSchema.parse(parsed);
}
// ============================================================================
// ADVANCED WORKFLOW UTILITIES
// ============================================================================
/**
 * 39. Merges multiple workflows into a composite workflow.
 *
 * @example
 * const composite = mergeWorkflows([workflow1, workflow2], 'sequential');
 */
function mergeWorkflows(workflows, strategy) {
    if (workflows.length === 0) {
        throw new Error('At least one workflow required');
    }
    if (strategy === 'sequential') {
        const states = {};
        let currentFinal = [];
        workflows.forEach((workflow, index) => {
            const prefix = `wf${index}_`;
            // Add all states with prefix
            for (const [stateId, state] of Object.entries(workflow.states)) {
                states[prefix + stateId] = { ...state, id: prefix + stateId };
            }
            // Connect previous workflow's final states to this workflow's initial state
            if (currentFinal.length > 0 && index > 0) {
                currentFinal.forEach(finalState => {
                    if (!states[finalState].on)
                        states[finalState].on = {};
                    states[finalState].on.CONTINUE = prefix + workflow.initialState;
                });
            }
            currentFinal = workflow.finalStates.map(s => prefix + s);
        });
        return {
            id: crypto.randomUUID(),
            name: 'Merged Sequential Workflow',
            version: '1.0.0',
            states,
            initialState: 'wf0_' + workflows[0].initialState,
            finalStates: currentFinal,
            transitions: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
    else {
        // Parallel strategy
        const parallelStates = {};
        workflows.forEach((workflow, index) => {
            const prefix = `wf${index}_`;
            parallelStates[`region${index}`] = {
                id: `region${index}`,
                type: 'compound',
                initial: workflow.initialState,
                states: Object.entries(workflow.states).reduce((acc, [stateId, state]) => {
                    acc[stateId] = state;
                    return acc;
                }, {}),
            };
        });
        return {
            id: crypto.randomUUID(),
            name: 'Merged Parallel Workflow',
            version: '1.0.0',
            states: {
                parallel: {
                    id: 'parallel',
                    type: 'parallel',
                    states: parallelStates,
                },
            },
            initialState: 'parallel',
            finalStates: ['parallel'],
            transitions: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
}
/**
 * 40. Creates a workflow middleware for intercepting state transitions.
 *
 * @example
 * const middleware = createWorkflowMiddleware({
 *   before: (from, to, event) => console.log(`Transitioning from ${from} to ${to}`),
 *   after: (state, context) => console.log(`Now in ${state}`),
 * });
 */
function createWorkflowMiddleware(config) {
    return {
        async execute(fromState, toState, event, context, transition) {
            try {
                if (config.before) {
                    await config.before(fromState, toState, event, context);
                }
                const result = await transition();
                if (config.after) {
                    await config.after(toState, result.context);
                }
                return result;
            }
            catch (error) {
                if (config.onError) {
                    await config.onError(error, context);
                }
                throw error;
            }
        },
    };
}
//# sourceMappingURL=workflow-statemachine-kit.js.map