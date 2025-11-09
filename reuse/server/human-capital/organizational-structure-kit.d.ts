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
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Organization unit type enumeration
 */
export declare enum OrgUnitType {
    COMPANY = "company",
    DIVISION = "division",
    DEPARTMENT = "department",
    UNIT = "unit",
    TEAM = "team",
    COST_CENTER = "cost_center",
    LOCATION = "location",
    PROJECT = "project"
}
/**
 * Organization unit status
 */
export declare enum OrgUnitStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending",
    CLOSED = "closed",
    MERGED = "merged",
    SPLIT = "split"
}
/**
 * Reporting relationship type
 */
export declare enum ReportingType {
    DIRECT = "direct",
    DOTTED_LINE = "dotted_line",
    MATRIX = "matrix",
    FUNCTIONAL = "functional",
    ADMINISTRATIVE = "administrative"
}
/**
 * Location type
 */
export declare enum LocationType {
    HEADQUARTERS = "headquarters",
    OFFICE = "office",
    BRANCH = "branch",
    FACILITY = "facility",
    HOSPITAL = "hospital",
    CLINIC = "clinic",
    WAREHOUSE = "warehouse",
    REMOTE = "remote"
}
/**
 * Reorganization type
 */
export declare enum ReorganizationType {
    MERGER = "merger",
    SPLIT = "split",
    RESTRUCTURE = "restructure",
    ACQUISITION = "acquisition",
    DIVESTITURE = "divestiture",
    CONSOLIDATION = "consolidation"
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
    path: string;
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
    monday?: {
        open: string;
        close: string;
    };
    tuesday?: {
        open: string;
        close: string;
    };
    wednesday?: {
        open: string;
        close: string;
    };
    thursday?: {
        open: string;
        close: string;
    };
    friday?: {
        open: string;
        close: string;
    };
    saturday?: {
        open: string;
        close: string;
    };
    sunday?: {
        open: string;
        close: string;
    };
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
    percentage?: number;
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
    largestUnit: {
        id: string;
        name: string;
        headcount: number;
    };
    budgetUtilization: number;
    vacancyRate: number;
}
/**
 * Address validation schema
 */
export declare const AddressSchema: any;
/**
 * Organization unit validation schema
 */
export declare const OrgUnitSchema: any;
/**
 * Location validation schema
 */
export declare const LocationSchema: any;
/**
 * Reporting relationship validation schema
 */
export declare const ReportingRelationshipSchema: any;
/**
 * Team validation schema
 */
export declare const TeamSchema: any;
/**
 * Organization Unit Model
 */
export declare class OrganizationUnitModel extends Model {
    id: string;
    code: string;
    name: string;
    type: OrgUnitType;
    status: OrgUnitStatus;
    parentId: string;
    level: number;
    path: string;
    managerId: string;
    costCenterCode: string;
    locationId: string;
    budgetAmount: number;
    currency: string;
    headcount: number;
    maxHeadcount: number;
    effectiveDate: Date;
    endDate: Date;
    description: string;
    metadata: Record<string, any>;
    parent: OrganizationUnitModel;
    children: OrganizationUnitModel[];
    location: LocationModel;
    reportingRelationships: ReportingRelationshipModel[];
    teams: TeamModel[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    static calculatePath(instance: OrganizationUnitModel): Promise<void>;
}
/**
 * Location Model
 */
export declare class LocationModel extends Model {
    id: string;
    code: string;
    name: string;
    type: LocationType;
    address: Address;
    timezone: string;
    country: string;
    region: string;
    capacity: number;
    isVirtual: boolean;
    isPrimary: boolean;
    parentLocationId: string;
    contactInfo: ContactInfo;
    operatingHours: OperatingHours;
    metadata: Record<string, any>;
    parentLocation: LocationModel;
    childLocations: LocationModel[];
    organizationUnits: OrganizationUnitModel[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Reporting Relationship Model
 */
export declare class ReportingRelationshipModel extends Model {
    id: string;
    employeeId: string;
    managerId: string;
    type: ReportingType;
    orgUnitId: string;
    isPrimary: boolean;
    effectiveDate: Date;
    endDate: Date;
    percentage: number;
    organizationUnit: OrganizationUnitModel;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Team Model
 */
export declare class TeamModel extends Model {
    id: string;
    name: string;
    code: string;
    orgUnitId: string;
    leaderId: string;
    type: string;
    purpose: string;
    startDate: Date;
    endDate: Date;
    memberIds: string[];
    metadata: Record<string, any>;
    organizationUnit: OrganizationUnitModel;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Reorganization Plan Model
 */
export declare class ReorganizationPlanModel extends Model {
    id: string;
    name: string;
    type: ReorganizationType;
    description: string;
    effectiveDate: Date;
    completionDate: Date;
    status: string;
    changes: ReorgChange[];
    impactedEmployees: number;
    approvedBy: string;
    approvedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
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
export declare function createOrganizationUnit(unitData: Partial<OrganizationUnit>, transaction?: Transaction): Promise<OrganizationUnitModel>;
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
export declare function updateOrganizationUnit(unitId: string, updates: Partial<OrganizationUnit>, transaction?: Transaction): Promise<OrganizationUnitModel>;
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
export declare function deleteOrganizationUnit(unitId: string, transaction?: Transaction): Promise<void>;
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
export declare function getOrganizationUnit(unitId: string, includeChildren?: boolean): Promise<OrganizationUnitModel | null>;
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
export declare function getOrganizationUnitByCode(code: string): Promise<OrganizationUnitModel | null>;
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
export declare function getRootOrganizationUnits(): Promise<OrganizationUnitModel[]>;
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
export declare function getChildrenUnits(parentId: string, recursive?: boolean): Promise<OrganizationUnitModel[]>;
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
export declare function getParentHierarchy(unitId: string): Promise<OrganizationUnitModel[]>;
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
export declare function moveOrganizationUnit(unitId: string, newParentId: string | null, transaction?: Transaction): Promise<void>;
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
export declare function createLocation(locationData: Partial<Location>, transaction?: Transaction): Promise<LocationModel>;
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
export declare function updateLocation(locationId: string, updates: Partial<Location>, transaction?: Transaction): Promise<LocationModel>;
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
export declare function getLocationByCode(code: string): Promise<LocationModel | null>;
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
export declare function getLocationsByType(type: LocationType): Promise<LocationModel[]>;
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
export declare function getLocationsByCountry(country: string): Promise<LocationModel[]>;
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
export declare function getPrimaryLocation(): Promise<LocationModel | null>;
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
export declare function createReportingRelationship(relationshipData: Partial<ReportingRelationship>, transaction?: Transaction): Promise<ReportingRelationshipModel>;
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
export declare function getDirectReports(managerId: string, activeOnly?: boolean): Promise<string[]>;
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
export declare function getAllReports(managerId: string): Promise<string[]>;
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
export declare function getManager(employeeId: string, type?: ReportingType): Promise<string | null>;
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
export declare function getReportingChain(employeeId: string): Promise<string[]>;
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
export declare function calculateSpanOfControl(managerId: string): Promise<SpanOfControlMetrics>;
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
export declare function createTeam(teamData: Partial<Team>, transaction?: Transaction): Promise<TeamModel>;
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
export declare function addTeamMember(teamId: string, employeeId: string, transaction?: Transaction): Promise<void>;
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
export declare function removeTeamMember(teamId: string, employeeId: string, transaction?: Transaction): Promise<void>;
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
export declare function getTeamMembers(teamId: string): Promise<string[]>;
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
export declare function getEmployeeTeams(employeeId: string): Promise<TeamModel[]>;
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
export declare function generateOrgChart(rootUnitId?: string, maxDepth?: number): Promise<OrgChartNode[]>;
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
export declare function generateOrgChartJSON(rootUnitId?: string): Promise<string>;
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
export declare function getOrgChartFlat(rootUnitId?: string): Promise<OrgChartNode[]>;
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
export declare function createReorganizationPlan(planData: Partial<ReorganizationPlan>, transaction?: Transaction): Promise<ReorganizationPlanModel>;
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
export declare function approveReorganizationPlan(planId: string, approvedBy: string, transaction?: Transaction): Promise<void>;
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
export declare function executeReorganizationPlan(planId: string, transaction?: Transaction): Promise<void>;
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
export declare function getOrganizationAnalytics(): Promise<OrganizationAnalytics>;
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
export declare function getHeadcountByType(): Promise<Record<OrgUnitType, number>>;
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
export declare function getUnitBudget(unitId: string, includeChildren?: boolean): Promise<number>;
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
export declare function calculateOrganizationDepth(): Promise<number>;
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
export declare function findUnitsByCriteria(criteria: Partial<OrganizationUnit>): Promise<OrganizationUnitModel[]>;
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
export declare function validateOrgHierarchy(unitId: string): Promise<{
    valid: boolean;
    errors: string[];
}>;
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
export declare function exportOrganizationStructure(rootUnitId?: string): Promise<any>;
/**
 * Organization Service
 */
export declare class OrganizationService {
    createUnit(data: Partial<OrganizationUnit>): Promise<OrganizationUnitModel>;
    updateUnit(id: string, updates: Partial<OrganizationUnit>): Promise<OrganizationUnitModel>;
    getUnit(id: string, includeChildren?: boolean): Promise<OrganizationUnitModel | null>;
    deleteUnit(id: string): Promise<void>;
    generateChart(rootUnitId?: string, maxDepth?: number): Promise<OrgChartNode[]>;
    getAnalytics(): Promise<OrganizationAnalytics>;
    createLocation(data: Partial<Location>): Promise<LocationModel>;
    createTeam(data: Partial<Team>): Promise<TeamModel>;
}
/**
 * Organization Controller
 */
export declare class OrganizationController {
    private readonly organizationService;
    constructor(organizationService: OrganizationService);
    createUnit(data: Partial<OrganizationUnit>): Promise<OrganizationUnitModel>;
    getUnit(id: string, includeChildren?: boolean): Promise<OrganizationUnitModel>;
    updateUnit(id: string, updates: Partial<OrganizationUnit>): Promise<OrganizationUnitModel>;
    deleteUnit(id: string): Promise<void>;
    getChart(rootUnitId?: string, maxDepth?: number): Promise<OrgChartNode[]>;
    getAnalytics(): Promise<OrganizationAnalytics>;
}
export { OrganizationUnitModel, LocationModel, ReportingRelationshipModel, TeamModel, ReorganizationPlanModel, OrganizationService, OrganizationController, };
//# sourceMappingURL=organizational-structure-kit.d.ts.map