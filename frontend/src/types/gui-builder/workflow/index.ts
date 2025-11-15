/**
 * Workflow Module
 *
 * This module provides types for multi-page workflows, routing,
 * and Server Actions integration.
 *
 * @module gui-builder/workflow
 */

// Workflow definitions
export type {
  WorkflowStep,
  WorkflowTransition,
  WorkflowDefinition,
  WorkflowState,
} from './definitions';

// Routing types
export type {
  RouteParam,
  Route,
  NavigationTarget,
  NavigationOptions,
} from './routing';

export { RouteParamType } from './routing';

// Server Actions
export type {
  ServerActionParam,
  ServerActionDefinition,
  ServerActionInvocation,
} from './actions';

// Transitions
export type { TransitionConfig } from './transitions';

export { TransitionType } from './transitions';
