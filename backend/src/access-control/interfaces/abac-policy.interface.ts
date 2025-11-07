/**
 * Attribute-Based Access Control (ABAC) Interfaces
 *
 * ABAC provides fine-grained, context-aware access control based on attributes
 * of the user, resource, action, and environment.
 */

/**
 * ABAC Attribute Types
 */
export enum AttributeType {
  USER = 'user',
  RESOURCE = 'resource',
  ACTION = 'action',
  ENVIRONMENT = 'environment',
}

/**
 * ABAC Operator for condition evaluation
 */
export enum AbacOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'notEquals',
  GREATER_THAN = 'greaterThan',
  LESS_THAN = 'lessThan',
  IN = 'in',
  NOT_IN = 'notIn',
  CONTAINS = 'contains',
  MATCHES = 'matches', // Regex
}

/**
 * Possible attribute value types for ABAC conditions
 */
export type AbacAttributeValue = string | number | boolean | string[] | number[] | Date | null;

/**
 * ABAC Condition
 */
export interface AbacCondition {
  attribute: string; // e.g., 'user.role', 'resource.sensitivity', 'environment.time'
  operator: AbacOperator;
  value: AbacAttributeValue;
}

/**
 * ABAC Policy Rule
 */
export interface AbacPolicyRule {
  id: string;
  name: string;
  description?: string;
  effect: 'allow' | 'deny';
  conditions: AbacCondition[];
  priority: number; // Higher priority rules evaluated first
  isActive: boolean;
}

/**
 * User context attributes
 */
export interface AbacUserContext {
  id: string;
  role: string;
  attributes?: Record<string, string | number | boolean>;
}

/**
 * Resource context attributes
 */
export interface AbacResourceContext {
  type: string;
  id?: string;
  attributes?: Record<string, string | number | boolean>;
}

/**
 * Environment context attributes
 */
export interface AbacEnvironmentContext {
  time?: Date;
  ipAddress?: string;
  location?: string;
  attributes?: Record<string, string | number | boolean>;
}

/**
 * ABAC Evaluation Context
 */
export interface AbacContext {
  user: AbacUserContext;
  resource: AbacResourceContext;
  action: string;
  environment: AbacEnvironmentContext;
}

/**
 * ABAC Evaluation Result
 */
export interface AbacEvaluationResult {
  allowed: boolean;
  matchedRules: string[];
  reason?: string;
}
