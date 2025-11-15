/**
 * Identifier Generation and Management
 *
 * This module provides types and utilities for generating and managing
 * unique identifiers throughout the GUI builder.
 *
 * @module gui-builder/core/identifiers
 */

import type {
  ComponentId,
  ComponentInstanceId,
  PageId,
  PropertyId,
  WorkflowId,
  TemplateId,
  VersionId,
  BindingId,
  ServerActionId,
  DataSourceId,
} from './brands';

/**
 * Configuration for identifier generation.
 */
export interface IdGeneratorConfig {
  /**
   * Prefix to add to generated IDs.
   */
  readonly prefix?: string;

  /**
   * Separator between prefix and ID.
   * @default '-'
   */
  readonly separator?: string;

  /**
   * Length of the random portion.
   * @default 8
   */
  readonly length?: number;

  /**
   * Include timestamp in the ID.
   * @default false
   */
  readonly includeTimestamp?: boolean;
}

/**
 * Result of parsing an identifier.
 */
export interface ParsedId {
  /**
   * The full identifier string.
   */
  readonly full: string;

  /**
   * The prefix portion (if any).
   */
  readonly prefix?: string;

  /**
   * The unique portion of the ID.
   */
  readonly unique: string;

  /**
   * The timestamp portion (if included).
   */
  readonly timestamp?: number;
}

/**
 * Helper type to extract the brand name from a branded type.
 */
type BrandName<T extends { readonly __brand?: string }> =
  T extends { readonly __brand: infer B } ? B : never;

/**
 * Maps brand types to their default prefixes.
 */
export const DEFAULT_PREFIXES = {
  ComponentId: 'cmp',
  ComponentInstanceId: 'inst',
  PageId: 'page',
  PropertyId: 'prop',
  WorkflowId: 'wf',
  TemplateId: 'tmpl',
  VersionId: 'ver',
  BindingId: 'bind',
  ServerActionId: 'action',
  DataSourceId: 'ds',
} as const;

/**
 * Type for valid ID prefixes.
 */
export type IdPrefix = (typeof DEFAULT_PREFIXES)[keyof typeof DEFAULT_PREFIXES];

/**
 * Generates a random string of specified length using alphanumeric characters.
 *
 * @param length - The length of the random string
 * @returns A random alphanumeric string
 *
 * @example
 * ```typescript
 * const random = generateRandomString(8); // 'a7b3c9d2'
 * ```
 */
export function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generates a unique identifier with optional configuration.
 *
 * @param config - Configuration for ID generation
 * @returns A unique identifier string
 *
 * @example
 * ```typescript
 * // Simple ID
 * const id1 = generateId(); // 'a7b3c9d2'
 *
 * // With prefix
 * const id2 = generateId({ prefix: 'cmp' }); // 'cmp-a7b3c9d2'
 *
 * // With timestamp
 * const id3 = generateId({
 *   prefix: 'page',
 *   includeTimestamp: true
 * }); // 'page-1699564800-a7b3c9d2'
 * ```
 */
export function generateId(config: IdGeneratorConfig = {}): string {
  const {
    prefix,
    separator = '-',
    length = 8,
    includeTimestamp = false,
  } = config;

  const parts: string[] = [];

  if (prefix) {
    parts.push(prefix);
  }

  if (includeTimestamp) {
    parts.push(Date.now().toString(36));
  }

  parts.push(generateRandomString(length));

  return parts.join(separator);
}

/**
 * Parses an identifier into its component parts.
 *
 * @param id - The identifier to parse
 * @param separator - The separator used in the ID
 * @returns Parsed identifier information
 *
 * @example
 * ```typescript
 * const parsed = parseId('cmp-1699564800-a7b3c9d2');
 * // {
 * //   full: 'cmp-1699564800-a7b3c9d2',
 * //   prefix: 'cmp',
 * //   timestamp: 1699564800,
 * //   unique: 'a7b3c9d2'
 * // }
 * ```
 */
export function parseId(id: string, separator = '-'): ParsedId {
  const parts = id.split(separator);

  if (parts.length === 1) {
    return {
      full: id,
      unique: id,
    };
  }

  const result: ParsedId = {
    full: id,
    unique: parts[parts.length - 1] ?? '',
  };

  if (parts.length >= 2) {
    result.prefix = parts[0];
  }

  if (parts.length === 3) {
    const timestamp = parseInt(parts[1] ?? '', 36);
    if (!isNaN(timestamp)) {
      result.timestamp = timestamp;
    }
  }

  return result;
}

/**
 * Type-safe ID generator for specific branded types.
 *
 * @template T - The branded ID type
 * @param prefix - The prefix to use
 * @param config - Additional configuration
 * @returns A branded ID
 *
 * @example
 * ```typescript
 * const componentId = createTypedId<ComponentId>('cmp');
 * const pageId = createTypedId<PageId>('page', { length: 12 });
 * ```
 */
export function createTypedId<T extends string>(
  prefix: string,
  config?: Omit<IdGeneratorConfig, 'prefix'>,
): T {
  return generateId({ ...config, prefix }) as T;
}

/**
 * Creates a ComponentId.
 */
export function createComponentId(
  config?: Omit<IdGeneratorConfig, 'prefix'>,
): ComponentId {
  return createTypedId<ComponentId>(DEFAULT_PREFIXES.ComponentId, config);
}

/**
 * Creates a ComponentInstanceId.
 */
export function createComponentInstanceId(
  config?: Omit<IdGeneratorConfig, 'prefix'>,
): ComponentInstanceId {
  return createTypedId<ComponentInstanceId>(
    DEFAULT_PREFIXES.ComponentInstanceId,
    config,
  );
}

/**
 * Creates a PageId.
 */
export function createPageId(
  config?: Omit<IdGeneratorConfig, 'prefix'>,
): PageId {
  return createTypedId<PageId>(DEFAULT_PREFIXES.PageId, config);
}

/**
 * Creates a PropertyId.
 */
export function createPropertyId(
  config?: Omit<IdGeneratorConfig, 'prefix'>,
): PropertyId {
  return createTypedId<PropertyId>(DEFAULT_PREFIXES.PropertyId, config);
}

/**
 * Creates a WorkflowId.
 */
export function createWorkflowId(
  config?: Omit<IdGeneratorConfig, 'prefix'>,
): WorkflowId {
  return createTypedId<WorkflowId>(DEFAULT_PREFIXES.WorkflowId, config);
}

/**
 * Creates a TemplateId.
 */
export function createTemplateId(
  config?: Omit<IdGeneratorConfig, 'prefix'>,
): TemplateId {
  return createTypedId<TemplateId>(DEFAULT_PREFIXES.TemplateId, config);
}

/**
 * Creates a VersionId.
 */
export function createVersionId(
  config?: Omit<IdGeneratorConfig, 'prefix'>,
): VersionId {
  return createTypedId<VersionId>(DEFAULT_PREFIXES.VersionId, config);
}

/**
 * Creates a BindingId.
 */
export function createBindingId(
  config?: Omit<IdGeneratorConfig, 'prefix'>,
): BindingId {
  return createTypedId<BindingId>(DEFAULT_PREFIXES.BindingId, config);
}

/**
 * Creates a ServerActionId.
 */
export function createServerActionId(
  config?: Omit<IdGeneratorConfig, 'prefix'>,
): ServerActionId {
  return createTypedId<ServerActionId>(
    DEFAULT_PREFIXES.ServerActionId,
    config,
  );
}

/**
 * Creates a DataSourceId.
 */
export function createDataSourceId(
  config?: Omit<IdGeneratorConfig, 'prefix'>,
): DataSourceId {
  return createTypedId<DataSourceId>(DEFAULT_PREFIXES.DataSourceId, config);
}

/**
 * Validates that a string is a properly formatted ID.
 *
 * @param id - The ID to validate
 * @param expectedPrefix - Optional prefix to check for
 * @returns True if the ID is valid
 *
 * @example
 * ```typescript
 * isValidId('cmp-a7b3c9d2'); // true
 * isValidId('cmp-a7b3c9d2', 'cmp'); // true
 * isValidId('page-a7b3c9d2', 'cmp'); // false
 * isValidId(''); // false
 * ```
 */
export function isValidId(id: string, expectedPrefix?: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }

  if (expectedPrefix) {
    return id.startsWith(`${expectedPrefix}-`);
  }

  return id.length > 0;
}
