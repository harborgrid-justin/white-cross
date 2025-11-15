/**
 * Component Tree Types
 *
 * This module defines types for the hierarchical component tree structure
 * that represents the layout of a page or section.
 *
 * @module gui-builder/layout/tree
 */

import type {
  ComponentId,
  ComponentInstanceId,
  PropertyId,
  Metadata,
} from '../core';
import type { PropertyValue } from '../properties';
import type { ResponsiveLayoutConfig } from './responsive';

/**
 * Component instance in the tree.
 *
 * This represents a specific instance of a component definition
 * placed in the layout tree.
 */
export interface ComponentInstance {
  /**
   * Unique identifier for this instance.
   */
  readonly id: ComponentInstanceId;

  /**
   * Component definition ID this instance is based on.
   */
  readonly componentId: ComponentId;

  /**
   * Display name for this instance (can override component name).
   */
  readonly displayName?: string;

  /**
   * Property values for this instance.
   */
  readonly properties: Record<PropertyId, PropertyValue>;

  /**
   * Child component instances.
   */
  readonly children?: readonly ComponentInstance[];

  /**
   * Slot assignments (for components with named slots).
   */
  readonly slots?: Record<string, readonly ComponentInstance[]>;

  /**
   * Parent instance ID (null for root).
   */
  readonly parentId: ComponentInstanceId | null;

  /**
   * Depth in the tree (0 for root).
   */
  readonly depth: number;

  /**
   * Order within parent's children.
   */
  readonly order: number;

  /**
   * Responsive layout configuration.
   */
  readonly responsive?: ResponsiveLayoutConfig;

  /**
   * Whether this instance is locked (cannot be moved/deleted).
   */
  readonly locked?: boolean;

  /**
   * Whether this instance is hidden in the editor.
   */
  readonly hidden?: boolean;

  /**
   * CSS classes to apply to this instance.
   */
  readonly classes?: readonly string[];

  /**
   * Inline styles to apply to this instance.
   */
  readonly styles?: Record<string, string | number>;

  /**
   * Custom data attributes.
   */
  readonly dataAttributes?: Record<string, string>;

  /**
   * Metadata for this instance.
   */
  readonly metadata: Metadata;

  /**
   * Custom metadata for extensions.
   */
  readonly customData?: Record<string, unknown>;
}

/**
 * Component tree node with computed properties.
 */
export interface ComponentTreeNode extends ComponentInstance {
  /**
   * Full path from root to this node (array of instance IDs).
   */
  readonly path: readonly ComponentInstanceId[];

  /**
   * Whether this node has children.
   */
  readonly hasChildren: boolean;

  /**
   * Total number of descendants.
   */
  readonly descendantCount: number;

  /**
   * Whether this node is a leaf (no children).
   */
  readonly isLeaf: boolean;

  /**
   * Whether this node is the root.
   */
  readonly isRoot: boolean;

  /**
   * Siblings of this node.
   */
  readonly siblings?: readonly ComponentTreeNode[];

  /**
   * Previous sibling.
   */
  readonly previousSibling?: ComponentTreeNode;

  /**
   * Next sibling.
   */
  readonly nextSibling?: ComponentTreeNode;
}

/**
 * Complete component tree.
 */
export interface ComponentTree {
  /**
   * Root component instance.
   */
  readonly root: ComponentInstance;

  /**
   * Flat map of all instances by ID for quick lookup.
   */
  readonly instanceMap: ReadonlyMap<ComponentInstanceId, ComponentInstance>;

  /**
   * Total number of instances in the tree.
   */
  readonly totalInstances: number;

  /**
   * Maximum depth of the tree.
   */
  readonly maxDepth: number;

  /**
   * Version of the tree (incremented on changes).
   */
  readonly version: number;

  /**
   * Last modification timestamp.
   */
  readonly lastModified: string;
}

/**
 * Tree traversal order.
 */
export enum TreeTraversalOrder {
  /**
   * Depth-first, pre-order (parent before children).
   */
  DepthFirstPreOrder = 'depth-first-pre',

  /**
   * Depth-first, post-order (children before parent).
   */
  DepthFirstPostOrder = 'depth-first-post',

  /**
   * Breadth-first (level by level).
   */
  BreadthFirst = 'breadth-first',
}

/**
 * Options for tree traversal.
 */
export interface TreeTraversalOptions {
  /**
   * Traversal order.
   */
  readonly order?: TreeTraversalOrder;

  /**
   * Maximum depth to traverse (undefined = no limit).
   */
  readonly maxDepth?: number;

  /**
   * Filter function (return false to skip node and its descendants).
   */
  readonly filter?: (node: ComponentInstance) => boolean;

  /**
   * Whether to include locked nodes.
   */
  readonly includeLocked?: boolean;

  /**
   * Whether to include hidden nodes.
   */
  readonly includeHidden?: boolean;
}

/**
 * Result of a tree search operation.
 */
export interface TreeSearchResult {
  /**
   * Found node.
   */
  readonly node: ComponentInstance;

  /**
   * Path from root to the found node.
   */
  readonly path: readonly ComponentInstanceId[];

  /**
   * Depth of the found node.
   */
  readonly depth: number;

  /**
   * Parent of the found node.
   */
  readonly parent?: ComponentInstance;
}

/**
 * Tree modification operation.
 */
export enum TreeOperation {
  Insert = 'insert',
  Update = 'update',
  Delete = 'delete',
  Move = 'move',
  Reorder = 'reorder',
}

/**
 * Tree change event.
 */
export interface TreeChangeEvent {
  /**
   * Type of operation.
   */
  readonly operation: TreeOperation;

  /**
   * Affected instance ID.
   */
  readonly instanceId: ComponentInstanceId;

  /**
   * Parent instance ID (for insert/move).
   */
  readonly parentId?: ComponentInstanceId;

  /**
   * New index (for insert/move/reorder).
   */
  readonly index?: number;

  /**
   * Old index (for move/reorder).
   */
  readonly oldIndex?: number;

  /**
   * Previous state (for update/delete).
   */
  readonly previousState?: ComponentInstance;

  /**
   * New state (for insert/update).
   */
  readonly newState?: ComponentInstance;

  /**
   * Timestamp of the change.
   */
  readonly timestamp: string;
}

/**
 * Options for inserting a node into the tree.
 */
export interface InsertNodeOptions {
  /**
   * Parent instance ID (null for root replacement).
   */
  readonly parentId: ComponentInstanceId | null;

  /**
   * Index in parent's children (undefined = append).
   */
  readonly index?: number;

  /**
   * Slot name (for slotted components).
   */
  readonly slot?: string;

  /**
   * Whether to validate the insertion.
   */
  readonly validate?: boolean;
}

/**
 * Options for moving a node within the tree.
 */
export interface MoveNodeOptions {
  /**
   * New parent instance ID.
   */
  readonly newParentId: ComponentInstanceId;

  /**
   * New index in parent's children.
   */
  readonly newIndex?: number;

  /**
   * New slot name (for slotted components).
   */
  readonly newSlot?: string;

  /**
   * Whether to validate the move.
   */
  readonly validate?: boolean;
}

/**
 * Validation result for tree operations.
 */
export interface TreeOperationValidation {
  /**
   * Whether the operation is valid.
   */
  readonly valid: boolean;

  /**
   * Error messages if invalid.
   */
  readonly errors?: readonly string[];

  /**
   * Warning messages.
   */
  readonly warnings?: readonly string[];
}

/**
 * Helper to find a node by ID in the tree.
 */
export function findNodeById(
  tree: ComponentTree,
  instanceId: ComponentInstanceId,
): ComponentInstance | undefined {
  return tree.instanceMap.get(instanceId);
}

/**
 * Helper to check if a node is an ancestor of another.
 */
export function isAncestor(
  tree: ComponentTree,
  ancestorId: ComponentInstanceId,
  descendantId: ComponentInstanceId,
): boolean {
  let current = tree.instanceMap.get(descendantId);
  while (current && current.parentId) {
    if (current.parentId === ancestorId) {
      return true;
    }
    current = tree.instanceMap.get(current.parentId);
  }
  return false;
}

/**
 * Helper to get all ancestors of a node.
 */
export function getAncestors(
  tree: ComponentTree,
  instanceId: ComponentInstanceId,
): readonly ComponentInstance[] {
  const ancestors: ComponentInstance[] = [];
  let current = tree.instanceMap.get(instanceId);

  while (current && current.parentId) {
    const parent = tree.instanceMap.get(current.parentId);
    if (parent) {
      ancestors.unshift(parent);
      current = parent;
    } else {
      break;
    }
  }

  return ancestors;
}

/**
 * Helper to get all descendants of a node.
 */
export function getDescendants(
  node: ComponentInstance,
): readonly ComponentInstance[] {
  const descendants: ComponentInstance[] = [];

  function traverse(n: ComponentInstance): void {
    if (n.children) {
      for (const child of n.children) {
        descendants.push(child);
        traverse(child);
      }
    }
    if (n.slots) {
      for (const slotNodes of Object.values(n.slots)) {
        for (const slotNode of slotNodes) {
          descendants.push(slotNode);
          traverse(slotNode);
        }
      }
    }
  }

  traverse(node);
  return descendants;
}
