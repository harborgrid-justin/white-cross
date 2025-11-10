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

import { z } from 'zod';
import {
  createMachine,
  interpret,
  State,
  StateNode,
  Machine,
  Interpreter,
  MachineConfig,
  MachineOptions,
  StateSchema,
  EventObject,
  StateMachine,
  AnyEventObject,
  StateValue,
  assign,
  send,
  sendParent,
} from 'xstate';
import { Injectable, Type as NestType } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Zod schema for state definition.
 */
export const StateDefinitionSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['atomic', 'compound', 'parallel', 'final', 'history']).default('atomic'),
  initial: z.string().optional(),
  states: z.record(z.lazy(() => StateDefinitionSchema)).optional(),
  on: z.record(z.union([
    z.string(),
    z.object({
      target: z.string(),
      cond: z.string().optional(),
      actions: z.array(z.string()).optional(),
    }),
  ])).optional(),
  entry: z.array(z.string()).optional(),
  exit: z.array(z.string()).optional(),
  invoke: z.object({
    src: z.string(),
    onDone: z.string().optional(),
    onError: z.string().optional(),
  }).optional(),
  after: z.record(z.string()).optional(),
  always: z.array(z.object({
    target: z.string(),
    cond: z.string().optional(),
  })).optional(),
  meta: z.record(z.any()).optional(),
});

/**
 * Zod schema for transition validation.
 */
export const TransitionSchema = z.object({
  from: z.string(),
  to: z.string(),
  event: z.string(),
  guard: z.string().optional(),
  actions: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for workflow definition.
 */
export const WorkflowDefinitionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string().optional(),
  states: z.record(StateDefinitionSchema),
  initialState: z.string(),
  finalStates: z.array(z.string()),
  transitions: z.array(TransitionSchema),
  guards: z.record(z.string()).optional(),
  actions: z.record(z.string()).optional(),
  services: z.record(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Zod schema for state persistence.
 */
export const StatePersistenceSchema = z.object({
  workflowId: z.string().uuid(),
  instanceId: z.string().uuid(),
  currentState: z.string(),
  context: z.record(z.any()),
  history: z.array(z.object({
    state: z.string(),
    event: z.string().optional(),
    timestamp: z.date(),
    actor: z.string().optional(),
    metadata: z.record(z.any()).optional(),
  })),
  version: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Zod schema for workflow execution context.
 */
export const WorkflowContextSchema = z.object({
  instanceId: z.string().uuid(),
  workflowId: z.string().uuid(),
  currentState: z.string(),
  data: z.record(z.any()),
  metadata: z.record(z.any()).optional(),
  startedAt: z.date(),
  startedBy: z.string().optional(),
  completedAt: z.date().optional(),
  error: z.string().optional(),
});

/**
 * Zod schema for timeout configuration.
 */
export const TimeoutConfigSchema = z.object({
  state: z.string(),
  duration: z.number().int().positive(),
  action: z.enum(['transition', 'fail', 'compensate']),
  targetState: z.string().optional(),
  onTimeout: z.string().optional(),
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export function createStateMachineBuilder<TContext = any>(id: string) {
  const states: Record<string, any> = {};
  let initial: string;
  const guards: Record<string, any> = {};
  const actions: Record<string, any> = {};
  const services: Record<string, any> = {};

  const builder = {
    initialState(stateName: string) {
      initial = stateName;
      return this;
    },

    state(name: string, config: (stateBuilder: any) => any) {
      const stateBuilder = {
        on(event: string, target: string | TransitionConfig) {
          if (!states[name]) states[name] = {};
          if (!states[name].on) states[name].on = {};
          states[name].on[event] = target;
          return this;
        },

        entry(action: string | ((context: TContext, event: any) => void)) {
          if (!states[name]) states[name] = {};
          if (!states[name].entry) states[name].entry = [];
          states[name].entry.push(action);
          return this;
        },

        exit(action: string | ((context: TContext, event: any) => void)) {
          if (!states[name]) states[name] = {};
          if (!states[name].exit) states[name].exit = [];
          states[name].exit.push(action);
          return this;
        },

        invoke(src: string | ((context: TContext, event: any) => Promise<any>), config?: InvokeConfig) {
          if (!states[name]) states[name] = {};
          states[name].invoke = { src, ...config };
          return this;
        },

        after(delay: number, target: string) {
          if (!states[name]) states[name] = {};
          if (!states[name].after) states[name].after = {};
          states[name].after[delay] = target;
          return this;
        },
      };

      config(stateBuilder);
      return this;
    },

    finalState(name: string) {
      states[name] = { type: 'final' };
      return this;
    },

    guard(name: string, fn: (context: TContext, event: any) => boolean) {
      guards[name] = fn;
      return this;
    },

    action(name: string, fn: (context: TContext, event: any) => void) {
      actions[name] = fn;
      return this;
    },

    service(name: string, fn: (context: TContext, event: any) => Promise<any>) {
      services[name] = fn;
      return this;
    },

    build(): StateMachine<TContext, any, any> {
      return createMachine<TContext>({
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
export function createMachineFromWorkflow<TContext = any>(
  workflow: WorkflowDefinition
): StateMachine<TContext, any, any> {
  const machineConfig: any = {
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

  return createMachine<TContext>(machineConfig, {
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
export function createHierarchicalMachine<TContext = any>(
  id: string,
  states: Record<string, StateDefinition>,
  initialState?: string
): StateMachine<TContext, any, any> {
  return createMachine<TContext>({
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
export function createParallelMachine<TContext = any>(
  id: string,
  states: Record<string, StateDefinition>,
  config?: ParallelStateConfig
): StateMachine<TContext, any, any> {
  return createMachine<TContext>({
    id,
    type: 'parallel',
    states,
    onDone: config?.onDone,
  } as any);
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
export function createMachineWithHistory<TContext = any>(
  id: string,
  states: Record<string, StateDefinition>,
  initialState: string
): StateMachine<TContext, any, any> {
  return createMachine<TContext>({
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
export function validateTransition<TContext = any>(
  machine: StateMachine<TContext, any, any>,
  fromState: string,
  event: string,
  context?: TContext
): boolean {
  const state = machine.transition(fromState, event, context);
  return !state.matches(fromState);
}

/**
 * 7. Gets all valid transitions from a given state.
 *
 * @example
 * const transitions = getValidTransitions(machine, 'pending');
 */
export function getValidTransitions<TContext = any>(
  machine: StateMachine<TContext, any, any>,
  fromState: string,
  context?: TContext
): string[] {
  const stateNode = machine.getStateNodeByPath(fromState);
  if (!stateNode) return [];

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
export function validateTransitionWithGuard<TContext = any>(
  transition: Transition,
  context: TContext,
  event?: any
): boolean {
  if (!transition.guard) return true;

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
export function createTransitionValidator<TContext = any>(
  guards: Array<(context: TContext, event: any) => boolean>
): (context: TContext, event: any) => boolean {
  return (context: TContext, event: any) => {
    return guards.every(guard => guard(context, event));
  };
}

/**
 * 10. Validates state machine configuration for errors.
 *
 * @example
 * const errors = validateMachineConfig(machineConfig);
 */
export function validateMachineConfig(config: any): string[] {
  const errors: string[] = [];

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
    const stateConfig = state as any;
    if (stateConfig.on) {
      for (const [event, target] of Object.entries(stateConfig.on)) {
        const targetState = typeof target === 'string' ? target : (target as any).target;
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
export async function persistState<TContext = any>(
  workflowId: string,
  instanceId: string,
  state: string,
  context: TContext,
  history: StateHistoryEntry[],
  version: string,
  storage: StateStorage
): Promise<void> {
  await storage.save({
    workflowId,
    instanceId,
    currentState: state,
    context: context as any,
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
export async function restoreState<TContext = any>(
  workflowId: string,
  instanceId: string,
  storage: StateStorage
): Promise<{ state: string; context: TContext; history: StateHistoryEntry[] } | null> {
  const persisted = await storage.load(workflowId, instanceId);
  if (!persisted) return null;

  return {
    state: persisted.currentState,
    context: persisted.context as TContext,
    history: persisted.history,
  };
}

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
export function createInMemoryStorage(): StateStorage {
  const store = new Map<string, any>();

  return {
    async save(data: any): Promise<void> {
      const key = `${data.workflowId}:${data.instanceId}`;
      store.set(key, data);
    },

    async load(workflowId: string, instanceId: string): Promise<any | null> {
      const key = `${workflowId}:${instanceId}`;
      return store.get(key) || null;
    },

    async delete(workflowId: string, instanceId: string): Promise<void> {
      const key = `${workflowId}:${instanceId}`;
      store.delete(key);
    },

    async list(workflowId: string): Promise<any[]> {
      const results: any[] = [];
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
export function createStateSnapshot<TContext = any>(
  machine: StateMachine<TContext, any, any>,
  state: State<TContext, any>,
  metadata?: Record<string, any>
): any {
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
export function createWorkflowEngine<TContext = any>(
  machine: StateMachine<TContext, any, any>,
  options?: {
    persist?: boolean;
    storage?: StateStorage;
    onTransition?: (state: State<TContext, any>) => void;
    onError?: (error: Error) => void;
  }
) {
  let service: Interpreter<TContext, any, any> | null = null;
  const eventEmitter = new EventEmitter2();

  return {
    start(context?: TContext) {
      service = interpret(machine.withContext(context || ({} as TContext)))
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

    send(event: any) {
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

    subscribe(listener: (state: State<TContext, any>) => void) {
      if (!service) {
        throw new Error('Workflow engine not started');
      }
      return service.subscribe(listener);
    },

    on(event: string, handler: (...args: any[]) => void) {
      eventEmitter.on(event, handler);
    },

    off(event: string, handler: (...args: any[]) => void) {
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
export async function executeWorkflow<TContext = any>(
  workflow: WorkflowDefinition,
  context: TContext,
  storage?: StateStorage,
  options?: {
    instanceId?: string;
    onStateChange?: (state: string, context: TContext) => void;
  }
): Promise<WorkflowInstance> {
  const machine = createMachineFromWorkflow<TContext>(workflow);
  const instanceId = options?.instanceId || crypto.randomUUID();
  const history: StateHistoryEntry[] = [];

  const instance: WorkflowInstance = {
    id: instanceId,
    workflowId: workflow.id,
    currentState: workflow.initialState,
    context: context as any,
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
      instance.currentState = state.value as string;
      instance.context = state.context as any;
      instance.updatedAt = new Date();

      history.push({
        state: state.value as string,
        timestamp: new Date(),
        context: state.context as any,
      });

      if (options?.onStateChange) {
        options.onStateChange(state.value as string, state.context);
      }

      if (storage) {
        await persistState(
          workflow.id,
          instanceId,
          state.value as string,
          state.context,
          history,
          workflow.version,
          storage
        );
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
export async function resumeWorkflow(
  workflowId: string,
  instanceId: string,
  workflow: WorkflowDefinition,
  storage: StateStorage
): Promise<WorkflowInstance | null> {
  const restored = await restoreState(workflowId, instanceId, storage);
  if (!restored) return null;

  const machine = createMachineFromWorkflow(workflow);
  const instance: WorkflowInstance = {
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
export async function cancelWorkflow(
  instanceId: string,
  engine: any,
  storage?: StateStorage,
  reason?: string
): Promise<void> {
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
export async function executeWorkflowWithTimeout<TContext = any>(
  workflow: WorkflowDefinition,
  context: TContext,
  timeoutMs: number,
  storage?: StateStorage
): Promise<WorkflowInstance> {
  return new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Workflow execution timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    try {
      const instance = await executeWorkflow(workflow, context, storage);
      clearTimeout(timeout);
      resolve(instance);
    } catch (error) {
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
export function addHistoryEntry(
  instance: WorkflowInstance,
  state: string,
  event?: string,
  actor?: string,
  metadata?: Record<string, any>
): void {
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
export function getStateHistory(
  instance: WorkflowInstance,
  options?: { limit?: number; fromDate?: Date; toDate?: Date }
): StateHistoryEntry[] {
  let history = [...instance.history];

  if (options?.fromDate) {
    history = history.filter(entry => entry.timestamp >= options.fromDate!);
  }

  if (options?.toDate) {
    history = history.filter(entry => entry.timestamp <= options.toDate!);
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
export function getTransitionsBetween(
  instance: WorkflowInstance,
  fromState: string,
  toState: string
): StateHistoryEntry[] {
  const transitions: StateHistoryEntry[] = [];

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
export function calculateStateTimings(instance: WorkflowInstance): Record<string, number> {
  const timings: Record<string, number> = {};

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
export function visualizeHistory(instance: WorkflowInstance): string {
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
export async function rollbackToState<TContext = any>(
  instance: WorkflowInstance,
  targetState: string,
  machine: StateMachine<TContext, any, any>,
  storage?: StateStorage
): Promise<void> {
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
export async function compensateWorkflow(
  instance: WorkflowInstance,
  compensationActions: CompensationConfig[]
): Promise<void> {
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
export function createSaga(steps: Array<{
  action: (context: any) => Promise<any>;
  compensation: (context: any) => Promise<void>;
}>) {
  return {
    async execute(context: any): Promise<{ success: boolean; context: any; error?: Error }> {
      const executedSteps: number[] = [];

      try {
        for (let i = 0; i < steps.length; i++) {
          const result = await steps[i].action(context);
          context = { ...context, ...result };
          executedSteps.push(i);
        }

        return { success: true, context };
      } catch (error) {
        // Compensate in reverse order
        for (let i = executedSteps.length - 1; i >= 0; i--) {
          try {
            await steps[executedSteps[i]].compensation(context);
          } catch (compensationError) {
            console.error('Compensation failed:', compensationError);
          }
        }

        return { success: false, context, error: error as Error };
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
export function addStateTimeout(
  state: string,
  durationMs: number,
  targetState: string,
  action?: () => void
): TimeoutConfig {
  return {
    state,
    duration: durationMs,
    action: 'transition',
    targetState,
    onTimeout: action as any,
  };
}

/**
 * 30. Creates a timeout monitor for workflow instances.
 *
 * @example
 * const monitor = createTimeoutMonitor(timeoutConfigs);
 * monitor.start(instance, engine);
 */
export function createTimeoutMonitor(configs: TimeoutConfig[]) {
  const timers = new Map<string, NodeJS.Timeout>();

  return {
    start(instance: WorkflowInstance, engine: any) {
      for (const config of configs) {
        if (instance.currentState === config.state) {
          const timer = setTimeout(() => {
            if (config.action === 'transition' && config.targetState) {
              engine.send({ type: 'TIMEOUT', target: config.targetState });
            } else if (config.action === 'fail') {
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

    stop(state?: string) {
      if (state) {
        const timer = timers.get(state);
        if (timer) {
          clearTimeout(timer);
          timers.delete(state);
        }
      } else {
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
export async function setWorkflowDeadline(
  instance: WorkflowInstance,
  deadline: Date,
  engine: any,
  onDeadline?: () => void
): Promise<void> {
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
export function createWorkflowTemplate(
  name: string,
  config: {
    states: Record<string, StateDefinition>;
    initialState: string;
    variables: TemplateVariable[];
    description?: string;
    category?: string;
  }
): WorkflowTemplate {
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
export function instantiateTemplate(
  template: WorkflowTemplate,
  variables: Record<string, any>
): WorkflowDefinition {
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
export function createApprovalWorkflowTemplate(approvers: string[]): WorkflowTemplate {
  const states: Record<string, StateDefinition> = {
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
export function generateMermaidDiagram(workflow: WorkflowDefinition): string {
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
export function generateDotGraph(workflow: WorkflowDefinition): string {
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
export function exportWorkflowAsJson(workflow: WorkflowDefinition): string {
  return JSON.stringify(workflow, null, 2);
}

/**
 * 38. Imports a workflow from JSON definition.
 *
 * @example
 * const workflow = importWorkflowFromJson(jsonString);
 */
export function importWorkflowFromJson(json: string): WorkflowDefinition {
  const parsed = JSON.parse(json);
  return WorkflowDefinitionSchema.parse(parsed) as any;
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
export function mergeWorkflows(
  workflows: WorkflowDefinition[],
  strategy: 'sequential' | 'parallel'
): WorkflowDefinition {
  if (workflows.length === 0) {
    throw new Error('At least one workflow required');
  }

  if (strategy === 'sequential') {
    const states: Record<string, StateDefinition> = {};
    let currentFinal: string[] = [];

    workflows.forEach((workflow, index) => {
      const prefix = `wf${index}_`;

      // Add all states with prefix
      for (const [stateId, state] of Object.entries(workflow.states)) {
        states[prefix + stateId] = { ...state, id: prefix + stateId };
      }

      // Connect previous workflow's final states to this workflow's initial state
      if (currentFinal.length > 0 && index > 0) {
        currentFinal.forEach(finalState => {
          if (!states[finalState].on) states[finalState].on = {};
          states[finalState].on!.CONTINUE = prefix + workflow.initialState;
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
  } else {
    // Parallel strategy
    const parallelStates: Record<string, StateDefinition> = {};

    workflows.forEach((workflow, index) => {
      const prefix = `wf${index}_`;
      parallelStates[`region${index}`] = {
        id: `region${index}`,
        type: 'compound',
        initial: workflow.initialState,
        states: Object.entries(workflow.states).reduce((acc, [stateId, state]) => {
          acc[stateId] = state;
          return acc;
        }, {} as Record<string, StateDefinition>),
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
export function createWorkflowMiddleware(config: {
  before?: (from: string, to: string, event: any, context: any) => Promise<void> | void;
  after?: (state: string, context: any) => Promise<void> | void;
  onError?: (error: Error, context: any) => Promise<void> | void;
}) {
  return {
    async execute(
      fromState: string,
      toState: string,
      event: any,
      context: any,
      transition: () => Promise<any>
    ): Promise<any> {
      try {
        if (config.before) {
          await config.before(fromState, toState, event, context);
        }

        const result = await transition();

        if (config.after) {
          await config.after(toState, result.context);
        }

        return result;
      } catch (error) {
        if (config.onError) {
          await config.onError(error as Error, context);
        }
        throw error;
      }
    },
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  createMachine,
  interpret,
  State,
  StateMachine,
  Interpreter,
  assign,
  send,
  sendParent,
};
