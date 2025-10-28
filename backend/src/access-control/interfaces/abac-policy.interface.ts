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
 * ABAC Condition
 */
export interface AbacCondition {
  attribute: string; // e.g., 'user.role', 'resource.sensitivity', 'environment.time'
  operator: AbacOperator;
  value: any;
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
 * ABAC Evaluation Context
 */
export interface AbacContext {
  user: {
    id: string;
    role: string;
    attributes?: Record<string, any>;
  };
  resource: {
    type: string;
    id?: string;
    attributes?: Record<string, any>;
  };
  action: string;
  environment: {
    time?: Date;
    ipAddress?: string;
    location?: string;
    attributes?: Record<string, any>;
  };
}

/**
 * ABAC Evaluation Result
 */
export interface AbacEvaluationResult {
  allowed: boolean;
  matchedRules: string[];
  reason?: string;
}
