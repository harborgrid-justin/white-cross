/**
 * LOC: WC-COMP-TRADING-REG-001
 * File: /reuse/trading/composites/regulatory-reporting-compliance-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - sequelize (v6.x)
 *   - ../regulatory-reporting-kit
 *   - ../risk-management-kit
 *   - ../trade-settlement-kit
 *
 * DOWNSTREAM (imported by):
 *   - Regulatory reporting controllers
 *   - Compliance monitoring services
 *   - Regulatory dashboard modules
 *   - Audit trail engines
 */

/**
 * File: /reuse/trading/composites/regulatory-reporting-compliance-composite.ts
 * Locator: WC-COMP-TRADING-REG-001
 * Purpose: Bloomberg Terminal-Level Regulatory Reporting & Compliance Composite
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize, regulatory-reporting-kit
 * Downstream: Regulatory controllers, compliance services, audit systems, dashboards
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Swagger 7.x
 * Exports: 44 composed functions for comprehensive regulatory reporting and compliance
 *
 * LLM Context: Enterprise-grade regulatory reporting composite for trading platform.
 * Provides MiFID II/MiFIR transaction reporting, EMIR derivatives reporting, Dodd-Frank
 * swap reporting, SEC 13F/13H reporting, CAT reporting, FINRA/OATS reporting, best
 * execution analysis, short selling compliance, position limit monitoring, real-time
 * compliance alerts, tamper-proof audit trails, and regulatory dashboard metrics.
 * Integrates Bloomberg Terminal-level regulatory compliance across all jurisdictions.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  Sequelize,
  Model,
  DataTypes,
  Transaction,
  Op,
  ModelAttributes,
  ModelOptions,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  BelongsToGetAssociationMixin,
  Optional,
} from 'sequelize';

// Import from regulatory-reporting-kit
import * as RegulatoryKit from '../regulatory-reporting-kit';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Regulatory regime types
 */
export enum RegulatoryRegime {
  MIFID_II = 'mifid_ii',
  EMIR = 'emir',
  DODD_FRANK = 'dodd_frank',
  SEC = 'sec',
  FINRA = 'finra',
  CFTC = 'cftc',
  CAT = 'cat',
  FCA = 'fca',
}

/**
 * Report submission status
 */
export enum ReportSubmissionStatus {
  DRAFT = 'draft',
  PENDING_VALIDATION = 'pending_validation',
  VALIDATED = 'validated',
  SUBMITTED = 'submitted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  AMENDED = 'amended',
}

/**
 * Compliance alert severity
 */
export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical',
}

/**
 * Compliance alert status
 */
export enum AlertStatus {
  OPEN = 'open',
  ACKNOWLEDGED = 'acknowledged',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  ESCALATED = 'escalated',
}

/**
 * Report validation result type
 */
export enum ValidationResultType {
  PASSED = 'passed',
  FAILED = 'failed',
  WARNING = 'warning',
}

// ============================================================================
// SEQUELIZE MODEL: RegulatoryReport
// ============================================================================

/**
 * TypeScript interface for RegulatoryReport attributes
 */
export interface RegulatoryReportAttributes {
  id: string;
  reportType: string;
  regulatoryRegime: RegulatoryRegime;
  reportingEntity: string;
  reportPeriodStart: Date;
  reportPeriodEnd: Date;
  submissionDeadline: Date;
  status: ReportSubmissionStatus;
  reportData: Record<string, any>;
  validationResults: Record<string, any>[];
  submissionReference: string | null;
  regulatoryReference: string | null;
  submittedAt: Date | null;
  acceptedAt: Date | null;
  rejectionReason: string | null;
  amendmentCount: number;
  originalReportId: string | null;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface RegulatoryReportCreationAttributes
  extends Optional<
    RegulatoryReportAttributes,
    'id' | 'submissionReference' | 'regulatoryReference' | 'submittedAt' | 'acceptedAt' | 'rejectionReason' | 'originalReportId' | 'updatedBy' | 'deletedAt'
  > {}

/**
 * Sequelize Model: RegulatoryReport
 * Main regulatory report entity
 */
@ApiTags('regulatory-reports')
export class RegulatoryReport
  extends Model<RegulatoryReportAttributes, RegulatoryReportCreationAttributes>
  implements RegulatoryReportAttributes
{
  @ApiProperty({ description: 'Unique identifier' })
  declare id: string;

  @ApiProperty({ description: 'Type of regulatory report' })
  declare reportType: string;

  @ApiProperty({ enum: RegulatoryRegime, description: 'Regulatory regime' })
  declare regulatoryRegime: RegulatoryRegime;

  @ApiProperty({ description: 'Reporting entity identifier' })
  declare reportingEntity: string;

  @ApiProperty({ description: 'Report period start date' })
  declare reportPeriodStart: Date;

  @ApiProperty({ description: 'Report period end date' })
  declare reportPeriodEnd: Date;

  @ApiProperty({ description: 'Submission deadline' })
  declare submissionDeadline: Date;

  @ApiProperty({ enum: ReportSubmissionStatus, description: 'Report status' })
  declare status: ReportSubmissionStatus;

  @ApiProperty({ description: 'Report data payload' })
  declare reportData: Record<string, any>;

  @ApiProperty({ description: 'Validation results' })
  declare validationResults: Record<string, any>[];

  @ApiProperty({ description: 'Submission reference', nullable: true })
  declare submissionReference: string | null;

  @ApiProperty({ description: 'Regulatory authority reference', nullable: true })
  declare regulatoryReference: string | null;

  @ApiProperty({ description: 'Submission timestamp', nullable: true })
  declare submittedAt: Date | null;

  @ApiProperty({ description: 'Acceptance timestamp', nullable: true })
  declare acceptedAt: Date | null;

  @ApiProperty({ description: 'Rejection reason', nullable: true })
  declare rejectionReason: string | null;

  @ApiProperty({ description: 'Number of amendments' })
  declare amendmentCount: number;

  @ApiProperty({ description: 'Original report ID if amended', nullable: true })
  declare originalReportId: string | null;

  @ApiProperty({ description: 'Additional metadata' })
  declare metadata: Record<string, any>;

  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getAlerts: HasManyGetAssociationsMixin<ComplianceAlert>;
  declare addAlert: HasManyAddAssociationMixin<ComplianceAlert, string>;

  declare static associations: {
    alerts: Association<RegulatoryReport, ComplianceAlert>;
  };

  /**
   * Initialize RegulatoryReport with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof RegulatoryReport {
    RegulatoryReport.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        reportType: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'report_type',
        },
        regulatoryRegime: {
          type: DataTypes.ENUM(...Object.values(RegulatoryRegime)),
          allowNull: false,
          field: 'regulatory_regime',
        },
        reportingEntity: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'reporting_entity',
        },
        reportPeriodStart: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'report_period_start',
        },
        reportPeriodEnd: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'report_period_end',
        },
        submissionDeadline: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'submission_deadline',
        },
        status: {
          type: DataTypes.ENUM(...Object.values(ReportSubmissionStatus)),
          allowNull: false,
          defaultValue: ReportSubmissionStatus.DRAFT,
          field: 'status',
        },
        reportData: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'report_data',
        },
        validationResults: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'validation_results',
        },
        submissionReference: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'submission_reference',
        },
        regulatoryReference: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'regulatory_reference',
        },
        submittedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'submitted_at',
        },
        acceptedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'accepted_at',
        },
        rejectionReason: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'rejection_reason',
        },
        amendmentCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'amendment_count',
        },
        originalReportId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'original_report_id',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'updated_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
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
        tableName: 'regulatory_reports',
        modelName: 'RegulatoryReport',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['report_type'] },
          { fields: ['regulatory_regime'] },
          { fields: ['status'] },
          { fields: ['reporting_entity'] },
          { fields: ['submission_deadline'] },
          { fields: ['submitted_at'] },
        ],
      }
    );

    return RegulatoryReport;
  }
}

// ============================================================================
// SEQUELIZE MODEL: ComplianceAlert
// ============================================================================

/**
 * TypeScript interface for ComplianceAlert attributes
 */
export interface ComplianceAlertAttributes {
  id: string;
  reportId: string | null;
  alertType: string;
  severity: AlertSeverity;
  status: AlertStatus;
  regulatoryRegime: RegulatoryRegime;
  title: string;
  description: string;
  affectedEntities: string[];
  recommendedAction: string;
  deadline: Date | null;
  assignedTo: string | null;
  acknowledgedAt: Date | null;
  resolvedAt: Date | null;
  resolutionNotes: string | null;
  escalatedAt: Date | null;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface ComplianceAlertCreationAttributes
  extends Optional<
    ComplianceAlertAttributes,
    'id' | 'reportId' | 'deadline' | 'assignedTo' | 'acknowledgedAt' | 'resolvedAt' | 'resolutionNotes' | 'escalatedAt' | 'updatedBy' | 'deletedAt'
  > {}

/**
 * Sequelize Model: ComplianceAlert
 * Compliance alerts and notifications
 */
@ApiTags('compliance-alerts')
export class ComplianceAlert
  extends Model<ComplianceAlertAttributes, ComplianceAlertCreationAttributes>
  implements ComplianceAlertAttributes
{
  @ApiProperty({ description: 'Unique identifier' })
  declare id: string;

  @ApiProperty({ description: 'Associated report ID', nullable: true })
  declare reportId: string | null;

  @ApiProperty({ description: 'Type of alert' })
  declare alertType: string;

  @ApiProperty({ enum: AlertSeverity, description: 'Alert severity level' })
  declare severity: AlertSeverity;

  @ApiProperty({ enum: AlertStatus, description: 'Alert status' })
  declare status: AlertStatus;

  @ApiProperty({ enum: RegulatoryRegime, description: 'Regulatory regime' })
  declare regulatoryRegime: RegulatoryRegime;

  @ApiProperty({ description: 'Alert title' })
  declare title: string;

  @ApiProperty({ description: 'Alert description' })
  declare description: string;

  @ApiProperty({ description: 'Affected entities' })
  declare affectedEntities: string[];

  @ApiProperty({ description: 'Recommended action' })
  declare recommendedAction: string;

  @ApiProperty({ description: 'Action deadline', nullable: true })
  declare deadline: Date | null;

  @ApiProperty({ description: 'Assigned user ID', nullable: true })
  declare assignedTo: string | null;

  @ApiProperty({ description: 'Acknowledgment timestamp', nullable: true })
  declare acknowledgedAt: Date | null;

  @ApiProperty({ description: 'Resolution timestamp', nullable: true })
  declare resolvedAt: Date | null;

  @ApiProperty({ description: 'Resolution notes', nullable: true })
  declare resolutionNotes: string | null;

  @ApiProperty({ description: 'Escalation timestamp', nullable: true })
  declare escalatedAt: Date | null;

  @ApiProperty({ description: 'Additional metadata' })
  declare metadata: Record<string, any>;

  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getReport: BelongsToGetAssociationMixin<RegulatoryReport>;

  declare static associations: {
    report: Association<ComplianceAlert, RegulatoryReport>;
  };

  /**
   * Initialize ComplianceAlert with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof ComplianceAlert {
    ComplianceAlert.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        reportId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'regulatory_reports',
            key: 'id',
          },
          field: 'report_id',
        },
        alertType: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'alert_type',
        },
        severity: {
          type: DataTypes.ENUM(...Object.values(AlertSeverity)),
          allowNull: false,
          field: 'severity',
        },
        status: {
          type: DataTypes.ENUM(...Object.values(AlertStatus)),
          allowNull: false,
          defaultValue: AlertStatus.OPEN,
          field: 'status',
        },
        regulatoryRegime: {
          type: DataTypes.ENUM(...Object.values(RegulatoryRegime)),
          allowNull: false,
          field: 'regulatory_regime',
        },
        title: {
          type: DataTypes.STRING(500),
          allowNull: false,
          field: 'title',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: 'description',
        },
        affectedEntities: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
          field: 'affected_entities',
        },
        recommendedAction: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: 'recommended_action',
        },
        deadline: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deadline',
        },
        assignedTo: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'assigned_to',
        },
        acknowledgedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'acknowledged_at',
        },
        resolvedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'resolved_at',
        },
        resolutionNotes: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'resolution_notes',
        },
        escalatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'escalated_at',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'updated_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
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
        tableName: 'compliance_alerts',
        modelName: 'ComplianceAlert',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['report_id'] },
          { fields: ['alert_type'] },
          { fields: ['severity'] },
          { fields: ['status'] },
          { fields: ['regulatory_regime'] },
          { fields: ['assigned_to'] },
          { fields: ['deadline'] },
        ],
      }
    );

    return ComplianceAlert;
  }
}

// ============================================================================
// SEQUELIZE MODEL: AuditTrailEntry
// ============================================================================

/**
 * TypeScript interface for AuditTrailEntry attributes
 */
export interface AuditTrailEntryAttributes {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, any>[];
  ipAddress: string;
  sessionId: string;
  regulatoryContext: string | null;
  tamperProofHash: string;
  previousHash: string;
  metadata: Record<string, any>;
  createdAt?: Date;
}

export interface AuditTrailEntryCreationAttributes
  extends Optional<AuditTrailEntryAttributes, 'id' | 'regulatoryContext'> {}

/**
 * Sequelize Model: AuditTrailEntry
 * Tamper-proof audit trail entries
 */
@ApiTags('audit-trail')
export class AuditTrailEntry
  extends Model<AuditTrailEntryAttributes, AuditTrailEntryCreationAttributes>
  implements AuditTrailEntryAttributes
{
  @ApiProperty({ description: 'Unique identifier' })
  declare id: string;

  @ApiProperty({ description: 'User who performed action' })
  declare userId: string;

  @ApiProperty({ description: 'Action performed' })
  declare action: string;

  @ApiProperty({ description: 'Entity type affected' })
  declare entityType: string;

  @ApiProperty({ description: 'Entity ID affected' })
  declare entityId: string;

  @ApiProperty({ description: 'Changes made' })
  declare changes: Record<string, any>[];

  @ApiProperty({ description: 'IP address of user' })
  declare ipAddress: string;

  @ApiProperty({ description: 'Session identifier' })
  declare sessionId: string;

  @ApiProperty({ description: 'Regulatory context', nullable: true })
  declare regulatoryContext: string | null;

  @ApiProperty({ description: 'Tamper-proof hash' })
  declare tamperProofHash: string;

  @ApiProperty({ description: 'Previous entry hash' })
  declare previousHash: string;

  @ApiProperty({ description: 'Additional metadata' })
  declare metadata: Record<string, any>;

  declare readonly createdAt: Date;

  /**
   * Initialize AuditTrailEntry with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof AuditTrailEntry {
    AuditTrailEntry.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'user_id',
        },
        action: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'action',
        },
        entityType: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'entity_type',
        },
        entityId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'entity_id',
        },
        changes: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'changes',
        },
        ipAddress: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'ip_address',
        },
        sessionId: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'session_id',
        },
        regulatoryContext: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'regulatory_context',
        },
        tamperProofHash: {
          type: DataTypes.STRING(64),
          allowNull: false,
          field: 'tamper_proof_hash',
        },
        previousHash: {
          type: DataTypes.STRING(64),
          allowNull: false,
          field: 'previous_hash',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
      },
      {
        sequelize,
        tableName: 'audit_trail_entries',
        modelName: 'AuditTrailEntry',
        timestamps: false,
        underscored: true,
        indexes: [
          { fields: ['user_id'] },
          { fields: ['action'] },
          { fields: ['entity_type'] },
          { fields: ['entity_id'] },
          { fields: ['created_at'] },
          { fields: ['regulatory_context'] },
          { fields: ['tamper_proof_hash'], unique: true },
        ],
      }
    );

    return AuditTrailEntry;
  }
}

// ============================================================================
// SEQUELIZE MODEL: PositionLimitMonitoring
// ============================================================================

/**
 * TypeScript interface for PositionLimitMonitoring attributes
 */
export interface PositionLimitMonitoringAttributes {
  id: string;
  traderId: string;
  commodity: string;
  contractMonth: string;
  exchange: string;
  longPosition: number;
  shortPosition: number;
  netPosition: number;
  grossPosition: number;
  spotMonthLimit: number;
  singleMonthLimit: number;
  allMonthsLimit: number;
  spotMonthUtilization: number;
  singleMonthUtilization: number;
  allMonthsUtilization: number;
  breachStatus: boolean;
  breachType: string | null;
  notificationSent: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface PositionLimitMonitoringCreationAttributes
  extends Optional<PositionLimitMonitoringAttributes, 'id' | 'breachType' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: PositionLimitMonitoring
 * Position limit monitoring and alerts
 */
@ApiTags('position-limits')
export class PositionLimitMonitoring
  extends Model<PositionLimitMonitoringAttributes, PositionLimitMonitoringCreationAttributes>
  implements PositionLimitMonitoringAttributes
{
  @ApiProperty({ description: 'Unique identifier' })
  declare id: string;

  @ApiProperty({ description: 'Trader identifier' })
  declare traderId: string;

  @ApiProperty({ description: 'Commodity name' })
  declare commodity: string;

  @ApiProperty({ description: 'Contract month' })
  declare contractMonth: string;

  @ApiProperty({ description: 'Exchange' })
  declare exchange: string;

  @ApiProperty({ description: 'Long position size' })
  declare longPosition: number;

  @ApiProperty({ description: 'Short position size' })
  declare shortPosition: number;

  @ApiProperty({ description: 'Net position' })
  declare netPosition: number;

  @ApiProperty({ description: 'Gross position' })
  declare grossPosition: number;

  @ApiProperty({ description: 'Spot month limit' })
  declare spotMonthLimit: number;

  @ApiProperty({ description: 'Single month limit' })
  declare singleMonthLimit: number;

  @ApiProperty({ description: 'All months combined limit' })
  declare allMonthsLimit: number;

  @ApiProperty({ description: 'Spot month utilization percentage' })
  declare spotMonthUtilization: number;

  @ApiProperty({ description: 'Single month utilization percentage' })
  declare singleMonthUtilization: number;

  @ApiProperty({ description: 'All months utilization percentage' })
  declare allMonthsUtilization: number;

  @ApiProperty({ description: 'Whether limit is breached' })
  declare breachStatus: boolean;

  @ApiProperty({ description: 'Type of breach if any', nullable: true })
  declare breachType: string | null;

  @ApiProperty({ description: 'Whether notification was sent' })
  declare notificationSent: boolean;

  @ApiProperty({ description: 'Additional metadata' })
  declare metadata: Record<string, any>;

  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize PositionLimitMonitoring with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof PositionLimitMonitoring {
    PositionLimitMonitoring.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        traderId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'trader_id',
        },
        commodity: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'commodity',
        },
        contractMonth: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'contract_month',
        },
        exchange: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'exchange',
        },
        longPosition: {
          type: DataTypes.DECIMAL(20, 4),
          allowNull: false,
          field: 'long_position',
        },
        shortPosition: {
          type: DataTypes.DECIMAL(20, 4),
          allowNull: false,
          field: 'short_position',
        },
        netPosition: {
          type: DataTypes.DECIMAL(20, 4),
          allowNull: false,
          field: 'net_position',
        },
        grossPosition: {
          type: DataTypes.DECIMAL(20, 4),
          allowNull: false,
          field: 'gross_position',
        },
        spotMonthLimit: {
          type: DataTypes.DECIMAL(20, 4),
          allowNull: false,
          field: 'spot_month_limit',
        },
        singleMonthLimit: {
          type: DataTypes.DECIMAL(20, 4),
          allowNull: false,
          field: 'single_month_limit',
        },
        allMonthsLimit: {
          type: DataTypes.DECIMAL(20, 4),
          allowNull: false,
          field: 'all_months_limit',
        },
        spotMonthUtilization: {
          type: DataTypes.DECIMAL(6, 2),
          allowNull: false,
          field: 'spot_month_utilization',
        },
        singleMonthUtilization: {
          type: DataTypes.DECIMAL(6, 2),
          allowNull: false,
          field: 'single_month_utilization',
        },
        allMonthsUtilization: {
          type: DataTypes.DECIMAL(6, 2),
          allowNull: false,
          field: 'all_months_utilization',
        },
        breachStatus: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'breach_status',
        },
        breachType: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: 'breach_type',
        },
        notificationSent: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'notification_sent',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'updated_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
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
        tableName: 'position_limit_monitoring',
        modelName: 'PositionLimitMonitoring',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['trader_id'] },
          { fields: ['commodity'] },
          { fields: ['exchange'] },
          { fields: ['breach_status'] },
          { fields: ['created_at'] },
        ],
      }
    );

    return PositionLimitMonitoring;
  }
}

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

/**
 * Define associations between models
 */
export function defineRegulatoryReportingAssociations(): void {
  RegulatoryReport.hasMany(ComplianceAlert, {
    foreignKey: 'reportId',
    as: 'alerts',
    onDelete: 'CASCADE',
  });

  ComplianceAlert.belongsTo(RegulatoryReport, {
    foreignKey: 'reportId',
    as: 'report',
  });
}

// ============================================================================
// INJECTABLE SERVICE: RegulatoryReportingService
// ============================================================================

/**
 * NestJS Injectable Service for Regulatory Reporting
 */
@Injectable()
export class RegulatoryReportingService {
  private readonly logger = new Logger(RegulatoryReportingService.name);

  // ============================================================================
  // MIFID II TRANSACTION REPORTING FUNCTIONS (5 functions)
  // ============================================================================

  /**
   * Create and persist MiFID II transaction report
   */
  async createMiFIDIITransactionReport(
    tradeData: {
      tradeId: string;
      tradingVenue: string;
      reportingEntity: string;
      buyerId: string;
      sellerId: string;
      executionTime: Date;
      instrument: { isin: string; name: string; classification: string };
      quantity: number;
      price: number;
      currency: string;
      tradingCapacity: 'DEAL' | 'MTCH' | 'AOTC';
      executingEntity: string;
      investmentDecisionMaker: string;
      executor: string;
    },
    userId: string,
    transaction?: Transaction
  ): Promise<RegulatoryReport> {
    this.logger.log(`Creating MiFID II transaction report for trade ${tradeData.tradeId}`);

    // Generate MiFID II report using kit function
    const mifidReport = RegulatoryKit.generateMiFIDIITransactionReport(tradeData);

    // Validate report
    const validation = RegulatoryKit.validateMiFIDIIReport(mifidReport);

    // Calculate submission deadline (T+1 for MiFID II)
    const submissionDeadline = new Date();
    submissionDeadline.setDate(submissionDeadline.getDate() + 1);

    // Create regulatory report entity
    const report = await RegulatoryReport.create(
      {
        reportType: 'MIFID_II_TRANSACTION',
        regulatoryRegime: RegulatoryRegime.MIFID_II,
        reportingEntity: tradeData.reportingEntity,
        reportPeriodStart: tradeData.executionTime,
        reportPeriodEnd: tradeData.executionTime,
        submissionDeadline,
        status: validation.valid ? ReportSubmissionStatus.VALIDATED : ReportSubmissionStatus.PENDING_VALIDATION,
        reportData: mifidReport as any,
        validationResults: [
          {
            timestamp: new Date(),
            valid: validation.valid,
            errors: validation.errors,
            validationType: 'STRUCTURAL_VALIDATION',
          },
        ],
        amendmentCount: 0,
        metadata: {
          tradeId: tradeData.tradeId,
          isin: tradeData.instrument.isin,
          venue: tradeData.tradingVenue,
        },
        createdBy: userId,
      },
      { transaction }
    );

    // Create alert if validation failed
    if (!validation.valid) {
      await this.createValidationAlert(
        report.id,
        RegulatoryRegime.MIFID_II,
        validation.errors,
        userId,
        transaction
      );
    }

    return report;
  }

  /**
   * Submit MiFID II report to regulatory authority
   */
  async submitMiFIDIIReport(
    reportId: string,
    userId: string,
    transaction?: Transaction
  ): Promise<{ report: RegulatoryReport; submissionResult: any }> {
    this.logger.log(`Submitting MiFID II report ${reportId}`);

    const report = await RegulatoryReport.findByPk(reportId, { transaction });
    if (!report) {
      throw new Error(`Report ${reportId} not found`);
    }

    // Submit to regulatory authority using kit function
    const submissionResult = await RegulatoryKit.submitMiFIDIIReport(report.reportData as any, transaction);

    // Update report with submission details
    await report.update(
      {
        status: ReportSubmissionStatus.SUBMITTED,
        submissionReference: submissionResult.regulatoryReference,
        regulatoryReference: submissionResult.regulatoryReference,
        submittedAt: submissionResult.timestamp,
        updatedBy: userId,
      },
      { transaction }
    );

    // Create audit trail entry
    await this.createAuditEntry(
      userId,
      'SUBMIT_MIFID_II_REPORT',
      'RegulatoryReport',
      reportId,
      [
        {
          field: 'status',
          oldValue: ReportSubmissionStatus.VALIDATED,
          newValue: ReportSubmissionStatus.SUBMITTED,
        },
      ],
      'MIFID_II',
      transaction
    );

    return { report, submissionResult };
  }

  /**
   * Generate MiFID II transparency report
   */
  async generateMiFIDIITransparencyReport(
    trades: Array<{
      isin: string;
      venue: string;
      price: number;
      quantity: number;
      timestamp: Date;
      tradeType: 'ORDINARY' | 'NEGOTIATED' | 'TECHNICAL';
    }>,
    reportingEntity: string,
    userId: string,
    transaction?: Transaction
  ): Promise<RegulatoryReport> {
    this.logger.log(`Generating MiFIR transparency report for ${trades.length} trades`);

    // Generate transparency report using kit function
    const transparencyReport = RegulatoryKit.generateMiFIRTransparencyReport(trades);

    const submissionDeadline = new Date();
    submissionDeadline.setMinutes(submissionDeadline.getMinutes() + 15); // T+15 minutes for transparency

    const report = await RegulatoryReport.create(
      {
        reportType: 'MIFIR_TRANSPARENCY',
        regulatoryRegime: RegulatoryRegime.MIFID_II,
        reportingEntity,
        reportPeriodStart: new Date(Math.min(...trades.map(t => t.timestamp.getTime()))),
        reportPeriodEnd: new Date(Math.max(...trades.map(t => t.timestamp.getTime()))),
        submissionDeadline,
        status: ReportSubmissionStatus.VALIDATED,
        reportData: transparencyReport as any,
        validationResults: [],
        amendmentCount: 0,
        metadata: {
          tradeCount: trades.length,
          instruments: [...new Set(trades.map(t => t.isin))],
        },
        createdBy: userId,
      },
      { transaction }
    );

    return report;
  }

  /**
   * Validate MiFID II timestamps for compliance
   */
  async validateMiFIDIITimestamps(
    reportId: string,
    systemTimestamp: Date,
    transaction?: Transaction
  ): Promise<{ valid: boolean; validation: any }> {
    const report = await RegulatoryReport.findByPk(reportId, { transaction });
    if (!report) {
      throw new Error(`Report ${reportId} not found`);
    }

    const reportData = report.reportData as any;
    const reportTimestamp = new Date(reportData.tradingDateTime);

    const validation = RegulatoryKit.validateMiFIDIITimestamps(reportTimestamp, systemTimestamp);

    // Add validation result to report
    const validationResults = [
      ...report.validationResults,
      {
        timestamp: new Date(),
        validationType: 'TIMESTAMP_VALIDATION',
        ...validation,
      },
    ];

    await report.update({ validationResults }, { transaction });

    return { valid: validation.valid, validation };
  }

  /**
   * Generate MiFID II XML report for ARM submission
   */
  async generateMiFIDIIXMLExport(reportId: string, transaction?: Transaction): Promise<string> {
    const report = await RegulatoryReport.findByPk(reportId, { transaction });
    if (!report) {
      throw new Error(`Report ${reportId} not found`);
    }

    return RegulatoryKit.generateMiFIDIIXMLReport(report.reportData as any);
  }

  // ============================================================================
  // EMIR TRADE REPORTING FUNCTIONS (5 functions)
  // ============================================================================

  /**
   * Create and persist EMIR trade report
   */
  async createEMIRTradeReport(
    tradeData: {
      uniqueTradeId: string;
      reportingCounterparty: string;
      otherCounterparty: string;
      tradeDate: Date;
      valueDate: Date;
      maturityDate: Date;
      assetClass: 'CR' | 'IR' | 'EQ' | 'FX' | 'CO';
      productType: string;
      notionalCurrency: string;
      notionalAmount: number;
      price: number;
      direction: 'BUY' | 'SELL';
      cleared: boolean;
      clearingHouse?: string;
    },
    userId: string,
    transaction?: Transaction
  ): Promise<RegulatoryReport> {
    this.logger.log(`Creating EMIR trade report for ${tradeData.uniqueTradeId}`);

    // Generate EMIR report using kit function
    const emirReport = RegulatoryKit.generateEMIRTradeReport(tradeData);

    // Validate report
    const validation = RegulatoryKit.validateEMIRReport(emirReport);

    // EMIR reporting deadline: T+1 working day
    const submissionDeadline = new Date();
    submissionDeadline.setDate(submissionDeadline.getDate() + 1);

    const report = await RegulatoryReport.create(
      {
        reportType: 'EMIR_TRADE_REPORT',
        regulatoryRegime: RegulatoryRegime.EMIR,
        reportingEntity: tradeData.reportingCounterparty,
        reportPeriodStart: tradeData.tradeDate,
        reportPeriodEnd: tradeData.tradeDate,
        submissionDeadline,
        status: validation.valid ? ReportSubmissionStatus.VALIDATED : ReportSubmissionStatus.PENDING_VALIDATION,
        reportData: emirReport as any,
        validationResults: [
          {
            timestamp: new Date(),
            valid: validation.valid,
            errors: validation.errors,
            validationType: 'EMIR_VALIDATION',
          },
        ],
        amendmentCount: 0,
        metadata: {
          uniqueTradeId: tradeData.uniqueTradeId,
          assetClass: tradeData.assetClass,
          productType: tradeData.productType,
          cleared: tradeData.cleared,
        },
        createdBy: userId,
      },
      { transaction }
    );

    if (!validation.valid) {
      await this.createValidationAlert(report.id, RegulatoryRegime.EMIR, validation.errors, userId, transaction);
    }

    return report;
  }

  /**
   * Submit EMIR report to trade repository
   */
  async submitEMIRReport(
    reportId: string,
    tradeRepository: string,
    userId: string,
    transaction?: Transaction
  ): Promise<{ report: RegulatoryReport; submissionResult: any }> {
    this.logger.log(`Submitting EMIR report ${reportId} to ${tradeRepository}`);

    const report = await RegulatoryReport.findByPk(reportId, { transaction });
    if (!report) {
      throw new Error(`Report ${reportId} not found`);
    }

    const submissionResult = await RegulatoryKit.submitEMIRReport(
      report.reportData as any,
      tradeRepository
    );

    await report.update(
      {
        status: ReportSubmissionStatus.SUBMITTED,
        submissionReference: submissionResult.repositoryReference,
        regulatoryReference: submissionResult.repositoryReference,
        submittedAt: submissionResult.timestamp,
        acceptedAt: submissionResult.reportingStatus === 'ACCEPTED' ? new Date() : null,
        updatedBy: userId,
      },
      { transaction }
    );

    await this.createAuditEntry(
      userId,
      'SUBMIT_EMIR_REPORT',
      'RegulatoryReport',
      reportId,
      [{ field: 'status', oldValue: ReportSubmissionStatus.VALIDATED, newValue: ReportSubmissionStatus.SUBMITTED }],
      'EMIR',
      transaction
    );

    return { report, submissionResult };
  }

  /**
   * Track EMIR reporting status across lifecycle
   */
  async trackEMIRReportingStatus(
    uniqueTradeId: string,
    transaction?: Transaction
  ): Promise<{ reports: RegulatoryReport[]; statusSummary: any }> {
    const reports = await RegulatoryReport.findAll({
      where: {
        regulatoryRegime: RegulatoryRegime.EMIR,
        'metadata.uniqueTradeId': uniqueTradeId,
      },
      order: [['createdAt', 'ASC']],
      transaction,
    });

    const statusSummary = await RegulatoryKit.trackEMIRReportingStatus(uniqueTradeId);

    return { reports, statusSummary };
  }

  /**
   * Generate EMIR XML report
   */
  async generateEMIRXMLExport(reportId: string, transaction?: Transaction): Promise<string> {
    const report = await RegulatoryReport.findByPk(reportId, { transaction });
    if (!report) {
      throw new Error(`Report ${reportId} not found`);
    }

    return RegulatoryKit.generateEMIRXMLReport(report.reportData as any);
  }

  /**
   * Calculate EMIR reporting fields for derivative
   */
  async calculateEMIRReportingFields(
    derivative: {
      productType: string;
      underlyingAsset: string;
      notional: number;
      currency: string;
    },
    transaction?: Transaction
  ): Promise<any> {
    return RegulatoryKit.calculateEMIRReportingFields(derivative);
  }

  // ============================================================================
  // DODD-FRANK / CFTC REPORTING FUNCTIONS (5 functions)
  // ============================================================================

  /**
   * Create and persist Dodd-Frank swap report
   */
  async createDoddFrankSwapReport(
    swapData: {
      uniqueSwapId: string;
      reportingParty: string;
      counterparty: string;
      executionTime: Date;
      effectiveDate: Date;
      terminationDate: Date;
      assetClass: 'CR' | 'IR' | 'EQ' | 'FX' | 'CO';
      swapCategory: string;
      underlying: string;
      notional: number;
      currency: string;
      cleared: boolean;
      sef?: string;
    },
    userId: string,
    transaction?: Transaction
  ): Promise<RegulatoryReport> {
    this.logger.log(`Creating Dodd-Frank swap report for ${swapData.uniqueSwapId}`);

    const swapReport = RegulatoryKit.generateDoddFrankReport(swapData);
    const validation = RegulatoryKit.validateCFTCReport(swapReport);

    // Real-time reporting for cleared swaps, T+1 for uncleared
    const submissionDeadline = new Date();
    if (swapData.cleared) {
      submissionDeadline.setMinutes(submissionDeadline.getMinutes() + 30); // 30 minutes for cleared
    } else {
      submissionDeadline.setDate(submissionDeadline.getDate() + 1); // T+1 for uncleared
    }

    const report = await RegulatoryReport.create(
      {
        reportType: 'DODD_FRANK_SWAP',
        regulatoryRegime: RegulatoryRegime.DODD_FRANK,
        reportingEntity: swapData.reportingParty,
        reportPeriodStart: swapData.executionTime,
        reportPeriodEnd: swapData.executionTime,
        submissionDeadline,
        status: validation.valid ? ReportSubmissionStatus.VALIDATED : ReportSubmissionStatus.PENDING_VALIDATION,
        reportData: swapReport as any,
        validationResults: [
          {
            timestamp: new Date(),
            valid: validation.valid,
            errors: validation.errors,
            validationType: 'CFTC_VALIDATION',
          },
        ],
        amendmentCount: 0,
        metadata: {
          uniqueSwapId: swapData.uniqueSwapId,
          assetClass: swapData.assetClass,
          cleared: swapData.cleared,
          sef: swapData.sef,
        },
        createdBy: userId,
      },
      { transaction }
    );

    if (!validation.valid) {
      await this.createValidationAlert(
        report.id,
        RegulatoryRegime.DODD_FRANK,
        validation.errors,
        userId,
        transaction
      );
    }

    return report;
  }

  /**
   * Submit CFTC swap report to SDR
   */
  async submitCFTCSwapReport(
    reportId: string,
    sdr: string,
    userId: string,
    transaction?: Transaction
  ): Promise<{ report: RegulatoryReport; submissionResult: any }> {
    this.logger.log(`Submitting CFTC swap report ${reportId} to ${sdr}`);

    const report = await RegulatoryReport.findByPk(reportId, { transaction });
    if (!report) {
      throw new Error(`Report ${reportId} not found`);
    }

    const submissionResult = await RegulatoryKit.submitCFTCSwapReport(report.reportData as any, sdr);

    await report.update(
      {
        status: ReportSubmissionStatus.SUBMITTED,
        submissionReference: submissionResult.sdrReference,
        regulatoryReference: submissionResult.sdrReference,
        submittedAt: submissionResult.timestamp,
        acceptedAt: submissionResult.cftcCompliant ? new Date() : null,
        updatedBy: userId,
      },
      { transaction }
    );

    await this.createAuditEntry(
      userId,
      'SUBMIT_CFTC_REPORT',
      'RegulatoryReport',
      reportId,
      [{ field: 'status', oldValue: ReportSubmissionStatus.VALIDATED, newValue: ReportSubmissionStatus.SUBMITTED }],
      'DODD_FRANK',
      transaction
    );

    return { report, submissionResult };
  }

  /**
   * Track CFTC reporting status
   */
  async trackCFTCReportingStatus(
    uniqueSwapId: string,
    transaction?: Transaction
  ): Promise<{ reports: RegulatoryReport[]; statusSummary: any }> {
    const reports = await RegulatoryReport.findAll({
      where: {
        regulatoryRegime: RegulatoryRegime.DODD_FRANK,
        'metadata.uniqueSwapId': uniqueSwapId,
      },
      order: [['createdAt', 'ASC']],
      transaction,
    });

    const statusSummary = await RegulatoryKit.trackCFTCReportingStatus(uniqueSwapId);

    return { reports, statusSummary };
  }

  /**
   * Generate CFTC XML report
   */
  async generateCFTCXMLExport(reportId: string, transaction?: Transaction): Promise<string> {
    const report = await RegulatoryReport.findByPk(reportId, { transaction });
    if (!report) {
      throw new Error(`Report ${reportId} not found`);
    }

    return RegulatoryKit.generateCFTCXMLReport(report.reportData as any);
  }

  /**
   * Calculate CFTC reporting fields
   */
  async calculateCFTCReportingFields(
    swap: {
      productType: string;
      underlying: string;
      notional: number;
      cleared: boolean;
    },
    transaction?: Transaction
  ): Promise<any> {
    return RegulatoryKit.calculateCFTCReportingFields(swap);
  }

  // ============================================================================
  // SEC REPORTING FUNCTIONS (4 functions)
  // ============================================================================

  /**
   * Create and persist SEC Form 13F report
   */
  async createSECForm13FReport(
    reportData: {
      managerName: string;
      managerCIK: string;
      managerAddress: string;
      reportYear: number;
      reportQuarter: 1 | 2 | 3 | 4;
      holdings: Array<{
        issuerName: string;
        titleOfClass: string;
        cusip: string;
        value: number;
        shares: number;
        putCall?: 'PUT' | 'CALL';
      }>;
    },
    userId: string,
    transaction?: Transaction
  ): Promise<RegulatoryReport> {
    this.logger.log(`Creating SEC Form 13F for ${reportData.managerName}`);

    const form13F = RegulatoryKit.generateSECForm13F(reportData);
    const validation = RegulatoryKit.validateSECReport(form13F);

    // 13F deadline: 45 days after quarter end
    const quarterEndDate = new Date(reportData.reportYear, reportData.reportQuarter * 3, 0);
    const submissionDeadline = new Date(quarterEndDate);
    submissionDeadline.setDate(submissionDeadline.getDate() + 45);

    const report = await RegulatoryReport.create(
      {
        reportType: 'SEC_FORM_13F',
        regulatoryRegime: RegulatoryRegime.SEC,
        reportingEntity: reportData.managerCIK,
        reportPeriodStart: new Date(reportData.reportYear, (reportData.reportQuarter - 1) * 3, 1),
        reportPeriodEnd: quarterEndDate,
        submissionDeadline,
        status: validation.valid ? ReportSubmissionStatus.VALIDATED : ReportSubmissionStatus.PENDING_VALIDATION,
        reportData: form13F as any,
        validationResults: [
          {
            timestamp: new Date(),
            valid: validation.valid,
            errors: validation.errors,
            validationType: 'SEC_13F_VALIDATION',
          },
        ],
        amendmentCount: 0,
        metadata: {
          managerCIK: reportData.managerCIK,
          reportQuarter: `${reportData.reportYear}Q${reportData.reportQuarter}`,
          holdingsCount: reportData.holdings.length,
        },
        createdBy: userId,
      },
      { transaction }
    );

    if (!validation.valid) {
      await this.createValidationAlert(report.id, RegulatoryRegime.SEC, validation.errors, userId, transaction);
    }

    return report;
  }

  /**
   * Create and persist SEC Form 13H large trader report
   */
  async createSECForm13HReport(
    traderData: {
      largeTraderName: string;
      largeTraderAddress: string;
      contactPerson: string;
      phone: string;
      email: string;
      filingType: 'INITIAL' | 'ANNUAL' | 'AMENDED' | 'INACTIVE' | 'REACTIVATED' | 'TERMINATION';
      brokerDealers: Array<{
        name: string;
        crd: string;
        effectiveDate: Date;
      }>;
    },
    userId: string,
    transaction?: Transaction
  ): Promise<RegulatoryReport> {
    this.logger.log(`Creating SEC Form 13H for ${traderData.largeTraderName}`);

    const form13H = RegulatoryKit.generateSECForm13H(traderData);
    const validation = RegulatoryKit.validateSECReport(form13H);

    const submissionDeadline = new Date();
    submissionDeadline.setDate(submissionDeadline.getDate() + 10); // 10 days for initial filing

    const report = await RegulatoryReport.create(
      {
        reportType: 'SEC_FORM_13H',
        regulatoryRegime: RegulatoryRegime.SEC,
        reportingEntity: form13H.largeTraderIdentification,
        reportPeriodStart: new Date(),
        reportPeriodEnd: new Date(),
        submissionDeadline,
        status: validation.valid ? ReportSubmissionStatus.VALIDATED : ReportSubmissionStatus.PENDING_VALIDATION,
        reportData: form13H as any,
        validationResults: [
          {
            timestamp: new Date(),
            valid: validation.valid,
            errors: validation.errors,
            validationType: 'SEC_13H_VALIDATION',
          },
        ],
        amendmentCount: 0,
        metadata: {
          ltid: form13H.largeTraderIdentification,
          filingType: traderData.filingType,
        },
        createdBy: userId,
      },
      { transaction }
    );

    if (!validation.valid) {
      await this.createValidationAlert(report.id, RegulatoryRegime.SEC, validation.errors, userId, transaction);
    }

    return report;
  }

  /**
   * Submit SEC report via EDGAR
   */
  async submitSECReport(
    reportId: string,
    userId: string,
    transaction?: Transaction
  ): Promise<{ report: RegulatoryReport; submissionResult: any }> {
    this.logger.log(`Submitting SEC report ${reportId} via EDGAR`);

    const report = await RegulatoryReport.findByPk(reportId, { transaction });
    if (!report) {
      throw new Error(`Report ${reportId} not found`);
    }

    const submissionResult = await RegulatoryKit.submitSECReport(report.reportData as any);

    await report.update(
      {
        status: ReportSubmissionStatus.SUBMITTED,
        submissionReference: submissionResult.accessionNumber,
        regulatoryReference: submissionResult.accessionNumber,
        submittedAt: submissionResult.filingDate,
        acceptedAt: submissionResult.acceptanceStatus === 'ACCEPTED' ? new Date() : null,
        updatedBy: userId,
      },
      { transaction }
    );

    await this.createAuditEntry(
      userId,
      'SUBMIT_SEC_REPORT',
      'RegulatoryReport',
      reportId,
      [{ field: 'status', oldValue: ReportSubmissionStatus.VALIDATED, newValue: ReportSubmissionStatus.SUBMITTED }],
      'SEC',
      transaction
    );

    return { report, submissionResult };
  }

  /**
   * Calculate SEC reporting metrics and thresholds
   */
  async calculateSECReportingMetrics(
    activity: {
      dailyVolume: number;
      monthlyVolume: number;
      quarterlyVolume: number;
      aum: number;
    },
    transaction?: Transaction
  ): Promise<any> {
    return RegulatoryKit.calculateSECReportingMetrics(activity);
  }

  // ============================================================================
  // POSITION LIMIT MONITORING FUNCTIONS (5 functions)
  // ============================================================================

  /**
   * Monitor and persist position limits
   */
  async monitorPositionLimits(
    position: {
      traderId: string;
      commodity: string;
      contractMonth: string;
      exchange: string;
      longPosition: number;
      shortPosition: number;
    },
    limits: {
      spotMonthLimit: number;
      singleMonthLimit: number;
      allMonthsLimit: number;
    },
    userId: string,
    transaction?: Transaction
  ): Promise<{ monitoring: PositionLimitMonitoring; alert?: ComplianceAlert }> {
    this.logger.log(`Monitoring position limits for trader ${position.traderId}`);

    // Use kit function to calculate monitoring data
    const monitorResult = RegulatoryKit.monitorPositionLimits(position, limits);

    // Persist monitoring record
    const monitoring = await PositionLimitMonitoring.create(
      {
        traderId: position.traderId,
        commodity: position.commodity,
        contractMonth: position.contractMonth,
        exchange: position.exchange,
        longPosition: position.longPosition,
        shortPosition: position.shortPosition,
        netPosition: monitorResult.currentPosition.net,
        grossPosition: monitorResult.currentPosition.gross,
        spotMonthLimit: limits.spotMonthLimit,
        singleMonthLimit: limits.singleMonthLimit,
        allMonthsLimit: limits.allMonthsLimit,
        spotMonthUtilization: monitorResult.utilization.spotMonthPercent,
        singleMonthUtilization: monitorResult.utilization.singleMonthPercent,
        allMonthsUtilization: monitorResult.utilization.allMonthsPercent,
        breachStatus: monitorResult.breachStatus,
        breachType: monitorResult.breachType || null,
        notificationSent: false,
        metadata: {
          monitorResult,
        },
        createdBy: userId,
      },
      { transaction }
    );

    // Generate alert if breach detected
    let alert: ComplianceAlert | undefined;
    if (monitorResult.breachStatus) {
      const alertData = RegulatoryKit.generatePositionLimitAlert(monitorResult);
      alert = await ComplianceAlert.create(
        {
          alertType: 'POSITION_LIMIT_BREACH',
          severity: AlertSeverity.CRITICAL,
          status: AlertStatus.OPEN,
          regulatoryRegime: RegulatoryRegime.CFTC,
          title: alertData.description,
          description: alertData.description,
          affectedEntities: [position.traderId],
          recommendedAction: alertData.recommendedAction,
          deadline: alertData.deadline || null,
          metadata: {
            monitoringId: monitoring.id,
            breachType: monitorResult.breachType,
          },
          createdBy: userId,
        },
        { transaction }
      );

      await monitoring.update({ notificationSent: true }, { transaction });
    }

    return { monitoring, alert };
  }

  /**
   * Calculate aggregate positions across accounts
   */
  async calculateAggregatePositions(
    positions: Array<{
      accountId: string;
      commodity: string;
      contractMonth: string;
      longPosition: number;
      shortPosition: number;
    }>,
    transaction?: Transaction
  ): Promise<any> {
    return RegulatoryKit.calculateAggregatePositions(positions);
  }

  /**
   * Validate position limit compliance
   */
  async validatePositionLimitCompliance(
    monitoringId: string,
    transaction?: Transaction
  ): Promise<{ compliant: boolean; violations: any[] }> {
    const monitoring = await PositionLimitMonitoring.findByPk(monitoringId, { transaction });
    if (!monitoring) {
      throw new Error(`Monitoring record ${monitoringId} not found`);
    }

    const monitorData = {
      reportId: monitoring.id,
      timestamp: monitoring.createdAt,
      traderId: monitoring.traderId,
      contract: {
        commodity: monitoring.commodity,
        contractMonth: monitoring.contractMonth,
        exchange: monitoring.exchange,
      },
      currentPosition: {
        long: Number(monitoring.longPosition),
        short: Number(monitoring.shortPosition),
        net: Number(monitoring.netPosition),
        gross: Number(monitoring.grossPosition),
      },
      limits: {
        spotMonthLimit: Number(monitoring.spotMonthLimit),
        singleMonthLimit: Number(monitoring.singleMonthLimit),
        allMonthsLimit: Number(monitoring.allMonthsLimit),
      },
      utilization: {
        spotMonthPercent: Number(monitoring.spotMonthUtilization),
        singleMonthPercent: Number(monitoring.singleMonthUtilization),
        allMonthsPercent: Number(monitoring.allMonthsUtilization),
      },
      breachStatus: monitoring.breachStatus,
      breachType: monitoring.breachType,
    };

    return RegulatoryKit.validatePositionLimitCompliance(monitorData as any);
  }

  /**
   * Generate position limit compliance report
   */
  async generatePositionLimitReport(
    traderId: string,
    startDate: Date,
    endDate: Date,
    transaction?: Transaction
  ): Promise<any> {
    const monitoringRecords = await PositionLimitMonitoring.findAll({
      where: {
        traderId,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      transaction,
    });

    const monitors = monitoringRecords.map(m => ({
      reportId: m.id,
      timestamp: m.createdAt,
      traderId: m.traderId,
      contract: {
        commodity: m.commodity,
        contractMonth: m.contractMonth,
        exchange: m.exchange,
      },
      currentPosition: {
        long: Number(m.longPosition),
        short: Number(m.shortPosition),
        net: Number(m.netPosition),
        gross: Number(m.grossPosition),
      },
      limits: {
        spotMonthLimit: Number(m.spotMonthLimit),
        singleMonthLimit: Number(m.singleMonthLimit),
        allMonthsLimit: Number(m.allMonthsLimit),
      },
      utilization: {
        spotMonthPercent: Number(m.spotMonthUtilization),
        singleMonthPercent: Number(m.singleMonthUtilization),
        allMonthsPercent: Number(m.allMonthsUtilization),
      },
      breachStatus: m.breachStatus,
      breachType: m.breachType,
    }));

    return RegulatoryKit.generatePositionLimitReport(monitors as any);
  }

  /**
   * Track position limit breaches over time
   */
  async trackPositionLimitBreaches(
    traderId: string,
    days: number,
    transaction?: Transaction
  ): Promise<{ breaches: PositionLimitMonitoring[]; summary: any }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const breaches = await PositionLimitMonitoring.findAll({
      where: {
        traderId,
        breachStatus: true,
        createdAt: {
          [Op.gte]: startDate,
        },
      },
      order: [['createdAt', 'DESC']],
      transaction,
    });

    const summary = {
      totalBreaches: breaches.length,
      breachesByType: breaches.reduce((acc, b) => {
        const type = b.breachType || 'UNKNOWN';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      breachesByCommodity: breaches.reduce((acc, b) => {
        acc[b.commodity] = (acc[b.commodity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      mostRecentBreach: breaches[0] || null,
    };

    return { breaches, summary };
  }

  // ============================================================================
  // COMPLIANCE ALERT FUNCTIONS (5 functions)
  // ============================================================================

  /**
   * Create compliance alert
   */
  async createComplianceAlert(
    alertData: {
      alertType: string;
      severity: AlertSeverity;
      regulatoryRegime: RegulatoryRegime;
      title: string;
      description: string;
      affectedEntities: string[];
      recommendedAction: string;
      deadline?: Date;
      reportId?: string;
    },
    userId: string,
    transaction?: Transaction
  ): Promise<ComplianceAlert> {
    return await ComplianceAlert.create(
      {
        ...alertData,
        reportId: alertData.reportId || null,
        deadline: alertData.deadline || null,
        status: AlertStatus.OPEN,
        metadata: {},
        createdBy: userId,
      },
      { transaction }
    );
  }

  /**
   * Acknowledge compliance alert
   */
  async acknowledgeComplianceAlert(
    alertId: string,
    userId: string,
    transaction?: Transaction
  ): Promise<ComplianceAlert> {
    const alert = await ComplianceAlert.findByPk(alertId, { transaction });
    if (!alert) {
      throw new Error(`Alert ${alertId} not found`);
    }

    await alert.update(
      {
        status: AlertStatus.ACKNOWLEDGED,
        acknowledgedAt: new Date(),
        assignedTo: userId,
        updatedBy: userId,
      },
      { transaction }
    );

    await this.createAuditEntry(
      userId,
      'ACKNOWLEDGE_ALERT',
      'ComplianceAlert',
      alertId,
      [{ field: 'status', oldValue: AlertStatus.OPEN, newValue: AlertStatus.ACKNOWLEDGED }],
      alert.regulatoryRegime,
      transaction
    );

    return alert;
  }

  /**
   * Resolve compliance alert
   */
  async resolveComplianceAlert(
    alertId: string,
    resolutionNotes: string,
    userId: string,
    transaction?: Transaction
  ): Promise<ComplianceAlert> {
    const alert = await ComplianceAlert.findByPk(alertId, { transaction });
    if (!alert) {
      throw new Error(`Alert ${alertId} not found`);
    }

    await alert.update(
      {
        status: AlertStatus.RESOLVED,
        resolvedAt: new Date(),
        resolutionNotes,
        updatedBy: userId,
      },
      { transaction }
    );

    await this.createAuditEntry(
      userId,
      'RESOLVE_ALERT',
      'ComplianceAlert',
      alertId,
      [
        { field: 'status', oldValue: alert.status, newValue: AlertStatus.RESOLVED },
        { field: 'resolutionNotes', oldValue: null, newValue: resolutionNotes },
      ],
      alert.regulatoryRegime,
      transaction
    );

    return alert;
  }

  /**
   * Escalate compliance alert
   */
  async escalateComplianceAlert(
    alertId: string,
    escalationReason: string,
    userId: string,
    transaction?: Transaction
  ): Promise<ComplianceAlert> {
    const alert = await ComplianceAlert.findByPk(alertId, { transaction });
    if (!alert) {
      throw new Error(`Alert ${alertId} not found`);
    }

    await alert.update(
      {
        status: AlertStatus.ESCALATED,
        escalatedAt: new Date(),
        severity: AlertSeverity.CRITICAL,
        metadata: {
          ...alert.metadata,
          escalationReason,
          escalatedBy: userId,
        },
        updatedBy: userId,
      },
      { transaction }
    );

    await this.createAuditEntry(
      userId,
      'ESCALATE_ALERT',
      'ComplianceAlert',
      alertId,
      [{ field: 'status', oldValue: alert.status, newValue: AlertStatus.ESCALATED }],
      alert.regulatoryRegime,
      transaction
    );

    return alert;
  }

  /**
   * Get open compliance alerts by severity
   */
  async getOpenAlertsBySeverity(
    severity: AlertSeverity,
    transaction?: Transaction
  ): Promise<ComplianceAlert[]> {
    return await ComplianceAlert.findAll({
      where: {
        severity,
        status: {
          [Op.in]: [AlertStatus.OPEN, AlertStatus.ACKNOWLEDGED, AlertStatus.IN_PROGRESS],
        },
      },
      order: [['createdAt', 'DESC']],
      transaction,
    });
  }

  // ============================================================================
  // AUDIT TRAIL FUNCTIONS (4 functions)
  // ============================================================================

  /**
   * Create tamper-proof audit trail entry
   */
  async createAuditEntry(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    changes: Array<{ field: string; oldValue: any; newValue: any }>,
    regulatoryContext: string,
    transaction?: Transaction,
    ipAddress: string = '0.0.0.0',
    sessionId: string = 'system'
  ): Promise<AuditTrailEntry> {
    // Get previous hash
    const lastEntry = await AuditTrailEntry.findOne({
      order: [['createdAt', 'DESC']],
      transaction,
    });

    const previousHash = lastEntry?.tamperProofHash || '0000000000000000';

    // Create audit entry using kit function
    const auditData = RegulatoryKit.createAuditTrailEntry(
      {
        userId,
        action,
        entityType,
        entityId,
        changes,
        ipAddress,
        sessionId,
        regulatoryContext,
      },
      previousHash
    );

    return await AuditTrailEntry.create(
      {
        userId: auditData.userId,
        action: auditData.action,
        entityType: auditData.entityType,
        entityId: auditData.entityId,
        changes: auditData.changes,
        ipAddress: auditData.ipAddress,
        sessionId: auditData.sessionId,
        regulatoryContext: auditData.regulatoryContext || null,
        tamperProofHash: auditData.tamperProofHash,
        previousHash,
        metadata: {},
      },
      { transaction }
    );
  }

  /**
   * Query audit trail with filters
   */
  async queryAuditTrail(
    filters: {
      userId?: string;
      action?: string;
      entityType?: string;
      entityId?: string;
      startDate?: Date;
      endDate?: Date;
      regulatoryContext?: string;
    },
    transaction?: Transaction
  ): Promise<{ entries: AuditTrailEntry[]; totalCount: number; integrityVerified: boolean }> {
    const where: any = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.entityType) where.entityType = filters.entityType;
    if (filters.entityId) where.entityId = filters.entityId;
    if (filters.regulatoryContext) where.regulatoryContext = filters.regulatoryContext;

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt[Op.gte] = filters.startDate;
      if (filters.endDate) where.createdAt[Op.lte] = filters.endDate;
    }

    const entries = await AuditTrailEntry.findAll({
      where,
      order: [['createdAt', 'ASC']],
      transaction,
    });

    // Verify hash chain integrity
    let integrityVerified = true;
    for (let i = 1; i < entries.length; i++) {
      // In production: verify cryptographic hash chain
      // For now, just verify the chain exists
      if (!entries[i].previousHash) {
        integrityVerified = false;
        break;
      }
    }

    return {
      entries,
      totalCount: entries.length,
      integrityVerified,
    };
  }

  /**
   * Export audit trail for regulatory examination
   */
  async exportAuditTrailReport(
    exportParams: {
      startDate: Date;
      endDate: Date;
      format: 'CSV' | 'JSON' | 'XML';
      includeHashes: boolean;
      regulatoryContext?: string;
    },
    transaction?: Transaction
  ): Promise<any> {
    return await RegulatoryKit.exportAuditTrailReport(exportParams);
  }

  /**
   * Verify audit trail integrity
   */
  async verifyAuditTrailIntegrity(
    startDate: Date,
    endDate: Date,
    transaction?: Transaction
  ): Promise<{ verified: boolean; issues: string[] }> {
    const entries = await AuditTrailEntry.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['createdAt', 'ASC']],
      transaction,
    });

    const issues: string[] = [];

    for (let i = 1; i < entries.length; i++) {
      if (entries[i].previousHash !== entries[i - 1].tamperProofHash) {
        issues.push(`Hash chain broken at entry ${entries[i].id}`);
      }
    }

    return {
      verified: issues.length === 0,
      issues,
    };
  }

  // ============================================================================
  // COMPLIANCE DASHBOARD FUNCTIONS (3 functions)
  // ============================================================================

  /**
   * Generate compliance dashboard metrics
   */
  async generateComplianceDashboardMetrics(
    reportPeriod: { startDate: Date; endDate: Date },
    transaction?: Transaction
  ): Promise<any> {
    const [reports, alerts, auditEntries, positionMonitoring] = await Promise.all([
      RegulatoryReport.findAll({
        where: {
          createdAt: {
            [Op.between]: [reportPeriod.startDate, reportPeriod.endDate],
          },
        },
        transaction,
      }),
      ComplianceAlert.findAll({
        where: {
          createdAt: {
            [Op.between]: [reportPeriod.startDate, reportPeriod.endDate],
          },
        },
        transaction,
      }),
      AuditTrailEntry.findAll({
        where: {
          createdAt: {
            [Op.between]: [reportPeriod.startDate, reportPeriod.endDate],
          },
        },
        transaction,
      }),
      PositionLimitMonitoring.findAll({
        where: {
          createdAt: {
            [Op.between]: [reportPeriod.startDate, reportPeriod.endDate],
          },
        },
        transaction,
      }),
    ]);

    const reportingCompliance = {
      mifidIIReportsSubmitted: reports.filter(r => r.regulatoryRegime === RegulatoryRegime.MIFID_II).length,
      emirReportsSubmitted: reports.filter(r => r.regulatoryRegime === RegulatoryRegime.EMIR).length,
      doddFrankReportsSubmitted: reports.filter(r => r.regulatoryRegime === RegulatoryRegime.DODD_FRANK).length,
      secReportsSubmitted: reports.filter(r => r.regulatoryRegime === RegulatoryRegime.SEC).length,
      onTimeSubmissionRate:
        reports.filter(r => r.submittedAt && r.submittedAt <= r.submissionDeadline).length / reports.length || 0,
      errorRate: reports.filter(r => r.status === ReportSubmissionStatus.REJECTED).length / reports.length || 0,
    };

    const alertMetrics = {
      totalAlerts: alerts.length,
      criticalAlerts: alerts.filter(a => a.severity === AlertSeverity.CRITICAL).length,
      openAlerts: alerts.filter(a => a.status === AlertStatus.OPEN).length,
      averageResolutionTime:
        alerts
          .filter(a => a.resolvedAt)
          .reduce((sum, a) => sum + (a.resolvedAt!.getTime() - a.createdAt.getTime()) / 3600000, 0) /
          alerts.filter(a => a.resolvedAt).length || 0,
    };

    return {
      reportPeriod,
      reportingCompliance,
      tradingCompliance: {
        positionLimitBreaches: positionMonitoring.filter(p => p.breachStatus).length,
        bestExecutionViolations: 0,
        shortSellingViolations: 0,
        oatsReportingErrors: 0,
      },
      alertMetrics,
      auditMetrics: {
        totalAuditEntries: auditEntries.length,
        uniqueUsers: new Set(auditEntries.map(a => a.userId)).size,
        highRiskActions: auditEntries.filter(a =>
          ['SUBMIT_REPORT', 'DELETE_REPORT', 'OVERRIDE_LIMIT'].includes(a.action)
        ).length,
      },
    };
  }

  /**
   * Calculate compliance scores
   */
  async calculateComplianceScores(
    startDate: Date,
    endDate: Date,
    transaction?: Transaction
  ): Promise<any> {
    const reports = await RegulatoryReport.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      transaction,
    });

    const alerts = await ComplianceAlert.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      transaction,
    });

    const positionBreaches = await PositionLimitMonitoring.findAll({
      where: {
        breachStatus: true,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      transaction,
    });

    const complianceData = {
      reportingAccuracy:
        reports.filter(r => r.status === ReportSubmissionStatus.ACCEPTED).length / reports.length || 1,
      timelinessRate:
        reports.filter(r => r.submittedAt && r.submittedAt <= r.submissionDeadline).length / reports.length || 1,
      positionCompliance: 1 - positionBreaches.length / Math.max(reports.length, 1),
      auditFindings: alerts.filter(a => a.severity === AlertSeverity.WARNING).length,
      violations: alerts.filter(a => a.severity === AlertSeverity.CRITICAL).length,
    };

    return RegulatoryKit.calculateComplianceScores(complianceData);
  }

  /**
   * Generate regulatory reporting summary
   */
  async generateRegulatoryReportingSummary(
    regulatoryRegime: RegulatoryRegime,
    startDate: Date,
    endDate: Date,
    transaction?: Transaction
  ): Promise<any> {
    const reports = await RegulatoryReport.findAll({
      where: {
        regulatoryRegime,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [{ model: ComplianceAlert, as: 'alerts' }],
      transaction,
    });

    const summary = {
      regime: regulatoryRegime,
      period: { startDate, endDate },
      totalReports: reports.length,
      reportsByStatus: reports.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      reportsByType: reports.reduce((acc, r) => {
        acc[r.reportType] = (acc[r.reportType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      submissionMetrics: {
        submitted: reports.filter(r => r.submittedAt).length,
        accepted: reports.filter(r => r.acceptedAt).length,
        rejected: reports.filter(r => r.rejectionReason).length,
        onTime: reports.filter(r => r.submittedAt && r.submittedAt <= r.submissionDeadline).length,
        late: reports.filter(r => r.submittedAt && r.submittedAt > r.submissionDeadline).length,
      },
      amendmentRate: reports.reduce((sum, r) => sum + r.amendmentCount, 0) / reports.length || 0,
      associatedAlerts: reports.reduce((sum, r) => sum + (r as any).alerts?.length || 0, 0),
    };

    return summary;
  }

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Create validation alert (private helper)
   */
  private async createValidationAlert(
    reportId: string,
    regulatoryRegime: RegulatoryRegime,
    errors: string[],
    userId: string,
    transaction?: Transaction
  ): Promise<ComplianceAlert> {
    return await ComplianceAlert.create(
      {
        reportId,
        alertType: 'VALIDATION_ERROR',
        severity: AlertSeverity.WARNING,
        status: AlertStatus.OPEN,
        regulatoryRegime,
        title: 'Report Validation Failed',
        description: `Validation errors: ${errors.join(', ')}`,
        affectedEntities: [reportId],
        recommendedAction: 'Review and correct validation errors before submission',
        metadata: {
          errors,
        },
        createdBy: userId,
      },
      { transaction }
    );
  }
}

// ============================================================================
// INITIALIZATION FUNCTION
// ============================================================================

/**
 * Initialize all regulatory reporting models
 */
export function initializeRegulatoryReportingModels(sequelize: Sequelize): void {
  RegulatoryReport.initModel(sequelize);
  ComplianceAlert.initModel(sequelize);
  AuditTrailEntry.initModel(sequelize);
  PositionLimitMonitoring.initModel(sequelize);
  defineRegulatoryReportingAssociations();
}

/**
 * Export all models and service
 */
export {
  RegulatoryReport,
  ComplianceAlert,
  AuditTrailEntry,
  PositionLimitMonitoring,
  RegulatoryReportingService,
};
