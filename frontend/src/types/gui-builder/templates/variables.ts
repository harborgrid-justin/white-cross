/**
 * Template Variables
 *
 * This module defines types for template variables that can be
 * customized when creating a page from a template.
 *
 * @module gui-builder/templates/variables
 */

/**
 * Template variable definition.
 */
export interface TemplateVariableDefinition {
  readonly name: string;
  readonly label: string;
  readonly type: 'string' | 'number' | 'boolean' | 'color' | 'image';
  readonly defaultValue?: unknown;
  readonly description?: string;
  readonly required?: boolean;
}

/**
 * Template variable values.
 */
export type TemplateVariableValues = Record<string, unknown>;
