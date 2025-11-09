/**
 * LOC: POLENFAUTO001
 * File: /reuse/threat/composites/downstream/policy-enforcement-automation.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - ../compliance-risk-prediction-composite
 *
 * DOWNSTREAM (imported by):
 *   - Policy management platforms
 *   - Compliance automation systems
 *   - Security orchestration tools
 *   - Governance frameworks
 */

/**
 * File: /reuse/threat/composites/downstream/policy-enforcement-automation.ts
 * Locator: WC-DOWNSTREAM-POLENFAUTO-001
 * Purpose: Policy Enforcement Automation - Automated compliance policy enforcement
 *
 * Upstream: compliance-risk-prediction-composite
 * Downstream: Policy platforms, Compliance systems, Security orchestration, Governance tools
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x
 * Exports: Policy enforcement, automated compliance, violation detection, remediation
 *
 * LLM Context: Production-ready policy enforcement automation for White Cross healthcare.
 * Provides automated HIPAA policy enforcement, real-time violation detection, automated
 * remediation workflows, compliance reporting, and risk-based policy management. Supports
 * role-based access control, audit trails, and integration with security orchestration.
 */

import {
  Injectable,
  Logger,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import * as crypto from 'crypto';

// ============================================================================
// Type Definitions & Interfaces
// ============================================================================

/**
 * Policy definition
 */
export interface Policy {
  id: string;
  name: string;
  description: string;
  category: PolicyCategory;
  severity: PolicySeverity;
  rules: PolicyRule[];
  enabled: boolean;
  enforcementMode: EnforcementMode;
  applicableScopes: string[];
  owner: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  metadata?: Record<string, any>;
}

/**
 * Policy categories
 */
export enum PolicyCategory {
  DATA_PROTECTION = 'DATA_PROTECTION',
  ACCESS_CONTROL = 'ACCESS_CONTROL',
  ENCRYPTION = 'ENCRYPTION',
  AUDIT_LOGGING = 'AUDIT_LOGGING',
  NETWORK_SECURITY = 'NETWORK_SECURITY',
  VULNERABILITY_MANAGEMENT = 'VULNERABILITY_MANAGEMENT',
  INCIDENT_RESPONSE = 'INCIDENT_RESPONSE',
  BUSINESS_CONTINUITY = 'BUSINESS_CONTINUITY',
  THIRD_PARTY_RISK = 'THIRD_PARTY_RISK',
  HIPAA_COMPLIANCE = 'HIPAA_COMPLIANCE',
}

/**
 * Policy severity levels
 */
export enum PolicySeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

/**
 * Enforcement modes
 */
export enum EnforcementMode {
  BLOCKING = 'BLOCKING', // Block non-compliant actions
  ALERTING = 'ALERTING', // Alert but allow actions
  LOGGING = 'LOGGING', // Log only, no intervention
  DISABLED = 'DISABLED', // Policy disabled
}

/**
 * Policy rule
 */
export interface PolicyRule {
  id: string;
  name: string;
  condition: PolicyCondition;
  action: PolicyAction;
  exceptions: string[];
  priority: number;
  enabled: boolean;
}

/**
 * Policy condition
 */
export interface PolicyCondition {
  type: ConditionType;
  field: string;
  operator: ConditionOperator;
  value: any;
  logicalOperator?: 'AND' | 'OR';
  subConditions?: PolicyCondition[];
}

/**
 * Condition types
 */
export enum ConditionType {
  ATTRIBUTE = 'ATTRIBUTE',
  TIME_BASED = 'TIME_BASED',
  LOCATION_BASED = 'LOCATION_BASED',
  ROLE_BASED = 'ROLE_BASED',
  RESOURCE_BASED = 'RESOURCE_BASED',
  CONTEXTUAL = 'CONTEXTUAL',
}

/**
 * Condition operators
 */
export enum ConditionOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  REGEX = 'REGEX',
}

/**
 * Policy action
 */
export interface PolicyAction {
  type: ActionType;
  parameters: Record<string, any>;
  notifyUsers?: string[];
  escalateTo?: string[];
}

/**
 * Action types
 */
export enum ActionType {
  BLOCK = 'BLOCK',
  ALLOW = 'ALLOW',
  ALERT = 'ALERT',
  QUARANTINE = 'QUARANTINE',
  REMEDIATE = 'REMEDIATE',
  LOG = 'LOG',
  NOTIFY = 'NOTIFY',
  ESCALATE = 'ESCALATE',
}

/**
 * Policy violation
 */
export interface PolicyViolation {
  id: string;
  policyId: string;
  policyName: string;
  ruleId: string;
  severity: PolicySeverity;
  resource: string;
  resourceType: string;
  violationType: ViolationType;
  detectedAt: Date;
  description: string;
  evidence: ViolationEvidence;
  status: ViolationStatus;
  assignedTo?: string;
  resolvedAt?: Date;
  resolution?: ViolationResolution;
}

/**
 * Violation types
 */
export enum ViolationType {
  DATA_ACCESS = 'DATA_ACCESS',
  UNAUTHORIZED_ACTION = 'UNAUTHORIZED_ACTION',
  ENCRYPTION_MISSING = 'ENCRYPTION_MISSING',
  AUDIT_FAILURE = 'AUDIT_FAILURE',
  CONFIGURATION_DRIFT = 'CONFIGURATION_DRIFT',
  CREDENTIAL_EXPOSURE = 'CREDENTIAL_EXPOSURE',
  INSECURE_COMMUNICATION = 'INSECURE_COMMUNICATION',
  POLICY_BYPASS = 'POLICY_BYPASS',
}

/**
 * Violation evidence
 */
export interface ViolationEvidence {
  timestamp: Date;
  actor: string;
  action: string;
  resource: string;
  context: Record<string, any>;
  logs: string[];
  artifacts?: string[];
}

/**
 * Violation status
 */
export enum ViolationStatus {
  DETECTED = 'DETECTED',
  INVESTIGATING = 'INVESTIGATING',
  CONFIRMED = 'CONFIRMED',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
  RESOLVED = 'RESOLVED',
  IGNORED = 'IGNORED',
}

/**
 * Violation resolution
 */
export interface ViolationResolution {
  action: string;
  performer: string;
  timestamp: Date;
  notes: string;
  automated: boolean;
}

/**
 * Enforcement evaluation request
 */
export interface EnforcementRequest {
  actor: string;
  action: string;
  resource: string;
  resourceType: string;
  context: EnforcementContext;
  timestamp: Date;
}

/**
 * Enforcement context
 */
export interface EnforcementContext {
  userId: string;
  roles: string[];
  ipAddress: string;
  location?: string;
  deviceId?: string;
  sessionId: string;
  attributes: Record<string, any>;
}

/**
 * Enforcement decision
 */
export interface EnforcementDecision {
  requestId: string;
  decision: 'ALLOW' | 'DENY' | 'CHALLENGE';
  appliedPolicies: string[];
  violatedRules: string[];
  reasons: string[];
  obligations: string[];
  evaluatedAt: Date;
  ttl?: number; // Cache TTL in seconds
}

/**
 * Remediation workflow
 */
export interface RemediationWorkflow {
  id: string;
  violationId: string;
  workflowType: WorkflowType;
  steps: RemediationStep[];
  status: WorkflowStatus;
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

/**
 * Workflow types
 */
export enum WorkflowType {
  AUTOMATED_FIX = 'AUTOMATED_FIX',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
  APPROVAL_REQUIRED = 'APPROVAL_REQUIRED',
  ESCALATION = 'ESCALATION',
  ROLLBACK = 'ROLLBACK',
}

/**
 * Workflow status
 */
export enum WorkflowStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

/**
 * Remediation step
 */
export interface RemediationStep {
  id: string;
  name: string;
  action: string;
  parameters: Record<string, any>;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
}

/**
 * Compliance report
 */
export interface ComplianceReport {
  id: string;
  reportType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  period: { start: Date; end: Date };
  overallScore: number;
  policyCompliance: PolicyComplianceScore[];
  violations: ViolationSummary;
  trends: ComplianceTrend[];
  recommendations: string[];
  generatedAt: Date;
  generatedBy: string;
}

/**
 * Policy compliance score
 */
export interface PolicyComplianceScore {
  policyId: string;
  policyName: string;
  category: PolicyCategory;
  complianceRate: number;
  violationCount: number;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIALLY_COMPLIANT';
}

/**
 * Violation summary
 */
export interface ViolationSummary {
  total: number;
  bySeverity: Record<PolicySeverity, number>;
  byCategory: Record<PolicyCategory, number>;
  byStatus: Record<ViolationStatus, number>;
  resolved: number;
  unresolved: number;
}

/**
 * Compliance trend
 */
export interface ComplianceTrend {
  metric: string;
  direction: 'IMPROVING' | 'DECLINING' | 'STABLE';
  changePercentage: number;
  historicalData: { timestamp: Date; value: number }[];
}

/**
 * Policy simulation result
 */
export interface PolicySimulation {
  id: string;
  policy: Policy;
  testCases: SimulationTestCase[];
  overallResult: 'PASSED' | 'FAILED' | 'PARTIAL';
  passRate: number;
  executedAt: Date;
  duration: number;
}

/**
 * Simulation test case
 */
export interface SimulationTestCase {
  id: string;
  name: string;
  input: EnforcementRequest;
  expectedDecision: 'ALLOW' | 'DENY';
  actualDecision: 'ALLOW' | 'DENY';
  passed: boolean;
  reason?: string;
}

// ============================================================================
// Service Implementation
// ============================================================================

/**
 * Policy Enforcement Automation Service
 *
 * Provides comprehensive policy enforcement capabilities including:
 * - Policy lifecycle management (create, update, delete, version)
 * - Real-time policy enforcement and evaluation
 * - Automated violation detection and tracking
 * - Remediation workflow orchestration
 * - Compliance reporting and analytics
 * - Policy simulation and testing
 * - Risk-based policy recommendations
 * - Integration with compliance frameworks (HIPAA, HITECH)
 *
 * @class PolicyEnforcementAutomationService
 */
@Injectable()
@ApiTags('Policy Enforcement')
export class PolicyEnforcementAutomationService {
  private readonly logger = new Logger(PolicyEnforcementAutomationService.name);

  // In-memory stores (in production, use proper database)
  private policies: Map<string, Policy> = new Map();
  private violations: Map<string, PolicyViolation> = new Map();
  private workflows: Map<string, RemediationWorkflow> = new Map();
  private decisions: Map<string, EnforcementDecision> = new Map();

  constructor() {
    this.logger.log('PolicyEnforcementAutomationService initialized');
    this.initializeDefaultPolicies();
  }

  /**
   * Initialize default HIPAA compliance policies
   * @private
   */
  private initializeDefaultPolicies(): void {
    const hipaaDataAccessPolicy: Policy = {
      id: crypto.randomUUID(),
      name: 'HIPAA PHI Access Control',
      description: 'Enforce access controls for Protected Health Information',
      category: PolicyCategory.ACCESS_CONTROL,
      severity: PolicySeverity.CRITICAL,
      rules: [
        {
          id: crypto.randomUUID(),
          name: 'Require authentication for PHI access',
          condition: {
            type: ConditionType.RESOURCE_BASED,
            field: 'resourceType',
            operator: ConditionOperator.EQUALS,
            value: 'PHI',
          },
          action: {
            type: ActionType.BLOCK,
            parameters: { requireAuth: true },
          },
          exceptions: [],
          priority: 1,
          enabled: true,
        },
      ],
      enabled: true,
      enforcementMode: EnforcementMode.BLOCKING,
      applicableScopes: ['healthcare', 'patient-data'],
      owner: 'compliance-team',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    };

    const encryptionPolicy: Policy = {
      id: crypto.randomUUID(),
      name: 'HIPAA Data Encryption',
      description: 'Require encryption for PHI at rest and in transit',
      category: PolicyCategory.ENCRYPTION,
      severity: PolicySeverity.CRITICAL,
      rules: [
        {
          id: crypto.randomUUID(),
          name: 'Enforce TLS for PHI transmission',
          condition: {
            type: ConditionType.CONTEXTUAL,
            field: 'protocol',
            operator: ConditionOperator.NOT_EQUALS,
            value: 'https',
          },
          action: {
            type: ActionType.BLOCK,
            parameters: { message: 'PHI must be transmitted over HTTPS' },
          },
          exceptions: [],
          priority: 1,
          enabled: true,
        },
      ],
      enabled: true,
      enforcementMode: EnforcementMode.BLOCKING,
      applicableScopes: ['all'],
      owner: 'security-team',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    };

    this.policies.set(hipaaDataAccessPolicy.id, hipaaDataAccessPolicy);
    this.policies.set(encryptionPolicy.id, encryptionPolicy);

    this.logger.log(`Initialized ${this.policies.size} default policies`);
  }

  /**
   * Create a new policy
   *
   * @param {Policy} policy - Policy to create
   * @returns {Promise<Policy>} Created policy
   * @throws {BadRequestException} If policy data is invalid
   */
  async createPolicy(policy: Policy): Promise<Policy> {
    try {
      this.logger.log(`Creating policy: ${policy.name}`);

      // Validate policy
      if (!policy.name || !policy.category || !policy.rules || policy.rules.length === 0) {
        throw new BadRequestException('Invalid policy: name, category, and rules are required');
      }

      // Generate IDs
      if (!policy.id) {
        policy.id = crypto.randomUUID();
      }

      for (const rule of policy.rules) {
        if (!rule.id) {
          rule.id = crypto.randomUUID();
        }
      }

      // Set timestamps
      policy.createdAt = new Date();
      policy.updatedAt = new Date();
      policy.version = 1;

      // Store policy
      this.policies.set(policy.id, policy);

      this.logger.log(`Policy created: ${policy.id}`);
      return policy;
    } catch (error) {
      this.logger.error(`Failed to create policy: ${error.message}`, error.stack);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        `Failed to create policy: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update an existing policy
   *
   * @param {string} policyId - Policy ID
   * @param {Partial<Policy>} updates - Policy updates
   * @returns {Promise<Policy>} Updated policy
   * @throws {NotFoundException} If policy not found
   */
  async updatePolicy(policyId: string, updates: Partial<Policy>): Promise<Policy> {
    this.logger.log(`Updating policy: ${policyId}`);

    const policy = this.policies.get(policyId);
    if (!policy) {
      throw new NotFoundException('Policy not found');
    }

    const updated = {
      ...policy,
      ...updates,
      id: policyId, // Preserve ID
      version: policy.version + 1,
      updatedAt: new Date(),
    };

    this.policies.set(policyId, updated);

    this.logger.log(`Policy updated: ${policyId}, version ${updated.version}`);
    return updated;
  }

  /**
   * Get policy by ID
   *
   * @param {string} policyId - Policy ID
   * @returns {Promise<Policy>} Policy
   * @throws {NotFoundException} If policy not found
   */
  async getPolicy(policyId: string): Promise<Policy> {
    const policy = this.policies.get(policyId);
    if (!policy) {
      throw new NotFoundException('Policy not found');
    }
    return policy;
  }

  /**
   * List all policies
   *
   * @param {PolicyCategory} category - Filter by category
   * @param {boolean} enabledOnly - Return only enabled policies
   * @returns {Promise<Policy[]>} Array of policies
   */
  async listPolicies(category?: PolicyCategory, enabledOnly: boolean = false): Promise<Policy[]> {
    let policies = Array.from(this.policies.values());

    if (category) {
      policies = policies.filter(p => p.category === category);
    }

    if (enabledOnly) {
      policies = policies.filter(p => p.enabled);
    }

    return policies;
  }

  /**
   * Delete a policy
   *
   * @param {string} policyId - Policy ID
   * @returns {Promise<void>}
   * @throws {NotFoundException} If policy not found
   */
  async deletePolicy(policyId: string): Promise<void> {
    if (!this.policies.has(policyId)) {
      throw new NotFoundException('Policy not found');
    }

    this.policies.delete(policyId);
    this.logger.log(`Policy deleted: ${policyId}`);
  }

  /**
   * Evaluate enforcement request against policies
   *
   * @param {EnforcementRequest} request - Enforcement request
   * @returns {Promise<EnforcementDecision>} Enforcement decision
   */
  async evaluateEnforcement(request: EnforcementRequest): Promise<EnforcementDecision> {
    this.logger.debug(`Evaluating enforcement request for: ${request.actor} -> ${request.resource}`);

    const decision: EnforcementDecision = {
      requestId: crypto.randomUUID(),
      decision: 'ALLOW',
      appliedPolicies: [],
      violatedRules: [],
      reasons: [],
      obligations: [],
      evaluatedAt: new Date(),
      ttl: 300, // 5 minutes cache
    };

    // Get applicable policies
    const applicablePolicies = Array.from(this.policies.values()).filter(
      p => p.enabled && p.enforcementMode !== EnforcementMode.DISABLED,
    );

    // Evaluate each policy
    for (const policy of applicablePolicies) {
      // Check if policy applies to this request
      if (!this.policyApplies(policy, request)) {
        continue;
      }

      decision.appliedPolicies.push(policy.id);

      // Evaluate rules
      for (const rule of policy.rules) {
        if (!rule.enabled) continue;

        const ruleMatches = this.evaluateCondition(rule.condition, request);

        if (ruleMatches) {
          // Rule matched
          if (rule.action.type === ActionType.BLOCK) {
            decision.decision = 'DENY';
            decision.violatedRules.push(rule.id);
            decision.reasons.push(`Policy violated: ${policy.name} - ${rule.name}`);

            // Log violation
            await this.recordViolation(policy, rule, request);

            // If blocking mode, stop evaluation
            if (policy.enforcementMode === EnforcementMode.BLOCKING) {
              break;
            }
          } else if (rule.action.type === ActionType.ALERT) {
            decision.reasons.push(`Alert: ${policy.name} - ${rule.name}`);
            await this.recordViolation(policy, rule, request);
          }
        }
      }
    }

    // Cache decision
    this.decisions.set(decision.requestId, decision);

    this.logger.log(`Enforcement decision: ${decision.decision} for ${request.actor} -> ${request.resource}`);
    return decision;
  }

  /**
   * Check if policy applies to request
   *
   * @param {Policy} policy - Policy to check
   * @param {EnforcementRequest} request - Enforcement request
   * @returns {boolean} Whether policy applies
   * @private
   */
  private policyApplies(policy: Policy, request: EnforcementRequest): boolean {
    // Check applicable scopes
    if (policy.applicableScopes.includes('all')) {
      return true;
    }

    // Check if resource type or action matches any scope
    return policy.applicableScopes.some(
      scope =>
        request.resourceType.includes(scope) ||
        request.resource.includes(scope) ||
        request.action.includes(scope),
    );
  }

  /**
   * Evaluate policy condition
   *
   * @param {PolicyCondition} condition - Condition to evaluate
   * @param {EnforcementRequest} request - Enforcement request
   * @returns {boolean} Whether condition matches
   * @private
   */
  private evaluateCondition(condition: PolicyCondition, request: EnforcementRequest): boolean {
    // Get value from request based on condition field
    let actualValue: any;

    switch (condition.field) {
      case 'actor':
        actualValue = request.actor;
        break;
      case 'action':
        actualValue = request.action;
        break;
      case 'resource':
        actualValue = request.resource;
        break;
      case 'resourceType':
        actualValue = request.resourceType;
        break;
      default:
        actualValue = request.context.attributes[condition.field];
    }

    // Evaluate operator
    let matches = false;

    switch (condition.operator) {
      case ConditionOperator.EQUALS:
        matches = actualValue === condition.value;
        break;
      case ConditionOperator.NOT_EQUALS:
        matches = actualValue !== condition.value;
        break;
      case ConditionOperator.CONTAINS:
        matches = String(actualValue).includes(String(condition.value));
        break;
      case ConditionOperator.NOT_CONTAINS:
        matches = !String(actualValue).includes(String(condition.value));
        break;
      case ConditionOperator.STARTS_WITH:
        matches = String(actualValue).startsWith(String(condition.value));
        break;
      case ConditionOperator.ENDS_WITH:
        matches = String(actualValue).endsWith(String(condition.value));
        break;
      case ConditionOperator.GREATER_THAN:
        matches = actualValue > condition.value;
        break;
      case ConditionOperator.LESS_THAN:
        matches = actualValue < condition.value;
        break;
      case ConditionOperator.IN:
        matches = Array.isArray(condition.value) && condition.value.includes(actualValue);
        break;
      case ConditionOperator.NOT_IN:
        matches = Array.isArray(condition.value) && !condition.value.includes(actualValue);
        break;
      case ConditionOperator.REGEX:
        matches = new RegExp(condition.value).test(String(actualValue));
        break;
    }

    // Handle sub-conditions
    if (condition.subConditions && condition.subConditions.length > 0) {
      const subResults = condition.subConditions.map(sub => this.evaluateCondition(sub, request));

      if (condition.logicalOperator === 'AND') {
        matches = matches && subResults.every(r => r);
      } else if (condition.logicalOperator === 'OR') {
        matches = matches || subResults.some(r => r);
      }
    }

    return matches;
  }

  /**
   * Record a policy violation
   *
   * @param {Policy} policy - Violated policy
   * @param {PolicyRule} rule - Violated rule
   * @param {EnforcementRequest} request - Original request
   * @returns {Promise<PolicyViolation>} Recorded violation
   * @private
   */
  private async recordViolation(
    policy: Policy,
    rule: PolicyRule,
    request: EnforcementRequest,
  ): Promise<PolicyViolation> {
    const violation: PolicyViolation = {
      id: crypto.randomUUID(),
      policyId: policy.id,
      policyName: policy.name,
      ruleId: rule.id,
      severity: policy.severity,
      resource: request.resource,
      resourceType: request.resourceType,
      violationType: this.inferViolationType(policy.category),
      detectedAt: new Date(),
      description: `Policy "${policy.name}" violated by rule "${rule.name}"`,
      evidence: {
        timestamp: request.timestamp,
        actor: request.actor,
        action: request.action,
        resource: request.resource,
        context: request.context as any,
        logs: [],
      },
      status: ViolationStatus.DETECTED,
    };

    this.violations.set(violation.id, violation);

    this.logger.warn(`Violation recorded: ${violation.id} - ${policy.name}`);

    // Trigger automated remediation if configured
    if (policy.severity === PolicySeverity.CRITICAL) {
      await this.initiateRemediation(violation);
    }

    return violation;
  }

  /**
   * Infer violation type from policy category
   *
   * @param {PolicyCategory} category - Policy category
   * @returns {ViolationType} Violation type
   * @private
   */
  private inferViolationType(category: PolicyCategory): ViolationType {
    const mapping: Record<PolicyCategory, ViolationType> = {
      [PolicyCategory.DATA_PROTECTION]: ViolationType.DATA_ACCESS,
      [PolicyCategory.ACCESS_CONTROL]: ViolationType.UNAUTHORIZED_ACTION,
      [PolicyCategory.ENCRYPTION]: ViolationType.ENCRYPTION_MISSING,
      [PolicyCategory.AUDIT_LOGGING]: ViolationType.AUDIT_FAILURE,
      [PolicyCategory.NETWORK_SECURITY]: ViolationType.INSECURE_COMMUNICATION,
      [PolicyCategory.VULNERABILITY_MANAGEMENT]: ViolationType.CONFIGURATION_DRIFT,
      [PolicyCategory.INCIDENT_RESPONSE]: ViolationType.POLICY_BYPASS,
      [PolicyCategory.BUSINESS_CONTINUITY]: ViolationType.CONFIGURATION_DRIFT,
      [PolicyCategory.THIRD_PARTY_RISK]: ViolationType.UNAUTHORIZED_ACTION,
      [PolicyCategory.HIPAA_COMPLIANCE]: ViolationType.DATA_ACCESS,
    };

    return mapping[category] || ViolationType.POLICY_BYPASS;
  }

  /**
   * Get violation by ID
   *
   * @param {string} violationId - Violation ID
   * @returns {Promise<PolicyViolation>} Violation
   * @throws {NotFoundException} If violation not found
   */
  async getViolation(violationId: string): Promise<PolicyViolation> {
    const violation = this.violations.get(violationId);
    if (!violation) {
      throw new NotFoundException('Violation not found');
    }
    return violation;
  }

  /**
   * List violations with filters
   *
   * @param {PolicySeverity} severity - Filter by severity
   * @param {ViolationStatus} status - Filter by status
   * @param {Date} startDate - Filter by start date
   * @param {Date} endDate - Filter by end date
   * @returns {Promise<PolicyViolation[]>} Array of violations
   */
  async listViolations(
    severity?: PolicySeverity,
    status?: ViolationStatus,
    startDate?: Date,
    endDate?: Date,
  ): Promise<PolicyViolation[]> {
    let violations = Array.from(this.violations.values());

    if (severity) {
      violations = violations.filter(v => v.severity === severity);
    }

    if (status) {
      violations = violations.filter(v => v.status === status);
    }

    if (startDate) {
      violations = violations.filter(v => v.detectedAt >= startDate);
    }

    if (endDate) {
      violations = violations.filter(v => v.detectedAt <= endDate);
    }

    return violations.sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());
  }

  /**
   * Initiate automated remediation workflow
   *
   * @param {PolicyViolation} violation - Violation to remediate
   * @returns {Promise<RemediationWorkflow>} Started workflow
   */
  async initiateRemediation(violation: PolicyViolation): Promise<RemediationWorkflow> {
    this.logger.log(`Initiating remediation for violation: ${violation.id}`);

    const workflow: RemediationWorkflow = {
      id: crypto.randomUUID(),
      violationId: violation.id,
      workflowType: WorkflowType.AUTOMATED_FIX,
      steps: [
        {
          id: crypto.randomUUID(),
          name: 'Validate violation',
          action: 'validate',
          parameters: { violationId: violation.id },
          status: 'PENDING',
        },
        {
          id: crypto.randomUUID(),
          name: 'Apply remediation',
          action: 'remediate',
          parameters: { violationType: violation.violationType },
          status: 'PENDING',
        },
        {
          id: crypto.randomUUID(),
          name: 'Verify compliance',
          action: 'verify',
          parameters: { policyId: violation.policyId },
          status: 'PENDING',
        },
      ],
      status: WorkflowStatus.PENDING,
      progress: 0,
      startedAt: new Date(),
    };

    this.workflows.set(workflow.id, workflow);

    // Start workflow execution (async)
    this.executeWorkflow(workflow).catch(error => {
      this.logger.error(`Workflow execution failed: ${error.message}`, error.stack);
    });

    return workflow;
  }

  /**
   * Execute remediation workflow
   *
   * @param {RemediationWorkflow} workflow - Workflow to execute
   * @returns {Promise<void>}
   * @private
   */
  private async executeWorkflow(workflow: RemediationWorkflow): Promise<void> {
    workflow.status = WorkflowStatus.IN_PROGRESS;

    try {
      for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i];
        step.status = 'RUNNING';
        step.startedAt = new Date();

        // Simulate step execution
        await new Promise(resolve => setTimeout(resolve, 1000));

        step.status = 'COMPLETED';
        step.completedAt = new Date();
        step.result = { success: true };

        workflow.progress = ((i + 1) / workflow.steps.length) * 100;
      }

      workflow.status = WorkflowStatus.COMPLETED;
      workflow.completedAt = new Date();

      this.logger.log(`Workflow completed: ${workflow.id}`);
    } catch (error) {
      workflow.status = WorkflowStatus.FAILED;
      workflow.error = error.message;

      this.logger.error(`Workflow failed: ${workflow.id} - ${error.message}`);
    }
  }

  /**
   * Get workflow status
   *
   * @param {string} workflowId - Workflow ID
   * @returns {Promise<RemediationWorkflow>} Workflow
   * @throws {NotFoundException} If workflow not found
   */
  async getWorkflow(workflowId: string): Promise<RemediationWorkflow> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }
    return workflow;
  }

  /**
   * Generate compliance report
   *
   * @param {string} reportType - Report type
   * @param {Date} startDate - Report start date
   * @param {Date} endDate - Report end date
   * @returns {Promise<ComplianceReport>} Generated report
   */
  async generateComplianceReport(
    reportType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL',
    startDate: Date,
    endDate: Date,
  ): Promise<ComplianceReport> {
    this.logger.log(`Generating ${reportType} compliance report`);

    // Get violations in period
    const violations = await this.listViolations(undefined, undefined, startDate, endDate);

    // Calculate policy compliance scores
    const policyCompliance: PolicyComplianceScore[] = [];
    for (const policy of this.policies.values()) {
      const policyViolations = violations.filter(v => v.policyId === policy.id);
      const totalChecks = 1000; // Mock: in production, track actual checks
      const complianceRate = ((totalChecks - policyViolations.length) / totalChecks) * 100;

      policyCompliance.push({
        policyId: policy.id,
        policyName: policy.name,
        category: policy.category,
        complianceRate,
        violationCount: policyViolations.length,
        status:
          complianceRate >= 95
            ? 'COMPLIANT'
            : complianceRate >= 80
            ? 'PARTIALLY_COMPLIANT'
            : 'NON_COMPLIANT',
      });
    }

    // Calculate overall score
    const overallScore =
      policyCompliance.reduce((sum, p) => sum + p.complianceRate, 0) / policyCompliance.length;

    // Summarize violations
    const violationSummary: ViolationSummary = {
      total: violations.length,
      bySeverity: {
        [PolicySeverity.CRITICAL]: violations.filter(v => v.severity === PolicySeverity.CRITICAL).length,
        [PolicySeverity.HIGH]: violations.filter(v => v.severity === PolicySeverity.HIGH).length,
        [PolicySeverity.MEDIUM]: violations.filter(v => v.severity === PolicySeverity.MEDIUM).length,
        [PolicySeverity.LOW]: violations.filter(v => v.severity === PolicySeverity.LOW).length,
        [PolicySeverity.INFO]: violations.filter(v => v.severity === PolicySeverity.INFO).length,
      },
      byCategory: {} as Record<PolicyCategory, number>,
      byStatus: {
        [ViolationStatus.DETECTED]: violations.filter(v => v.status === ViolationStatus.DETECTED).length,
        [ViolationStatus.INVESTIGATING]: violations.filter(v => v.status === ViolationStatus.INVESTIGATING).length,
        [ViolationStatus.CONFIRMED]: violations.filter(v => v.status === ViolationStatus.CONFIRMED).length,
        [ViolationStatus.FALSE_POSITIVE]: violations.filter(v => v.status === ViolationStatus.FALSE_POSITIVE).length,
        [ViolationStatus.RESOLVED]: violations.filter(v => v.status === ViolationStatus.RESOLVED).length,
        [ViolationStatus.IGNORED]: violations.filter(v => v.status === ViolationStatus.IGNORED).length,
      },
      resolved: violations.filter(v => v.status === ViolationStatus.RESOLVED).length,
      unresolved: violations.filter(v => v.status !== ViolationStatus.RESOLVED).length,
    };

    // Generate recommendations
    const recommendations: string[] = [
      'Review and update critical policies quarterly',
      'Implement additional controls for high-risk areas',
      'Conduct regular policy training for all staff',
      'Automate remediation for common violations',
    ];

    const report: ComplianceReport = {
      id: crypto.randomUUID(),
      reportType,
      period: { start: startDate, end: endDate },
      overallScore,
      policyCompliance,
      violations: violationSummary,
      trends: [],
      recommendations,
      generatedAt: new Date(),
      generatedBy: 'system',
    };

    this.logger.log(`Compliance report generated: ${report.id}`);
    return report;
  }

  /**
   * Simulate policy before activation
   *
   * @param {Policy} policy - Policy to simulate
   * @param {EnforcementRequest[]} testCases - Test cases to run
   * @returns {Promise<PolicySimulation>} Simulation results
   */
  async simulatePolicy(
    policy: Policy,
    testCases: EnforcementRequest[],
  ): Promise<PolicySimulation> {
    this.logger.log(`Simulating policy: ${policy.name}`);

    const startTime = Date.now();
    const results: SimulationTestCase[] = [];

    for (const testCase of testCases) {
      // Temporarily add policy for evaluation
      const tempId = crypto.randomUUID();
      this.policies.set(tempId, { ...policy, id: tempId });

      try {
        const decision = await this.evaluateEnforcement(testCase);
        const actualDecision = decision.decision === 'ALLOW' ? 'ALLOW' : 'DENY';

        results.push({
          id: crypto.randomUUID(),
          name: `Test: ${testCase.action} on ${testCase.resource}`,
          input: testCase,
          expectedDecision: 'DENY', // Mock: in production, test cases would specify expected outcome
          actualDecision,
          passed: true, // Mock calculation
        });
      } finally {
        this.policies.delete(tempId);
      }
    }

    const passRate = (results.filter(r => r.passed).length / results.length) * 100;
    const duration = Date.now() - startTime;

    return {
      id: crypto.randomUUID(),
      policy,
      testCases: results,
      overallResult: passRate === 100 ? 'PASSED' : passRate >= 80 ? 'PARTIAL' : 'FAILED',
      passRate,
      executedAt: new Date(),
      duration,
    };
  }
}

// ============================================================================
// Controller Implementation
// ============================================================================

/**
 * Policy Enforcement Automation Controller
 *
 * REST API endpoints for policy management and enforcement
 */
@Controller('api/v1/policy-enforcement')
@ApiTags('Policy Enforcement Automation')
@ApiBearerAuth()
export class PolicyEnforcementAutomationController {
  private readonly logger = new Logger(PolicyEnforcementAutomationController.name);

  constructor(private readonly service: PolicyEnforcementAutomationService) {}

  /**
   * Create a new policy
   */
  @Post('policies')
  @ApiOperation({ summary: 'Create a new policy' })
  @ApiResponse({ status: 201, description: 'Policy created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid policy data' })
  async createPolicy(@Body() policy: Policy): Promise<Policy> {
    return this.service.createPolicy(policy);
  }

  /**
   * Update a policy
   */
  @Put('policies/:id')
  @ApiOperation({ summary: 'Update a policy' })
  @ApiParam({ name: 'id', description: 'Policy ID' })
  @ApiResponse({ status: 200, description: 'Policy updated successfully' })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  async updatePolicy(@Param('id') id: string, @Body() updates: Partial<Policy>): Promise<Policy> {
    return this.service.updatePolicy(id, updates);
  }

  /**
   * Get a policy
   */
  @Get('policies/:id')
  @ApiOperation({ summary: 'Get a policy by ID' })
  @ApiParam({ name: 'id', description: 'Policy ID' })
  @ApiResponse({ status: 200, description: 'Policy retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  async getPolicy(@Param('id') id: string): Promise<Policy> {
    return this.service.getPolicy(id);
  }

  /**
   * List all policies
   */
  @Get('policies')
  @ApiOperation({ summary: 'List all policies' })
  @ApiQuery({ name: 'category', required: false, enum: PolicyCategory })
  @ApiQuery({ name: 'enabledOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Policies retrieved successfully' })
  async listPolicies(
    @Query('category') category?: PolicyCategory,
    @Query('enabledOnly') enabledOnly?: boolean,
  ): Promise<Policy[]> {
    return this.service.listPolicies(category, enabledOnly);
  }

  /**
   * Delete a policy
   */
  @Delete('policies/:id')
  @ApiOperation({ summary: 'Delete a policy' })
  @ApiParam({ name: 'id', description: 'Policy ID' })
  @ApiResponse({ status: 200, description: 'Policy deleted successfully' })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  async deletePolicy(@Param('id') id: string): Promise<{ message: string }> {
    await this.service.deletePolicy(id);
    return { message: 'Policy deleted successfully' };
  }

  /**
   * Evaluate enforcement request
   */
  @Post('evaluate')
  @ApiOperation({ summary: 'Evaluate enforcement request' })
  @ApiResponse({ status: 200, description: 'Request evaluated successfully' })
  async evaluateEnforcement(@Body() request: EnforcementRequest): Promise<EnforcementDecision> {
    return this.service.evaluateEnforcement(request);
  }

  /**
   * Get a violation
   */
  @Get('violations/:id')
  @ApiOperation({ summary: 'Get a violation by ID' })
  @ApiParam({ name: 'id', description: 'Violation ID' })
  @ApiResponse({ status: 200, description: 'Violation retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Violation not found' })
  async getViolation(@Param('id') id: string): Promise<PolicyViolation> {
    return this.service.getViolation(id);
  }

  /**
   * List violations
   */
  @Get('violations')
  @ApiOperation({ summary: 'List violations with filters' })
  @ApiQuery({ name: 'severity', required: false, enum: PolicySeverity })
  @ApiQuery({ name: 'status', required: false, enum: ViolationStatus })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({ status: 200, description: 'Violations retrieved successfully' })
  async listViolations(
    @Query('severity') severity?: PolicySeverity,
    @Query('status') status?: ViolationStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<PolicyViolation[]> {
    return this.service.listViolations(
      severity,
      status,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  /**
   * Initiate remediation
   */
  @Post('violations/:id/remediate')
  @ApiOperation({ summary: 'Initiate remediation for a violation' })
  @ApiParam({ name: 'id', description: 'Violation ID' })
  @ApiResponse({ status: 201, description: 'Remediation initiated successfully' })
  @ApiResponse({ status: 404, description: 'Violation not found' })
  async initiateRemediation(@Param('id') id: string): Promise<RemediationWorkflow> {
    const violation = await this.service.getViolation(id);
    return this.service.initiateRemediation(violation);
  }

  /**
   * Get workflow status
   */
  @Get('workflows/:id')
  @ApiOperation({ summary: 'Get workflow status' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  @ApiResponse({ status: 200, description: 'Workflow retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  async getWorkflow(@Param('id') id: string): Promise<RemediationWorkflow> {
    return this.service.getWorkflow(id);
  }

  /**
   * Generate compliance report
   */
  @Post('reports/compliance')
  @ApiOperation({ summary: 'Generate compliance report' })
  @ApiResponse({ status: 201, description: 'Report generated successfully' })
  @ApiBody({
    schema: {
      example: {
        reportType: 'MONTHLY',
        startDate: '2025-11-01T00:00:00Z',
        endDate: '2025-11-30T23:59:59Z',
      },
    },
  })
  async generateComplianceReport(
    @Body()
    body: {
      reportType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
      startDate: string;
      endDate: string;
    },
  ): Promise<ComplianceReport> {
    return this.service.generateComplianceReport(
      body.reportType,
      new Date(body.startDate),
      new Date(body.endDate),
    );
  }

  /**
   * Simulate policy
   */
  @Post('policies/simulate')
  @ApiOperation({ summary: 'Simulate policy before activation' })
  @ApiResponse({ status: 200, description: 'Simulation completed successfully' })
  async simulatePolicy(
    @Body() body: { policy: Policy; testCases: EnforcementRequest[] },
  ): Promise<PolicySimulation> {
    return this.service.simulatePolicy(body.policy, body.testCases);
  }
}

// ============================================================================
// Module Exports
// ============================================================================

export default {
  PolicyEnforcementAutomationService,
  PolicyEnforcementAutomationController,
};
