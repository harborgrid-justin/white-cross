/**
 * Server Actions Integration Types
 *
 * This module defines types for integrating Next.js Server Actions
 * with the GUI builder.
 *
 * @module gui-builder/workflow/actions
 */

import type { ServerActionId } from '../core';

/**
 * Server Action parameter.
 */
export interface ServerActionParam {
  readonly name: string;
  readonly type: string;
  readonly required?: boolean;
  readonly description?: string;
}

/**
 * Server Action definition.
 */
export interface ServerActionDefinition {
  readonly id: ServerActionId;
  readonly name: string;
  readonly description?: string;
  readonly parameters: readonly ServerActionParam[];
  readonly returnType?: string;
}

/**
 * Server Action invocation.
 */
export interface ServerActionInvocation {
  readonly actionId: ServerActionId;
  readonly parameters: Record<string, unknown>;
  readonly onSuccess?: string; // Expression or callback
  readonly onError?: string; // Expression or callback
}
