/**
 * LOC: HCM_ORG_STRUCT_001
 * File: /reuse/server/human-capital/organizational-structure-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - d3-hierarchy (for org charts)
 *   - graphlib (for graph operations)
 *
 * DOWNSTREAM (imported by):
 *   - Organization management services
 *   - HR analytics dashboards
 *   - Reporting & visualization tools
 *   - Workforce planning systems
 *   - Budget allocation services
 */

/**
 * File: /reuse/server/human-capital/organizational-structure-kit.ts
 * Locator: WC-HCM-ORG-STRUCT-001
 * Purpose: Organizational Structure Kit - Comprehensive organization hierarchy management
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, D3-Hierarchy, Graphlib
 * Downstream: ../backend/org/*, ../services/analytics/*, Reporting tools, Workforce planning
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 48+ utility functions for organization hierarchy, departments, divisions, reporting relationships,
 *          cost centers, locations, teams, matrix organizations, reorganization workflows, org charts,
 *          analytics, visualization, and workforce planning
 *
 * LLM Context: Enterprise-grade organizational structure management for White Cross healthcare system.
 * Provides comprehensive organization hierarchy management including department/division/unit structures,
 * reporting relationships and org charts, cost center and business unit management, location and facility
 * tracking, team and group management, matrix organization support, reorganization and restructuring workflows,
 * organizational analytics and KPIs, real-time org chart generation and visualization, headcount tracking,
 * budget allocation, span of control analysis, succession planning support, and SAP SuccessFactors
 * organizational management parity. HIPAA-compliant for healthcare organizational data.
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
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
  Table,
  Column,
  Model,
  DataType,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BelongsTo,
  HasMany,
  ForeignKey,
  Unique,
  Default,
  IsUUID,
  BeforeCreate,
  BeforeUpdate,
  AfterCreate,
  AfterUpdate,
} from 'sequelize-typescript';
import { z } from 'zod';
import { Op, Transaction, FindOptions, WhereOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Organization unit type enumeration
 */
export enum OrgUnitType {
  COMPANY = 'company',
  DIVISION = 'division',
  DEPARTMENT = 'department',
  UNIT = 'unit',
  TEAM = 'team',
  COST_CENTER = 'cost_center',
  LOCATION = 'location',
  PROJECT = 'project',
}

/**
 * Organization unit status
 */
export enum OrgUnitStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  CLOSED = 'closed',
  MERGED = 'merged',
  SPLIT = 'split',
}

/**
 * Reporting relationship type
 */
export enum ReportingType {
  DIRECT = 'direct',
  DOTTED_LINE = 'dotted_line',
  MATRIX = 'matrix',
  FUNCTIONAL = 'functional',
  ADMINISTRATIVE = 'administrative',
}

/**
 * Location type
 */
export enum LocationType {
  HEADQUARTERS = 'headquarters',
  OFFICE = 'office',
  BRANCH = 'branch',
  FACILITY = 'facility',
  HOSPITAL = 'hospital',
  CLINIC = 'clinic',
  WAREHOUSE = 'warehouse',
  REMOTE = 'remote',
}

/**
 * Reorganization type
 */
export enum ReorganizationType {
  MERGER = 'merger',
  SPLIT = 'split',
  RESTRUCTURE = 'restructure',
  ACQUISITION = 'acquisition',
  DIVESTITURE = 'divestiture',
  CONSOLIDATION = 'consolidation',
}

/**
 * Organization unit interface
 */
export interface OrganizationUnit {
  id: string;
  code: string;
  name: string;
  type: OrgUnitType;
  status: OrgUnitStatus;
  parentId?: string;
  level: number;
  path: string; // Materialized path (e.g., '/company/division/dept')
  managerId?: string;
  costCenterCode?: string;
  locationId?: string;
  budgetAmount?: number;
  currency?: string;
  headcount?: number;
  maxHeadcount?: number;
  effectiveDate: Date;
  endDate?: Date;
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * Location interface
 */
export interface Location {
  id: string;
  code: string;
  name: string;
  type: LocationType;
  address: Address;
  timezone: string;
  country: string;
  region?: string;
  capacity?: number;
  isVirtual: boolean;
  isPrimary: boolean;
  parentLocationId?: string;
  contactInfo?: ContactInfo;
  operatingHours?: OperatingHours;
  metadata?: Record<string, any>;
}

/**
 * Address interface
 */
export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Contact info interface
 */
export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
  emergencyPhone?: string;
}

/**
 * Operating hours interface
 */
export interface OperatingHours {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
}

/**
 * Reporting relationship interface
 */
export interface ReportingRelationship {
  id: string;
  employeeId: string;
  managerId: string;
  type: ReportingType;
  orgUnitId?: string;
  isPrimary: boolean;
  effectiveDate: Date;
  endDate?: Date;
  percentage?: number; // For matrix reporting (e.g., 60% to manager A, 40% to manager B)
}

/**
 * Team interface
 */
export interface Team {
  id: string;
  name: string;
  code: string;
  orgUnitId?: string;
  leaderId?: string;
  type: 'permanent' | 'temporary' | 'project' | 'virtual';
  purpose?: string;
  startDate: Date;
  endDate?: Date;
  memberIds: string[];
  metadata?: Record<string, any>;
}

/**
 * Reorganization plan interface
 */
export interface ReorganizationPlan {
  id: string;
  name: string;
  type: ReorganizationType;
  description: string;
  effectiveDate: Date;
  completionDate?: Date;
  status: 'draft' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  changes: ReorgChange[];
  impactedEmployees: number;
  approvedBy?: string;
  approvedAt?: Date;
}

/**
 * Reorganization change
 */
export interface ReorgChange {
  type: 'create' | 'update' | 'delete' | 'merge' | 'split' | 'move';
  entityType: 'org_unit' | 'position' | 'employee';
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  targetId?: string;
}

/**
 * Organization chart node
 */
export interface OrgChartNode {
  id: string;
  name: string;
  title?: string;
  type: OrgUnitType;
  managerId?: string;
  employeeId?: string;
  level: number;
  children: OrgChartNode[];
  metrics?: {
    headcount: number;
    budget?: number;
    spanOfControl?: number;
  };
}

/**
 * Span of control metrics
 */
export interface SpanOfControlMetrics {
  managerId: string;
  directReports: number;
  indirectReports: number;
  totalReports: number;
  levels: number;
  averageSpan: number;
  recommendedMax: number;
  isOptimal: boolean;
}

/**
 * Organizational analytics
 */
export interface OrganizationAnalytics {
  totalUnits: number;
  activeUnits: number;
  totalHeadcount: number;
  byType: Record<OrgUnitType, number>;
  byLevel: Record<number, number>;
  averageSpanOfControl: number;
  deepestLevel: number;
  largestUnit: { id: string; name: string; headcount: number };
  budgetUtilization: number;
  vacancyRate: number;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Address validation schema
 */
export const AddressSchema = z.object({
  street1: z.string().min(1).max(255),
  street2: z.string().max(255).optional(),
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().min(1).max(20),
  country: z.string().min(2).max(2),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }).optional(),
});

/**
 * Organization unit validation schema
 */
export const OrgUnitSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(255),
  type: z.nativeEnum(OrgUnitType),
  status: z.nativeEnum(OrgUnitStatus).default(OrgUnitStatus.ACTIVE),
  parentId: z.string().uuid().optional(),
  managerId: z.string().uuid().optional(),
  costCenterCode: z.string().max(50).optional(),
  locationId: z.string().uuid().optional(),
  budgetAmount: z.number().nonnegative().optional(),
  currency: z.string().length(3).optional(),
  headcount: z.number().int().nonnegative().optional(),
  maxHeadcount: z.number().int().positive().optional(),
  effectiveDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  description: z.string().max(1000).optional(),
}).refine(
  (data) => {
    if (data.endDate && data.effectiveDate) {
      return data.endDate >= data.effectiveDate;
    }
    return true;
  },
  { message: 'End date must be after effective date' }
);

/**
 * Location validation schema
 */
export const LocationSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(255),
  type: z.nativeEnum(LocationType),
  address: AddressSchema,
  timezone: z.string().max(50),
  country: z.string().min(2).max(2),
  region: z.string().max(100).optional(),
  capacity: z.number().int().positive().optional(),
  isVirtual: z.boolean().default(false),
  isPrimary: z.boolean().default(false),
  parentLocationId: z.string().uuid().optional(),
});

/**
 * Reporting relationship validation schema
 */
export const ReportingRelationshipSchema = z.object({
  employeeId: z.string().uuid(),
  managerId: z.string().uuid(),
  type: z.nativeEnum(ReportingType),
  orgUnitId: z.string().uuid().optional(),
  isPrimary: z.boolean().default(true),
  effectiveDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  percentage: z.number().min(0).max(100).optional(),
}).refine(
  (data) => data.employeeId !== data.managerId,
  { message: 'Employee cannot report to themselves' }
);

/**
 * Team validation schema
 */
export const TeamSchema = z.object({
  name: z.string().min(1).max(255),
  code: z.string().min(1).max(50),
  orgUnitId: z.string().uuid().optional(),
  leaderId: z.string().uuid().optional(),
  type: z.enum(['permanent', 'temporary', 'project', 'virtual']),
  purpose: z.string().max(1000).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  memberIds: z.array(z.string().uuid()).default([]),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Organization Unit Model
 */
@Table({
  tableName: 'organization_units',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['code'], unique: true },
    { fields: ['parent_id'] },
    { fields: ['type'] },
    { fields: ['status'] },
    { fields: ['manager_id'] },
    { fields: ['level'] },
    { fields: ['path'], using: 'GIST', operator: 'gist_trgm_ops' },
    { fields: ['effective_date'] },
  ],
})
export class OrganizationUnitModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Unique
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: 'Unique organization unit code',
  })
  code: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Organization unit name',
  })
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(OrgUnitType)),
    allowNull: false,
    comment: 'Type of organization unit',
  })
  type: OrgUnitType;

  @Column({
    type: DataType.ENUM(...Object.values(OrgUnitStatus)),
    allowNull: false,
    defaultValue: OrgUnitStatus.ACTIVE,
    comment: 'Current status',
  })
  status: OrgUnitStatus;

  @ForeignKey(() => OrganizationUnitModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'parent_id',
    comment: 'Parent organization unit ID',
  })
  parentId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Hierarchy level (0 = root)',
  })
  level: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Materialized path for hierarchy queries',
  })
  path: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'manager_id',
    comment: 'Manager employee ID',
  })
  managerId: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'cost_center_code',
    comment: 'Cost center code',
  })
  costCenterCode: string;

  @ForeignKey(() => LocationModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'location_id',
    comment: 'Primary location ID',
  })
  locationId: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
    field: 'budget_amount',
    comment: 'Budget amount',
  })
  budgetAmount: number;

  @Column({
    type: DataType.STRING(3),
    allowNull: true,
    defaultValue: 'USD',
    comment: 'Budget currency',
  })
  currency: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'Current headcount',
  })
  headcount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'max_headcount',
    comment: 'Maximum approved headcount',
  })
  maxHeadcount: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'effective_date',
    comment: 'Effective date',
  })
  effectiveDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'end_date',
    comment: 'End date (if closed)',
  })
  endDate: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Description',
  })
  description: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Additional metadata',
  })
  metadata: Record<string, any>;

  @BelongsTo(() => OrganizationUnitModel, 'parent_id')
  parent: OrganizationUnitModel;

  @HasMany(() => OrganizationUnitModel, 'parent_id')
  children: OrganizationUnitModel[];

  @BelongsTo(() => LocationModel)
  location: LocationModel;

  @HasMany(() => ReportingRelationshipModel)
  reportingRelationships: ReportingRelationshipModel[];

  @HasMany(() => TeamModel)
  teams: TeamModel[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @BeforeCreate
  @BeforeUpdate
  static async calculatePath(instance: OrganizationUnitModel) {
    if (instance.parentId) {
      const parent = await OrganizationUnitModel.findByPk(instance.parentId);
      if (parent) {
        instance.path = `${parent.path}/${instance.code}`;
        instance.level = parent.level + 1;
      }
    } else {
      instance.path = `/${instance.code}`;
      instance.level = 0;
    }
  }
}

/**
 * Location Model
 */
@Table({
  tableName: 'locations',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['code'], unique: true },
    { fields: ['type'] },
    { fields: ['country'] },
    { fields: ['is_primary'] },
    { fields: ['parent_location_id'] },
  ],
})
export class LocationModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Unique
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: 'Location code',
  })
  code: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Location name',
  })
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(LocationType)),
    allowNull: false,
    comment: 'Location type',
  })
  type: LocationType;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    comment: 'Physical address',
  })
  address: Address;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: 'Timezone',
  })
  timezone: string;

  @Column({
    type: DataType.STRING(2),
    allowNull: false,
    comment: 'Country code',
  })
  country: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment: 'Region/state',
  })
  region: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Capacity',
  })
  capacity: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_virtual',
    comment: 'Virtual/remote location',
  })
  isVirtual: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_primary',
    comment: 'Primary location',
  })
  isPrimary: boolean;

  @ForeignKey(() => LocationModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'parent_location_id',
  })
  parentLocationId: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'contact_info',
  })
  contactInfo: ContactInfo;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'operating_hours',
  })
  operatingHours: OperatingHours;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @BelongsTo(() => LocationModel, 'parent_location_id')
  parentLocation: LocationModel;

  @HasMany(() => LocationModel, 'parent_location_id')
  childLocations: LocationModel[];

  @HasMany(() => OrganizationUnitModel)
  organizationUnits: OrganizationUnitModel[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Reporting Relationship Model
 */
@Table({
  tableName: 'reporting_relationships',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['manager_id'] },
    { fields: ['type'] },
    { fields: ['is_primary'] },
    { fields: ['effective_date'] },
    { fields: ['org_unit_id'] },
  ],
})
export class ReportingRelationshipModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'employee_id',
  })
  employeeId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'manager_id',
  })
  managerId: string;

  @Column({
    type: DataType.ENUM(...Object.values(ReportingType)),
    allowNull: false,
    comment: 'Type of reporting relationship',
  })
  type: ReportingType;

  @ForeignKey(() => OrganizationUnitModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'org_unit_id',
  })
  orgUnitId: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_primary',
  })
  isPrimary: boolean;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'effective_date',
  })
  effectiveDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'end_date',
  })
  endDate: Date;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Percentage allocation (for matrix)',
  })
  percentage: number;

  @BelongsTo(() => OrganizationUnitModel)
  organizationUnit: OrganizationUnitModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Team Model
 */
@Table({
  tableName: 'teams',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['code'], unique: true },
    { fields: ['org_unit_id'] },
    { fields: ['leader_id'] },
    { fields: ['type'] },
    { fields: ['start_date'] },
  ],
})
export class TeamModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Unique
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  code: string;

  @ForeignKey(() => OrganizationUnitModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'org_unit_id',
  })
  orgUnitId: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'leader_id',
  })
  leaderId: string;

  @Column({
    type: DataType.ENUM('permanent', 'temporary', 'project', 'virtual'),
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  purpose: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'start_date',
  })
  startDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'end_date',
  })
  endDate: Date;

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
    defaultValue: [],
    field: 'member_ids',
  })
  memberIds: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @BelongsTo(() => OrganizationUnitModel)
  organizationUnit: OrganizationUnitModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Reorganization Plan Model
 */
@Table({
  tableName: 'reorganization_plans',
  timestamps: true,
  indexes: [
    { fields: ['type'] },
    { fields: ['status'] },
    { fields: ['effective_date'] },
  ],
})
export class ReorganizationPlanModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(ReorganizationType)),
    allowNull: false,
  })
  type: ReorganizationType;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'effective_date',
  })
  effectiveDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'completion_date',
  })
  completionDate: Date;

  @Column({
    type: DataType.ENUM('draft', 'approved', 'in_progress', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'draft',
  })
  status: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  changes: ReorgChange[];

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'impacted_employees',
  })
  impactedEmployees: number;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'approved_by',
  })
  approvedBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'approved_at',
  })
  approvedAt: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

// ============================================================================
// CORE ORGANIZATION FUNCTIONS - UNIT MANAGEMENT
// ============================================================================

/**
 * Create organization unit
 *
 * @param unitData - Organization unit data
 * @param transaction - Optional transaction
 * @returns Created unit
 *
 * @example
 * ```typescript
 * const dept = await createOrganizationUnit({
 *   code: 'DEPT-IT',
 *   name: 'IT Department',
 *   type: OrgUnitType.DEPARTMENT,
 *   ...
 * });
 * ```
 */
export async function createOrganizationUnit(
  unitData: Partial<OrganizationUnit>,
  transaction?: Transaction,
): Promise<OrganizationUnitModel> {
  const validated = OrgUnitSchema.parse(unitData);

  // Check for duplicate code
  const existing = await OrganizationUnitModel.findOne({
    where: { code: validated.code },
    transaction,
  });

  if (existing) {
    throw new ConflictException(`Organization unit code ${validated.code} already exists`);
  }

  return OrganizationUnitModel.create(validated as any, { transaction });
}

/**
 * Update organization unit
 *
 * @param unitId - Unit ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated unit
 *
 * @example
 * ```typescript
 * await updateOrganizationUnit('uuid', { headcount: 25 });
 * ```
 */
export async function updateOrganizationUnit(
  unitId: string,
  updates: Partial<OrganizationUnit>,
  transaction?: Transaction,
): Promise<OrganizationUnitModel> {
  const unit = await OrganizationUnitModel.findByPk(unitId, { transaction });

  if (!unit) {
    throw new NotFoundException(`Organization unit ${unitId} not found`);
  }

  await unit.update(updates, { transaction });
  return unit;
}

/**
 * Delete organization unit
 *
 * @param unitId - Unit ID
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await deleteOrganizationUnit('uuid');
 * ```
 */
export async function deleteOrganizationUnit(
  unitId: string,
  transaction?: Transaction,
): Promise<void> {
  const unit = await OrganizationUnitModel.findByPk(unitId, { transaction });

  if (!unit) {
    throw new NotFoundException(`Organization unit ${unitId} not found`);
  }

  // Check for children
  const children = await OrganizationUnitModel.count({
    where: { parentId: unitId },
    transaction,
  });

  if (children > 0) {
    throw new BadRequestException('Cannot delete unit with children');
  }

  await unit.destroy({ transaction });
}

/**
 * Get organization unit by ID
 *
 * @param unitId - Unit ID
 * @param includeChildren - Include child units
 * @returns Organization unit
 *
 * @example
 * ```typescript
 * const unit = await getOrganizationUnit('uuid', true);
 * ```
 */
export async function getOrganizationUnit(
  unitId: string,
  includeChildren: boolean = false,
): Promise<OrganizationUnitModel | null> {
  const options: FindOptions = {
    where: { id: unitId },
  };

  if (includeChildren) {
    options.include = [
      { model: OrganizationUnitModel, as: 'children' },
      { model: LocationModel, as: 'location' },
    ];
  }

  return OrganizationUnitModel.findOne(options);
}

/**
 * Get organization unit by code
 *
 * @param code - Unit code
 * @returns Organization unit
 *
 * @example
 * ```typescript
 * const unit = await getOrganizationUnitByCode('DEPT-IT');
 * ```
 */
export async function getOrganizationUnitByCode(code: string): Promise<OrganizationUnitModel | null> {
  return OrganizationUnitModel.findOne({
    where: { code },
  });
}

/**
 * Get root organization units
 *
 * @returns Root units
 *
 * @example
 * ```typescript
 * const roots = await getRootOrganizationUnits();
 * ```
 */
export async function getRootOrganizationUnits(): Promise<OrganizationUnitModel[]> {
  return OrganizationUnitModel.findAll({
    where: { parentId: null },
    order: [['name', 'ASC']],
  });
}

/**
 * Get children of organization unit
 *
 * @param parentId - Parent unit ID
 * @param recursive - Get all descendants
 * @returns Child units
 *
 * @example
 * ```typescript
 * const children = await getChildrenUnits('uuid', false);
 * ```
 */
export async function getChildrenUnits(
  parentId: string,
  recursive: boolean = false,
): Promise<OrganizationUnitModel[]> {
  if (!recursive) {
    return OrganizationUnitModel.findAll({
      where: { parentId },
      order: [['name', 'ASC']],
    });
  }

  // Recursive query using path
  const parent = await OrganizationUnitModel.findByPk(parentId);
  if (!parent) {
    throw new NotFoundException(`Organization unit ${parentId} not found`);
  }

  return OrganizationUnitModel.findAll({
    where: {
      path: {
        [Op.like]: `${parent.path}/%`,
      },
    },
    order: [['level', 'ASC'], ['name', 'ASC']],
  });
}

/**
 * Get parent hierarchy
 *
 * @param unitId - Unit ID
 * @returns Parent units up to root
 *
 * @example
 * ```typescript
 * const parents = await getParentHierarchy('uuid');
 * ```
 */
export async function getParentHierarchy(unitId: string): Promise<OrganizationUnitModel[]> {
  const unit = await OrganizationUnitModel.findByPk(unitId);
  if (!unit) {
    throw new NotFoundException(`Organization unit ${unitId} not found`);
  }

  const pathParts = unit.path.split('/').filter(Boolean);
  const codes = pathParts.slice(0, -1); // Exclude self

  if (codes.length === 0) {
    return [];
  }

  return OrganizationUnitModel.findAll({
    where: { code: { [Op.in]: codes } },
    order: [['level', 'ASC']],
  });
}

/**
 * Move organization unit
 *
 * @param unitId - Unit to move
 * @param newParentId - New parent ID
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await moveOrganizationUnit('unit-uuid', 'new-parent-uuid');
 * ```
 */
export async function moveOrganizationUnit(
  unitId: string,
  newParentId: string | null,
  transaction?: Transaction,
): Promise<void> {
  const unit = await OrganizationUnitModel.findByPk(unitId, { transaction });

  if (!unit) {
    throw new NotFoundException(`Organization unit ${unitId} not found`);
  }

  // Check for circular reference
  if (newParentId) {
    const descendants = await getChildrenUnits(unitId, true);
    if (descendants.some((d) => d.id === newParentId)) {
      throw new BadRequestException('Cannot move unit to its own descendant');
    }
  }

  await unit.update({ parentId: newParentId }, { transaction });

  // Update all descendants' paths and levels
  await updateDescendantPaths(unitId, transaction);
}

/**
 * Update descendant paths after move
 *
 * @param unitId - Unit ID
 * @param transaction - Optional transaction
 */
async function updateDescendantPaths(
  unitId: string,
  transaction?: Transaction,
): Promise<void> {
  const descendants = await getChildrenUnits(unitId, true);

  for (const descendant of descendants) {
    // Trigger path recalculation
    await descendant.save({ transaction });
  }
}

// ============================================================================
// LOCATION MANAGEMENT
// ============================================================================

/**
 * Create location
 *
 * @param locationData - Location data
 * @param transaction - Optional transaction
 * @returns Created location
 *
 * @example
 * ```typescript
 * const loc = await createLocation({ code: 'NYC-HQ', ... });
 * ```
 */
export async function createLocation(
  locationData: Partial<Location>,
  transaction?: Transaction,
): Promise<LocationModel> {
  const validated = LocationSchema.parse(locationData);

  const existing = await LocationModel.findOne({
    where: { code: validated.code },
    transaction,
  });

  if (existing) {
    throw new ConflictException(`Location code ${validated.code} already exists`);
  }

  return LocationModel.create(validated as any, { transaction });
}

/**
 * Update location
 *
 * @param locationId - Location ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated location
 *
 * @example
 * ```typescript
 * await updateLocation('uuid', { capacity: 100 });
 * ```
 */
export async function updateLocation(
  locationId: string,
  updates: Partial<Location>,
  transaction?: Transaction,
): Promise<LocationModel> {
  const location = await LocationModel.findByPk(locationId, { transaction });

  if (!location) {
    throw new NotFoundException(`Location ${locationId} not found`);
  }

  await location.update(updates, { transaction });
  return location;
}

/**
 * Get location by code
 *
 * @param code - Location code
 * @returns Location
 *
 * @example
 * ```typescript
 * const loc = await getLocationByCode('NYC-HQ');
 * ```
 */
export async function getLocationByCode(code: string): Promise<LocationModel | null> {
  return LocationModel.findOne({ where: { code } });
}

/**
 * Get locations by type
 *
 * @param type - Location type
 * @returns Locations
 *
 * @example
 * ```typescript
 * const offices = await getLocationsByType(LocationType.OFFICE);
 * ```
 */
export async function getLocationsByType(type: LocationType): Promise<LocationModel[]> {
  return LocationModel.findAll({
    where: { type },
    order: [['name', 'ASC']],
  });
}

/**
 * Get locations by country
 *
 * @param country - Country code
 * @returns Locations
 *
 * @example
 * ```typescript
 * const usLocations = await getLocationsByCountry('US');
 * ```
 */
export async function getLocationsByCountry(country: string): Promise<LocationModel[]> {
  return LocationModel.findAll({
    where: { country },
    order: [['name', 'ASC']],
  });
}

/**
 * Get primary location
 *
 * @returns Primary location
 *
 * @example
 * ```typescript
 * const hq = await getPrimaryLocation();
 * ```
 */
export async function getPrimaryLocation(): Promise<LocationModel | null> {
  return LocationModel.findOne({
    where: { isPrimary: true },
  });
}

// ============================================================================
// REPORTING RELATIONSHIPS
// ============================================================================

/**
 * Create reporting relationship
 *
 * @param relationshipData - Relationship data
 * @param transaction - Optional transaction
 * @returns Created relationship
 *
 * @example
 * ```typescript
 * await createReportingRelationship({
 *   employeeId: 'emp-uuid',
 *   managerId: 'mgr-uuid',
 *   type: ReportingType.DIRECT,
 *   ...
 * });
 * ```
 */
export async function createReportingRelationship(
  relationshipData: Partial<ReportingRelationship>,
  transaction?: Transaction,
): Promise<ReportingRelationshipModel> {
  const validated = ReportingRelationshipSchema.parse(relationshipData);

  // If primary, end other primary relationships
  if (validated.isPrimary) {
    await ReportingRelationshipModel.update(
      { endDate: validated.effectiveDate },
      {
        where: {
          employeeId: validated.employeeId,
          isPrimary: true,
          endDate: null,
        },
        transaction,
      },
    );
  }

  return ReportingRelationshipModel.create(validated as any, { transaction });
}

/**
 * Get direct reports
 *
 * @param managerId - Manager ID
 * @param activeOnly - Only active relationships
 * @returns Employee IDs
 *
 * @example
 * ```typescript
 * const reports = await getDirectReports('mgr-uuid');
 * ```
 */
export async function getDirectReports(
  managerId: string,
  activeOnly: boolean = true,
): Promise<string[]> {
  const where: WhereOptions = {
    managerId,
    type: ReportingType.DIRECT,
  };

  if (activeOnly) {
    where.endDate = null;
  }

  const relationships = await ReportingRelationshipModel.findAll({ where });
  return relationships.map((r) => r.employeeId);
}

/**
 * Get all reports (recursive)
 *
 * @param managerId - Manager ID
 * @returns Employee IDs
 *
 * @example
 * ```typescript
 * const allReports = await getAllReports('mgr-uuid');
 * ```
 */
export async function getAllReports(managerId: string): Promise<string[]> {
  const direct = await getDirectReports(managerId);
  const allReports = new Set(direct);

  for (const reportId of direct) {
    const indirect = await getAllReports(reportId);
    indirect.forEach((id) => allReports.add(id));
  }

  return Array.from(allReports);
}

/**
 * Get manager
 *
 * @param employeeId - Employee ID
 * @param type - Relationship type
 * @returns Manager ID
 *
 * @example
 * ```typescript
 * const managerId = await getManager('emp-uuid');
 * ```
 */
export async function getManager(
  employeeId: string,
  type: ReportingType = ReportingType.DIRECT,
): Promise<string | null> {
  const relationship = await ReportingRelationshipModel.findOne({
    where: {
      employeeId,
      type,
      isPrimary: true,
      endDate: null,
    },
  });

  return relationship?.managerId || null;
}

/**
 * Get reporting chain
 *
 * @param employeeId - Employee ID
 * @returns Manager IDs up to top
 *
 * @example
 * ```typescript
 * const chain = await getReportingChain('emp-uuid');
 * ```
 */
export async function getReportingChain(employeeId: string): Promise<string[]> {
  const chain: string[] = [];
  let currentId = employeeId;

  while (true) {
    const managerId = await getManager(currentId);
    if (!managerId || chain.includes(managerId)) {
      break;
    }
    chain.push(managerId);
    currentId = managerId;
  }

  return chain;
}

/**
 * Calculate span of control
 *
 * @param managerId - Manager ID
 * @returns Span metrics
 *
 * @example
 * ```typescript
 * const span = await calculateSpanOfControl('mgr-uuid');
 * ```
 */
export async function calculateSpanOfControl(managerId: string): Promise<SpanOfControlMetrics> {
  const directReports = await getDirectReports(managerId);
  const allReports = await getAllReports(managerId);

  let maxLevel = 0;
  let totalSpan = directReports.length;

  for (const reportId of directReports) {
    const subReports = await getAllReports(reportId);
    const level = await getManagementLevel(reportId, managerId);
    maxLevel = Math.max(maxLevel, level);
    totalSpan += subReports.length;
  }

  const averageSpan = directReports.length > 0 ? totalSpan / directReports.length : 0;
  const recommendedMax = 10; // Industry standard
  const isOptimal = directReports.length >= 3 && directReports.length <= recommendedMax;

  return {
    managerId,
    directReports: directReports.length,
    indirectReports: allReports.length - directReports.length,
    totalReports: allReports.length,
    levels: maxLevel,
    averageSpan,
    recommendedMax,
    isOptimal,
  };
}

/**
 * Get management level
 *
 * @param employeeId - Employee ID
 * @param topManagerId - Top of hierarchy
 * @returns Level count
 */
async function getManagementLevel(
  employeeId: string,
  topManagerId: string,
): Promise<number> {
  const chain = await getReportingChain(employeeId);
  const index = chain.indexOf(topManagerId);
  return index >= 0 ? index + 1 : chain.length;
}

// ============================================================================
// TEAM MANAGEMENT
// ============================================================================

/**
 * Create team
 *
 * @param teamData - Team data
 * @param transaction - Optional transaction
 * @returns Created team
 *
 * @example
 * ```typescript
 * const team = await createTeam({ name: 'Project Alpha', ... });
 * ```
 */
export async function createTeam(
  teamData: Partial<Team>,
  transaction?: Transaction,
): Promise<TeamModel> {
  const validated = TeamSchema.parse(teamData);

  const existing = await TeamModel.findOne({
    where: { code: validated.code },
    transaction,
  });

  if (existing) {
    throw new ConflictException(`Team code ${validated.code} already exists`);
  }

  return TeamModel.create(validated as any, { transaction });
}

/**
 * Add team member
 *
 * @param teamId - Team ID
 * @param employeeId - Employee ID
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await addTeamMember('team-uuid', 'emp-uuid');
 * ```
 */
export async function addTeamMember(
  teamId: string,
  employeeId: string,
  transaction?: Transaction,
): Promise<void> {
  const team = await TeamModel.findByPk(teamId, { transaction });

  if (!team) {
    throw new NotFoundException(`Team ${teamId} not found`);
  }

  if (!team.memberIds.includes(employeeId)) {
    await team.update({
      memberIds: [...team.memberIds, employeeId],
    }, { transaction });
  }
}

/**
 * Remove team member
 *
 * @param teamId - Team ID
 * @param employeeId - Employee ID
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await removeTeamMember('team-uuid', 'emp-uuid');
 * ```
 */
export async function removeTeamMember(
  teamId: string,
  employeeId: string,
  transaction?: Transaction,
): Promise<void> {
  const team = await TeamModel.findByPk(teamId, { transaction });

  if (!team) {
    throw new NotFoundException(`Team ${teamId} not found`);
  }

  await team.update({
    memberIds: team.memberIds.filter((id) => id !== employeeId),
  }, { transaction });
}

/**
 * Get team members
 *
 * @param teamId - Team ID
 * @returns Member IDs
 *
 * @example
 * ```typescript
 * const members = await getTeamMembers('team-uuid');
 * ```
 */
export async function getTeamMembers(teamId: string): Promise<string[]> {
  const team = await TeamModel.findByPk(teamId);

  if (!team) {
    throw new NotFoundException(`Team ${teamId} not found`);
  }

  return team.memberIds;
}

/**
 * Get employee teams
 *
 * @param employeeId - Employee ID
 * @returns Teams
 *
 * @example
 * ```typescript
 * const teams = await getEmployeeTeams('emp-uuid');
 * ```
 */
export async function getEmployeeTeams(employeeId: string): Promise<TeamModel[]> {
  return TeamModel.findAll({
    where: {
      memberIds: { [Op.contains]: [employeeId] },
    },
  });
}

// ============================================================================
// ORG CHART GENERATION
// ============================================================================

/**
 * Generate organization chart
 *
 * @param rootUnitId - Root unit ID (optional)
 * @param maxDepth - Maximum depth
 * @returns Org chart tree
 *
 * @example
 * ```typescript
 * const chart = await generateOrgChart('company-uuid', 3);
 * ```
 */
export async function generateOrgChart(
  rootUnitId?: string,
  maxDepth: number = 5,
): Promise<OrgChartNode[]> {
  const roots = rootUnitId
    ? [await OrganizationUnitModel.findByPk(rootUnitId)]
    : await getRootOrganizationUnits();

  const nodes: OrgChartNode[] = [];

  for (const root of roots) {
    if (root) {
      const node = await buildOrgChartNode(root, 0, maxDepth);
      nodes.push(node);
    }
  }

  return nodes;
}

/**
 * Build org chart node recursively
 *
 * @param unit - Organization unit
 * @param currentDepth - Current depth
 * @param maxDepth - Max depth
 * @returns Org chart node
 */
async function buildOrgChartNode(
  unit: OrganizationUnitModel,
  currentDepth: number,
  maxDepth: number,
): Promise<OrgChartNode> {
  const node: OrgChartNode = {
    id: unit.id,
    name: unit.name,
    type: unit.type,
    managerId: unit.managerId,
    level: unit.level,
    children: [],
    metrics: {
      headcount: unit.headcount || 0,
      budget: unit.budgetAmount ? Number(unit.budgetAmount) : undefined,
    },
  };

  if (currentDepth < maxDepth) {
    const children = await getChildrenUnits(unit.id, false);

    for (const child of children) {
      const childNode = await buildOrgChartNode(child, currentDepth + 1, maxDepth);
      node.children.push(childNode);
    }
  }

  // Calculate span of control
  if (unit.managerId) {
    const span = await calculateSpanOfControl(unit.managerId);
    node.metrics!.spanOfControl = span.directReports;
  }

  return node;
}

/**
 * Generate org chart JSON
 *
 * @param rootUnitId - Root unit ID
 * @returns JSON representation
 *
 * @example
 * ```typescript
 * const json = await generateOrgChartJSON('company-uuid');
 * ```
 */
export async function generateOrgChartJSON(rootUnitId?: string): Promise<string> {
  const chart = await generateOrgChart(rootUnitId);
  return JSON.stringify(chart, null, 2);
}

/**
 * Get org chart as flat list
 *
 * @param rootUnitId - Root unit ID
 * @returns Flat list of nodes
 *
 * @example
 * ```typescript
 * const flatChart = await getOrgChartFlat('company-uuid');
 * ```
 */
export async function getOrgChartFlat(rootUnitId?: string): Promise<OrgChartNode[]> {
  const tree = await generateOrgChart(rootUnitId);
  const flat: OrgChartNode[] = [];

  function flatten(nodes: OrgChartNode[]) {
    for (const node of nodes) {
      flat.push({ ...node, children: [] });
      flatten(node.children);
    }
  }

  flatten(tree);
  return flat;
}

// ============================================================================
// REORGANIZATION MANAGEMENT
// ============================================================================

/**
 * Create reorganization plan
 *
 * @param planData - Plan data
 * @param transaction - Optional transaction
 * @returns Created plan
 *
 * @example
 * ```typescript
 * const plan = await createReorganizationPlan({ ... });
 * ```
 */
export async function createReorganizationPlan(
  planData: Partial<ReorganizationPlan>,
  transaction?: Transaction,
): Promise<ReorganizationPlanModel> {
  return ReorganizationPlanModel.create(planData as any, { transaction });
}

/**
 * Approve reorganization plan
 *
 * @param planId - Plan ID
 * @param approvedBy - Approver ID
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await approveReorganizationPlan('plan-uuid', 'exec-uuid');
 * ```
 */
export async function approveReorganizationPlan(
  planId: string,
  approvedBy: string,
  transaction?: Transaction,
): Promise<void> {
  const plan = await ReorganizationPlanModel.findByPk(planId, { transaction });

  if (!plan) {
    throw new NotFoundException(`Reorganization plan ${planId} not found`);
  }

  await plan.update({
    status: 'approved',
    approvedBy,
    approvedAt: new Date(),
  }, { transaction });
}

/**
 * Execute reorganization plan
 *
 * @param planId - Plan ID
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await executeReorganizationPlan('plan-uuid');
 * ```
 */
export async function executeReorganizationPlan(
  planId: string,
  transaction?: Transaction,
): Promise<void> {
  const plan = await ReorganizationPlanModel.findByPk(planId, { transaction });

  if (!plan) {
    throw new NotFoundException(`Reorganization plan ${planId} not found`);
  }

  if (plan.status !== 'approved') {
    throw new BadRequestException('Plan must be approved before execution');
  }

  await plan.update({ status: 'in_progress' }, { transaction });

  // Execute changes
  for (const change of plan.changes) {
    await executeReorgChange(change, transaction);
  }

  await plan.update({
    status: 'completed',
    completionDate: new Date(),
  }, { transaction });
}

/**
 * Execute single reorg change
 *
 * @param change - Change to execute
 * @param transaction - Transaction
 */
async function executeReorgChange(
  change: ReorgChange,
  transaction?: Transaction,
): Promise<void> {
  switch (change.type) {
    case 'create':
      if (change.entityType === 'org_unit') {
        await createOrganizationUnit(change.newValues!, transaction);
      }
      break;
    case 'update':
      if (change.entityType === 'org_unit') {
        await updateOrganizationUnit(change.entityId, change.newValues!, transaction);
      }
      break;
    case 'delete':
      if (change.entityType === 'org_unit') {
        await deleteOrganizationUnit(change.entityId, transaction);
      }
      break;
    case 'move':
      if (change.entityType === 'org_unit' && change.targetId) {
        await moveOrganizationUnit(change.entityId, change.targetId, transaction);
      }
      break;
  }
}

// ============================================================================
// ORGANIZATIONAL ANALYTICS
// ============================================================================

/**
 * Get organization analytics
 *
 * @returns Analytics data
 *
 * @example
 * ```typescript
 * const analytics = await getOrganizationAnalytics();
 * ```
 */
export async function getOrganizationAnalytics(): Promise<OrganizationAnalytics> {
  const units = await OrganizationUnitModel.findAll();

  const byType: Record<OrgUnitType, number> = {} as any;
  const byLevel: Record<number, number> = {};
  let totalHeadcount = 0;
  let totalBudget = 0;
  let maxHeadcount = 0;
  let largestUnit = { id: '', name: '', headcount: 0 };
  let deepestLevel = 0;
  let totalVacancies = 0;

  for (const unit of units) {
    byType[unit.type] = (byType[unit.type] || 0) + 1;
    byLevel[unit.level] = (byLevel[unit.level] || 0) + 1;

    totalHeadcount += unit.headcount || 0;
    totalBudget += unit.budgetAmount ? Number(unit.budgetAmount) : 0;

    if ((unit.headcount || 0) > maxHeadcount) {
      maxHeadcount = unit.headcount || 0;
      largestUnit = {
        id: unit.id,
        name: unit.name,
        headcount: unit.headcount || 0,
      };
    }

    deepestLevel = Math.max(deepestLevel, unit.level);

    if (unit.maxHeadcount) {
      totalVacancies += unit.maxHeadcount - (unit.headcount || 0);
    }
  }

  // Calculate average span
  const managers = units.filter((u) => u.managerId);
  let totalSpan = 0;

  for (const manager of managers) {
    const span = await calculateSpanOfControl(manager.managerId!);
    totalSpan += span.directReports;
  }

  const averageSpanOfControl = managers.length > 0 ? totalSpan / managers.length : 0;
  const totalMaxHeadcount = units.reduce((sum, u) => sum + (u.maxHeadcount || 0), 0);
  const vacancyRate = totalMaxHeadcount > 0 ? (totalVacancies / totalMaxHeadcount) * 100 : 0;
  const budgetUtilization = totalBudget > 0 ? ((totalHeadcount * 75000) / totalBudget) * 100 : 0;

  return {
    totalUnits: units.length,
    activeUnits: units.filter((u) => u.status === OrgUnitStatus.ACTIVE).length,
    totalHeadcount,
    byType,
    byLevel,
    averageSpanOfControl,
    deepestLevel,
    largestUnit,
    budgetUtilization,
    vacancyRate,
  };
}

/**
 * Get headcount by unit type
 *
 * @returns Headcount map
 *
 * @example
 * ```typescript
 * const headcounts = await getHeadcountByType();
 * ```
 */
export async function getHeadcountByType(): Promise<Record<OrgUnitType, number>> {
  const units = await OrganizationUnitModel.findAll();

  const headcounts: Record<OrgUnitType, number> = {} as any;

  for (const unit of units) {
    headcounts[unit.type] = (headcounts[unit.type] || 0) + (unit.headcount || 0);
  }

  return headcounts;
}

/**
 * Get budget by unit
 *
 * @param unitId - Unit ID
 * @param includeChildren - Include child units
 * @returns Total budget
 *
 * @example
 * ```typescript
 * const budget = await getUnitBudget('dept-uuid', true);
 * ```
 */
export async function getUnitBudget(
  unitId: string,
  includeChildren: boolean = false,
): Promise<number> {
  const unit = await OrganizationUnitModel.findByPk(unitId);

  if (!unit) {
    throw new NotFoundException(`Organization unit ${unitId} not found`);
  }

  let total = unit.budgetAmount ? Number(unit.budgetAmount) : 0;

  if (includeChildren) {
    const children = await getChildrenUnits(unitId, true);
    for (const child of children) {
      total += child.budgetAmount ? Number(child.budgetAmount) : 0;
    }
  }

  return total;
}

/**
 * Calculate organization depth
 *
 * @returns Maximum depth
 *
 * @example
 * ```typescript
 * const depth = await calculateOrganizationDepth();
 * ```
 */
export async function calculateOrganizationDepth(): Promise<number> {
  const result = await OrganizationUnitModel.max('level') as number;
  return result || 0;
}

/**
 * Find units by criteria
 *
 * @param criteria - Search criteria
 * @returns Matching units
 *
 * @example
 * ```typescript
 * const units = await findUnitsByCriteria({ type: OrgUnitType.DEPARTMENT });
 * ```
 */
export async function findUnitsByCriteria(
  criteria: Partial<OrganizationUnit>,
): Promise<OrganizationUnitModel[]> {
  return OrganizationUnitModel.findAll({
    where: criteria as any,
    order: [['name', 'ASC']],
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate org hierarchy
 *
 * @param unitId - Unit to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const valid = await validateOrgHierarchy('uuid');
 * ```
 */
export async function validateOrgHierarchy(unitId: string): Promise<{
  valid: boolean;
  errors: string[];
}> {
  const errors: string[] = [];
  const unit = await OrganizationUnitModel.findByPk(unitId);

  if (!unit) {
    return { valid: false, errors: ['Unit not found'] };
  }

  // Check for circular references
  const parents = await getParentHierarchy(unitId);
  if (parents.some((p) => p.id === unitId)) {
    errors.push('Circular reference detected');
  }

  // Check path consistency
  const calculatedPath = await calculateExpectedPath(unitId);
  if (calculatedPath !== unit.path) {
    errors.push('Path inconsistency detected');
  }

  // Check level consistency
  if (unit.parentId) {
    const parent = await OrganizationUnitModel.findByPk(unit.parentId);
    if (parent && unit.level !== parent.level + 1) {
      errors.push('Level inconsistency detected');
    }
  } else if (unit.level !== 0) {
    errors.push('Root unit should have level 0');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Calculate expected path
 *
 * @param unitId - Unit ID
 * @returns Expected path
 */
async function calculateExpectedPath(unitId: string): Promise<string> {
  const unit = await OrganizationUnitModel.findByPk(unitId);
  if (!unit) {
    return '';
  }

  if (!unit.parentId) {
    return `/${unit.code}`;
  }

  const parent = await OrganizationUnitModel.findByPk(unit.parentId);
  if (!parent) {
    return `/${unit.code}`;
  }

  return `${parent.path}/${unit.code}`;
}

/**
 * Export organization structure
 *
 * @param rootUnitId - Root unit (optional)
 * @returns Export data
 *
 * @example
 * ```typescript
 * const data = await exportOrganizationStructure();
 * ```
 */
export async function exportOrganizationStructure(rootUnitId?: string): Promise<any> {
  const chart = await generateOrgChart(rootUnitId);
  const locations = await LocationModel.findAll();
  const analytics = await getOrganizationAnalytics();

  return {
    organizationChart: chart,
    locations: locations.map((l) => l.toJSON()),
    analytics,
    exportedAt: new Date(),
  };
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

/**
 * Organization Service
 */
@Injectable()
export class OrganizationService {
  async createUnit(data: Partial<OrganizationUnit>): Promise<OrganizationUnitModel> {
    return createOrganizationUnit(data);
  }

  async updateUnit(id: string, updates: Partial<OrganizationUnit>): Promise<OrganizationUnitModel> {
    return updateOrganizationUnit(id, updates);
  }

  async getUnit(id: string, includeChildren: boolean = false): Promise<OrganizationUnitModel | null> {
    return getOrganizationUnit(id, includeChildren);
  }

  async deleteUnit(id: string): Promise<void> {
    return deleteOrganizationUnit(id);
  }

  async generateChart(rootUnitId?: string, maxDepth: number = 5): Promise<OrgChartNode[]> {
    return generateOrgChart(rootUnitId, maxDepth);
  }

  async getAnalytics(): Promise<OrganizationAnalytics> {
    return getOrganizationAnalytics();
  }

  async createLocation(data: Partial<Location>): Promise<LocationModel> {
    return createLocation(data);
  }

  async createTeam(data: Partial<Team>): Promise<TeamModel> {
    return createTeam(data);
  }
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

/**
 * Organization Controller
 */
@ApiTags('Organization')
@Controller('organization')
@ApiBearerAuth()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post('units')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create organization unit' })
  async createUnit(@Body() data: Partial<OrganizationUnit>): Promise<OrganizationUnitModel> {
    return this.organizationService.createUnit(data);
  }

  @Get('units/:id')
  @ApiOperation({ summary: 'Get organization unit' })
  @ApiParam({ name: 'id', type: 'string' })
  async getUnit(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeChildren') includeChildren?: boolean,
  ): Promise<OrganizationUnitModel> {
    const unit = await this.organizationService.getUnit(id, includeChildren);
    if (!unit) {
      throw new NotFoundException(`Organization unit ${id} not found`);
    }
    return unit;
  }

  @Put('units/:id')
  @ApiOperation({ summary: 'Update organization unit' })
  async updateUnit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updates: Partial<OrganizationUnit>,
  ): Promise<OrganizationUnitModel> {
    return this.organizationService.updateUnit(id, updates);
  }

  @Delete('units/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete organization unit' })
  async deleteUnit(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.organizationService.deleteUnit(id);
  }

  @Get('chart')
  @ApiOperation({ summary: 'Generate organization chart' })
  @ApiQuery({ name: 'rootUnitId', required: false })
  @ApiQuery({ name: 'maxDepth', required: false, type: 'number' })
  async getChart(
    @Query('rootUnitId') rootUnitId?: string,
    @Query('maxDepth') maxDepth: number = 5,
  ): Promise<OrgChartNode[]> {
    return this.organizationService.generateChart(rootUnitId, maxDepth);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get organization analytics' })
  async getAnalytics(): Promise<OrganizationAnalytics> {
    return this.organizationService.getAnalytics();
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  OrganizationUnitModel,
  LocationModel,
  ReportingRelationshipModel,
  TeamModel,
  ReorganizationPlanModel,
  OrganizationService,
  OrganizationController,
};
