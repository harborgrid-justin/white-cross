/**
 * Server Actions Types
 *
 * This module defines types for Next.js Server Actions integration.
 *
 * @module gui-builder/integration/server-actions
 */

import type { ServerActionId } from '../core';

/**
 * Server Action binding.
 */
export interface ServerActionBinding {
  readonly actionId: ServerActionId;
  readonly eventType: string; // e.g., 'onClick', 'onSubmit'
  readonly parameters?: Record<string, unknown>;
  readonly successHandler?: string; // Expression or function name
  readonly errorHandler?: string; // Expression or function name
}

/**
 * Form action configuration.
 */
export interface FormActionConfig {
  readonly actionId: ServerActionId;
  readonly validation?: {
    readonly client?: boolean;
    readonly server?: boolean;
  };
  readonly redirectOnSuccess?: string;
  readonly resetOnSuccess?: boolean;
}
