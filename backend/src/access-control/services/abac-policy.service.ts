import { Injectable, Logger } from '@nestjs/common';
import {
  AbacPolicyRule,
  AbacContext,
  AbacEvaluationResult,
  AbacOperator,
  AbacCondition,
} from '../interfaces/abac-policy.interface';

/**
 * ABAC Policy Service
 *
 * Implements Attribute-Based Access Control (ABAC) for fine-grained,
 * context-aware permissions. Evaluates policies based on user, resource,
 * action, and environmental attributes.
 *
 * Features:
 * - Dynamic policy evaluation
 * - Priority-based rule processing
 * - Context-aware access control
 * - Support for complex conditions
 * - Extensible attribute model
 */
@Injectable()
export class AbacPolicyService {
  private readonly logger = new Logger(AbacPolicyService.name);

  // In-memory policy storage (in production, use database)
  private policies: Map<string, AbacPolicyRule> = new Map();

  constructor() {
    this.logger.log('ABAC Policy Service initialized');
    this.initializeDefaultPolicies();
  }

  /**
   * Create a new ABAC policy
   */
  createPolicy(policy: Omit<AbacPolicyRule, 'id'>): AbacPolicyRule {
    const id = `policy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newPolicy: AbacPolicyRule = {
      id,
      ...policy,
    };

    this.policies.set(id, newPolicy);
    this.logger.log(`Created ABAC policy: ${newPolicy.name} (${id})`);
    return newPolicy;
  }

  /**
   * Get all policies
   */
  getAllPolicies(): AbacPolicyRule[] {
    return Array.from(this.policies.values());
  }

  /**
   * Get policy by ID
   */
  getPolicy(id: string): AbacPolicyRule | undefined {
    return this.policies.get(id);
  }

  /**
   * Update policy
   */
  updatePolicy(
    id: string,
    updates: Partial<AbacPolicyRule>,
  ): AbacPolicyRule | null {
    const policy = this.policies.get(id);
    if (!policy) {
      return null;
    }

    const updated = { ...policy, ...updates, id }; // Preserve ID
    this.policies.set(id, updated);
    this.logger.log(`Updated ABAC policy: ${id}`);
    return updated;
  }

  /**
   * Delete policy
   */
  deletePolicy(id: string): boolean {
    const deleted = this.policies.delete(id);
    if (deleted) {
      this.logger.log(`Deleted ABAC policy: ${id}`);
    }
    return deleted;
  }

  /**
   * Evaluate access request against ABAC policies
   */
  evaluateAccess(context: AbacContext): AbacEvaluationResult {
    const activePolicies = Array.from(this.policies.values())
      .filter((p) => p.isActive)
      .sort((a, b) => b.priority - a.priority); // Higher priority first

    const matchedRules: string[] = [];
    let finalDecision = false;

    for (const policy of activePolicies) {
      if (this.evaluatePolicy(policy, context)) {
        matchedRules.push(policy.id);

        if (policy.effect === 'allow') {
          finalDecision = true;
        } else if (policy.effect === 'deny') {
          // Deny takes precedence
          return {
            allowed: false,
            matchedRules,
            reason: `Access denied by policy: ${policy.name}`,
          };
        }
      }
    }

    return {
      allowed: finalDecision,
      matchedRules,
      reason: finalDecision
        ? 'Access granted by ABAC policies'
        : 'No matching allow policies',
    };
  }

  /**
   * Evaluate a single policy against context
   */
  private evaluatePolicy(
    policy: AbacPolicyRule,
    context: AbacContext,
  ): boolean {
    // All conditions must match (AND logic)
    return policy.conditions.every((condition) =>
      this.evaluateCondition(condition, context),
    );
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(
    condition: AbacCondition,
    context: AbacContext,
  ): boolean {
    const actualValue = this.extractAttribute(condition.attribute, context);

    switch (condition.operator) {
      case AbacOperator.EQUALS:
        return actualValue === condition.value;

      case AbacOperator.NOT_EQUALS:
        return actualValue !== condition.value;

      case AbacOperator.GREATER_THAN:
        return actualValue > condition.value;

      case AbacOperator.LESS_THAN:
        return actualValue < condition.value;

      case AbacOperator.IN:
        return (
          Array.isArray(condition.value) &&
          condition.value.includes(actualValue)
        );

      case AbacOperator.NOT_IN:
        return (
          Array.isArray(condition.value) &&
          !condition.value.includes(actualValue)
        );

      case AbacOperator.CONTAINS:
        if (typeof actualValue === 'string') {
          return actualValue.includes(condition.value);
        }
        if (Array.isArray(actualValue)) {
          return actualValue.includes(condition.value);
        }
        return false;

      case AbacOperator.MATCHES:
        if (typeof actualValue === 'string') {
          const regex = new RegExp(condition.value);
          return regex.test(actualValue);
        }
        return false;

      default:
        this.logger.warn(`Unknown operator: ${condition.operator}`);
        return false;
    }
  }

  /**
   * Extract attribute value from context using dot notation
   * e.g., 'user.role' => context.user.role
   */
  private extractAttribute(path: string, context: AbacContext): unknown {
    const parts = path.split('.');
    let value: unknown = context;

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Initialize default ABAC policies
   */
  private initializeDefaultPolicies(): void {
    // Example: Business hours policy
    this.createPolicy({
      name: 'Business Hours Access',
      description: 'Allow access only during business hours (9 AM - 5 PM)',
      effect: 'allow',
      conditions: [
        {
          attribute: 'environment.time',
          operator: AbacOperator.GREATER_THAN,
          value: 9,
        },
        {
          attribute: 'environment.time',
          operator: AbacOperator.LESS_THAN,
          value: 17,
        },
      ],
      priority: 50,
      isActive: false, // Disabled by default
    });

    this.logger.log('Default ABAC policies initialized');
  }
}
