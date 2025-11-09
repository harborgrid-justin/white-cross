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
import { Sequelize, Transaction } from 'sequelize';
import { ConfigService } from '@nestjs/config';
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
export declare class CreateChartOfAccountsDto {
    dimensionCode: string;
    dimensionName: string;
    dimensionType: string;
    segmentNumber: number;
    segmentName: string;
    parentDimensionId?: number;
    effectiveDate: Date;
    expirationDate?: Date;
}
export declare class CreateCostCenterDto {
    costCenterCode: string;
    costCenterName: string;
    description: string;
    departmentId?: number;
    locationId?: number;
    managerId: string;
    parentCostCenterId?: number;
    budgetAmount?: number;
    effectiveDate: Date;
    attributes?: Record<string, any>;
}
export declare class CreateProjectDto {
    projectCode: string;
    projectName: string;
    projectType: string;
    startDate: Date;
    plannedEndDate?: Date;
    projectManagerId: string;
    budgetAmount: number;
    billingMethod: string;
    attributes?: Record<string, any>;
}
export declare class CreateDepartmentDto {
    departmentCode: string;
    departmentName: string;
    description: string;
    parentDepartmentId?: number;
    departmentHead: string;
    locationId?: number;
}
export declare class CreateLocationDto {
    locationCode: string;
    locationName: string;
    locationType: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    timezone: string;
    currency: string;
}
export declare class DimensionHierarchyDto {
    hierarchyName: string;
    dimensionType: string;
    parentId?: number;
    childId: number;
    relationshipType: string;
    effectiveDate: Date;
}
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
export declare const createChartOfAccountsDimensionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        dimensionCode: string;
        dimensionName: string;
        dimensionType: string;
        segmentNumber: number;
        segmentName: string;
        parentDimensionId: number | null;
        level: number;
        isActive: boolean;
        effectiveDate: Date;
        expirationDate: Date | null;
        createdBy: string;
        lastModifiedBy: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Cost Centers.
 */
export declare const createCostCenterModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        costCenterCode: string;
        costCenterName: string;
        description: string;
        departmentId: number | null;
        locationId: number | null;
        managerId: string;
        parentCostCenterId: number | null;
        level: number;
        isActive: boolean;
        budgetAmount: number | null;
        actualAmount: number;
        varianceAmount: number;
        effectiveDate: Date;
        expirationDate: Date | null;
        attributes: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Projects.
 */
export declare const createProjectModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        projectCode: string;
        projectName: string;
        projectType: string;
        projectStatus: string;
        startDate: Date;
        endDate: Date | null;
        plannedEndDate: Date | null;
        projectManagerId: string;
        customerId: number | null;
        contractId: string | null;
        budgetAmount: number;
        actualCost: number;
        committedCost: number;
        forecastCost: number;
        percentComplete: number;
        billingMethod: string;
        attributes: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Departments.
 */
export declare const createDepartmentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        departmentCode: string;
        departmentName: string;
        description: string;
        parentDepartmentId: number | null;
        level: number;
        departmentHead: string;
        locationId: number | null;
        isActive: boolean;
        employeeCount: number;
        attributes: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Locations.
 */
export declare const createLocationModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        locationCode: string;
        locationName: string;
        locationType: string;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        parentLocationId: number | null;
        level: number;
        isActive: boolean;
        timezone: string;
        currency: string;
        attributes: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
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
export declare function createChartOfAccountsDimension(sequelize: Sequelize, configService: ConfigService, dimensionDto: CreateChartOfAccountsDto, userId: string, transaction?: Transaction): Promise<ChartOfAccountsDimension>;
/**
 * Retrieves chart of accounts dimension hierarchy.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} dimensionCode - Root dimension code
 * @param {number} maxDepth - Maximum depth to traverse
 * @returns {Promise<ChartOfAccountsDimension[]>} Dimension hierarchy
 */
export declare function getChartOfAccountsHierarchy(sequelize: Sequelize, dimensionCode: string, maxDepth?: number): Promise<ChartOfAccountsDimension[]>;
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
export declare function updateChartOfAccountsDimension(sequelize: Sequelize, dimensionCode: string, updates: Partial<CreateChartOfAccountsDto>, userId: string, transaction?: Transaction): Promise<ChartOfAccountsDimension>;
/**
 * Deactivates a chart of accounts dimension.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} dimensionCode - Dimension code
 * @param {string} userId - User deactivating the dimension
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<boolean>} Success status
 */
export declare function deactivateChartOfAccountsDimension(sequelize: Sequelize, dimensionCode: string, userId: string, transaction?: Transaction): Promise<boolean>;
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
export declare function createCostCenter(sequelize: Sequelize, configService: ConfigService, costCenterDto: CreateCostCenterDto, userId: string, transaction?: Transaction): Promise<CostCenter>;
/**
 * Retrieves cost center with budget variance analysis.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} costCenterCode - Cost center code
 * @returns {Promise<CostCenter>} Cost center with budget analysis
 */
export declare function getCostCenterWithBudgetAnalysis(sequelize: Sequelize, costCenterCode: string): Promise<CostCenter>;
/**
 * Updates cost center actual spending.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} costCenterCode - Cost center code
 * @param {number} amount - Amount to add to actual
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<CostCenter>} Updated cost center
 */
export declare function updateCostCenterActuals(sequelize: Sequelize, costCenterCode: string, amount: number, transaction?: Transaction): Promise<CostCenter>;
/**
 * Retrieves cost center hierarchy for rollup reporting.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} costCenterCode - Root cost center code
 * @returns {Promise<CostCenter[]>} Cost center hierarchy
 */
export declare function getCostCenterHierarchy(sequelize: Sequelize, costCenterCode: string): Promise<CostCenter[]>;
/**
 * Rolls up cost center actuals to parent.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} costCenterCode - Cost center code
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<number>} Total rolled up amount
 */
export declare function rollupCostCenterActuals(sequelize: Sequelize, costCenterCode: string, transaction?: Transaction): Promise<number>;
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
export declare function createProject(sequelize: Sequelize, configService: ConfigService, projectDto: CreateProjectDto, userId: string, transaction?: Transaction): Promise<Project>;
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
export declare function updateProjectStatus(sequelize: Sequelize, projectCode: string, status: string, percentComplete: number, transaction?: Transaction): Promise<Project>;
/**
 * Updates project costs (actual, committed, forecast).
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} projectCode - Project code
 * @param {Partial<Pick<Project, 'actualCost' | 'committedCost' | 'forecastCost'>>} costs - Cost updates
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<Project>} Updated project
 */
export declare function updateProjectCosts(sequelize: Sequelize, projectCode: string, costs: Partial<Pick<Project, 'actualCost' | 'committedCost' | 'forecastCost'>>, transaction?: Transaction): Promise<Project>;
/**
 * Retrieves active projects with budget variance.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @returns {Promise<Project[]>} Active projects
 */
export declare function getActiveProjects(sequelize: Sequelize, configService: ConfigService): Promise<Project[]>;
/**
 * Creates a new department.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {CreateDepartmentDto} departmentDto - Department creation data
 * @param {string} userId - User creating the department
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<Department>} Created department
 */
export declare function createDepartment(sequelize: Sequelize, departmentDto: CreateDepartmentDto, userId: string, transaction?: Transaction): Promise<Department>;
/**
 * Retrieves department hierarchy.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} departmentCode - Root department code
 * @returns {Promise<Department[]>} Department hierarchy
 */
export declare function getDepartmentHierarchy(sequelize: Sequelize, departmentCode: string): Promise<Department[]>;
/**
 * Creates a new location.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {CreateLocationDto} locationDto - Location creation data
 * @param {string} userId - User creating the location
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<Location>} Created location
 */
export declare function createLocation(sequelize: Sequelize, locationDto: CreateLocationDto, userId: string, transaction?: Transaction): Promise<Location>;
/**
 * Retrieves locations by country.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} country - Country code
 * @returns {Promise<Location[]>} Locations in country
 */
export declare function getLocationsByCountry(sequelize: Sequelize, country: string): Promise<Location[]>;
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
export declare function validateDimensionAccess(sequelize: Sequelize, userId: string, dimensionType: string, dimensionCode: string, requiredAccess: 'read' | 'write' | 'admin'): Promise<boolean>;
/**
 * Validates dimension combination against business rules.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {Record<string, string>} dimensionCombination - Dimension values
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 */
export declare function validateDimensionCombination(sequelize: Sequelize, configService: ConfigService, dimensionCombination: Record<string, string>): Promise<{
    valid: boolean;
    errors: string[];
}>;
export {};
//# sourceMappingURL=dimension-management-kit.d.ts.map