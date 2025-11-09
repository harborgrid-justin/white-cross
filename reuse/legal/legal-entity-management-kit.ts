/**
 * LOC: LEGAL_ENTITY_MGMT_KIT_001
 * File: /reuse/legal/legal-entity-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - node-cron
 *
 * DOWNSTREAM (imported by):
 *   - Legal entity modules
 *   - Corporate structure controllers
 *   - Ownership tracking services
 *   - Compliance calendar services
 *   - Entity search services
 */

/**
 * File: /reuse/legal/legal-entity-management-kit.ts
 * Locator: WC-LEGAL-ENTITY-MGMT-KIT-001
 * Purpose: Production-Grade Legal Entity Management Kit - Enterprise legal entity lifecycle management toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, Node-Cron, Crypto
 * Downstream: ../backend/modules/legal/*, Entity workflow controllers, Compliance services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 36 production-ready legal entity management functions for legal platforms
 *
 * LLM Context: Production-grade legal entity lifecycle management toolkit for White Cross platform.
 * Provides comprehensive entity formation with automated filing and registration, corporate structure
 * management with hierarchical relationships and subsidiaries, ownership tracking with equity stakes
 * and shareholder management, compliance calendar with automated deadline tracking and notifications,
 * entity search with full-text and advanced filters, Sequelize models for entities/ownership/compliance,
 * NestJS services with dependency injection, Swagger API documentation, entity status lifecycle management,
 * registered agent management, jurisdiction and incorporation tracking, entity document management,
 * shareholder and membership tracking, corporate officer and director management, equity distribution
 * and cap table, entity merger and acquisition tracking, entity dissolution and termination, entity
 * type conversions, entity filing automation, entity verification and validation, entity reporting
 * requirements, entity tax status tracking, entity annual report filing, entity compliance alerts,
 * entity audit logging, entity relationship mapping, multi-jurisdiction entity management, entity
 * search by various criteria, entity health monitoring, and healthcare-specific entity types.
 */

import * as crypto from 'crypto';
import {
  Injectable,
  Inject,
  Module,
  DynamicModule,
  Global,
  Logger,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
  registerAs,
} from '@nestjs/config';
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
  Sequelize,
  Index,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';
import { Op, WhereOptions, FindOptions } from 'sequelize';
import * as cron from 'node-cron';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Legal entity status lifecycle
 */
export enum EntityStatus {
  PLANNED = 'planned',
  FORMATION_IN_PROGRESS = 'formation_in_progress',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DISSOLVED = 'dissolved',
  MERGED = 'merged',
  ACQUIRED = 'acquired',
  BANKRUPTCY = 'bankruptcy',
  GOOD_STANDING = 'good_standing',
  NOT_IN_GOOD_STANDING = 'not_in_good_standing',
  REVOKED = 'revoked',
  WITHDRAWN = 'withdrawn',
}

/**
 * Legal entity type categories
 */
export enum EntityType {
  CORPORATION = 'corporation',
  LLC = 'llc',
  LLP = 'llp',
  PARTNERSHIP = 'partnership',
  SOLE_PROPRIETORSHIP = 'sole_proprietorship',
  NONPROFIT = 'nonprofit',
  PROFESSIONAL_CORPORATION = 'professional_corporation',
  S_CORPORATION = 's_corporation',
  C_CORPORATION = 'c_corporation',
  BENEFIT_CORPORATION = 'benefit_corporation',
  COOPERATIVE = 'cooperative',
  JOINT_VENTURE = 'joint_venture',
  TRUST = 'trust',
  HOLDING_COMPANY = 'holding_company',
  SUBSIDIARY = 'subsidiary',
  BRANCH = 'branch',
  DIVISION = 'division',
  OTHER = 'other',
}

/**
 * Tax classification types
 */
export enum TaxClassification {
  C_CORP = 'c_corp',
  S_CORP = 's_corp',
  PARTNERSHIP = 'partnership',
  DISREGARDED_ENTITY = 'disregarded_entity',
  TRUST = 'trust',
  NONPROFIT_501C3 = 'nonprofit_501c3',
  NONPROFIT_501C4 = 'nonprofit_501c4',
  NONPROFIT_501C6 = 'nonprofit_501c6',
  OTHER = 'other',
}

/**
 * Officer/Director role types
 */
export enum OfficerRole {
  CEO = 'ceo',
  CFO = 'cfo',
  COO = 'coo',
  CTO = 'cto',
  PRESIDENT = 'president',
  VICE_PRESIDENT = 'vice_president',
  SECRETARY = 'secretary',
  TREASURER = 'treasurer',
  DIRECTOR = 'director',
  BOARD_CHAIR = 'board_chair',
  MANAGING_MEMBER = 'managing_member',
  MEMBER = 'member',
  PARTNER = 'partner',
  MANAGING_PARTNER = 'managing_partner',
  GENERAL_PARTNER = 'general_partner',
  LIMITED_PARTNER = 'limited_partner',
  REGISTERED_AGENT = 'registered_agent',
  OTHER = 'other',
}

/**
 * Compliance event types
 */
export enum ComplianceEventType {
  ANNUAL_REPORT = 'annual_report',
  TAX_FILING = 'tax_filing',
  FRANCHISE_TAX = 'franchise_tax',
  REGISTRATION_RENEWAL = 'registration_renewal',
  LICENSE_RENEWAL = 'license_renewal',
  BOARD_MEETING = 'board_meeting',
  SHAREHOLDER_MEETING = 'shareholder_meeting',
  REGULATORY_FILING = 'regulatory_filing',
  AUDIT = 'audit',
  PERMIT_RENEWAL = 'permit_renewal',
  INSURANCE_RENEWAL = 'insurance_renewal',
  ACCREDITATION_RENEWAL = 'accreditation_renewal',
  CERTIFICATION_RENEWAL = 'certification_renewal',
  OTHER = 'other',
}

/**
 * Compliance event status
 */
export enum ComplianceStatus {
  UPCOMING = 'upcoming',
  DUE_SOON = 'due_soon',
  OVERDUE = 'overdue',
  COMPLETED = 'completed',
  FILED = 'filed',
  WAIVED = 'waived',
  NOT_APPLICABLE = 'not_applicable',
}

/**
 * Ownership type
 */
export enum OwnershipType {
  COMMON_STOCK = 'common_stock',
  PREFERRED_STOCK = 'preferred_stock',
  MEMBERSHIP_INTEREST = 'membership_interest',
  PARTNERSHIP_INTEREST = 'partnership_interest',
  EQUITY_OPTION = 'equity_option',
  WARRANT = 'warrant',
  CONVERTIBLE_NOTE = 'convertible_note',
  OTHER = 'other',
}

/**
 * Entity relationship types
 */
export enum EntityRelationshipType {
  PARENT = 'parent',
  SUBSIDIARY = 'subsidiary',
  AFFILIATE = 'affiliate',
  SISTER_COMPANY = 'sister_company',
  PREDECESSOR = 'predecessor',
  SUCCESSOR = 'successor',
  MERGED_INTO = 'merged_into',
  ACQUIRED_BY = 'acquired_by',
  JOINT_VENTURE_PARTNER = 'joint_venture_partner',
  OTHER = 'other',
}

/**
 * Base legal entity interface
 */
export interface LegalEntity {
  id: string;
  entityNumber: string;
  legalName: string;
  dbaName?: string;
  entityType: EntityType;
  status: EntityStatus;
  taxClassification?: TaxClassification;
  taxId?: string;
  incorporationJurisdiction: string;
  incorporationDate?: Date;
  dissolutionDate?: Date;
  fiscalYearEnd?: string;
  businessPurpose?: string;
  registeredAgentName?: string;
  registeredAgentAddress?: string;
  principalAddress: EntityAddress;
  mailingAddress?: EntityAddress;
  phoneNumber?: string;
  email?: string;
  website?: string;
  parentEntityId?: string;
  metadata: EntityMetadata;
  tenantId?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Entity address structure
 */
export interface EntityAddress {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Entity metadata
 */
export interface EntityMetadata {
  tags: string[];
  industry?: string;
  naicsCode?: string;
  sicCode?: string;
  employeeCount?: number;
  annualRevenue?: number;
  customFields: Record<string, any>;
  notes?: string;
  externalIds: Record<string, string>;
}

/**
 * Corporate structure relationship
 */
export interface EntityRelationship {
  id: string;
  parentEntityId: string;
  childEntityId: string;
  relationshipType: EntityRelationshipType;
  ownershipPercentage?: number;
  effectiveDate: Date;
  endDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Ownership stake information
 */
export interface OwnershipStake {
  id: string;
  entityId: string;
  ownerType: 'individual' | 'entity';
  ownerId: string;
  ownerName: string;
  ownershipType: OwnershipType;
  sharesOwned?: number;
  percentageOwned?: number;
  votingRights: boolean;
  votingPercentage?: number;
  acquisitionDate?: Date;
  acquisitionPrice?: number;
  currentValue?: number;
  restrictions?: string;
  vestingSchedule?: VestingSchedule;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Vesting schedule
 */
export interface VestingSchedule {
  startDate: Date;
  cliffMonths?: number;
  vestingMonths: number;
  vestedPercentage: number;
  accelerationClauses?: string[];
}

/**
 * Corporate officer/director
 */
export interface EntityOfficer {
  id: string;
  entityId: string;
  personId?: string;
  name: string;
  role: OfficerRole;
  appointmentDate: Date;
  termEndDate?: Date;
  resignationDate?: Date;
  compensation?: number;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Compliance calendar event
 */
export interface ComplianceEvent {
  id: string;
  entityId: string;
  eventType: ComplianceEventType;
  title: string;
  description?: string;
  dueDate: Date;
  completionDate?: Date;
  status: ComplianceStatus;
  jurisdiction?: string;
  filingNumber?: string;
  filingUrl?: string;
  assignedTo?: string;
  reminderDays: number[];
  recurring: boolean;
  recurrenceRule?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  penalties?: string;
  estimatedCost?: number;
  actualCost?: number;
  documents: ComplianceDocument[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Compliance document
 */
export interface ComplianceDocument {
  id: string;
  name: string;
  documentType: string;
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: string;
}

/**
 * Entity formation request
 */
export interface EntityFormationRequest {
  legalName: string;
  dbaName?: string;
  entityType: EntityType;
  incorporationJurisdiction: string;
  businessPurpose: string;
  registeredAgentName: string;
  registeredAgentAddress: EntityAddress;
  principalAddress: EntityAddress;
  taxClassification?: TaxClassification;
  fiscalYearEnd?: string;
  initialOfficers: Omit<EntityOfficer, 'id' | 'entityId' | 'createdAt' | 'updatedAt'>[];
  initialOwners: Omit<OwnershipStake, 'id' | 'entityId' | 'createdAt' | 'updatedAt'>[];
  parentEntityId?: string;
  metadata?: Partial<EntityMetadata>;
}

/**
 * Entity search criteria
 */
export interface EntitySearchCriteria {
  query?: string;
  entityType?: EntityType[];
  status?: EntityStatus[];
  jurisdiction?: string[];
  taxClassification?: TaxClassification[];
  parentEntityId?: string;
  hasParent?: boolean;
  tags?: string[];
  createdAfter?: Date;
  createdBefore?: Date;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Entity health metrics
 */
export interface EntityHealthMetrics {
  entityId: string;
  overallHealth: 'healthy' | 'warning' | 'critical';
  complianceScore: number;
  overdueCompliance: number;
  upcomingDeadlines: number;
  activeOfficers: number;
  goodStanding: boolean;
  lastFilingDate?: Date;
  issues: HealthIssue[];
}

/**
 * Health issue
 */
export interface HealthIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  remediation?: string;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Entity address validation schema
 */
export const EntityAddressSchema = z.object({
  street1: z.string().min(1).max(255),
  street2: z.string().max(255).optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(2).max(50),
  postalCode: z.string().min(1).max(20),
  country: z.string().min(2).max(2).default('US'),
});

/**
 * Entity formation request validation schema
 */
export const EntityFormationRequestSchema = z.object({
  legalName: z.string().min(1).max(500),
  dbaName: z.string().max(500).optional(),
  entityType: z.nativeEnum(EntityType),
  incorporationJurisdiction: z.string().min(2).max(50),
  businessPurpose: z.string().min(1).max(2000),
  registeredAgentName: z.string().min(1).max(255),
  registeredAgentAddress: EntityAddressSchema,
  principalAddress: EntityAddressSchema,
  taxClassification: z.nativeEnum(TaxClassification).optional(),
  fiscalYearEnd: z.string().regex(/^\d{2}-\d{2}$/).optional(),
  initialOfficers: z.array(z.object({
    name: z.string().min(1).max(255),
    role: z.nativeEnum(OfficerRole),
    appointmentDate: z.date(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    compensation: z.number().optional(),
    metadata: z.record(z.any()).default({}),
  })).min(1),
  initialOwners: z.array(z.object({
    ownerType: z.enum(['individual', 'entity']),
    ownerId: z.string(),
    ownerName: z.string().min(1).max(255),
    ownershipType: z.nativeEnum(OwnershipType),
    sharesOwned: z.number().optional(),
    percentageOwned: z.number().min(0).max(100).optional(),
    votingRights: z.boolean().default(true),
    votingPercentage: z.number().min(0).max(100).optional(),
    acquisitionDate: z.date().optional(),
    acquisitionPrice: z.number().optional(),
    metadata: z.record(z.any()).default({}),
  })).min(1),
  parentEntityId: z.string().uuid().optional(),
  metadata: z.object({
    tags: z.array(z.string()).default([]),
    industry: z.string().optional(),
    naicsCode: z.string().optional(),
    sicCode: z.string().optional(),
    employeeCount: z.number().optional(),
    annualRevenue: z.number().optional(),
    customFields: z.record(z.any()).default({}),
    notes: z.string().optional(),
    externalIds: z.record(z.string()).default({}),
  }).optional(),
});

/**
 * Compliance event creation schema
 */
export const ComplianceEventSchema = z.object({
  entityId: z.string().uuid(),
  eventType: z.nativeEnum(ComplianceEventType),
  title: z.string().min(1).max(500),
  description: z.string().max(2000).optional(),
  dueDate: z.date(),
  jurisdiction: z.string().max(50).optional(),
  assignedTo: z.string().uuid().optional(),
  reminderDays: z.array(z.number()).default([30, 14, 7, 1]),
  recurring: z.boolean().default(false),
  recurrenceRule: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  penalties: z.string().max(1000).optional(),
  estimatedCost: z.number().optional(),
  metadata: z.record(z.any()).default({}),
});

/**
 * Entity search criteria schema
 */
export const EntitySearchCriteriaSchema = z.object({
  query: z.string().max(500).optional(),
  entityType: z.array(z.nativeEnum(EntityType)).optional(),
  status: z.array(z.nativeEnum(EntityStatus)).optional(),
  jurisdiction: z.array(z.string()).optional(),
  taxClassification: z.array(z.nativeEnum(TaxClassification)).optional(),
  parentEntityId: z.string().uuid().optional(),
  hasParent: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  createdAfter: z.date().optional(),
  createdBefore: z.date().optional(),
  limit: z.number().min(1).max(1000).default(50),
  offset: z.number().min(0).default(0),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC'),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Legal Entity Sequelize Model
 */
@Table({
  tableName: 'legal_entities',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['entity_number'], unique: true },
    { fields: ['legal_name'] },
    { fields: ['entity_type'] },
    { fields: ['status'] },
    { fields: ['incorporation_jurisdiction'] },
    { fields: ['parent_entity_id'] },
    { fields: ['tax_id'] },
    { fields: ['tenant_id'] },
  ],
})
export class LegalEntityModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING(50),
    unique: true,
    allowNull: false,
    field: 'entity_number',
  })
  entityNumber!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
    field: 'legal_name',
  })
  legalName!: string;

  @Column({
    type: DataType.STRING(500),
    field: 'dba_name',
  })
  dbaName?: string;

  @Column({
    type: DataType.ENUM(...Object.values(EntityType)),
    allowNull: false,
    field: 'entity_type',
  })
  entityType!: EntityType;

  @Column({
    type: DataType.ENUM(...Object.values(EntityStatus)),
    allowNull: false,
    defaultValue: EntityStatus.PLANNED,
  })
  status!: EntityStatus;

  @Column({
    type: DataType.ENUM(...Object.values(TaxClassification)),
    field: 'tax_classification',
  })
  taxClassification?: TaxClassification;

  @Column({
    type: DataType.STRING(50),
    field: 'tax_id',
  })
  taxId?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'incorporation_jurisdiction',
  })
  incorporationJurisdiction!: string;

  @Column({
    type: DataType.DATE,
    field: 'incorporation_date',
  })
  incorporationDate?: Date;

  @Column({
    type: DataType.DATE,
    field: 'dissolution_date',
  })
  dissolutionDate?: Date;

  @Column({
    type: DataType.STRING(5),
    field: 'fiscal_year_end',
  })
  fiscalYearEnd?: string;

  @Column({
    type: DataType.TEXT,
    field: 'business_purpose',
  })
  businessPurpose?: string;

  @Column({
    type: DataType.STRING(255),
    field: 'registered_agent_name',
  })
  registeredAgentName?: string;

  @Column({
    type: DataType.TEXT,
    field: 'registered_agent_address',
  })
  registeredAgentAddress?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'principal_address',
  })
  principalAddress!: EntityAddress;

  @Column({
    type: DataType.JSONB,
    field: 'mailing_address',
  })
  mailingAddress?: EntityAddress;

  @Column({
    type: DataType.STRING(50),
    field: 'phone_number',
  })
  phoneNumber?: string;

  @Column(DataType.STRING(255))
  email?: string;

  @Column(DataType.STRING(500))
  website?: string;

  @ForeignKey(() => LegalEntityModel)
  @Column({
    type: DataType.UUID,
    field: 'parent_entity_id',
  })
  parentEntityId?: string;

  @BelongsTo(() => LegalEntityModel, 'parent_entity_id')
  parentEntity?: LegalEntityModel;

  @HasMany(() => LegalEntityModel, 'parent_entity_id')
  subsidiaries?: LegalEntityModel[];

  @HasMany(() => EntityRelationshipModel, 'parent_entity_id')
  childRelationships?: EntityRelationshipModel[];

  @HasMany(() => EntityRelationshipModel, 'child_entity_id')
  parentRelationships?: EntityRelationshipModel[];

  @HasMany(() => OwnershipStakeModel)
  ownershipStakes?: OwnershipStakeModel[];

  @HasMany(() => EntityOfficerModel)
  officers?: EntityOfficerModel[];

  @HasMany(() => ComplianceEventModel)
  complianceEvents?: ComplianceEventModel[];

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {
      tags: [],
      customFields: {},
      externalIds: {},
    },
  })
  metadata!: EntityMetadata;

  @Column({
    type: DataType.UUID,
    field: 'tenant_id',
  })
  tenantId?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'created_by',
  })
  createdBy!: string;

  @Column({
    type: DataType.UUID,
    field: 'updated_by',
  })
  updatedBy?: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  createdAt!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updatedAt!: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    field: 'deleted_at',
  })
  deletedAt?: Date;
}

/**
 * Entity Relationship Sequelize Model
 */
@Table({
  tableName: 'entity_relationships',
  timestamps: true,
  indexes: [
    { fields: ['parent_entity_id'] },
    { fields: ['child_entity_id'] },
    { fields: ['relationship_type'] },
  ],
})
export class EntityRelationshipModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => LegalEntityModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'parent_entity_id',
  })
  parentEntityId!: string;

  @BelongsTo(() => LegalEntityModel, 'parent_entity_id')
  parentEntity?: LegalEntityModel;

  @ForeignKey(() => LegalEntityModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'child_entity_id',
  })
  childEntityId!: string;

  @BelongsTo(() => LegalEntityModel, 'child_entity_id')
  childEntity?: LegalEntityModel;

  @Column({
    type: DataType.ENUM(...Object.values(EntityRelationshipType)),
    allowNull: false,
    field: 'relationship_type',
  })
  relationshipType!: EntityRelationshipType;

  @Column({
    type: DataType.DECIMAL(5, 2),
    field: 'ownership_percentage',
  })
  ownershipPercentage?: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'effective_date',
  })
  effectiveDate!: Date;

  @Column({
    type: DataType.DATE,
    field: 'end_date',
  })
  endDate?: Date;

  @Column(DataType.TEXT)
  notes?: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  createdAt!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updatedAt!: Date;
}

/**
 * Ownership Stake Sequelize Model
 */
@Table({
  tableName: 'ownership_stakes',
  timestamps: true,
  indexes: [
    { fields: ['entity_id'] },
    { fields: ['owner_id'] },
    { fields: ['owner_type'] },
    { fields: ['ownership_type'] },
  ],
})
export class OwnershipStakeModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => LegalEntityModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'entity_id',
  })
  entityId!: string;

  @BelongsTo(() => LegalEntityModel)
  entity?: LegalEntityModel;

  @Column({
    type: DataType.ENUM('individual', 'entity'),
    allowNull: false,
    field: 'owner_type',
  })
  ownerType!: 'individual' | 'entity';

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'owner_id',
  })
  ownerId!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'owner_name',
  })
  ownerName!: string;

  @Column({
    type: DataType.ENUM(...Object.values(OwnershipType)),
    allowNull: false,
    field: 'ownership_type',
  })
  ownershipType!: OwnershipType;

  @Column({
    type: DataType.BIGINT,
    field: 'shares_owned',
  })
  sharesOwned?: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    field: 'percentage_owned',
  })
  percentageOwned?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'voting_rights',
  })
  votingRights!: boolean;

  @Column({
    type: DataType.DECIMAL(5, 2),
    field: 'voting_percentage',
  })
  votingPercentage?: number;

  @Column({
    type: DataType.DATE,
    field: 'acquisition_date',
  })
  acquisitionDate?: Date;

  @Column({
    type: DataType.DECIMAL(15, 2),
    field: 'acquisition_price',
  })
  acquisitionPrice?: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    field: 'current_value',
  })
  currentValue?: number;

  @Column(DataType.TEXT)
  restrictions?: string;

  @Column({
    type: DataType.JSONB,
    field: 'vesting_schedule',
  })
  vestingSchedule?: VestingSchedule;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
  })
  metadata!: Record<string, any>;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  createdAt!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updatedAt!: Date;
}

/**
 * Entity Officer Sequelize Model
 */
@Table({
  tableName: 'entity_officers',
  timestamps: true,
  indexes: [
    { fields: ['entity_id'] },
    { fields: ['person_id'] },
    { fields: ['role'] },
    { fields: ['is_active'] },
  ],
})
export class EntityOfficerModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => LegalEntityModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'entity_id',
  })
  entityId!: string;

  @BelongsTo(() => LegalEntityModel)
  entity?: LegalEntityModel;

  @Column({
    type: DataType.UUID,
    field: 'person_id',
  })
  personId?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.ENUM(...Object.values(OfficerRole)),
    allowNull: false,
  })
  role!: OfficerRole;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'appointment_date',
  })
  appointmentDate!: Date;

  @Column({
    type: DataType.DATE,
    field: 'term_end_date',
  })
  termEndDate?: Date;

  @Column({
    type: DataType.DATE,
    field: 'resignation_date',
  })
  resignationDate?: Date;

  @Column({
    type: DataType.DECIMAL(15, 2),
  })
  compensation?: number;

  @Column(DataType.STRING(255))
  email?: string;

  @Column(DataType.STRING(50))
  phone?: string;

  @Column(DataType.TEXT)
  address?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  isActive!: boolean;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
  })
  metadata!: Record<string, any>;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  createdAt!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updatedAt!: Date;
}

/**
 * Compliance Event Sequelize Model
 */
@Table({
  tableName: 'compliance_events',
  timestamps: true,
  indexes: [
    { fields: ['entity_id'] },
    { fields: ['event_type'] },
    { fields: ['status'] },
    { fields: ['due_date'] },
    { fields: ['assigned_to'] },
    { fields: ['priority'] },
  ],
})
export class ComplianceEventModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => LegalEntityModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'entity_id',
  })
  entityId!: string;

  @BelongsTo(() => LegalEntityModel)
  entity?: LegalEntityModel;

  @Column({
    type: DataType.ENUM(...Object.values(ComplianceEventType)),
    allowNull: false,
    field: 'event_type',
  })
  eventType!: ComplianceEventType;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'due_date',
  })
  dueDate!: Date;

  @Column({
    type: DataType.DATE,
    field: 'completion_date',
  })
  completionDate?: Date;

  @Column({
    type: DataType.ENUM(...Object.values(ComplianceStatus)),
    allowNull: false,
    defaultValue: ComplianceStatus.UPCOMING,
  })
  status!: ComplianceStatus;

  @Column({
    type: DataType.STRING(50),
  })
  jurisdiction?: string;

  @Column({
    type: DataType.STRING(100),
    field: 'filing_number',
  })
  filingNumber?: string;

  @Column({
    type: DataType.STRING(500),
    field: 'filing_url',
  })
  filingUrl?: string;

  @Column({
    type: DataType.UUID,
    field: 'assigned_to',
  })
  assignedTo?: string;

  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    allowNull: false,
    defaultValue: [30, 14, 7, 1],
    field: 'reminder_days',
  })
  reminderDays!: number[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  recurring!: boolean;

  @Column({
    type: DataType.STRING(500),
    field: 'recurrence_rule',
  })
  recurrenceRule?: string;

  @Column({
    type: DataType.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false,
    defaultValue: 'medium',
  })
  priority!: 'low' | 'medium' | 'high' | 'critical';

  @Column(DataType.TEXT)
  penalties?: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    field: 'estimated_cost',
  })
  estimatedCost?: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    field: 'actual_cost',
  })
  actualCost?: number;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  documents!: ComplianceDocument[];

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
  })
  metadata!: Record<string, any>;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  createdAt!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updatedAt!: Date;
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

/**
 * Legal Entity Management Service
 */
@Injectable()
export class LegalEntityManagementService {
  private readonly logger = new Logger(LegalEntityManagementService.name);

  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
    private readonly configService: ConfigService,
  ) {}

  // ============================================================================
  // ENTITY FORMATION & LIFECYCLE
  // ============================================================================

  /**
   * 1. Create new legal entity with formation details
   *
   * @param request Entity formation request
   * @param userId User creating the entity
   * @param tenantId Optional tenant ID for multi-tenancy
   * @returns Created legal entity
   */
  async formNewEntity(
    request: EntityFormationRequest,
    userId: string,
    tenantId?: string,
  ): Promise<LegalEntity> {
    this.logger.log(`Forming new entity: ${request.legalName}`);

    // Validate request
    const validated = EntityFormationRequestSchema.parse(request);

    const transaction = await this.sequelize.transaction();

    try {
      // Generate entity number
      const entityNumber = await this.generateEntityNumber(validated.entityType);

      // Create entity
      const entity = await LegalEntityModel.create(
        {
          entityNumber,
          legalName: validated.legalName,
          dbaName: validated.dbaName,
          entityType: validated.entityType,
          status: EntityStatus.FORMATION_IN_PROGRESS,
          taxClassification: validated.taxClassification,
          incorporationJurisdiction: validated.incorporationJurisdiction,
          businessPurpose: validated.businessPurpose,
          registeredAgentName: validated.registeredAgentName,
          registeredAgentAddress: JSON.stringify(validated.registeredAgentAddress),
          principalAddress: validated.principalAddress,
          fiscalYearEnd: validated.fiscalYearEnd,
          parentEntityId: validated.parentEntityId,
          metadata: validated.metadata || {
            tags: [],
            customFields: {},
            externalIds: {},
          },
          tenantId,
          createdBy: userId,
        },
        { transaction },
      );

      // Create initial officers
      for (const officer of validated.initialOfficers) {
        await EntityOfficerModel.create(
          {
            entityId: entity.id,
            name: officer.name,
            role: officer.role,
            appointmentDate: officer.appointmentDate,
            email: officer.email,
            phone: officer.phone,
            address: officer.address,
            compensation: officer.compensation,
            isActive: true,
            metadata: officer.metadata || {},
          },
          { transaction },
        );
      }

      // Create initial ownership stakes
      for (const owner of validated.initialOwners) {
        await OwnershipStakeModel.create(
          {
            entityId: entity.id,
            ownerType: owner.ownerType,
            ownerId: owner.ownerId,
            ownerName: owner.ownerName,
            ownershipType: owner.ownershipType,
            sharesOwned: owner.sharesOwned,
            percentageOwned: owner.percentageOwned,
            votingRights: owner.votingRights,
            votingPercentage: owner.votingPercentage,
            acquisitionDate: owner.acquisitionDate,
            acquisitionPrice: owner.acquisitionPrice,
            metadata: owner.metadata || {},
          },
          { transaction },
        );
      }

      // Create parent relationship if applicable
      if (validated.parentEntityId) {
        await EntityRelationshipModel.create(
          {
            parentEntityId: validated.parentEntityId,
            childEntityId: entity.id,
            relationshipType: EntityRelationshipType.SUBSIDIARY,
            effectiveDate: new Date(),
          },
          { transaction },
        );
      }

      // Create initial compliance events
      await this.createInitialComplianceEvents(entity.id, validated, transaction);

      await transaction.commit();

      this.logger.log(`Entity formed successfully: ${entity.id}`);
      return entity.toJSON() as LegalEntity;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to form entity: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to form legal entity');
    }
  }

  /**
   * 2. Update entity status
   *
   * @param entityId Entity ID
   * @param status New status
   * @param userId User making the update
   * @param notes Optional notes about status change
   * @returns Updated entity
   */
  async updateEntityStatus(
    entityId: string,
    status: EntityStatus,
    userId: string,
    notes?: string,
  ): Promise<LegalEntity> {
    this.logger.log(`Updating entity ${entityId} status to ${status}`);

    const entity = await LegalEntityModel.findByPk(entityId);
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    const oldStatus = entity.status;
    entity.status = status;
    entity.updatedBy = userId;

    // Set dissolution date if entity is being dissolved
    if (status === EntityStatus.DISSOLVED && !entity.dissolutionDate) {
      entity.dissolutionDate = new Date();
    }

    // Update metadata with status change log
    const metadata = entity.metadata || { tags: [], customFields: {}, externalIds: {} };
    if (!metadata.customFields.statusHistory) {
      metadata.customFields.statusHistory = [];
    }
    metadata.customFields.statusHistory.push({
      from: oldStatus,
      to: status,
      changedBy: userId,
      changedAt: new Date().toISOString(),
      notes,
    });
    entity.metadata = metadata;

    await entity.save();

    this.logger.log(`Entity ${entityId} status updated from ${oldStatus} to ${status}`);
    return entity.toJSON() as LegalEntity;
  }

  /**
   * 3. Dissolve/terminate entity
   *
   * @param entityId Entity ID
   * @param dissolutionDate Date of dissolution
   * @param userId User performing dissolution
   * @param reason Reason for dissolution
   * @returns Dissolved entity
   */
  async dissolveEntity(
    entityId: string,
    dissolutionDate: Date,
    userId: string,
    reason?: string,
  ): Promise<LegalEntity> {
    this.logger.log(`Dissolving entity: ${entityId}`);

    const entity = await LegalEntityModel.findByPk(entityId);
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    if (entity.status === EntityStatus.DISSOLVED) {
      throw new ConflictException('Entity is already dissolved');
    }

    entity.status = EntityStatus.DISSOLVED;
    entity.dissolutionDate = dissolutionDate;
    entity.updatedBy = userId;

    // Update metadata
    const metadata = entity.metadata || { tags: [], customFields: {}, externalIds: {} };
    metadata.customFields.dissolutionReason = reason;
    entity.metadata = metadata;

    await entity.save();

    // Deactivate all officers
    await EntityOfficerModel.update(
      { isActive: false },
      { where: { entityId, isActive: true } },
    );

    this.logger.log(`Entity ${entityId} dissolved successfully`);
    return entity.toJSON() as LegalEntity;
  }

  /**
   * 4. Convert entity type
   *
   * @param entityId Entity ID
   * @param newEntityType New entity type
   * @param effectiveDate Effective date of conversion
   * @param userId User performing conversion
   * @returns Updated entity
   */
  async convertEntityType(
    entityId: string,
    newEntityType: EntityType,
    effectiveDate: Date,
    userId: string,
  ): Promise<LegalEntity> {
    this.logger.log(`Converting entity ${entityId} to ${newEntityType}`);

    const entity = await LegalEntityModel.findByPk(entityId);
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    const oldType = entity.entityType;
    entity.entityType = newEntityType;
    entity.updatedBy = userId;

    // Log conversion in metadata
    const metadata = entity.metadata || { tags: [], customFields: {}, externalIds: {} };
    if (!metadata.customFields.typeConversions) {
      metadata.customFields.typeConversions = [];
    }
    metadata.customFields.typeConversions.push({
      from: oldType,
      to: newEntityType,
      effectiveDate: effectiveDate.toISOString(),
      convertedBy: userId,
      convertedAt: new Date().toISOString(),
    });
    entity.metadata = metadata;

    await entity.save();

    this.logger.log(`Entity ${entityId} converted from ${oldType} to ${newEntityType}`);
    return entity.toJSON() as LegalEntity;
  }

  // ============================================================================
  // CORPORATE STRUCTURE
  // ============================================================================

  /**
   * 5. Create entity relationship (parent-child, affiliate, etc.)
   *
   * @param parentEntityId Parent entity ID
   * @param childEntityId Child entity ID
   * @param relationshipType Type of relationship
   * @param ownershipPercentage Optional ownership percentage
   * @param effectiveDate Effective date of relationship
   * @returns Created relationship
   */
  async createEntityRelationship(
    parentEntityId: string,
    childEntityId: string,
    relationshipType: EntityRelationshipType,
    ownershipPercentage?: number,
    effectiveDate: Date = new Date(),
  ): Promise<EntityRelationship> {
    this.logger.log(
      `Creating ${relationshipType} relationship: ${parentEntityId} -> ${childEntityId}`,
    );

    // Validate both entities exist
    const [parent, child] = await Promise.all([
      LegalEntityModel.findByPk(parentEntityId),
      LegalEntityModel.findByPk(childEntityId),
    ]);

    if (!parent) {
      throw new NotFoundException('Parent entity not found');
    }
    if (!child) {
      throw new NotFoundException('Child entity not found');
    }

    if (parentEntityId === childEntityId) {
      throw new BadRequestException('Entity cannot have relationship with itself');
    }

    // Check for circular relationships
    const hasCircular = await this.checkCircularRelationship(
      parentEntityId,
      childEntityId,
    );
    if (hasCircular) {
      throw new BadRequestException('Circular relationship detected');
    }

    const relationship = await EntityRelationshipModel.create({
      parentEntityId,
      childEntityId,
      relationshipType,
      ownershipPercentage,
      effectiveDate,
    });

    this.logger.log(`Relationship created: ${relationship.id}`);
    return relationship.toJSON() as EntityRelationship;
  }

  /**
   * 6. Get entity corporate structure (hierarchy)
   *
   * @param entityId Root entity ID
   * @param depth Maximum depth to traverse
   * @returns Corporate structure tree
   */
  async getEntityStructure(
    entityId: string,
    depth: number = 5,
  ): Promise<any> {
    this.logger.log(`Getting corporate structure for entity: ${entityId}`);

    const entity = await LegalEntityModel.findByPk(entityId, {
      include: [
        {
          model: EntityRelationshipModel,
          as: 'childRelationships',
          include: [
            {
              model: LegalEntityModel,
              as: 'childEntity',
            },
          ],
        },
      ],
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    const structure = await this.buildEntityTree(entity, depth, 0);

    this.logger.log(`Corporate structure retrieved for ${entityId}`);
    return structure;
  }

  /**
   * 7. Get all subsidiaries of an entity
   *
   * @param parentEntityId Parent entity ID
   * @param includeIndirect Include indirect subsidiaries
   * @returns List of subsidiaries
   */
  async getSubsidiaries(
    parentEntityId: string,
    includeIndirect: boolean = false,
  ): Promise<LegalEntity[]> {
    this.logger.log(`Getting subsidiaries for entity: ${parentEntityId}`);

    const relationships = await EntityRelationshipModel.findAll({
      where: {
        parentEntityId,
        relationshipType: EntityRelationshipType.SUBSIDIARY,
        endDate: null,
      },
      include: [
        {
          model: LegalEntityModel,
          as: 'childEntity',
        },
      ],
    });

    let subsidiaries = relationships.map(
      (rel) => rel.childEntity!.toJSON() as LegalEntity,
    );

    if (includeIndirect) {
      // Recursively get all indirect subsidiaries
      for (const sub of [...subsidiaries]) {
        const indirectSubs = await this.getSubsidiaries(sub.id, true);
        subsidiaries = [...subsidiaries, ...indirectSubs];
      }
    }

    this.logger.log(`Found ${subsidiaries.length} subsidiaries`);
    return subsidiaries;
  }

  /**
   * 8. Get parent entities
   *
   * @param childEntityId Child entity ID
   * @returns List of parent entities
   */
  async getParentEntities(childEntityId: string): Promise<LegalEntity[]> {
    this.logger.log(`Getting parent entities for: ${childEntityId}`);

    const relationships = await EntityRelationshipModel.findAll({
      where: {
        childEntityId,
        endDate: null,
      },
      include: [
        {
          model: LegalEntityModel,
          as: 'parentEntity',
        },
      ],
    });

    const parents = relationships.map(
      (rel) => rel.parentEntity!.toJSON() as LegalEntity,
    );

    this.logger.log(`Found ${parents.length} parent entities`);
    return parents;
  }

  // ============================================================================
  // OWNERSHIP TRACKING
  // ============================================================================

  /**
   * 9. Add ownership stake
   *
   * @param entityId Entity ID
   * @param stake Ownership stake details
   * @returns Created ownership stake
   */
  async addOwnershipStake(
    entityId: string,
    stake: Omit<OwnershipStake, 'id' | 'entityId' | 'createdAt' | 'updatedAt'>,
  ): Promise<OwnershipStake> {
    this.logger.log(`Adding ownership stake for entity: ${entityId}`);

    const entity = await LegalEntityModel.findByPk(entityId);
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    const ownershipStake = await OwnershipStakeModel.create({
      entityId,
      ...stake,
    });

    this.logger.log(`Ownership stake created: ${ownershipStake.id}`);
    return ownershipStake.toJSON() as OwnershipStake;
  }

  /**
   * 10. Update ownership stake
   *
   * @param stakeId Stake ID
   * @param updates Updates to apply
   * @returns Updated ownership stake
   */
  async updateOwnershipStake(
    stakeId: string,
    updates: Partial<OwnershipStake>,
  ): Promise<OwnershipStake> {
    this.logger.log(`Updating ownership stake: ${stakeId}`);

    const stake = await OwnershipStakeModel.findByPk(stakeId);
    if (!stake) {
      throw new NotFoundException('Ownership stake not found');
    }

    await stake.update(updates);

    this.logger.log(`Ownership stake ${stakeId} updated`);
    return stake.toJSON() as OwnershipStake;
  }

  /**
   * 11. Get ownership breakdown for entity
   *
   * @param entityId Entity ID
   * @returns Ownership breakdown
   */
  async getOwnershipBreakdown(entityId: string): Promise<{
    entity: LegalEntity;
    stakes: OwnershipStake[];
    totalPercentage: number;
    ownerCount: number;
  }> {
    this.logger.log(`Getting ownership breakdown for: ${entityId}`);

    const entity = await LegalEntityModel.findByPk(entityId);
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    const stakes = await OwnershipStakeModel.findAll({
      where: { entityId },
    });

    const totalPercentage = stakes.reduce(
      (sum, stake) => sum + (stake.percentageOwned || 0),
      0,
    );

    return {
      entity: entity.toJSON() as LegalEntity,
      stakes: stakes.map((s) => s.toJSON() as OwnershipStake),
      totalPercentage,
      ownerCount: stakes.length,
    };
  }

  /**
   * 12. Generate cap table
   *
   * @param entityId Entity ID
   * @returns Cap table with equity distribution
   */
  async generateCapTable(entityId: string): Promise<{
    entity: LegalEntity;
    equity: {
      ownerName: string;
      ownerType: 'individual' | 'entity';
      ownershipType: OwnershipType;
      sharesOwned?: number;
      percentageOwned?: number;
      votingPercentage?: number;
      currentValue?: number;
    }[];
    totalShares?: number;
    totalValue?: number;
    fullyDilutedShares?: number;
  }> {
    this.logger.log(`Generating cap table for: ${entityId}`);

    const { entity, stakes } = await this.getOwnershipBreakdown(entityId);

    const equity = stakes.map((stake) => ({
      ownerName: stake.ownerName,
      ownerType: stake.ownerType,
      ownershipType: stake.ownershipType,
      sharesOwned: stake.sharesOwned,
      percentageOwned: stake.percentageOwned,
      votingPercentage: stake.votingPercentage,
      currentValue: stake.currentValue,
    }));

    const totalShares = stakes.reduce(
      (sum, stake) => sum + (stake.sharesOwned || 0),
      0,
    );

    const totalValue = stakes.reduce(
      (sum, stake) => sum + (stake.currentValue || 0),
      0,
    );

    // Calculate fully diluted shares (including options, warrants, etc.)
    const optionShares = stakes
      .filter(
        (s) =>
          s.ownershipType === OwnershipType.EQUITY_OPTION ||
          s.ownershipType === OwnershipType.WARRANT,
      )
      .reduce((sum, stake) => sum + (stake.sharesOwned || 0), 0);

    const fullyDilutedShares = totalShares + optionShares;

    return {
      entity,
      equity,
      totalShares: totalShares || undefined,
      totalValue: totalValue || undefined,
      fullyDilutedShares: fullyDilutedShares || undefined,
    };
  }

  /**
   * 13. Transfer ownership stake
   *
   * @param stakeId Stake ID to transfer
   * @param newOwnerId New owner ID
   * @param newOwnerName New owner name
   * @param transferDate Transfer date
   * @param transferPrice Transfer price
   * @returns Updated stake
   */
  async transferOwnershipStake(
    stakeId: string,
    newOwnerId: string,
    newOwnerName: string,
    transferDate: Date,
    transferPrice?: number,
  ): Promise<OwnershipStake> {
    this.logger.log(`Transferring ownership stake: ${stakeId}`);

    const stake = await OwnershipStakeModel.findByPk(stakeId);
    if (!stake) {
      throw new NotFoundException('Ownership stake not found');
    }

    const oldOwner = {
      ownerId: stake.ownerId,
      ownerName: stake.ownerName,
    };

    stake.ownerId = newOwnerId;
    stake.ownerName = newOwnerName;
    stake.acquisitionDate = transferDate;
    if (transferPrice !== undefined) {
      stake.acquisitionPrice = transferPrice;
    }

    // Log transfer in metadata
    const metadata = stake.metadata || {};
    if (!metadata.transferHistory) {
      metadata.transferHistory = [];
    }
    metadata.transferHistory.push({
      fromOwnerId: oldOwner.ownerId,
      fromOwnerName: oldOwner.ownerName,
      toOwnerId: newOwnerId,
      toOwnerName: newOwnerName,
      transferDate: transferDate.toISOString(),
      transferPrice,
    });
    stake.metadata = metadata;

    await stake.save();

    this.logger.log(`Ownership stake ${stakeId} transferred to ${newOwnerName}`);
    return stake.toJSON() as OwnershipStake;
  }

  // ============================================================================
  // OFFICERS & DIRECTORS
  // ============================================================================

  /**
   * 14. Add officer/director
   *
   * @param entityId Entity ID
   * @param officer Officer details
   * @returns Created officer
   */
  async addOfficer(
    entityId: string,
    officer: Omit<EntityOfficer, 'id' | 'entityId' | 'createdAt' | 'updatedAt'>,
  ): Promise<EntityOfficer> {
    this.logger.log(`Adding officer to entity: ${entityId}`);

    const entity = await LegalEntityModel.findByPk(entityId);
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    const entityOfficer = await EntityOfficerModel.create({
      entityId,
      ...officer,
    });

    this.logger.log(`Officer created: ${entityOfficer.id}`);
    return entityOfficer.toJSON() as EntityOfficer;
  }

  /**
   * 15. Remove/terminate officer
   *
   * @param officerId Officer ID
   * @param resignationDate Resignation date
   * @returns Updated officer
   */
  async terminateOfficer(
    officerId: string,
    resignationDate: Date,
  ): Promise<EntityOfficer> {
    this.logger.log(`Terminating officer: ${officerId}`);

    const officer = await EntityOfficerModel.findByPk(officerId);
    if (!officer) {
      throw new NotFoundException('Officer not found');
    }

    officer.resignationDate = resignationDate;
    officer.isActive = false;
    await officer.save();

    this.logger.log(`Officer ${officerId} terminated`);
    return officer.toJSON() as EntityOfficer;
  }

  /**
   * 16. Get active officers for entity
   *
   * @param entityId Entity ID
   * @returns List of active officers
   */
  async getActiveOfficers(entityId: string): Promise<EntityOfficer[]> {
    this.logger.log(`Getting active officers for: ${entityId}`);

    const officers = await EntityOfficerModel.findAll({
      where: {
        entityId,
        isActive: true,
      },
      order: [['appointmentDate', 'ASC']],
    });

    return officers.map((o) => o.toJSON() as EntityOfficer);
  }

  /**
   * 17. Update officer role/compensation
   *
   * @param officerId Officer ID
   * @param updates Updates to apply
   * @returns Updated officer
   */
  async updateOfficer(
    officerId: string,
    updates: Partial<EntityOfficer>,
  ): Promise<EntityOfficer> {
    this.logger.log(`Updating officer: ${officerId}`);

    const officer = await EntityOfficerModel.findByPk(officerId);
    if (!officer) {
      throw new NotFoundException('Officer not found');
    }

    await officer.update(updates);

    this.logger.log(`Officer ${officerId} updated`);
    return officer.toJSON() as EntityOfficer;
  }

  // ============================================================================
  // COMPLIANCE CALENDAR
  // ============================================================================

  /**
   * 18. Create compliance event
   *
   * @param event Compliance event details
   * @returns Created compliance event
   */
  async createComplianceEvent(
    event: Omit<ComplianceEvent, 'id' | 'status' | 'documents' | 'createdAt' | 'updatedAt'>,
  ): Promise<ComplianceEvent> {
    this.logger.log(`Creating compliance event for entity: ${event.entityId}`);

    const validated = ComplianceEventSchema.parse(event);

    const entity = await LegalEntityModel.findByPk(validated.entityId);
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    const complianceEvent = await ComplianceEventModel.create({
      ...validated,
      status: ComplianceStatus.UPCOMING,
      documents: [],
    });

    this.logger.log(`Compliance event created: ${complianceEvent.id}`);
    return complianceEvent.toJSON() as ComplianceEvent;
  }

  /**
   * 19. Update compliance event status
   *
   * @param eventId Event ID
   * @param status New status
   * @param completionDate Completion date if completed
   * @returns Updated event
   */
  async updateComplianceStatus(
    eventId: string,
    status: ComplianceStatus,
    completionDate?: Date,
  ): Promise<ComplianceEvent> {
    this.logger.log(`Updating compliance event ${eventId} to ${status}`);

    const event = await ComplianceEventModel.findByPk(eventId);
    if (!event) {
      throw new NotFoundException('Compliance event not found');
    }

    event.status = status;
    if (completionDate) {
      event.completionDate = completionDate;
    }

    await event.save();

    this.logger.log(`Compliance event ${eventId} updated to ${status}`);
    return event.toJSON() as ComplianceEvent;
  }

  /**
   * 20. Get upcoming compliance events
   *
   * @param entityId Optional entity ID filter
   * @param daysAhead Number of days to look ahead
   * @returns Upcoming compliance events
   */
  async getUpcomingComplianceEvents(
    entityId?: string,
    daysAhead: number = 90,
  ): Promise<ComplianceEvent[]> {
    this.logger.log(`Getting upcoming compliance events (${daysAhead} days)`);

    const where: WhereOptions = {
      dueDate: {
        [Op.lte]: new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000),
        [Op.gte]: new Date(),
      },
      status: {
        [Op.in]: [ComplianceStatus.UPCOMING, ComplianceStatus.DUE_SOON],
      },
    };

    if (entityId) {
      where.entityId = entityId;
    }

    const events = await ComplianceEventModel.findAll({
      where,
      order: [['dueDate', 'ASC']],
      include: [
        {
          model: LegalEntityModel,
          as: 'entity',
        },
      ],
    });

    return events.map((e) => e.toJSON() as ComplianceEvent);
  }

  /**
   * 21. Get overdue compliance events
   *
   * @param entityId Optional entity ID filter
   * @returns Overdue compliance events
   */
  async getOverdueComplianceEvents(
    entityId?: string,
  ): Promise<ComplianceEvent[]> {
    this.logger.log('Getting overdue compliance events');

    const where: WhereOptions = {
      dueDate: {
        [Op.lt]: new Date(),
      },
      status: {
        [Op.notIn]: [ComplianceStatus.COMPLETED, ComplianceStatus.FILED, ComplianceStatus.WAIVED],
      },
    };

    if (entityId) {
      where.entityId = entityId;
    }

    const events = await ComplianceEventModel.findAll({
      where,
      order: [['dueDate', 'ASC']],
      include: [
        {
          model: LegalEntityModel,
          as: 'entity',
        },
      ],
    });

    return events.map((e) => e.toJSON() as ComplianceEvent);
  }

  /**
   * 22. Add document to compliance event
   *
   * @param eventId Event ID
   * @param document Document details
   * @returns Updated event
   */
  async addComplianceDocument(
    eventId: string,
    document: ComplianceDocument,
  ): Promise<ComplianceEvent> {
    this.logger.log(`Adding document to compliance event: ${eventId}`);

    const event = await ComplianceEventModel.findByPk(eventId);
    if (!event) {
      throw new NotFoundException('Compliance event not found');
    }

    const documents = event.documents || [];
    documents.push(document);
    event.documents = documents;

    await event.save();

    this.logger.log(`Document added to compliance event ${eventId}`);
    return event.toJSON() as ComplianceEvent;
  }

  /**
   * 23. Update compliance event reminder settings
   *
   * @param eventId Event ID
   * @param reminderDays Days before due date to send reminders
   * @returns Updated event
   */
  async updateComplianceReminders(
    eventId: string,
    reminderDays: number[],
  ): Promise<ComplianceEvent> {
    this.logger.log(`Updating compliance reminders for: ${eventId}`);

    const event = await ComplianceEventModel.findByPk(eventId);
    if (!event) {
      throw new NotFoundException('Compliance event not found');
    }

    event.reminderDays = reminderDays;
    await event.save();

    this.logger.log(`Compliance reminders updated for ${eventId}`);
    return event.toJSON() as ComplianceEvent;
  }

  /**
   * 24. Get compliance calendar for entity
   *
   * @param entityId Entity ID
   * @param startDate Start date
   * @param endDate End date
   * @returns Compliance events in date range
   */
  async getComplianceCalendar(
    entityId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ComplianceEvent[]> {
    this.logger.log(`Getting compliance calendar for: ${entityId}`);

    const events = await ComplianceEventModel.findAll({
      where: {
        entityId,
        dueDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['dueDate', 'ASC']],
    });

    return events.map((e) => e.toJSON() as ComplianceEvent);
  }

  // ============================================================================
  // ENTITY SEARCH & QUERIES
  // ============================================================================

  /**
   * 25. Search entities by criteria
   *
   * @param criteria Search criteria
   * @returns Matching entities and total count
   */
  async searchEntities(
    criteria: EntitySearchCriteria,
  ): Promise<{ entities: LegalEntity[]; total: number }> {
    this.logger.log('Searching entities with criteria');

    const validated = EntitySearchCriteriaSchema.parse(criteria);
    const where: WhereOptions = {};

    // Full-text search
    if (validated.query) {
      where[Op.or] = [
        { legalName: { [Op.iLike]: `%${validated.query}%` } },
        { dbaName: { [Op.iLike]: `%${validated.query}%` } },
        { entityNumber: { [Op.iLike]: `%${validated.query}%` } },
      ];
    }

    // Entity type filter
    if (validated.entityType && validated.entityType.length > 0) {
      where.entityType = { [Op.in]: validated.entityType };
    }

    // Status filter
    if (validated.status && validated.status.length > 0) {
      where.status = { [Op.in]: validated.status };
    }

    // Jurisdiction filter
    if (validated.jurisdiction && validated.jurisdiction.length > 0) {
      where.incorporationJurisdiction = { [Op.in]: validated.jurisdiction };
    }

    // Tax classification filter
    if (validated.taxClassification && validated.taxClassification.length > 0) {
      where.taxClassification = { [Op.in]: validated.taxClassification };
    }

    // Parent entity filter
    if (validated.parentEntityId) {
      where.parentEntityId = validated.parentEntityId;
    }

    // Has parent filter
    if (validated.hasParent !== undefined) {
      where.parentEntityId = validated.hasParent
        ? { [Op.ne]: null }
        : { [Op.eq]: null };
    }

    // Date range filters
    if (validated.createdAfter) {
      where.createdAt = { [Op.gte]: validated.createdAfter };
    }
    if (validated.createdBefore) {
      if (where.createdAt) {
        (where.createdAt as any)[Op.lte] = validated.createdBefore;
      } else {
        where.createdAt = { [Op.lte]: validated.createdBefore };
      }
    }

    const { count, rows } = await LegalEntityModel.findAndCountAll({
      where,
      limit: validated.limit,
      offset: validated.offset,
      order: [[validated.sortBy, validated.sortOrder]],
    });

    this.logger.log(`Found ${count} entities matching criteria`);
    return {
      entities: rows.map((r) => r.toJSON() as LegalEntity),
      total: count,
    };
  }

  /**
   * 26. Get entity by ID with full details
   *
   * @param entityId Entity ID
   * @returns Entity with related data
   */
  async getEntityById(entityId: string): Promise<{
    entity: LegalEntity;
    officers: EntityOfficer[];
    ownershipStakes: OwnershipStake[];
    subsidiaries: LegalEntity[];
    parents: LegalEntity[];
    upcomingCompliance: ComplianceEvent[];
  }> {
    this.logger.log(`Getting entity by ID: ${entityId}`);

    const entity = await LegalEntityModel.findByPk(entityId);
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    const [officers, ownershipStakes, subsidiaries, parents, upcomingCompliance] =
      await Promise.all([
        this.getActiveOfficers(entityId),
        OwnershipStakeModel.findAll({ where: { entityId } }).then((stakes) =>
          stakes.map((s) => s.toJSON() as OwnershipStake),
        ),
        this.getSubsidiaries(entityId, false),
        this.getParentEntities(entityId),
        this.getUpcomingComplianceEvents(entityId, 90),
      ]);

    return {
      entity: entity.toJSON() as LegalEntity,
      officers,
      ownershipStakes,
      subsidiaries,
      parents,
      upcomingCompliance,
    };
  }

  /**
   * 27. Get entity by entity number
   *
   * @param entityNumber Entity number
   * @returns Entity
   */
  async getEntityByNumber(entityNumber: string): Promise<LegalEntity> {
    this.logger.log(`Getting entity by number: ${entityNumber}`);

    const entity = await LegalEntityModel.findOne({
      where: { entityNumber },
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    return entity.toJSON() as LegalEntity;
  }

  /**
   * 28. Search entities by jurisdiction
   *
   * @param jurisdiction Jurisdiction code
   * @returns Entities in jurisdiction
   */
  async getEntitiesByJurisdiction(
    jurisdiction: string,
  ): Promise<LegalEntity[]> {
    this.logger.log(`Getting entities in jurisdiction: ${jurisdiction}`);

    const entities = await LegalEntityModel.findAll({
      where: {
        incorporationJurisdiction: jurisdiction,
      },
      order: [['legalName', 'ASC']],
    });

    return entities.map((e) => e.toJSON() as LegalEntity);
  }

  // ============================================================================
  // ENTITY HEALTH & MONITORING
  // ============================================================================

  /**
   * 29. Get entity health metrics
   *
   * @param entityId Entity ID
   * @returns Health metrics
   */
  async getEntityHealthMetrics(entityId: string): Promise<EntityHealthMetrics> {
    this.logger.log(`Getting health metrics for: ${entityId}`);

    const entity = await LegalEntityModel.findByPk(entityId);
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    const [overdueEvents, upcomingEvents, activeOfficers] = await Promise.all([
      this.getOverdueComplianceEvents(entityId),
      this.getUpcomingComplianceEvents(entityId, 30),
      this.getActiveOfficers(entityId),
    ]);

    const issues: HealthIssue[] = [];

    // Check for overdue compliance
    if (overdueEvents.length > 0) {
      issues.push({
        severity: 'critical',
        category: 'compliance',
        description: `${overdueEvents.length} overdue compliance event(s)`,
        remediation: 'Complete or update overdue compliance items',
      });
    }

    // Check for upcoming deadlines
    if (upcomingEvents.length > 5) {
      issues.push({
        severity: 'medium',
        category: 'compliance',
        description: `${upcomingEvents.length} upcoming compliance event(s) in next 30 days`,
        remediation: 'Review and schedule compliance activities',
      });
    }

    // Check officer status
    if (activeOfficers.length === 0) {
      issues.push({
        severity: 'high',
        category: 'governance',
        description: 'No active officers on record',
        remediation: 'Appoint required officers',
      });
    }

    // Check entity status
    const goodStanding =
      entity.status === EntityStatus.GOOD_STANDING ||
      entity.status === EntityStatus.ACTIVE;

    if (!goodStanding) {
      issues.push({
        severity: 'high',
        category: 'status',
        description: `Entity status is ${entity.status}`,
        remediation: 'Address entity status issues',
      });
    }

    // Calculate compliance score (0-100)
    let complianceScore = 100;
    complianceScore -= overdueEvents.length * 10;
    complianceScore -= upcomingEvents.length * 2;
    if (activeOfficers.length === 0) complianceScore -= 20;
    if (!goodStanding) complianceScore -= 30;
    complianceScore = Math.max(0, complianceScore);

    // Determine overall health
    let overallHealth: 'healthy' | 'warning' | 'critical';
    if (complianceScore >= 80) {
      overallHealth = 'healthy';
    } else if (complianceScore >= 50) {
      overallHealth = 'warning';
    } else {
      overallHealth = 'critical';
    }

    return {
      entityId,
      overallHealth,
      complianceScore,
      overdueCompliance: overdueEvents.length,
      upcomingDeadlines: upcomingEvents.length,
      activeOfficers: activeOfficers.length,
      goodStanding,
      issues,
    };
  }

  /**
   * 30. Monitor entity compliance status
   *
   * @param entityId Entity ID
   * @returns Compliance monitoring report
   */
  async monitorEntityCompliance(entityId: string): Promise<{
    entity: LegalEntity;
    overdue: ComplianceEvent[];
    dueSoon: ComplianceEvent[];
    upcoming: ComplianceEvent[];
    completed: number;
    totalEvents: number;
  }> {
    this.logger.log(`Monitoring compliance for: ${entityId}`);

    const entity = await LegalEntityModel.findByPk(entityId);
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    const [overdue, dueSoon, upcoming, allEvents] = await Promise.all([
      this.getOverdueComplianceEvents(entityId),
      ComplianceEventModel.findAll({
        where: {
          entityId,
          status: ComplianceStatus.DUE_SOON,
        },
        order: [['dueDate', 'ASC']],
      }).then((events) => events.map((e) => e.toJSON() as ComplianceEvent)),
      this.getUpcomingComplianceEvents(entityId, 90),
      ComplianceEventModel.findAll({
        where: { entityId },
      }),
    ]);

    const completed = allEvents.filter(
      (e) =>
        e.status === ComplianceStatus.COMPLETED ||
        e.status === ComplianceStatus.FILED,
    ).length;

    return {
      entity: entity.toJSON() as LegalEntity,
      overdue,
      dueSoon,
      upcoming,
      completed,
      totalEvents: allEvents.length,
    };
  }

  // ============================================================================
  // REPORTING & ANALYTICS
  // ============================================================================

  /**
   * 31. Generate entity portfolio report
   *
   * @param tenantId Optional tenant ID filter
   * @returns Portfolio summary
   */
  async generatePortfolioReport(tenantId?: string): Promise<{
    totalEntities: number;
    byType: Record<EntityType, number>;
    byStatus: Record<EntityStatus, number>;
    byJurisdiction: Record<string, number>;
    overdueCompliance: number;
    entitiesAtRisk: number;
  }> {
    this.logger.log('Generating entity portfolio report');

    const where: WhereOptions = {};
    if (tenantId) {
      where.tenantId = tenantId;
    }

    const entities = await LegalEntityModel.findAll({ where });

    const byType = entities.reduce((acc, e) => {
      acc[e.entityType] = (acc[e.entityType] || 0) + 1;
      return acc;
    }, {} as Record<EntityType, number>);

    const byStatus = entities.reduce((acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    }, {} as Record<EntityStatus, number>);

    const byJurisdiction = entities.reduce((acc, e) => {
      acc[e.incorporationJurisdiction] =
        (acc[e.incorporationJurisdiction] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get overdue compliance count
    const overdueEvents = await ComplianceEventModel.findAll({
      where: {
        dueDate: { [Op.lt]: new Date() },
        status: {
          [Op.notIn]: [
            ComplianceStatus.COMPLETED,
            ComplianceStatus.FILED,
            ComplianceStatus.WAIVED,
          ],
        },
      },
    });

    const entitiesWithOverdue = new Set(
      overdueEvents.map((e) => e.entityId),
    ).size;

    return {
      totalEntities: entities.length,
      byType,
      byStatus,
      byJurisdiction,
      overdueCompliance: overdueEvents.length,
      entitiesAtRisk: entitiesWithOverdue,
    };
  }

  /**
   * 32. Get entities requiring annual filings
   *
   * @param monthsAhead Months to look ahead
   * @returns Entities with upcoming annual filings
   */
  async getEntitiesRequiringAnnualFilings(
    monthsAhead: number = 3,
  ): Promise<{
    entity: LegalEntity;
    dueDate: Date;
    filingType: string;
  }[]> {
    this.logger.log('Getting entities requiring annual filings');

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + monthsAhead);

    const events = await ComplianceEventModel.findAll({
      where: {
        eventType: {
          [Op.in]: [
            ComplianceEventType.ANNUAL_REPORT,
            ComplianceEventType.FRANCHISE_TAX,
          ],
        },
        dueDate: {
          [Op.between]: [new Date(), endDate],
        },
        status: {
          [Op.notIn]: [ComplianceStatus.COMPLETED, ComplianceStatus.FILED],
        },
      },
      include: [
        {
          model: LegalEntityModel,
          as: 'entity',
        },
      ],
      order: [['dueDate', 'ASC']],
    });

    return events.map((e) => ({
      entity: e.entity!.toJSON() as LegalEntity,
      dueDate: e.dueDate,
      filingType: e.eventType,
    }));
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * 33. Generate unique entity number
   *
   * @param entityType Entity type
   * @returns Generated entity number
   */
  async generateEntityNumber(entityType: EntityType): Promise<string> {
    const prefix = this.getEntityTypePrefix(entityType);
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * 34. Validate entity in good standing
   *
   * @param entityId Entity ID
   * @returns Whether entity is in good standing
   */
  async validateGoodStanding(entityId: string): Promise<boolean> {
    const entity = await LegalEntityModel.findByPk(entityId);
    if (!entity) {
      return false;
    }

    // Check status
    if (
      entity.status !== EntityStatus.GOOD_STANDING &&
      entity.status !== EntityStatus.ACTIVE
    ) {
      return false;
    }

    // Check for overdue compliance
    const overdueEvents = await this.getOverdueComplianceEvents(entityId);
    if (overdueEvents.length > 0) {
      return false;
    }

    return true;
  }

  /**
   * 35. Merge entities
   *
   * @param sourceEntityId Entity being merged (will be marked as merged)
   * @param targetEntityId Entity to merge into
   * @param mergerDate Date of merger
   * @param userId User performing merger
   * @returns Updated entities
   */
  async mergeEntities(
    sourceEntityId: string,
    targetEntityId: string,
    mergerDate: Date,
    userId: string,
  ): Promise<{ source: LegalEntity; target: LegalEntity }> {
    this.logger.log(`Merging entity ${sourceEntityId} into ${targetEntityId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const [source, target] = await Promise.all([
        LegalEntityModel.findByPk(sourceEntityId, { transaction }),
        LegalEntityModel.findByPk(targetEntityId, { transaction }),
      ]);

      if (!source || !target) {
        throw new NotFoundException('One or both entities not found');
      }

      // Update source entity status
      source.status = EntityStatus.MERGED;
      source.updatedBy = userId;
      const sourceMetadata = source.metadata || {
        tags: [],
        customFields: {},
        externalIds: {},
      };
      sourceMetadata.customFields.mergedInto = targetEntityId;
      sourceMetadata.customFields.mergerDate = mergerDate.toISOString();
      source.metadata = sourceMetadata;
      await source.save({ transaction });

      // Create relationship
      await EntityRelationshipModel.create(
        {
          parentEntityId: targetEntityId,
          childEntityId: sourceEntityId,
          relationshipType: EntityRelationshipType.MERGED_INTO,
          effectiveDate: mergerDate,
        },
        { transaction },
      );

      // Transfer ownership stakes
      await OwnershipStakeModel.update(
        { entityId: targetEntityId },
        {
          where: { entityId: sourceEntityId },
          transaction,
        },
      );

      // Transfer compliance events
      await ComplianceEventModel.update(
        { entityId: targetEntityId },
        {
          where: {
            entityId: sourceEntityId,
            status: {
              [Op.notIn]: [ComplianceStatus.COMPLETED, ComplianceStatus.FILED],
            },
          },
          transaction,
        },
      );

      await transaction.commit();

      this.logger.log(
        `Successfully merged ${sourceEntityId} into ${targetEntityId}`,
      );
      return {
        source: source.toJSON() as LegalEntity,
        target: target.toJSON() as LegalEntity,
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to merge entities: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to merge entities');
    }
  }

  /**
   * 36. Bulk update entity metadata
   *
   * @param entityIds Array of entity IDs
   * @param metadataUpdates Metadata updates to apply
   * @param userId User performing update
   * @returns Number of entities updated
   */
  async bulkUpdateEntityMetadata(
    entityIds: string[],
    metadataUpdates: Partial<EntityMetadata>,
    userId: string,
  ): Promise<number> {
    this.logger.log(`Bulk updating metadata for ${entityIds.length} entities`);

    const entities = await LegalEntityModel.findAll({
      where: {
        id: { [Op.in]: entityIds },
      },
    });

    let updated = 0;

    for (const entity of entities) {
      const metadata = entity.metadata || {
        tags: [],
        customFields: {},
        externalIds: {},
      };

      // Merge metadata updates
      if (metadataUpdates.tags) {
        metadata.tags = [
          ...new Set([...metadata.tags, ...metadataUpdates.tags]),
        ];
      }
      if (metadataUpdates.customFields) {
        metadata.customFields = {
          ...metadata.customFields,
          ...metadataUpdates.customFields,
        };
      }
      if (metadataUpdates.externalIds) {
        metadata.externalIds = {
          ...metadata.externalIds,
          ...metadataUpdates.externalIds,
        };
      }
      if (metadataUpdates.industry) {
        metadata.industry = metadataUpdates.industry;
      }
      if (metadataUpdates.naicsCode) {
        metadata.naicsCode = metadataUpdates.naicsCode;
      }
      if (metadataUpdates.sicCode) {
        metadata.sicCode = metadataUpdates.sicCode;
      }

      entity.metadata = metadata;
      entity.updatedBy = userId;
      await entity.save();
      updated++;
    }

    this.logger.log(`Updated metadata for ${updated} entities`);
    return updated;
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private getEntityTypePrefix(entityType: EntityType): string {
    const prefixes: Record<EntityType, string> = {
      [EntityType.CORPORATION]: 'CORP',
      [EntityType.LLC]: 'LLC',
      [EntityType.LLP]: 'LLP',
      [EntityType.PARTNERSHIP]: 'PART',
      [EntityType.SOLE_PROPRIETORSHIP]: 'SOLE',
      [EntityType.NONPROFIT]: 'NPO',
      [EntityType.PROFESSIONAL_CORPORATION]: 'PC',
      [EntityType.S_CORPORATION]: 'SCORP',
      [EntityType.C_CORPORATION]: 'CCORP',
      [EntityType.BENEFIT_CORPORATION]: 'BCORP',
      [EntityType.COOPERATIVE]: 'COOP',
      [EntityType.JOINT_VENTURE]: 'JV',
      [EntityType.TRUST]: 'TRST',
      [EntityType.HOLDING_COMPANY]: 'HOLD',
      [EntityType.SUBSIDIARY]: 'SUB',
      [EntityType.BRANCH]: 'BRNCH',
      [EntityType.DIVISION]: 'DIV',
      [EntityType.OTHER]: 'ENT',
    };
    return prefixes[entityType] || 'ENT';
  }

  private async checkCircularRelationship(
    parentId: string,
    childId: string,
  ): Promise<boolean> {
    // Check if childId is an ancestor of parentId
    const checkAncestor = async (
      currentId: string,
      targetId: string,
      visited: Set<string> = new Set(),
    ): Promise<boolean> => {
      if (visited.has(currentId)) {
        return false; // Avoid infinite loops
      }
      visited.add(currentId);

      if (currentId === targetId) {
        return true;
      }

      const relationships = await EntityRelationshipModel.findAll({
        where: {
          childEntityId: currentId,
          endDate: null,
        },
      });

      for (const rel of relationships) {
        const isAncestor = await checkAncestor(
          rel.parentEntityId,
          targetId,
          visited,
        );
        if (isAncestor) {
          return true;
        }
      }

      return false;
    };

    return checkAncestor(parentId, childId);
  }

  private async buildEntityTree(
    entity: LegalEntityModel,
    maxDepth: number,
    currentDepth: number,
  ): Promise<any> {
    if (currentDepth >= maxDepth) {
      return entity.toJSON();
    }

    const entityJson = entity.toJSON() as any;
    entityJson.children = [];

    const childRelationships = await EntityRelationshipModel.findAll({
      where: {
        parentEntityId: entity.id,
        endDate: null,
      },
      include: [
        {
          model: LegalEntityModel,
          as: 'childEntity',
        },
      ],
    });

    for (const rel of childRelationships) {
      if (rel.childEntity) {
        const childTree = await this.buildEntityTree(
          rel.childEntity,
          maxDepth,
          currentDepth + 1,
        );
        entityJson.children.push({
          ...childTree,
          relationshipType: rel.relationshipType,
          ownershipPercentage: rel.ownershipPercentage,
        });
      }
    }

    return entityJson;
  }

  private async createInitialComplianceEvents(
    entityId: string,
    request: EntityFormationRequest,
    transaction: any,
  ): Promise<void> {
    const events: Partial<ComplianceEvent>[] = [];

    // Annual report (typically due on anniversary of incorporation)
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    events.push({
      entityId,
      eventType: ComplianceEventType.ANNUAL_REPORT,
      title: 'Annual Report Filing',
      description: 'File annual report with state',
      dueDate: nextYear,
      jurisdiction: request.incorporationJurisdiction,
      reminderDays: [60, 30, 14, 7],
      recurring: true,
      recurrenceRule: 'FREQ=YEARLY',
      priority: 'high',
    });

    // Franchise tax (if applicable)
    if (
      request.entityType === EntityType.CORPORATION ||
      request.entityType === EntityType.LLC
    ) {
      const taxDue = new Date();
      taxDue.setMonth(3, 15); // April 15
      if (taxDue < new Date()) {
        taxDue.setFullYear(taxDue.getFullYear() + 1);
      }
      events.push({
        entityId,
        eventType: ComplianceEventType.FRANCHISE_TAX,
        title: 'Franchise Tax Payment',
        description: 'Pay franchise tax',
        dueDate: taxDue,
        jurisdiction: request.incorporationJurisdiction,
        reminderDays: [60, 30, 14, 7],
        recurring: true,
        recurrenceRule: 'FREQ=YEARLY',
        priority: 'high',
      });
    }

    for (const event of events) {
      await ComplianceEventModel.create(
        {
          ...event,
          status: ComplianceStatus.UPCOMING,
          documents: [],
          metadata: {},
        } as any,
        { transaction },
      );
    }
  }
}

// ============================================================================
// NESTJS MODULE
// ============================================================================

/**
 * Legal Entity Management Configuration
 */
export const legalEntityManagementConfig = registerAs(
  'legalEntityManagement',
  () => ({
    autoGenerateEntityNumbers: process.env.AUTO_GENERATE_ENTITY_NUMBERS !== 'false',
    complianceReminderEnabled: process.env.COMPLIANCE_REMINDER_ENABLED !== 'false',
    defaultReminderDays: process.env.DEFAULT_REMINDER_DAYS
      ? JSON.parse(process.env.DEFAULT_REMINDER_DAYS)
      : [30, 14, 7, 1],
  }),
);

/**
 * Legal Entity Management Module
 */
@Global()
@Module({
  imports: [
    ConfigModule.forFeature(legalEntityManagementConfig),
  ],
  providers: [LegalEntityManagementService],
  exports: [LegalEntityManagementService],
})
export class LegalEntityManagementModule {
  static forRoot(options?: {
    sequelize?: Sequelize;
  }): DynamicModule {
    return {
      module: LegalEntityManagementModule,
      providers: [
        {
          provide: 'SEQUELIZE',
          useValue: options?.sequelize,
        },
        LegalEntityManagementService,
      ],
      exports: [LegalEntityManagementService],
    };
  }
}

// ============================================================================
// SWAGGER API TYPES (for documentation)
// ============================================================================

export class CreateEntityDto {
  @ApiProperty({ description: 'Legal name of entity' })
  legalName!: string;

  @ApiPropertyOptional({ description: 'Doing business as name' })
  dbaName?: string;

  @ApiProperty({ enum: EntityType, description: 'Entity type' })
  entityType!: EntityType;

  @ApiProperty({ description: 'Incorporation jurisdiction' })
  incorporationJurisdiction!: string;

  @ApiProperty({ description: 'Business purpose' })
  businessPurpose!: string;

  @ApiProperty({ description: 'Registered agent name' })
  registeredAgentName!: string;

  @ApiProperty({ type: 'object', description: 'Registered agent address' })
  registeredAgentAddress!: EntityAddress;

  @ApiProperty({ type: 'object', description: 'Principal address' })
  principalAddress!: EntityAddress;
}

export class EntityResponseDto {
  @ApiProperty({ description: 'Entity ID' })
  id!: string;

  @ApiProperty({ description: 'Entity number' })
  entityNumber!: string;

  @ApiProperty({ description: 'Legal name' })
  legalName!: string;

  @ApiProperty({ enum: EntityType })
  entityType!: EntityType;

  @ApiProperty({ enum: EntityStatus })
  status!: EntityStatus;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt!: Date;
}

export class ComplianceEventDto {
  @ApiProperty({ description: 'Entity ID' })
  entityId!: string;

  @ApiProperty({ enum: ComplianceEventType })
  eventType!: ComplianceEventType;

  @ApiProperty({ description: 'Event title' })
  title!: string;

  @ApiProperty({ description: 'Due date' })
  dueDate!: Date;

  @ApiProperty({ enum: ComplianceStatus })
  status!: ComplianceStatus;
}
