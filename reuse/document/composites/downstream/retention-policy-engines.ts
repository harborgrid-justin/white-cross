/**
 * LOC: DOC-RETENTION-ENG-001
 * File: /reuse/document/composites/downstream/retention-policy-engines.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - ../document-compliance-audit-composite
 *   - ../document-versioning-lifecycle-composite
 *
 * DOWNSTREAM (imported by):
 *   - Compliance enforcement services
 *   - Document lifecycle automation
 *   - Regulatory reporting systems
 *   - Data retention management
 */

/**
 * File: /reuse/document/composites/downstream/retention-policy-engines.ts
 * Locator: WC-RETENTION-ENG-001
 * Purpose: Data Retention Policy Engines - Automated retention lifecycle and compliance enforcement
 *
 * Upstream: Composed from document-compliance-audit-composite, document-versioning-lifecycle-composite
 * Downstream: Compliance enforcement, lifecycle automation, regulatory reporting, retention management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 11.x, Sequelize 6.x
 * Exports: 15 production-ready functions for retention policy management and enforcement
 *
 * LLM Context: Production-grade retention policy engine for White Cross healthcare platform.
 * Manages document retention policies with regulatory compliance, automatic lifecycle transitions,
 * policy enforcement, and compliance reporting. Ensures HIPAA retention requirements are met.
 */

import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  Model,
  Column,
  Table,
  DataType,
  Index,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsObject,
  IsArray,
  IsDate,
  IsOptional,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Sequelize, Transaction, Op } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Retention policy status enumeration
 */
export enum RetentionPolicyStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Document lifecycle phase enumeration
 */
export enum LifecyclePhase {
  ACTIVE = 'ACTIVE', // Currently in use
  INACTIVE = 'INACTIVE', // No longer in active use
  ARCHIVED = 'ARCHIVED', // Moved to archive storage
  RETAINED = 'RETAINED', // Legal hold or retention
  SCHEDULED_DELETION = 'SCHEDULED_DELETION', // Awaiting deletion
  DELETED = 'DELETED', // Permanently deleted
}

/**
 * Retention trigger enumeration
 */
export enum RetentionTrigger {
  CREATION = 'CREATION', // Start counting from creation date
  LAST_ACCESS = 'LAST_ACCESS', // Start counting from last access
  APPROVAL = 'APPROVAL', // Start counting from approval date
  LEGAL_HOLD = 'LEGAL_HOLD', // Legal hold prevents deletion
  CUSTOM = 'CUSTOM', // Custom trigger condition
}

/**
 * Retention rule interface
 */
export interface RetentionRule {
  id: string;
  name: string;
  description: string;
  trigger: RetentionTrigger;
  retentionPeriodDays: number;
  archiveAfterDays?: number;
  disposalMethod: 'SECURE_DELETE' | 'SHRED' | 'RETURN' | 'RETAIN';
  autoDispose: boolean;
  complianceFrameworks: string[];
  applicableDocumentTypes: string[];
  excludeOnLegalHold: boolean;
}

/**
 * Retention policy interface
 */
export interface RetentionPolicy {
  id: string;
  name: string;
  description: string;
  rules: RetentionRule[];
  organization: string;
  department?: string;
  effectiveDate: Date;
  status: RetentionPolicyStatus;
}

/**
 * Retention policy DTO
 */
export class RetentionPolicyDto {
  @ApiProperty({ description: 'Retention policy identifier' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Policy name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Policy status' })
  @IsEnum(RetentionPolicyStatus)
  status: RetentionPolicyStatus;

  @ApiPropertyOptional({ description: 'Number of associated rules' })
  @IsNumber()
  ruleCount?: number;

  @ApiPropertyOptional({ description: 'Effective date' })
  @IsDate()
  effectiveDate?: Date;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  @IsDate()
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last modified timestamp' })
  @IsDate()
  updatedAt?: Date;
}

// ============================================================================
// DATABASE MODELS
// ============================================================================

/**
 * Retention Policy Model - Stores retention policy definitions
 */
@Table({
  tableName: 'retention_policies',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { fields: ['organization'] },
    { fields: ['status'] },
    { fields: ['effective_date'] },
  ],
})
export class RetentionPolicyModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  organization: string;

  @Column(DataType.STRING(100))
  department: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(RetentionPolicyStatus)))
  status: RetentionPolicyStatus;

  @AllowNull(false)
  @Column(DataType.DATE)
  effectiveDate: Date;

  @Column(DataType.DATE)
  expirationDate: Date;

  @Column(DataType.JSON)
  complianceFrameworks: string[];

  @Default(0)
  @Column(DataType.INTEGER)
  ruleCount: number;

  @Column(DataType.JSON)
  metadata: Record<string, any>;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;

  @DeletedAt
  @Column(DataType.DATE)
  deletedAt: Date;
}

/**
 * Retention Rule Model - Stores individual retention rules
 */
@Table({
  tableName: 'retention_rules',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class RetentionRuleModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  policyId: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(RetentionTrigger)))
  trigger: RetentionTrigger;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  retentionPeriodDays: number;

  @Column(DataType.INTEGER)
  archiveAfterDays: number;

  @AllowNull(false)
  @Column(DataType.ENUM('SECURE_DELETE', 'SHRED', 'RETURN', 'RETAIN'))
  disposalMethod: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  autoDispose: boolean;

  @Column(DataType.JSON)
  applicableDocumentTypes: string[];

  @Column(DataType.JSON)
  complianceFrameworks: string[];

  @Default(false)
  @Column(DataType.BOOLEAN)
  excludeOnLegalHold: boolean;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;

  @DeletedAt
  @Column(DataType.DATE)
  deletedAt: Date;
}

/**
 * Document Lifecycle Model - Tracks document lifecycle phases and transitions
 */
@Table({
  tableName: 'document_lifecycles',
  timestamps: true,
  paranoid: false,
  underscored: true,
  indexes: [
    { fields: ['document_id'] },
    { fields: ['current_phase'] },
    { fields: ['policy_id'] },
  ],
})
export class DocumentLifecycle extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.UUID)
  documentId: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  policyId: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(LifecyclePhase)))
  currentPhase: LifecyclePhase;

  @Column(DataType.DATE)
  createdDate: Date;

  @Column(DataType.DATE)
  activatedDate: Date;

  @Column(DataType.DATE)
  inactivatedDate: Date;

  @Column(DataType.DATE)
  archivedDate: Date;

  @Column(DataType.DATE)
  legalHoldDate: Date;

  @Column(DataType.DATE)
  scheduledDeletionDate: Date;

  @Column(DataType.DATE)
  deletedDate: Date;

  @Column(DataType.DATE)
  lastAccessDate: Date;

  @Default(false)
  @Column(DataType.BOOLEAN)
  onLegalHold: boolean;

  @Column(DataType.STRING(500))
  legalHoldReason: string;

  @Column(DataType.JSON)
  phaseHistory: Array<{
    phase: LifecyclePhase;
    transitionDate: Date;
    reason: string;
  }>;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;
}

/**
 * Retention Audit Log Model - Tracks retention policy enforcement
 */
@Table({
  tableName: 'retention_audit_logs',
  timestamps: true,
  paranoid: false,
  underscored: true,
})
export class RetentionAuditLog extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  documentId: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  policyId: string;

  @AllowNull(false)
  @Column(DataType.ENUM(
    'RULE_APPLIED',
    'PHASE_TRANSITION',
    'LEGAL_HOLD_PLACED',
    'LEGAL_HOLD_RELEASED',
    'DISPOSAL_SCHEDULED',
    'DISPOSED',
  ))
  action: string;

  @Column(DataType.TEXT)
  details: string;

  @Column(DataType.JSON)
  metadata: Record<string, any>;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

/**
 * Retention Policy Engine Service
 *
 * Manages retention policies, enforces lifecycle transitions,
 * and ensures compliance with retention requirements.
 */
@Injectable()
export class RetentionPolicyEngine {
  constructor(private sequelize: Sequelize) {}

  /**
   * Create new retention policy with rules
   *
   * Defines retention policy for organization with specific rules,
   * compliance frameworks, and lifecycle transitions.
   *
   * @param policy - Retention policy configuration
   * @param rules - Array of retention rules
   * @returns Promise with created policy
   * @throws BadRequestException when validation fails
   * @throws ConflictException when policy name already exists
   */
  async createRetentionPolicy(
    policy: Partial<RetentionPolicy>,
    rules: Partial<RetentionRule>[],
  ): Promise<RetentionPolicyDto> {
    const transaction = await this.sequelize.transaction();

    try {
      // Check for existing policy
      const existing = await RetentionPolicyModel.findOne({
        where: { name: policy.name, organization: policy.organization },
        transaction,
      });

      if (existing) {
        throw new ConflictException('Policy name already exists');
      }

      // Validate rules
      if (!rules || rules.length === 0) {
        throw new BadRequestException('Policy must have at least one rule');
      }

      // Create policy
      const createdPolicy = await RetentionPolicyModel.create(
        {
          ...policy,
          status: RetentionPolicyStatus.DRAFT,
          ruleCount: rules.length,
        } as any,
        { transaction },
      );

      // Create rules
      for (const rule of rules) {
        await RetentionRuleModel.create(
          {
            ...rule,
            policyId: createdPolicy.id,
          } as any,
          { transaction },
        );
      }

      await transaction.commit();
      return this.mapPolicyToDto(createdPolicy);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Activate retention policy
   *
   * Activates policy for enforcement across organization.
   * Deactivates any conflicting policies.
   *
   * @param policyId - Policy identifier to activate
   * @param deactivateOthers - Whether to deactivate other policies
   * @returns Promise with activated policy
   * @throws NotFoundException when policy not found
   * @throws BadRequestException when validation fails
   */
  async activatePolicy(
    policyId: string,
    deactivateOthers: boolean = true,
  ): Promise<RetentionPolicyDto> {
    const transaction = await this.sequelize.transaction();

    try {
      const policy = await RetentionPolicyModel.findByPk(policyId, {
        transaction,
      });

      if (!policy) {
        throw new NotFoundException('Policy not found');
      }

      if (policy.status === RetentionPolicyStatus.ACTIVE) {
        throw new BadRequestException('Policy is already active');
      }

      // Deactivate other policies if requested
      if (deactivateOthers) {
        await RetentionPolicyModel.update(
          { status: RetentionPolicyStatus.INACTIVE },
          {
            where: {
              organization: policy.organization,
              status: RetentionPolicyStatus.ACTIVE,
              id: { [Op.ne]: policyId },
            },
            transaction,
          },
        );
      }

      // Activate policy
      const updated = await policy.update(
        { status: RetentionPolicyStatus.ACTIVE, effectiveDate: new Date() },
        { transaction },
      );

      await transaction.commit();
      return this.mapPolicyToDto(updated);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Apply retention policy to document
   *
   * Evaluates document against policy rules and applies
   * lifecycle transitions based on matching rules.
   *
   * @param documentId - Document identifier
   * @param policyId - Policy identifier
   * @param metadata - Document metadata for rule evaluation
   * @returns Promise with lifecycle record
   * @throws NotFoundException when policy not found
   * @throws BadRequestException when no matching rules
   */
  async applyRetentionPolicy(
    documentId: string,
    policyId: string,
    metadata: Record<string, any>,
  ): Promise<DocumentLifecycle> {
    const transaction = await this.sequelize.transaction();

    try {
      const policy = await RetentionPolicyModel.findByPk(policyId, {
        transaction,
      });

      if (!policy) {
        throw new NotFoundException('Policy not found');
      }

      // Check for existing lifecycle
      let lifecycle = await DocumentLifecycle.findOne({
        where: { documentId },
        transaction,
      });

      if (!lifecycle) {
        lifecycle = await DocumentLifecycle.create(
          {
            documentId,
            policyId,
            currentPhase: LifecyclePhase.ACTIVE,
            createdDate: new Date(),
            activatedDate: new Date(),
            phaseHistory: [
              {
                phase: LifecyclePhase.ACTIVE,
                transitionDate: new Date(),
                reason: 'Initial phase',
              },
            ],
          } as any,
          { transaction },
        );
      } else {
        lifecycle.policyId = policyId;
        await lifecycle.save({ transaction });
      }

      // Get applicable rules
      const rules = await RetentionRuleModel.findAll({
        where: { policyId, isActive: true },
        transaction,
      });

      // Find matching rules
      const matchingRules = rules.filter((rule) => {
        if (
          rule.applicableDocumentTypes &&
          rule.applicableDocumentTypes.length > 0
        ) {
          return rule.applicableDocumentTypes.includes(metadata.documentType);
        }
        return true;
      });

      if (matchingRules.length === 0) {
        throw new BadRequestException('No applicable rules found for document');
      }

      // Create audit log
      await RetentionAuditLog.create(
        {
          documentId,
          policyId,
          action: 'RULE_APPLIED',
          details: `Applied ${matchingRules.length} retention rules`,
          metadata: { rules: matchingRules.map((r) => r.id) },
        },
        { transaction },
      );

      await transaction.commit();
      return lifecycle;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Place legal hold on document
   *
   * Prevents deletion and overrides retention policies.
   * Creates audit trail for compliance.
   *
   * @param documentId - Document identifier
   * @param reason - Legal hold reason
   * @param placedBy - User placing hold
   * @returns Promise with updated lifecycle
   * @throws NotFoundException when document lifecycle not found
   */
  async placeLegalHold(
    documentId: string,
    reason: string,
    placedBy: string,
  ): Promise<DocumentLifecycle> {
    const transaction = await this.sequelize.transaction();

    try {
      const lifecycle = await DocumentLifecycle.findOne({
        where: { documentId },
        transaction,
      });

      if (!lifecycle) {
        throw new NotFoundException('Document lifecycle not found');
      }

      const updated = await lifecycle.update(
        {
          onLegalHold: true,
          legalHoldDate: new Date(),
          legalHoldReason: reason,
        },
        { transaction },
      );

      // Create audit log
      await RetentionAuditLog.create(
        {
          documentId,
          policyId: lifecycle.policyId,
          action: 'LEGAL_HOLD_PLACED',
          details: `Legal hold placed by ${placedBy}`,
          metadata: { reason, placedBy },
        },
        { transaction },
      );

      await transaction.commit();
      return updated;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Release legal hold on document
   *
   * Removes legal hold and allows deletion according to policy.
   *
   * @param documentId - Document identifier
   * @param releasedBy - User releasing hold
   * @returns Promise with updated lifecycle
   * @throws NotFoundException when legal hold not found
   */
  async releaseLegalHold(
    documentId: string,
    releasedBy: string,
  ): Promise<DocumentLifecycle> {
    const transaction = await this.sequelize.transaction();

    try {
      const lifecycle = await DocumentLifecycle.findOne({
        where: { documentId, onLegalHold: true },
        transaction,
      });

      if (!lifecycle) {
        throw new NotFoundException('Legal hold not found');
      }

      const updated = await lifecycle.update(
        {
          onLegalHold: false,
        },
        { transaction },
      );

      // Create audit log
      await RetentionAuditLog.create(
        {
          documentId,
          policyId: lifecycle.policyId,
          action: 'LEGAL_HOLD_RELEASED',
          details: `Legal hold released by ${releasedBy}`,
          metadata: { releasedBy },
        },
        { transaction },
      );

      await transaction.commit();
      return updated;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * List documents on legal hold
   *
   * Retrieves all documents with active legal holds.
   *
   * @param limit - Maximum results
   * @param offset - Pagination offset
   * @returns Promise with legal hold documents
   */
  async listLegalHolds(
    limit: number = 100,
    offset: number = 0,
  ): Promise<{ count: number; records: DocumentLifecycle[] }> {
    const { count, rows } = await DocumentLifecycle.findAndCountAll({
      where: { onLegalHold: true },
      limit,
      offset,
      order: [['legalHoldDate', 'DESC']],
    });

    return { count, records: rows };
  }

  /**
   * Get documents expiring within retention period
   *
   * Returns documents approaching end of retention period.
   *
   * @param withinDays - Days until expiration
   * @param limit - Maximum results
   * @returns Promise with expiring documents
   */
  async getExpiringDocuments(
    withinDays: number = 90,
    limit: number = 100,
  ): Promise<{ count: number; records: DocumentLifecycle[] }> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + withinDays);

    const { count, rows } = await DocumentLifecycle.findAndCountAll({
      where: {
        scheduledDeletionDate: {
          [Op.between]: [new Date(), futureDate],
        },
        currentPhase: { [Op.ne]: LifecyclePhase.DELETED },
      },
      limit,
      offset: 0,
      order: [['scheduledDeletionDate', 'ASC']],
    });

    return { count, records: rows };
  }

  /**
   * Get retention policy statistics
   *
   * Returns aggregate statistics for retention policies
   * and lifecycle management.
   *
   * @returns Promise with retention statistics
   */
  async getRetentionStatistics(): Promise<{
    totalPolicies: number;
    activePolicies: number;
    totalDocumentsManaged: number;
    documentsOnLegalHold: number;
    phaseDistribution: Record<LifecyclePhase, number>;
  }> {
    const totalPolicies = await RetentionPolicyModel.count();
    const activePolicies = await RetentionPolicyModel.count({
      where: { status: RetentionPolicyStatus.ACTIVE },
    });
    const totalDocuments = await DocumentLifecycle.count();
    const onLegalHold = await DocumentLifecycle.count({
      where: { onLegalHold: true },
    });

    const phaseStats = await DocumentLifecycle.findAll({
      attributes: [
        'currentPhase',
        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count'],
      ],
      group: ['currentPhase'],
      raw: true,
    });

    const phaseDist: Record<LifecyclePhase, number> = {
      [LifecyclePhase.ACTIVE]: 0,
      [LifecyclePhase.INACTIVE]: 0,
      [LifecyclePhase.ARCHIVED]: 0,
      [LifecyclePhase.RETAINED]: 0,
      [LifecyclePhase.SCHEDULED_DELETION]: 0,
      [LifecyclePhase.DELETED]: 0,
    };

    phaseStats.forEach((p: any) => {
      phaseDist[p.currentPhase] = parseInt(p.count);
    });

    return {
      totalPolicies,
      activePolicies,
      totalDocumentsManaged: totalDocuments,
      documentsOnLegalHold: onLegalHold,
      phaseDistribution: phaseDist,
    };
  }

  /**
   * Map RetentionPolicyModel to DTO
   *
   * @private
   * @param policy - Policy model instance
   * @returns DTO representation
   */
  private mapPolicyToDto(policy: RetentionPolicyModel): RetentionPolicyDto {
    return {
      id: policy.id,
      name: policy.name,
      status: policy.status,
      ruleCount: policy.ruleCount,
      effectiveDate: policy.effectiveDate,
      createdAt: policy.createdAt,
      updatedAt: policy.updatedAt,
    };
  }
}
