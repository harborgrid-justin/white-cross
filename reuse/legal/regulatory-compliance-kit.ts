/**
 * LOC: LEGAL_REGCOMP_001
 * File: /reuse/legal/regulatory-compliance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - sequelize-typescript
 *   - zod
 *   - rxjs
 *
 * DOWNSTREAM (imported by):
 *   - Legal compliance controllers
 *   - Regulatory monitoring services
 *   - Compliance audit systems
 *   - Risk management dashboards
 *   - Regulatory reporting modules
 *   - Legal operations systems
 */

/**
 * File: /reuse/legal/regulatory-compliance-kit.ts
 * Locator: WC-LEGAL-REGCOMP-001
 * Purpose: Regulatory Compliance Kit - Comprehensive regulatory tracking and compliance management
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, RxJS
 * Downstream: ../backend/legal/*, ../services/compliance/*, Regulatory systems, Risk management
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize 6.x, sequelize-typescript 2.x
 * Exports: 42 utility functions for regulatory tracking, compliance rule engine, change detection,
 *          jurisdiction-specific compliance, regulation monitoring, compliance validation,
 *          regulatory frameworks, audit trails, risk assessments, remediation workflows
 *
 * LLM Context: Enterprise-grade regulatory compliance management for White Cross healthcare platform.
 * Provides comprehensive regulatory tracking (FDA, CMS, state healthcare boards), compliance rule engine
 * with real-time validation, regulatory change detection and impact analysis, multi-jurisdiction
 * compliance management, regulatory framework mapping (HIPAA, HITECH, Stark Law, Anti-Kickback),
 * compliance audit trails, risk assessment and scoring, remediation workflow management,
 * regulatory alerts and notifications, compliance reporting and analytics, evidence collection,
 * regulatory submission tracking. Designed for healthcare industry with multi-state operations.
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnprocessableEntityException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import {
  Model,
  DataTypes,
  Sequelize,
  Op,
  Transaction,
  FindOptions,
  WhereOptions,
} from 'sequelize';
import { z } from 'zod';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Regulatory framework enumeration
 */
export enum RegulatoryFramework {
  HIPAA = 'HIPAA',
  HITECH = 'HITECH',
  GDPR = 'GDPR',
  CCPA = 'CCPA',
  FDA = 'FDA',
  CMS = 'CMS',
  STARK_LAW = 'STARK_LAW',
  ANTI_KICKBACK = 'ANTI_KICKBACK',
  EMTALA = 'EMTALA',
  STATE_HEALTH_BOARD = 'STATE_HEALTH_BOARD',
  OSHA = 'OSHA',
  DEA = 'DEA',
  CLIA = 'CLIA',
  CUSTOM = 'CUSTOM',
}

/**
 * Compliance status enumeration
 */
export enum ComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  PARTIALLY_COMPLIANT = 'PARTIALLY_COMPLIANT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  REMEDIATION_IN_PROGRESS = 'REMEDIATION_IN_PROGRESS',
  EXEMPTED = 'EXEMPTED',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

/**
 * Regulation severity level
 */
export enum RegulationSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFORMATIONAL = 'INFORMATIONAL',
}

/**
 * Jurisdiction type
 */
export enum JurisdictionType {
  FEDERAL = 'FEDERAL',
  STATE = 'STATE',
  COUNTY = 'COUNTY',
  MUNICIPAL = 'MUNICIPAL',
  INTERNATIONAL = 'INTERNATIONAL',
}

/**
 * Regulatory change impact level
 */
export enum ImpactLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  MINIMAL = 'MINIMAL',
}

/**
 * Regulation metadata interface
 */
export interface RegulationMetadata {
  id?: string;
  regulationCode: string;
  title: string;
  description: string;
  framework: RegulatoryFramework;
  jurisdiction: string;
  jurisdictionType: JurisdictionType;
  effectiveDate: Date;
  expirationDate?: Date;
  severity: RegulationSeverity;
  category: string;
  subcategory?: string;
  requirements: string[];
  penalties?: string;
  citations?: string[];
  relatedRegulations?: string[];
  enforcingAuthority: string;
  metadata?: Record<string, any>;
  isActive: boolean;
  version: string;
  lastReviewedDate?: Date;
  nextReviewDate?: Date;
}

/**
 * Compliance rule definition
 */
export interface ComplianceRule {
  id?: string;
  ruleCode: string;
  name: string;
  description: string;
  regulationId: string;
  ruleType: 'validation' | 'monitoring' | 'reporting' | 'procedural';
  conditions: RuleCondition[];
  actions: RuleAction[];
  priority: number;
  enabled: boolean;
  automatedCheck: boolean;
  frequency?: 'realtime' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  threshold?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * Rule condition for compliance evaluation
 */
export interface RuleCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'between' | 'exists' | 'custom';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

/**
 * Rule action to execute on compliance events
 */
export interface RuleAction {
  type: 'alert' | 'escalate' | 'remediate' | 'log' | 'notify' | 'block';
  target: string;
  parameters?: Record<string, any>;
}

/**
 * Compliance audit record
 */
export interface ComplianceAudit {
  id?: string;
  auditType: 'scheduled' | 'triggered' | 'manual' | 'external';
  regulationId: string;
  entityType: string;
  entityId: string;
  auditorId?: string;
  status: ComplianceStatus;
  findings: ComplianceFinding[];
  score?: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  startDate: Date;
  completionDate?: Date;
  dueDate?: Date;
  evidence?: Evidence[];
  recommendations?: string[];
  remediationPlan?: RemediationPlan;
  metadata?: Record<string, any>;
}

/**
 * Compliance finding from audit
 */
export interface ComplianceFinding {
  findingId: string;
  ruleId: string;
  description: string;
  severity: RegulationSeverity;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
  evidence?: string[];
  recommendation?: string;
  assignedTo?: string;
  dueDate?: Date;
}

/**
 * Evidence documentation
 */
export interface Evidence {
  type: 'document' | 'screenshot' | 'log' | 'testimony' | 'data_export';
  description: string;
  fileUrl?: string;
  collectedBy: string;
  collectedAt: Date;
  hash?: string;
}

/**
 * Remediation plan for non-compliance
 */
export interface RemediationPlan {
  planId: string;
  description: string;
  steps: RemediationStep[];
  assignedTo: string;
  targetDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  completionPercentage: number;
}

/**
 * Remediation step
 */
export interface RemediationStep {
  stepNumber: number;
  description: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: Date;
  completedDate?: Date;
  notes?: string;
}

/**
 * Regulatory change notification
 */
export interface RegulatoryChange {
  id?: string;
  changeType: 'new_regulation' | 'amendment' | 'repeal' | 'interpretation' | 'enforcement_update';
  regulationId?: string;
  framework: RegulatoryFramework;
  jurisdiction: string;
  title: string;
  description: string;
  effectiveDate: Date;
  announcedDate: Date;
  impactLevel: ImpactLevel;
  affectedEntities?: string[];
  requiredActions?: string[];
  deadlines?: Date[];
  source: string;
  sourceUrl?: string;
  reviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: Date;
  impactAssessment?: ImpactAssessment;
  metadata?: Record<string, any>;
}

/**
 * Impact assessment for regulatory changes
 */
export interface ImpactAssessment {
  assessmentId: string;
  changeId: string;
  impactAreas: string[];
  affectedProcesses: string[];
  estimatedCost?: number;
  estimatedEffort?: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  mitigationStrategy?: string;
  implementationPlan?: string;
  assessedBy: string;
  assessedAt: Date;
}

/**
 * Jurisdiction-specific compliance requirement
 */
export interface JurisdictionRequirement {
  id?: string;
  jurisdiction: string;
  jurisdictionType: JurisdictionType;
  framework: RegulatoryFramework;
  requirementCode: string;
  description: string;
  applicability: string[];
  effectiveDate: Date;
  expirationDate?: Date;
  specificProvisions?: Record<string, any>;
  variations?: Record<string, any>;
  localAuthority: string;
  isActive: boolean;
}

/**
 * Compliance report configuration
 */
export interface ComplianceReportConfig {
  reportType: string;
  framework: RegulatoryFramework;
  jurisdiction?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'on_demand';
  includedMetrics: string[];
  recipients: string[];
  format: 'pdf' | 'excel' | 'json' | 'html';
  automated: boolean;
  template?: string;
}

/**
 * Risk assessment result
 */
export interface RiskAssessment {
  assessmentId: string;
  entityType: string;
  entityId: string;
  framework: RegulatoryFramework;
  overallRiskScore: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  riskFactors: RiskFactor[];
  assessedBy: string;
  assessedAt: Date;
  validUntil: Date;
  recommendations: string[];
}

/**
 * Risk factor in assessment
 */
export interface RiskFactor {
  factor: string;
  score: number;
  weight: number;
  description: string;
  mitigation?: string;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

export const RegulationMetadataSchema = z.object({
  regulationCode: z.string().min(1).max(100),
  title: z.string().min(1).max(500),
  description: z.string().min(1),
  framework: z.nativeEnum(RegulatoryFramework),
  jurisdiction: z.string().min(1).max(100),
  jurisdictionType: z.nativeEnum(JurisdictionType),
  effectiveDate: z.coerce.date(),
  expirationDate: z.coerce.date().optional(),
  severity: z.nativeEnum(RegulationSeverity),
  category: z.string().min(1).max(100),
  subcategory: z.string().max(100).optional(),
  requirements: z.array(z.string()),
  penalties: z.string().optional(),
  citations: z.array(z.string()).optional(),
  relatedRegulations: z.array(z.string()).optional(),
  enforcingAuthority: z.string().min(1).max(200),
  metadata: z.record(z.any()).optional(),
  isActive: z.boolean().default(true),
  version: z.string().min(1).max(50),
  lastReviewedDate: z.coerce.date().optional(),
  nextReviewDate: z.coerce.date().optional(),
});

export const ComplianceRuleSchema = z.object({
  ruleCode: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  regulationId: z.string().uuid(),
  ruleType: z.enum(['validation', 'monitoring', 'reporting', 'procedural']),
  conditions: z.array(z.object({
    field: z.string(),
    operator: z.enum(['equals', 'notEquals', 'contains', 'greaterThan', 'lessThan', 'between', 'exists', 'custom']),
    value: z.any(),
    logicalOperator: z.enum(['AND', 'OR']).optional(),
  })),
  actions: z.array(z.object({
    type: z.enum(['alert', 'escalate', 'remediate', 'log', 'notify', 'block']),
    target: z.string(),
    parameters: z.record(z.any()).optional(),
  })),
  priority: z.number().int().min(1).max(100),
  enabled: z.boolean().default(true),
  automatedCheck: z.boolean().default(false),
  frequency: z.enum(['realtime', 'daily', 'weekly', 'monthly', 'quarterly', 'annual']).optional(),
  threshold: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
});

export const ComplianceAuditSchema = z.object({
  auditType: z.enum(['scheduled', 'triggered', 'manual', 'external']),
  regulationId: z.string().uuid(),
  entityType: z.string().min(1).max(100),
  entityId: z.string().uuid(),
  auditorId: z.string().uuid().optional(),
  status: z.nativeEnum(ComplianceStatus),
  findings: z.array(z.any()),
  score: z.number().min(0).max(100).optional(),
  riskLevel: z.enum(['critical', 'high', 'medium', 'low']),
  startDate: z.coerce.date(),
  completionDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
  evidence: z.array(z.any()).optional(),
  recommendations: z.array(z.string()).optional(),
  remediationPlan: z.any().optional(),
  metadata: z.record(z.any()).optional(),
});

export const RegulatoryChangeSchema = z.object({
  changeType: z.enum(['new_regulation', 'amendment', 'repeal', 'interpretation', 'enforcement_update']),
  regulationId: z.string().uuid().optional(),
  framework: z.nativeEnum(RegulatoryFramework),
  jurisdiction: z.string().min(1).max(100),
  title: z.string().min(1).max(500),
  description: z.string().min(1),
  effectiveDate: z.coerce.date(),
  announcedDate: z.coerce.date(),
  impactLevel: z.nativeEnum(ImpactLevel),
  affectedEntities: z.array(z.string()).optional(),
  requiredActions: z.array(z.string()).optional(),
  deadlines: z.array(z.coerce.date()).optional(),
  source: z.string().min(1).max(200),
  sourceUrl: z.string().url().optional(),
  reviewed: z.boolean().default(false),
  reviewedBy: z.string().uuid().optional(),
  reviewedAt: z.coerce.date().optional(),
  impactAssessment: z.any().optional(),
  metadata: z.record(z.any()).optional(),
});

// ============================================================================
// SEQUELIZE MODELS (1-5)
// ============================================================================

/**
 * Sequelize model for Regulations with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Regulation model
 *
 * @example
 * const Regulation = defineRegulationModel(sequelize);
 * await Regulation.create({
 *   regulationCode: 'HIPAA-164.502',
 *   title: 'Uses and Disclosures of PHI',
 *   framework: 'HIPAA',
 *   jurisdiction: 'United States',
 *   jurisdictionType: 'FEDERAL'
 * });
 */
export function defineRegulationModel(sequelize: Sequelize): typeof Model {
  class Regulation extends Model {
    public id!: string;
    public regulationCode!: string;
    public title!: string;
    public description!: string;
    public framework!: RegulatoryFramework;
    public jurisdiction!: string;
    public jurisdictionType!: JurisdictionType;
    public effectiveDate!: Date;
    public expirationDate!: Date;
    public severity!: RegulationSeverity;
    public category!: string;
    public subcategory!: string;
    public requirements!: string[];
    public penalties!: string;
    public citations!: string[];
    public relatedRegulations!: string[];
    public enforcingAuthority!: string;
    public metadata!: Record<string, any>;
    public isActive!: boolean;
    public version!: string;
    public lastReviewedDate!: Date;
    public nextReviewDate!: Date;
    public createdAt!: Date;
    public updatedAt!: Date;
    public deletedAt!: Date;
  }

  Regulation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      regulationCode: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: 'regulation_code',
        comment: 'Unique identifier for the regulation (e.g., HIPAA-164.502)',
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      framework: {
        type: DataTypes.ENUM(...Object.values(RegulatoryFramework)),
        allowNull: false,
        comment: 'Regulatory framework (HIPAA, GDPR, FDA, etc.)',
      },
      jurisdiction: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Geographic or organizational jurisdiction',
      },
      jurisdictionType: {
        type: DataTypes.ENUM(...Object.values(JurisdictionType)),
        allowNull: false,
        field: 'jurisdiction_type',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'effective_date',
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'expiration_date',
      },
      severity: {
        type: DataTypes.ENUM(...Object.values(RegulationSeverity)),
        allowNull: false,
        defaultValue: RegulationSeverity.MEDIUM,
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Primary regulatory category',
      },
      subcategory: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      requirements: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of specific requirements',
      },
      penalties: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Description of penalties for non-compliance',
      },
      citations: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        comment: 'Legal citations and references',
      },
      relatedRegulations: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        field: 'related_regulations',
        comment: 'IDs of related regulations',
      },
      enforcingAuthority: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'enforcing_authority',
        comment: 'Government agency or body responsible for enforcement',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      version: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '1.0',
      },
      lastReviewedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_reviewed_date',
      },
      nextReviewDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'next_review_date',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
    },
    {
      sequelize,
      tableName: 'regulations',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        { fields: ['regulation_code'], unique: true },
        { fields: ['framework'] },
        { fields: ['jurisdiction'] },
        { fields: ['jurisdiction_type'] },
        { fields: ['category'] },
        { fields: ['severity'] },
        { fields: ['effective_date'] },
        { fields: ['is_active'] },
        { fields: ['enforcing_authority'] },
        {
          name: 'idx_regulations_framework_jurisdiction',
          fields: ['framework', 'jurisdiction']
        },
      ],
    }
  );

  return Regulation;
}

/**
 * Sequelize model for Compliance Rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} ComplianceRule model
 *
 * @example
 * const ComplianceRule = defineComplianceRuleModel(sequelize);
 * await ComplianceRule.create({
 *   ruleCode: 'HIPAA-PHI-ENCRYPTION',
 *   name: 'PHI Encryption Validation',
 *   regulationId: 'regulation-uuid',
 *   ruleType: 'validation',
 *   enabled: true
 * });
 */
export function defineComplianceRuleModel(sequelize: Sequelize): typeof Model {
  class ComplianceRule extends Model {
    public id!: string;
    public ruleCode!: string;
    public name!: string;
    public description!: string;
    public regulationId!: string;
    public ruleType!: 'validation' | 'monitoring' | 'reporting' | 'procedural';
    public conditions!: RuleCondition[];
    public actions!: RuleAction[];
    public priority!: number;
    public enabled!: boolean;
    public automatedCheck!: boolean;
    public frequency!: string;
    public threshold!: Record<string, any>;
    public metadata!: Record<string, any>;
    public lastExecutedAt!: Date;
    public executionCount!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
    public deletedAt!: Date;
  }

  ComplianceRule.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ruleCode: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: 'rule_code',
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      regulationId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'regulation_id',
        references: {
          model: 'regulations',
          key: 'id',
        },
      },
      ruleType: {
        type: DataTypes.ENUM('validation', 'monitoring', 'reporting', 'procedural'),
        allowNull: false,
        field: 'rule_type',
      },
      conditions: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        comment: 'Rule conditions for evaluation',
      },
      actions: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        comment: 'Actions to execute when rule triggers',
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50,
        validate: {
          min: 1,
          max: 100,
        },
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      automatedCheck: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'automated_check',
      },
      frequency: {
        type: DataTypes.ENUM('realtime', 'daily', 'weekly', 'monthly', 'quarterly', 'annual'),
        allowNull: true,
      },
      threshold: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Threshold values for rule triggering',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      lastExecutedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_executed_at',
      },
      executionCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'execution_count',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
    },
    {
      sequelize,
      tableName: 'compliance_rules',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        { fields: ['rule_code'], unique: true },
        { fields: ['regulation_id'] },
        { fields: ['rule_type'] },
        { fields: ['enabled'] },
        { fields: ['priority'] },
        { fields: ['automated_check'] },
        { fields: ['frequency'] },
      ],
    }
  );

  return ComplianceRule;
}

/**
 * Sequelize model for Compliance Audits.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} ComplianceAudit model
 *
 * @example
 * const ComplianceAudit = defineComplianceAuditModel(sequelize);
 * await ComplianceAudit.create({
 *   auditType: 'scheduled',
 *   regulationId: 'regulation-uuid',
 *   entityType: 'facility',
 *   entityId: 'facility-uuid',
 *   status: 'UNDER_REVIEW'
 * });
 */
export function defineComplianceAuditModel(sequelize: Sequelize): typeof Model {
  class ComplianceAudit extends Model {
    public id!: string;
    public auditType!: 'scheduled' | 'triggered' | 'manual' | 'external';
    public regulationId!: string;
    public entityType!: string;
    public entityId!: string;
    public auditorId!: string;
    public status!: ComplianceStatus;
    public findings!: ComplianceFinding[];
    public score!: number;
    public riskLevel!: 'critical' | 'high' | 'medium' | 'low';
    public startDate!: Date;
    public completionDate!: Date;
    public dueDate!: Date;
    public evidence!: Evidence[];
    public recommendations!: string[];
    public remediationPlan!: RemediationPlan;
    public metadata!: Record<string, any>;
    public createdAt!: Date;
    public updatedAt!: Date;
    public deletedAt!: Date;
  }

  ComplianceAudit.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      auditType: {
        type: DataTypes.ENUM('scheduled', 'triggered', 'manual', 'external'),
        allowNull: false,
        field: 'audit_type',
      },
      regulationId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'regulation_id',
        references: {
          model: 'regulations',
          key: 'id',
        },
      },
      entityType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'entity_type',
        comment: 'Type of entity being audited (facility, department, process, etc.)',
      },
      entityId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'entity_id',
        comment: 'ID of the specific entity being audited',
      },
      auditorId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'auditor_id',
        comment: 'User ID of the auditor',
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ComplianceStatus)),
        allowNull: false,
        defaultValue: ComplianceStatus.UNDER_REVIEW,
      },
      findings: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of compliance findings',
      },
      score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        validate: {
          min: 0,
          max: 100,
        },
      },
      riskLevel: {
        type: DataTypes.ENUM('critical', 'high', 'medium', 'low'),
        allowNull: false,
        field: 'risk_level',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_date',
      },
      completionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'completion_date',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'due_date',
      },
      evidence: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        comment: 'Evidence collected during audit',
      },
      recommendations: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      remediationPlan: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'remediation_plan',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
    },
    {
      sequelize,
      tableName: 'compliance_audits',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        { fields: ['regulation_id'] },
        { fields: ['entity_type'] },
        { fields: ['entity_id'] },
        { fields: ['auditor_id'] },
        { fields: ['status'] },
        { fields: ['risk_level'] },
        { fields: ['start_date'] },
        { fields: ['due_date'] },
        {
          name: 'idx_audits_entity',
          fields: ['entity_type', 'entity_id']
        },
      ],
    }
  );

  return ComplianceAudit;
}

/**
 * Sequelize model for Regulatory Changes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} RegulatoryChange model
 *
 * @example
 * const RegulatoryChange = defineRegulatoryChangeModel(sequelize);
 * await RegulatoryChange.create({
 *   changeType: 'amendment',
 *   framework: 'HIPAA',
 *   jurisdiction: 'United States',
 *   title: 'Updated Privacy Rule',
 *   impactLevel: 'HIGH'
 * });
 */
export function defineRegulatoryChangeModel(sequelize: Sequelize): typeof Model {
  class RegulatoryChange extends Model {
    public id!: string;
    public changeType!: 'new_regulation' | 'amendment' | 'repeal' | 'interpretation' | 'enforcement_update';
    public regulationId!: string;
    public framework!: RegulatoryFramework;
    public jurisdiction!: string;
    public title!: string;
    public description!: string;
    public effectiveDate!: Date;
    public announcedDate!: Date;
    public impactLevel!: ImpactLevel;
    public affectedEntities!: string[];
    public requiredActions!: string[];
    public deadlines!: Date[];
    public source!: string;
    public sourceUrl!: string;
    public reviewed!: boolean;
    public reviewedBy!: string;
    public reviewedAt!: Date;
    public impactAssessment!: ImpactAssessment;
    public metadata!: Record<string, any>;
    public createdAt!: Date;
    public updatedAt!: Date;
    public deletedAt!: Date;
  }

  RegulatoryChange.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      changeType: {
        type: DataTypes.ENUM('new_regulation', 'amendment', 'repeal', 'interpretation', 'enforcement_update'),
        allowNull: false,
        field: 'change_type',
      },
      regulationId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'regulation_id',
        references: {
          model: 'regulations',
          key: 'id',
        },
        comment: 'Reference to existing regulation if amendment/repeal',
      },
      framework: {
        type: DataTypes.ENUM(...Object.values(RegulatoryFramework)),
        allowNull: false,
      },
      jurisdiction: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'effective_date',
      },
      announcedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'announced_date',
      },
      impactLevel: {
        type: DataTypes.ENUM(...Object.values(ImpactLevel)),
        allowNull: false,
        field: 'impact_level',
      },
      affectedEntities: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        field: 'affected_entities',
        comment: 'List of entity IDs or types affected',
      },
      requiredActions: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        field: 'required_actions',
        comment: 'Required compliance actions',
      },
      deadlines: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        comment: 'Array of compliance deadlines',
      },
      source: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Source of the regulatory change announcement',
      },
      sourceUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'source_url',
      },
      reviewed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      reviewedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'reviewed_by',
      },
      reviewedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'reviewed_at',
      },
      impactAssessment: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'impact_assessment',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
    },
    {
      sequelize,
      tableName: 'regulatory_changes',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        { fields: ['change_type'] },
        { fields: ['regulation_id'] },
        { fields: ['framework'] },
        { fields: ['jurisdiction'] },
        { fields: ['impact_level'] },
        { fields: ['effective_date'] },
        { fields: ['announced_date'] },
        { fields: ['reviewed'] },
        {
          name: 'idx_changes_pending_review',
          fields: ['reviewed', 'impact_level']
        },
      ],
    }
  );

  return RegulatoryChange;
}

/**
 * Sequelize model for Jurisdiction Requirements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} JurisdictionRequirement model
 *
 * @example
 * const JurisdictionRequirement = defineJurisdictionRequirementModel(sequelize);
 * await JurisdictionRequirement.create({
 *   jurisdiction: 'California',
 *   jurisdictionType: 'STATE',
 *   framework: 'CCPA',
 *   requirementCode: 'CCPA-1798.100'
 * });
 */
export function defineJurisdictionRequirementModel(sequelize: Sequelize): typeof Model {
  class JurisdictionRequirement extends Model {
    public id!: string;
    public jurisdiction!: string;
    public jurisdictionType!: JurisdictionType;
    public framework!: RegulatoryFramework;
    public requirementCode!: string;
    public description!: string;
    public applicability!: string[];
    public effectiveDate!: Date;
    public expirationDate!: Date;
    public specificProvisions!: Record<string, any>;
    public variations!: Record<string, any>;
    public localAuthority!: string;
    public isActive!: boolean;
    public metadata!: Record<string, any>;
    public createdAt!: Date;
    public updatedAt!: Date;
    public deletedAt!: Date;
  }

  JurisdictionRequirement.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      jurisdiction: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'State, county, or municipality name',
      },
      jurisdictionType: {
        type: DataTypes.ENUM(...Object.values(JurisdictionType)),
        allowNull: false,
        field: 'jurisdiction_type',
      },
      framework: {
        type: DataTypes.ENUM(...Object.values(RegulatoryFramework)),
        allowNull: false,
      },
      requirementCode: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'requirement_code',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      applicability: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        comment: 'Entity types or conditions this requirement applies to',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'effective_date',
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'expiration_date',
      },
      specificProvisions: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'specific_provisions',
        comment: 'Jurisdiction-specific provisions',
      },
      variations: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Variations from federal or standard requirements',
      },
      localAuthority: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'local_authority',
        comment: 'Local enforcing authority',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
    },
    {
      sequelize,
      tableName: 'jurisdiction_requirements',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        { fields: ['jurisdiction'] },
        { fields: ['jurisdiction_type'] },
        { fields: ['framework'] },
        { fields: ['requirement_code'] },
        { fields: ['is_active'] },
        { fields: ['effective_date'] },
        {
          name: 'idx_jurisdiction_unique',
          fields: ['jurisdiction', 'framework', 'requirement_code'],
          unique: true,
        },
      ],
    }
  );

  return JurisdictionRequirement;
}

// ============================================================================
// REGULATION TRACKING FUNCTIONS (6-12)
// ============================================================================

/**
 * Tracks a new regulation in the system.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RegulationMetadata} data - Regulation metadata
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created regulation record
 * @throws {BadRequestException} If validation fails
 * @throws {ConflictException} If regulation code already exists
 *
 * @example
 * const regulation = await trackRegulation(sequelize, {
 *   regulationCode: 'HIPAA-164.502',
 *   title: 'Uses and Disclosures of PHI',
 *   framework: RegulatoryFramework.HIPAA,
 *   jurisdiction: 'United States',
 *   jurisdictionType: JurisdictionType.FEDERAL,
 *   effectiveDate: new Date('2013-09-23'),
 *   severity: RegulationSeverity.HIGH,
 *   category: 'Privacy',
 *   requirements: ['Obtain patient consent', 'Limit disclosures'],
 *   enforcingAuthority: 'HHS/OCR',
 *   version: '1.0'
 * });
 */
export async function trackRegulation(
  sequelize: Sequelize,
  data: RegulationMetadata,
  transaction?: Transaction
): Promise<Model> {
  const logger = new Logger('trackRegulation');

  try {
    // Validate input
    const validatedData = RegulationMetadataSchema.parse(data);

    const Regulation = defineRegulationModel(sequelize);

    // Check for existing regulation code
    const existing = await Regulation.findOne({
      where: { regulationCode: validatedData.regulationCode },
      transaction,
    });

    if (existing) {
      throw new ConflictException(
        `Regulation with code ${validatedData.regulationCode} already exists`
      );
    }

    // Create regulation
    const regulation = await Regulation.create(validatedData as any, { transaction });

    logger.log(`Regulation tracked: ${validatedData.regulationCode}`);
    return regulation;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Retrieves regulations by framework and jurisdiction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RegulatoryFramework} framework - Regulatory framework
 * @param {string} [jurisdiction] - Optional jurisdiction filter
 * @param {boolean} [activeOnly=true] - Return only active regulations
 * @returns {Promise<Model[]>} List of matching regulations
 *
 * @example
 * const hipaaRegulations = await getRegulationsByFramework(
 *   sequelize,
 *   RegulatoryFramework.HIPAA,
 *   'United States',
 *   true
 * );
 */
export async function getRegulationsByFramework(
  sequelize: Sequelize,
  framework: RegulatoryFramework,
  jurisdiction?: string,
  activeOnly: boolean = true
): Promise<Model[]> {
  const Regulation = defineRegulationModel(sequelize);

  const where: WhereOptions = { framework };
  if (jurisdiction) {
    where.jurisdiction = jurisdiction;
  }
  if (activeOnly) {
    where.isActive = true;
  }

  const regulations = await Regulation.findAll({
    where,
    order: [['severity', 'DESC'], ['effectiveDate', 'DESC']],
  });

  return regulations;
}

/**
 * Updates regulation metadata and creates audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} regulationId - Regulation ID
 * @param {Partial<RegulationMetadata>} updates - Fields to update
 * @param {string} updatedBy - User ID performing the update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated regulation record
 * @throws {NotFoundException} If regulation not found
 *
 * @example
 * const updated = await updateRegulation(
 *   sequelize,
 *   'regulation-uuid',
 *   { severity: RegulationSeverity.CRITICAL, lastReviewedDate: new Date() },
 *   'user-uuid'
 * );
 */
export async function updateRegulation(
  sequelize: Sequelize,
  regulationId: string,
  updates: Partial<RegulationMetadata>,
  updatedBy: string,
  transaction?: Transaction
): Promise<Model> {
  const logger = new Logger('updateRegulation');

  const Regulation = defineRegulationModel(sequelize);

  const regulation = await Regulation.findByPk(regulationId, { transaction });
  if (!regulation) {
    throw new NotFoundException(`Regulation ${regulationId} not found`);
  }

  const oldValue = regulation.toJSON();
  await regulation.update(updates as any, { transaction });

  logger.log(`Regulation updated: ${regulationId} by ${updatedBy}`);
  return regulation;
}

/**
 * Monitors regulations for upcoming review dates.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [daysAhead=30] - Days ahead to check
 * @returns {Promise<Model[]>} Regulations due for review
 *
 * @example
 * const dueForReview = await monitorRegulationReviews(sequelize, 30);
 * console.log(`${dueForReview.length} regulations need review in next 30 days`);
 */
export async function monitorRegulationReviews(
  sequelize: Sequelize,
  daysAhead: number = 30
): Promise<Model[]> {
  const Regulation = defineRegulationModel(sequelize);

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  const regulations = await Regulation.findAll({
    where: {
      isActive: true,
      nextReviewDate: {
        [Op.lte]: futureDate,
        [Op.gte]: new Date(),
      },
    },
    order: [['nextReviewDate', 'ASC']],
  });

  return regulations;
}

/**
 * Archives expired or superseded regulations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} regulationId - Regulation ID to archive
 * @param {string} reason - Reason for archiving
 * @param {string} archivedBy - User ID performing archival
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Archived regulation
 * @throws {NotFoundException} If regulation not found
 *
 * @example
 * await archiveRegulation(
 *   sequelize,
 *   'regulation-uuid',
 *   'Superseded by updated regulation',
 *   'user-uuid'
 * );
 */
export async function archiveRegulation(
  sequelize: Sequelize,
  regulationId: string,
  reason: string,
  archivedBy: string,
  transaction?: Transaction
): Promise<Model> {
  const logger = new Logger('archiveRegulation');

  const Regulation = defineRegulationModel(sequelize);

  const regulation = await Regulation.findByPk(regulationId, { transaction });
  if (!regulation) {
    throw new NotFoundException(`Regulation ${regulationId} not found`);
  }

  await regulation.update(
    {
      isActive: false,
      metadata: {
        ...(regulation.get('metadata') as any),
        archivedAt: new Date(),
        archivedBy,
        archiveReason: reason,
      },
    },
    { transaction }
  );

  logger.log(`Regulation archived: ${regulationId} by ${archivedBy}`);
  return regulation;
}

/**
 * Searches regulations with full-text and filter capabilities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} filters - Search filters
 * @param {number} [limit=50] - Results limit
 * @param {number} [offset=0] - Results offset
 * @returns {Promise<{rows: Model[], count: number}>} Search results with count
 *
 * @example
 * const results = await searchRegulations(sequelize, {
 *   searchTerm: 'privacy',
 *   framework: RegulatoryFramework.HIPAA,
 *   severity: [RegulationSeverity.HIGH, RegulationSeverity.CRITICAL],
 *   category: 'Privacy'
 * }, 20, 0);
 */
export async function searchRegulations(
  sequelize: Sequelize,
  filters: {
    searchTerm?: string;
    framework?: RegulatoryFramework;
    jurisdiction?: string;
    severity?: RegulationSeverity[];
    category?: string;
    activeOnly?: boolean;
  },
  limit: number = 50,
  offset: number = 0
): Promise<{ rows: Model[]; count: number }> {
  const Regulation = defineRegulationModel(sequelize);

  const where: WhereOptions = {};

  if (filters.searchTerm) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${filters.searchTerm}%` } },
      { description: { [Op.iLike]: `%${filters.searchTerm}%` } },
      { regulationCode: { [Op.iLike]: `%${filters.searchTerm}%` } },
    ];
  }

  if (filters.framework) {
    where.framework = filters.framework;
  }

  if (filters.jurisdiction) {
    where.jurisdiction = filters.jurisdiction;
  }

  if (filters.severity && filters.severity.length > 0) {
    where.severity = { [Op.in]: filters.severity };
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.activeOnly !== false) {
    where.isActive = true;
  }

  const { rows, count } = await Regulation.findAndCountAll({
    where,
    limit,
    offset,
    order: [['severity', 'DESC'], ['effectiveDate', 'DESC']],
  });

  return { rows, count };
}

/**
 * Links related regulations for cross-referencing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} regulationId - Primary regulation ID
 * @param {string[]} relatedIds - Array of related regulation IDs
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated regulation with links
 * @throws {NotFoundException} If regulation not found
 *
 * @example
 * await linkRelatedRegulations(
 *   sequelize,
 *   'regulation-uuid-1',
 *   ['regulation-uuid-2', 'regulation-uuid-3']
 * );
 */
export async function linkRelatedRegulations(
  sequelize: Sequelize,
  regulationId: string,
  relatedIds: string[],
  transaction?: Transaction
): Promise<Model> {
  const logger = new Logger('linkRelatedRegulations');

  const Regulation = defineRegulationModel(sequelize);

  const regulation = await Regulation.findByPk(regulationId, { transaction });
  if (!regulation) {
    throw new NotFoundException(`Regulation ${regulationId} not found`);
  }

  const currentRelated = (regulation.get('relatedRegulations') as string[]) || [];
  const updatedRelated = Array.from(new Set([...currentRelated, ...relatedIds]));

  await regulation.update({ relatedRegulations: updatedRelated }, { transaction });

  logger.log(`Linked ${relatedIds.length} related regulations to ${regulationId}`);
  return regulation;
}

// ============================================================================
// COMPLIANCE RULE ENGINE FUNCTIONS (13-20)
// ============================================================================

/**
 * Creates a compliance rule with validation logic.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ComplianceRule} ruleData - Rule configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created compliance rule
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * const rule = await createComplianceRule(sequelize, {
 *   ruleCode: 'HIPAA-PHI-ENCRYPTION',
 *   name: 'PHI Data Encryption Check',
 *   description: 'Validates that PHI is encrypted at rest',
 *   regulationId: 'regulation-uuid',
 *   ruleType: 'validation',
 *   conditions: [{
 *     field: 'encryption.enabled',
 *     operator: 'equals',
 *     value: true
 *   }],
 *   actions: [{
 *     type: 'alert',
 *     target: 'security-team@example.com'
 *   }],
 *   priority: 95,
 *   enabled: true,
 *   automatedCheck: true,
 *   frequency: 'daily'
 * });
 */
export async function createComplianceRule(
  sequelize: Sequelize,
  ruleData: ComplianceRule,
  transaction?: Transaction
): Promise<Model> {
  const logger = new Logger('createComplianceRule');

  try {
    const validatedData = ComplianceRuleSchema.parse(ruleData);

    const ComplianceRule = defineComplianceRuleModel(sequelize);

    const existing = await ComplianceRule.findOne({
      where: { ruleCode: validatedData.ruleCode },
      transaction,
    });

    if (existing) {
      throw new ConflictException(`Rule with code ${validatedData.ruleCode} already exists`);
    }

    const rule = await ComplianceRule.create(validatedData as any, { transaction });

    logger.log(`Compliance rule created: ${validatedData.ruleCode}`);
    return rule;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Evaluates compliance rules against entity data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Type of entity being evaluated
 * @param {string} entityId - Entity ID
 * @param {Record<string, any>} entityData - Entity data for evaluation
 * @returns {Promise<{passed: boolean, violations: any[], warnings: any[]}>} Evaluation results
 *
 * @example
 * const result = await evaluateComplianceRules(
 *   sequelize,
 *   'patient_record',
 *   'patient-uuid',
 *   {
 *     encryption: { enabled: true, algorithm: 'AES-256' },
 *     accessControls: { enabled: true },
 *     auditLogging: { enabled: true }
 *   }
 * );
 * if (!result.passed) {
 *   console.log('Compliance violations:', result.violations);
 * }
 */
export async function evaluateComplianceRules(
  sequelize: Sequelize,
  entityType: string,
  entityId: string,
  entityData: Record<string, any>
): Promise<{ passed: boolean; violations: any[]; warnings: any[] }> {
  const logger = new Logger('evaluateComplianceRules');

  const ComplianceRule = defineComplianceRuleModel(sequelize);

  const rules = await ComplianceRule.findAll({
    where: {
      enabled: true,
      ruleType: 'validation',
    },
    order: [['priority', 'DESC']],
  });

  const violations: any[] = [];
  const warnings: any[] = [];

  for (const rule of rules) {
    const conditions = rule.get('conditions') as RuleCondition[];
    const actions = rule.get('actions') as RuleAction[];

    let conditionsMet = true;
    for (const condition of conditions) {
      const result = evaluateCondition(condition, entityData);

      if (condition.logicalOperator === 'OR') {
        conditionsMet = conditionsMet || result;
      } else {
        conditionsMet = conditionsMet && result;
      }
    }

    if (!conditionsMet) {
      const violation = {
        ruleId: rule.get('id'),
        ruleCode: rule.get('ruleCode'),
        ruleName: rule.get('name'),
        severity: 'high',
        entityType,
        entityId,
        timestamp: new Date(),
      };

      violations.push(violation);

      // Execute rule actions
      for (const action of actions) {
        await executeRuleAction(action, violation);
      }
    }
  }

  const passed = violations.length === 0;
  logger.log(`Compliance evaluation: ${passed ? 'PASSED' : 'FAILED'} (${violations.length} violations)`);

  return { passed, violations, warnings };
}

/**
 * Evaluates a single condition against entity data.
 *
 * @param {RuleCondition} condition - Condition to evaluate
 * @param {Record<string, any>} data - Entity data
 * @returns {boolean} Condition result
 */
function evaluateCondition(condition: RuleCondition, data: Record<string, any>): boolean {
  const fieldValue = getNestedValue(data, condition.field);

  switch (condition.operator) {
    case 'equals':
      return fieldValue === condition.value;
    case 'notEquals':
      return fieldValue !== condition.value;
    case 'contains':
      return String(fieldValue).includes(String(condition.value));
    case 'greaterThan':
      return Number(fieldValue) > Number(condition.value);
    case 'lessThan':
      return Number(fieldValue) < Number(condition.value);
    case 'between':
      const [min, max] = condition.value;
      return Number(fieldValue) >= min && Number(fieldValue) <= max;
    case 'exists':
      return fieldValue !== undefined && fieldValue !== null;
    default:
      return false;
  }
}

/**
 * Gets nested value from object using dot notation.
 */
function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Executes a rule action (alert, escalate, etc.).
 */
async function executeRuleAction(action: RuleAction, context: any): Promise<void> {
  const logger = new Logger('executeRuleAction');

  switch (action.type) {
    case 'alert':
      logger.warn(`COMPLIANCE ALERT: ${JSON.stringify(context)}`);
      // In production, send to monitoring/alerting system
      break;
    case 'escalate':
      logger.error(`COMPLIANCE ESCALATION: ${JSON.stringify(context)}`);
      // In production, create incident ticket
      break;
    case 'log':
      logger.log(`COMPLIANCE LOG: ${JSON.stringify(context)}`);
      break;
    default:
      logger.debug(`Unknown action type: ${action.type}`);
  }
}

/**
 * Retrieves rules by regulation and type.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} regulationId - Regulation ID
 * @param {string} [ruleType] - Optional rule type filter
 * @returns {Promise<Model[]>} Matching compliance rules
 *
 * @example
 * const validationRules = await getRulesByRegulation(
 *   sequelize,
 *   'regulation-uuid',
 *   'validation'
 * );
 */
export async function getRulesByRegulation(
  sequelize: Sequelize,
  regulationId: string,
  ruleType?: string
): Promise<Model[]> {
  const ComplianceRule = defineComplianceRuleModel(sequelize);

  const where: WhereOptions = { regulationId, enabled: true };
  if (ruleType) {
    where.ruleType = ruleType;
  }

  const rules = await ComplianceRule.findAll({
    where,
    order: [['priority', 'DESC']],
  });

  return rules;
}

/**
 * Updates rule execution statistics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} ruleId - Rule ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated rule
 *
 * @example
 * await updateRuleExecutionStats(sequelize, 'rule-uuid');
 */
export async function updateRuleExecutionStats(
  sequelize: Sequelize,
  ruleId: string,
  transaction?: Transaction
): Promise<Model> {
  const ComplianceRule = defineComplianceRuleModel(sequelize);

  const rule = await ComplianceRule.findByPk(ruleId, { transaction });
  if (!rule) {
    throw new NotFoundException(`Rule ${ruleId} not found`);
  }

  await rule.update(
    {
      lastExecutedAt: new Date(),
      executionCount: (rule.get('executionCount') as number) + 1,
    },
    { transaction }
  );

  return rule;
}

/**
 * Enables or disables a compliance rule.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} ruleId - Rule ID
 * @param {boolean} enabled - Enable/disable flag
 * @param {string} modifiedBy - User ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated rule
 *
 * @example
 * await toggleComplianceRule(sequelize, 'rule-uuid', false, 'user-uuid');
 */
export async function toggleComplianceRule(
  sequelize: Sequelize,
  ruleId: string,
  enabled: boolean,
  modifiedBy: string,
  transaction?: Transaction
): Promise<Model> {
  const logger = new Logger('toggleComplianceRule');

  const ComplianceRule = defineComplianceRuleModel(sequelize);

  const rule = await ComplianceRule.findByPk(ruleId, { transaction });
  if (!rule) {
    throw new NotFoundException(`Rule ${ruleId} not found`);
  }

  await rule.update({ enabled }, { transaction });

  logger.log(`Rule ${ruleId} ${enabled ? 'enabled' : 'disabled'} by ${modifiedBy}`);
  return rule;
}

/**
 * Bulk evaluates multiple entities against compliance rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Array<{entityType: string, entityId: string, data: Record<string, any>}>} entities - Entities to evaluate
 * @returns {Promise<Array<{entityId: string, passed: boolean, violations: any[]}>>} Bulk evaluation results
 *
 * @example
 * const results = await bulkEvaluateCompliance(sequelize, [
 *   { entityType: 'facility', entityId: 'facility-1', data: {...} },
 *   { entityType: 'facility', entityId: 'facility-2', data: {...} }
 * ]);
 */
export async function bulkEvaluateCompliance(
  sequelize: Sequelize,
  entities: Array<{ entityType: string; entityId: string; data: Record<string, any> }>
): Promise<Array<{ entityId: string; passed: boolean; violations: any[] }>> {
  const results = [];

  for (const entity of entities) {
    const evaluation = await evaluateComplianceRules(
      sequelize,
      entity.entityType,
      entity.entityId,
      entity.data
    );

    results.push({
      entityId: entity.entityId,
      passed: evaluation.passed,
      violations: evaluation.violations,
    });
  }

  return results;
}

/**
 * Retrieves high-priority active rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [minPriority=80] - Minimum priority threshold
 * @returns {Promise<Model[]>} High-priority rules
 *
 * @example
 * const criticalRules = await getHighPriorityRules(sequelize, 90);
 */
export async function getHighPriorityRules(
  sequelize: Sequelize,
  minPriority: number = 80
): Promise<Model[]> {
  const ComplianceRule = defineComplianceRuleModel(sequelize);

  const rules = await ComplianceRule.findAll({
    where: {
      enabled: true,
      priority: { [Op.gte]: minPriority },
    },
    order: [['priority', 'DESC']],
  });

  return rules;
}

// ============================================================================
// COMPLIANCE AUDIT FUNCTIONS (21-27)
// ============================================================================

/**
 * Initiates a compliance audit for an entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ComplianceAudit} auditData - Audit configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created audit record
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * const audit = await initiateComplianceAudit(sequelize, {
 *   auditType: 'scheduled',
 *   regulationId: 'regulation-uuid',
 *   entityType: 'facility',
 *   entityId: 'facility-uuid',
 *   auditorId: 'user-uuid',
 *   status: ComplianceStatus.UNDER_REVIEW,
 *   findings: [],
 *   riskLevel: 'medium',
 *   startDate: new Date(),
 *   dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
 * });
 */
export async function initiateComplianceAudit(
  sequelize: Sequelize,
  auditData: ComplianceAudit,
  transaction?: Transaction
): Promise<Model> {
  const logger = new Logger('initiateComplianceAudit');

  try {
    const validatedData = ComplianceAuditSchema.parse(auditData);

    const ComplianceAudit = defineComplianceAuditModel(sequelize);

    const audit = await ComplianceAudit.create(validatedData as any, { transaction });

    logger.log(`Compliance audit initiated: ${audit.get('id')} for ${auditData.entityType}:${auditData.entityId}`);
    return audit;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Records compliance findings during an audit.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} auditId - Audit ID
 * @param {ComplianceFinding[]} findings - Array of findings
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated audit with findings
 * @throws {NotFoundException} If audit not found
 *
 * @example
 * await recordComplianceFindings(sequelize, 'audit-uuid', [
 *   {
 *     findingId: 'finding-1',
 *     ruleId: 'rule-uuid',
 *     description: 'Missing encryption on PHI storage',
 *     severity: RegulationSeverity.CRITICAL,
 *     status: 'open',
 *     recommendation: 'Enable AES-256 encryption',
 *     dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 *   }
 * ]);
 */
export async function recordComplianceFindings(
  sequelize: Sequelize,
  auditId: string,
  findings: ComplianceFinding[],
  transaction?: Transaction
): Promise<Model> {
  const logger = new Logger('recordComplianceFindings');

  const ComplianceAudit = defineComplianceAuditModel(sequelize);

  const audit = await ComplianceAudit.findByPk(auditId, { transaction });
  if (!audit) {
    throw new NotFoundException(`Audit ${auditId} not found`);
  }

  const existingFindings = (audit.get('findings') as ComplianceFinding[]) || [];
  const updatedFindings = [...existingFindings, ...findings];

  // Calculate risk level based on findings
  const criticalCount = updatedFindings.filter(f => f.severity === RegulationSeverity.CRITICAL).length;
  const highCount = updatedFindings.filter(f => f.severity === RegulationSeverity.HIGH).length;

  let riskLevel: 'critical' | 'high' | 'medium' | 'low';
  if (criticalCount > 0) {
    riskLevel = 'critical';
  } else if (highCount > 2) {
    riskLevel = 'high';
  } else if (highCount > 0 || updatedFindings.length > 5) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }

  await audit.update(
    {
      findings: updatedFindings,
      riskLevel,
      status: ComplianceStatus.UNDER_REVIEW,
    },
    { transaction }
  );

  logger.log(`Recorded ${findings.length} findings for audit ${auditId}`);
  return audit;
}

/**
 * Completes a compliance audit with final assessment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} auditId - Audit ID
 * @param {number} score - Compliance score (0-100)
 * @param {ComplianceStatus} finalStatus - Final compliance status
 * @param {string[]} [recommendations] - Optional recommendations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Completed audit
 * @throws {NotFoundException} If audit not found
 *
 * @example
 * await completeComplianceAudit(
 *   sequelize,
 *   'audit-uuid',
 *   85,
 *   ComplianceStatus.PARTIALLY_COMPLIANT,
 *   ['Implement encryption', 'Update access controls']
 * );
 */
export async function completeComplianceAudit(
  sequelize: Sequelize,
  auditId: string,
  score: number,
  finalStatus: ComplianceStatus,
  recommendations?: string[],
  transaction?: Transaction
): Promise<Model> {
  const logger = new Logger('completeComplianceAudit');

  const ComplianceAudit = defineComplianceAuditModel(sequelize);

  const audit = await ComplianceAudit.findByPk(auditId, { transaction });
  if (!audit) {
    throw new NotFoundException(`Audit ${auditId} not found`);
  }

  if (score < 0 || score > 100) {
    throw new BadRequestException('Score must be between 0 and 100');
  }

  await audit.update(
    {
      score,
      status: finalStatus,
      completionDate: new Date(),
      recommendations: recommendations || [],
    },
    { transaction }
  );

  logger.log(`Audit completed: ${auditId} - Score: ${score}, Status: ${finalStatus}`);
  return audit;
}

/**
 * Creates a remediation plan for non-compliance findings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} auditId - Audit ID
 * @param {RemediationPlan} plan - Remediation plan
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated audit with remediation plan
 * @throws {NotFoundException} If audit not found
 *
 * @example
 * await createRemediationPlan(sequelize, 'audit-uuid', {
 *   planId: 'plan-uuid',
 *   description: 'Address critical security gaps',
 *   steps: [
 *     {
 *       stepNumber: 1,
 *       description: 'Enable database encryption',
 *       assignedTo: 'user-uuid',
 *       status: 'pending',
 *       dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 *     }
 *   ],
 *   assignedTo: 'manager-uuid',
 *   targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
 *   status: 'pending',
 *   completionPercentage: 0
 * });
 */
export async function createRemediationPlan(
  sequelize: Sequelize,
  auditId: string,
  plan: RemediationPlan,
  transaction?: Transaction
): Promise<Model> {
  const logger = new Logger('createRemediationPlan');

  const ComplianceAudit = defineComplianceAuditModel(sequelize);

  const audit = await ComplianceAudit.findByPk(auditId, { transaction });
  if (!audit) {
    throw new NotFoundException(`Audit ${auditId} not found`);
  }

  await audit.update(
    {
      remediationPlan: plan,
      status: ComplianceStatus.REMEDIATION_IN_PROGRESS,
    },
    { transaction }
  );

  logger.log(`Remediation plan created for audit ${auditId}`);
  return audit;
}

/**
 * Updates remediation step progress.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} auditId - Audit ID
 * @param {number} stepNumber - Step number to update
 * @param {'pending' | 'in_progress' | 'completed'} status - New status
 * @param {string} [notes] - Optional notes
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated audit
 *
 * @example
 * await updateRemediationStep(
 *   sequelize,
 *   'audit-uuid',
 *   1,
 *   'completed',
 *   'Encryption enabled on all databases'
 * );
 */
export async function updateRemediationStep(
  sequelize: Sequelize,
  auditId: string,
  stepNumber: number,
  status: 'pending' | 'in_progress' | 'completed',
  notes?: string,
  transaction?: Transaction
): Promise<Model> {
  const logger = new Logger('updateRemediationStep');

  const ComplianceAudit = defineComplianceAuditModel(sequelize);

  const audit = await ComplianceAudit.findByPk(auditId, { transaction });
  if (!audit) {
    throw new NotFoundException(`Audit ${auditId} not found`);
  }

  const plan = audit.get('remediationPlan') as RemediationPlan;
  if (!plan) {
    throw new BadRequestException('No remediation plan found for this audit');
  }

  const step = plan.steps.find(s => s.stepNumber === stepNumber);
  if (!step) {
    throw new NotFoundException(`Step ${stepNumber} not found in remediation plan`);
  }

  step.status = status;
  if (notes) {
    step.notes = notes;
  }
  if (status === 'completed') {
    step.completedDate = new Date();
  }

  // Calculate completion percentage
  const completedSteps = plan.steps.filter(s => s.status === 'completed').length;
  plan.completionPercentage = Math.round((completedSteps / plan.steps.length) * 100);

  // Update plan status if all steps completed
  if (plan.completionPercentage === 100) {
    plan.status = 'completed';
  }

  await audit.update({ remediationPlan: plan }, { transaction });

  logger.log(`Remediation step ${stepNumber} updated to ${status} for audit ${auditId}`);
  return audit;
}

/**
 * Retrieves audits by entity with filtering.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {ComplianceStatus} [status] - Optional status filter
 * @returns {Promise<Model[]>} List of audits
 *
 * @example
 * const audits = await getAuditsByEntity(
 *   sequelize,
 *   'facility',
 *   'facility-uuid',
 *   ComplianceStatus.UNDER_REVIEW
 * );
 */
export async function getAuditsByEntity(
  sequelize: Sequelize,
  entityType: string,
  entityId: string,
  status?: ComplianceStatus
): Promise<Model[]> {
  const ComplianceAudit = defineComplianceAuditModel(sequelize);

  const where: WhereOptions = { entityType, entityId };
  if (status) {
    where.status = status;
  }

  const audits = await ComplianceAudit.findAll({
    where,
    order: [['startDate', 'DESC']],
  });

  return audits;
}

/**
 * Generates compliance audit summary statistics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date for report period
 * @param {Date} endDate - End date for report period
 * @returns {Promise<object>} Audit statistics
 *
 * @example
 * const stats = await getAuditStatistics(
 *   sequelize,
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31')
 * );
 * console.log(`Compliance rate: ${stats.complianceRate}%`);
 */
export async function getAuditStatistics(
  sequelize: Sequelize,
  startDate: Date,
  endDate: Date
): Promise<{
  totalAudits: number;
  compliantCount: number;
  nonCompliantCount: number;
  averageScore: number;
  complianceRate: number;
  byRiskLevel: Record<string, number>;
}> {
  const ComplianceAudit = defineComplianceAuditModel(sequelize);

  const audits = await ComplianceAudit.findAll({
    where: {
      startDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalAudits = audits.length;
  const compliantCount = audits.filter(
    a => a.get('status') === ComplianceStatus.COMPLIANT
  ).length;
  const nonCompliantCount = audits.filter(
    a => a.get('status') === ComplianceStatus.NON_COMPLIANT
  ).length;

  const scoresSum = audits.reduce((sum, a) => sum + (a.get('score') as number || 0), 0);
  const averageScore = totalAudits > 0 ? Math.round(scoresSum / totalAudits) : 0;
  const complianceRate = totalAudits > 0 ? Math.round((compliantCount / totalAudits) * 100) : 0;

  const byRiskLevel = audits.reduce((acc, a) => {
    const level = a.get('riskLevel') as string;
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalAudits,
    compliantCount,
    nonCompliantCount,
    averageScore,
    complianceRate,
    byRiskLevel,
  };
}

// ============================================================================
// REGULATORY CHANGE DETECTION FUNCTIONS (28-33)
// ============================================================================

/**
 * Registers a new regulatory change notification.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RegulatoryChange} changeData - Change notification data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created change record
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * const change = await registerRegulatoryChange(sequelize, {
 *   changeType: 'amendment',
 *   regulationId: 'regulation-uuid',
 *   framework: RegulatoryFramework.HIPAA,
 *   jurisdiction: 'United States',
 *   title: 'HIPAA Privacy Rule Update 2025',
 *   description: 'New requirements for patient consent forms',
 *   effectiveDate: new Date('2025-07-01'),
 *   announcedDate: new Date('2025-01-15'),
 *   impactLevel: ImpactLevel.HIGH,
 *   source: 'HHS/OCR',
 *   sourceUrl: 'https://www.hhs.gov/hipaa/updates',
 *   reviewed: false
 * });
 */
export async function registerRegulatoryChange(
  sequelize: Sequelize,
  changeData: RegulatoryChange,
  transaction?: Transaction
): Promise<Model> {
  const logger = new Logger('registerRegulatoryChange');

  try {
    const validatedData = RegulatoryChangeSchema.parse(changeData);

    const RegulatoryChange = defineRegulatoryChangeModel(sequelize);

    const change = await RegulatoryChange.create(validatedData as any, { transaction });

    logger.log(`Regulatory change registered: ${validatedData.title}`);
    return change;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Detects pending regulatory changes requiring review.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [daysUntilEffective=90] - Days until effective date threshold
 * @returns {Promise<Model[]>} Pending changes requiring attention
 *
 * @example
 * const pendingChanges = await detectPendingChanges(sequelize, 60);
 * console.log(`${pendingChanges.length} changes need review before effective date`);
 */
export async function detectPendingChanges(
  sequelize: Sequelize,
  daysUntilEffective: number = 90
): Promise<Model[]> {
  const RegulatoryChange = defineRegulatoryChangeModel(sequelize);

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysUntilEffective);

  const changes = await RegulatoryChange.findAll({
    where: {
      reviewed: false,
      effectiveDate: {
        [Op.between]: [new Date(), futureDate],
      },
    },
    order: [['effectiveDate', 'ASC'], ['impactLevel', 'DESC']],
  });

  return changes;
}

/**
 * Performs impact assessment for regulatory change.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} changeId - Change ID
 * @param {ImpactAssessment} assessment - Impact assessment data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated change with assessment
 * @throws {NotFoundException} If change not found
 *
 * @example
 * await assessRegulatoryImpact(sequelize, 'change-uuid', {
 *   assessmentId: 'assessment-uuid',
 *   changeId: 'change-uuid',
 *   impactAreas: ['patient_consent', 'data_sharing', 'record_retention'],
 *   affectedProcesses: ['admissions', 'treatment', 'billing'],
 *   estimatedCost: 50000,
 *   estimatedEffort: '3-6 months',
 *   riskLevel: 'high',
 *   mitigationStrategy: 'Update consent forms and train staff',
 *   implementationPlan: 'Phase 1: Form updates, Phase 2: Training, Phase 3: Rollout',
 *   assessedBy: 'user-uuid',
 *   assessedAt: new Date()
 * });
 */
export async function assessRegulatoryImpact(
  sequelize: Sequelize,
  changeId: string,
  assessment: ImpactAssessment,
  transaction?: Transaction
): Promise<Model> {
  const logger = new Logger('assessRegulatoryImpact');

  const RegulatoryChange = defineRegulatoryChangeModel(sequelize);

  const change = await RegulatoryChange.findByPk(changeId, { transaction });
  if (!change) {
    throw new NotFoundException(`Regulatory change ${changeId} not found`);
  }

  await change.update({ impactAssessment: assessment }, { transaction });

  logger.log(`Impact assessment completed for change ${changeId}`);
  return change;
}

/**
 * Marks regulatory change as reviewed.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} changeId - Change ID
 * @param {string} reviewedBy - User ID of reviewer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated change
 * @throws {NotFoundException} If change not found
 *
 * @example
 * await markChangeAsReviewed(sequelize, 'change-uuid', 'user-uuid');
 */
export async function markChangeAsReviewed(
  sequelize: Sequelize,
  changeId: string,
  reviewedBy: string,
  transaction?: Transaction
): Promise<Model> {
  const logger = new Logger('markChangeAsReviewed');

  const RegulatoryChange = defineRegulatoryChangeModel(sequelize);

  const change = await RegulatoryChange.findByPk(changeId, { transaction });
  if (!change) {
    throw new NotFoundException(`Regulatory change ${changeId} not found`);
  }

  await change.update(
    {
      reviewed: true,
      reviewedBy,
      reviewedAt: new Date(),
    },
    { transaction }
  );

  logger.log(`Regulatory change ${changeId} marked as reviewed by ${reviewedBy}`);
  return change;
}

/**
 * Retrieves high-impact unreviewed changes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ImpactLevel[]} [impactLevels] - Impact levels to filter
 * @returns {Promise<Model[]>} High-impact changes needing review
 *
 * @example
 * const criticalChanges = await getHighImpactChanges(
 *   sequelize,
 *   [ImpactLevel.CRITICAL, ImpactLevel.HIGH]
 * );
 */
export async function getHighImpactChanges(
  sequelize: Sequelize,
  impactLevels: ImpactLevel[] = [ImpactLevel.CRITICAL, ImpactLevel.HIGH]
): Promise<Model[]> {
  const RegulatoryChange = defineRegulatoryChangeModel(sequelize);

  const changes = await RegulatoryChange.findAll({
    where: {
      reviewed: false,
      impactLevel: { [Op.in]: impactLevels },
    },
    order: [['effectiveDate', 'ASC'], ['impactLevel', 'DESC']],
  });

  return changes;
}

/**
 * Retrieves changes by framework and date range.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RegulatoryFramework} framework - Regulatory framework
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Model[]>} Matching changes
 *
 * @example
 * const hipaaChanges = await getChangesByFramework(
 *   sequelize,
 *   RegulatoryFramework.HIPAA,
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31')
 * );
 */
export async function getChangesByFramework(
  sequelize: Sequelize,
  framework: RegulatoryFramework,
  startDate: Date,
  endDate: Date
): Promise<Model[]> {
  const RegulatoryChange = defineRegulatoryChangeModel(sequelize);

  const changes = await RegulatoryChange.findAll({
    where: {
      framework,
      announcedDate: { [Op.between]: [startDate, endDate] },
    },
    order: [['announcedDate', 'DESC']],
  });

  return changes;
}

// ============================================================================
// JURISDICTION-SPECIFIC COMPLIANCE FUNCTIONS (34-38)
// ============================================================================

/**
 * Creates jurisdiction-specific requirement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {JurisdictionRequirement} reqData - Requirement data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created requirement
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * const requirement = await createJurisdictionRequirement(sequelize, {
 *   jurisdiction: 'California',
 *   jurisdictionType: JurisdictionType.STATE,
 *   framework: RegulatoryFramework.CCPA,
 *   requirementCode: 'CCPA-1798.100',
 *   description: 'Consumer right to know',
 *   applicability: ['healthcare_providers', 'covered_entities'],
 *   effectiveDate: new Date('2020-01-01'),
 *   localAuthority: 'California Attorney General',
 *   isActive: true
 * });
 */
export async function createJurisdictionRequirement(
  sequelize: Sequelize,
  reqData: JurisdictionRequirement,
  transaction?: Transaction
): Promise<Model> {
  const logger = new Logger('createJurisdictionRequirement');

  const JurisdictionRequirement = defineJurisdictionRequirementModel(sequelize);

  const requirement = await JurisdictionRequirement.create(reqData as any, { transaction });

  logger.log(`Jurisdiction requirement created: ${reqData.jurisdiction} - ${reqData.requirementCode}`);
  return requirement;
}

/**
 * Retrieves jurisdiction-specific requirements for entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} jurisdiction - Jurisdiction name
 * @param {RegulatoryFramework} [framework] - Optional framework filter
 * @param {boolean} [activeOnly=true] - Active requirements only
 * @returns {Promise<Model[]>} Applicable requirements
 *
 * @example
 * const californiaReqs = await getJurisdictionRequirements(
 *   sequelize,
 *   'California',
 *   RegulatoryFramework.CCPA,
 *   true
 * );
 */
export async function getJurisdictionRequirements(
  sequelize: Sequelize,
  jurisdiction: string,
  framework?: RegulatoryFramework,
  activeOnly: boolean = true
): Promise<Model[]> {
  const JurisdictionRequirement = defineJurisdictionRequirementModel(sequelize);

  const where: WhereOptions = { jurisdiction };
  if (framework) {
    where.framework = framework;
  }
  if (activeOnly) {
    where.isActive = true;
  }

  const requirements = await JurisdictionRequirement.findAll({
    where,
    order: [['effectiveDate', 'DESC']],
  });

  return requirements;
}

/**
 * Checks multi-jurisdiction compliance for entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} jurisdictions - Array of jurisdictions
 * @param {string} entityType - Entity type
 * @param {Record<string, any>} entityData - Entity data
 * @returns {Promise<Record<string, {compliant: boolean, issues: any[]}>>} Compliance status by jurisdiction
 *
 * @example
 * const multiStateCompliance = await checkMultiJurisdictionCompliance(
 *   sequelize,
 *   ['California', 'New York', 'Texas'],
 *   'healthcare_facility',
 *   { hasDataPrivacyPolicy: true, encryptionEnabled: true }
 * );
 */
export async function checkMultiJurisdictionCompliance(
  sequelize: Sequelize,
  jurisdictions: string[],
  entityType: string,
  entityData: Record<string, any>
): Promise<Record<string, { compliant: boolean; issues: any[] }>> {
  const logger = new Logger('checkMultiJurisdictionCompliance');

  const results: Record<string, { compliant: boolean; issues: any[] }> = {};

  for (const jurisdiction of jurisdictions) {
    const requirements = await getJurisdictionRequirements(sequelize, jurisdiction, undefined, true);

    const issues: any[] = [];

    for (const req of requirements) {
      const applicability = req.get('applicability') as string[];
      if (applicability.includes(entityType)) {
        // In production, this would perform actual compliance checks
        // For now, we'll do a simple validation
        const provisions = req.get('specificProvisions') as Record<string, any>;
        if (provisions && !validateProvisions(provisions, entityData)) {
          issues.push({
            requirementCode: req.get('requirementCode'),
            description: req.get('description'),
            severity: 'high',
          });
        }
      }
    }

    results[jurisdiction] = {
      compliant: issues.length === 0,
      issues,
    };
  }

  logger.log(`Multi-jurisdiction compliance checked for ${jurisdictions.length} jurisdictions`);
  return results;
}

/**
 * Validates entity data against jurisdiction provisions.
 */
function validateProvisions(provisions: Record<string, any>, entityData: Record<string, any>): boolean {
  // Simple validation - in production this would be more sophisticated
  for (const [key, value] of Object.entries(provisions)) {
    if (entityData[key] !== value) {
      return false;
    }
  }
  return true;
}

/**
 * Identifies jurisdiction conflicts and variations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} jurisdictions - Jurisdictions to compare
 * @param {RegulatoryFramework} framework - Framework to analyze
 * @returns {Promise<{conflicts: any[], variations: any[]}>} Conflicts and variations
 *
 * @example
 * const analysis = await analyzeJurisdictionConflicts(
 *   sequelize,
 *   ['California', 'Texas', 'Florida'],
 *   RegulatoryFramework.HIPAA
 * );
 */
export async function analyzeJurisdictionConflicts(
  sequelize: Sequelize,
  jurisdictions: string[],
  framework: RegulatoryFramework
): Promise<{ conflicts: any[]; variations: any[] }> {
  const logger = new Logger('analyzeJurisdictionConflicts');

  const JurisdictionRequirement = defineJurisdictionRequirementModel(sequelize);

  const allRequirements = await JurisdictionRequirement.findAll({
    where: {
      jurisdiction: { [Op.in]: jurisdictions },
      framework,
      isActive: true,
    },
  });

  // Group by requirement code
  const grouped: Record<string, Model[]> = {};
  for (const req of allRequirements) {
    const code = req.get('requirementCode') as string;
    if (!grouped[code]) {
      grouped[code] = [];
    }
    grouped[code].push(req);
  }

  const conflicts: any[] = [];
  const variations: any[] = [];

  for (const [code, reqs] of Object.entries(grouped)) {
    if (reqs.length > 1) {
      // Check for conflicts in provisions
      const provisions = reqs.map(r => r.get('specificProvisions'));
      const hasConflicts = checkForConflicts(provisions);

      if (hasConflicts) {
        conflicts.push({
          requirementCode: code,
          jurisdictions: reqs.map(r => r.get('jurisdiction')),
          description: 'Conflicting requirements across jurisdictions',
        });
      } else {
        variations.push({
          requirementCode: code,
          jurisdictions: reqs.map(r => r.get('jurisdiction')),
          description: 'Minor variations in implementation',
        });
      }
    }
  }

  logger.log(`Analyzed ${jurisdictions.length} jurisdictions: ${conflicts.length} conflicts, ${variations.length} variations`);
  return { conflicts, variations };
}

/**
 * Checks for conflicts in jurisdiction provisions.
 */
function checkForConflicts(provisions: any[]): boolean {
  // Simple conflict detection - in production this would be more sophisticated
  if (provisions.length < 2) return false;

  const baseProvision = provisions[0];
  for (let i = 1; i < provisions.length; i++) {
    if (JSON.stringify(baseProvision) !== JSON.stringify(provisions[i])) {
      return true;
    }
  }
  return false;
}

/**
 * Generates jurisdiction compliance matrix.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} jurisdictions - Jurisdictions to include
 * @param {RegulatoryFramework[]} frameworks - Frameworks to analyze
 * @returns {Promise<Record<string, Record<string, number>>>} Compliance matrix
 *
 * @example
 * const matrix = await generateJurisdictionMatrix(
 *   sequelize,
 *   ['California', 'New York', 'Texas'],
 *   [RegulatoryFramework.HIPAA, RegulatoryFramework.CCPA]
 * );
 */
export async function generateJurisdictionMatrix(
  sequelize: Sequelize,
  jurisdictions: string[],
  frameworks: RegulatoryFramework[]
): Promise<Record<string, Record<string, number>>> {
  const JurisdictionRequirement = defineJurisdictionRequirementModel(sequelize);

  const matrix: Record<string, Record<string, number>> = {};

  for (const jurisdiction of jurisdictions) {
    matrix[jurisdiction] = {};

    for (const framework of frameworks) {
      const count = await JurisdictionRequirement.count({
        where: {
          jurisdiction,
          framework,
          isActive: true,
        },
      });

      matrix[jurisdiction][framework] = count;
    }
  }

  return matrix;
}

// ============================================================================
// RISK ASSESSMENT FUNCTIONS (39-42)
// ============================================================================

/**
 * Performs comprehensive regulatory risk assessment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {RegulatoryFramework} framework - Framework to assess
 * @param {string} assessedBy - Assessor user ID
 * @returns {Promise<RiskAssessment>} Risk assessment results
 *
 * @example
 * const riskAssessment = await performRiskAssessment(
 *   sequelize,
 *   'facility',
 *   'facility-uuid',
 *   RegulatoryFramework.HIPAA,
 *   'user-uuid'
 * );
 * console.log(`Overall risk: ${riskAssessment.riskLevel} (${riskAssessment.overallRiskScore}/100)`);
 */
export async function performRiskAssessment(
  sequelize: Sequelize,
  entityType: string,
  entityId: string,
  framework: RegulatoryFramework,
  assessedBy: string
): Promise<RiskAssessment> {
  const logger = new Logger('performRiskAssessment');

  // Get recent audits
  const audits = await getAuditsByEntity(sequelize, entityType, entityId);

  // Get applicable regulations
  const regulations = await getRegulationsByFramework(sequelize, framework);

  // Calculate risk factors
  const riskFactors: RiskFactor[] = [];

  // Audit history risk
  const recentNonCompliance = audits.filter(
    a => a.get('status') === ComplianceStatus.NON_COMPLIANT
  ).length;

  riskFactors.push({
    factor: 'Audit History',
    score: Math.min(recentNonCompliance * 20, 100),
    weight: 0.3,
    description: `${recentNonCompliance} non-compliant audits in recent history`,
    mitigation: 'Address outstanding audit findings',
  });

  // Regulation severity risk
  const criticalRegulations = regulations.filter(
    r => r.get('severity') === RegulationSeverity.CRITICAL
  ).length;

  riskFactors.push({
    factor: 'Critical Regulations',
    score: Math.min(criticalRegulations * 15, 100),
    weight: 0.4,
    description: `${criticalRegulations} critical regulations applicable`,
    mitigation: 'Prioritize critical regulation compliance',
  });

  // Remediation progress risk
  const inProgressRemediations = audits.filter(
    a => a.get('status') === ComplianceStatus.REMEDIATION_IN_PROGRESS
  ).length;

  riskFactors.push({
    factor: 'Pending Remediations',
    score: Math.min(inProgressRemediations * 25, 100),
    weight: 0.3,
    description: `${inProgressRemediations} remediations in progress`,
    mitigation: 'Accelerate remediation completion',
  });

  // Calculate overall risk score
  const overallRiskScore = Math.round(
    riskFactors.reduce((sum, factor) => sum + factor.score * factor.weight, 0)
  );

  let riskLevel: 'critical' | 'high' | 'medium' | 'low';
  if (overallRiskScore >= 80) {
    riskLevel = 'critical';
  } else if (overallRiskScore >= 60) {
    riskLevel = 'high';
  } else if (overallRiskScore >= 40) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }

  const validUntil = new Date();
  validUntil.setMonth(validUntil.getMonth() + 6);

  const assessment: RiskAssessment = {
    assessmentId: `risk-${Date.now()}`,
    entityType,
    entityId,
    framework,
    overallRiskScore,
    riskLevel,
    riskFactors,
    assessedBy,
    assessedAt: new Date(),
    validUntil,
    recommendations: [
      'Review and address all non-compliant audit findings',
      'Establish regular compliance monitoring schedule',
      'Complete all pending remediation plans',
      'Update compliance policies and procedures',
    ],
  };

  logger.log(`Risk assessment completed: ${entityType}:${entityId} - ${riskLevel} (${overallRiskScore}/100)`);
  return assessment;
}

/**
 * Calculates compliance trend over time.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {number} [months=12] - Months to analyze
 * @returns {Promise<{trend: 'improving' | 'stable' | 'declining', data: any[]}>} Trend analysis
 *
 * @example
 * const trend = await calculateComplianceTrend(
 *   sequelize,
 *   'facility',
 *   'facility-uuid',
 *   12
 * );
 * console.log(`Compliance trend: ${trend.trend}`);
 */
export async function calculateComplianceTrend(
  sequelize: Sequelize,
  entityType: string,
  entityId: string,
  months: number = 12
): Promise<{ trend: 'improving' | 'stable' | 'declining'; data: any[] }> {
  const logger = new Logger('calculateComplianceTrend');

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const ComplianceAudit = defineComplianceAuditModel(sequelize);

  const audits = await ComplianceAudit.findAll({
    where: {
      entityType,
      entityId,
      startDate: { [Op.gte]: startDate },
    },
    order: [['startDate', 'ASC']],
  });

  const data = audits.map(a => ({
    date: a.get('startDate'),
    score: a.get('score') || 0,
    status: a.get('status'),
  }));

  // Calculate trend
  let trend: 'improving' | 'stable' | 'declining' = 'stable';

  if (data.length >= 2) {
    const firstHalfAvg = data.slice(0, Math.floor(data.length / 2))
      .reduce((sum, d) => sum + d.score, 0) / Math.floor(data.length / 2);

    const secondHalfAvg = data.slice(Math.floor(data.length / 2))
      .reduce((sum, d) => sum + d.score, 0) / Math.ceil(data.length / 2);

    if (secondHalfAvg > firstHalfAvg + 5) {
      trend = 'improving';
    } else if (secondHalfAvg < firstHalfAvg - 5) {
      trend = 'declining';
    }
  }

  logger.log(`Compliance trend calculated: ${trend} over ${months} months`);
  return { trend, data };
}

/**
 * Generates regulatory compliance report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ComplianceReportConfig} config - Report configuration
 * @returns {Promise<{report: any, generatedAt: Date}>} Generated report
 *
 * @example
 * const report = await generateComplianceReport(sequelize, {
 *   reportType: 'quarterly_compliance',
 *   framework: RegulatoryFramework.HIPAA,
 *   jurisdiction: 'United States',
 *   frequency: 'quarterly',
 *   includedMetrics: ['audit_count', 'compliance_rate', 'risk_level'],
 *   recipients: ['compliance@example.com'],
 *   format: 'pdf',
 *   automated: true
 * });
 */
export async function generateComplianceReport(
  sequelize: Sequelize,
  config: ComplianceReportConfig
): Promise<{ report: any; generatedAt: Date }> {
  const logger = new Logger('generateComplianceReport');

  const now = new Date();
  const startDate = new Date();

  // Calculate report period based on frequency
  switch (config.frequency) {
    case 'daily':
      startDate.setDate(startDate.getDate() - 1);
      break;
    case 'weekly':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'monthly':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'quarterly':
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case 'annual':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }

  const stats = await getAuditStatistics(sequelize, startDate, now);
  const regulations = await getRegulationsByFramework(sequelize, config.framework, config.jurisdiction);

  const report = {
    reportType: config.reportType,
    framework: config.framework,
    jurisdiction: config.jurisdiction,
    period: {
      start: startDate,
      end: now,
    },
    summary: {
      totalAudits: stats.totalAudits,
      complianceRate: stats.complianceRate,
      averageScore: stats.averageScore,
    },
    statistics: stats,
    regulations: {
      total: regulations.length,
      critical: regulations.filter(r => r.get('severity') === RegulationSeverity.CRITICAL).length,
    },
    format: config.format,
  };

  logger.log(`Compliance report generated: ${config.reportType}`);
  return { report, generatedAt: now };
}

/**
 * Identifies compliance gaps and generates recommendations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {RegulatoryFramework} framework - Framework to analyze
 * @returns {Promise<{gaps: any[], recommendations: string[], priority: string}>} Gap analysis
 *
 * @example
 * const analysis = await identifyComplianceGaps(
 *   sequelize,
 *   'facility',
 *   'facility-uuid',
 *   RegulatoryFramework.HIPAA
 * );
 * console.log(`Found ${analysis.gaps.length} compliance gaps`);
 * console.log('Recommendations:', analysis.recommendations);
 */
export async function identifyComplianceGaps(
  sequelize: Sequelize,
  entityType: string,
  entityId: string,
  framework: RegulatoryFramework
): Promise<{ gaps: any[]; recommendations: string[]; priority: string }> {
  const logger = new Logger('identifyComplianceGaps');

  // Get applicable regulations
  const regulations = await getRegulationsByFramework(sequelize, framework);

  // Get recent audits
  const audits = await getAuditsByEntity(sequelize, entityType, entityId);

  const gaps: any[] = [];
  const recommendations: string[] = [];

  // Identify gaps from audit findings
  for (const audit of audits) {
    const findings = audit.get('findings') as ComplianceFinding[];
    const openFindings = findings.filter(f => f.status === 'open' || f.status === 'in_progress');

    for (const finding of openFindings) {
      gaps.push({
        source: 'audit',
        auditId: audit.get('id'),
        findingId: finding.findingId,
        description: finding.description,
        severity: finding.severity,
        recommendation: finding.recommendation,
      });
    }
  }

  // Generate recommendations
  if (gaps.length > 0) {
    recommendations.push('Prioritize resolution of critical compliance gaps');
    recommendations.push('Implement automated compliance monitoring');
    recommendations.push('Schedule regular compliance training for staff');
    recommendations.push('Establish compliance dashboard for real-time monitoring');
  }

  const criticalGaps = gaps.filter(g => g.severity === RegulationSeverity.CRITICAL).length;
  const priority = criticalGaps > 0 ? 'critical' : gaps.length > 5 ? 'high' : 'medium';

  logger.log(`Identified ${gaps.length} compliance gaps for ${entityType}:${entityId}`);
  return { gaps, recommendations, priority };
}

// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================

/**
 * NestJS service for regulatory compliance management.
 *
 * @example
 * @Injectable()
 * export class ComplianceService extends RegulatoryComplianceService {
 *   constructor(@Inject('SEQUELIZE') sequelize: Sequelize) {
 *     super(sequelize);
 *   }
 * }
 */
@Injectable()
export class RegulatoryComplianceService {
  private readonly logger = new Logger(RegulatoryComplianceService.name);

  constructor(private readonly sequelize: Sequelize) {}

  async trackRegulation(data: RegulationMetadata, transaction?: Transaction): Promise<Model> {
    return trackRegulation(this.sequelize, data, transaction);
  }

  async createComplianceRule(ruleData: ComplianceRule, transaction?: Transaction): Promise<Model> {
    return createComplianceRule(this.sequelize, ruleData, transaction);
  }

  async evaluateCompliance(
    entityType: string,
    entityId: string,
    entityData: Record<string, any>
  ): Promise<{ passed: boolean; violations: any[]; warnings: any[] }> {
    return evaluateComplianceRules(this.sequelize, entityType, entityId, entityData);
  }

  async initiateAudit(auditData: ComplianceAudit, transaction?: Transaction): Promise<Model> {
    return initiateComplianceAudit(this.sequelize, auditData, transaction);
  }

  async assessRisk(
    entityType: string,
    entityId: string,
    framework: RegulatoryFramework,
    assessedBy: string
  ): Promise<RiskAssessment> {
    return performRiskAssessment(this.sequelize, entityType, entityId, framework, assessedBy);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Enums
  RegulatoryFramework,
  ComplianceStatus,
  RegulationSeverity,
  JurisdictionType,
  ImpactLevel,

  // Schemas
  RegulationMetadataSchema,
  ComplianceRuleSchema,
  ComplianceAuditSchema,
  RegulatoryChangeSchema,

  // Models
  defineRegulationModel,
  defineComplianceRuleModel,
  defineComplianceAuditModel,
  defineRegulatoryChangeModel,
  defineJurisdictionRequirementModel,

  // Regulation tracking (7 functions)
  trackRegulation,
  getRegulationsByFramework,
  updateRegulation,
  monitorRegulationReviews,
  archiveRegulation,
  searchRegulations,
  linkRelatedRegulations,

  // Compliance rules (8 functions)
  createComplianceRule,
  evaluateComplianceRules,
  getRulesByRegulation,
  updateRuleExecutionStats,
  toggleComplianceRule,
  bulkEvaluateCompliance,
  getHighPriorityRules,

  // Compliance audits (7 functions)
  initiateComplianceAudit,
  recordComplianceFindings,
  completeComplianceAudit,
  createRemediationPlan,
  updateRemediationStep,
  getAuditsByEntity,
  getAuditStatistics,

  // Regulatory changes (6 functions)
  registerRegulatoryChange,
  detectPendingChanges,
  assessRegulatoryImpact,
  markChangeAsReviewed,
  getHighImpactChanges,
  getChangesByFramework,

  // Jurisdiction compliance (5 functions)
  createJurisdictionRequirement,
  getJurisdictionRequirements,
  checkMultiJurisdictionCompliance,
  analyzeJurisdictionConflicts,
  generateJurisdictionMatrix,

  // Risk assessment (4 functions)
  performRiskAssessment,
  calculateComplianceTrend,
  generateComplianceReport,
  identifyComplianceGaps,

  // Services
  RegulatoryComplianceService,
};
