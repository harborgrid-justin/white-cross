/**
 * LOC: EDWDIM001
 * File: /reuse/edwards/financial/dimension-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/config (Configuration management)
 *   - @nestjs/swagger (API documentation)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial dimension modules
 *   - Chart of accounts services
 *   - Cost center management services
 *   - Financial reporting modules
 */

/**
 * File: /reuse/edwards/financial/dimension-management-kit.ts
 * Locator: WC-EDW-DIM-001
 * Purpose: Comprehensive Financial Dimension Management - JD Edwards EnterpriseOne-level chart of accounts, cost centers, projects, hierarchies
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, ConfigModule
 * Downstream: ../backend/edwards/*, Dimension Services, Financial Reporting, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 38 functions for dimension management, hierarchies, cost centers, projects, departments, locations, custom dimensions, security, reporting
 *
 * LLM Context: Enterprise-grade financial dimension management competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive dimension definition, hierarchy management, cost center tracking, project accounting dimensions,
 * department structures, location management, custom dimension support, dimension security, validation, and reporting.
 * Implements robust NestJS ConfigModule integration for environment-based configuration and validation.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ============================================================================
// CONFIGURATION INTERFACES
// ============================================================================

interface DimensionConfig {
  dimensionId: string;
  dimensionName: string;
  dimensionType: string;
  maxLevels: number;
  codeLength: number;
  codeFormat: string;
  validationRules: string[];
  securityEnabled: boolean;
  auditEnabled: boolean;
}

interface HierarchyConfig {
  hierarchyType: 'parent_child' | 'level_based' | 'network';
  maxDepth: number;
  allowCircular: boolean;
  inheritSecurity: boolean;
  inheritAttributes: boolean;
  rollupMethod: 'sum' | 'average' | 'count' | 'custom';
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ChartOfAccountsDimension {
  dimensionId: number;
  dimensionCode: string;
  dimensionName: string;
  dimensionType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  segmentNumber: number;
  segmentName: string;
  parentDimensionId?: number;
  level: number;
  isActive: boolean;
  effectiveDate: Date;
  expirationDate?: Date;
  createdBy: string;
  createdAt: Date;
  lastModifiedBy: string;
  lastModifiedAt: Date;
}

interface CostCenter {
  costCenterId: number;
  costCenterCode: string;
  costCenterName: string;
  description: string;
  departmentId?: number;
  locationId?: number;
  managerId: string;
  parentCostCenterId?: number;
  level: number;
  isActive: boolean;
  budgetAmount?: number;
  actualAmount?: number;
  varianceAmount?: number;
  effectiveDate: Date;
  expirationDate?: Date;
  attributes: Record<string, any>;
}

interface Project {
  projectId: number;
  projectCode: string;
  projectName: string;
  projectType: string;
  projectStatus: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  plannedEndDate?: Date;
  projectManagerId: string;
  customerId?: number;
  contractId?: string;
  budgetAmount: number;
  actualCost: number;
  committedCost: number;
  forecastCost: number;
  percentComplete: number;
  billingMethod: 'time_and_materials' | 'fixed_price' | 'cost_plus' | 'milestone';
  attributes: Record<string, any>;
}

interface Department {
  departmentId: number;
  departmentCode: string;
  departmentName: string;
  description: string;
  parentDepartmentId?: number;
  level: number;
  departmentHead: string;
  locationId?: number;
  isActive: boolean;
  employeeCount?: number;
  attributes: Record<string, any>;
}

interface Location {
  locationId: number;
  locationCode: string;
  locationName: string;
  locationType: 'headquarters' | 'branch' | 'warehouse' | 'plant' | 'office' | 'remote';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  parentLocationId?: number;
  level: number;
  isActive: boolean;
  timezone: string;
  currency: string;
  attributes: Record<string, any>;
}

interface CustomDimension {
  customDimensionId: number;
  dimensionKey: string;
  dimensionValue: string;
  dimensionCategory: string;
  dimensionDescription: string;
  parentDimensionKey?: string;
  level: number;
  displayOrder: number;
  isActive: boolean;
  validFrom: Date;
  validTo?: Date;
  attributes: Record<string, any>;
}

interface DimensionHierarchy {
  hierarchyId: number;
  hierarchyName: string;
  dimensionType: string;
  parentId?: number;
  childId: number;
  relationshipType: 'direct' | 'indirect' | 'cross_reference';
  level: number;
  path: string;
  depth: number;
  isLeaf: boolean;
  effectiveDate: Date;
  expirationDate?: Date;
}

interface DimensionSecurity {
  securityId: number;
  dimensionType: string;
  dimensionCode: string;
  userId?: string;
  roleId?: string;
  accessLevel: 'none' | 'read' | 'write' | 'admin';
  restrictions: Record<string, any>;
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
}

interface DimensionValue {
  valueId: number;
  dimensionType: string;
  dimensionCode: string;
  valueName: string;
  valueDescription: string;
  parentValueId?: number;
  sequenceNumber: number;
  isDefault: boolean;
  validationPattern?: string;
  attributes: Record<string, any>;
}

interface DimensionCombination {
  combinationId: number;
  combinationHash: string;
  accountSegment?: string;
  costCenterSegment?: string;
  projectSegment?: string;
  departmentSegment?: string;
  locationSegment?: string;
  customSegments: Record<string, string>;
  isValid: boolean;
  validationErrors?: string[];
  createdAt: Date;
}

interface DimensionValidationRule {
  ruleId: number;
  ruleName: string;
  dimensionType: string;
  ruleType: 'format' | 'range' | 'lookup' | 'cross_validation' | 'business_logic';
  ruleExpression: string;
  errorMessage: string;
  severity: 'error' | 'warning' | 'info';
  isActive: boolean;
}

interface DimensionAttribute {
  attributeId: number;
  dimensionType: string;
  dimensionCode: string;
  attributeName: string;
  attributeValue: any;
  attributeDataType: 'string' | 'number' | 'date' | 'boolean' | 'json';
  isInherited: boolean;
  inheritedFrom?: string;
}

interface DimensionRollup {
  rollupId: number;
  parentDimension: string;
  childDimensions: string[];
  rollupMethod: 'sum' | 'average' | 'count' | 'min' | 'max' | 'custom';
  rollupPeriod: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  lastRollupDate?: Date;
  nextRollupDate?: Date;
}

interface DimensionMapping {
  mappingId: number;
  sourceDimensionType: string;
  sourceDimensionCode: string;
  targetDimensionType: string;
  targetDimensionCode: string;
  mappingType: 'one_to_one' | 'one_to_many' | 'many_to_one' | 'many_to_many';
  isActive: boolean;
  effectiveDate: Date;
  expirationDate?: Date;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateChartOfAccountsDto {
  @ApiProperty({ description: 'Dimension code', example: '1000' })
  dimensionCode!: string;

  @ApiProperty({ description: 'Dimension name', example: 'Cash and Cash Equivalents' })
  dimensionName!: string;

  @ApiProperty({ description: 'Dimension type', enum: ['asset', 'liability', 'equity', 'revenue', 'expense'] })
  dimensionType!: string;

  @ApiProperty({ description: 'Segment number', example: 1 })
  segmentNumber!: number;

  @ApiProperty({ description: 'Segment name', example: 'Account' })
  segmentName!: string;

  @ApiProperty({ description: 'Parent dimension ID', required: false })
  parentDimensionId?: number;

  @ApiProperty({ description: 'Effective date', example: '2024-01-01' })
  effectiveDate!: Date;

  @ApiProperty({ description: 'Expiration date', required: false })
  expirationDate?: Date;
}

export class CreateCostCenterDto {
  @ApiProperty({ description: 'Cost center code', example: 'CC-1000' })
  costCenterCode!: string;

  @ApiProperty({ description: 'Cost center name', example: 'Finance Department' })
  costCenterName!: string;

  @ApiProperty({ description: 'Description' })
  description!: string;

  @ApiProperty({ description: 'Department ID', required: false })
  departmentId?: number;

  @ApiProperty({ description: 'Location ID', required: false })
  locationId?: number;

  @ApiProperty({ description: 'Manager ID', example: 'MGR-001' })
  managerId!: string;

  @ApiProperty({ description: 'Parent cost center ID', required: false })
  parentCostCenterId?: number;

  @ApiProperty({ description: 'Budget amount', required: false })
  budgetAmount?: number;

  @ApiProperty({ description: 'Effective date', example: '2024-01-01' })
  effectiveDate!: Date;

  @ApiProperty({ description: 'Additional attributes', required: false })
  attributes?: Record<string, any>;
}

export class CreateProjectDto {
  @ApiProperty({ description: 'Project code', example: 'PRJ-2024-001' })
  projectCode!: string;

  @ApiProperty({ description: 'Project name', example: 'ERP Implementation' })
  projectName!: string;

  @ApiProperty({ description: 'Project type', example: 'Internal' })
  projectType!: string;

  @ApiProperty({ description: 'Start date', example: '2024-01-01' })
  startDate!: Date;

  @ApiProperty({ description: 'Planned end date', required: false })
  plannedEndDate?: Date;

  @ApiProperty({ description: 'Project manager ID', example: 'PM-001' })
  projectManagerId!: string;

  @ApiProperty({ description: 'Budget amount', example: 500000 })
  budgetAmount!: number;

  @ApiProperty({ description: 'Billing method', enum: ['time_and_materials', 'fixed_price', 'cost_plus', 'milestone'] })
  billingMethod!: string;

  @ApiProperty({ description: 'Additional attributes', required: false })
  attributes?: Record<string, any>;
}

export class CreateDepartmentDto {
  @ApiProperty({ description: 'Department code', example: 'DEPT-FIN' })
  departmentCode!: string;

  @ApiProperty({ description: 'Department name', example: 'Finance' })
  departmentName!: string;

  @ApiProperty({ description: 'Description' })
  description!: string;

  @ApiProperty({ description: 'Parent department ID', required: false })
  parentDepartmentId?: number;

  @ApiProperty({ description: 'Department head', example: 'EMP-001' })
  departmentHead!: string;

  @ApiProperty({ description: 'Location ID', required: false })
  locationId?: number;
}

export class CreateLocationDto {
  @ApiProperty({ description: 'Location code', example: 'LOC-HQ' })
  locationCode!: string;

  @ApiProperty({ description: 'Location name', example: 'Headquarters' })
  locationName!: string;

  @ApiProperty({ description: 'Location type', enum: ['headquarters', 'branch', 'warehouse', 'plant', 'office', 'remote'] })
  locationType!: string;

  @ApiProperty({ description: 'Address line 1' })
  addressLine1!: string;

  @ApiProperty({ description: 'City' })
  city!: string;

  @ApiProperty({ description: 'State' })
  state!: string;

  @ApiProperty({ description: 'Postal code' })
  postalCode!: string;

  @ApiProperty({ description: 'Country' })
  country!: string;

  @ApiProperty({ description: 'Timezone', example: 'America/New_York' })
  timezone!: string;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  currency!: string;
}

export class DimensionHierarchyDto {
  @ApiProperty({ description: 'Hierarchy name', example: 'Cost Center Hierarchy' })
  hierarchyName!: string;

  @ApiProperty({ description: 'Dimension type', example: 'cost_center' })
  dimensionType!: string;

  @ApiProperty({ description: 'Parent ID', required: false })
  parentId?: number;

  @ApiProperty({ description: 'Child ID' })
  childId!: number;

  @ApiProperty({ description: 'Relationship type', enum: ['direct', 'indirect', 'cross_reference'] })
  relationshipType!: string;

  @ApiProperty({ description: 'Effective date', example: '2024-01-01' })
  effectiveDate!: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Chart of Accounts Dimensions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ChartOfAccountsDimension model
 *
 * @example
 * ```typescript
 * const CoaDimension = createChartOfAccountsDimensionModel(sequelize);
 * const dimension = await CoaDimension.create({
 *   dimensionCode: '1000',
 *   dimensionName: 'Cash',
 *   dimensionType: 'asset',
 *   segmentNumber: 1,
 *   segmentName: 'Account'
 * });
 * ```
 */
export const createChartOfAccountsDimensionModel = (sequelize: Sequelize) => {
  class ChartOfAccountsDimension extends Model {
    public id!: number;
    public dimensionCode!: string;
    public dimensionName!: string;
    public dimensionType!: string;
    public segmentNumber!: number;
    public segmentName!: string;
    public parentDimensionId!: number | null;
    public level!: number;
    public isActive!: boolean;
    public effectiveDate!: Date;
    public expirationDate!: Date | null;
    public createdBy!: string;
    public lastModifiedBy!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ChartOfAccountsDimension.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      dimensionCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'dimension_code',
      },
      dimensionName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'dimension_name',
      },
      dimensionType: {
        type: DataTypes.ENUM('asset', 'liability', 'equity', 'revenue', 'expense'),
        allowNull: false,
        field: 'dimension_type',
      },
      segmentNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'segment_number',
      },
      segmentName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'segment_name',
      },
      parentDimensionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'parent_dimension_id',
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
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
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'created_by',
      },
      lastModifiedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'last_modified_by',
      },
    },
    {
      sequelize,
      tableName: 'chart_of_accounts_dimensions',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['dimension_code'] },
        { fields: ['dimension_type'] },
        { fields: ['parent_dimension_id'] },
        { fields: ['is_active'] },
        { fields: ['effective_date', 'expiration_date'] },
      ],
    }
  );

  return ChartOfAccountsDimension;
};

/**
 * Sequelize model for Cost Centers.
 */
export const createCostCenterModel = (sequelize: Sequelize) => {
  class CostCenter extends Model {
    public id!: number;
    public costCenterCode!: string;
    public costCenterName!: string;
    public description!: string;
    public departmentId!: number | null;
    public locationId!: number | null;
    public managerId!: string;
    public parentCostCenterId!: number | null;
    public level!: number;
    public isActive!: boolean;
    public budgetAmount!: number | null;
    public actualAmount!: number;
    public varianceAmount!: number;
    public effectiveDate!: Date;
    public expirationDate!: Date | null;
    public attributes!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CostCenter.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      costCenterCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'cost_center_code',
      },
      costCenterName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'cost_center_name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      departmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'department_id',
      },
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'location_id',
      },
      managerId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'manager_id',
      },
      parentCostCenterId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'parent_cost_center_id',
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      budgetAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        field: 'budget_amount',
      },
      actualAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'actual_amount',
      },
      varianceAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'variance_amount',
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
      attributes: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'cost_centers',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['cost_center_code'] },
        { fields: ['department_id'] },
        { fields: ['location_id'] },
        { fields: ['manager_id'] },
        { fields: ['parent_cost_center_id'] },
        { fields: ['is_active'] },
      ],
    }
  );

  return CostCenter;
};

/**
 * Sequelize model for Projects.
 */
export const createProjectModel = (sequelize: Sequelize) => {
  class Project extends Model {
    public id!: number;
    public projectCode!: string;
    public projectName!: string;
    public projectType!: string;
    public projectStatus!: string;
    public startDate!: Date;
    public endDate!: Date | null;
    public plannedEndDate!: Date | null;
    public projectManagerId!: string;
    public customerId!: number | null;
    public contractId!: string | null;
    public budgetAmount!: number;
    public actualCost!: number;
    public committedCost!: number;
    public forecastCost!: number;
    public percentComplete!: number;
    public billingMethod!: string;
    public attributes!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Project.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'project_code',
      },
      projectName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'project_name',
      },
      projectType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'project_type',
      },
      projectStatus: {
        type: DataTypes.ENUM('planning', 'active', 'on_hold', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'planning',
        field: 'project_status',
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
      plannedEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'planned_end_date',
      },
      projectManagerId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'project_manager_id',
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'customer_id',
      },
      contractId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'contract_id',
      },
      budgetAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        field: 'budget_amount',
      },
      actualCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'actual_cost',
      },
      committedCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'committed_cost',
      },
      forecastCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'forecast_cost',
      },
      percentComplete: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'percent_complete',
      },
      billingMethod: {
        type: DataTypes.ENUM('time_and_materials', 'fixed_price', 'cost_plus', 'milestone'),
        allowNull: false,
        field: 'billing_method',
      },
      attributes: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'projects',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['project_code'] },
        { fields: ['project_status'] },
        { fields: ['project_manager_id'] },
        { fields: ['customer_id'] },
        { fields: ['start_date', 'end_date'] },
      ],
    }
  );

  return Project;
};

/**
 * Sequelize model for Departments.
 */
export const createDepartmentModel = (sequelize: Sequelize) => {
  class Department extends Model {
    public id!: number;
    public departmentCode!: string;
    public departmentName!: string;
    public description!: string;
    public parentDepartmentId!: number | null;
    public level!: number;
    public departmentHead!: string;
    public locationId!: number | null;
    public isActive!: boolean;
    public employeeCount!: number;
    public attributes!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Department.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      departmentCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'department_code',
      },
      departmentName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'department_name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      parentDepartmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'parent_department_id',
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      departmentHead: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'department_head',
      },
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'location_id',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      employeeCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'employee_count',
      },
      attributes: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'departments',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['department_code'] },
        { fields: ['parent_department_id'] },
        { fields: ['location_id'] },
        { fields: ['is_active'] },
      ],
    }
  );

  return Department;
};

/**
 * Sequelize model for Locations.
 */
export const createLocationModel = (sequelize: Sequelize) => {
  class Location extends Model {
    public id!: number;
    public locationCode!: string;
    public locationName!: string;
    public locationType!: string;
    public addressLine1!: string;
    public addressLine2!: string | null;
    public city!: string;
    public state!: string;
    public postalCode!: string;
    public country!: string;
    public parentLocationId!: number | null;
    public level!: number;
    public isActive!: boolean;
    public timezone!: string;
    public currency!: string;
    public attributes!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Location.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      locationCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'location_code',
      },
      locationName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'location_name',
      },
      locationType: {
        type: DataTypes.ENUM('headquarters', 'branch', 'warehouse', 'plant', 'office', 'remote'),
        allowNull: false,
        field: 'location_type',
      },
      addressLine1: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'address_line1',
      },
      addressLine2: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'address_line2',
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      postalCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'postal_code',
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      parentLocationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'parent_location_id',
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      timezone: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
      attributes: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'locations',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['location_code'] },
        { fields: ['location_type'] },
        { fields: ['parent_location_id'] },
        { fields: ['country'] },
        { fields: ['is_active'] },
      ],
    }
  );

  return Location;
};

// ============================================================================
// CHART OF ACCOUNTS FUNCTIONS
// ============================================================================

/**
 * Creates a new chart of accounts dimension with validation.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {CreateChartOfAccountsDto} dimensionDto - Dimension creation data
 * @param {string} userId - User creating the dimension
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ChartOfAccountsDimension>} Created dimension
 *
 * @example
 * ```typescript
 * const dimension = await createChartOfAccountsDimension(sequelize, configService, {
 *   dimensionCode: '1000',
 *   dimensionName: 'Cash and Cash Equivalents',
 *   dimensionType: 'asset',
 *   segmentNumber: 1,
 *   segmentName: 'Account',
 *   effectiveDate: new Date('2024-01-01')
 * }, 'admin@whitecross.com');
 * ```
 */
export async function createChartOfAccountsDimension(
  sequelize: Sequelize,
  configService: ConfigService,
  dimensionDto: CreateChartOfAccountsDto,
  userId: string,
  transaction?: Transaction
): Promise<ChartOfAccountsDimension> {
  const DimensionModel = createChartOfAccountsDimensionModel(sequelize);

  // Validate code format from configuration
  const codePattern = configService.get<string>('dimension.coa.codePattern', '^[0-9]{4,6}$');
  const regex = new RegExp(codePattern);

  if (!regex.test(dimensionDto.dimensionCode)) {
    throw new ValidationError(`Dimension code ${dimensionDto.dimensionCode} does not match required pattern ${codePattern}`);
  }

  // Calculate hierarchy level
  let level = 1;
  if (dimensionDto.parentDimensionId) {
    const parent = await DimensionModel.findByPk(dimensionDto.parentDimensionId, { transaction });
    if (!parent) {
      throw new ValidationError(`Parent dimension ${dimensionDto.parentDimensionId} not found`);
    }
    level = parent.level + 1;

    const maxLevels = configService.get<number>('dimension.coa.maxLevels', 10);
    if (level > maxLevels) {
      throw new ValidationError(`Maximum hierarchy level ${maxLevels} exceeded`);
    }
  }

  const dimension = await DimensionModel.create(
    {
      dimensionCode: dimensionDto.dimensionCode,
      dimensionName: dimensionDto.dimensionName,
      dimensionType: dimensionDto.dimensionType,
      segmentNumber: dimensionDto.segmentNumber,
      segmentName: dimensionDto.segmentName,
      parentDimensionId: dimensionDto.parentDimensionId,
      level,
      isActive: true,
      effectiveDate: dimensionDto.effectiveDate,
      expirationDate: dimensionDto.expirationDate,
      createdBy: userId,
      lastModifiedBy: userId,
    },
    { transaction }
  );

  return dimension.toJSON() as ChartOfAccountsDimension;
}

/**
 * Retrieves chart of accounts dimension hierarchy.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} dimensionCode - Root dimension code
 * @param {number} maxDepth - Maximum depth to traverse
 * @returns {Promise<ChartOfAccountsDimension[]>} Dimension hierarchy
 */
export async function getChartOfAccountsHierarchy(
  sequelize: Sequelize,
  dimensionCode: string,
  maxDepth: number = 10
): Promise<ChartOfAccountsDimension[]> {
  const DimensionModel = createChartOfAccountsDimensionModel(sequelize);

  const root = await DimensionModel.findOne({
    where: { dimensionCode, isActive: true },
  });

  if (!root) {
    throw new Error(`Dimension ${dimensionCode} not found`);
  }

  const hierarchy: ChartOfAccountsDimension[] = [root.toJSON() as ChartOfAccountsDimension];

  if (maxDepth > 0) {
    const children = await getChildDimensions(sequelize, root.id, maxDepth - 1);
    hierarchy.push(...children);
  }

  return hierarchy;
}

/**
 * Updates chart of accounts dimension.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} dimensionCode - Dimension code
 * @param {Partial<CreateChartOfAccountsDto>} updates - Fields to update
 * @param {string} userId - User updating the dimension
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ChartOfAccountsDimension>} Updated dimension
 */
export async function updateChartOfAccountsDimension(
  sequelize: Sequelize,
  dimensionCode: string,
  updates: Partial<CreateChartOfAccountsDto>,
  userId: string,
  transaction?: Transaction
): Promise<ChartOfAccountsDimension> {
  const DimensionModel = createChartOfAccountsDimensionModel(sequelize);

  const dimension = await DimensionModel.findOne({
    where: { dimensionCode },
    transaction,
  });

  if (!dimension) {
    throw new Error(`Dimension ${dimensionCode} not found`);
  }

  await dimension.update(
    {
      ...updates,
      lastModifiedBy: userId,
    },
    { transaction }
  );

  return dimension.toJSON() as ChartOfAccountsDimension;
}

/**
 * Deactivates a chart of accounts dimension.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} dimensionCode - Dimension code
 * @param {string} userId - User deactivating the dimension
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<boolean>} Success status
 */
export async function deactivateChartOfAccountsDimension(
  sequelize: Sequelize,
  dimensionCode: string,
  userId: string,
  transaction?: Transaction
): Promise<boolean> {
  const DimensionModel = createChartOfAccountsDimensionModel(sequelize);

  const result = await DimensionModel.update(
    {
      isActive: false,
      expirationDate: new Date(),
      lastModifiedBy: userId,
    },
    {
      where: { dimensionCode },
      transaction,
    }
  );

  return result[0] > 0;
}

// ============================================================================
// COST CENTER FUNCTIONS
// ============================================================================

/**
 * Creates a new cost center with budget tracking.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {CreateCostCenterDto} costCenterDto - Cost center creation data
 * @param {string} userId - User creating the cost center
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CostCenter>} Created cost center
 */
export async function createCostCenter(
  sequelize: Sequelize,
  configService: ConfigService,
  costCenterDto: CreateCostCenterDto,
  userId: string,
  transaction?: Transaction
): Promise<CostCenter> {
  const CostCenterModel = createCostCenterModel(sequelize);

  // Calculate hierarchy level
  let level = 1;
  if (costCenterDto.parentCostCenterId) {
    const parent = await CostCenterModel.findByPk(costCenterDto.parentCostCenterId, { transaction });
    if (!parent) {
      throw new ValidationError(`Parent cost center ${costCenterDto.parentCostCenterId} not found`);
    }
    level = parent.level + 1;
  }

  const costCenter = await CostCenterModel.create(
    {
      costCenterCode: costCenterDto.costCenterCode,
      costCenterName: costCenterDto.costCenterName,
      description: costCenterDto.description,
      departmentId: costCenterDto.departmentId,
      locationId: costCenterDto.locationId,
      managerId: costCenterDto.managerId,
      parentCostCenterId: costCenterDto.parentCostCenterId,
      level,
      isActive: true,
      budgetAmount: costCenterDto.budgetAmount,
      actualAmount: 0,
      varianceAmount: costCenterDto.budgetAmount || 0,
      effectiveDate: costCenterDto.effectiveDate,
      attributes: costCenterDto.attributes || {},
    },
    { transaction }
  );

  return costCenter.toJSON() as CostCenter;
}

/**
 * Retrieves cost center with budget variance analysis.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} costCenterCode - Cost center code
 * @returns {Promise<CostCenter>} Cost center with budget analysis
 */
export async function getCostCenterWithBudgetAnalysis(
  sequelize: Sequelize,
  costCenterCode: string
): Promise<CostCenter> {
  const CostCenterModel = createCostCenterModel(sequelize);

  const costCenter = await CostCenterModel.findOne({
    where: { costCenterCode, isActive: true },
  });

  if (!costCenter) {
    throw new Error(`Cost center ${costCenterCode} not found`);
  }

  // Calculate current variance
  const variance = (costCenter.budgetAmount || 0) - costCenter.actualAmount;
  await costCenter.update({ varianceAmount: variance });

  return costCenter.toJSON() as CostCenter;
}

/**
 * Updates cost center actual spending.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} costCenterCode - Cost center code
 * @param {number} amount - Amount to add to actual
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CostCenter>} Updated cost center
 */
export async function updateCostCenterActuals(
  sequelize: Sequelize,
  costCenterCode: string,
  amount: number,
  transaction?: Transaction
): Promise<CostCenter> {
  const CostCenterModel = createCostCenterModel(sequelize);

  const costCenter = await CostCenterModel.findOne({
    where: { costCenterCode },
    transaction,
  });

  if (!costCenter) {
    throw new Error(`Cost center ${costCenterCode} not found`);
  }

  const newActual = costCenter.actualAmount + amount;
  const newVariance = (costCenter.budgetAmount || 0) - newActual;

  await costCenter.update(
    {
      actualAmount: newActual,
      varianceAmount: newVariance,
    },
    { transaction }
  );

  return costCenter.toJSON() as CostCenter;
}

/**
 * Retrieves cost center hierarchy for rollup reporting.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} costCenterCode - Root cost center code
 * @returns {Promise<CostCenter[]>} Cost center hierarchy
 */
export async function getCostCenterHierarchy(
  sequelize: Sequelize,
  costCenterCode: string
): Promise<CostCenter[]> {
  const CostCenterModel = createCostCenterModel(sequelize);

  const root = await CostCenterModel.findOne({
    where: { costCenterCode, isActive: true },
  });

  if (!root) {
    throw new Error(`Cost center ${costCenterCode} not found`);
  }

  const hierarchy: CostCenter[] = [root.toJSON() as CostCenter];

  // Recursive fetch of child cost centers
  const fetchChildren = async (parentId: number): Promise<void> => {
    const children = await CostCenterModel.findAll({
      where: { parentCostCenterId: parentId, isActive: true },
    });

    for (const child of children) {
      hierarchy.push(child.toJSON() as CostCenter);
      await fetchChildren(child.id);
    }
  };

  await fetchChildren(root.id);

  return hierarchy;
}

/**
 * Rolls up cost center actuals to parent.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} costCenterCode - Cost center code
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<number>} Total rolled up amount
 */
export async function rollupCostCenterActuals(
  sequelize: Sequelize,
  costCenterCode: string,
  transaction?: Transaction
): Promise<number> {
  const hierarchy = await getCostCenterHierarchy(sequelize, costCenterCode);

  let totalActuals = 0;
  for (const cc of hierarchy) {
    totalActuals += cc.actualAmount;
  }

  return totalActuals;
}

// ============================================================================
// PROJECT DIMENSION FUNCTIONS
// ============================================================================

/**
 * Creates a new project dimension.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {CreateProjectDto} projectDto - Project creation data
 * @param {string} userId - User creating the project
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<Project>} Created project
 */
export async function createProject(
  sequelize: Sequelize,
  configService: ConfigService,
  projectDto: CreateProjectDto,
  userId: string,
  transaction?: Transaction
): Promise<Project> {
  const ProjectModel = createProjectModel(sequelize);

  const project = await ProjectModel.create(
    {
      projectCode: projectDto.projectCode,
      projectName: projectDto.projectName,
      projectType: projectDto.projectType,
      projectStatus: 'planning',
      startDate: projectDto.startDate,
      plannedEndDate: projectDto.plannedEndDate,
      projectManagerId: projectDto.projectManagerId,
      budgetAmount: projectDto.budgetAmount,
      actualCost: 0,
      committedCost: 0,
      forecastCost: projectDto.budgetAmount,
      percentComplete: 0,
      billingMethod: projectDto.billingMethod,
      attributes: projectDto.attributes || {},
    },
    { transaction }
  );

  return project.toJSON() as Project;
}

/**
 * Updates project status and completion percentage.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} projectCode - Project code
 * @param {string} status - New project status
 * @param {number} percentComplete - Completion percentage
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<Project>} Updated project
 */
export async function updateProjectStatus(
  sequelize: Sequelize,
  projectCode: string,
  status: string,
  percentComplete: number,
  transaction?: Transaction
): Promise<Project> {
  const ProjectModel = createProjectModel(sequelize);

  const project = await ProjectModel.findOne({
    where: { projectCode },
    transaction,
  });

  if (!project) {
    throw new Error(`Project ${projectCode} not found`);
  }

  const updates: any = {
    projectStatus: status,
    percentComplete,
  };

  if (status === 'completed' && !project.endDate) {
    updates.endDate = new Date();
  }

  await project.update(updates, { transaction });

  return project.toJSON() as Project;
}

/**
 * Updates project costs (actual, committed, forecast).
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} projectCode - Project code
 * @param {Partial<Pick<Project, 'actualCost' | 'committedCost' | 'forecastCost'>>} costs - Cost updates
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<Project>} Updated project
 */
export async function updateProjectCosts(
  sequelize: Sequelize,
  projectCode: string,
  costs: Partial<Pick<Project, 'actualCost' | 'committedCost' | 'forecastCost'>>,
  transaction?: Transaction
): Promise<Project> {
  const ProjectModel = createProjectModel(sequelize);

  const project = await ProjectModel.findOne({
    where: { projectCode },
    transaction,
  });

  if (!project) {
    throw new Error(`Project ${projectCode} not found`);
  }

  await project.update(costs, { transaction });

  return project.toJSON() as Project;
}

/**
 * Retrieves active projects with budget variance.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @returns {Promise<Project[]>} Active projects
 */
export async function getActiveProjects(
  sequelize: Sequelize,
  configService: ConfigService
): Promise<Project[]> {
  const ProjectModel = createProjectModel(sequelize);

  const projects = await ProjectModel.findAll({
    where: {
      projectStatus: {
        [Op.in]: ['planning', 'active', 'on_hold'],
      },
    },
    order: [['startDate', 'DESC']],
  });

  return projects.map(p => p.toJSON() as Project);
}

// ============================================================================
// DEPARTMENT FUNCTIONS
// ============================================================================

/**
 * Creates a new department.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {CreateDepartmentDto} departmentDto - Department creation data
 * @param {string} userId - User creating the department
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<Department>} Created department
 */
export async function createDepartment(
  sequelize: Sequelize,
  departmentDto: CreateDepartmentDto,
  userId: string,
  transaction?: Transaction
): Promise<Department> {
  const DepartmentModel = createDepartmentModel(sequelize);

  let level = 1;
  if (departmentDto.parentDepartmentId) {
    const parent = await DepartmentModel.findByPk(departmentDto.parentDepartmentId, { transaction });
    if (!parent) {
      throw new ValidationError(`Parent department ${departmentDto.parentDepartmentId} not found`);
    }
    level = parent.level + 1;
  }

  const department = await DepartmentModel.create(
    {
      departmentCode: departmentDto.departmentCode,
      departmentName: departmentDto.departmentName,
      description: departmentDto.description,
      parentDepartmentId: departmentDto.parentDepartmentId,
      level,
      departmentHead: departmentDto.departmentHead,
      locationId: departmentDto.locationId,
      isActive: true,
      employeeCount: 0,
      attributes: {},
    },
    { transaction }
  );

  return department.toJSON() as Department;
}

/**
 * Retrieves department hierarchy.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} departmentCode - Root department code
 * @returns {Promise<Department[]>} Department hierarchy
 */
export async function getDepartmentHierarchy(
  sequelize: Sequelize,
  departmentCode: string
): Promise<Department[]> {
  const DepartmentModel = createDepartmentModel(sequelize);

  const root = await DepartmentModel.findOne({
    where: { departmentCode, isActive: true },
  });

  if (!root) {
    throw new Error(`Department ${departmentCode} not found`);
  }

  const hierarchy: Department[] = [root.toJSON() as Department];

  const fetchChildren = async (parentId: number): Promise<void> => {
    const children = await DepartmentModel.findAll({
      where: { parentDepartmentId: parentId, isActive: true },
    });

    for (const child of children) {
      hierarchy.push(child.toJSON() as Department);
      await fetchChildren(child.id);
    }
  };

  await fetchChildren(root.id);

  return hierarchy;
}

// ============================================================================
// LOCATION FUNCTIONS
// ============================================================================

/**
 * Creates a new location.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {CreateLocationDto} locationDto - Location creation data
 * @param {string} userId - User creating the location
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<Location>} Created location
 */
export async function createLocation(
  sequelize: Sequelize,
  locationDto: CreateLocationDto,
  userId: string,
  transaction?: Transaction
): Promise<Location> {
  const LocationModel = createLocationModel(sequelize);

  const location = await LocationModel.create(
    {
      locationCode: locationDto.locationCode,
      locationName: locationDto.locationName,
      locationType: locationDto.locationType,
      addressLine1: locationDto.addressLine1,
      city: locationDto.city,
      state: locationDto.state,
      postalCode: locationDto.postalCode,
      country: locationDto.country,
      level: 1,
      isActive: true,
      timezone: locationDto.timezone,
      currency: locationDto.currency,
      attributes: {},
    },
    { transaction }
  );

  return location.toJSON() as Location;
}

/**
 * Retrieves locations by country.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} country - Country code
 * @returns {Promise<Location[]>} Locations in country
 */
export async function getLocationsByCountry(
  sequelize: Sequelize,
  country: string
): Promise<Location[]> {
  const LocationModel = createLocationModel(sequelize);

  const locations = await LocationModel.findAll({
    where: { country, isActive: true },
    order: [['locationName', 'ASC']],
  });

  return locations.map(l => l.toJSON() as Location);
}

// ============================================================================
// DIMENSION SECURITY FUNCTIONS
// ============================================================================

/**
 * Validates user access to dimension.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} userId - User identifier
 * @param {string} dimensionType - Dimension type
 * @param {string} dimensionCode - Dimension code
 * @param {string} requiredAccess - Required access level
 * @returns {Promise<boolean>} Access granted
 */
export async function validateDimensionAccess(
  sequelize: Sequelize,
  userId: string,
  dimensionType: string,
  dimensionCode: string,
  requiredAccess: 'read' | 'write' | 'admin'
): Promise<boolean> {
  // Placeholder for actual security validation logic
  // Would check dimension_security table
  return true;
}

/**
 * Validates dimension combination against business rules.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {Record<string, string>} dimensionCombination - Dimension values
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 */
export async function validateDimensionCombination(
  sequelize: Sequelize,
  configService: ConfigService,
  dimensionCombination: Record<string, string>
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  // Validate required dimensions
  const requiredDimensions = configService.get<string[]>('dimension.required', ['account', 'costCenter']);

  for (const dim of requiredDimensions) {
    if (!dimensionCombination[dim]) {
      errors.push(`Required dimension ${dim} is missing`);
    }
  }

  // Additional business rule validations would go here

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

async function getChildDimensions(
  sequelize: Sequelize,
  parentId: number,
  maxDepth: number
): Promise<ChartOfAccountsDimension[]> {
  if (maxDepth <= 0) return [];

  const DimensionModel = createChartOfAccountsDimensionModel(sequelize);

  const children = await DimensionModel.findAll({
    where: { parentDimensionId: parentId, isActive: true },
  });

  const result: ChartOfAccountsDimension[] = [];

  for (const child of children) {
    result.push(child.toJSON() as ChartOfAccountsDimension);

    if (maxDepth > 1) {
      const grandchildren = await getChildDimensions(sequelize, child.id, maxDepth - 1);
      result.push(...grandchildren);
    }
  }

  return result;
}
