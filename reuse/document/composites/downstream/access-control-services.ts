/**
 * LOC: ACCCTRL001
 * File: /reuse/document/composites/downstream/access-control-services.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - crypto (Node.js built-in)
 *   - ../document-security-encryption-composite
 *
 * DOWNSTREAM (imported by):
 *   - Document API controllers
 *   - Authorization guards
 *   - Permission enforcement services
 */

import { Injectable, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * Access control models
 */
export enum AccessControlModel {
  RBAC = 'RBAC',     // Role-Based Access Control
  ABAC = 'ABAC',     // Attribute-Based Access Control
  ACL = 'ACL',       // Access Control List
  PBAC = 'PBAC',     // Policy-Based Access Control
}

/**
 * Resource actions
 */
export enum ResourceAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  SHARE = 'SHARE',
  PRINT = 'PRINT',
  EXPORT = 'EXPORT',
  SIGN = 'SIGN',
  AUDIT = 'AUDIT',
}

/**
 * User role
 */
export interface UserRole {
  roleId: string;
  name: string;
  permissions: ResourceAction[];
  hierarchy: number;
  description: string;
}

/**
 * Access control policy
 */
export interface AccessControlPolicy {
  policyId: string;
  name: string;
  model: AccessControlModel;
  rules: AccessControlRule[];
  enabled: boolean;
  priority: number;
  createdAt: Date;
}

/**
 * Access control rule
 */
export interface AccessControlRule {
  ruleId: string;
  subject: string | string[];
  action: ResourceAction;
  resource: string;
  effect: 'ALLOW' | 'DENY';
  conditions?: AccessCondition[];
}

/**
 * Access condition
 */
export interface AccessCondition {
  type: 'TIME' | 'IP_ADDRESS' | 'LOCATION' | 'DEVICE' | 'CONTEXT' | 'RISK_LEVEL';
  operator: 'EQUALS' | 'NOT_EQUALS' | 'IN' | 'NOT_IN' | 'GREATER_THAN' | 'LESS_THAN' | 'MATCHES';
  value: any;
  negate?: boolean;
}

/**
 * Access decision
 */
export interface AccessDecision {
  allowed: boolean;
  reason: string;
  appliedRules: AccessControlRule[];
  evaluationTime: number;
}

/**
 * Access control service
 * Manages authorization policies, rules, and access decisions
 */
@Injectable()
export class AccessControlService {
  private readonly logger = new Logger(AccessControlService.name);
  private policies: Map<string, AccessControlPolicy> = new Map();
  private userRoles: Map<string, UserRole> = new Map();
  private roleHierarchy: Map<string, string[]> = new Map();
  private accessDecisions: { timestamp: Date; subject: string; resource: string; allowed: boolean }[] = [];

  constructor() {
    this.initializeDefaultRoles();
  }

  /**
   * Initializes default system roles
   */
  private initializeDefaultRoles(): void {
    const roles: UserRole[] = [
      {
        roleId: 'ADMIN',
        name: 'Administrator',
        permissions: Object.values(ResourceAction),
        hierarchy: 100,
        description: 'Full system access'
      },
      {
        roleId: 'DOCTOR',
        name: 'Healthcare Provider',
        permissions: [ResourceAction.CREATE, ResourceAction.READ, ResourceAction.UPDATE, ResourceAction.SIGN, ResourceAction.AUDIT],
        hierarchy: 80,
        description: 'Can manage patient documents'
      },
      {
        roleId: 'NURSE',
        name: 'Nursing Staff',
        permissions: [ResourceAction.READ, ResourceAction.UPDATE, ResourceAction.AUDIT],
        hierarchy: 60,
        description: 'Can view and update patient records'
      },
      {
        roleId: 'PATIENT',
        name: 'Patient',
        permissions: [ResourceAction.READ],
        hierarchy: 40,
        description: 'Can view own medical records'
      },
      {
        roleId: 'GUEST',
        name: 'Guest',
        permissions: [],
        hierarchy: 10,
        description: 'Limited read-only access'
      }
    ];

    roles.forEach(role => this.userRoles.set(role.roleId, role));
    this.setupRoleHierarchy();
  }

  /**
   * Sets up role hierarchy and inheritance
   */
  private setupRoleHierarchy(): void {
    // Define role inheritance
    this.roleHierarchy.set('ADMIN', ['DOCTOR', 'NURSE', 'PATIENT']);
    this.roleHierarchy.set('DOCTOR', ['NURSE', 'PATIENT']);
    this.roleHierarchy.set('NURSE', ['PATIENT']);
  }

  /**
   * Evaluates access decision for resource
   * @param subject - Subject (user/role)
   * @param resource - Resource identifier
   * @param action - Requested action
   * @param context - Access context
   * @returns Access decision
   */
  async evaluateAccess(
    subject: string,
    resource: string,
    action: ResourceAction,
    context?: { ipAddress?: string; timestamp?: Date; riskLevel?: number; location?: string }
  ): Promise<AccessDecision> {
    const startTime = Date.now();
    const appliedRules: AccessControlRule[] = [];

    try {
      // Get user role
      const userRole = this.getUserRole(subject);
      if (!userRole) {
        return {
          allowed: false,
          reason: 'User role not found',
          appliedRules,
          evaluationTime: Date.now() - startTime
        };
      }

      // Check role permissions
      if (!userRole.permissions.includes(action)) {
        return {
          allowed: false,
          reason: `Role '${userRole.name}' does not have '${action}' permission`,
          appliedRules,
          evaluationTime: Date.now() - startTime
        };
      }

      // Evaluate policies
      const policies = Array.from(this.policies.values())
        .filter(p => p.enabled)
        .sort((a, b) => b.priority - a.priority);

      for (const policy of policies) {
        for (const rule of policy.rules) {
          // Check subject match
          if (typeof rule.subject === 'string') {
            if (rule.subject !== subject && rule.subject !== userRole.roleId && rule.subject !== '*') {
              continue;
            }
          } else if (!rule.subject.includes(subject) && !rule.subject.includes(userRole.roleId) && !rule.subject.includes('*')) {
            continue;
          }

          // Check resource match
          if (resource !== rule.resource && rule.resource !== '*' && !this.matchResourcePattern(resource, rule.resource)) {
            continue;
          }

          // Check action match
          if (rule.action !== action && rule.action !== ResourceAction.READ) {
            continue;
          }

          // Evaluate conditions
          const conditionsMet = await this.evaluateConditions(rule.conditions || [], context);
          if (conditionsMet) {
            appliedRules.push(rule);

            // Deny takes precedence
            if (rule.effect === 'DENY') {
              this.recordAccessDecision(subject, resource, false);
              return {
                allowed: false,
                reason: `Denied by policy rule: ${rule.ruleId}`,
                appliedRules,
                evaluationTime: Date.now() - startTime
              };
            }
          }
        }
      }

      const allowed = appliedRules.length > 0 && appliedRules.some(r => r.effect === 'ALLOW');

      this.recordAccessDecision(subject, resource, allowed);

      return {
        allowed,
        reason: allowed ? 'Access granted' : 'No matching allow rules',
        appliedRules,
        evaluationTime: Date.now() - startTime
      };
    } catch (error) {
      this.logger.error(`Access evaluation failed: ${error.message}`);
      throw new BadRequestException('Access evaluation failed');
    }
  }

  /**
   * Creates new access control policy
   * @param name - Policy name
   * @param model - Access control model
   * @param rules - Access control rules
   * @returns Created policy
   */
  async createPolicy(
    name: string,
    model: AccessControlModel,
    rules: AccessControlRule[]
  ): Promise<AccessControlPolicy> {
    try {
      const policyId = crypto.randomUUID();
      const policy: AccessControlPolicy = {
        policyId,
        name,
        model,
        rules,
        enabled: true,
        priority: 10,
        createdAt: new Date()
      };

      this.policies.set(policyId, policy);
      this.logger.log(`Access policy created: ${policyId} - ${name}`);

      return policy;
    } catch (error) {
      this.logger.error(`Failed to create policy: ${error.message}`);
      throw new BadRequestException('Failed to create access policy');
    }
  }

  /**
   * Updates access control policy
   * @param policyId - Policy identifier
   * @param updates - Policy updates
   * @returns Updated policy
   */
  async updatePolicy(
    policyId: string,
    updates: Partial<AccessControlPolicy>
  ): Promise<AccessControlPolicy> {
    const policy = this.policies.get(policyId);
    if (!policy) {
      throw new BadRequestException('Policy not found');
    }

    Object.assign(policy, updates);
    this.logger.log(`Access policy updated: ${policyId}`);

    return policy;
  }

  /**
   * Adds rule to policy
   * @param policyId - Policy identifier
   * @param rule - Rule to add
   * @returns Updated policy
   */
  async addRuleToPolicy(policyId: string, rule: AccessControlRule): Promise<AccessControlPolicy> {
    const policy = this.policies.get(policyId);
    if (!policy) {
      throw new BadRequestException('Policy not found');
    }

    if (!rule.ruleId) {
      rule.ruleId = crypto.randomUUID();
    }

    policy.rules.push(rule);
    this.logger.log(`Rule added to policy: ${policyId} - ${rule.ruleId}`);

    return policy;
  }

  /**
   * Removes rule from policy
   * @param policyId - Policy identifier
   * @param ruleId - Rule identifier
   * @returns Updated policy
   */
  async removeRuleFromPolicy(policyId: string, ruleId: string): Promise<AccessControlPolicy> {
    const policy = this.policies.get(policyId);
    if (!policy) {
      throw new BadRequestException('Policy not found');
    }

    policy.rules = policy.rules.filter(r => r.ruleId !== ruleId);
    this.logger.log(`Rule removed from policy: ${policyId} - ${ruleId}`);

    return policy;
  }

  /**
   * Assigns role to user
   * @param userId - User identifier
   * @param roleId - Role identifier
   * @returns Assignment result
   */
  async assignRoleToUser(userId: string, roleId: string): Promise<{ assigned: boolean; userId: string; roleId: string }> {
    const role = this.userRoles.get(roleId);
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    this.logger.log(`Role assigned to user: ${userId} - ${roleId}`);

    return {
      assigned: true,
      userId,
      roleId
    };
  }

  /**
   * Checks if user has permission
   * @param userId - User identifier
   * @param action - Required action
   * @returns Permission status
   */
  async hasPermission(userId: string, action: ResourceAction): Promise<boolean> {
    const role = this.getUserRole(userId);
    return role ? role.permissions.includes(action) : false;
  }

  /**
   * Gets user role
   * @param userId - User identifier
   * @returns User role or null
   */
  getUserRole(userId: string): UserRole | null {
    // In production, fetch from database
    // For now, return PATIENT role as default
    return this.userRoles.get('PATIENT') || null;
  }

  /**
   * Gets all policies
   * @returns List of policies
   */
  async getPolicies(): Promise<AccessControlPolicy[]> {
    return Array.from(this.policies.values());
  }

  /**
   * Gets policy by ID
   * @param policyId - Policy identifier
   * @returns Policy or null
   */
  async getPolicy(policyId: string): Promise<AccessControlPolicy | null> {
    return this.policies.get(policyId) || null;
  }

  /**
   * Deletes policy
   * @param policyId - Policy identifier
   * @returns Deletion result
   */
  async deletePolicy(policyId: string): Promise<{ deleted: boolean; policyId: string }> {
    const deleted = this.policies.delete(policyId);
    if (deleted) {
      this.logger.log(`Policy deleted: ${policyId}`);
    }
    return { deleted, policyId };
  }

  /**
   * Gets access decision audit log
   * @param filters - Filter criteria
   * @returns Access decisions
   */
  async getAccessLog(filters?: {
    subject?: string;
    resource?: string;
    allowed?: boolean;
    startDate?: Date;
    endDate?: Date;
  }): Promise<any[]> {
    let decisions = [...this.accessDecisions];

    if (filters?.subject) {
      decisions = decisions.filter(d => d.subject === filters.subject);
    }
    if (filters?.resource) {
      decisions = decisions.filter(d => d.resource === filters.resource);
    }
    if (filters?.allowed !== undefined) {
      decisions = decisions.filter(d => d.allowed === filters.allowed);
    }
    if (filters?.startDate) {
      decisions = decisions.filter(d => d.timestamp >= filters.startDate);
    }
    if (filters?.endDate) {
      decisions = decisions.filter(d => d.timestamp <= filters.endDate);
    }

    return decisions;
  }

  /**
   * Evaluates access conditions
   */
  private async evaluateConditions(
    conditions: AccessCondition[],
    context: Record<string, any> = {}
  ): Promise<boolean> {
    for (const condition of conditions) {
      const result = this.evaluateCondition(condition, context);
      if (condition.negate) {
        if (result) return false;
      } else {
        if (!result) return false;
      }
    }
    return true;
  }

  /**
   * Evaluates single condition
   */
  private evaluateCondition(condition: AccessCondition, context: Record<string, any>): boolean {
    const contextValue = context[condition.type.toLowerCase()];

    switch (condition.operator) {
      case 'EQUALS':
        return contextValue === condition.value;
      case 'NOT_EQUALS':
        return contextValue !== condition.value;
      case 'IN':
        return Array.isArray(condition.value) ? condition.value.includes(contextValue) : false;
      case 'NOT_IN':
        return Array.isArray(condition.value) ? !condition.value.includes(contextValue) : true;
      case 'GREATER_THAN':
        return contextValue > condition.value;
      case 'LESS_THAN':
        return contextValue < condition.value;
      case 'MATCHES':
        return new RegExp(condition.value).test(contextValue);
      default:
        return true;
    }
  }

  /**
   * Matches resource pattern
   */
  private matchResourcePattern(resource: string, pattern: string): boolean {
    const regexPattern = pattern.replace(/\*/g, '.*');
    return new RegExp(`^${regexPattern}$`).test(resource);
  }

  /**
   * Records access decision
   */
  private recordAccessDecision(subject: string, resource: string, allowed: boolean): void {
    this.accessDecisions.push({
      timestamp: new Date(),
      subject,
      resource,
      allowed
    });

    // Keep only last 10000 decisions
    if (this.accessDecisions.length > 10000) {
      this.accessDecisions = this.accessDecisions.slice(-10000);
    }
  }
}

export default AccessControlService;
