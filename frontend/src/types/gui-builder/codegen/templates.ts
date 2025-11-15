/**
 * Code Template Types
 *
 * This module defines types for code generation templates.
 *
 * @module gui-builder/codegen/templates
 */

/**
 * Template variable.
 */
export interface TemplateVariable {
  readonly name: string;
  readonly type: string;
  readonly defaultValue?: unknown;
  readonly description?: string;
}

/**
 * Code template.
 */
export interface CodeTemplate {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly language: 'typescript' | 'javascript' | 'tsx' | 'jsx';
  readonly template: string;
  readonly variables: readonly TemplateVariable[];
  readonly imports?: readonly string[];
}
