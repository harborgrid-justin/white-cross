/**
 * Data Binding Types
 *
 * This module defines types for data binding expressions that allow
 * component properties to dynamically reference external data sources.
 *
 * @module gui-builder/properties/bindings
 */

import type { DataSourceId, BindingId, PropertyId, ServerActionId } from '../core';
import type { PropertyValue } from './types';

/**
 * Data binding expression type.
 */
export enum BindingExpressionType {
  /**
   * Direct path to a value (e.g., 'user.name').
   */
  Path = 'path',

  /**
   * Template string with interpolation (e.g., 'Hello, ${user.name}').
   */
  Template = 'template',

  /**
   * JavaScript expression (e.g., 'user.age > 18').
   */
  Expression = 'expression',

  /**
   * Function call (e.g., 'formatDate(user.birthdate)').
   */
  Function = 'function',

  /**
   * Server Action result.
   */
  ServerAction = 'server-action',

  /**
   * Reference to another property.
   */
  PropertyReference = 'property-reference',
}

/**
 * Base binding expression.
 */
export interface BaseBindingExpression {
  readonly type: BindingExpressionType;
  readonly id: BindingId;
}

/**
 * Path binding expression.
 *
 * @example
 * ```typescript
 * {
 *   type: BindingExpressionType.Path,
 *   path: 'user.profile.name'
 * }
 * ```
 */
export interface PathBindingExpression extends BaseBindingExpression {
  readonly type: BindingExpressionType.Path;
  readonly path: string;
}

/**
 * Template binding expression.
 *
 * @example
 * ```typescript
 * {
 *   type: BindingExpressionType.Template,
 *   template: 'Hello, ${user.firstName} ${user.lastName}!'
 * }
 * ```
 */
export interface TemplateBindingExpression extends BaseBindingExpression {
  readonly type: BindingExpressionType.Template;
  readonly template: string;
  readonly variables?: readonly string[];
}

/**
 * JavaScript expression binding.
 *
 * @example
 * ```typescript
 * {
 *   type: BindingExpressionType.Expression,
 *   expression: 'user.age >= 18 ? "Adult" : "Minor"'
 * }
 * ```
 */
export interface ExpressionBindingExpression extends BaseBindingExpression {
  readonly type: BindingExpressionType.Expression;
  readonly expression: string;
  readonly dependencies?: readonly string[];
}

/**
 * Function call binding.
 *
 * @example
 * ```typescript
 * {
 *   type: BindingExpressionType.Function,
 *   functionName: 'formatDate',
 *   arguments: ['user.birthdate', 'MM/DD/YYYY']
 * }
 * ```
 */
export interface FunctionBindingExpression extends BaseBindingExpression {
  readonly type: BindingExpressionType.Function;
  readonly functionName: string;
  readonly arguments?: readonly unknown[];
}

/**
 * Server Action binding.
 *
 * @example
 * ```typescript
 * {
 *   type: BindingExpressionType.ServerAction,
 *   actionId: 'action-fetch-user',
 *   parameters: { userId: '123' }
 * }
 * ```
 */
export interface ServerActionBindingExpression extends BaseBindingExpression {
  readonly type: BindingExpressionType.ServerAction;
  readonly actionId: ServerActionId;
  readonly parameters?: Record<string, unknown>;
  readonly debounce?: number;
}

/**
 * Property reference binding.
 *
 * @example
 * ```typescript
 * {
 *   type: BindingExpressionType.PropertyReference,
 *   propertyId: 'prop-title'
 * }
 * ```
 */
export interface PropertyReferenceBindingExpression
  extends BaseBindingExpression {
  readonly type: BindingExpressionType.PropertyReference;
  readonly propertyId: PropertyId;
}

/**
 * Discriminated union of all binding expression types.
 */
export type BindingExpression =
  | PathBindingExpression
  | TemplateBindingExpression
  | ExpressionBindingExpression
  | FunctionBindingExpression
  | ServerActionBindingExpression
  | PropertyReferenceBindingExpression;

/**
 * Data source type.
 */
export enum DataSourceType {
  /**
   * Static JSON data.
   */
  Static = 'static',

  /**
   * REST API endpoint.
   */
  REST = 'rest',

  /**
   * GraphQL API.
   */
  GraphQL = 'graphql',

  /**
   * Server Action.
   */
  ServerAction = 'server-action',

  /**
   * URL parameter.
   */
  URLParameter = 'url-parameter',

  /**
   * Query string.
   */
  QueryString = 'query-string',

  /**
   * Local storage.
   */
  LocalStorage = 'local-storage',

  /**
   * Session storage.
   */
  SessionStorage = 'session-storage',

  /**
   * Cookie.
   */
  Cookie = 'cookie',

  /**
   * Browser API (e.g., geolocation, clipboard).
   */
  BrowserAPI = 'browser-api',

  /**
   * Custom data source.
   */
  Custom = 'custom',
}

/**
 * Data source configuration.
 */
export interface DataSource {
  /**
   * Unique identifier for the data source.
   */
  readonly id: DataSourceId;

  /**
   * Display name.
   */
  readonly name: string;

  /**
   * Data source type.
   */
  readonly type: DataSourceType;

  /**
   * Description of the data source.
   */
  readonly description?: string;

  /**
   * For REST/GraphQL: endpoint URL.
   */
  readonly endpoint?: string;

  /**
   * For REST: HTTP method.
   */
  readonly method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

  /**
   * For REST/GraphQL: request headers.
   */
  readonly headers?: Record<string, string>;

  /**
   * For REST/GraphQL: authentication configuration.
   */
  readonly auth?: {
    readonly type: 'none' | 'bearer' | 'basic' | 'api-key';
    readonly token?: string;
    readonly username?: string;
    readonly password?: string;
    readonly apiKey?: string;
  };

  /**
   * For GraphQL: query or mutation.
   */
  readonly query?: string;

  /**
   * For ServerAction: action ID.
   */
  readonly actionId?: ServerActionId;

  /**
   * For Static: the static data.
   */
  readonly data?: unknown;

  /**
   * For URLParameter/QueryString: parameter name.
   */
  readonly parameterName?: string;

  /**
   * For LocalStorage/SessionStorage/Cookie: key name.
   */
  readonly keyName?: string;

  /**
   * Transform function to apply to the fetched data.
   */
  readonly transform?: string; // JavaScript code

  /**
   * Cache configuration.
   */
  readonly cache?: {
    readonly enabled: boolean;
    readonly ttl?: number; // Time to live in seconds
    readonly strategy?: 'memory' | 'local-storage' | 'session-storage';
  };

  /**
   * Polling configuration for live data.
   */
  readonly polling?: {
    readonly enabled: boolean;
    readonly interval: number; // Milliseconds
  };

  /**
   * Error handling configuration.
   */
  readonly errorHandling?: {
    readonly fallbackValue?: unknown;
    readonly retryAttempts?: number;
    readonly retryDelay?: number;
  };
}

/**
 * Complete data binding configuration.
 */
export interface DataBinding {
  /**
   * Unique identifier for the binding.
   */
  readonly id: BindingId;

  /**
   * Property this binding applies to.
   */
  readonly propertyId: PropertyId;

  /**
   * Data source for the binding.
   */
  readonly dataSource: DataSourceId;

  /**
   * Binding expression.
   */
  readonly expression: BindingExpression;

  /**
   * Fallback value if binding fails.
   */
  readonly fallbackValue?: PropertyValue;

  /**
   * Whether to update on data source changes.
   */
  readonly reactive?: boolean;

  /**
   * Transform function applied to the bound value.
   */
  readonly transform?: string; // JavaScript code

  /**
   * Whether this binding is enabled.
   */
  readonly enabled?: boolean;
}

/**
 * Binding context containing all available data.
 */
export interface BindingContext {
  /**
   * Data from all data sources.
   */
  readonly dataSources: Record<DataSourceId, unknown>;

  /**
   * Current property values.
   */
  readonly properties: Record<PropertyId, PropertyValue>;

  /**
   * URL parameters.
   */
  readonly urlParams?: Record<string, string>;

  /**
   * Query string parameters.
   */
  readonly queryParams?: Record<string, string>;

  /**
   * User-defined variables.
   */
  readonly variables?: Record<string, unknown>;

  /**
   * Global state.
   */
  readonly globalState?: Record<string, unknown>;
}

/**
 * Result of evaluating a binding expression.
 */
export interface BindingEvaluationResult {
  /**
   * Whether evaluation was successful.
   */
  readonly success: boolean;

  /**
   * The evaluated value.
   */
  readonly value?: unknown;

  /**
   * Error if evaluation failed.
   */
  readonly error?: string;

  /**
   * Dependencies that were used in evaluation.
   */
  readonly dependencies?: readonly string[];
}

/**
 * Type guard to check if an expression is a path expression.
 */
export function isPathExpression(
  expr: BindingExpression,
): expr is PathBindingExpression {
  return expr.type === BindingExpressionType.Path;
}

/**
 * Type guard to check if an expression is a template expression.
 */
export function isTemplateExpression(
  expr: BindingExpression,
): expr is TemplateBindingExpression {
  return expr.type === BindingExpressionType.Template;
}

/**
 * Type guard to check if an expression is a JavaScript expression.
 */
export function isJavaScriptExpression(
  expr: BindingExpression,
): expr is ExpressionBindingExpression {
  return expr.type === BindingExpressionType.Expression;
}
