/**
 * Component Registry Types
 *
 * This module defines types for managing the component registry,
 * which stores all available component definitions.
 *
 * @module gui-builder/components/registry
 */

import type { ComponentId, Result, ValidationResult } from '../core';
import type {
  ComponentDefinition,
  ResolvedComponentDefinition,
  MinimalComponentDefinition,
} from './definitions';
import type { ComponentCategory, ComponentTag } from './categories';

/**
 * Options for filtering components in the registry.
 */
export interface ComponentFilterOptions {
  /**
   * Filter by category.
   */
  readonly category?: ComponentCategory;

  /**
   * Filter by tags (any of the provided tags).
   */
  readonly tags?: readonly ComponentTag[];

  /**
   * Filter by search query (searches name and description).
   */
  readonly search?: string;

  /**
   * Include only favorites.
   */
  readonly favoritesOnly?: boolean;

  /**
   * Include only built-in components.
   */
  readonly builtInOnly?: boolean;

  /**
   * Include only custom components.
   */
  readonly customOnly?: boolean;

  /**
   * Exclude deprecated components.
   */
  readonly excludeDeprecated?: boolean;
}

/**
 * Options for sorting components in the registry.
 */
export interface ComponentSortOptions {
  /**
   * Field to sort by.
   */
  readonly field: 'name' | 'category' | 'createdAt' | 'updatedAt' | 'order';

  /**
   * Sort direction.
   */
  readonly direction: 'asc' | 'desc';
}

/**
 * Pagination options for listing components.
 */
export interface PaginationOptions {
  /**
   * Page number (1-based).
   */
  readonly page: number;

  /**
   * Number of items per page.
   */
  readonly pageSize: number;
}

/**
 * Paginated result.
 */
export interface PaginatedResult<T> {
  /**
   * Items in the current page.
   */
  readonly items: readonly T[];

  /**
   * Total number of items across all pages.
   */
  readonly totalItems: number;

  /**
   * Total number of pages.
   */
  readonly totalPages: number;

  /**
   * Current page number.
   */
  readonly currentPage: number;

  /**
   * Items per page.
   */
  readonly pageSize: number;

  /**
   * Whether there is a next page.
   */
  readonly hasNextPage: boolean;

  /**
   * Whether there is a previous page.
   */
  readonly hasPreviousPage: boolean;
}

/**
 * Options for registering a component.
 */
export interface RegisterComponentOptions {
  /**
   * Whether to override an existing component with the same ID.
   */
  readonly override?: boolean;

  /**
   * Whether to validate the component before registration.
   */
  readonly validate?: boolean;

  /**
   * Whether to resolve dependencies.
   */
  readonly resolveDependencies?: boolean;
}

/**
 * Result of component registration.
 */
export interface RegisterComponentResult {
  /**
   * Whether registration was successful.
   */
  readonly success: boolean;

  /**
   * The registered component ID.
   */
  readonly componentId?: ComponentId;

  /**
   * Validation result if validation was performed.
   */
  readonly validation?: ValidationResult;

  /**
   * Error message if registration failed.
   */
  readonly error?: string;

  /**
   * Whether an existing component was overridden.
   */
  readonly overridden?: boolean;
}

/**
 * Statistics about the component registry.
 */
export interface RegistryStatistics {
  /**
   * Total number of components.
   */
  readonly totalComponents: number;

  /**
   * Number of built-in components.
   */
  readonly builtInComponents: number;

  /**
   * Number of custom components.
   */
  readonly customComponents: number;

  /**
   * Number of components by category.
   */
  readonly componentsByCategory: Record<ComponentCategory, number>;

  /**
   * Number of deprecated components.
   */
  readonly deprecatedComponents: number;

  /**
   * Number of favorite components.
   */
  readonly favoriteComponents: number;

  /**
   * Last update timestamp.
   */
  readonly lastUpdated: string;
}

/**
 * Event fired when the registry changes.
 */
export interface RegistryChangeEvent {
  /**
   * Type of change.
   */
  readonly type: 'added' | 'updated' | 'removed';

  /**
   * Component ID that changed.
   */
  readonly componentId: ComponentId;

  /**
   * Timestamp of the change.
   */
  readonly timestamp: string;

  /**
   * Previous definition (for updates and removals).
   */
  readonly previousDefinition?: ComponentDefinition;

  /**
   * New definition (for additions and updates).
   */
  readonly newDefinition?: ComponentDefinition;
}

/**
 * Callback for registry change events.
 */
export type RegistryChangeListener = (event: RegistryChangeEvent) => void;

/**
 * Component registry interface.
 *
 * This defines the contract for a component registry implementation.
 */
export interface ComponentRegistry {
  /**
   * Register a new component.
   *
   * @param definition - The component definition to register
   * @param options - Registration options
   * @returns Result of the registration
   */
  register(
    definition: ComponentDefinition | MinimalComponentDefinition,
    options?: RegisterComponentOptions,
  ): Promise<RegisterComponentResult>;

  /**
   * Unregister a component.
   *
   * @param componentId - ID of the component to unregister
   * @returns Whether the component was successfully unregistered
   */
  unregister(componentId: ComponentId): Promise<boolean>;

  /**
   * Get a component definition by ID.
   *
   * @param componentId - ID of the component to retrieve
   * @param resolve - Whether to resolve dependencies
   * @returns The component definition, or undefined if not found
   */
  get(
    componentId: ComponentId,
    resolve?: boolean,
  ): Promise<ResolvedComponentDefinition | ComponentDefinition | undefined>;

  /**
   * Check if a component is registered.
   *
   * @param componentId - ID of the component to check
   * @returns Whether the component exists in the registry
   */
  has(componentId: ComponentId): Promise<boolean>;

  /**
   * List all components matching the filter.
   *
   * @param filter - Filter options
   * @param sort - Sort options
   * @param pagination - Pagination options
   * @returns Paginated list of components
   */
  list(
    filter?: ComponentFilterOptions,
    sort?: ComponentSortOptions,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<ResolvedComponentDefinition>>;

  /**
   * Search components by query.
   *
   * @param query - Search query
   * @param limit - Maximum number of results
   * @returns Matching components
   */
  search(
    query: string,
    limit?: number,
  ): Promise<readonly ResolvedComponentDefinition[]>;

  /**
   * Get all components in a category.
   *
   * @param category - The category to filter by
   * @returns Components in the category
   */
  getByCategory(
    category: ComponentCategory,
  ): Promise<readonly ResolvedComponentDefinition[]>;

  /**
   * Get all components with a specific tag.
   *
   * @param tag - The tag to filter by
   * @returns Components with the tag
   */
  getByTag(tag: ComponentTag): Promise<readonly ResolvedComponentDefinition[]>;

  /**
   * Get favorite components.
   *
   * @returns Favorite components
   */
  getFavorites(): Promise<readonly ResolvedComponentDefinition[]>;

  /**
   * Mark a component as favorite.
   *
   * @param componentId - ID of the component
   * @param favorite - Whether to mark as favorite
   */
  setFavorite(componentId: ComponentId, favorite: boolean): Promise<void>;

  /**
   * Validate a component definition.
   *
   * @param definition - The definition to validate
   * @returns Validation result
   */
  validate(
    definition: ComponentDefinition | MinimalComponentDefinition,
  ): Promise<ValidationResult>;

  /**
   * Get registry statistics.
   *
   * @returns Statistics about the registry
   */
  getStatistics(): Promise<RegistryStatistics>;

  /**
   * Clear the entire registry.
   *
   * @param keepBuiltIn - Whether to keep built-in components
   */
  clear(keepBuiltIn?: boolean): Promise<void>;

  /**
   * Export the registry to JSON.
   *
   * @param includeBuiltIn - Whether to include built-in components
   * @returns JSON representation of the registry
   */
  export(includeBuiltIn?: boolean): Promise<string>;

  /**
   * Import components from JSON.
   *
   * @param json - JSON representation of components
   * @param merge - Whether to merge with existing components
   * @returns Number of components imported
   */
  import(json: string, merge?: boolean): Promise<number>;

  /**
   * Subscribe to registry changes.
   *
   * @param listener - Callback for change events
   * @returns Unsubscribe function
   */
  subscribe(listener: RegistryChangeListener): () => void;
}

/**
 * Factory function type for creating a component registry.
 */
export type ComponentRegistryFactory = () => ComponentRegistry;
