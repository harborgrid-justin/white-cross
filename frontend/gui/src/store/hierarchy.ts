/**
 * Component Hierarchy Query Utilities
 *
 * Provides utilities for querying and traversing the component tree.
 * Supports depth-first/breadth-first traversal, path resolution, and tree operations.
 */

import type { ComponentId, ComponentInstance, CanvasState } from '../types';

// ============================================================================
// TYPES
// ============================================================================

export type TraversalOrder = 'depth-first' | 'breadth-first';

export interface TreeNode {
  component: ComponentInstance;
  depth: number;
  path: ComponentId[];
  parent: ComponentInstance | null;
  children: ComponentInstance[];
}

export interface TreeQueryOptions {
  maxDepth?: number;
  includeHidden?: boolean;
  includeLocked?: boolean;
  filter?: (component: ComponentInstance) => boolean;
}

// ============================================================================
// TREE TRAVERSAL
// ============================================================================

export function traverseTree(
  canvas: CanvasState,
  callback: (node: TreeNode) => void | boolean,
  options?: TreeQueryOptions & { order?: TraversalOrder }
): void {
  const order = options?.order || 'depth-first';

  if (order === 'depth-first') {
    traverseDepthFirst(canvas, callback, options);
  } else {
    traverseBreadthFirst(canvas, callback, options);
  }
}

export function traverseDepthFirst(
  canvas: CanvasState,
  callback: (node: TreeNode) => void | boolean,
  options?: TreeQueryOptions
): void {
  const visited = new Set<ComponentId>();

  function traverse(
    componentId: ComponentId,
    depth: number,
    path: ComponentId[],
    parentComponent: ComponentInstance | null
  ): boolean {
    if (visited.has(componentId)) return true;
    visited.add(componentId);

    const component = canvas.components.byId[componentId];
    if (!component) return true;

    if (options?.maxDepth !== undefined && depth > options.maxDepth) {
      return true;
    }

    if (!options?.includeHidden && component.hidden) return true;
    if (!options?.includeLocked && component.locked) return true;
    if (options?.filter && !options.filter(component)) return true;

    const children = component.childIds
      .map((id) => canvas.components.byId[id])
      .filter(Boolean);

    const node: TreeNode = {
      component,
      depth,
      path: [...path, componentId],
      parent: parentComponent,
      children,
    };

    const shouldContinue = callback(node);
    if (shouldContinue === false) return false;

    for (const childId of component.childIds) {
      const continueTraversal = traverse(childId, depth + 1, node.path, component);
      if (!continueTraversal) return false;
    }

    return true;
  }

  for (const rootId of canvas.components.rootIds) {
    const shouldContinue = traverse(rootId, 0, [], null);
    if (!shouldContinue) break;
  }
}

export function traverseBreadthFirst(
  canvas: CanvasState,
  callback: (node: TreeNode) => void | boolean,
  options?: TreeQueryOptions
): void {
  interface QueueItem {
    id: ComponentId;
    depth: number;
    path: ComponentId[];
    parent: ComponentInstance | null;
  }

  const queue: QueueItem[] = canvas.components.rootIds.map((id) => ({
    id,
    depth: 0,
    path: [],
    parent: null,
  }));

  const visited = new Set<ComponentId>();

  while (queue.length > 0) {
    const item = queue.shift()!;

    if (visited.has(item.id)) continue;
    visited.add(item.id);

    const component = canvas.components.byId[item.id];
    if (!component) continue;

    if (options?.maxDepth !== undefined && item.depth > options.maxDepth) {
      continue;
    }

    if (!options?.includeHidden && component.hidden) continue;
    if (!options?.includeLocked && component.locked) continue;
    if (options?.filter && !options.filter(component)) continue;

    const children = component.childIds
      .map((id) => canvas.components.byId[id])
      .filter(Boolean);

    const node: TreeNode = {
      component,
      depth: item.depth,
      path: [...item.path, item.id],
      parent: item.parent,
      children,
    };

    const shouldContinue = callback(node);
    if (shouldContinue === false) break;

    for (const childId of component.childIds) {
      queue.push({
        id: childId,
        depth: item.depth + 1,
        path: node.path,
        parent: component,
      });
    }
  }
}

// ============================================================================
// TREE QUERIES
// ============================================================================

export function findComponent(
  canvas: CanvasState,
  predicate: (component: ComponentInstance) => boolean
): ComponentInstance | null {
  let found: ComponentInstance | null = null;

  traverseDepthFirst(canvas, (node) => {
    if (predicate(node.component)) {
      found = node.component;
      return false;
    }
    return true;
  });

  return found;
}

export function findComponents(
  canvas: CanvasState,
  predicate: (component: ComponentInstance) => boolean,
  options?: TreeQueryOptions
): ComponentInstance[] {
  const results: ComponentInstance[] = [];

  traverseDepthFirst(
    canvas,
    (node) => {
      if (predicate(node.component)) {
        results.push(node.component);
      }
      return true;
    },
    options
  );

  return results;
}

export function findComponentById(
  canvas: CanvasState,
  id: ComponentId
): ComponentInstance | null {
  return canvas.components.byId[id] || null;
}

export function findComponentsByType(
  canvas: CanvasState,
  type: string,
  options?: TreeQueryOptions
): ComponentInstance[] {
  return findComponents(canvas, (comp) => comp.type === type, options);
}

export function findComponentsByName(
  canvas: CanvasState,
  name: string,
  options?: TreeQueryOptions
): ComponentInstance[] {
  return findComponents(canvas, (comp) => comp.name === name, options);
}

// ============================================================================
// ANCESTRY & DESCENDANTS
// ============================================================================

export function getAncestors(
  canvas: CanvasState,
  componentId: ComponentId
): ComponentInstance[] {
  const ancestors: ComponentInstance[] = [];
  let currentId: ComponentId | null = componentId;

  while (currentId) {
    const component = canvas.components.byId[currentId];
    if (!component?.parentId) break;

    const parent = canvas.components.byId[component.parentId];
    if (!parent) break;

    ancestors.push(parent);
    currentId = component.parentId;
  }

  return ancestors;
}

export function getDescendants(
  canvas: CanvasState,
  componentId: ComponentId,
  options?: TreeQueryOptions
): ComponentInstance[] {
  const descendants: ComponentInstance[] = [];

  function traverse(id: ComponentId) {
    const component = canvas.components.byId[id];
    if (!component) return;

    if (options?.maxDepth !== undefined) {
      const depth = getComponentDepth(canvas, id);
      const parentDepth = getComponentDepth(canvas, componentId);
      if (depth - parentDepth > options.maxDepth) return;
    }

    if (!options?.includeHidden && component.hidden) return;
    if (!options?.includeLocked && component.locked) return;
    if (options?.filter && !options.filter(component)) return;

    component.childIds.forEach((childId) => {
      const child = canvas.components.byId[childId];
      if (child) {
        descendants.push(child);
        traverse(childId);
      }
    });
  }

  traverse(componentId);
  return descendants;
}

export function getSiblings(
  canvas: CanvasState,
  componentId: ComponentId,
  includeSelf: boolean = false
): ComponentInstance[] {
  const component = canvas.components.byId[componentId];
  if (!component) return [];

  let siblingIds: ComponentId[];

  if (component.parentId === null) {
    siblingIds = canvas.components.rootIds;
  } else {
    const parent = canvas.components.byId[component.parentId];
    if (!parent) return [];
    siblingIds = parent.childIds;
  }

  return siblingIds
    .filter((id) => includeSelf || id !== componentId)
    .map((id) => canvas.components.byId[id])
    .filter(Boolean);
}

export function getChildren(
  canvas: CanvasState,
  componentId: ComponentId
): ComponentInstance[] {
  const component = canvas.components.byId[componentId];
  if (!component) return [];

  return component.childIds
    .map((id) => canvas.components.byId[id])
    .filter(Boolean);
}

export function getParent(
  canvas: CanvasState,
  componentId: ComponentId
): ComponentInstance | null {
  const component = canvas.components.byId[componentId];
  if (!component?.parentId) return null;

  return canvas.components.byId[component.parentId] || null;
}

// ============================================================================
// PATH OPERATIONS
// ============================================================================

export function getComponentPath(
  canvas: CanvasState,
  componentId: ComponentId
): ComponentId[] {
  const path: ComponentId[] = [];
  let currentId: ComponentId | null = componentId;

  while (currentId) {
    path.unshift(currentId);
    const component = canvas.components.byId[currentId];
    if (!component?.parentId) break;
    currentId = component.parentId;
  }

  return path;
}

export function getComponentPathString(
  canvas: CanvasState,
  componentId: ComponentId,
  separator: string = ' > '
): string {
  const path = getComponentPath(canvas, componentId);
  return path
    .map((id) => canvas.components.byId[id]?.name || id)
    .join(separator);
}

export function resolveComponentByPath(
  canvas: CanvasState,
  path: ComponentId[]
): ComponentInstance | null {
  if (path.length === 0) return null;

  let component: ComponentInstance | null = null;

  for (const id of path) {
    component = canvas.components.byId[id];
    if (!component) return null;
  }

  return component;
}

// ============================================================================
// TREE METRICS
// ============================================================================

export function getComponentDepth(
  canvas: CanvasState,
  componentId: ComponentId
): number {
  let depth = 0;
  let currentId: ComponentId | null = componentId;

  while (currentId) {
    const component = canvas.components.byId[currentId];
    if (!component?.parentId) break;
    depth++;
    currentId = component.parentId;
  }

  return depth;
}

export function getTreeDepth(canvas: CanvasState): number {
  let maxDepth = 0;

  traverseDepthFirst(canvas, (node) => {
    maxDepth = Math.max(maxDepth, node.depth);
    return true;
  });

  return maxDepth;
}

export function getSubtreeSize(
  canvas: CanvasState,
  componentId: ComponentId
): number {
  return getDescendants(canvas, componentId).length + 1;
}

export function isAncestor(
  canvas: CanvasState,
  ancestorId: ComponentId,
  descendantId: ComponentId
): boolean {
  const ancestors = getAncestors(canvas, descendantId);
  return ancestors.some((a) => a.id === ancestorId);
}

export function isDescendant(
  canvas: CanvasState,
  descendantId: ComponentId,
  ancestorId: ComponentId
): boolean {
  return isAncestor(canvas, ancestorId, descendantId);
}

export function isSibling(
  canvas: CanvasState,
  componentId1: ComponentId,
  componentId2: ComponentId
): boolean {
  const comp1 = canvas.components.byId[componentId1];
  const comp2 = canvas.components.byId[componentId2];

  if (!comp1 || !comp2) return false;

  return comp1.parentId === comp2.parentId;
}

// ============================================================================
// TREE TRANSFORMATIONS
// ============================================================================

export function mapTree<T>(
  canvas: CanvasState,
  mapper: (node: TreeNode) => T,
  options?: TreeQueryOptions
): T[] {
  const results: T[] = [];

  traverseDepthFirst(
    canvas,
    (node) => {
      results.push(mapper(node));
      return true;
    },
    options
  );

  return results;
}

export function filterTree(
  canvas: CanvasState,
  predicate: (node: TreeNode) => boolean,
  options?: TreeQueryOptions
): ComponentInstance[] {
  const results: ComponentInstance[] = [];

  traverseDepthFirst(
    canvas,
    (node) => {
      if (predicate(node)) {
        results.push(node.component);
      }
      return true;
    },
    options
  );

  return results;
}

export function flattenTree(
  canvas: CanvasState,
  options?: TreeQueryOptions
): ComponentInstance[] {
  const components: ComponentInstance[] = [];

  traverseDepthFirst(
    canvas,
    (node) => {
      components.push(node.component);
      return true;
    },
    options
  );

  return components;
}

export function buildTreeRepresentation(canvas: CanvasState): TreeNode[] {
  const nodes: TreeNode[] = [];

  traverseDepthFirst(canvas, (node) => {
    nodes.push(node);
    return true;
  });

  return nodes;
}
