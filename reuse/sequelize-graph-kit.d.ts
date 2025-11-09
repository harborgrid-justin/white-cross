/**
 * @fileoverview Sequelize Graph & Tree Structures Kit
 * @module reuse/sequelize-graph-kit
 * @description Comprehensive graph and tree utilities for Sequelize v6 covering hierarchical data models,
 * tree traversal algorithms, adjacency lists, nested sets, closure tables, path enumeration, materialized
 * paths, parent-child relationships, recursive CTEs, and graph query optimization.
 *
 * Key Features:
 * - Tree structure builders (adjacency list, nested sets, closure table)
 * - Graph traversal algorithms (DFS, BFS, shortest path)
 * - Recursive query builders with CTE support
 * - Parent-child relationship managers
 * - Ancestor/descendant queries
 * - Tree path finders
 * - Hierarchical data validators
 * - Tree modification utilities (move, delete, insert)
 * - Materialized path patterns
 * - Level-based queries
 * - Tree serializers (JSON, nested objects)
 * - Sibling relationship utilities
 * - Root/leaf node finders
 * - Tree statistics calculators
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x, PostgreSQL 12+
 *
 * @security
 * - HIPAA-compliant hierarchical filtering
 * - Organization-based tree isolation
 * - Permission inheritance in hierarchies
 * - Audit trails for tree modifications
 * - Secure recursive query limits
 *
 * @example Basic usage
 * ```typescript
 * import { buildTree, getAncestors, getDescendants } from './sequelize-graph-kit';
 *
 * // Build tree from flat data
 * const tree = buildTree(categories, { idKey: 'id', parentKey: 'parentId' });
 *
 * // Get all ancestors
 * const ancestors = await getAncestors(Category, categoryId);
 * ```
 *
 * @example Advanced usage
 * ```typescript
 * import {
 *   createNestedSet,
 *   findShortestPath,
 *   traverseBFS
 * } from './sequelize-graph-kit';
 *
 * // Create nested set model
 * const Category = createNestedSet(sequelize, 'Category', attributes);
 *
 * // Find shortest path between nodes
 * const path = await findShortestPath(graph, startId, endId);
 * ```
 *
 * LOC: GRK29P7H563
 * UPSTREAM: sequelize, @types/sequelize
 * DOWNSTREAM: models, repositories, services, organizational hierarchies
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { Model, ModelStatic, Sequelize, FindOptions, Transaction, ModelAttributes, ModelOptions } from 'sequelize';
/**
 * @interface TreeNode
 * @description Generic tree node structure
 */
export interface TreeNode<T = any> {
    /** Node data */
    data: T;
    /** Child nodes */
    children: TreeNode<T>[];
    /** Parent node reference */
    parent?: TreeNode<T>;
    /** Node depth */
    depth?: number;
    /** Node path */
    path?: string[];
}
/**
 * @interface TreeBuildOptions
 * @description Options for building tree structures
 */
export interface TreeBuildOptions {
    /** ID field name */
    idKey?: string;
    /** Parent ID field name */
    parentKey?: string;
    /** Children field name */
    childrenKey?: string;
    /** Root parent value */
    rootValue?: any;
    /** Sort children by field */
    sortBy?: string;
    /** Sort direction */
    sortDirection?: 'ASC' | 'DESC';
}
/**
 * @interface NestedSetNode
 * @description Nested set model node
 */
export interface NestedSetNode {
    /** Node ID */
    id: string | number;
    /** Left value */
    lft: number;
    /** Right value */
    rgt: number;
    /** Depth/level */
    depth: number;
    /** Parent ID */
    parentId?: string | number;
}
/**
 * @interface ClosureTableEntry
 * @description Closure table entry
 */
export interface ClosureTableEntry {
    /** Ancestor ID */
    ancestorId: string | number;
    /** Descendant ID */
    descendantId: string | number;
    /** Path length/depth */
    depth: number;
}
/**
 * @interface MaterializedPath
 * @description Materialized path configuration
 */
export interface MaterializedPath {
    /** Full path string */
    path: string;
    /** Path separator */
    separator?: string;
    /** Path segments */
    segments?: string[];
    /** Depth */
    depth?: number;
}
/**
 * @interface TraversalOptions
 * @description Options for tree traversal
 */
export interface TraversalOptions {
    /** Maximum depth */
    maxDepth?: number;
    /** Filter function */
    filter?: (node: any) => boolean;
    /** Visit function */
    visit?: (node: any, depth: number) => void;
    /** Include root */
    includeRoot?: boolean;
    /** Order (pre-order, post-order, level-order) */
    order?: 'pre' | 'post' | 'level';
}
/**
 * @interface PathOptions
 * @description Options for path operations
 */
export interface PathOptions {
    /** Include start node */
    includeStart?: boolean;
    /** Include end node */
    includeEnd?: boolean;
    /** Order direction */
    direction?: 'up' | 'down';
    /** Maximum path length */
    maxLength?: number;
}
/**
 * @interface TreeStatistics
 * @description Statistics about a tree structure
 */
export interface TreeStatistics {
    /** Total nodes */
    totalNodes: number;
    /** Maximum depth */
    maxDepth: number;
    /** Average depth */
    avgDepth: number;
    /** Leaf count */
    leafCount: number;
    /** Branch count */
    branchCount: number;
    /** Root count */
    rootCount: number;
}
/**
 * @function buildTree
 * @description Builds hierarchical tree from flat array using adjacency list
 *
 * @template T
 * @param {T[]} items - Flat array of items
 * @param {TreeBuildOptions} options - Build options
 * @returns {TreeNode<T>[]} Tree structure
 *
 * @example
 * ```typescript
 * const categories = await Category.findAll();
 * const tree = buildTree(categories, {
 *   idKey: 'id',
 *   parentKey: 'parentId',
 *   rootValue: null,
 *   sortBy: 'name'
 * });
 * ```
 */
export declare function buildTree<T extends Record<string, any>>(items: T[], options?: TreeBuildOptions): TreeNode<T>[];
/**
 * @function flattenTree
 * @description Flattens tree structure back to array
 *
 * @template T
 * @param {TreeNode<T>[]} tree - Tree structure
 * @param {TraversalOptions} options - Traversal options
 * @returns {T[]} Flat array
 *
 * @example
 * ```typescript
 * const flat = flattenTree(tree, { order: 'pre', maxDepth: 3 });
 * ```
 */
export declare function flattenTree<T>(tree: TreeNode<T>[], options?: TraversalOptions): T[];
/**
 * @function getAncestors
 * @description Gets all ancestors of a node using adjacency list
 *
 * @template M
 * @param {ModelStatic<M>} model - Model class
 * @param {string | number} nodeId - Node ID
 * @param {object} options - Query options
 * @returns {Promise<M[]>} Ancestors from closest to root
 *
 * @example
 * ```typescript
 * const ancestors = await getAncestors(Category, categoryId, {
 *   attributes: ['id', 'name', 'parentId'],
 *   maxDepth: 5
 * });
 * ```
 */
export declare function getAncestors<M extends Model>(model: ModelStatic<M>, nodeId: string | number, options?: {
    attributes?: string[];
    maxDepth?: number;
    parentKey?: string;
}): Promise<M[]>;
/**
 * @function getDescendants
 * @description Gets all descendants of a node using adjacency list
 *
 * @template M
 * @param {ModelStatic<M>} model - Model class
 * @param {string | number} nodeId - Node ID
 * @param {object} options - Query options
 * @returns {Promise<M[]>} All descendants
 *
 * @example
 * ```typescript
 * const descendants = await getDescendants(Category, categoryId, {
 *   maxDepth: 3,
 *   includeRoot: true
 * });
 * ```
 */
export declare function getDescendants<M extends Model>(model: ModelStatic<M>, nodeId: string | number, options?: {
    attributes?: string[];
    maxDepth?: number;
    includeRoot?: boolean;
    parentKey?: string;
    idKey?: string;
}): Promise<M[]>;
/**
 * @function getSiblings
 * @description Gets all siblings of a node
 *
 * @template M
 * @param {ModelStatic<M>} model - Model class
 * @param {string | number} nodeId - Node ID
 * @param {object} options - Query options
 * @returns {Promise<M[]>} Sibling nodes
 *
 * @example
 * ```typescript
 * const siblings = await getSiblings(Category, categoryId, {
 *   includeSelf: false
 * });
 * ```
 */
export declare function getSiblings<M extends Model>(model: ModelStatic<M>, nodeId: string | number, options?: {
    includeSelf?: boolean;
    parentKey?: string;
    idKey?: string;
}): Promise<M[]>;
/**
 * @function getChildren
 * @description Gets immediate children of a node
 *
 * @template M
 * @param {ModelStatic<M>} model - Model class
 * @param {string | number} nodeId - Node ID
 * @param {FindOptions} options - Find options
 * @returns {Promise<M[]>} Child nodes
 *
 * @example
 * ```typescript
 * const children = await getChildren(Category, categoryId, {
 *   order: [['name', 'ASC']]
 * });
 * ```
 */
export declare function getChildren<M extends Model>(model: ModelStatic<M>, nodeId: string | number, options?: FindOptions): Promise<M[]>;
/**
 * @function getParent
 * @description Gets parent of a node
 *
 * @template M
 * @param {ModelStatic<M>} model - Model class
 * @param {string | number} nodeId - Node ID
 * @param {object} options - Query options
 * @returns {Promise<M | null>} Parent node
 *
 * @example
 * ```typescript
 * const parent = await getParent(Category, categoryId);
 * ```
 */
export declare function getParent<M extends Model>(model: ModelStatic<M>, nodeId: string | number, options?: {
    parentKey?: string;
}): Promise<M | null>;
/**
 * @function createNestedSetModel
 * @description Creates a model with nested set pattern support
 *
 * @template M
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} name - Model name
 * @param {ModelAttributes<M>} attributes - Model attributes
 * @param {ModelOptions<M>} options - Model options
 * @returns {ModelStatic<M>} Nested set model
 *
 * @example
 * ```typescript
 * const Category = createNestedSetModel(sequelize, 'Category', {
 *   name: DataTypes.STRING,
 *   lft: DataTypes.INTEGER,
 *   rgt: DataTypes.INTEGER,
 *   depth: DataTypes.INTEGER
 * });
 * ```
 */
export declare function createNestedSetModel<M extends Model>(sequelize: Sequelize, name: string, attributes: ModelAttributes<M>, options?: Partial<ModelOptions<M>>): ModelStatic<M>;
/**
 * @function getNestedSetDescendants
 * @description Gets descendants using nested set model
 *
 * @template M
 * @param {ModelStatic<M>} model - Nested set model
 * @param {string | number} nodeId - Node ID
 * @param {object} options - Query options
 * @returns {Promise<M[]>} Descendants
 *
 * @example
 * ```typescript
 * const descendants = await getNestedSetDescendants(Category, categoryId, {
 *   maxDepth: 2,
 *   includeRoot: false
 * });
 * ```
 */
export declare function getNestedSetDescendants<M extends Model>(model: ModelStatic<M>, nodeId: string | number, options?: {
    maxDepth?: number;
    includeRoot?: boolean;
}): Promise<M[]>;
/**
 * @function insertNestedSetNode
 * @description Inserts a new node into nested set tree
 *
 * @template M
 * @param {ModelStatic<M>} model - Nested set model
 * @param {Partial<M>} data - Node data
 * @param {string | number | null} parentId - Parent node ID
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<M>} Created node
 *
 * @example
 * ```typescript
 * const newCategory = await insertNestedSetNode(
 *   Category,
 *   { name: 'New Category' },
 *   parentCategoryId,
 *   transaction
 * );
 * ```
 */
export declare function insertNestedSetNode<M extends Model>(model: ModelStatic<M>, data: Partial<any>, parentId: string | number | null, transaction?: Transaction): Promise<M>;
/**
 * @function deleteNestedSetNode
 * @description Deletes a node and its descendants from nested set tree
 *
 * @template M
 * @param {ModelStatic<M>} model - Nested set model
 * @param {string | number} nodeId - Node ID
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<number>} Number of deleted nodes
 *
 * @example
 * ```typescript
 * const deleted = await deleteNestedSetNode(Category, categoryId, transaction);
 * ```
 */
export declare function deleteNestedSetNode<M extends Model>(model: ModelStatic<M>, nodeId: string | number, transaction?: Transaction): Promise<number>;
/**
 * @function createClosureTable
 * @description Creates a closure table for hierarchy
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} name - Table name
 * @returns {ModelStatic<any>} Closure table model
 *
 * @example
 * ```typescript
 * const CategoryClosure = createClosureTable(sequelize, 'CategoryClosure');
 * ```
 */
export declare function createClosureTable(sequelize: Sequelize, name: string): ModelStatic<any>;
/**
 * @function getClosureDescendants
 * @description Gets descendants using closure table
 *
 * @template M
 * @param {ModelStatic<any>} closureModel - Closure table model
 * @param {ModelStatic<M>} nodeModel - Node model
 * @param {string | number} nodeId - Node ID
 * @param {object} options - Query options
 * @returns {Promise<M[]>} Descendants
 *
 * @example
 * ```typescript
 * const descendants = await getClosureDescendants(
 *   CategoryClosure,
 *   Category,
 *   categoryId,
 *   { maxDepth: 2 }
 * );
 * ```
 */
export declare function getClosureDescendants<M extends Model>(closureModel: ModelStatic<any>, nodeModel: ModelStatic<M>, nodeId: string | number, options?: {
    maxDepth?: number;
    includeRoot?: boolean;
}): Promise<M[]>;
/**
 * @function insertClosureNode
 * @description Inserts a node into closure table hierarchy
 *
 * @template M
 * @param {ModelStatic<any>} closureModel - Closure table model
 * @param {ModelStatic<M>} nodeModel - Node model
 * @param {Partial<M>} data - Node data
 * @param {string | number | null} parentId - Parent ID
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<M>} Created node
 *
 * @example
 * ```typescript
 * const newNode = await insertClosureNode(
 *   CategoryClosure,
 *   Category,
 *   { name: 'New Category' },
 *   parentId,
 *   transaction
 * );
 * ```
 */
export declare function insertClosureNode<M extends Model>(closureModel: ModelStatic<any>, nodeModel: ModelStatic<M>, data: Partial<any>, parentId: string | number | null, transaction?: Transaction): Promise<M>;
/**
 * @function buildMaterializedPath
 * @description Builds materialized path for a node
 *
 * @param {string[]} ancestorIds - Ancestor IDs from root to parent
 * @param {string | number} nodeId - Current node ID
 * @param {string} separator - Path separator
 * @returns {string} Materialized path
 *
 * @example
 * ```typescript
 * const path = buildMaterializedPath(['1', '5', '12'], '23', '.');
 * // Returns: '1.5.12.23'
 * ```
 */
export declare function buildMaterializedPath(ancestorIds: string[], nodeId: string | number, separator?: string): string;
/**
 * @function parseMaterializedPath
 * @description Parses materialized path into components
 *
 * @param {string} path - Materialized path
 * @param {string} separator - Path separator
 * @returns {MaterializedPath} Parsed path
 *
 * @example
 * ```typescript
 * const parsed = parseMaterializedPath('1.5.12.23', '.');
 * // Returns: { path: '1.5.12.23', segments: ['1', '5', '12', '23'], depth: 3 }
 * ```
 */
export declare function parseMaterializedPath(path: string, separator?: string): MaterializedPath;
/**
 * @function getPathDescendants
 * @description Gets descendants using materialized path
 *
 * @template M
 * @param {ModelStatic<M>} model - Model with path field
 * @param {string} path - Materialized path
 * @param {object} options - Query options
 * @returns {Promise<M[]>} Descendants
 *
 * @example
 * ```typescript
 * const descendants = await getPathDescendants(
 *   Category,
 *   '1.5.12',
 *   { maxDepth: 2, pathField: 'path' }
 * );
 * ```
 */
export declare function getPathDescendants<M extends Model>(model: ModelStatic<M>, path: string, options?: {
    maxDepth?: number;
    pathField?: string;
    separator?: string;
}): Promise<M[]>;
/**
 * @function updateMaterializedPaths
 * @description Updates materialized paths after tree modification
 *
 * @template M
 * @param {ModelStatic<M>} model - Model with path field
 * @param {string | number} nodeId - Modified node ID
 * @param {object} options - Update options
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<number>} Updated count
 *
 * @example
 * ```typescript
 * await updateMaterializedPaths(Category, categoryId, {
 *   pathField: 'path',
 *   parentKey: 'parentId'
 * }, transaction);
 * ```
 */
export declare function updateMaterializedPaths<M extends Model>(model: ModelStatic<M>, nodeId: string | number, options?: {
    pathField?: string;
    parentKey?: string;
    idKey?: string;
    separator?: string;
}, transaction?: Transaction): Promise<number>;
/**
 * @function traverseBFS
 * @description Breadth-first search traversal
 *
 * @template T
 * @param {TreeNode<T>[]} roots - Root nodes
 * @param {TraversalOptions} options - Traversal options
 * @returns {T[]} BFS ordered results
 *
 * @example
 * ```typescript
 * const bfsOrder = traverseBFS(tree, {
 *   maxDepth: 5,
 *   visit: (node, depth) => console.log(node, depth)
 * });
 * ```
 */
export declare function traverseBFS<T>(roots: TreeNode<T>[], options?: TraversalOptions): T[];
/**
 * @function traverseDFS
 * @description Depth-first search traversal
 *
 * @template T
 * @param {TreeNode<T>[]} roots - Root nodes
 * @param {TraversalOptions} options - Traversal options
 * @returns {T[]} DFS ordered results
 *
 * @example
 * ```typescript
 * const dfsOrder = traverseDFS(tree, {
 *   order: 'pre',
 *   maxDepth: 5
 * });
 * ```
 */
export declare function traverseDFS<T>(roots: TreeNode<T>[], options?: TraversalOptions): T[];
/**
 * @function findPath
 * @description Finds path between two nodes in tree
 *
 * @template T
 * @param {TreeNode<T>[]} roots - Root nodes
 * @param {(node: T) => boolean} startPredicate - Start node finder
 * @param {(node: T) => boolean} endPredicate - End node finder
 * @returns {T[] | null} Path or null if not found
 *
 * @example
 * ```typescript
 * const path = findPath(
 *   tree,
 *   (node) => node.id === startId,
 *   (node) => node.id === endId
 * );
 * ```
 */
export declare function findPath<T>(roots: TreeNode<T>[], startPredicate: (node: T) => boolean, endPredicate: (node: T) => boolean): T[] | null;
/**
 * @function findShortestPath
 * @description Finds shortest path between two nodes using BFS
 *
 * @template M
 * @param {ModelStatic<M>} model - Model class
 * @param {string | number} startId - Start node ID
 * @param {string | number} endId - End node ID
 * @param {object} options - Path options
 * @returns {Promise<M[] | null>} Shortest path or null
 *
 * @example
 * ```typescript
 * const path = await findShortestPath(Category, startId, endId, {
 *   maxLength: 10
 * });
 * ```
 */
export declare function findShortestPath<M extends Model>(model: ModelStatic<M>, startId: string | number, endId: string | number, options?: PathOptions): Promise<M[] | null>;
/**
 * @function calculateTreeStatistics
 * @description Calculates statistics about tree structure
 *
 * @template T
 * @param {TreeNode<T>[]} roots - Root nodes
 * @returns {TreeStatistics} Tree statistics
 *
 * @example
 * ```typescript
 * const stats = calculateTreeStatistics(tree);
 * console.log(`Total nodes: ${stats.totalNodes}, Max depth: ${stats.maxDepth}`);
 * ```
 */
export declare function calculateTreeStatistics<T>(roots: TreeNode<T>[]): TreeStatistics;
/**
 * @function validateTreeIntegrity
 * @description Validates tree structure integrity
 *
 * @template M
 * @param {ModelStatic<M>} model - Model class
 * @param {object} options - Validation options
 * @returns {Promise<{valid: boolean, errors: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateTreeIntegrity(Category, {
 *   parentKey: 'parentId',
 *   checkCycles: true
 * });
 * ```
 */
export declare function validateTreeIntegrity<M extends Model>(model: ModelStatic<M>, options?: {
    parentKey?: string;
    idKey?: string;
    checkCycles?: boolean;
}): Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * @function getRootNodes
 * @description Gets all root nodes (nodes without parents)
 *
 * @template M
 * @param {ModelStatic<M>} model - Model class
 * @param {object} options - Query options
 * @returns {Promise<M[]>} Root nodes
 *
 * @example
 * ```typescript
 * const roots = await getRootNodes(Category, { parentKey: 'parentId' });
 * ```
 */
export declare function getRootNodes<M extends Model>(model: ModelStatic<M>, options?: {
    parentKey?: string;
}): Promise<M[]>;
/**
 * @function getLeafNodes
 * @description Gets all leaf nodes (nodes without children)
 *
 * @template M
 * @param {ModelStatic<M>} model - Model class
 * @param {object} options - Query options
 * @returns {Promise<M[]>} Leaf nodes
 *
 * @example
 * ```typescript
 * const leaves = await getLeafNodes(Category, { parentKey: 'parentId' });
 * ```
 */
export declare function getLeafNodes<M extends Model>(model: ModelStatic<M>, options?: {
    parentKey?: string;
    idKey?: string;
}): Promise<M[]>;
/**
 * @function getNodeLevel
 * @description Gets the level/depth of a node in the tree
 *
 * @template M
 * @param {ModelStatic<M>} model - Model class
 * @param {string | number} nodeId - Node ID
 * @param {object} options - Query options
 * @returns {Promise<number>} Node level (0 for root)
 *
 * @example
 * ```typescript
 * const level = await getNodeLevel(Category, categoryId);
 * console.log(`Category is at level ${level}`);
 * ```
 */
export declare function getNodeLevel<M extends Model>(model: ModelStatic<M>, nodeId: string | number, options?: {
    parentKey?: string;
}): Promise<number>;
/**
 * @function moveNode
 * @description Moves a node to a new parent
 *
 * @template M
 * @param {ModelStatic<M>} model - Model class
 * @param {string | number} nodeId - Node to move
 * @param {string | number | null} newParentId - New parent ID
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<M>} Updated node
 *
 * @example
 * ```typescript
 * await moveNode(Category, categoryId, newParentId, transaction);
 * ```
 */
export declare function moveNode<M extends Model>(model: ModelStatic<M>, nodeId: string | number, newParentId: string | number | null, transaction?: Transaction): Promise<M>;
/**
 * @function serializeTree
 * @description Serializes tree to JSON format
 *
 * @template T
 * @param {TreeNode<T>[]} tree - Tree structure
 * @param {object} options - Serialization options
 * @returns {any[]} JSON representation
 *
 * @example
 * ```typescript
 * const json = serializeTree(tree, {
 *   includeDepth: true,
 *   maxDepth: 5
 * });
 * ```
 */
export declare function serializeTree<T>(tree: TreeNode<T>[], options?: {
    includeDepth?: boolean;
    maxDepth?: number;
    fields?: string[];
}): any[];
/**
 * @function treeToList
 * @description Converts tree to flat list with parent references
 *
 * @template T
 * @param {TreeNode<T>[]} tree - Tree structure
 * @param {string} parentIdKey - Parent ID field name
 * @returns {any[]} Flat list
 *
 * @example
 * ```typescript
 * const list = treeToList(tree, 'parentId');
 * // Returns: [{id: 1, parentId: null}, {id: 2, parentId: 1}, ...]
 * ```
 */
export declare function treeToList<T extends Record<string, any>>(tree: TreeNode<T>[], parentIdKey?: string): any[];
/**
 * @function exportTreeToCSV
 * @description Exports tree to CSV format
 *
 * @template T
 * @param {TreeNode<T>[]} tree - Tree structure
 * @param {string[]} columns - Columns to include
 * @returns {string} CSV string
 *
 * @example
 * ```typescript
 * const csv = exportTreeToCSV(tree, ['id', 'name', 'parentId']);
 * ```
 */
export declare function exportTreeToCSV<T extends Record<string, any>>(tree: TreeNode<T>[], columns: string[]): string;
/**
 * @function findNodeById
 * @description Finds a node by ID in tree
 *
 * @template T
 * @param {TreeNode<T>[]} tree - Tree structure
 * @param {string | number} id - Node ID
 * @param {string} idKey - ID field name
 * @returns {TreeNode<T> | null} Found node or null
 *
 * @example
 * ```typescript
 * const node = findNodeById(tree, categoryId, 'id');
 * ```
 */
export declare function findNodeById<T extends Record<string, any>>(tree: TreeNode<T>[], id: string | number, idKey?: string): TreeNode<T> | null;
/**
 * @function searchTree
 * @description Searches tree by predicate
 *
 * @template T
 * @param {TreeNode<T>[]} tree - Tree structure
 * @param {(node: T) => boolean} predicate - Search predicate
 * @returns {TreeNode<T>[]} Matching nodes
 *
 * @example
 * ```typescript
 * const results = searchTree(tree, (node) => node.name.includes('admin'));
 * ```
 */
export declare function searchTree<T>(tree: TreeNode<T>[], predicate: (node: T) => boolean): TreeNode<T>[];
/**
 * @function findCommonAncestor
 * @description Finds lowest common ancestor of two nodes
 *
 * @template M
 * @param {ModelStatic<M>} model - Model class
 * @param {string | number} nodeId1 - First node ID
 * @param {string | number} nodeId2 - Second node ID
 * @returns {Promise<M | null>} Common ancestor
 *
 * @example
 * ```typescript
 * const ancestor = await findCommonAncestor(Category, catId1, catId2);
 * ```
 */
export declare function findCommonAncestor<M extends Model>(model: ModelStatic<M>, nodeId1: string | number, nodeId2: string | number): Promise<M | null>;
/**
 * @function buildBreadcrumbs
 * @description Builds breadcrumb trail for a node
 *
 * @template M
 * @param {ModelStatic<M>} model - Model class
 * @param {string | number} nodeId - Node ID
 * @param {object} options - Breadcrumb options
 * @returns {Promise<Array<{id: any, name: string}>>} Breadcrumb trail
 *
 * @example
 * ```typescript
 * const breadcrumbs = await buildBreadcrumbs(Category, categoryId, {
 *   nameField: 'name',
 *   includeRoot: true
 * });
 * // Returns: [{id: 1, name: 'Root'}, {id: 5, name: 'Parent'}, {id: 12, name: 'Current'}]
 * ```
 */
export declare function buildBreadcrumbs<M extends Model>(model: ModelStatic<M>, nodeId: string | number, options?: {
    nameField?: string;
    includeRoot?: boolean;
    idKey?: string;
}): Promise<Array<{
    id: any;
    name: string;
}>>;
/**
 * @function getBreadcrumbPath
 * @description Gets breadcrumb path as string
 *
 * @template M
 * @param {ModelStatic<M>} model - Model class
 * @param {string | number} nodeId - Node ID
 * @param {object} options - Path options
 * @returns {Promise<string>} Breadcrumb path
 *
 * @example
 * ```typescript
 * const path = await getBreadcrumbPath(Category, categoryId, {
 *   separator: ' > '
 * });
 * // Returns: "Root > Electronics > Computers"
 * ```
 */
export declare function getBreadcrumbPath<M extends Model>(model: ModelStatic<M>, nodeId: string | number, options?: {
    separator?: string;
    nameField?: string;
}): Promise<string>;
/**
 * @function cloneTree
 * @description Deep clones a tree structure
 *
 * @template T
 * @param {TreeNode<T>[]} tree - Tree to clone
 * @returns {TreeNode<T>[]} Cloned tree
 *
 * @example
 * ```typescript
 * const copy = cloneTree(originalTree);
 * ```
 */
export declare function cloneTree<T>(tree: TreeNode<T>[]): TreeNode<T>[];
/**
 * @function copySubtree
 * @description Copies a subtree to a new parent
 *
 * @template M
 * @param {ModelStatic<M>} model - Model class
 * @param {string | number} sourceId - Source node ID
 * @param {string | number | null} targetParentId - Target parent ID
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<M>} Root of copied subtree
 *
 * @example
 * ```typescript
 * const newSubtree = await copySubtree(
 *   Category,
 *   sourceCategoryId,
 *   targetParentId,
 *   transaction
 * );
 * ```
 */
export declare function copySubtree<M extends Model>(model: ModelStatic<M>, sourceId: string | number, targetParentId: string | number | null, transaction?: Transaction): Promise<M>;
/**
 * @function compareTrees
 * @description Compares two trees for structural equality
 *
 * @template T
 * @param {TreeNode<T>[]} tree1 - First tree
 * @param {TreeNode<T>[]} tree2 - Second tree
 * @param {(a: T, b: T) => boolean} compareFn - Comparison function
 * @returns {boolean} True if equal
 *
 * @example
 * ```typescript
 * const isEqual = compareTrees(tree1, tree2, (a, b) => a.id === b.id);
 * ```
 */
export declare function compareTrees<T>(tree1: TreeNode<T>[], tree2: TreeNode<T>[], compareFn: (a: T, b: T) => boolean): boolean;
/**
 * @function findTreeDifferences
 * @description Finds differences between two trees
 *
 * @template T
 * @param {TreeNode<T>[]} tree1 - First tree
 * @param {TreeNode<T>[]} tree2 - Second tree
 * @param {string} idKey - ID field name
 * @returns {{added: T[], removed: T[], modified: T[]}} Differences
 *
 * @example
 * ```typescript
 * const diff = findTreeDifferences(oldTree, newTree, 'id');
 * ```
 */
export declare function findTreeDifferences<T extends Record<string, any>>(tree1: TreeNode<T>[], tree2: TreeNode<T>[], idKey?: string): {
    added: T[];
    removed: T[];
    modified: T[];
};
/**
 * @function extractSubtree
 * @description Extracts a subtree starting from a node
 *
 * @template T
 * @param {TreeNode<T>[]} tree - Full tree
 * @param {string | number} nodeId - Root node ID
 * @param {string} idKey - ID field name
 * @returns {TreeNode<T> | null} Subtree or null
 *
 * @example
 * ```typescript
 * const subtree = extractSubtree(tree, categoryId, 'id');
 * ```
 */
export declare function extractSubtree<T extends Record<string, any>>(tree: TreeNode<T>[], nodeId: string | number, idKey?: string): TreeNode<T> | null;
/**
 * @function pruneTree
 * @description Prunes tree by removing nodes matching predicate
 *
 * @template T
 * @param {TreeNode<T>[]} tree - Tree structure
 * @param {(node: T) => boolean} predicate - Prune predicate
 * @returns {TreeNode<T>[]} Pruned tree
 *
 * @example
 * ```typescript
 * const pruned = pruneTree(tree, (node) => node.status === 'inactive');
 * ```
 */
export declare function pruneTree<T>(tree: TreeNode<T>[], predicate: (node: T) => boolean): TreeNode<T>[];
/**
 * @function mergeSubtrees
 * @description Merges multiple subtrees into one tree
 *
 * @template T
 * @param {TreeNode<T>[][]} subtrees - Subtrees to merge
 * @param {string} idKey - ID field name
 * @returns {TreeNode<T>[]} Merged tree
 *
 * @example
 * ```typescript
 * const merged = mergeSubtrees([tree1, tree2, tree3], 'id');
 * ```
 */
export declare function mergeSubtrees<T extends Record<string, any>>(subtrees: TreeNode<T>[][], idKey?: string): TreeNode<T>[];
/**
 * @function transformTree
 * @description Transforms tree nodes using a mapping function
 *
 * @template T, U
 * @param {TreeNode<T>[]} tree - Source tree
 * @param {(node: T, depth: number) => U} transformFn - Transform function
 * @returns {TreeNode<U>[]} Transformed tree
 *
 * @example
 * ```typescript
 * const transformed = transformTree(tree, (node, depth) => ({
 *   ...node,
 *   level: depth,
 *   displayName: node.name.toUpperCase()
 * }));
 * ```
 */
export declare function transformTree<T, U>(tree: TreeNode<T>[], transformFn: (node: T, depth: number) => U): TreeNode<U>[];
/**
 * @function mapTreeNodes
 * @description Maps tree nodes while preserving structure
 *
 * @template T, U
 * @param {TreeNode<T>[]} tree - Source tree
 * @param {(data: T) => U} mapFn - Map function
 * @returns {TreeNode<U>[]} Mapped tree
 *
 * @example
 * ```typescript
 * const mapped = mapTreeNodes(tree, (data) => ({
 *   id: data.id,
 *   label: data.name
 * }));
 * ```
 */
export declare function mapTreeNodes<T, U>(tree: TreeNode<T>[], mapFn: (data: T) => U): TreeNode<U>[];
/**
 * @function filterTreeNodes
 * @description Filters tree nodes while preserving hierarchy
 *
 * @template T
 * @param {TreeNode<T>[]} tree - Source tree
 * @param {(node: T) => boolean} filterFn - Filter function
 * @returns {TreeNode<T>[]} Filtered tree
 *
 * @example
 * ```typescript
 * const filtered = filterTreeNodes(tree, (node) => node.isActive);
 * ```
 */
export declare function filterTreeNodes<T>(tree: TreeNode<T>[], filterFn: (node: T) => boolean): TreeNode<T>[];
//# sourceMappingURL=sequelize-graph-kit.d.ts.map