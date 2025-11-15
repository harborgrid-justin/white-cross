/**
 * Workflow Definition Types
 *
 * This module defines types for multi-page workflows that guide users
 * through a sequence of pages or steps.
 *
 * @module gui-builder/workflow/definitions
 */

import type { WorkflowId, PageId, Metadata } from '../core';

/**
 * Workflow step.
 */
export interface WorkflowStep {
  /**
   * Unique identifier for the step.
   */
  readonly id: string;

  /**
   * Display name of the step.
   */
  readonly name: string;

  /**
   * Page to display for this step.
   */
  readonly pageId: PageId;

  /**
   * Description of the step.
   */
  readonly description?: string;

  /**
   * Order in the workflow.
   */
  readonly order: number;

  /**
   * Whether this step can be skipped.
   */
  readonly optional?: boolean;

  /**
   * Validation rules for progressing past this step.
   */
  readonly validation?: {
    readonly required?: boolean;
    readonly customRules?: readonly string[];
  };

  /**
   * Data required to access this step.
   */
  readonly requiredData?: readonly string[];

  /**
   * Conditional logic for showing this step.
   */
  readonly condition?: string; // Expression

  /**
   * Estimated time to complete (in minutes).
   */
  readonly estimatedTime?: number;
}

/**
 * Workflow transition between steps.
 */
export interface WorkflowTransition {
  /**
   * Source step ID.
   */
  readonly from: string;

  /**
   * Target step ID.
   */
  readonly to: string;

  /**
   * Display label for the transition (e.g., "Next", "Previous").
   */
  readonly label: string;

  /**
   * Condition for allowing this transition.
   */
  readonly condition?: string; // Expression

  /**
   * Server Action to execute during transition.
   */
  readonly action?: string;

  /**
   * Whether this is the primary/default transition.
   */
  readonly primary?: boolean;
}

/**
 * Workflow definition.
 */
export interface WorkflowDefinition {
  /**
   * Unique identifier for the workflow.
   */
  readonly id: WorkflowId;

  /**
   * Display name of the workflow.
   */
  readonly name: string;

  /**
   * Description of the workflow.
   */
  readonly description?: string;

  /**
   * Workflow steps.
   */
  readonly steps: readonly WorkflowStep[];

  /**
   * Transitions between steps.
   */
  readonly transitions: readonly WorkflowTransition[];

  /**
   * Initial step ID.
   */
  readonly initialStepId: string;

  /**
   * Whether the workflow allows navigation back to previous steps.
   */
  readonly allowBackNavigation?: boolean;

  /**
   * Whether to save progress automatically.
   */
  readonly autoSave?: boolean;

  /**
   * Metadata.
   */
  readonly metadata: Metadata;
}

/**
 * Workflow runtime state.
 */
export interface WorkflowState {
  /**
   * Workflow ID.
   */
  readonly workflowId: WorkflowId;

  /**
   * Current step ID.
   */
  readonly currentStepId: string;

  /**
   * Completed steps.
   */
  readonly completedSteps: readonly string[];

  /**
   * Workflow data collected across steps.
   */
  readonly data: Record<string, unknown>;

  /**
   * Start timestamp.
   */
  readonly startedAt: string;

  /**
   * Completion timestamp.
   */
  readonly completedAt?: string;

  /**
   * Whether the workflow is complete.
   */
  readonly isComplete: boolean;
}
