/**
 * Code Generation Module
 *
 * This module provides types for code generation, templates, and builds.
 *
 * @module gui-builder/codegen
 */

export type { TemplateVariable, CodeTemplate } from './templates';
export type { ASTNode, ComponentASTNode, ImportASTNode } from './ast';
export { ASTNodeType } from './ast';
export type {
  OutputFile,
  CodeOutput,
  CodeGenerationConfig,
} from './output';
export { OutputFormat } from './output';
export type { BuildConfig, BuildResult } from './build';
export { BuildTarget } from './build';
