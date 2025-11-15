/**
 * Page Transition Types
 *
 * This module defines types for animated transitions between pages.
 *
 * @module gui-builder/workflow/transitions
 */

/**
 * Transition type.
 */
export enum TransitionType {
  None = 'none',
  Fade = 'fade',
  Slide = 'slide',
  SlideUp = 'slide-up',
  SlideDown = 'slide-down',
  SlideLeft = 'slide-left',
  SlideRight = 'slide-right',
  Scale = 'scale',
  Rotate = 'rotate',
  Custom = 'custom',
}

/**
 * Transition configuration.
 */
export interface TransitionConfig {
  readonly type: TransitionType;
  readonly duration?: number; // milliseconds
  readonly easing?: string; // CSS easing function
  readonly customClass?: string; // For custom transitions
}
