/**
 * LOC: VNDRISK7890123
 * File: /reuse/threat/vendor-risk-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS vendor management services
 *   - Third-party risk assessment modules
 *   - Vendor security monitoring
 *   - Due diligence workflows
 *   - Contract security compliance
 */

/**
 * File: /reuse/threat/vendor-risk-management-kit.ts
 * Locator: WC-UTL-VNDRISK-001
 * Purpose: Comprehensive Vendor Risk Management Kit - Complete vendor risk assessment and monitoring toolkit for NestJS
 *
 * Upstream: Independent utility module for vendor risk operations
 * Downstream: ../backend/*, Vendor services, Risk assessment modules, Security services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, Sequelize, crypto
 * Exports: 38 utility functions for vendor risk assessment, security questionnaires, due diligence, scorecards, incident tracking
 *
 * LLM Context: Enterprise-grade vendor risk management utilities for White Cross healthcare platform.
 * Provides comprehensive vendor risk assessment, security questionnaires, due diligence workflows,
 * vendor security scorecards, contract security requirements, vendor incident tracking, continuous monitoring,
 * risk scoring, vendor onboarding/offboarding, and third-party security validation.
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

interface VendorProfile {
  id?: string;
  vendorName: string;
  vendorType: 'saas' | 'infrastructure' | 'consulting' | 'hardware' | 'other';
  website?: string;
  primaryContact: string;
  contactEmail: string;
  contactPhone?: string;
  businessAddress?: string;
  taxId?: string;
  dunsNumber?: string;
  yearEstablished?: number;
  employeeCount?: number;
  annualRevenue?: number;
  description?: string;
  servicesProvided: string[];
  dataAccess: 'none' | 'limited' | 'full' | 'administrative';
  criticalityLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'prospect' | 'active' | 'suspended' | 'terminated';
  metadata?: Record<string, any>;
}

interface VendorRiskAssessment {
  id?: string;
  vendorId: string;
  assessmentDate: Date;
  assessmentType: 'initial' | 'annual' | 'ongoing' | 'incident_triggered';
  assessedBy: string;
  overallRiskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  securityScore: number;
  privacyScore: number;
  complianceScore: number;
  financialScore: number;
  operationalScore: number;
  findings: string[];
  recommendations: string[];
  nextReviewDate?: Date;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'remediation_required';
  approvedBy?: string;
  approvedAt?: Date;
  metadata?: Record<string, any>;
}

interface SecurityQuestionnaire {
  id?: string;
  vendorId: string;
  questionnaireType: 'soc2' | 'iso27001' | 'hipaa' | 'custom';
  version: string;
  sentDate: Date;
  dueDate?: Date;
  completedDate?: Date;
  completedBy?: string;
  status: 'draft' | 'sent' | 'in_progress' | 'completed' | 'expired';
  questions: QuestionnaireQuestion[];
  overallScore?: number;
  gaps: string[];
  reviewedBy?: string;
  reviewedAt?: Date;
  metadata?: Record<string, any>;
}

interface QuestionnaireQuestion {
  questionId: string;
  category: string;
  question: string;
  answer?: string;
  evidence?: string[];
  score?: number;
  weight: number;
  compliant: boolean;
  notes?: string;
}

interface VendorDueDiligence {
  id?: string;
  vendorId: string;
  dueDiligenceType: 'initial' | 'enhanced' | 'simplified';
  initiatedDate: Date;
  completedDate?: Date;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  checklistItems: DueDiligenceItem[];
  documentsCollected: string[];
  backgroundCheckCompleted: boolean;
  financialReviewCompleted: boolean;
  securityReviewCompleted: boolean;
  legalReviewCompleted: boolean;
  referenceCheckCompleted: boolean;
  overallResult: 'pass' | 'pass_with_conditions' | 'fail' | 'pending';
  conditions?: string[];
  reviewedBy?: string;
  metadata?: Record<string, any>;
}

interface DueDiligenceItem {
  itemId: string;
  category: string;
  description: string;
  required: boolean;
  completed: boolean;
  completedDate?: Date;
  result?: string;
  notes?: string;
}

interface VendorContract {
  id?: string;
  vendorId: string;
  contractNumber: string;
  contractType: 'msa' | 'sow' | 'nda' | 'dpa' | 'baa' | 'sla';
  effectiveDate: Date;
  expirationDate?: Date;
  autoRenewal: boolean;
  renewalNoticeDays?: number;
  contractValue?: number;
  currency?: string;
  paymentTerms?: string;
  securityRequirements: string[];
  complianceRequirements: string[];
  dataProtectionClauses: string[];
  breachNotificationSLA?: number;
  terminationClause?: string;
  liabilityLimit?: number;
  insuranceRequired?: boolean;
  insuranceCoverage?: number;
  status: 'draft' | 'pending_approval' | 'active' | 'expired' | 'terminated';
  metadata?: Record<string, any>;
}

interface VendorIncident {
  id?: string;
  vendorId: string;
  incidentDate: Date;
  reportedDate: Date;
  reportedBy: string;
  incidentType: 'security_breach' | 'data_loss' | 'service_outage' | 'compliance_violation' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  affectedSystems: string[];
  affectedDataTypes: string[];
  recordsAffected?: number;
  rootCause?: string;
  vendorResponse?: string;
  remediationSteps: string[];
  remediationStatus: 'pending' | 'in_progress' | 'completed' | 'verified';
  lessonsLearned?: string;
  closedDate?: Date;
  metadata?: Record<string, any>;
}

interface VendorScorecard {
  id?: string;
  vendorId: string;
  scoringPeriod: string;
  calculatedDate: Date;
  overallScore: number;
  performanceMetrics: ScoreMetric[];
  securityMetrics: ScoreMetric[];
  complianceMetrics: ScoreMetric[];
  financialMetrics: ScoreMetric[];
  trend: 'improving' | 'stable' | 'declining';
  benchmarkComparison?: number;
  recommendations: string[];
  metadata?: Record<string, any>;
}

interface ScoreMetric {
  metricName: string;
  category: string;
  value: number;
  weight: number;
  target?: number;
  threshold?: number;
  status: 'excellent' | 'good' | 'acceptable' | 'poor';
}

interface VendorMonitoring {
  id?: string;
  vendorId: string;
  monitoringType: 'continuous' | 'periodic' | 'event_based';
  frequency: 'realtime' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastCheckDate: Date;
  nextCheckDate?: Date;
  monitoringSources: string[];
  alerts: MonitoringAlert[];
  status: 'active' | 'paused' | 'inactive';
  metadata?: Record<string, any>;
}

interface MonitoringAlert {
  alertId: string;
  alertDate: Date;
  alertType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  description: string;
  actionRequired: boolean;
  actionTaken?: string;
  resolved: boolean;
}

// ============================================================================
// SEQUELIZE MODELS (1-5)
// ============================================================================

/**
 * Sequelize model for Vendor Profiles with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorProfile model
 *
 * @example
 * const VendorProfile = defineVendorProfileModel(sequelize);
 * await VendorProfile.create({
 *   vendorName: 'Acme Cloud Services',
 *   vendorType: 'saas',
 *   primaryContact: 'John Doe',
 *   contactEmail: 'john@acme.com',
 *   criticalityLevel: 'high',
 *   status: 'active'
 * });
 */
export function defineVendorProfileModel(sequelize: Sequelize): typeof Model {
  class VendorProfile extends Model {
    public id!: string;
    public vendorName!: string;
    public vendorType!: 'saas' | 'infrastructure' | 'consulting' | 'hardware' | 'other';
    public website!: string;
    public primaryContact!: string;
    public contactEmail!: string;
    public contactPhone!: string;
    public businessAddress!: string;
    public taxId!: string;
    public dunsNumber!: string;
    public yearEstablished!: number;
    public employeeCount!: number;
    public annualRevenue!: number;
    public description!: string;
    public servicesProvided!: string[];
    public dataAccess!: 'none' | 'limited' | 'full' | 'administrative';
    public criticalityLevel!: 'low' | 'medium' | 'high' | 'critical';
    public status!: 'prospect' | 'active' | 'suspended' | 'terminated';
    public metadata!: Record<string, any>;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  VendorProfile.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      vendorName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'vendor_name',
        validate: {
          notEmpty: true,
          len: [2, 255],
        },
      },
      vendorType: {
        type: DataTypes.ENUM('saas', 'infrastructure', 'consulting', 'hardware', 'other'),
        allowNull: false,
        field: 'vendor_type',
      },
      website: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      primaryContact: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'primary_contact',
      },
      contactEmail: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'contact_email',
        validate: {
          isEmail: true,
        },
      },
      contactPhone: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'contact_phone',
      },
      businessAddress: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'business_address',
      },
      taxId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'tax_id',
      },
      dunsNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'duns_number',
      },
      yearEstablished: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'year_established',
        validate: {
          min: 1800,
          max: new Date().getFullYear(),
        },
      },
      employeeCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'employee_count',
        validate: {
          min: 0,
        },
      },
      annualRevenue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        field: 'annual_revenue',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      servicesProvided: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        field: 'services_provided',
      },
      dataAccess: {
        type: DataTypes.ENUM('none', 'limited', 'full', 'administrative'),
        allowNull: false,
        defaultValue: 'none',
        field: 'data_access',
      },
      criticalityLevel: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'medium',
        field: 'criticality_level',
      },
      status: {
        type: DataTypes.ENUM('prospect', 'active', 'suspended', 'terminated'),
        allowNull: false,
        defaultValue: 'prospect',
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
      tableName: 'vendor_profiles',
      timestamps: true,
      indexes: [
        { fields: ['vendor_name'] },
        { fields: ['vendor_type'] },
        { fields: ['status'] },
        { fields: ['criticality_level'] },
        { fields: ['contact_email'] },
      ],
    }
  );

  return VendorProfile;
}

/**
 * Sequelize model for Vendor Risk Assessments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorRiskAssessment model
 *
 * @example
 * const VendorRiskAssessment = defineVendorRiskAssessmentModel(sequelize);
 * await VendorRiskAssessment.create({
 *   vendorId: 'vendor-123',
 *   assessmentDate: new Date(),
 *   assessmentType: 'annual',
 *   assessedBy: 'user-456',
 *   overallRiskScore: 75,
 *   riskLevel: 'medium'
 * });
 */
export function defineVendorRiskAssessmentModel(sequelize: Sequelize): typeof Model {
  class VendorRiskAssessment extends Model {
    public id!: string;
    public vendorId!: string;
    public assessmentDate!: Date;
    public assessmentType!: 'initial' | 'annual' | 'ongoing' | 'incident_triggered';
    public assessedBy!: string;
    public overallRiskScore!: number;
    public riskLevel!: 'low' | 'medium' | 'high' | 'critical';
    public securityScore!: number;
    public privacyScore!: number;
    public complianceScore!: number;
    public financialScore!: number;
    public operationalScore!: number;
    public findings!: string[];
    public recommendations!: string[];
    public nextReviewDate!: Date;
    public approvalStatus!: 'pending' | 'approved' | 'rejected' | 'remediation_required';
    public approvedBy!: string;
    public approvedAt!: Date;
    public metadata!: Record<string, any>;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  VendorRiskAssessment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'vendor_id',
        references: {
          model: 'vendor_profiles',
          key: 'id',
        },
      },
      assessmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'assessment_date',
      },
      assessmentType: {
        type: DataTypes.ENUM('initial', 'annual', 'ongoing', 'incident_triggered'),
        allowNull: false,
        field: 'assessment_type',
      },
      assessedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'assessed_by',
      },
      overallRiskScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: 'overall_risk_score',
        validate: {
          min: 0,
          max: 100,
        },
      },
      riskLevel: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        field: 'risk_level',
      },
      securityScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'security_score',
        validate: {
          min: 0,
          max: 100,
        },
      },
      privacyScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'privacy_score',
        validate: {
          min: 0,
          max: 100,
        },
      },
      complianceScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'compliance_score',
        validate: {
          min: 0,
          max: 100,
        },
      },
      financialScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'financial_score',
        validate: {
          min: 0,
          max: 100,
        },
      },
      operationalScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'operational_score',
        validate: {
          min: 0,
          max: 100,
        },
      },
      findings: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
      },
      recommendations: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
      },
      nextReviewDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'next_review_date',
      },
      approvalStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'remediation_required'),
        allowNull: false,
        defaultValue: 'pending',
        field: 'approval_status',
      },
      approvedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'approved_by',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'approved_at',
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
      tableName: 'vendor_risk_assessments',
      timestamps: true,
      indexes: [
        { fields: ['vendor_id'] },
        { fields: ['assessment_type'] },
        { fields: ['risk_level'] },
        { fields: ['approval_status'] },
        { fields: ['assessment_date'] },
      ],
    }
  );

  return VendorRiskAssessment;
}

/**
 * Sequelize model for Security Questionnaires.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SecurityQuestionnaire model
 *
 * @example
 * const SecurityQuestionnaire = defineSecurityQuestionnaireModel(sequelize);
 * await SecurityQuestionnaire.create({
 *   vendorId: 'vendor-123',
 *   questionnaireType: 'soc2',
 *   version: '2024.1',
 *   sentDate: new Date(),
 *   status: 'sent'
 * });
 */
export function defineSecurityQuestionnaireModel(sequelize: Sequelize): typeof Model {
  class SecurityQuestionnaire extends Model {
    public id!: string;
    public vendorId!: string;
    public questionnaireType!: 'soc2' | 'iso27001' | 'hipaa' | 'custom';
    public version!: string;
    public sentDate!: Date;
    public dueDate!: Date;
    public completedDate!: Date;
    public completedBy!: string;
    public status!: 'draft' | 'sent' | 'in_progress' | 'completed' | 'expired';
    public questions!: QuestionnaireQuestion[];
    public overallScore!: number;
    public gaps!: string[];
    public reviewedBy!: string;
    public reviewedAt!: Date;
    public metadata!: Record<string, any>;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  SecurityQuestionnaire.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'vendor_id',
        references: {
          model: 'vendor_profiles',
          key: 'id',
        },
      },
      questionnaireType: {
        type: DataTypes.ENUM('soc2', 'iso27001', 'hipaa', 'custom'),
        allowNull: false,
        field: 'questionnaire_type',
      },
      version: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      sentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'sent_date',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'due_date',
      },
      completedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'completed_date',
      },
      completedBy: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'completed_by',
      },
      status: {
        type: DataTypes.ENUM('draft', 'sent', 'in_progress', 'completed', 'expired'),
        allowNull: false,
        defaultValue: 'draft',
      },
      questions: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      overallScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: 'overall_score',
        validate: {
          min: 0,
          max: 100,
        },
      },
      gaps: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
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
      tableName: 'security_questionnaires',
      timestamps: true,
      indexes: [
        { fields: ['vendor_id'] },
        { fields: ['questionnaire_type'] },
        { fields: ['status'] },
        { fields: ['sent_date'] },
        { fields: ['due_date'] },
      ],
    }
  );

  return SecurityQuestionnaire;
}

/**
 * Sequelize model for Vendor Incidents.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorIncident model
 *
 * @example
 * const VendorIncident = defineVendorIncidentModel(sequelize);
 * await VendorIncident.create({
 *   vendorId: 'vendor-123',
 *   incidentDate: new Date(),
 *   reportedDate: new Date(),
 *   reportedBy: 'user-456',
 *   incidentType: 'security_breach',
 *   severity: 'high'
 * });
 */
export function defineVendorIncidentModel(sequelize: Sequelize): typeof Model {
  class VendorIncident extends Model {
    public id!: string;
    public vendorId!: string;
    public incidentDate!: Date;
    public reportedDate!: Date;
    public reportedBy!: string;
    public incidentType!: 'security_breach' | 'data_loss' | 'service_outage' | 'compliance_violation' | 'other';
    public severity!: 'low' | 'medium' | 'high' | 'critical';
    public description!: string;
    public impact!: string;
    public affectedSystems!: string[];
    public affectedDataTypes!: string[];
    public recordsAffected!: number;
    public rootCause!: string;
    public vendorResponse!: string;
    public remediationSteps!: string[];
    public remediationStatus!: 'pending' | 'in_progress' | 'completed' | 'verified';
    public lessonsLearned!: string;
    public closedDate!: Date;
    public metadata!: Record<string, any>;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  VendorIncident.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'vendor_id',
        references: {
          model: 'vendor_profiles',
          key: 'id',
        },
      },
      incidentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'incident_date',
      },
      reportedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'reported_date',
      },
      reportedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'reported_by',
      },
      incidentType: {
        type: DataTypes.ENUM('security_breach', 'data_loss', 'service_outage', 'compliance_violation', 'other'),
        allowNull: false,
        field: 'incident_type',
      },
      severity: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      impact: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      affectedSystems: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        field: 'affected_systems',
      },
      affectedDataTypes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        field: 'affected_data_types',
      },
      recordsAffected: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'records_affected',
      },
      rootCause: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'root_cause',
      },
      vendorResponse: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'vendor_response',
      },
      remediationSteps: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        field: 'remediation_steps',
      },
      remediationStatus: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'verified'),
        allowNull: false,
        defaultValue: 'pending',
        field: 'remediation_status',
      },
      lessonsLearned: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'lessons_learned',
      },
      closedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'closed_date',
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
      tableName: 'vendor_incidents',
      timestamps: true,
      indexes: [
        { fields: ['vendor_id'] },
        { fields: ['incident_type'] },
        { fields: ['severity'] },
        { fields: ['remediation_status'] },
        { fields: ['incident_date'] },
      ],
    }
  );

  return VendorIncident;
}

/**
 * Sequelize model for Vendor Scorecards.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorScorecard model
 *
 * @example
 * const VendorScorecard = defineVendorScorecardModel(sequelize);
 * await VendorScorecard.create({
 *   vendorId: 'vendor-123',
 *   scoringPeriod: '2024-Q1',
 *   calculatedDate: new Date(),
 *   overallScore: 85,
 *   trend: 'improving'
 * });
 */
export function defineVendorScorecardModel(sequelize: Sequelize): typeof Model {
  class VendorScorecard extends Model {
    public id!: string;
    public vendorId!: string;
    public scoringPeriod!: string;
    public calculatedDate!: Date;
    public overallScore!: number;
    public performanceMetrics!: ScoreMetric[];
    public securityMetrics!: ScoreMetric[];
    public complianceMetrics!: ScoreMetric[];
    public financialMetrics!: ScoreMetric[];
    public trend!: 'improving' | 'stable' | 'declining';
    public benchmarkComparison!: number;
    public recommendations!: string[];
    public metadata!: Record<string, any>;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  VendorScorecard.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'vendor_id',
        references: {
          model: 'vendor_profiles',
          key: 'id',
        },
      },
      scoringPeriod: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'scoring_period',
      },
      calculatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'calculated_date',
      },
      overallScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: 'overall_score',
        validate: {
          min: 0,
          max: 100,
        },
      },
      performanceMetrics: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        field: 'performance_metrics',
      },
      securityMetrics: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        field: 'security_metrics',
      },
      complianceMetrics: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        field: 'compliance_metrics',
      },
      financialMetrics: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        field: 'financial_metrics',
      },
      trend: {
        type: DataTypes.ENUM('improving', 'stable', 'declining'),
        allowNull: false,
        defaultValue: 'stable',
      },
      benchmarkComparison: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: 'benchmark_comparison',
      },
      recommendations: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
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
      tableName: 'vendor_scorecards',
      timestamps: true,
      indexes: [
        { fields: ['vendor_id'] },
        { fields: ['scoring_period'] },
        { fields: ['calculated_date'] },
        { fields: ['trend'] },
      ],
    }
  );

  return VendorScorecard;
}

// ============================================================================
// ZOD SCHEMAS (6-10)
// ============================================================================

/**
 * Zod schema for vendor profile validation.
 */
export const vendorProfileSchema = z.object({
  vendorName: z.string().min(2).max(255),
  vendorType: z.enum(['saas', 'infrastructure', 'consulting', 'hardware', 'other']),
  website: z.string().url().optional(),
  primaryContact: z.string().min(1).max(255),
  contactEmail: z.string().email(),
  contactPhone: z.string().max(50).optional(),
  servicesProvided: z.array(z.string()),
  dataAccess: z.enum(['none', 'limited', 'full', 'administrative']),
  criticalityLevel: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['prospect', 'active', 'suspended', 'terminated']),
});

/**
 * Zod schema for risk assessment validation.
 */
export const riskAssessmentSchema = z.object({
  vendorId: z.string().uuid(),
  assessmentType: z.enum(['initial', 'annual', 'ongoing', 'incident_triggered']),
  assessedBy: z.string().uuid(),
  overallRiskScore: z.number().min(0).max(100),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  securityScore: z.number().min(0).max(100),
  privacyScore: z.number().min(0).max(100),
  complianceScore: z.number().min(0).max(100),
  financialScore: z.number().min(0).max(100),
  operationalScore: z.number().min(0).max(100),
  findings: z.array(z.string()),
  recommendations: z.array(z.string()),
});

/**
 * Zod schema for security questionnaire validation.
 */
export const securityQuestionnaireSchema = z.object({
  vendorId: z.string().uuid(),
  questionnaireType: z.enum(['soc2', 'iso27001', 'hipaa', 'custom']),
  version: z.string().min(1).max(50),
  dueDate: z.date().optional(),
  status: z.enum(['draft', 'sent', 'in_progress', 'completed', 'expired']),
});

/**
 * Zod schema for vendor incident validation.
 */
export const vendorIncidentSchema = z.object({
  vendorId: z.string().uuid(),
  incidentDate: z.date(),
  reportedBy: z.string().uuid(),
  incidentType: z.enum(['security_breach', 'data_loss', 'service_outage', 'compliance_violation', 'other']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().min(10),
  impact: z.string().min(10),
  affectedSystems: z.array(z.string()),
  affectedDataTypes: z.array(z.string()),
});

/**
 * Zod schema for vendor scorecard validation.
 */
export const vendorScorecardSchema = z.object({
  vendorId: z.string().uuid(),
  scoringPeriod: z.string().min(1).max(50),
  overallScore: z.number().min(0).max(100),
  trend: z.enum(['improving', 'stable', 'declining']),
});

// ============================================================================
// VENDOR PROFILE UTILITIES (11-16)
// ============================================================================

/**
 * Creates a new vendor profile.
 *
 * @param {typeof Model} vendorModel - Vendor profile model
 * @param {VendorProfile} profile - Vendor profile data
 * @returns {Promise<any>} Created vendor profile
 *
 * @example
 * await createVendorProfile(VendorProfile, {
 *   vendorName: 'Acme Cloud Services',
 *   vendorType: 'saas',
 *   primaryContact: 'John Doe',
 *   contactEmail: 'john@acme.com',
 *   servicesProvided: ['Cloud Storage', 'Computing'],
 *   dataAccess: 'limited',
 *   criticalityLevel: 'high',
 *   status: 'active'
 * });
 */
export async function createVendorProfile(
  vendorModel: typeof Model,
  profile: VendorProfile
): Promise<any> {
  const validated = vendorProfileSchema.parse(profile);
  return await vendorModel.create(validated);
}

/**
 * Updates vendor profile information.
 *
 * @param {typeof Model} vendorModel - Vendor profile model
 * @param {string} vendorId - Vendor ID
 * @param {Partial<VendorProfile>} updates - Profile updates
 * @returns {Promise<any>} Updated vendor profile
 *
 * @example
 * await updateVendorProfile(VendorProfile, 'vendor-123', {
 *   status: 'suspended',
 *   criticalityLevel: 'critical'
 * });
 */
export async function updateVendorProfile(
  vendorModel: typeof Model,
  vendorId: string,
  updates: Partial<VendorProfile>
): Promise<any> {
  const vendor = await vendorModel.findByPk(vendorId);
  if (!vendor) {
    throw new Error(`Vendor ${vendorId} not found`);
  }
  return await vendor.update(updates);
}

/**
 * Retrieves vendor profile by ID with full details.
 *
 * @param {typeof Model} vendorModel - Vendor profile model
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<any>} Vendor profile
 *
 * @example
 * const vendor = await getVendorProfile(VendorProfile, 'vendor-123');
 */
export async function getVendorProfile(
  vendorModel: typeof Model,
  vendorId: string
): Promise<any> {
  return await vendorModel.findByPk(vendorId);
}

/**
 * Lists vendors with filtering and pagination.
 *
 * @param {typeof Model} vendorModel - Vendor profile model
 * @param {Record<string, any>} filters - Query filters
 * @param {number} limit - Result limit
 * @param {number} offset - Result offset
 * @returns {Promise<{rows: any[], count: number}>} Vendor list
 *
 * @example
 * const vendors = await listVendors(VendorProfile, {
 *   status: 'active',
 *   criticalityLevel: 'high',
 *   vendorType: 'saas'
 * }, 50, 0);
 */
export async function listVendors(
  vendorModel: typeof Model,
  filters: Record<string, any> = {},
  limit: number = 50,
  offset: number = 0
): Promise<{ rows: any[]; count: number }> {
  const where: Record<string, any> = {};

  if (filters.status) where.status = filters.status;
  if (filters.vendorType) where.vendorType = filters.vendorType;
  if (filters.criticalityLevel) where.criticalityLevel = filters.criticalityLevel;
  if (filters.dataAccess) where.dataAccess = filters.dataAccess;

  if (filters.search) {
    where[Op.or] = [
      { vendorName: { [Op.iLike]: `%${filters.search}%` } },
      { primaryContact: { [Op.iLike]: `%${filters.search}%` } },
    ];
  }

  return await vendorModel.findAndCountAll({
    where,
    limit,
    offset,
    order: [['vendorName', 'ASC']],
  });
}

/**
 * Archives/terminates a vendor.
 *
 * @param {typeof Model} vendorModel - Vendor profile model
 * @param {string} vendorId - Vendor ID
 * @param {string} reason - Termination reason
 * @returns {Promise<any>} Updated vendor
 *
 * @example
 * await archiveVendor(VendorProfile, 'vendor-123', 'Contract expired');
 */
export async function archiveVendor(
  vendorModel: typeof Model,
  vendorId: string,
  reason: string
): Promise<any> {
  const vendor = await vendorModel.findByPk(vendorId);
  if (!vendor) {
    throw new Error(`Vendor ${vendorId} not found`);
  }
  return await vendor.update({
    status: 'terminated',
    metadata: {
      ...vendor.metadata,
      terminationReason: reason,
      terminatedAt: new Date(),
    },
  });
}

/**
 * Gets vendors by criticality level.
 *
 * @param {typeof Model} vendorModel - Vendor profile model
 * @param {'low' | 'medium' | 'high' | 'critical'} level - Criticality level
 * @returns {Promise<any[]>} Vendors at criticality level
 *
 * @example
 * const criticalVendors = await getVendorsByCriticality(VendorProfile, 'critical');
 */
export async function getVendorsByCriticality(
  vendorModel: typeof Model,
  level: 'low' | 'medium' | 'high' | 'critical'
): Promise<any[]> {
  return await vendorModel.findAll({
    where: {
      criticalityLevel: level,
      status: 'active',
    },
    order: [['vendorName', 'ASC']],
  });
}

// ============================================================================
// RISK ASSESSMENT UTILITIES (17-22)
// ============================================================================

/**
 * Creates a new vendor risk assessment.
 *
 * @param {typeof Model} assessmentModel - Risk assessment model
 * @param {VendorRiskAssessment} assessment - Assessment data
 * @returns {Promise<any>} Created assessment
 *
 * @example
 * await createRiskAssessment(VendorRiskAssessment, {
 *   vendorId: 'vendor-123',
 *   assessmentDate: new Date(),
 *   assessmentType: 'annual',
 *   assessedBy: 'user-456',
 *   overallRiskScore: 75,
 *   riskLevel: 'medium',
 *   securityScore: 80,
 *   privacyScore: 70,
 *   complianceScore: 75,
 *   financialScore: 85,
 *   operationalScore: 70,
 *   findings: ['Incomplete encryption', 'Limited access controls'],
 *   recommendations: ['Implement full disk encryption', 'Enable MFA']
 * });
 */
export async function createRiskAssessment(
  assessmentModel: typeof Model,
  assessment: VendorRiskAssessment
): Promise<any> {
  const validated = riskAssessmentSchema.parse(assessment);
  return await assessmentModel.create(validated);
}

/**
 * Calculates overall risk score from component scores.
 *
 * @param {number} securityScore - Security score (0-100)
 * @param {number} privacyScore - Privacy score (0-100)
 * @param {number} complianceScore - Compliance score (0-100)
 * @param {number} financialScore - Financial score (0-100)
 * @param {number} operationalScore - Operational score (0-100)
 * @returns {number} Overall risk score
 *
 * @example
 * const score = calculateOverallRiskScore(80, 75, 70, 85, 78);
 * // Returns weighted average
 */
export function calculateOverallRiskScore(
  securityScore: number,
  privacyScore: number,
  complianceScore: number,
  financialScore: number,
  operationalScore: number
): number {
  const weights = {
    security: 0.30,
    privacy: 0.25,
    compliance: 0.25,
    financial: 0.10,
    operational: 0.10,
  };

  return (
    securityScore * weights.security +
    privacyScore * weights.privacy +
    complianceScore * weights.compliance +
    financialScore * weights.financial +
    operationalScore * weights.operational
  );
}

/**
 * Determines risk level from risk score.
 *
 * @param {number} riskScore - Risk score (0-100)
 * @returns {'low' | 'medium' | 'high' | 'critical'} Risk level
 *
 * @example
 * const level = determineRiskLevel(75); // Returns 'medium'
 */
export function determineRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
  if (riskScore >= 85) return 'low';
  if (riskScore >= 70) return 'medium';
  if (riskScore >= 50) return 'high';
  return 'critical';
}

/**
 * Gets latest risk assessment for a vendor.
 *
 * @param {typeof Model} assessmentModel - Risk assessment model
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<any>} Latest assessment
 *
 * @example
 * const latest = await getLatestAssessment(VendorRiskAssessment, 'vendor-123');
 */
export async function getLatestAssessment(
  assessmentModel: typeof Model,
  vendorId: string
): Promise<any> {
  return await assessmentModel.findOne({
    where: { vendorId },
    order: [['assessmentDate', 'DESC']],
  });
}

/**
 * Gets risk assessment history for a vendor.
 *
 * @param {typeof Model} assessmentModel - Risk assessment model
 * @param {string} vendorId - Vendor ID
 * @param {number} limit - Number of assessments to retrieve
 * @returns {Promise<any[]>} Assessment history
 *
 * @example
 * const history = await getRiskAssessmentHistory(VendorRiskAssessment, 'vendor-123', 10);
 */
export async function getRiskAssessmentHistory(
  assessmentModel: typeof Model,
  vendorId: string,
  limit: number = 10
): Promise<any[]> {
  return await assessmentModel.findAll({
    where: { vendorId },
    order: [['assessmentDate', 'DESC']],
    limit,
  });
}

/**
 * Approves a risk assessment.
 *
 * @param {typeof Model} assessmentModel - Risk assessment model
 * @param {string} assessmentId - Assessment ID
 * @param {string} approvedBy - Approver user ID
 * @returns {Promise<any>} Approved assessment
 *
 * @example
 * await approveRiskAssessment(VendorRiskAssessment, 'assessment-123', 'user-456');
 */
export async function approveRiskAssessment(
  assessmentModel: typeof Model,
  assessmentId: string,
  approvedBy: string
): Promise<any> {
  const assessment = await assessmentModel.findByPk(assessmentId);
  if (!assessment) {
    throw new Error(`Assessment ${assessmentId} not found`);
  }
  return await assessment.update({
    approvalStatus: 'approved',
    approvedBy,
    approvedAt: new Date(),
  });
}

// ============================================================================
// SECURITY QUESTIONNAIRE UTILITIES (23-27)
// ============================================================================

/**
 * Creates a new security questionnaire.
 *
 * @param {typeof Model} questionnaireModel - Questionnaire model
 * @param {SecurityQuestionnaire} questionnaire - Questionnaire data
 * @returns {Promise<any>} Created questionnaire
 *
 * @example
 * await createSecurityQuestionnaire(SecurityQuestionnaire, {
 *   vendorId: 'vendor-123',
 *   questionnaireType: 'soc2',
 *   version: '2024.1',
 *   sentDate: new Date(),
 *   dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
 *   status: 'sent',
 *   questions: []
 * });
 */
export async function createSecurityQuestionnaire(
  questionnaireModel: typeof Model,
  questionnaire: SecurityQuestionnaire
): Promise<any> {
  const validated = securityQuestionnaireSchema.parse(questionnaire);
  return await questionnaireModel.create(validated);
}

/**
 * Adds questions to a security questionnaire.
 *
 * @param {typeof Model} questionnaireModel - Questionnaire model
 * @param {string} questionnaireId - Questionnaire ID
 * @param {QuestionnaireQuestion[]} questions - Questions to add
 * @returns {Promise<any>} Updated questionnaire
 *
 * @example
 * await addQuestions(SecurityQuestionnaire, 'questionnaire-123', [
 *   {
 *     questionId: 'q1',
 *     category: 'encryption',
 *     question: 'Do you encrypt data at rest?',
 *     weight: 10,
 *     compliant: false
 *   }
 * ]);
 */
export async function addQuestions(
  questionnaireModel: typeof Model,
  questionnaireId: string,
  questions: QuestionnaireQuestion[]
): Promise<any> {
  const questionnaire = await questionnaireModel.findByPk(questionnaireId);
  if (!questionnaire) {
    throw new Error(`Questionnaire ${questionnaireId} not found`);
  }
  const existingQuestions = questionnaire.questions || [];
  return await questionnaire.update({
    questions: [...existingQuestions, ...questions],
  });
}

/**
 * Scores a completed questionnaire.
 *
 * @param {QuestionnaireQuestion[]} questions - Answered questions
 * @returns {number} Overall questionnaire score
 *
 * @example
 * const score = scoreQuestionnaire(answeredQuestions);
 */
export function scoreQuestionnaire(questions: QuestionnaireQuestion[]): number {
  if (questions.length === 0) return 0;

  const totalWeight = questions.reduce((sum, q) => sum + q.weight, 0);
  const weightedScore = questions.reduce((sum, q) => {
    const questionScore = q.compliant ? q.weight : 0;
    return sum + questionScore;
  }, 0);

  return (weightedScore / totalWeight) * 100;
}

/**
 * Identifies gaps in questionnaire responses.
 *
 * @param {QuestionnaireQuestion[]} questions - Answered questions
 * @returns {string[]} List of identified gaps
 *
 * @example
 * const gaps = identifyQuestionnaireGaps(answeredQuestions);
 */
export function identifyQuestionnaireGaps(questions: QuestionnaireQuestion[]): string[] {
  return questions
    .filter(q => !q.compliant)
    .map(q => `${q.category}: ${q.question}`);
}

/**
 * Gets overdue questionnaires.
 *
 * @param {typeof Model} questionnaireModel - Questionnaire model
 * @returns {Promise<any[]>} Overdue questionnaires
 *
 * @example
 * const overdue = await getOverdueQuestionnaires(SecurityQuestionnaire);
 */
export async function getOverdueQuestionnaires(
  questionnaireModel: typeof Model
): Promise<any[]> {
  return await questionnaireModel.findAll({
    where: {
      status: { [Op.in]: ['sent', 'in_progress'] },
      dueDate: { [Op.lt]: new Date() },
    },
    order: [['dueDate', 'ASC']],
  });
}

// ============================================================================
// VENDOR INCIDENT UTILITIES (28-32)
// ============================================================================

/**
 * Records a vendor incident.
 *
 * @param {typeof Model} incidentModel - Incident model
 * @param {VendorIncident} incident - Incident data
 * @returns {Promise<any>} Created incident
 *
 * @example
 * await recordVendorIncident(VendorIncident, {
 *   vendorId: 'vendor-123',
 *   incidentDate: new Date(),
 *   reportedDate: new Date(),
 *   reportedBy: 'user-456',
 *   incidentType: 'security_breach',
 *   severity: 'high',
 *   description: 'Unauthorized access detected',
 *   impact: 'Potential data exposure',
 *   affectedSystems: ['API Server'],
 *   affectedDataTypes: ['Customer PII'],
 *   remediationSteps: ['Reset credentials', 'Enable MFA']
 * });
 */
export async function recordVendorIncident(
  incidentModel: typeof Model,
  incident: VendorIncident
): Promise<any> {
  const validated = vendorIncidentSchema.parse(incident);
  return await incidentModel.create(validated);
}

/**
 * Updates incident remediation status.
 *
 * @param {typeof Model} incidentModel - Incident model
 * @param {string} incidentId - Incident ID
 * @param {'pending' | 'in_progress' | 'completed' | 'verified'} status - New status
 * @param {string} notes - Status update notes
 * @returns {Promise<any>} Updated incident
 *
 * @example
 * await updateIncidentStatus(VendorIncident, 'incident-123', 'completed', 'All remediation steps completed');
 */
export async function updateIncidentStatus(
  incidentModel: typeof Model,
  incidentId: string,
  status: 'pending' | 'in_progress' | 'completed' | 'verified',
  notes: string
): Promise<any> {
  const incident = await incidentModel.findByPk(incidentId);
  if (!incident) {
    throw new Error(`Incident ${incidentId} not found`);
  }
  return await incident.update({
    remediationStatus: status,
    metadata: {
      ...incident.metadata,
      statusHistory: [
        ...(incident.metadata?.statusHistory || []),
        { status, notes, updatedAt: new Date() },
      ],
    },
  });
}

/**
 * Gets critical incidents for a vendor.
 *
 * @param {typeof Model} incidentModel - Incident model
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<any[]>} Critical incidents
 *
 * @example
 * const critical = await getCriticalIncidents(VendorIncident, 'vendor-123');
 */
export async function getCriticalIncidents(
  incidentModel: typeof Model,
  vendorId: string
): Promise<any[]> {
  return await incidentModel.findAll({
    where: {
      vendorId,
      severity: { [Op.in]: ['high', 'critical'] },
      remediationStatus: { [Op.ne]: 'verified' },
    },
    order: [['incidentDate', 'DESC']],
  });
}

/**
 * Gets incident statistics for a vendor.
 *
 * @param {typeof Model} incidentModel - Incident model
 * @param {string} vendorId - Vendor ID
 * @param {Date} startDate - Start date for statistics
 * @param {Date} endDate - End date for statistics
 * @returns {Promise<Record<string, any>>} Incident statistics
 *
 * @example
 * const stats = await getIncidentStats(VendorIncident, 'vendor-123', startDate, endDate);
 */
export async function getIncidentStats(
  incidentModel: typeof Model,
  vendorId: string,
  startDate: Date,
  endDate: Date
): Promise<Record<string, any>> {
  const incidents = await incidentModel.findAll({
    where: {
      vendorId,
      incidentDate: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  return {
    total: incidents.length,
    byType: incidents.reduce((acc, inc) => {
      acc[inc.incidentType] = (acc[inc.incidentType] || 0) + 1;
      return acc;
    }, {}),
    bySeverity: incidents.reduce((acc, inc) => {
      acc[inc.severity] = (acc[inc.severity] || 0) + 1;
      return acc;
    }, {}),
    byStatus: incidents.reduce((acc, inc) => {
      acc[inc.remediationStatus] = (acc[inc.remediationStatus] || 0) + 1;
      return acc;
    }, {}),
  };
}

/**
 * Closes a vendor incident.
 *
 * @param {typeof Model} incidentModel - Incident model
 * @param {string} incidentId - Incident ID
 * @param {string} lessonsLearned - Lessons learned from incident
 * @returns {Promise<any>} Closed incident
 *
 * @example
 * await closeIncident(VendorIncident, 'incident-123', 'Enhanced monitoring needed');
 */
export async function closeIncident(
  incidentModel: typeof Model,
  incidentId: string,
  lessonsLearned: string
): Promise<any> {
  const incident = await incidentModel.findByPk(incidentId);
  if (!incident) {
    throw new Error(`Incident ${incidentId} not found`);
  }
  return await incident.update({
    remediationStatus: 'verified',
    closedDate: new Date(),
    lessonsLearned,
  });
}

// ============================================================================
// VENDOR SCORECARD UTILITIES (33-38)
// ============================================================================

/**
 * Generates a vendor scorecard.
 *
 * @param {typeof Model} scorecardModel - Scorecard model
 * @param {VendorScorecard} scorecard - Scorecard data
 * @returns {Promise<any>} Created scorecard
 *
 * @example
 * await generateVendorScorecard(VendorScorecard, {
 *   vendorId: 'vendor-123',
 *   scoringPeriod: '2024-Q1',
 *   calculatedDate: new Date(),
 *   overallScore: 85,
 *   performanceMetrics: [],
 *   securityMetrics: [],
 *   complianceMetrics: [],
 *   financialMetrics: [],
 *   trend: 'improving',
 *   recommendations: []
 * });
 */
export async function generateVendorScorecard(
  scorecardModel: typeof Model,
  scorecard: VendorScorecard
): Promise<any> {
  const validated = vendorScorecardSchema.parse(scorecard);
  return await scorecardModel.create(validated);
}

/**
 * Calculates scorecard metrics from vendor data.
 *
 * @param {any} vendor - Vendor data
 * @param {any[]} assessments - Risk assessments
 * @param {any[]} incidents - Vendor incidents
 * @returns {ScoreMetric[]} Calculated metrics
 *
 * @example
 * const metrics = calculateScorecardMetrics(vendor, assessments, incidents);
 */
export function calculateScorecardMetrics(
  vendor: any,
  assessments: any[],
  incidents: any[]
): ScoreMetric[] {
  const metrics: ScoreMetric[] = [];

  if (assessments.length > 0) {
    const latest = assessments[0];
    metrics.push({
      metricName: 'Security Score',
      category: 'security',
      value: latest.securityScore,
      weight: 30,
      target: 85,
      threshold: 70,
      status: latest.securityScore >= 85 ? 'excellent' : latest.securityScore >= 70 ? 'good' : 'poor',
    });
  }

  const criticalIncidents = incidents.filter(i => i.severity === 'critical').length;
  metrics.push({
    metricName: 'Critical Incidents',
    category: 'performance',
    value: criticalIncidents,
    weight: 20,
    target: 0,
    threshold: 2,
    status: criticalIncidents === 0 ? 'excellent' : criticalIncidents <= 2 ? 'acceptable' : 'poor',
  });

  return metrics;
}

/**
 * Determines performance trend from scorecard history.
 *
 * @param {any[]} scorecards - Historical scorecards
 * @returns {'improving' | 'stable' | 'declining'} Trend
 *
 * @example
 * const trend = determineTrend(historicalScorecards);
 */
export function determineTrend(scorecards: any[]): 'improving' | 'stable' | 'declining' {
  if (scorecards.length < 2) return 'stable';

  const recent = scorecards[0].overallScore;
  const previous = scorecards[1].overallScore;
  const difference = recent - previous;

  if (difference > 5) return 'improving';
  if (difference < -5) return 'declining';
  return 'stable';
}

/**
 * Compares vendor score to benchmark.
 *
 * @param {number} vendorScore - Vendor's score
 * @param {number[]} peerScores - Peer vendor scores
 * @returns {number} Percentile ranking
 *
 * @example
 * const percentile = compareToBenchmark(85, [70, 75, 80, 90, 95]);
 */
export function compareToBenchmark(vendorScore: number, peerScores: number[]): number {
  const sorted = [...peerScores, vendorScore].sort((a, b) => a - b);
  const rank = sorted.indexOf(vendorScore) + 1;
  return (rank / sorted.length) * 100;
}

/**
 * Gets latest scorecard for a vendor.
 *
 * @param {typeof Model} scorecardModel - Scorecard model
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<any>} Latest scorecard
 *
 * @example
 * const latest = await getLatestScorecard(VendorScorecard, 'vendor-123');
 */
export async function getLatestScorecard(
  scorecardModel: typeof Model,
  vendorId: string
): Promise<any> {
  return await scorecardModel.findOne({
    where: { vendorId },
    order: [['calculatedDate', 'DESC']],
  });
}

/**
 * Gets scorecard history for trend analysis.
 *
 * @param {typeof Model} scorecardModel - Scorecard model
 * @param {string} vendorId - Vendor ID
 * @param {number} periods - Number of periods to retrieve
 * @returns {Promise<any[]>} Scorecard history
 *
 * @example
 * const history = await getScorecardHistory(VendorScorecard, 'vendor-123', 12);
 */
export async function getScorecardHistory(
  scorecardModel: typeof Model,
  vendorId: string,
  periods: number = 12
): Promise<any[]> {
  return await scorecardModel.findAll({
    where: { vendorId },
    order: [['calculatedDate', 'DESC']],
    limit: periods,
  });
}

// ============================================================================
// DUE DILIGENCE & CONTRACT UTILITIES (39-43)
// ============================================================================

/**
 * Creates vendor due diligence workflow.
 *
 * @param {typeof Model} dueDiligenceModel - Due diligence model (custom model)
 * @param {VendorDueDiligence} dueDiligence - Due diligence data
 * @returns {Promise<any>} Created due diligence record
 *
 * @example
 * await createDueDiligence(VendorDueDiligence, {
 *   vendorId: 'vendor-123',
 *   dueDiligenceType: 'enhanced',
 *   initiatedDate: new Date(),
 *   assignedTo: 'user-456',
 *   status: 'pending',
 *   checklistItems: [],
 *   documentsCollected: [],
 *   backgroundCheckCompleted: false,
 *   financialReviewCompleted: false,
 *   securityReviewCompleted: false,
 *   legalReviewCompleted: false,
 *   referenceCheckCompleted: false,
 *   overallResult: 'pending'
 * });
 */
export async function createDueDiligence(
  dueDiligenceModel: typeof Model,
  dueDiligence: VendorDueDiligence
): Promise<any> {
  return await dueDiligenceModel.create(dueDiligence);
}

/**
 * Validates vendor contract security requirements.
 *
 * @param {VendorContract} contract - Contract to validate
 * @param {string[]} requiredClauses - Required security clauses
 * @returns {boolean} Whether contract meets requirements
 *
 * @example
 * const valid = validateContractSecurity(contract, [
 *   'data_encryption',
 *   'breach_notification',
 *   'right_to_audit'
 * ]);
 */
export function validateContractSecurity(
  contract: VendorContract,
  requiredClauses: string[]
): boolean {
  const contractClauses = [
    ...contract.securityRequirements,
    ...contract.complianceRequirements,
    ...contract.dataProtectionClauses,
  ];

  return requiredClauses.every(clause =>
    contractClauses.some(c => c.toLowerCase().includes(clause.toLowerCase()))
  );
}

/**
 * Schedules continuous vendor monitoring.
 *
 * @param {typeof Model} monitoringModel - Monitoring model (custom model)
 * @param {VendorMonitoring} monitoring - Monitoring configuration
 * @returns {Promise<any>} Created monitoring schedule
 *
 * @example
 * await scheduleVendorMonitoring(VendorMonitoring, {
 *   vendorId: 'vendor-123',
 *   monitoringType: 'continuous',
 *   frequency: 'daily',
 *   lastCheckDate: new Date(),
 *   monitoringSources: ['SecurityScorecard', 'BitSight'],
 *   alerts: [],
 *   status: 'active'
 * });
 */
export async function scheduleVendorMonitoring(
  monitoringModel: typeof Model,
  monitoring: VendorMonitoring
): Promise<any> {
  return await monitoringModel.create(monitoring);
}

/**
 * Executes vendor onboarding workflow.
 *
 * @param {typeof Model} vendorModel - Vendor model
 * @param {typeof Model} assessmentModel - Assessment model
 * @param {VendorProfile} vendor - Vendor profile
 * @returns {Promise<Record<string, any>>} Onboarding result
 *
 * @example
 * const result = await onboardVendor(VendorProfile, VendorRiskAssessment, {
 *   vendorName: 'New Vendor',
 *   vendorType: 'saas',
 *   primaryContact: 'Contact Name',
 *   contactEmail: 'contact@vendor.com',
 *   servicesProvided: ['Service1'],
 *   dataAccess: 'limited',
 *   criticalityLevel: 'medium',
 *   status: 'prospect'
 * });
 */
export async function onboardVendor(
  vendorModel: typeof Model,
  assessmentModel: typeof Model,
  vendor: VendorProfile
): Promise<Record<string, any>> {
  // Create vendor profile
  const createdVendor = await createVendorProfile(vendorModel, {
    ...vendor,
    status: 'prospect',
  });

  // Initialize risk assessment
  const initialAssessment = await createRiskAssessment(assessmentModel, {
    vendorId: createdVendor.id,
    assessmentDate: new Date(),
    assessmentType: 'initial',
    assessedBy: vendor.metadata?.assessedBy || 'system',
    overallRiskScore: 0,
    riskLevel: 'medium',
    securityScore: 0,
    privacyScore: 0,
    complianceScore: 0,
    financialScore: 0,
    operationalScore: 0,
    findings: [],
    recommendations: ['Complete initial security questionnaire', 'Provide compliance certifications'],
  });

  return {
    vendor: createdVendor,
    assessment: initialAssessment,
    nextSteps: [
      'Send security questionnaire',
      'Request compliance documentation',
      'Schedule security review call',
      'Conduct due diligence',
    ],
  };
}

/**
 * Executes vendor offboarding workflow.
 *
 * @param {typeof Model} vendorModel - Vendor model
 * @param {string} vendorId - Vendor ID
 * @param {string} offboardingReason - Reason for offboarding
 * @param {string} userId - User executing offboarding
 * @returns {Promise<Record<string, any>>} Offboarding result
 *
 * @example
 * const result = await offboardVendor(VendorProfile, 'vendor-123', 'Contract expired', 'user-456');
 */
export async function offboardVendor(
  vendorModel: typeof Model,
  vendorId: string,
  offboardingReason: string,
  userId: string
): Promise<Record<string, any>> {
  const vendor = await vendorModel.findByPk(vendorId);
  if (!vendor) {
    throw new Error(`Vendor ${vendorId} not found`);
  }

  // Update vendor status
  await vendor.update({
    status: 'terminated',
    metadata: {
      ...vendor.metadata,
      offboardingReason,
      offboardedBy: userId,
      offboardedAt: new Date(),
    },
  });

  return {
    vendor,
    tasks: [
      'Revoke all access credentials',
      'Recover company assets',
      'Archive vendor data',
      'Update contract status',
      'Notify stakeholders',
      'Complete final security review',
    ],
    completedAt: new Date(),
  };
}

// ============================================================================
// SWAGGER DTOs
// ============================================================================

export class CreateVendorDto {
  @ApiProperty({ example: 'Acme Cloud Services' })
  vendorName: string;

  @ApiProperty({ enum: ['saas', 'infrastructure', 'consulting', 'hardware', 'other'] })
  vendorType: string;

  @ApiProperty({ example: 'John Doe' })
  primaryContact: string;

  @ApiProperty({ example: 'john@acme.com' })
  contactEmail: string;

  @ApiProperty({ example: ['Cloud Storage', 'Computing'] })
  servicesProvided: string[];

  @ApiProperty({ enum: ['none', 'limited', 'full', 'administrative'] })
  dataAccess: string;

  @ApiProperty({ enum: ['low', 'medium', 'high', 'critical'] })
  criticalityLevel: string;
}

export class CreateRiskAssessmentDto {
  @ApiProperty()
  vendorId: string;

  @ApiProperty({ enum: ['initial', 'annual', 'ongoing', 'incident_triggered'] })
  assessmentType: string;

  @ApiProperty()
  assessedBy: string;

  @ApiProperty({ minimum: 0, maximum: 100 })
  overallRiskScore: number;

  @ApiProperty({ enum: ['low', 'medium', 'high', 'critical'] })
  riskLevel: string;
}

export class CreateIncidentDto {
  @ApiProperty()
  vendorId: string;

  @ApiProperty()
  incidentDate: Date;

  @ApiProperty({ enum: ['security_breach', 'data_loss', 'service_outage', 'compliance_violation', 'other'] })
  incidentType: string;

  @ApiProperty({ enum: ['low', 'medium', 'high', 'critical'] })
  severity: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  impact: string;
}
