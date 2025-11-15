/**
 * Utility functions for state normalization and denormalization
 */

import type { ComponentNode, ComponentsMap } from '../types';

/**
 * Clone a component and its children recursively
 */
export function cloneComponentTree(
  componentId: string,
  componentsMap: ComponentsMap,
  idGenerator: () => string
): { clonedComponents: ComponentNode[]; rootId: string } {
  const original = componentsMap.byId[componentId];
  if (!original) {
    throw new Error(`Component ${componentId} not found`);
  }

  const clonedComponents: ComponentNode[] = [];
  const idMapping = new Map<string, string>(); // old id -> new id

  function cloneRecursive(nodeId: string, newParentId: string | null): string {
    const node = componentsMap.byId[nodeId];
    if (!node) return nodeId;

    const newId = idGenerator();
    idMapping.set(nodeId, newId);

    const clonedNode: ComponentNode = {
      ...node,
      id: newId,
      parentId: newParentId,
      childIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Clone children
    const clonedChildIds = node.childIds.map((childId) =>
      cloneRecursive(childId, newId)
    );
    clonedNode.childIds = clonedChildIds;

    clonedComponents.push(clonedNode);
    return newId;
  }

  const rootId = cloneRecursive(componentId, original.parentId);

  return { clonedComponents, rootId };
}

/**
 * Get all descendant IDs of a component (including the component itself)
 */
export function getDescendantIds(
  componentId: string,
  componentsMap: ComponentsMap
): string[] {
  const result: string[] = [componentId];
  const component = componentsMap.byId[componentId];

  if (!component) return result;

  component.childIds.forEach((childId) => {
    result.push(...getDescendantIds(childId, componentsMap));
  });

  return result;
}

/**
 * Get all ancestor IDs of a component (excluding the component itself)
 */
export function getAncestorIds(
  componentId: string,
  componentsMap: ComponentsMap
): string[] {
  const result: string[] = [];
  let current = componentsMap.byId[componentId];

  while (current && current.parentId) {
    result.push(current.parentId);
    current = componentsMap.byId[current.parentId];
  }

  return result;
}

/**
 * Check if a component is an ancestor of another component
 */
export function isAncestor(
  potentialAncestorId: string,
  componentId: string,
  componentsMap: ComponentsMap
): boolean {
  const ancestors = getAncestorIds(componentId, componentsMap);
  return ancestors.includes(potentialAncestorId);
}

/**
 * Build a hierarchical tree structure from normalized components
 */
export interface ComponentTreeNode {
  component: ComponentNode;
  children: ComponentTreeNode[];
  depth: number;
}

export function buildComponentTree(
  componentsMap: ComponentsMap,
  rootId?: string
): ComponentTreeNode[] {
  const buildNode = (
    componentId: string,
    depth: number = 0
  ): ComponentTreeNode | null => {
    const component = componentsMap.byId[componentId];
    if (!component) return null;

    const children = component.childIds
      .map((childId) => buildNode(childId, depth + 1))
      .filter((node): node is ComponentTreeNode => node !== null);

    return {
      component,
      children,
      depth,
    };
  };

  if (rootId) {
    const node = buildNode(rootId);
    return node ? [node] : [];
  }

  return componentsMap.rootIds
    .map((id) => buildNode(id))
    .filter((node): node is ComponentTreeNode => node !== null);
}

/**
 * Flatten a component tree to a list
 */
export function flattenComponentTree(tree: ComponentTreeNode[]): ComponentNode[] {
  const result: ComponentNode[] = [];

  function traverse(node: ComponentTreeNode) {
    result.push(node.component);
    node.children.forEach(traverse);
  }

  tree.forEach(traverse);
  return result;
}

/**
 * Remove a component and optionally its children from the components map
 */
export function removeComponentFromMap(
  componentId: string,
  componentsMap: ComponentsMap,
  removeChildren: boolean = true
): {
  updatedMap: ComponentsMap;
  removedIds: string[];
} {
  const removedIds: string[] = [];
  const byId = { ...componentsMap.byId };
  let allIds = [...componentsMap.allIds];
  let rootIds = [...componentsMap.rootIds];

  const component = byId[componentId];
  if (!component) {
    return { updatedMap: componentsMap, removedIds: [] };
  }

  // Get IDs to remove
  const idsToRemove = removeChildren
    ? getDescendantIds(componentId, componentsMap)
    : [componentId];

  // Remove from byId
  idsToRemove.forEach((id) => {
    delete byId[id];
    removedIds.push(id);
  });

  // Remove from allIds
  allIds = allIds.filter((id) => !removedIds.includes(id));

  // Remove from rootIds
  rootIds = rootIds.filter((id) => !removedIds.includes(id));

  // Update parent's childIds
  if (component.parentId) {
    const parent = byId[component.parentId];
    if (parent) {
      parent.childIds = parent.childIds.filter((id) => id !== componentId);
    }
  }

  return {
    updatedMap: {
      byId,
      allIds,
      rootIds,
    },
    removedIds,
  };
}

/**
 * Insert a component into the components map
 */
export function insertComponentIntoMap(
  component: ComponentNode,
  componentsMap: ComponentsMap,
  parentId: string | null = null,
  index?: number
): ComponentsMap {
  const byId = { ...componentsMap.byId, [component.id]: component };
  const allIds = [...componentsMap.allIds, component.id];
  let rootIds = [...componentsMap.rootIds];

  if (parentId === null) {
    // Add to root
    if (index !== undefined) {
      rootIds.splice(index, 0, component.id);
    } else {
      rootIds.push(component.id);
    }
  } else {
    // Add to parent
    const parent = byId[parentId];
    if (parent) {
      if (index !== undefined) {
        parent.childIds.splice(index, 0, component.id);
      } else {
        parent.childIds.push(component.id);
      }
    }
  }

  return {
    byId,
    allIds,
    rootIds,
  };
}

/**
 * Move a component to a new parent
 */
export function moveComponentInMap(
  componentId: string,
  newParentId: string | null,
  componentsMap: ComponentsMap,
  index?: number
): ComponentsMap {
  const component = componentsMap.byId[componentId];
  if (!component) return componentsMap;

  // Prevent moving to a descendant
  if (newParentId && isAncestor(componentId, newParentId, componentsMap)) {
    console.warn('Cannot move component to its own descendant');
    return componentsMap;
  }

  const byId = { ...componentsMap.byId };
  let rootIds = [...componentsMap.rootIds];

  // Remove from old parent
  const oldParentId = component.parentId;
  if (oldParentId === null) {
    rootIds = rootIds.filter((id) => id !== componentId);
  } else {
    const oldParent = byId[oldParentId];
    if (oldParent) {
      oldParent.childIds = oldParent.childIds.filter((id) => id !== componentId);
    }
  }

  // Update component's parentId
  component.parentId = newParentId;

  // Add to new parent
  if (newParentId === null) {
    if (index !== undefined) {
      rootIds.splice(index, 0, componentId);
    } else {
      rootIds.push(componentId);
    }
  } else {
    const newParent = byId[newParentId];
    if (newParent) {
      if (index !== undefined) {
        newParent.childIds.splice(index, 0, componentId);
      } else {
        newParent.childIds.push(componentId);
      }
    }
  }

  return {
    byId,
    allIds: componentsMap.allIds,
    rootIds,
  };
}
