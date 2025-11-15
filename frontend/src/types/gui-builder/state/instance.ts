/**
 * Component Instance State Types
 *
 * This module defines types for managing runtime state of component instances.
 *
 * @module gui-builder/state/instance
 */

import type { ComponentInstanceId } from '../core';

/**
 * Instance runtime state.
 */
export interface InstanceRuntimeState {
  /**
   * Instance ID.
   */
  readonly id: ComponentInstanceId;

  /**
   * Whether the instance is visible.
   */
  readonly visible: boolean;

  /**
   * Whether the instance is enabled/interactive.
   */
  readonly enabled: boolean;

  /**
   * Loading state.
   */
  readonly loading: boolean;

  /**
   * Error state.
   */
  readonly error?: {
    readonly message: string;
    readonly code?: string;
  };

  /**
   * Validation state.
   */
  readonly validation?: {
    readonly valid: boolean;
    readonly errors?: readonly string[];
  };

  /**
   * Dynamic data bound to this instance.
   */
  readonly data?: Record<string, unknown>;

  /**
   * Computed values.
   */
  readonly computed?: Record<string, unknown>;
}

/**
 * Collection of instance runtime states.
 */
export type InstanceStateMap = ReadonlyMap<ComponentInstanceId, InstanceRuntimeState>;
