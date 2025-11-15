/**
 * AST (Abstract Syntax Tree) Types
 *
 * This module defines types for representing generated code as an AST.
 *
 * @module gui-builder/codegen/ast
 */

/**
 * AST node type.
 */
export enum ASTNodeType {
  Component = 'component',
  Element = 'element',
  Expression = 'expression',
  Literal = 'literal',
  Import = 'import',
  Export = 'export',
}

/**
 * Base AST node.
 */
export interface ASTNode {
  readonly type: ASTNodeType;
  readonly children?: readonly ASTNode[];
}

/**
 * Component AST node.
 */
export interface ComponentASTNode extends ASTNode {
  readonly type: ASTNodeType.Component;
  readonly name: string;
  readonly props: Record<string, unknown>;
  readonly children?: readonly ASTNode[];
}

/**
 * Import statement AST node.
 */
export interface ImportASTNode extends ASTNode {
  readonly type: ASTNodeType.Import;
  readonly source: string;
  readonly named?: readonly string[];
  readonly default?: string;
}
