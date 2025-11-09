/**
 * LOC: COMPLMON4567890
 * File: /reuse/threat/compliance-monitoring-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS compliance services
 *   - Audit management modules
 *   - Regulatory compliance tracking
 *   - Control effectiveness testing
 *   - Certification management
 */

/**
 * File: /reuse/threat/compliance-monitoring-kit.ts
 * Locator: WC-UTL-COMPLMON-001
 * Purpose: Comprehensive Compliance Monitoring Kit - Complete compliance framework and audit management toolkit for NestJS
 *
 * Upstream: Independent utility module for compliance operations
 * Downstream: ../backend/*, Compliance services, Audit modules, Regulatory services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, Sequelize, crypto
 * Exports: 44 utility functions for compliance framework mapping, control testing, audit management, gap analysis, regulatory tracking
 *
 * LLM Context: Enterprise-grade compliance monitoring utilities for White Cross healthcare platform.
 * Provides comprehensive compliance framework mapping (SOC2, ISO27001, NIST), control effectiveness testing,
 * audit management, compliance gap analysis, regulatory requirement tracking, compliance reporting,
 * remediation tracking, certification management, evidence collection, and continuous monitoring.
 */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Model, DataTypes, Sequelize, Op } from 'sequelize';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ComplianceFramework {
  id?: string;
  frameworkName: string;
  frameworkType: 'soc2' | 'iso27001' | 'nist' | 'hipaa' | 'gdpr' | 'pci_dss' | 'custom';
  version: string;
  description?: string;
  implementationDate?: Date;
  certificationRequired: boolean;
  certificationBody?: string;
  auditFrequency: 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'biennial';
  nextAuditDate?: Date;
  status: 'planning' | 'implementing' | 'operational' | 'certified' | 'expired';
  owner: string;
  stakeholders: string[];
  domains: FrameworkDomain[];
  metadata?: Record<string, any>;
}

interface FrameworkDomain {
  domainId: string;
  domainName: string;
  description: string;
  controlCount: number;
  implementedCount: number;
  effectiveCount: number;
}

interface ComplianceControl {
  id?: string;
  frameworkId: string;
  controlId: string;
  controlName: string;
  controlType: 'preventive' | 'detective' | 'corrective' | 'directive';
  domain: string;
  description: string;
  objective: string;
  implementationGuidance?: string;
  testing Frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  automationLevel: 'manual' | 'semi_automated' | 'fully_automated';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not_implemented' | 'in_progress' | 'implemented' | 'effective' | 'ineffective';
  owner: string;
  implementationDate?: Date;
  lastTestedDate?: Date;
  nextTestDate?: Date;
  testResults?: TestResult[];
  evidenceRequired: string[];
  metadata?: Record<string, any>;
}

interface TestResult {
  testDate: Date;
  tester: string;
  testMethod: 'inspection' | 'observation' | 'inquiry' | 'reperformance' | 'automated';
  result: 'pass' | 'fail' | 'partial' | 'not_applicable';
  findings: string[];
  evidence: string[];
  notes?: string;
}

interface Audit {
  id?: string;
  auditName: string;
  auditType: 'internal' | 'external' | 'certification' | 'surveillance' | 'special';
  frameworkId?: string;
  scope: string[];
  startDate: Date;
  endDate?: Date;
  completedDate?: Date;
  status: 'planned' | 'in_progress' | 'fieldwork' | 'reporting' | 'completed' | 'cancelled';
  leadAuditor: string;
  auditTeam: string[];
  auditFirm?: string;
  objectives: string[];
  methodology?: string;
  findings: AuditFinding[];
  recommendations: string[];
  reportDate?: Date;
  reportUrl?: string;
  followUpDate?: Date;
  metadata?: Record<string, any>;
}

interface AuditFinding {
  findingId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  controlId?: string;
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  evidence: string[];
  status: 'open' | 'in_remediation' | 'resolved' | 'accepted_risk';
  assignedTo?: string;
  dueDate?: Date;
  resolvedDate?: Date;
  resolution?: string;
}

interface ComplianceGap {
  id?: string;
  frameworkId: string;
  gapType: 'control' | 'policy' | 'process' | 'documentation' | 'technical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  currentState: string;
  requiredState: string;
  impactedControls: string[];
  businessImpact: string;
  remediationPlan?: string;
  estimatedEffort?: string;
  assignedTo?: string;
  targetDate?: Date;
  status: 'identified' | 'planning' | 'in_progress' | 'resolved' | 'accepted';
  identifiedDate: Date;
  resolvedDate?: Date;
  metadata?: Record<string, any>;
}

interface RegulatoryRequirement {
  id?: string;
  requirementId: string;
  regulatoryBody: string;
  regulationType: 'law' | 'regulation' | 'standard' | 'guideline' | 'best_practice';
  jurisdiction: string;
  title: string;
  description: string;
  effectiveDate: Date;
  expirationDate?: Date;
  applicability: string[];
  complianceDeadline?: Date;
  status: 'pending' | 'applicable' | 'compliant' | 'non_compliant' | 'not_applicable';
  owner: string;
  relatedControls: string[];
  evidenceRequired: string[];
  lastReviewed?: Date;
  nextReviewDate?: Date;
  metadata?: Record<string, any>;
}

interface ComplianceReport {
  id?: string;
  reportName: string;
  reportType: 'executive_summary' | 'detailed' | 'control_matrix' | 'gap_analysis' | 'remediation_status';
  frameworkId?: string;
  reportingPeriod: string;
  generatedDate: Date;
  generatedBy: string;
  recipients: string[];
  status: 'draft' | 'review' | 'approved' | 'published';
  metrics: ComplianceMetric[];
  summary: string;
  trends: TrendData[];
  recommendations: string[];
  attachments: string[];
  metadata?: Record<string, any>;
}

interface ComplianceMetric {
  metricName: string;
  category: string;
  value: number;
  unit: string;
  target?: number;
  threshold?: number;
  trend: 'up' | 'down' | 'stable';
  status: 'on_track' | 'at_risk' | 'off_track';
}

interface TrendData {
  period: string;
  metric: string;
  value: number;
  change?: number;
}

interface Remediation {
  id?: string;
  findingId?: string;
  gapId?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  assignedDate: Date;
  dueDate: Date;
  status: 'open' | 'in_progress' | 'pending_validation' | 'completed' | 'cancelled';
  completionPercentage: number;
  tasks: RemediationTask[];
  resources: string[];
  budget?: number;
  actualCost?: number;
  completedDate?: Date;
  validatedBy?: string;
  validatedDate?: Date;
  metadata?: Record<string, any>;
}

interface RemediationTask {
  taskId: string;
  taskName: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed';
  completedDate?: Date;
  notes?: string;
}

interface Certification {
  id?: string;
  frameworkId: string;
  certificationType: string;
  certificationBody: string;
  certificationNumber?: string;
  issueDate: Date;
  expirationDate: Date;
  status: 'active' | 'expiring_soon' | 'expired' | 'suspended' | 'revoked';
  scope: string[];
  certificationDocument?: string;
  auditId?: string;
  renewalRequired: boolean;
  renewalDate?: Date;
  cost?: number;
  contactPerson?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

interface Evidence {
  id?: string;
  evidenceType: 'document' | 'screenshot' | 'log' | 'report' | 'attestation' | 'other';
  title: string;
  description?: string;
  relatedControlIds: string[];
  relatedAuditIds: string[];
  collectedDate: Date;
  collectedBy: string;
  validFrom?: Date;
  validUntil?: Date;
  fileUrl?: string;
  fileHash?: string;
  retentionPeriod?: number;
  confidentialityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  tags: string[];
  metadata?: Record<string, any>;
}

// ============================================================================
// SEQUELIZE MODELS (1-5)
// ============================================================================

/**
 * Sequelize model for Compliance Frameworks.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ComplianceFramework model
 *
 * @example
 * const ComplianceFramework = defineComplianceFrameworkModel(sequelize);
 * await ComplianceFramework.create({
 *   frameworkName: 'SOC 2 Type II',
 *   frameworkType: 'soc2',
 *   version: '2024',
 *   certificationRequired: true,
 *   auditFrequency: 'annual',
 *   status: 'implementing',
 *   owner: 'user-123'
 * });
 */
export function defineComplianceFrameworkModel(sequelize: Sequelize): typeof Model {
  class ComplianceFramework extends Model {
    public id!: string;
    public frameworkName!: string;
    public frameworkType!: 'soc2' | 'iso27001' | 'nist' | 'hipaa' | 'gdpr' | 'pci_dss' | 'custom';
    public version!: string;
    public description!: string;
    public implementationDate!: Date;
    public certificationRequired!: boolean;
    public certificationBody!: string;
    public auditFrequency!: 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'biennial';
    public nextAuditDate!: Date;
    public status!: 'planning' | 'implementing' | 'operational' | 'certified' | 'expired';
    public owner!: string;
    public stakeholders!: string[];
    public domains!: FrameworkDomain[];
    public metadata!: Record<string, any>;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  ComplianceFramework.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      frameworkName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'framework_name',
        validate: {
          notEmpty: true,
        },
      },
      frameworkType: {
        type: DataTypes.ENUM('soc2', 'iso27001', 'nist', 'hipaa', 'gdpr', 'pci_dss', 'custom'),
        allowNull: false,
        field: 'framework_type',
      },
      version: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      implementationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'implementation_date',
      },
      certificationRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'certification_required',
      },
      certificationBody: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'certification_body',
      },
      auditFrequency: {
        type: DataTypes.ENUM('monthly', 'quarterly', 'semi_annual', 'annual', 'biennial'),
        allowNull: false,
        field: 'audit_frequency',
      },
      nextAuditDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'next_audit_date',
      },
      status: {
        type: DataTypes.ENUM('planning', 'implementing', 'operational', 'certified', 'expired'),
        allowNull: false,
        defaultValue: 'planning',
      },
      owner: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      stakeholders: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
      },
      domains: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
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
    },
    {
      sequelize,
      tableName: 'compliance_frameworks',
      timestamps: true,
      indexes: [
        { fields: ['framework_type'] },
        { fields: ['status'] },
        { fields: ['owner'] },
        { fields: ['next_audit_date'] },
      ],
    }
  );

  return ComplianceFramework;
}

/**
 * Sequelize model for Compliance Controls.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ComplianceControl model
 *
 * @example
 * const ComplianceControl = defineComplianceControlModel(sequelize);
 * await ComplianceControl.create({
 *   frameworkId: 'framework-123',
 *   controlId: 'CC6.1',
 *   controlName: 'Logical Access Controls',
 *   controlType: 'preventive',
 *   domain: 'Access Control',
 *   status: 'implemented'
 * });
 */
export function defineComplianceControlModel(sequelize: Sequelize): typeof Model {
  class ComplianceControl extends Model {
    public id!: string;
    public frameworkId!: string;
    public controlId!: string;
    public controlName!: string;
    public controlType!: 'preventive' | 'detective' | 'corrective' | 'directive';
    public domain!: string;
    public description!: string;
    public objective!: string;
    public implementationGuidance!: string;
    public testingFrequency!: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
    public automationLevel!: 'manual' | 'semi_automated' | 'fully_automated';
    public priority!: 'low' | 'medium' | 'high' | 'critical';
    public status!: 'not_implemented' | 'in_progress' | 'implemented' | 'effective' | 'ineffective';
    public owner!: string;
    public implementationDate!: Date;
    public lastTestedDate!: Date;
    public nextTestDate!: Date;
    public testResults!: TestResult[];
    public evidenceRequired!: string[];
    public metadata!: Record<string, any>;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  ComplianceControl.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      frameworkId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'framework_id',
        references: {
          model: 'compliance_frameworks',
          key: 'id',
        },
      },
      controlId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'control_id',
      },
      controlName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'control_name',
      },
      controlType: {
        type: DataTypes.ENUM('preventive', 'detective', 'corrective', 'directive'),
        allowNull: false,
        field: 'control_type',
      },
      domain: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      objective: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      implementationGuidance: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'implementation_guidance',
      },
      testingFrequency: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annual'),
        allowNull: false,
        field: 'testing_frequency',
      },
      automationLevel: {
        type: DataTypes.ENUM('manual', 'semi_automated', 'fully_automated'),
        allowNull: false,
        defaultValue: 'manual',
        field: 'automation_level',
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'medium',
      },
      status: {
        type: DataTypes.ENUM('not_implemented', 'in_progress', 'implemented', 'effective', 'ineffective'),
        allowNull: false,
        defaultValue: 'not_implemented',
      },
      owner: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      implementationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'implementation_date',
      },
      lastTestedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_tested_date',
      },
      nextTestDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'next_test_date',
      },
      testResults: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        field: 'test_results',
      },
      evidenceRequired: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        field: 'evidence_required',
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
    },
    {
      sequelize,
      tableName: 'compliance_controls',
      timestamps: true,
      indexes: [
        { fields: ['framework_id'] },
        { fields: ['control_id'] },
        { fields: ['domain'] },
        { fields: ['status'] },
        { fields: ['priority'] },
        { fields: ['next_test_date'] },
      ],
    }
  );

  return ComplianceControl;
}

/**
 * Sequelize model for Audits.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Audit model
 *
 * @example
 * const Audit = defineAuditModel(sequelize);
 * await Audit.create({
 *   auditName: 'SOC 2 Type II Audit 2024',
 *   auditType: 'certification',
 *   frameworkId: 'framework-123',
 *   startDate: new Date(),
 *   status: 'planned',
 *   leadAuditor: 'auditor-123'
 * });
 */
export function defineAuditModel(sequelize: Sequelize): typeof Model {
  class Audit extends Model {
    public id!: string;
    public auditName!: string;
    public auditType!: 'internal' | 'external' | 'certification' | 'surveillance' | 'special';
    public frameworkId!: string;
    public scope!: string[];
    public startDate!: Date;
    public endDate!: Date;
    public completedDate!: Date;
    public status!: 'planned' | 'in_progress' | 'fieldwork' | 'reporting' | 'completed' | 'cancelled';
    public leadAuditor!: string;
    public auditTeam!: string[];
    public auditFirm!: string;
    public objectives!: string[];
    public methodology!: string;
    public findings!: AuditFinding[];
    public recommendations!: string[];
    public reportDate!: Date;
    public reportUrl!: string;
    public followUpDate!: Date;
    public metadata!: Record<string, any>;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  Audit.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      auditName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'audit_name',
      },
      auditType: {
        type: DataTypes.ENUM('internal', 'external', 'certification', 'surveillance', 'special'),
        allowNull: false,
        field: 'audit_type',
      },
      frameworkId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'framework_id',
        references: {
          model: 'compliance_frameworks',
          key: 'id',
        },
      },
      scope: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'end_date',
      },
      completedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'completed_date',
      },
      status: {
        type: DataTypes.ENUM('planned', 'in_progress', 'fieldwork', 'reporting', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'planned',
      },
      leadAuditor: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'lead_auditor',
      },
      auditTeam: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
        field: 'audit_team',
      },
      auditFirm: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'audit_firm',
      },
      objectives: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
      },
      methodology: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      findings: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      recommendations: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
      },
      reportDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'report_date',
      },
      reportUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'report_url',
      },
      followUpDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'follow_up_date',
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
    },
    {
      sequelize,
      tableName: 'audits',
      timestamps: true,
      indexes: [
        { fields: ['framework_id'] },
        { fields: ['audit_type'] },
        { fields: ['status'] },
        { fields: ['start_date'] },
        { fields: ['lead_auditor'] },
      ],
    }
  );

  return Audit;
}

/**
 * Sequelize model for Compliance Gaps.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ComplianceGap model
 *
 * @example
 * const ComplianceGap = defineComplianceGapModel(sequelize);
 * await ComplianceGap.create({
 *   frameworkId: 'framework-123',
 *   gapType: 'control',
 *   severity: 'high',
 *   title: 'Missing MFA Implementation',
 *   currentState: 'Single factor authentication',
 *   requiredState: 'Multi-factor authentication',
 *   status: 'identified'
 * });
 */
export function defineComplianceGapModel(sequelize: Sequelize): typeof Model {
  class ComplianceGap extends Model {
    public id!: string;
    public frameworkId!: string;
    public gapType!: 'control' | 'policy' | 'process' | 'documentation' | 'technical';
    public severity!: 'low' | 'medium' | 'high' | 'critical';
    public title!: string;
    public description!: string;
    public currentState!: string;
    public requiredState!: string;
    public impactedControls!: string[];
    public businessImpact!: string;
    public remediationPlan!: string;
    public estimatedEffort!: string;
    public assignedTo!: string;
    public targetDate!: Date;
    public status!: 'identified' | 'planning' | 'in_progress' | 'resolved' | 'accepted';
    public identifiedDate!: Date;
    public resolvedDate!: Date;
    public metadata!: Record<string, any>;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  ComplianceGap.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      frameworkId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'framework_id',
        references: {
          model: 'compliance_frameworks',
          key: 'id',
        },
      },
      gapType: {
        type: DataTypes.ENUM('control', 'policy', 'process', 'documentation', 'technical'),
        allowNull: false,
        field: 'gap_type',
      },
      severity: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      currentState: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'current_state',
      },
      requiredState: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'required_state',
      },
      impactedControls: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        field: 'impacted_controls',
      },
      businessImpact: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'business_impact',
      },
      remediationPlan: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'remediation_plan',
      },
      estimatedEffort: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'estimated_effort',
      },
      assignedTo: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'assigned_to',
      },
      targetDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'target_date',
      },
      status: {
        type: DataTypes.ENUM('identified', 'planning', 'in_progress', 'resolved', 'accepted'),
        allowNull: false,
        defaultValue: 'identified',
      },
      identifiedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'identified_date',
      },
      resolvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'resolved_date',
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
    },
    {
      sequelize,
      tableName: 'compliance_gaps',
      timestamps: true,
      indexes: [
        { fields: ['framework_id'] },
        { fields: ['gap_type'] },
        { fields: ['severity'] },
        { fields: ['status'] },
        { fields: ['target_date'] },
      ],
    }
  );

  return ComplianceGap;
}

/**
 * Sequelize model for Certifications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Certification model
 *
 * @example
 * const Certification = defineCertificationModel(sequelize);
 * await Certification.create({
 *   frameworkId: 'framework-123',
 *   certificationType: 'SOC 2 Type II',
 *   certificationBody: 'AICPA',
 *   issueDate: new Date(),
 *   expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
 *   status: 'active'
 * });
 */
export function defineCertificationModel(sequelize: Sequelize): typeof Model {
  class Certification extends Model {
    public id!: string;
    public frameworkId!: string;
    public certificationType!: string;
    public certificationBody!: string;
    public certificationNumber!: string;
    public issueDate!: Date;
    public expirationDate!: Date;
    public status!: 'active' | 'expiring_soon' | 'expired' | 'suspended' | 'revoked';
    public scope!: string[];
    public certificationDocument!: string;
    public auditId!: string;
    public renewalRequired!: boolean;
    public renewalDate!: Date;
    public cost!: number;
    public contactPerson!: string;
    public notes!: string;
    public metadata!: Record<string, any>;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  Certification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      frameworkId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'framework_id',
        references: {
          model: 'compliance_frameworks',
          key: 'id',
        },
      },
      certificationType: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'certification_type',
      },
      certificationBody: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'certification_body',
      },
      certificationNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'certification_number',
      },
      issueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'issue_date',
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expiration_date',
      },
      status: {
        type: DataTypes.ENUM('active', 'expiring_soon', 'expired', 'suspended', 'revoked'),
        allowNull: false,
        defaultValue: 'active',
      },
      scope: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      certificationDocument: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'certification_document',
      },
      auditId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'audit_id',
        references: {
          model: 'audits',
          key: 'id',
        },
      },
      renewalRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'renewal_required',
      },
      renewalDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'renewal_date',
      },
      cost: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
      contactPerson: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'contact_person',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    },
    {
      sequelize,
      tableName: 'certifications',
      timestamps: true,
      indexes: [
        { fields: ['framework_id'] },
        { fields: ['certification_type'] },
        { fields: ['status'] },
        { fields: ['expiration_date'] },
        { fields: ['renewal_date'] },
      ],
    }
  );

  return Certification;
}

// ============================================================================
// ZOD SCHEMAS (6-12)
// ============================================================================

/**
 * Zod schema for compliance framework validation.
 */
export const complianceFrameworkSchema = z.object({
  frameworkName: z.string().min(1).max(255),
  frameworkType: z.enum(['soc2', 'iso27001', 'nist', 'hipaa', 'gdpr', 'pci_dss', 'custom']),
  version: z.string().min(1).max(50),
  certificationRequired: z.boolean(),
  auditFrequency: z.enum(['monthly', 'quarterly', 'semi_annual', 'annual', 'biennial']),
  status: z.enum(['planning', 'implementing', 'operational', 'certified', 'expired']),
  owner: z.string().uuid(),
  stakeholders: z.array(z.string().uuid()),
});

/**
 * Zod schema for compliance control validation.
 */
export const complianceControlSchema = z.object({
  frameworkId: z.string().uuid(),
  controlId: z.string().min(1).max(100),
  controlName: z.string().min(1).max(255),
  controlType: z.enum(['preventive', 'detective', 'corrective', 'directive']),
  domain: z.string().min(1).max(100),
  description: z.string().min(10),
  objective: z.string().min(10),
  testingFrequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annual']),
  automationLevel: z.enum(['manual', 'semi_automated', 'fully_automated']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['not_implemented', 'in_progress', 'implemented', 'effective', 'ineffective']),
  owner: z.string().uuid(),
});

/**
 * Zod schema for audit validation.
 */
export const auditSchema = z.object({
  auditName: z.string().min(1).max(255),
  auditType: z.enum(['internal', 'external', 'certification', 'surveillance', 'special']),
  frameworkId: z.string().uuid().optional(),
  scope: z.array(z.string()),
  startDate: z.date(),
  leadAuditor: z.string().uuid(),
  objectives: z.array(z.string()),
});

/**
 * Zod schema for compliance gap validation.
 */
export const complianceGapSchema = z.object({
  frameworkId: z.string().uuid(),
  gapType: z.enum(['control', 'policy', 'process', 'documentation', 'technical']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string().min(5).max(255),
  description: z.string().min(10),
  currentState: z.string().min(10),
  requiredState: z.string().min(10),
  impactedControls: z.array(z.string()),
  businessImpact: z.string().min(10),
});

/**
 * Zod schema for certification validation.
 */
export const certificationSchema = z.object({
  frameworkId: z.string().uuid(),
  certificationType: z.string().min(1).max(255),
  certificationBody: z.string().min(1).max(255),
  issueDate: z.date(),
  expirationDate: z.date(),
  scope: z.array(z.string()),
  renewalRequired: z.boolean(),
});

/**
 * Zod schema for test result validation.
 */
export const testResultSchema = z.object({
  testDate: z.date(),
  tester: z.string().uuid(),
  testMethod: z.enum(['inspection', 'observation', 'inquiry', 'reperformance', 'automated']),
  result: z.enum(['pass', 'fail', 'partial', 'not_applicable']),
  findings: z.array(z.string()),
  evidence: z.array(z.string()),
});

/**
 * Zod schema for audit finding validation.
 */
export const auditFindingSchema = z.object({
  findingId: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  category: z.string(),
  title: z.string().min(5),
  description: z.string().min(10),
  impact: z.string().min(10),
  recommendation: z.string().min(10),
  evidence: z.array(z.string()),
  status: z.enum(['open', 'in_remediation', 'resolved', 'accepted_risk']),
});

// ============================================================================
// FRAMEWORK MANAGEMENT UTILITIES (13-18)
// ============================================================================

/**
 * Creates a new compliance framework.
 *
 * @param {typeof Model} frameworkModel - Framework model
 * @param {ComplianceFramework} framework - Framework data
 * @returns {Promise<any>} Created framework
 *
 * @example
 * await createComplianceFramework(ComplianceFramework, {
 *   frameworkName: 'SOC 2 Type II',
 *   frameworkType: 'soc2',
 *   version: '2024',
 *   certificationRequired: true,
 *   auditFrequency: 'annual',
 *   status: 'implementing',
 *   owner: 'user-123',
 *   stakeholders: ['user-456', 'user-789'],
 *   domains: []
 * });
 */
export async function createComplianceFramework(
  frameworkModel: typeof Model,
  framework: ComplianceFramework
): Promise<any> {
  const validated = complianceFrameworkSchema.parse(framework);
  return await frameworkModel.create(validated);
}

/**
 * Updates framework status and metadata.
 *
 * @param {typeof Model} frameworkModel - Framework model
 * @param {string} frameworkId - Framework ID
 * @param {Partial<ComplianceFramework>} updates - Framework updates
 * @returns {Promise<any>} Updated framework
 *
 * @example
 * await updateFrameworkStatus(ComplianceFramework, 'framework-123', {
 *   status: 'certified',
 *   nextAuditDate: new Date('2025-01-01')
 * });
 */
export async function updateFrameworkStatus(
  frameworkModel: typeof Model,
  frameworkId: string,
  updates: Partial<ComplianceFramework>
): Promise<any> {
  const framework = await frameworkModel.findByPk(frameworkId);
  if (!framework) {
    throw new Error(`Framework ${frameworkId} not found`);
  }
  return await framework.update(updates);
}

/**
 * Gets framework with control statistics.
 *
 * @param {typeof Model} frameworkModel - Framework model
 * @param {typeof Model} controlModel - Control model
 * @param {string} frameworkId - Framework ID
 * @returns {Promise<any>} Framework with statistics
 *
 * @example
 * const framework = await getFrameworkWithStats(ComplianceFramework, ComplianceControl, 'framework-123');
 */
export async function getFrameworkWithStats(
  frameworkModel: typeof Model,
  controlModel: typeof Model,
  frameworkId: string
): Promise<any> {
  const framework = await frameworkModel.findByPk(frameworkId);
  if (!framework) {
    throw new Error(`Framework ${frameworkId} not found`);
  }

  const controls = await controlModel.findAll({ where: { frameworkId } });
  const stats = {
    totalControls: controls.length,
    implemented: controls.filter(c => c.status === 'implemented' || c.status === 'effective').length,
    effective: controls.filter(c => c.status === 'effective').length,
    inProgress: controls.filter(c => c.status === 'in_progress').length,
    notImplemented: controls.filter(c => c.status === 'not_implemented').length,
    ineffective: controls.filter(c => c.status === 'ineffective').length,
  };

  return { ...framework.toJSON(), stats };
}

/**
 * Lists all active frameworks.
 *
 * @param {typeof Model} frameworkModel - Framework model
 * @returns {Promise<any[]>} Active frameworks
 *
 * @example
 * const frameworks = await listActiveFrameworks(ComplianceFramework);
 */
export async function listActiveFrameworks(frameworkModel: typeof Model): Promise<any[]> {
  return await frameworkModel.findAll({
    where: {
      status: { [Op.in]: ['implementing', 'operational', 'certified'] },
    },
    order: [['frameworkName', 'ASC']],
  });
}

/**
 * Calculates framework maturity score.
 *
 * @param {any[]} controls - Framework controls
 * @returns {number} Maturity score (0-100)
 *
 * @example
 * const maturity = calculateFrameworkMaturity(controls);
 */
export function calculateFrameworkMaturity(controls: any[]): number {
  if (controls.length === 0) return 0;

  const weights = {
    not_implemented: 0,
    in_progress: 0.5,
    implemented: 0.75,
    effective: 1.0,
    ineffective: 0.25,
  };

  const totalScore = controls.reduce((sum, control) => {
    return sum + (weights[control.status] || 0);
  }, 0);

  return (totalScore / controls.length) * 100;
}

/**
 * Gets frameworks requiring upcoming audits.
 *
 * @param {typeof Model} frameworkModel - Framework model
 * @param {number} daysAhead - Days to look ahead
 * @returns {Promise<any[]>} Frameworks needing audits
 *
 * @example
 * const upcoming = await getFrameworksNeedingAudit(ComplianceFramework, 60);
 */
export async function getFrameworksNeedingAudit(
  frameworkModel: typeof Model,
  daysAhead: number = 60
): Promise<any[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return await frameworkModel.findAll({
    where: {
      nextAuditDate: {
        [Op.lte]: futureDate,
        [Op.gte]: new Date(),
      },
      status: { [Op.in]: ['implementing', 'operational', 'certified'] },
    },
    order: [['nextAuditDate', 'ASC']],
  });
}

// ============================================================================
// CONTROL MANAGEMENT UTILITIES (19-26)
// ============================================================================

/**
 * Creates a compliance control.
 *
 * @param {typeof Model} controlModel - Control model
 * @param {ComplianceControl} control - Control data
 * @returns {Promise<any>} Created control
 *
 * @example
 * await createComplianceControl(ComplianceControl, {
 *   frameworkId: 'framework-123',
 *   controlId: 'CC6.1',
 *   controlName: 'Logical Access Controls',
 *   controlType: 'preventive',
 *   domain: 'Access Control',
 *   description: 'Implement logical access controls',
 *   objective: 'Prevent unauthorized access',
 *   testingFrequency: 'quarterly',
 *   automationLevel: 'semi_automated',
 *   priority: 'high',
 *   status: 'not_implemented',
 *   owner: 'user-123'
 * });
 */
export async function createComplianceControl(
  controlModel: typeof Model,
  control: ComplianceControl
): Promise<any> {
  const validated = complianceControlSchema.parse(control);
  return await controlModel.create(validated);
}

/**
 * Performs control effectiveness testing.
 *
 * @param {typeof Model} controlModel - Control model
 * @param {string} controlId - Control ID
 * @param {TestResult} testResult - Test result data
 * @returns {Promise<any>} Updated control
 *
 * @example
 * await performControlTest(ComplianceControl, 'control-123', {
 *   testDate: new Date(),
 *   tester: 'user-456',
 *   testMethod: 'reperformance',
 *   result: 'pass',
 *   findings: [],
 *   evidence: ['evidence-1', 'evidence-2']
 * });
 */
export async function performControlTest(
  controlModel: typeof Model,
  controlId: string,
  testResult: TestResult
): Promise<any> {
  const validated = testResultSchema.parse(testResult);
  const control = await controlModel.findByPk(controlId);
  if (!control) {
    throw new Error(`Control ${controlId} not found`);
  }

  const testResults = [...(control.testResults || []), validated];
  const newStatus = testResult.result === 'pass' ? 'effective' :
                    testResult.result === 'fail' ? 'ineffective' : control.status;

  return await control.update({
    testResults,
    lastTestedDate: testResult.testDate,
    status: newStatus,
  });
}

/**
 * Calculates next test date based on frequency.
 *
 * @param {Date} lastTestDate - Last test date
 * @param {'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'} frequency - Testing frequency
 * @returns {Date} Next test date
 *
 * @example
 * const nextTest = calculateNextTestDate(new Date(), 'quarterly');
 */
export function calculateNextTestDate(
  lastTestDate: Date,
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
): Date {
  const next = new Date(lastTestDate);
  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'annual':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

/**
 * Gets controls requiring testing.
 *
 * @param {typeof Model} controlModel - Control model
 * @returns {Promise<any[]>} Controls due for testing
 *
 * @example
 * const dueControls = await getControlsDueForTesting(ComplianceControl);
 */
export async function getControlsDueForTesting(controlModel: typeof Model): Promise<any[]> {
  return await controlModel.findAll({
    where: {
      nextTestDate: { [Op.lte]: new Date() },
      status: { [Op.in]: ['implemented', 'effective'] },
    },
    order: [['priority', 'DESC'], ['nextTestDate', 'ASC']],
  });
}

/**
 * Gets control effectiveness rate.
 *
 * @param {any[]} controls - Controls to analyze
 * @returns {number} Effectiveness rate percentage
 *
 * @example
 * const rate = getControlEffectivenessRate(controls);
 */
export function getControlEffectivenessRate(controls: any[]): number {
  if (controls.length === 0) return 0;
  const effective = controls.filter(c => c.status === 'effective').length;
  return (effective / controls.length) * 100;
}

/**
 * Gets controls by domain.
 *
 * @param {typeof Model} controlModel - Control model
 * @param {string} frameworkId - Framework ID
 * @param {string} domain - Domain name
 * @returns {Promise<any[]>} Domain controls
 *
 * @example
 * const accessControls = await getControlsByDomain(ComplianceControl, 'framework-123', 'Access Control');
 */
export async function getControlsByDomain(
  controlModel: typeof Model,
  frameworkId: string,
  domain: string
): Promise<any[]> {
  return await controlModel.findAll({
    where: { frameworkId, domain },
    order: [['controlId', 'ASC']],
  });
}

/**
 * Updates control implementation status.
 *
 * @param {typeof Model} controlModel - Control model
 * @param {string} controlId - Control ID
 * @param {'not_implemented' | 'in_progress' | 'implemented' | 'effective' | 'ineffective'} status - New status
 * @returns {Promise<any>} Updated control
 *
 * @example
 * await updateControlStatus(ComplianceControl, 'control-123', 'implemented');
 */
export async function updateControlStatus(
  controlModel: typeof Model,
  controlId: string,
  status: 'not_implemented' | 'in_progress' | 'implemented' | 'effective' | 'ineffective'
): Promise<any> {
  const control = await controlModel.findByPk(controlId);
  if (!control) {
    throw new Error(`Control ${controlId} not found`);
  }

  const updates: any = { status };
  if (status === 'implemented' && !control.implementationDate) {
    updates.implementationDate = new Date();
  }

  return await control.update(updates);
}

/**
 * Gets critical controls with issues.
 *
 * @param {typeof Model} controlModel - Control model
 * @param {string} frameworkId - Framework ID
 * @returns {Promise<any[]>} Critical controls needing attention
 *
 * @example
 * const critical = await getCriticalControlsWithIssues(ComplianceControl, 'framework-123');
 */
export async function getCriticalControlsWithIssues(
  controlModel: typeof Model,
  frameworkId: string
): Promise<any[]> {
  return await controlModel.findAll({
    where: {
      frameworkId,
      priority: 'critical',
      status: { [Op.in]: ['not_implemented', 'in_progress', 'ineffective'] },
    },
    order: [['priority', 'DESC']],
  });
}

// ============================================================================
// AUDIT MANAGEMENT UTILITIES (27-32)
// ============================================================================

/**
 * Creates a new audit.
 *
 * @param {typeof Model} auditModel - Audit model
 * @param {Audit} audit - Audit data
 * @returns {Promise<any>} Created audit
 *
 * @example
 * await createAudit(Audit, {
 *   auditName: 'SOC 2 Type II Audit 2024',
 *   auditType: 'certification',
 *   frameworkId: 'framework-123',
 *   scope: ['All controls'],
 *   startDate: new Date(),
 *   status: 'planned',
 *   leadAuditor: 'auditor-123',
 *   auditTeam: ['auditor-456', 'auditor-789'],
 *   objectives: ['Assess control effectiveness']
 * });
 */
export async function createAudit(auditModel: typeof Model, audit: Audit): Promise<any> {
  const validated = auditSchema.parse(audit);
  return await auditModel.create(validated);
}

/**
 * Adds audit finding.
 *
 * @param {typeof Model} auditModel - Audit model
 * @param {string} auditId - Audit ID
 * @param {AuditFinding} finding - Finding data
 * @returns {Promise<any>} Updated audit
 *
 * @example
 * await addAuditFinding(Audit, 'audit-123', {
 *   findingId: 'finding-1',
 *   severity: 'high',
 *   category: 'Access Control',
 *   title: 'Missing MFA',
 *   description: 'MFA not enabled for admin users',
 *   impact: 'Increased risk of unauthorized access',
 *   recommendation: 'Enable MFA for all administrative accounts',
 *   evidence: ['screenshot-1'],
 *   status: 'open'
 * });
 */
export async function addAuditFinding(
  auditModel: typeof Model,
  auditId: string,
  finding: AuditFinding
): Promise<any> {
  const validated = auditFindingSchema.parse(finding);
  const audit = await auditModel.findByPk(auditId);
  if (!audit) {
    throw new Error(`Audit ${auditId} not found`);
  }

  const findings = [...(audit.findings || []), validated];
  return await audit.update({ findings });
}

/**
 * Updates audit status.
 *
 * @param {typeof Model} auditModel - Audit model
 * @param {string} auditId - Audit ID
 * @param {'planned' | 'in_progress' | 'fieldwork' | 'reporting' | 'completed' | 'cancelled'} status - New status
 * @returns {Promise<any>} Updated audit
 *
 * @example
 * await updateAuditStatus(Audit, 'audit-123', 'in_progress');
 */
export async function updateAuditStatus(
  auditModel: typeof Model,
  auditId: string,
  status: 'planned' | 'in_progress' | 'fieldwork' | 'reporting' | 'completed' | 'cancelled'
): Promise<any> {
  const audit = await auditModel.findByPk(auditId);
  if (!audit) {
    throw new Error(`Audit ${auditId} not found`);
  }

  const updates: any = { status };
  if (status === 'completed' && !audit.completedDate) {
    updates.completedDate = new Date();
  }

  return await audit.update(updates);
}

/**
 * Gets audit findings by severity.
 *
 * @param {typeof Model} auditModel - Audit model
 * @param {string} auditId - Audit ID
 * @param {'low' | 'medium' | 'high' | 'critical'} severity - Severity level
 * @returns {Promise<AuditFinding[]>} Findings at severity level
 *
 * @example
 * const critical = await getAuditFindingsBySeverity(Audit, 'audit-123', 'critical');
 */
export async function getAuditFindingsBySeverity(
  auditModel: typeof Model,
  auditId: string,
  severity: 'low' | 'medium' | 'high' | 'critical'
): Promise<AuditFinding[]> {
  const audit = await auditModel.findByPk(auditId);
  if (!audit) {
    throw new Error(`Audit ${auditId} not found`);
  }

  return (audit.findings || []).filter(f => f.severity === severity);
}

/**
 * Gets active audits for a framework.
 *
 * @param {typeof Model} auditModel - Audit model
 * @param {string} frameworkId - Framework ID
 * @returns {Promise<any[]>} Active audits
 *
 * @example
 * const active = await getActiveAudits(Audit, 'framework-123');
 */
export async function getActiveAudits(
  auditModel: typeof Model,
  frameworkId: string
): Promise<any[]> {
  return await auditModel.findAll({
    where: {
      frameworkId,
      status: { [Op.in]: ['planned', 'in_progress', 'fieldwork', 'reporting'] },
    },
    order: [['startDate', 'ASC']],
  });
}

/**
 * Closes audit with report.
 *
 * @param {typeof Model} auditModel - Audit model
 * @param {string} auditId - Audit ID
 * @param {string} reportUrl - Report URL
 * @param {string[]} recommendations - Audit recommendations
 * @returns {Promise<any>} Closed audit
 *
 * @example
 * await closeAudit(Audit, 'audit-123', 'https://reports.com/audit-123', ['Implement MFA', 'Update policies']);
 */
export async function closeAudit(
  auditModel: typeof Model,
  auditId: string,
  reportUrl: string,
  recommendations: string[]
): Promise<any> {
  const audit = await auditModel.findByPk(auditId);
  if (!audit) {
    throw new Error(`Audit ${auditId} not found`);
  }

  return await audit.update({
    status: 'completed',
    completedDate: new Date(),
    reportDate: new Date(),
    reportUrl,
    recommendations,
  });
}

// ============================================================================
// GAP ANALYSIS UTILITIES (33-38)
// ============================================================================

/**
 * Identifies compliance gap.
 *
 * @param {typeof Model} gapModel - Gap model
 * @param {ComplianceGap} gap - Gap data
 * @returns {Promise<any>} Created gap
 *
 * @example
 * await identifyComplianceGap(ComplianceGap, {
 *   frameworkId: 'framework-123',
 *   gapType: 'control',
 *   severity: 'high',
 *   title: 'Missing MFA Implementation',
 *   description: 'MFA not implemented for administrative access',
 *   currentState: 'Single factor authentication only',
 *   requiredState: 'Multi-factor authentication required',
 *   impactedControls: ['CC6.1'],
 *   businessImpact: 'Increased security risk',
 *   identifiedDate: new Date(),
 *   status: 'identified'
 * });
 */
export async function identifyComplianceGap(
  gapModel: typeof Model,
  gap: ComplianceGap
): Promise<any> {
  const validated = complianceGapSchema.parse(gap);
  return await gapModel.create(validated);
}

/**
 * Updates gap remediation status.
 *
 * @param {typeof Model} gapModel - Gap model
 * @param {string} gapId - Gap ID
 * @param {'identified' | 'planning' | 'in_progress' | 'resolved' | 'accepted'} status - New status
 * @returns {Promise<any>} Updated gap
 *
 * @example
 * await updateGapStatus(ComplianceGap, 'gap-123', 'in_progress');
 */
export async function updateGapStatus(
  gapModel: typeof Model,
  gapId: string,
  status: 'identified' | 'planning' | 'in_progress' | 'resolved' | 'accepted'
): Promise<any> {
  const gap = await gapModel.findByPk(gapId);
  if (!gap) {
    throw new Error(`Gap ${gapId} not found`);
  }

  const updates: any = { status };
  if (status === 'resolved' && !gap.resolvedDate) {
    updates.resolvedDate = new Date();
  }

  return await gap.update(updates);
}

/**
 * Gets critical gaps requiring immediate attention.
 *
 * @param {typeof Model} gapModel - Gap model
 * @param {string} frameworkId - Framework ID
 * @returns {Promise<any[]>} Critical gaps
 *
 * @example
 * const critical = await getCriticalGaps(ComplianceGap, 'framework-123');
 */
export async function getCriticalGaps(
  gapModel: typeof Model,
  frameworkId: string
): Promise<any[]> {
  return await gapModel.findAll({
    where: {
      frameworkId,
      severity: { [Op.in]: ['high', 'critical'] },
      status: { [Op.in]: ['identified', 'planning', 'in_progress'] },
    },
    order: [['severity', 'DESC'], ['identifiedDate', 'ASC']],
  });
}

/**
 * Generates gap analysis report.
 *
 * @param {typeof Model} gapModel - Gap model
 * @param {string} frameworkId - Framework ID
 * @returns {Promise<Record<string, any>>} Gap analysis summary
 *
 * @example
 * const report = await generateGapAnalysisReport(ComplianceGap, 'framework-123');
 */
export async function generateGapAnalysisReport(
  gapModel: typeof Model,
  frameworkId: string
): Promise<Record<string, any>> {
  const gaps = await gapModel.findAll({ where: { frameworkId } });

  return {
    totalGaps: gaps.length,
    bySeverity: {
      critical: gaps.filter(g => g.severity === 'critical').length,
      high: gaps.filter(g => g.severity === 'high').length,
      medium: gaps.filter(g => g.severity === 'medium').length,
      low: gaps.filter(g => g.severity === 'low').length,
    },
    byType: {
      control: gaps.filter(g => g.gapType === 'control').length,
      policy: gaps.filter(g => g.gapType === 'policy').length,
      process: gaps.filter(g => g.gapType === 'process').length,
      documentation: gaps.filter(g => g.gapType === 'documentation').length,
      technical: gaps.filter(g => g.gapType === 'technical').length,
    },
    byStatus: {
      identified: gaps.filter(g => g.status === 'identified').length,
      planning: gaps.filter(g => g.status === 'planning').length,
      inProgress: gaps.filter(g => g.status === 'in_progress').length,
      resolved: gaps.filter(g => g.status === 'resolved').length,
      accepted: gaps.filter(g => g.status === 'accepted').length,
    },
  };
}

/**
 * Gets gaps by type.
 *
 * @param {typeof Model} gapModel - Gap model
 * @param {string} frameworkId - Framework ID
 * @param {'control' | 'policy' | 'process' | 'documentation' | 'technical'} gapType - Gap type
 * @returns {Promise<any[]>} Gaps of specified type
 *
 * @example
 * const controlGaps = await getGapsByType(ComplianceGap, 'framework-123', 'control');
 */
export async function getGapsByType(
  gapModel: typeof Model,
  frameworkId: string,
  gapType: 'control' | 'policy' | 'process' | 'documentation' | 'technical'
): Promise<any[]> {
  return await gapModel.findAll({
    where: { frameworkId, gapType },
    order: [['severity', 'DESC'], ['identifiedDate', 'ASC']],
  });
}

/**
 * Assigns gap for remediation.
 *
 * @param {typeof Model} gapModel - Gap model
 * @param {string} gapId - Gap ID
 * @param {string} assignedTo - User ID
 * @param {Date} targetDate - Target completion date
 * @param {string} remediationPlan - Remediation plan
 * @returns {Promise<any>} Updated gap
 *
 * @example
 * await assignGapRemediation(ComplianceGap, 'gap-123', 'user-456', new Date('2024-12-31'), 'Implement MFA');
 */
export async function assignGapRemediation(
  gapModel: typeof Model,
  gapId: string,
  assignedTo: string,
  targetDate: Date,
  remediationPlan: string
): Promise<any> {
  const gap = await gapModel.findByPk(gapId);
  if (!gap) {
    throw new Error(`Gap ${gapId} not found`);
  }

  return await gap.update({
    assignedTo,
    targetDate,
    remediationPlan,
    status: 'planning',
  });
}

// ============================================================================
// CERTIFICATION MANAGEMENT UTILITIES (39-44)
// ============================================================================

/**
 * Registers a new certification.
 *
 * @param {typeof Model} certificationModel - Certification model
 * @param {Certification} certification - Certification data
 * @returns {Promise<any>} Created certification
 *
 * @example
 * await registerCertification(Certification, {
 *   frameworkId: 'framework-123',
 *   certificationType: 'SOC 2 Type II',
 *   certificationBody: 'AICPA',
 *   issueDate: new Date(),
 *   expirationDate: new Date('2025-12-31'),
 *   status: 'active',
 *   scope: ['All controls'],
 *   renewalRequired: true
 * });
 */
export async function registerCertification(
  certificationModel: typeof Model,
  certification: Certification
): Promise<any> {
  const validated = certificationSchema.parse(certification);
  return await certificationModel.create(validated);
}

/**
 * Gets certifications expiring soon.
 *
 * @param {typeof Model} certificationModel - Certification model
 * @param {number} daysAhead - Days to look ahead
 * @returns {Promise<any[]>} Expiring certifications
 *
 * @example
 * const expiring = await getExpiringCertifications(Certification, 90);
 */
export async function getExpiringCertifications(
  certificationModel: typeof Model,
  daysAhead: number = 90
): Promise<any[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return await certificationModel.findAll({
    where: {
      expirationDate: {
        [Op.between]: [new Date(), futureDate],
      },
      status: 'active',
    },
    order: [['expirationDate', 'ASC']],
  });
}

/**
 * Updates certification status.
 *
 * @param {typeof Model} certificationModel - Certification model
 * @param {string} certificationId - Certification ID
 * @param {'active' | 'expiring_soon' | 'expired' | 'suspended' | 'revoked'} status - New status
 * @returns {Promise<any>} Updated certification
 *
 * @example
 * await updateCertificationStatus(Certification, 'cert-123', 'expiring_soon');
 */
export async function updateCertificationStatus(
  certificationModel: typeof Model,
  certificationId: string,
  status: 'active' | 'expiring_soon' | 'expired' | 'suspended' | 'revoked'
): Promise<any> {
  const certification = await certificationModel.findByPk(certificationId);
  if (!certification) {
    throw new Error(`Certification ${certificationId} not found`);
  }

  return await certification.update({ status });
}

/**
 * Schedules certification renewal.
 *
 * @param {typeof Model} certificationModel - Certification model
 * @param {string} certificationId - Certification ID
 * @param {Date} renewalDate - Renewal date
 * @returns {Promise<any>} Updated certification
 *
 * @example
 * await scheduleCertificationRenewal(Certification, 'cert-123', new Date('2024-10-01'));
 */
export async function scheduleCertificationRenewal(
  certificationModel: typeof Model,
  certificationId: string,
  renewalDate: Date
): Promise<any> {
  const certification = await certificationModel.findByPk(certificationId);
  if (!certification) {
    throw new Error(`Certification ${certificationId} not found`);
  }

  return await certification.update({ renewalDate });
}

/**
 * Gets active certifications for a framework.
 *
 * @param {typeof Model} certificationModel - Certification model
 * @param {string} frameworkId - Framework ID
 * @returns {Promise<any[]>} Active certifications
 *
 * @example
 * const certs = await getActiveCertifications(Certification, 'framework-123');
 */
export async function getActiveCertifications(
  certificationModel: typeof Model,
  frameworkId: string
): Promise<any[]> {
  return await certificationModel.findAll({
    where: {
      frameworkId,
      status: 'active',
    },
    order: [['expirationDate', 'ASC']],
  });
}

/**
 * Calculates certification coverage.
 *
 * @param {any[]} certifications - Active certifications
 * @param {any[]} frameworks - All frameworks
 * @returns {number} Coverage percentage
 *
 * @example
 * const coverage = calculateCertificationCoverage(certifications, frameworks);
 */
export function calculateCertificationCoverage(
  certifications: any[],
  frameworks: any[]
): number {
  if (frameworks.length === 0) return 0;

  const certifiedFrameworks = new Set(
    certifications
      .filter(c => c.status === 'active')
      .map(c => c.frameworkId)
  );

  const certifiableFrameworks = frameworks.filter(
    f => f.certificationRequired
  ).length;

  if (certifiableFrameworks === 0) return 100;

  return (certifiedFrameworks.size / certifiableFrameworks) * 100;
}

// ============================================================================
// REGULATORY & REPORTING UTILITIES (45-51)
// ============================================================================

/**
 * Tracks new regulatory requirement.
 *
 * @param {typeof Model} requirementModel - Regulatory requirement model (custom model)
 * @param {RegulatoryRequirement} requirement - Requirement data
 * @returns {Promise<any>} Created requirement
 *
 * @example
 * await trackRegulatoryRequirement(RegulatoryRequirement, {
 *   requirementId: 'HIPAA-164.308',
 *   regulatoryBody: 'HHS',
 *   regulationType: 'regulation',
 *   jurisdiction: 'USA',
 *   title: 'Administrative Safeguards',
 *   description: 'Implement administrative safeguards',
 *   effectiveDate: new Date(),
 *   applicability: ['Healthcare'],
 *   status: 'applicable',
 *   owner: 'user-123',
 *   relatedControls: ['control-456']
 * });
 */
export async function trackRegulatoryRequirement(
  requirementModel: typeof Model,
  requirement: RegulatoryRequirement
): Promise<any> {
  return await requirementModel.create(requirement);
}

/**
 * Collects compliance evidence.
 *
 * @param {typeof Model} evidenceModel - Evidence model (custom model)
 * @param {Evidence} evidence - Evidence data
 * @returns {Promise<any>} Created evidence
 *
 * @example
 * await collectEvidence(Evidence, {
 *   evidenceType: 'document',
 *   title: 'Security Policy Document',
 *   description: 'Annual security policy review',
 *   relatedControlIds: ['control-123'],
 *   relatedAuditIds: ['audit-456'],
 *   collectedDate: new Date(),
 *   collectedBy: 'user-789',
 *   fileUrl: 'https://docs.com/policy.pdf',
 *   confidentialityLevel: 'internal',
 *   tags: ['policy', 'security']
 * });
 */
export async function collectEvidence(
  evidenceModel: typeof Model,
  evidence: Evidence
): Promise<any> {
  // Calculate file hash if URL provided
  if (evidence.fileUrl && !evidence.fileHash) {
    evidence.fileHash = crypto
      .createHash('sha256')
      .update(evidence.fileUrl + evidence.collectedDate.toISOString())
      .digest('hex');
  }

  return await evidenceModel.create(evidence);
}

/**
 * Creates remediation plan for findings.
 *
 * @param {typeof Model} remediationModel - Remediation model (custom model)
 * @param {Remediation} remediation - Remediation data
 * @returns {Promise<any>} Created remediation plan
 *
 * @example
 * await createRemediationPlan(Remediation, {
 *   findingId: 'finding-123',
 *   title: 'Implement MFA',
 *   description: 'Enable multi-factor authentication for all users',
 *   priority: 'high',
 *   assignedTo: 'user-456',
 *   assignedDate: new Date(),
 *   dueDate: new Date('2024-12-31'),
 *   status: 'open',
 *   completionPercentage: 0,
 *   tasks: [],
 *   resources: ['IT Team', 'Security Team']
 * });
 */
export async function createRemediationPlan(
  remediationModel: typeof Model,
  remediation: Remediation
): Promise<any> {
  return await remediationModel.create(remediation);
}

/**
 * Generates compliance report.
 *
 * @param {typeof Model} reportModel - Report model (custom model)
 * @param {typeof Model} frameworkModel - Framework model
 * @param {typeof Model} controlModel - Control model
 * @param {string} frameworkId - Framework ID
 * @param {string} reportingPeriod - Reporting period
 * @param {string} generatedBy - User generating report
 * @returns {Promise<any>} Generated report
 *
 * @example
 * const report = await generateComplianceReport(
 *   ComplianceReport,
 *   ComplianceFramework,
 *   ComplianceControl,
 *   'framework-123',
 *   '2024-Q1',
 *   'user-456'
 * );
 */
export async function generateComplianceReport(
  reportModel: typeof Model,
  frameworkModel: typeof Model,
  controlModel: typeof Model,
  frameworkId: string,
  reportingPeriod: string,
  generatedBy: string
): Promise<any> {
  const framework = await frameworkModel.findByPk(frameworkId);
  if (!framework) {
    throw new Error(`Framework ${frameworkId} not found`);
  }

  const controls = await controlModel.findAll({ where: { frameworkId } });

  const metrics: ComplianceMetric[] = [
    {
      metricName: 'Control Implementation Rate',
      category: 'implementation',
      value: (controls.filter(c => c.status === 'implemented' || c.status === 'effective').length / controls.length) * 100,
      unit: 'percentage',
      target: 100,
      threshold: 80,
      trend: 'up',
      status: 'on_track',
    },
    {
      metricName: 'Control Effectiveness Rate',
      category: 'effectiveness',
      value: getControlEffectivenessRate(controls),
      unit: 'percentage',
      target: 95,
      threshold: 85,
      trend: 'up',
      status: 'on_track',
    },
  ];

  const summary = `Compliance report for ${framework.frameworkName} - ${reportingPeriod}. ` +
    `${controls.length} total controls, ` +
    `${controls.filter(c => c.status === 'effective').length} effective.`;

  return await reportModel.create({
    reportName: `${framework.frameworkName} Compliance Report - ${reportingPeriod}`,
    reportType: 'detailed',
    frameworkId,
    reportingPeriod,
    generatedDate: new Date(),
    generatedBy,
    recipients: framework.stakeholders || [],
    status: 'draft',
    metrics,
    summary,
    trends: [],
    recommendations: [],
    attachments: [],
  });
}

/**
 * Automates control testing.
 *
 * @param {typeof Model} controlModel - Control model
 * @param {string} controlId - Control ID
 * @param {() => Promise<boolean>} automationScript - Automation script to execute
 * @returns {Promise<TestResult>} Test result
 *
 * @example
 * const result = await automateControlTest(
 *   ComplianceControl,
 *   'control-123',
 *   async () => {
 *     // Automated test logic
 *     return true;
 *   }
 * );
 */
export async function automateControlTest(
  controlModel: typeof Model,
  controlId: string,
  automationScript: () => Promise<boolean>
): Promise<TestResult> {
  const control = await controlModel.findByPk(controlId);
  if (!control) {
    throw new Error(`Control ${controlId} not found`);
  }

  if (control.automationLevel === 'manual') {
    throw new Error(`Control ${controlId} is not configured for automation`);
  }

  const testDate = new Date();
  let result: 'pass' | 'fail' = 'fail';
  const findings: string[] = [];

  try {
    const scriptResult = await automationScript();
    result = scriptResult ? 'pass' : 'fail';
    if (!scriptResult) {
      findings.push('Automated test failed - control not operating as expected');
    }
  } catch (error) {
    findings.push(`Automation error: ${error.message}`);
  }

  const testResult: TestResult = {
    testDate,
    tester: 'automated-system',
    testMethod: 'automated',
    result,
    findings,
    evidence: [`automated-test-${testDate.toISOString()}`],
    notes: `Automated test executed at ${testDate.toISOString()}`,
  };

  await performControlTest(controlModel, controlId, testResult);

  return testResult;
}

/**
 * Calculates compliance dashboard metrics.
 *
 * @param {typeof Model} frameworkModel - Framework model
 * @param {typeof Model} controlModel - Control model
 * @param {typeof Model} auditModel - Audit model
 * @param {typeof Model} gapModel - Gap model
 * @returns {Promise<Record<string, any>>} Dashboard metrics
 *
 * @example
 * const metrics = await getComplianceDashboard(
 *   ComplianceFramework,
 *   ComplianceControl,
 *   Audit,
 *   ComplianceGap
 * );
 */
export async function getComplianceDashboard(
  frameworkModel: typeof Model,
  controlModel: typeof Model,
  auditModel: typeof Model,
  gapModel: typeof Model
): Promise<Record<string, any>> {
  const frameworks = await frameworkModel.findAll();
  const controls = await controlModel.findAll();
  const audits = await auditModel.findAll({
    where: {
      status: { [Op.in]: ['in_progress', 'fieldwork', 'reporting'] },
    },
  });
  const gaps = await gapModel.findAll({
    where: {
      status: { [Op.in]: ['identified', 'planning', 'in_progress'] },
    },
  });

  return {
    summary: {
      totalFrameworks: frameworks.length,
      certifiedFrameworks: frameworks.filter(f => f.status === 'certified').length,
      totalControls: controls.length,
      effectiveControls: controls.filter(c => c.status === 'effective').length,
      activeAudits: audits.length,
      openGaps: gaps.length,
      criticalGaps: gaps.filter(g => g.severity === 'critical').length,
    },
    controlsByStatus: {
      notImplemented: controls.filter(c => c.status === 'not_implemented').length,
      inProgress: controls.filter(c => c.status === 'in_progress').length,
      implemented: controls.filter(c => c.status === 'implemented').length,
      effective: controls.filter(c => c.status === 'effective').length,
      ineffective: controls.filter(c => c.status === 'ineffective').length,
    },
    frameworksByType: frameworks.reduce((acc, f) => {
      acc[f.frameworkType] = (acc[f.frameworkType] || 0) + 1;
      return acc;
    }, {}),
    riskMetrics: {
      overallMaturity: calculateFrameworkMaturity(controls),
      effectivenessRate: getControlEffectivenessRate(controls),
      controlsDueForTesting: controls.filter(c =>
        c.nextTestDate && c.nextTestDate <= new Date()
      ).length,
    },
  };
}

/**
 * Monitors regulatory changes and updates.
 *
 * @param {typeof Model} requirementModel - Requirement model (custom model)
 * @param {string} jurisdiction - Jurisdiction to monitor
 * @param {Date} sinceDate - Monitor changes since date
 * @returns {Promise<any[]>} New or updated requirements
 *
 * @example
 * const changes = await monitorRegulatoryChanges(
 *   RegulatoryRequirement,
 *   'USA',
 *   new Date('2024-01-01')
 * );
 */
export async function monitorRegulatoryChanges(
  requirementModel: typeof Model,
  jurisdiction: string,
  sinceDate: Date
): Promise<any[]> {
  return await requirementModel.findAll({
    where: {
      jurisdiction,
      [Op.or]: [
        { createdAt: { [Op.gte]: sinceDate } },
        { updatedAt: { [Op.gte]: sinceDate } },
      ],
    },
    order: [['effectiveDate', 'DESC']],
  });
}

// ============================================================================
// SWAGGER DTOs
// ============================================================================

export class CreateFrameworkDto {
  @ApiProperty({ example: 'SOC 2 Type II' })
  frameworkName: string;

  @ApiProperty({ enum: ['soc2', 'iso27001', 'nist', 'hipaa', 'gdpr', 'pci_dss', 'custom'] })
  frameworkType: string;

  @ApiProperty({ example: '2024' })
  version: string;

  @ApiProperty()
  certificationRequired: boolean;

  @ApiProperty({ enum: ['monthly', 'quarterly', 'semi_annual', 'annual', 'biennial'] })
  auditFrequency: string;

  @ApiProperty()
  owner: string;

  @ApiProperty({ type: [String] })
  stakeholders: string[];
}

export class CreateControlDto {
  @ApiProperty()
  frameworkId: string;

  @ApiProperty({ example: 'CC6.1' })
  controlId: string;

  @ApiProperty({ example: 'Logical Access Controls' })
  controlName: string;

  @ApiProperty({ enum: ['preventive', 'detective', 'corrective', 'directive'] })
  controlType: string;

  @ApiProperty({ example: 'Access Control' })
  domain: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  objective: string;

  @ApiProperty({ enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annual'] })
  testingFrequency: string;

  @ApiProperty()
  owner: string;
}

export class CreateAuditDto {
  @ApiProperty({ example: 'SOC 2 Type II Audit 2024' })
  auditName: string;

  @ApiProperty({ enum: ['internal', 'external', 'certification', 'surveillance', 'special'] })
  auditType: string;

  @ApiProperty()
  frameworkId: string;

  @ApiProperty({ type: [String] })
  scope: string[];

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  leadAuditor: string;

  @ApiProperty({ type: [String] })
  objectives: string[];
}

export class CreateGapDto {
  @ApiProperty()
  frameworkId: string;

  @ApiProperty({ enum: ['control', 'policy', 'process', 'documentation', 'technical'] })
  gapType: string;

  @ApiProperty({ enum: ['low', 'medium', 'high', 'critical'] })
  severity: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  currentState: string;

  @ApiProperty()
  requiredState: string;

  @ApiProperty({ type: [String] })
  impactedControls: string[];

  @ApiProperty()
  businessImpact: string;
}

export class CreateCertificationDto {
  @ApiProperty()
  frameworkId: string;

  @ApiProperty()
  certificationType: string;

  @ApiProperty()
  certificationBody: string;

  @ApiProperty()
  issueDate: Date;

  @ApiProperty()
  expirationDate: Date;

  @ApiProperty({ type: [String] })
  scope: string[];

  @ApiProperty()
  renewalRequired: boolean;
}
