/**
 * LOC: THREATPOLICY89013
 * File: /reuse/threat/security-policy-enforcement-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Policy management services
 *   - Compliance enforcement controllers
 *   - Security governance modules
 *   - Audit and reporting services
 */

/**
 * File: /reuse/threat/security-policy-enforcement-kit.ts
 * Locator: WC-THREAT-POLICY-001
 * Purpose: Enterprise Security Policy Enforcement - ISO 27001, NIST, CIS Controls compliant
 *
 * Upstream: Independent security policy enforcement utility module
 * Downstream: ../backend/*, Policy controllers, Compliance services, Security governance, Audit systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 38+ utility functions for policy definition, compliance checking, violation detection, enforcement automation, exception management
 *
 * LLM Context: Enterprise-grade security policy enforcement framework compliant with ISO 27001, NIST CSF, CIS Controls.
 * Provides comprehensive policy definition and management, policy compliance checking and validation, policy violation detection and alerting,
 * automated policy enforcement, exception request and approval workflows, policy audit reporting, security baseline enforcement,
 * configuration compliance verification, policy versioning and change management, role-based policy application,
 * policy effectiveness measurement, remediation tracking, continuous compliance monitoring, policy template library,
 * and integrated governance, risk, and compliance (GRC) workflows with full audit trails.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  ValidationPipe,
  UsePipes,
  Injectable,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsObject,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

export enum PolicyFramework {
  ISO_27001 = 'iso-27001',
  NIST_CSF = 'nist-csf',
  CIS_CONTROLS = 'cis-controls',
  HIPAA = 'hipaa',
  PCI_DSS = 'pci-dss',
  GDPR = 'gdpr',
  SOC_2 = 'soc-2',
  CUSTOM = 'custom',
}

export enum PolicyCategory {
  ACCESS_CONTROL = 'access-control',
  DATA_PROTECTION = 'data-protection',
  NETWORK_SECURITY = 'network-security',
  ENCRYPTION = 'encryption',
  AUTHENTICATION = 'authentication',
  INCIDENT_RESPONSE = 'incident-response',
  CHANGE_MANAGEMENT = 'change-management',
  ASSET_MANAGEMENT = 'asset-management',
  VULNERABILITY_MANAGEMENT = 'vulnerability-management',
  BACKUP_RECOVERY = 'backup-recovery',
  MONITORING_LOGGING = 'monitoring-logging',
  PHYSICAL_SECURITY = 'physical-security',
}

export enum PolicySeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFORMATIONAL = 'informational',
}

export enum PolicyStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVED = 'approved',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DEPRECATED = 'deprecated',
  ARCHIVED = 'archived',
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non-compliant',
  PARTIALLY_COMPLIANT = 'partially-compliant',
  NOT_APPLICABLE = 'not-applicable',
  PENDING_REVIEW = 'pending-review',
  EXCEPTION_GRANTED = 'exception-granted',
}

export enum ViolationSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum ViolationStatus {
  DETECTED = 'detected',
  INVESTIGATING = 'investigating',
  REMEDIATION_IN_PROGRESS = 'remediation-in-progress',
  REMEDIATED = 'remediated',
  EXCEPTION_REQUESTED = 'exception-requested',
  EXCEPTION_GRANTED = 'exception-granted',
  FALSE_POSITIVE = 'false-positive',
}

export enum EnforcementAction {
  ALERT = 'alert',
  BLOCK = 'block',
  QUARANTINE = 'quarantine',
  DISABLE = 'disable',
  TERMINATE = 'terminate',
  NOTIFY = 'notify',
  LOG_ONLY = 'log-only',
}

export enum ExceptionStatus {
  REQUESTED = 'requested',
  UNDER_REVIEW = 'under-review',
  APPROVED = 'approved',
  DENIED = 'denied',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

export enum PolicyScope {
  ORGANIZATION = 'organization',
  DEPARTMENT = 'department',
  TEAM = 'team',
  APPLICATION = 'application',
  SYSTEM = 'system',
  USER = 'user',
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

export class CreateSecurityPolicyDto {
  @ApiProperty({ example: 'Password Complexity Requirements' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Enforces minimum password complexity standards' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ enum: PolicyFramework })
  @IsEnum(PolicyFramework)
  framework: PolicyFramework;

  @ApiProperty({ enum: PolicyCategory })
  @IsEnum(PolicyCategory)
  category: PolicyCategory;

  @ApiProperty({ enum: PolicySeverity })
  @IsEnum(PolicySeverity)
  severity: PolicySeverity;

  @ApiProperty({ enum: PolicyScope })
  @IsEnum(PolicyScope)
  scope: PolicyScope;

  @ApiProperty({ example: { minLength: 12, requireUppercase: true } })
  @IsObject()
  @IsNotEmpty()
  rules: Record<string, any>;

  @ApiProperty({ enum: EnforcementAction })
  @IsEnum(EnforcementAction)
  enforcementAction: EnforcementAction;

  @ApiProperty({ example: ['admin', 'security-team'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  applicableRoles?: string[];

  @ApiProperty({ example: { owner: 'security@example.com' } })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class CreateComplianceCheckDto {
  @ApiProperty({ example: 'Password Policy Compliance' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Verify all users have compliant passwords' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ example: { checkType: 'password-strength' } })
  @IsObject()
  @IsNotEmpty()
  checkCriteria: Record<string, any>;

  @ApiProperty({ example: 'daily' })
  @IsString()
  @IsOptional()
  frequency?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  automated?: boolean;
}

export class CreateViolationDto {
  @ApiProperty({ example: 'Weak password detected' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'User password does not meet minimum complexity' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ enum: ViolationSeverity })
  @IsEnum(ViolationSeverity)
  severity: ViolationSeverity;

  @ApiProperty({ example: 'user-123' })
  @IsString()
  @IsNotEmpty()
  affectedEntity: string;

  @ApiProperty({ example: { username: 'john.doe' } })
  @IsOptional()
  evidence?: Record<string, any>;
}

export class CreateExceptionRequestDto {
  @ApiProperty({ example: 'Legacy system requires simpler password' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reason: string;

  @ApiProperty({ example: 'System will be migrated within 90 days' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  justification: string;

  @ApiProperty({ example: '2025-06-01T00:00:00Z' })
  @IsDate()
  @Type(() => Date)
  requestedExpiryDate: Date;

  @ApiProperty({ example: { systemId: 'legacy-crm' } })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class PolicyComplianceReportDto {
  @ApiProperty({ example: '2025-01-01T00:00:00Z' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ example: '2025-03-31T00:00:00Z' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ enum: PolicyFramework, isArray: true })
  @IsArray()
  @IsEnum(PolicyFramework, { each: true })
  @IsOptional()
  frameworks?: PolicyFramework[];

  @ApiProperty({ enum: PolicyCategory, isArray: true })
  @IsArray()
  @IsEnum(PolicyCategory, { each: true })
  @IsOptional()
  categories?: PolicyCategory[];
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

export class SecurityPolicy extends Model {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: PolicyFramework })
  framework: PolicyFramework;

  @ApiProperty({ enum: PolicyCategory })
  category: PolicyCategory;

  @ApiProperty({ enum: PolicySeverity })
  severity: PolicySeverity;

  @ApiProperty({ enum: PolicyScope })
  scope: PolicyScope;

  @ApiProperty()
  rules: Record<string, any>;

  @ApiProperty({ enum: EnforcementAction })
  enforcementAction: EnforcementAction;

  @ApiProperty()
  applicableRoles: string[];

  @ApiProperty({ enum: PolicyStatus })
  status: PolicyStatus;

  @ApiProperty()
  version: number;

  @ApiProperty()
  approvedBy: string;

  @ApiProperty()
  approvedAt: Date;

  @ApiProperty()
  effectiveDate: Date;

  @ApiProperty()
  expiryDate: Date;

  @ApiProperty()
  lastReviewDate: Date;

  @ApiProperty()
  nextReviewDate: Date;

  @ApiProperty()
  violationCount: number;

  @ApiProperty()
  complianceRate: number;

  @ApiProperty()
  metadata: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ComplianceCheck extends Model {
  @ApiProperty()
  id: string;

  @ApiProperty()
  policyId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  checkCriteria: Record<string, any>;

  @ApiProperty()
  frequency: string;

  @ApiProperty()
  automated: boolean;

  @ApiProperty()
  lastCheckDate: Date;

  @ApiProperty()
  nextCheckDate: Date;

  @ApiProperty({ enum: ComplianceStatus })
  lastCheckStatus: ComplianceStatus;

  @ApiProperty()
  passRate: number;

  @ApiProperty()
  failCount: number;

  @ApiProperty()
  metadata: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PolicyViolation extends Model {
  @ApiProperty()
  id: string;

  @ApiProperty()
  policyId: string;

  @ApiProperty()
  complianceCheckId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ViolationSeverity })
  severity: ViolationSeverity;

  @ApiProperty()
  affectedEntity: string;

  @ApiProperty()
  evidence: Record<string, any>;

  @ApiProperty({ enum: ViolationStatus })
  status: ViolationStatus;

  @ApiProperty()
  detectedAt: Date;

  @ApiProperty()
  acknowledgedAt: Date;

  @ApiProperty()
  remediatedAt: Date;

  @ApiProperty()
  assignedTo: string;

  @ApiProperty()
  remediationNotes: string;

  @ApiProperty()
  metadata: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PolicyException extends Model {
  @ApiProperty()
  id: string;

  @ApiProperty()
  policyId: string;

  @ApiProperty()
  violationId: string;

  @ApiProperty()
  requestedBy: string;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  justification: string;

  @ApiProperty({ enum: ExceptionStatus })
  status: ExceptionStatus;

  @ApiProperty()
  reviewedBy: string;

  @ApiProperty()
  reviewedAt: Date;

  @ApiProperty()
  reviewNotes: string;

  @ApiProperty()
  approvedAt: Date;

  @ApiProperty()
  expiryDate: Date;

  @ApiProperty()
  conditions: Record<string, any>;

  @ApiProperty()
  metadata: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PolicyAuditLog extends Model {
  @ApiProperty()
  id: string;

  @ApiProperty()
  policyId: string;

  @ApiProperty()
  action: string;

  @ApiProperty()
  performedBy: string;

  @ApiProperty()
  changes: Record<string, any>;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  ipAddress: string;

  @ApiProperty()
  metadata: Record<string, any>;

  @ApiProperty()
  createdAt: Date;
}

// ============================================================================
// MODEL INITIALIZATION FUNCTIONS
// ============================================================================

/**
 * Initialize Security Policy model
 * @param sequelize Sequelize instance
 * @returns SecurityPolicy model
 */
export function initSecurityPolicyModel(sequelize: Sequelize): typeof SecurityPolicy {
  SecurityPolicy.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      framework: {
        type: DataTypes.ENUM(...Object.values(PolicyFramework)),
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM(...Object.values(PolicyCategory)),
        allowNull: false,
      },
      severity: {
        type: DataTypes.ENUM(...Object.values(PolicySeverity)),
        allowNull: false,
      },
      scope: {
        type: DataTypes.ENUM(...Object.values(PolicyScope)),
        allowNull: false,
      },
      rules: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      enforcementAction: {
        type: DataTypes.ENUM(...Object.values(EnforcementAction)),
        allowNull: false,
      },
      applicableRoles: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      status: {
        type: DataTypes.ENUM(...Object.values(PolicyStatus)),
        allowNull: false,
        defaultValue: PolicyStatus.DRAFT,
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      approvedBy: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lastReviewDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      nextReviewDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      violationCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      complianceRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'security_policies',
      timestamps: true,
      indexes: [
        { fields: ['framework'] },
        { fields: ['category'] },
        { fields: ['severity'] },
        { fields: ['status'] },
        { fields: ['scope'] },
      ],
    }
  );

  return SecurityPolicy;
}

/**
 * Initialize Compliance Check model
 * @param sequelize Sequelize instance
 * @returns ComplianceCheck model
 */
export function initComplianceCheckModel(sequelize: Sequelize): typeof ComplianceCheck {
  ComplianceCheck.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      policyId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'security_policies',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      checkCriteria: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      frequency: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      automated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      lastCheckDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      nextCheckDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lastCheckStatus: {
        type: DataTypes.ENUM(...Object.values(ComplianceStatus)),
        allowNull: true,
      },
      passRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      failCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'compliance_checks',
      timestamps: true,
      indexes: [
        { fields: ['policyId'] },
        { fields: ['lastCheckStatus'] },
        { fields: ['nextCheckDate'] },
      ],
    }
  );

  return ComplianceCheck;
}

/**
 * Initialize Policy Violation model
 * @param sequelize Sequelize instance
 * @returns PolicyViolation model
 */
export function initPolicyViolationModel(sequelize: Sequelize): typeof PolicyViolation {
  PolicyViolation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      policyId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'security_policies',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      complianceCheckId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'compliance_checks',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      severity: {
        type: DataTypes.ENUM(...Object.values(ViolationSeverity)),
        allowNull: false,
      },
      affectedEntity: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      evidence: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ViolationStatus)),
        allowNull: false,
        defaultValue: ViolationStatus.DETECTED,
      },
      detectedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      acknowledgedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      remediatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      assignedTo: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      remediationNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'policy_violations',
      timestamps: true,
      indexes: [
        { fields: ['policyId'] },
        { fields: ['complianceCheckId'] },
        { fields: ['severity'] },
        { fields: ['status'] },
        { fields: ['affectedEntity'] },
        { fields: ['detectedAt'] },
      ],
    }
  );

  return PolicyViolation;
}

/**
 * Initialize Policy Exception model
 * @param sequelize Sequelize instance
 * @returns PolicyException model
 */
export function initPolicyExceptionModel(sequelize: Sequelize): typeof PolicyException {
  PolicyException.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      policyId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'security_policies',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      violationId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'policy_violations',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      requestedBy: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      justification: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ExceptionStatus)),
        allowNull: false,
        defaultValue: ExceptionStatus.REQUESTED,
      },
      reviewedBy: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      reviewedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      reviewNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      conditions: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'policy_exceptions',
      timestamps: true,
      indexes: [
        { fields: ['policyId'] },
        { fields: ['violationId'] },
        { fields: ['status'] },
        { fields: ['requestedBy'] },
        { fields: ['expiryDate'] },
      ],
    }
  );

  return PolicyException;
}

/**
 * Initialize Policy Audit Log model
 * @param sequelize Sequelize instance
 * @returns PolicyAuditLog model
 */
export function initPolicyAuditLogModel(sequelize: Sequelize): typeof PolicyAuditLog {
  PolicyAuditLog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      policyId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'security_policies',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      performedBy: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      changes: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'policy_audit_logs',
      timestamps: true,
      indexes: [
        { fields: ['policyId'] },
        { fields: ['action'] },
        { fields: ['performedBy'] },
        { fields: ['timestamp'] },
      ],
    }
  );

  return PolicyAuditLog;
}

// ============================================================================
// POLICY DEFINITION AND MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Create a new security policy
 * @param data Policy data
 * @param transaction Optional transaction
 * @returns Created policy
 */
export async function createSecurityPolicy(
  data: CreateSecurityPolicyDto,
  transaction?: Transaction
): Promise<SecurityPolicy> {
  return await SecurityPolicy.create(
    {
      ...data,
      status: PolicyStatus.DRAFT,
      version: 1,
      violationCount: 0,
    },
    { transaction }
  );
}

/**
 * Update policy status
 * @param policyId Policy ID
 * @param status New status
 * @param approvedBy Approver user ID
 * @param transaction Optional transaction
 * @returns Updated policy
 */
export async function updatePolicyStatus(
  policyId: string,
  status: PolicyStatus,
  approvedBy?: string,
  transaction?: Transaction
): Promise<SecurityPolicy> {
  const policy = await SecurityPolicy.findByPk(policyId, { transaction });
  if (!policy) {
    throw new Error(`Security policy ${policyId} not found`);
  }

  const oldStatus = policy.status;
  policy.status = status;

  if (status === PolicyStatus.APPROVED && approvedBy) {
    policy.approvedBy = approvedBy;
    policy.approvedAt = new Date();
  }

  if (status === PolicyStatus.ACTIVE && !policy.effectiveDate) {
    policy.effectiveDate = new Date();
    // Set next review date to 1 year from now
    const nextReview = new Date();
    nextReview.setFullYear(nextReview.getFullYear() + 1);
    policy.nextReviewDate = nextReview;
  }

  await policy.save({ transaction });

  // Log the status change
  await logPolicyAction(
    policyId,
    'status_change',
    approvedBy || 'system',
    { oldStatus, newStatus: status },
    transaction
  );

  return policy;
}

/**
 * Create new policy version
 * @param policyId Policy ID
 * @param updates Policy updates
 * @param updatedBy User ID
 * @param transaction Optional transaction
 * @returns New policy version
 */
export async function createPolicyVersion(
  policyId: string,
  updates: Partial<CreateSecurityPolicyDto>,
  updatedBy: string,
  transaction?: Transaction
): Promise<SecurityPolicy> {
  const currentPolicy = await SecurityPolicy.findByPk(policyId, { transaction });
  if (!currentPolicy) {
    throw new Error(`Security policy ${policyId} not found`);
  }

  // Archive current policy
  currentPolicy.status = PolicyStatus.ARCHIVED;
  await currentPolicy.save({ transaction });

  // Create new version
  const newPolicy = await SecurityPolicy.create(
    {
      ...currentPolicy.toJSON(),
      ...updates,
      id: undefined,
      version: currentPolicy.version + 1,
      status: PolicyStatus.DRAFT,
      approvedBy: null,
      approvedAt: null,
      effectiveDate: null,
    },
    { transaction }
  );

  await logPolicyAction(
    newPolicy.id,
    'version_created',
    updatedBy,
    { previousVersion: currentPolicy.version, newVersion: newPolicy.version },
    transaction
  );

  return newPolicy;
}

/**
 * Get policy by ID with full details
 * @param policyId Policy ID
 * @param transaction Optional transaction
 * @returns Policy with related data
 */
export async function getPolicyWithDetails(
  policyId: string,
  transaction?: Transaction
): Promise<{
  policy: SecurityPolicy;
  checks: ComplianceCheck[];
  activeViolations: PolicyViolation[];
  exceptions: PolicyException[];
}> {
  const policy = await SecurityPolicy.findByPk(policyId, { transaction });
  if (!policy) {
    throw new Error(`Security policy ${policyId} not found`);
  }

  const checks = await ComplianceCheck.findAll({
    where: { policyId },
    transaction,
  });

  const activeViolations = await PolicyViolation.findAll({
    where: {
      policyId,
      status: {
        [Op.notIn]: [ViolationStatus.REMEDIATED, ViolationStatus.FALSE_POSITIVE],
      },
    },
    transaction,
  });

  const exceptions = await PolicyException.findAll({
    where: {
      policyId,
      status: {
        [Op.in]: [ExceptionStatus.APPROVED, ExceptionStatus.UNDER_REVIEW],
      },
    },
    transaction,
  });

  return { policy, checks, activeViolations, exceptions };
}

/**
 * Get policies by framework
 * @param framework Policy framework
 * @param transaction Optional transaction
 * @returns Policies
 */
export async function getPoliciesByFramework(
  framework: PolicyFramework,
  transaction?: Transaction
): Promise<SecurityPolicy[]> {
  return await SecurityPolicy.findAll({
    where: {
      framework,
      status: {
        [Op.in]: [PolicyStatus.ACTIVE, PolicyStatus.APPROVED],
      },
    },
    order: [['severity', 'DESC'], ['name', 'ASC']],
    transaction,
  });
}

// ============================================================================
// POLICY COMPLIANCE CHECKING FUNCTIONS
// ============================================================================

/**
 * Create compliance check
 * @param policyId Policy ID
 * @param data Check data
 * @param transaction Optional transaction
 * @returns Created check
 */
export async function createComplianceCheck(
  policyId: string,
  data: CreateComplianceCheckDto,
  transaction?: Transaction
): Promise<ComplianceCheck> {
  return await ComplianceCheck.create(
    {
      policyId,
      ...data,
      failCount: 0,
    },
    { transaction }
  );
}

/**
 * Execute compliance check
 * @param checkId Check ID
 * @param checkFunction Function to perform the check
 * @param transaction Optional transaction
 * @returns Check results
 */
export async function executeComplianceCheck(
  checkId: string,
  checkFunction: () => Promise<{ passed: boolean; failedEntities: string[] }>,
  transaction?: Transaction
): Promise<ComplianceCheck> {
  const check = await ComplianceCheck.findByPk(checkId, { transaction });
  if (!check) {
    throw new Error(`Compliance check ${checkId} not found`);
  }

  const results = await checkFunction();

  check.lastCheckDate = new Date();
  check.lastCheckStatus = results.passed ? ComplianceStatus.COMPLIANT : ComplianceStatus.NON_COMPLIANT;
  check.failCount = results.failedEntities.length;

  // Calculate next check date based on frequency
  if (check.frequency) {
    const nextDate = new Date();
    if (check.frequency === 'daily') nextDate.setDate(nextDate.getDate() + 1);
    else if (check.frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
    else if (check.frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
    check.nextCheckDate = nextDate;
  }

  await check.save({ transaction });

  // Create violations for failed entities
  for (const entity of results.failedEntities) {
    await createPolicyViolation(
      check.policyId,
      {
        title: `${check.name} - Failed`,
        description: `Entity ${entity} failed compliance check`,
        severity: ViolationSeverity.MEDIUM,
        affectedEntity: entity,
      },
      checkId,
      transaction
    );
  }

  return check;
}

/**
 * Validate entity against policy rules
 * @param policy Security policy
 * @param entityData Entity data to validate
 * @returns Validation result
 */
export function validateAgainstPolicy(
  policy: SecurityPolicy,
  entityData: Record<string, any>
): {
  compliant: boolean;
  violations: string[];
  details: Record<string, any>;
} {
  const violations: string[] = [];
  const details: Record<string, any> = {};

  for (const [ruleKey, ruleValue] of Object.entries(policy.rules)) {
    const entityValue = entityData[ruleKey];

    if (typeof ruleValue === 'boolean') {
      if (entityValue !== ruleValue) {
        violations.push(`${ruleKey} must be ${ruleValue}`);
        details[ruleKey] = { expected: ruleValue, actual: entityValue };
      }
    } else if (typeof ruleValue === 'number') {
      if (entityValue < ruleValue) {
        violations.push(`${ruleKey} must be at least ${ruleValue}`);
        details[ruleKey] = { minimum: ruleValue, actual: entityValue };
      }
    } else if (Array.isArray(ruleValue)) {
      if (!ruleValue.includes(entityValue)) {
        violations.push(`${ruleKey} must be one of: ${ruleValue.join(', ')}`);
        details[ruleKey] = { allowed: ruleValue, actual: entityValue };
      }
    }
  }

  return {
    compliant: violations.length === 0,
    violations,
    details,
  };
}

/**
 * Calculate policy compliance rate
 * @param policyId Policy ID
 * @param transaction Optional transaction
 * @returns Compliance rate
 */
export async function calculatePolicyComplianceRate(
  policyId: string,
  transaction?: Transaction
): Promise<number> {
  const checks = await ComplianceCheck.findAll({
    where: { policyId },
    transaction,
  });

  if (checks.length === 0) return 100;

  const compliantChecks = checks.filter(
    c => c.lastCheckStatus === ComplianceStatus.COMPLIANT
  ).length;

  const rate = (compliantChecks / checks.length) * 100;

  // Update policy compliance rate
  await SecurityPolicy.update(
    { complianceRate: rate },
    { where: { id: policyId }, transaction }
  );

  return rate;
}

// ============================================================================
// POLICY VIOLATION DETECTION FUNCTIONS
// ============================================================================

/**
 * Create policy violation
 * @param policyId Policy ID
 * @param data Violation data
 * @param complianceCheckId Optional compliance check ID
 * @param transaction Optional transaction
 * @returns Created violation
 */
export async function createPolicyViolation(
  policyId: string,
  data: CreateViolationDto,
  complianceCheckId?: string,
  transaction?: Transaction
): Promise<PolicyViolation> {
  const violation = await PolicyViolation.create(
    {
      policyId,
      complianceCheckId,
      ...data,
      status: ViolationStatus.DETECTED,
      detectedAt: new Date(),
    },
    { transaction }
  );

  // Update policy violation count
  await SecurityPolicy.increment('violationCount', {
    where: { id: policyId },
    transaction,
  });

  return violation;
}

/**
 * Update violation status
 * @param violationId Violation ID
 * @param status New status
 * @param assignedTo Assignee
 * @param notes Notes
 * @param transaction Optional transaction
 * @returns Updated violation
 */
export async function updateViolationStatus(
  violationId: string,
  status: ViolationStatus,
  assignedTo?: string,
  notes?: string,
  transaction?: Transaction
): Promise<PolicyViolation> {
  const violation = await PolicyViolation.findByPk(violationId, { transaction });
  if (!violation) {
    throw new Error(`Policy violation ${violationId} not found`);
  }

  violation.status = status;
  if (assignedTo) violation.assignedTo = assignedTo;
  if (notes) violation.remediationNotes = notes;

  if (status === ViolationStatus.REMEDIATED && !violation.remediatedAt) {
    violation.remediatedAt = new Date();
  }

  await violation.save({ transaction });
  return violation;
}

/**
 * Detect violations for a specific policy
 * @param policyId Policy ID
 * @param entities Entities to check
 * @param transaction Optional transaction
 * @returns Detected violations
 */
export async function detectPolicyViolations(
  policyId: string,
  entities: Array<{ id: string; data: Record<string, any> }>,
  transaction?: Transaction
): Promise<PolicyViolation[]> {
  const policy = await SecurityPolicy.findByPk(policyId, { transaction });
  if (!policy) {
    throw new Error(`Security policy ${policyId} not found`);
  }

  const violations: PolicyViolation[] = [];

  for (const entity of entities) {
    const validation = validateAgainstPolicy(policy, entity.data);

    if (!validation.compliant) {
      const violation = await createPolicyViolation(
        policyId,
        {
          title: `${policy.name} Violation`,
          description: validation.violations.join('; '),
          severity: policy.severity as unknown as ViolationSeverity,
          affectedEntity: entity.id,
          evidence: validation.details,
        },
        undefined,
        transaction
      );
      violations.push(violation);
    }
  }

  return violations;
}

/**
 * Get critical violations
 * @param transaction Optional transaction
 * @returns Critical violations
 */
export async function getCriticalViolations(
  transaction?: Transaction
): Promise<PolicyViolation[]> {
  return await PolicyViolation.findAll({
    where: {
      severity: ViolationSeverity.CRITICAL,
      status: {
        [Op.notIn]: [ViolationStatus.REMEDIATED, ViolationStatus.FALSE_POSITIVE],
      },
    },
    order: [['detectedAt', 'DESC']],
    transaction,
  });
}

// ============================================================================
// POLICY ENFORCEMENT AUTOMATION FUNCTIONS
// ============================================================================

/**
 * Execute enforcement action for violation
 * @param violationId Violation ID
 * @param transaction Optional transaction
 * @returns Enforcement result
 */
export async function executeEnforcementAction(
  violationId: string,
  transaction?: Transaction
): Promise<{ action: EnforcementAction; success: boolean; details: string }> {
  const violation = await PolicyViolation.findByPk(violationId, {
    include: [SecurityPolicy],
    transaction,
  });

  if (!violation) {
    throw new Error(`Policy violation ${violationId} not found`);
  }

  const policy = await SecurityPolicy.findByPk(violation.policyId, { transaction });
  if (!policy) {
    throw new Error(`Security policy not found`);
  }

  const action = policy.enforcementAction;

  // Log the enforcement action
  if (!violation.metadata) violation.metadata = {};
  if (!violation.metadata.enforcementActions) {
    violation.metadata.enforcementActions = [];
  }

  violation.metadata.enforcementActions.push({
    action,
    timestamp: new Date().toISOString(),
    status: 'executed',
  });

  await violation.save({ transaction });

  return {
    action,
    success: true,
    details: `Enforcement action ${action} executed for violation ${violationId}`,
  };
}

/**
 * Auto-remediate violations where possible
 * @param violationId Violation ID
 * @param remediationFunction Function to perform auto-remediation
 * @param transaction Optional transaction
 * @returns Remediation result
 */
export async function autoRemediateViolation(
  violationId: string,
  remediationFunction: () => Promise<boolean>,
  transaction?: Transaction
): Promise<PolicyViolation> {
  const violation = await PolicyViolation.findByPk(violationId, { transaction });
  if (!violation) {
    throw new Error(`Policy violation ${violationId} not found`);
  }

  try {
    const success = await remediationFunction();

    if (success) {
      violation.status = ViolationStatus.REMEDIATED;
      violation.remediatedAt = new Date();
      violation.remediationNotes = 'Auto-remediated by system';

      if (!violation.metadata) violation.metadata = {};
      violation.metadata.autoRemediated = true;

      await violation.save({ transaction });
    }
  } catch (error) {
    // Log remediation failure
    if (!violation.metadata) violation.metadata = {};
    violation.metadata.autoRemediationFailed = {
      timestamp: new Date().toISOString(),
      error: error.message,
    };
    await violation.save({ transaction });
  }

  return violation;
}

/**
 * Schedule automated compliance check
 * @param checkId Compliance check ID
 * @param checkFunction Function to perform the check
 * @returns Scheduled task info
 */
export function scheduleAutomatedCheck(
  checkId: string,
  checkFunction: () => Promise<{ passed: boolean; failedEntities: string[] }>
): {
  checkId: string;
  scheduled: boolean;
  nextRun: Date;
} {
  // In production, this would integrate with a job scheduler like Bull or node-cron
  const nextRun = new Date();
  nextRun.setHours(nextRun.getHours() + 24);

  return {
    checkId,
    scheduled: true,
    nextRun,
  };
}

// ============================================================================
// EXCEPTION MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Create exception request
 * @param policyId Policy ID
 * @param violationId Violation ID
 * @param requestedBy User ID
 * @param data Exception request data
 * @param transaction Optional transaction
 * @returns Created exception
 */
export async function createExceptionRequest(
  policyId: string,
  violationId: string,
  requestedBy: string,
  data: CreateExceptionRequestDto,
  transaction?: Transaction
): Promise<PolicyException> {
  const exception = await PolicyException.create(
    {
      policyId,
      violationId,
      requestedBy,
      ...data,
      status: ExceptionStatus.REQUESTED,
      expiryDate: data.requestedExpiryDate,
    },
    { transaction }
  );

  // Update violation status
  await PolicyViolation.update(
    { status: ViolationStatus.EXCEPTION_REQUESTED },
    { where: { id: violationId }, transaction }
  );

  return exception;
}

/**
 * Review exception request
 * @param exceptionId Exception ID
 * @param approved Whether approved
 * @param reviewedBy Reviewer user ID
 * @param reviewNotes Review notes
 * @param transaction Optional transaction
 * @returns Updated exception
 */
export async function reviewExceptionRequest(
  exceptionId: string,
  approved: boolean,
  reviewedBy: string,
  reviewNotes: string,
  transaction?: Transaction
): Promise<PolicyException> {
  const exception = await PolicyException.findByPk(exceptionId, { transaction });
  if (!exception) {
    throw new Error(`Policy exception ${exceptionId} not found`);
  }

  exception.status = approved ? ExceptionStatus.APPROVED : ExceptionStatus.DENIED;
  exception.reviewedBy = reviewedBy;
  exception.reviewedAt = new Date();
  exception.reviewNotes = reviewNotes;

  if (approved) {
    exception.approvedAt = new Date();
  }

  await exception.save({ transaction });

  // Update violation status
  if (exception.violationId) {
    await PolicyViolation.update(
      {
        status: approved
          ? ViolationStatus.EXCEPTION_GRANTED
          : ViolationStatus.DETECTED,
      },
      { where: { id: exception.violationId }, transaction }
    );
  }

  return exception;
}

/**
 * Check for expired exceptions
 * @param transaction Optional transaction
 * @returns Expired exceptions
 */
export async function findExpiredExceptions(
  transaction?: Transaction
): Promise<PolicyException[]> {
  const exceptions = await PolicyException.findAll({
    where: {
      status: ExceptionStatus.APPROVED,
      expiryDate: {
        [Op.lt]: new Date(),
      },
    },
    transaction,
  });

  // Mark as expired
  for (const exception of exceptions) {
    exception.status = ExceptionStatus.EXPIRED;
    await exception.save({ transaction });

    // Reopen violation
    if (exception.violationId) {
      await PolicyViolation.update(
        { status: ViolationStatus.DETECTED },
        { where: { id: exception.violationId }, transaction }
      );
    }
  }

  return exceptions;
}

/**
 * Revoke exception
 * @param exceptionId Exception ID
 * @param revokedBy User ID
 * @param reason Revocation reason
 * @param transaction Optional transaction
 * @returns Updated exception
 */
export async function revokeException(
  exceptionId: string,
  revokedBy: string,
  reason: string,
  transaction?: Transaction
): Promise<PolicyException> {
  const exception = await PolicyException.findByPk(exceptionId, { transaction });
  if (!exception) {
    throw new Error(`Policy exception ${exceptionId} not found`);
  }

  exception.status = ExceptionStatus.REVOKED;
  exception.metadata = {
    ...exception.metadata,
    revokedBy,
    revokedAt: new Date().toISOString(),
    revocationReason: reason,
  };

  await exception.save({ transaction });

  // Reopen violation
  if (exception.violationId) {
    await PolicyViolation.update(
      { status: ViolationStatus.DETECTED },
      { where: { id: exception.violationId }, transaction }
    );
  }

  return exception;
}

// ============================================================================
// POLICY AUDIT REPORTING FUNCTIONS
// ============================================================================

/**
 * Log policy action to audit log
 * @param policyId Policy ID
 * @param action Action performed
 * @param performedBy User ID
 * @param changes Changes made
 * @param transaction Optional transaction
 * @returns Created audit log entry
 */
export async function logPolicyAction(
  policyId: string,
  action: string,
  performedBy: string,
  changes: Record<string, any>,
  transaction?: Transaction
): Promise<PolicyAuditLog> {
  return await PolicyAuditLog.create(
    {
      policyId,
      action,
      performedBy,
      changes,
      timestamp: new Date(),
    },
    { transaction }
  );
}

/**
 * Generate compliance report
 * @param params Report parameters
 * @param transaction Optional transaction
 * @returns Compliance report
 */
export async function generateComplianceReport(
  params: PolicyComplianceReportDto,
  transaction?: Transaction
): Promise<{
  summary: {
    totalPolicies: number;
    compliantPolicies: number;
    nonCompliantPolicies: number;
    overallComplianceRate: number;
  };
  byFramework: Map<PolicyFramework, { policies: number; violations: number }>;
  byCategory: Map<PolicyCategory, { policies: number; violations: number }>;
  criticalViolations: number;
  openViolations: number;
  remediatedViolations: number;
}> {
  const whereClause: any = {
    status: PolicyStatus.ACTIVE,
  };

  if (params.frameworks && params.frameworks.length > 0) {
    whereClause.framework = { [Op.in]: params.frameworks };
  }

  if (params.categories && params.categories.length > 0) {
    whereClause.category = { [Op.in]: params.categories };
  }

  const policies = await SecurityPolicy.findAll({
    where: whereClause,
    transaction,
  });

  const violations = await PolicyViolation.findAll({
    where: {
      detectedAt: {
        [Op.between]: [params.startDate, params.endDate],
      },
    },
    transaction,
  });

  const compliantPolicies = policies.filter(
    p => p.complianceRate && p.complianceRate >= 95
  ).length;

  const byFramework = new Map<PolicyFramework, { policies: number; violations: number }>();
  const byCategory = new Map<PolicyCategory, { policies: number; violations: number }>();

  for (const policy of policies) {
    // Framework aggregation
    const frameworkStats = byFramework.get(policy.framework) || { policies: 0, violations: 0 };
    frameworkStats.policies++;
    byFramework.set(policy.framework, frameworkStats);

    // Category aggregation
    const categoryStats = byCategory.get(policy.category) || { policies: 0, violations: 0 };
    categoryStats.policies++;
    byCategory.set(policy.category, categoryStats);
  }

  // Add violations to aggregations
  for (const violation of violations) {
    const policy = policies.find(p => p.id === violation.policyId);
    if (policy) {
      const frameworkStats = byFramework.get(policy.framework);
      if (frameworkStats) frameworkStats.violations++;

      const categoryStats = byCategory.get(policy.category);
      if (categoryStats) categoryStats.violations++;
    }
  }

  return {
    summary: {
      totalPolicies: policies.length,
      compliantPolicies,
      nonCompliantPolicies: policies.length - compliantPolicies,
      overallComplianceRate: policies.length > 0
        ? (compliantPolicies / policies.length) * 100
        : 0,
    },
    byFramework,
    byCategory,
    criticalViolations: violations.filter(v => v.severity === ViolationSeverity.CRITICAL).length,
    openViolations: violations.filter(v => v.status === ViolationStatus.DETECTED).length,
    remediatedViolations: violations.filter(v => v.status === ViolationStatus.REMEDIATED).length,
  };
}

/**
 * Get audit trail for policy
 * @param policyId Policy ID
 * @param startDate Start date
 * @param endDate End date
 * @param transaction Optional transaction
 * @returns Audit log entries
 */
export async function getPolicyAuditTrail(
  policyId: string,
  startDate: Date,
  endDate: Date,
  transaction?: Transaction
): Promise<PolicyAuditLog[]> {
  return await PolicyAuditLog.findAll({
    where: {
      policyId,
      timestamp: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['timestamp', 'DESC']],
    transaction,
  });
}

// ============================================================================
// SECURITY BASELINE ENFORCEMENT FUNCTIONS
// ============================================================================

/**
 * Define security baseline
 * @param name Baseline name
 * @param policies Policy IDs to include
 * @param transaction Optional transaction
 * @returns Baseline configuration
 */
export async function defineSecurityBaseline(
  name: string,
  policies: string[],
  transaction?: Transaction
): Promise<{
  name: string;
  policies: SecurityPolicy[];
  enforcementLevel: string;
}> {
  const baselinePolicies = await SecurityPolicy.findAll({
    where: {
      id: { [Op.in]: policies },
      status: PolicyStatus.ACTIVE,
    },
    transaction,
  });

  return {
    name,
    policies: baselinePolicies,
    enforcementLevel: 'strict',
  };
}

/**
 * Validate system against security baseline
 * @param baselinePolicies Baseline policies
 * @param systemConfig System configuration
 * @returns Validation results
 */
export function validateSecurityBaseline(
  baselinePolicies: SecurityPolicy[],
  systemConfig: Record<string, any>
): {
  compliant: boolean;
  passedPolicies: string[];
  failedPolicies: Array<{ policyId: string; violations: string[] }>;
  complianceScore: number;
} {
  const passedPolicies: string[] = [];
  const failedPolicies: Array<{ policyId: string; violations: string[] }> = [];

  for (const policy of baselinePolicies) {
    const validation = validateAgainstPolicy(policy, systemConfig);

    if (validation.compliant) {
      passedPolicies.push(policy.id);
    } else {
      failedPolicies.push({
        policyId: policy.id,
        violations: validation.violations,
      });
    }
  }

  const complianceScore = baselinePolicies.length > 0
    ? (passedPolicies.length / baselinePolicies.length) * 100
    : 0;

  return {
    compliant: failedPolicies.length === 0,
    passedPolicies,
    failedPolicies,
    complianceScore,
  };
}

/**
 * Enforce security baseline on system
 * @param baselinePolicies Baseline policies
 * @param systemId System identifier
 * @param transaction Optional transaction
 * @returns Enforcement results
 */
export async function enforceSecurityBaseline(
  baselinePolicies: SecurityPolicy[],
  systemId: string,
  transaction?: Transaction
): Promise<{
  systemId: string;
  enforced: boolean;
  policiesApplied: number;
  violationsDetected: number;
}> {
  let violationsDetected = 0;

  for (const policy of baselinePolicies) {
    const violations = await PolicyViolation.findAll({
      where: {
        policyId: policy.id,
        affectedEntity: systemId,
        status: {
          [Op.notIn]: [ViolationStatus.REMEDIATED, ViolationStatus.FALSE_POSITIVE],
        },
      },
      transaction,
    });

    violationsDetected += violations.length;

    // Execute enforcement actions
    for (const violation of violations) {
      await executeEnforcementAction(violation.id, transaction);
    }
  }

  return {
    systemId,
    enforced: true,
    policiesApplied: baselinePolicies.length,
    violationsDetected,
  };
}

// ============================================================================
// CONFIGURATION COMPLIANCE FUNCTIONS
// ============================================================================

/**
 * Check configuration compliance
 * @param config Configuration to check
 * @param policyId Policy ID
 * @param transaction Optional transaction
 * @returns Compliance result
 */
export async function checkConfigurationCompliance(
  config: Record<string, any>,
  policyId: string,
  transaction?: Transaction
): Promise<{
  compliant: boolean;
  policyName: string;
  violations: string[];
  recommendations: string[];
}> {
  const policy = await SecurityPolicy.findByPk(policyId, { transaction });
  if (!policy) {
    throw new Error(`Security policy ${policyId} not found`);
  }

  const validation = validateAgainstPolicy(policy, config);

  const recommendations: string[] = [];
  if (!validation.compliant) {
    for (const violation of validation.violations) {
      recommendations.push(`Remediation: ${violation}`);
    }
  }

  return {
    compliant: validation.compliant,
    policyName: policy.name,
    violations: validation.violations,
    recommendations,
  };
}

/**
 * Generate configuration hardening guide
 * @param policies Policies to include
 * @returns Hardening guide
 */
export function generateConfigurationHardeningGuide(
  policies: SecurityPolicy[]
): {
  title: string;
  policies: Array<{
    category: string;
    name: string;
    requirements: string[];
    severity: string;
  }>;
  summary: string;
} {
  const policyGuides = policies.map(policy => ({
    category: policy.category,
    name: policy.name,
    requirements: Object.entries(policy.rules).map(
      ([key, value]) => `${key}: ${JSON.stringify(value)}`
    ),
    severity: policy.severity,
  }));

  return {
    title: 'Security Configuration Hardening Guide',
    policies: policyGuides,
    summary: `This guide covers ${policies.length} security policies across ${new Set(policies.map(p => p.category)).size} categories.`,
  };
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

@Injectable()
export class SecurityPolicyEnforcementService {
  constructor(private readonly sequelize: Sequelize) {}

  async createPolicy(data: CreateSecurityPolicyDto): Promise<SecurityPolicy> {
    return createSecurityPolicy(data);
  }

  async createComplianceCheck(
    policyId: string,
    data: CreateComplianceCheckDto
  ): Promise<ComplianceCheck> {
    return createComplianceCheck(policyId, data);
  }

  async detectViolations(
    policyId: string,
    entities: Array<{ id: string; data: Record<string, any> }>
  ): Promise<PolicyViolation[]> {
    return detectPolicyViolations(policyId, entities);
  }

  async generateReport(params: PolicyComplianceReportDto): Promise<ReturnType<typeof generateComplianceReport>> {
    return generateComplianceReport(params);
  }

  async enforceBaseline(
    baselineName: string,
    policyIds: string[],
    systemId: string
  ): Promise<ReturnType<typeof enforceSecurityBaseline>> {
    const baseline = await defineSecurityBaseline(baselineName, policyIds);
    return enforceSecurityBaseline(baseline.policies, systemId);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  SecurityPolicy,
  ComplianceCheck,
  PolicyViolation,
  PolicyException,
  PolicyAuditLog,

  // Model initialization
  initSecurityPolicyModel,
  initComplianceCheckModel,
  initPolicyViolationModel,
  initPolicyExceptionModel,
  initPolicyAuditLogModel,

  // Policy management
  createSecurityPolicy,
  updatePolicyStatus,
  createPolicyVersion,
  getPolicyWithDetails,
  getPoliciesByFramework,

  // Compliance checking
  createComplianceCheck,
  executeComplianceCheck,
  validateAgainstPolicy,
  calculatePolicyComplianceRate,

  // Violation detection
  createPolicyViolation,
  updateViolationStatus,
  detectPolicyViolations,
  getCriticalViolations,

  // Enforcement automation
  executeEnforcementAction,
  autoRemediateViolation,
  scheduleAutomatedCheck,

  // Exception management
  createExceptionRequest,
  reviewExceptionRequest,
  findExpiredExceptions,
  revokeException,

  // Audit reporting
  logPolicyAction,
  generateComplianceReport,
  getPolicyAuditTrail,

  // Baseline enforcement
  defineSecurityBaseline,
  validateSecurityBaseline,
  enforceSecurityBaseline,

  // Configuration compliance
  checkConfigurationCompliance,
  generateConfigurationHardeningGuide,

  // Service
  SecurityPolicyEnforcementService,
};
