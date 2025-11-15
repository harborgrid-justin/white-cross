/**
 * Code Output Types
 *
 * This module defines types for code generation output configuration.
 *
 * @module gui-builder/codegen/output
 */

/**
 * Output format.
 */
export enum OutputFormat {
  TypeScript = 'typescript',
  JavaScript = 'javascript',
  TSX = 'tsx',
  JSX = 'jsx',
}

/**
 * Output file.
 */
export interface OutputFile {
  readonly path: string;
  readonly content: string;
  readonly format: OutputFormat;
}

/**
 * Code generation output.
 */
export interface CodeOutput {
  readonly files: readonly OutputFile[];
  readonly metadata?: {
    readonly generatedAt: string;
    readonly version: string;
  };
}

/**
 * Code generation configuration.
 */
export interface CodeGenerationConfig {
  readonly format: OutputFormat;
  readonly prettier?: boolean;
  readonly includComments?: boolean;
  readonly includeImports?: boolean;
  readonly componentNamePrefix?: string;
}
