/**
 * Template Definition Types
 *
 * This module defines types for reusable page and component templates.
 *
 * @module gui-builder/templates/definitions
 */

import type { TemplateId, Metadata } from '../core';
import type { PageConfig } from '../layout';

/**
 * Template type.
 */
export enum TemplateType {
  Page = 'page',
  Section = 'section',
  Component = 'component',
  Layout = 'layout',
}

/**
 * Template definition.
 */
export interface TemplateDefinition {
  readonly id: TemplateId;
  readonly name: string;
  readonly description?: string;
  readonly type: TemplateType;
  readonly thumbnail?: string;
  readonly category?: string;
  readonly tags?: readonly string[];
  readonly config: PageConfig | unknown; // Configuration for the template
  readonly variables?: Record<string, unknown>; // Template variables
  readonly metadata: Metadata;
}
