"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationController = exports.OrganizationService = exports.ReorganizationPlanModel = exports.TeamModel = exports.ReportingRelationshipModel = exports.LocationModel = exports.OrganizationUnitModel = exports.TeamSchema = exports.ReportingRelationshipSchema = exports.LocationSchema = exports.OrgUnitSchema = exports.AddressSchema = exports.ReorganizationType = exports.LocationType = exports.ReportingType = exports.OrgUnitStatus = exports.OrgUnitType = void 0;
exports.createOrganizationUnit = createOrganizationUnit;
exports.updateOrganizationUnit = updateOrganizationUnit;
exports.deleteOrganizationUnit = deleteOrganizationUnit;
exports.getOrganizationUnit = getOrganizationUnit;
exports.getOrganizationUnitByCode = getOrganizationUnitByCode;
exports.getRootOrganizationUnits = getRootOrganizationUnits;
exports.getChildrenUnits = getChildrenUnits;
exports.getParentHierarchy = getParentHierarchy;
exports.moveOrganizationUnit = moveOrganizationUnit;
exports.createLocation = createLocation;
exports.updateLocation = updateLocation;
exports.getLocationByCode = getLocationByCode;
exports.getLocationsByType = getLocationsByType;
exports.getLocationsByCountry = getLocationsByCountry;
exports.getPrimaryLocation = getPrimaryLocation;
exports.createReportingRelationship = createReportingRelationship;
exports.getDirectReports = getDirectReports;
exports.getAllReports = getAllReports;
exports.getManager = getManager;
exports.getReportingChain = getReportingChain;
exports.calculateSpanOfControl = calculateSpanOfControl;
exports.createTeam = createTeam;
exports.addTeamMember = addTeamMember;
exports.removeTeamMember = removeTeamMember;
exports.getTeamMembers = getTeamMembers;
exports.getEmployeeTeams = getEmployeeTeams;
exports.generateOrgChart = generateOrgChart;
exports.generateOrgChartJSON = generateOrgChartJSON;
exports.getOrgChartFlat = getOrgChartFlat;
exports.createReorganizationPlan = createReorganizationPlan;
exports.approveReorganizationPlan = approveReorganizationPlan;
exports.executeReorganizationPlan = executeReorganizationPlan;
exports.getOrganizationAnalytics = getOrganizationAnalytics;
exports.getHeadcountByType = getHeadcountByType;
exports.getUnitBudget = getUnitBudget;
exports.calculateOrganizationDepth = calculateOrganizationDepth;
exports.findUnitsByCriteria = findUnitsByCriteria;
exports.validateOrgHierarchy = validateOrgHierarchy;
exports.exportOrganizationStructure = exportOrganizationStructure;
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
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Organization unit type enumeration
 */
var OrgUnitType;
(function (OrgUnitType) {
    OrgUnitType["COMPANY"] = "company";
    OrgUnitType["DIVISION"] = "division";
    OrgUnitType["DEPARTMENT"] = "department";
    OrgUnitType["UNIT"] = "unit";
    OrgUnitType["TEAM"] = "team";
    OrgUnitType["COST_CENTER"] = "cost_center";
    OrgUnitType["LOCATION"] = "location";
    OrgUnitType["PROJECT"] = "project";
})(OrgUnitType || (exports.OrgUnitType = OrgUnitType = {}));
/**
 * Organization unit status
 */
var OrgUnitStatus;
(function (OrgUnitStatus) {
    OrgUnitStatus["ACTIVE"] = "active";
    OrgUnitStatus["INACTIVE"] = "inactive";
    OrgUnitStatus["PENDING"] = "pending";
    OrgUnitStatus["CLOSED"] = "closed";
    OrgUnitStatus["MERGED"] = "merged";
    OrgUnitStatus["SPLIT"] = "split";
})(OrgUnitStatus || (exports.OrgUnitStatus = OrgUnitStatus = {}));
/**
 * Reporting relationship type
 */
var ReportingType;
(function (ReportingType) {
    ReportingType["DIRECT"] = "direct";
    ReportingType["DOTTED_LINE"] = "dotted_line";
    ReportingType["MATRIX"] = "matrix";
    ReportingType["FUNCTIONAL"] = "functional";
    ReportingType["ADMINISTRATIVE"] = "administrative";
})(ReportingType || (exports.ReportingType = ReportingType = {}));
/**
 * Location type
 */
var LocationType;
(function (LocationType) {
    LocationType["HEADQUARTERS"] = "headquarters";
    LocationType["OFFICE"] = "office";
    LocationType["BRANCH"] = "branch";
    LocationType["FACILITY"] = "facility";
    LocationType["HOSPITAL"] = "hospital";
    LocationType["CLINIC"] = "clinic";
    LocationType["WAREHOUSE"] = "warehouse";
    LocationType["REMOTE"] = "remote";
})(LocationType || (exports.LocationType = LocationType = {}));
/**
 * Reorganization type
 */
var ReorganizationType;
(function (ReorganizationType) {
    ReorganizationType["MERGER"] = "merger";
    ReorganizationType["SPLIT"] = "split";
    ReorganizationType["RESTRUCTURE"] = "restructure";
    ReorganizationType["ACQUISITION"] = "acquisition";
    ReorganizationType["DIVESTITURE"] = "divestiture";
    ReorganizationType["CONSOLIDATION"] = "consolidation";
})(ReorganizationType || (exports.ReorganizationType = ReorganizationType = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Address validation schema
 */
exports.AddressSchema = zod_1.z.object({
    street1: zod_1.z.string().min(1).max(255),
    street2: zod_1.z.string().max(255).optional(),
    city: zod_1.z.string().min(1).max(100),
    state: zod_1.z.string().max(100).optional(),
    postalCode: zod_1.z.string().min(1).max(20),
    country: zod_1.z.string().min(2).max(2),
    coordinates: zod_1.z.object({
        latitude: zod_1.z.number().min(-90).max(90),
        longitude: zod_1.z.number().min(-180).max(180),
    }).optional(),
});
/**
 * Organization unit validation schema
 */
exports.OrgUnitSchema = zod_1.z.object({
    code: zod_1.z.string().min(1).max(50),
    name: zod_1.z.string().min(1).max(255),
    type: zod_1.z.nativeEnum(OrgUnitType),
    status: zod_1.z.nativeEnum(OrgUnitStatus).default(OrgUnitStatus.ACTIVE),
    parentId: zod_1.z.string().uuid().optional(),
    managerId: zod_1.z.string().uuid().optional(),
    costCenterCode: zod_1.z.string().max(50).optional(),
    locationId: zod_1.z.string().uuid().optional(),
    budgetAmount: zod_1.z.number().nonnegative().optional(),
    currency: zod_1.z.string().length(3).optional(),
    headcount: zod_1.z.number().int().nonnegative().optional(),
    maxHeadcount: zod_1.z.number().int().positive().optional(),
    effectiveDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date().optional(),
    description: zod_1.z.string().max(1000).optional(),
}).refine((data) => {
    if (data.endDate && data.effectiveDate) {
        return data.endDate >= data.effectiveDate;
    }
    return true;
}, { message: 'End date must be after effective date' });
/**
 * Location validation schema
 */
exports.LocationSchema = zod_1.z.object({
    code: zod_1.z.string().min(1).max(50),
    name: zod_1.z.string().min(1).max(255),
    type: zod_1.z.nativeEnum(LocationType),
    address: exports.AddressSchema,
    timezone: zod_1.z.string().max(50),
    country: zod_1.z.string().min(2).max(2),
    region: zod_1.z.string().max(100).optional(),
    capacity: zod_1.z.number().int().positive().optional(),
    isVirtual: zod_1.z.boolean().default(false),
    isPrimary: zod_1.z.boolean().default(false),
    parentLocationId: zod_1.z.string().uuid().optional(),
});
/**
 * Reporting relationship validation schema
 */
exports.ReportingRelationshipSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    managerId: zod_1.z.string().uuid(),
    type: zod_1.z.nativeEnum(ReportingType),
    orgUnitId: zod_1.z.string().uuid().optional(),
    isPrimary: zod_1.z.boolean().default(true),
    effectiveDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date().optional(),
    percentage: zod_1.z.number().min(0).max(100).optional(),
}).refine((data) => data.employeeId !== data.managerId, { message: 'Employee cannot report to themselves' });
/**
 * Team validation schema
 */
exports.TeamSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    code: zod_1.z.string().min(1).max(50),
    orgUnitId: zod_1.z.string().uuid().optional(),
    leaderId: zod_1.z.string().uuid().optional(),
    type: zod_1.z.enum(['permanent', 'temporary', 'project', 'virtual']),
    purpose: zod_1.z.string().max(1000).optional(),
    startDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date().optional(),
    memberIds: zod_1.z.array(zod_1.z.string().uuid()).default([]),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Organization Unit Model
 */
let OrganizationUnitModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_calculatePath_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _code_decorators;
    let _code_initializers = [];
    let _code_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _parentId_decorators;
    let _parentId_initializers = [];
    let _parentId_extraInitializers = [];
    let _level_decorators;
    let _level_initializers = [];
    let _level_extraInitializers = [];
    let _path_decorators;
    let _path_initializers = [];
    let _path_extraInitializers = [];
    let _managerId_decorators;
    let _managerId_initializers = [];
    let _managerId_extraInitializers = [];
    let _costCenterCode_decorators;
    let _costCenterCode_initializers = [];
    let _costCenterCode_extraInitializers = [];
    let _locationId_decorators;
    let _locationId_initializers = [];
    let _locationId_extraInitializers = [];
    let _budgetAmount_decorators;
    let _budgetAmount_initializers = [];
    let _budgetAmount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _headcount_decorators;
    let _headcount_initializers = [];
    let _headcount_extraInitializers = [];
    let _maxHeadcount_decorators;
    let _maxHeadcount_initializers = [];
    let _maxHeadcount_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _parent_decorators;
    let _parent_initializers = [];
    let _parent_extraInitializers = [];
    let _children_decorators;
    let _children_initializers = [];
    let _children_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _reportingRelationships_decorators;
    let _reportingRelationships_initializers = [];
    let _reportingRelationships_extraInitializers = [];
    let _teams_decorators;
    let _teams_initializers = [];
    let _teams_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var OrganizationUnitModel = _classThis = class extends _classSuper {
        static async calculatePath(instance) {
            if (instance.parentId) {
                const parent = await OrganizationUnitModel.findByPk(instance.parentId);
                if (parent) {
                    instance.path = `${parent.path}/${instance.code}`;
                    instance.level = parent.level + 1;
                }
            }
            else {
                instance.path = `/${instance.code}`;
                instance.level = 0;
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.code = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _code_initializers, void 0));
            this.name = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.type = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.status = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.parentId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _parentId_initializers, void 0));
            this.level = (__runInitializers(this, _parentId_extraInitializers), __runInitializers(this, _level_initializers, void 0));
            this.path = (__runInitializers(this, _level_extraInitializers), __runInitializers(this, _path_initializers, void 0));
            this.managerId = (__runInitializers(this, _path_extraInitializers), __runInitializers(this, _managerId_initializers, void 0));
            this.costCenterCode = (__runInitializers(this, _managerId_extraInitializers), __runInitializers(this, _costCenterCode_initializers, void 0));
            this.locationId = (__runInitializers(this, _costCenterCode_extraInitializers), __runInitializers(this, _locationId_initializers, void 0));
            this.budgetAmount = (__runInitializers(this, _locationId_extraInitializers), __runInitializers(this, _budgetAmount_initializers, void 0));
            this.currency = (__runInitializers(this, _budgetAmount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.headcount = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _headcount_initializers, void 0));
            this.maxHeadcount = (__runInitializers(this, _headcount_extraInitializers), __runInitializers(this, _maxHeadcount_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _maxHeadcount_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.description = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.metadata = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.parent = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _parent_initializers, void 0));
            this.children = (__runInitializers(this, _parent_extraInitializers), __runInitializers(this, _children_initializers, void 0));
            this.location = (__runInitializers(this, _children_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.reportingRelationships = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _reportingRelationships_initializers, void 0));
            this.teams = (__runInitializers(this, _reportingRelationships_extraInitializers), __runInitializers(this, _teams_initializers, void 0));
            this.createdAt = (__runInitializers(this, _teams_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "OrganizationUnitModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _code_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                comment: 'Unique organization unit code',
            })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                comment: 'Organization unit name',
            })];
        _type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(OrgUnitType)),
                allowNull: false,
                comment: 'Type of organization unit',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(OrgUnitStatus)),
                allowNull: false,
                defaultValue: OrgUnitStatus.ACTIVE,
                comment: 'Current status',
            })];
        _parentId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => OrganizationUnitModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'parent_id',
                comment: 'Parent organization unit ID',
            })];
        _level_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: 'Hierarchy level (0 = root)',
            })];
        _path_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
                comment: 'Materialized path for hierarchy queries',
            })];
        _managerId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'manager_id',
                comment: 'Manager employee ID',
            })];
        _costCenterCode_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
                field: 'cost_center_code',
                comment: 'Cost center code',
            })];
        _locationId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => LocationModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'location_id',
                comment: 'Primary location ID',
            })];
        _budgetAmount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
                field: 'budget_amount',
                comment: 'Budget amount',
            })];
        _currency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(3),
                allowNull: true,
                defaultValue: 'USD',
                comment: 'Budget currency',
            })];
        _headcount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                defaultValue: 0,
                comment: 'Current headcount',
            })];
        _maxHeadcount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                field: 'max_headcount',
                comment: 'Maximum approved headcount',
            })];
        _effectiveDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: false,
                field: 'effective_date',
                comment: 'Effective date',
            })];
        _endDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: true,
                field: 'end_date',
                comment: 'End date (if closed)',
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                comment: 'Description',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                comment: 'Additional metadata',
            })];
        _parent_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => OrganizationUnitModel, 'parent_id')];
        _children_decorators = [(0, sequelize_typescript_1.HasMany)(() => OrganizationUnitModel, 'parent_id')];
        _location_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LocationModel)];
        _reportingRelationships_decorators = [(0, sequelize_typescript_1.HasMany)(() => ReportingRelationshipModel)];
        _teams_decorators = [(0, sequelize_typescript_1.HasMany)(() => TeamModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _static_calculatePath_decorators = [sequelize_typescript_1.BeforeCreate, sequelize_typescript_1.BeforeUpdate];
        __esDecorate(_classThis, null, _static_calculatePath_decorators, { kind: "method", name: "calculatePath", static: true, private: false, access: { has: obj => "calculatePath" in obj, get: obj => obj.calculatePath }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: obj => "code" in obj, get: obj => obj.code, set: (obj, value) => { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _parentId_decorators, { kind: "field", name: "parentId", static: false, private: false, access: { has: obj => "parentId" in obj, get: obj => obj.parentId, set: (obj, value) => { obj.parentId = value; } }, metadata: _metadata }, _parentId_initializers, _parentId_extraInitializers);
        __esDecorate(null, null, _level_decorators, { kind: "field", name: "level", static: false, private: false, access: { has: obj => "level" in obj, get: obj => obj.level, set: (obj, value) => { obj.level = value; } }, metadata: _metadata }, _level_initializers, _level_extraInitializers);
        __esDecorate(null, null, _path_decorators, { kind: "field", name: "path", static: false, private: false, access: { has: obj => "path" in obj, get: obj => obj.path, set: (obj, value) => { obj.path = value; } }, metadata: _metadata }, _path_initializers, _path_extraInitializers);
        __esDecorate(null, null, _managerId_decorators, { kind: "field", name: "managerId", static: false, private: false, access: { has: obj => "managerId" in obj, get: obj => obj.managerId, set: (obj, value) => { obj.managerId = value; } }, metadata: _metadata }, _managerId_initializers, _managerId_extraInitializers);
        __esDecorate(null, null, _costCenterCode_decorators, { kind: "field", name: "costCenterCode", static: false, private: false, access: { has: obj => "costCenterCode" in obj, get: obj => obj.costCenterCode, set: (obj, value) => { obj.costCenterCode = value; } }, metadata: _metadata }, _costCenterCode_initializers, _costCenterCode_extraInitializers);
        __esDecorate(null, null, _locationId_decorators, { kind: "field", name: "locationId", static: false, private: false, access: { has: obj => "locationId" in obj, get: obj => obj.locationId, set: (obj, value) => { obj.locationId = value; } }, metadata: _metadata }, _locationId_initializers, _locationId_extraInitializers);
        __esDecorate(null, null, _budgetAmount_decorators, { kind: "field", name: "budgetAmount", static: false, private: false, access: { has: obj => "budgetAmount" in obj, get: obj => obj.budgetAmount, set: (obj, value) => { obj.budgetAmount = value; } }, metadata: _metadata }, _budgetAmount_initializers, _budgetAmount_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _headcount_decorators, { kind: "field", name: "headcount", static: false, private: false, access: { has: obj => "headcount" in obj, get: obj => obj.headcount, set: (obj, value) => { obj.headcount = value; } }, metadata: _metadata }, _headcount_initializers, _headcount_extraInitializers);
        __esDecorate(null, null, _maxHeadcount_decorators, { kind: "field", name: "maxHeadcount", static: false, private: false, access: { has: obj => "maxHeadcount" in obj, get: obj => obj.maxHeadcount, set: (obj, value) => { obj.maxHeadcount = value; } }, metadata: _metadata }, _maxHeadcount_initializers, _maxHeadcount_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _parent_decorators, { kind: "field", name: "parent", static: false, private: false, access: { has: obj => "parent" in obj, get: obj => obj.parent, set: (obj, value) => { obj.parent = value; } }, metadata: _metadata }, _parent_initializers, _parent_extraInitializers);
        __esDecorate(null, null, _children_decorators, { kind: "field", name: "children", static: false, private: false, access: { has: obj => "children" in obj, get: obj => obj.children, set: (obj, value) => { obj.children = value; } }, metadata: _metadata }, _children_initializers, _children_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _reportingRelationships_decorators, { kind: "field", name: "reportingRelationships", static: false, private: false, access: { has: obj => "reportingRelationships" in obj, get: obj => obj.reportingRelationships, set: (obj, value) => { obj.reportingRelationships = value; } }, metadata: _metadata }, _reportingRelationships_initializers, _reportingRelationships_extraInitializers);
        __esDecorate(null, null, _teams_decorators, { kind: "field", name: "teams", static: false, private: false, access: { has: obj => "teams" in obj, get: obj => obj.teams, set: (obj, value) => { obj.teams = value; } }, metadata: _metadata }, _teams_initializers, _teams_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrganizationUnitModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrganizationUnitModel = _classThis;
})();
exports.OrganizationUnitModel = OrganizationUnitModel;
/**
 * Location Model
 */
let LocationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _code_decorators;
    let _code_initializers = [];
    let _code_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _timezone_decorators;
    let _timezone_initializers = [];
    let _timezone_extraInitializers = [];
    let _country_decorators;
    let _country_initializers = [];
    let _country_extraInitializers = [];
    let _region_decorators;
    let _region_initializers = [];
    let _region_extraInitializers = [];
    let _capacity_decorators;
    let _capacity_initializers = [];
    let _capacity_extraInitializers = [];
    let _isVirtual_decorators;
    let _isVirtual_initializers = [];
    let _isVirtual_extraInitializers = [];
    let _isPrimary_decorators;
    let _isPrimary_initializers = [];
    let _isPrimary_extraInitializers = [];
    let _parentLocationId_decorators;
    let _parentLocationId_initializers = [];
    let _parentLocationId_extraInitializers = [];
    let _contactInfo_decorators;
    let _contactInfo_initializers = [];
    let _contactInfo_extraInitializers = [];
    let _operatingHours_decorators;
    let _operatingHours_initializers = [];
    let _operatingHours_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _parentLocation_decorators;
    let _parentLocation_initializers = [];
    let _parentLocation_extraInitializers = [];
    let _childLocations_decorators;
    let _childLocations_initializers = [];
    let _childLocations_extraInitializers = [];
    let _organizationUnits_decorators;
    let _organizationUnits_initializers = [];
    let _organizationUnits_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var LocationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.code = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _code_initializers, void 0));
            this.name = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.type = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.address = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _address_initializers, void 0));
            this.timezone = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _timezone_initializers, void 0));
            this.country = (__runInitializers(this, _timezone_extraInitializers), __runInitializers(this, _country_initializers, void 0));
            this.region = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _region_initializers, void 0));
            this.capacity = (__runInitializers(this, _region_extraInitializers), __runInitializers(this, _capacity_initializers, void 0));
            this.isVirtual = (__runInitializers(this, _capacity_extraInitializers), __runInitializers(this, _isVirtual_initializers, void 0));
            this.isPrimary = (__runInitializers(this, _isVirtual_extraInitializers), __runInitializers(this, _isPrimary_initializers, void 0));
            this.parentLocationId = (__runInitializers(this, _isPrimary_extraInitializers), __runInitializers(this, _parentLocationId_initializers, void 0));
            this.contactInfo = (__runInitializers(this, _parentLocationId_extraInitializers), __runInitializers(this, _contactInfo_initializers, void 0));
            this.operatingHours = (__runInitializers(this, _contactInfo_extraInitializers), __runInitializers(this, _operatingHours_initializers, void 0));
            this.metadata = (__runInitializers(this, _operatingHours_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.parentLocation = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _parentLocation_initializers, void 0));
            this.childLocations = (__runInitializers(this, _parentLocation_extraInitializers), __runInitializers(this, _childLocations_initializers, void 0));
            this.organizationUnits = (__runInitializers(this, _childLocations_extraInitializers), __runInitializers(this, _organizationUnits_initializers, void 0));
            this.createdAt = (__runInitializers(this, _organizationUnits_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "LocationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _code_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                comment: 'Location code',
            })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                comment: 'Location name',
            })];
        _type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(LocationType)),
                allowNull: false,
                comment: 'Location type',
            })];
        _address_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                comment: 'Physical address',
            })];
        _timezone_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                comment: 'Timezone',
            })];
        _country_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(2),
                allowNull: false,
                comment: 'Country code',
            })];
        _region_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
                comment: 'Region/state',
            })];
        _capacity_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                comment: 'Capacity',
            })];
        _isVirtual_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'is_virtual',
                comment: 'Virtual/remote location',
            })];
        _isPrimary_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'is_primary',
                comment: 'Primary location',
            })];
        _parentLocationId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => LocationModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'parent_location_id',
            })];
        _contactInfo_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                field: 'contact_info',
            })];
        _operatingHours_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                field: 'operating_hours',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _parentLocation_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LocationModel, 'parent_location_id')];
        _childLocations_decorators = [(0, sequelize_typescript_1.HasMany)(() => LocationModel, 'parent_location_id')];
        _organizationUnits_decorators = [(0, sequelize_typescript_1.HasMany)(() => OrganizationUnitModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: obj => "code" in obj, get: obj => obj.code, set: (obj, value) => { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
        __esDecorate(null, null, _timezone_decorators, { kind: "field", name: "timezone", static: false, private: false, access: { has: obj => "timezone" in obj, get: obj => obj.timezone, set: (obj, value) => { obj.timezone = value; } }, metadata: _metadata }, _timezone_initializers, _timezone_extraInitializers);
        __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: obj => "country" in obj, get: obj => obj.country, set: (obj, value) => { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
        __esDecorate(null, null, _region_decorators, { kind: "field", name: "region", static: false, private: false, access: { has: obj => "region" in obj, get: obj => obj.region, set: (obj, value) => { obj.region = value; } }, metadata: _metadata }, _region_initializers, _region_extraInitializers);
        __esDecorate(null, null, _capacity_decorators, { kind: "field", name: "capacity", static: false, private: false, access: { has: obj => "capacity" in obj, get: obj => obj.capacity, set: (obj, value) => { obj.capacity = value; } }, metadata: _metadata }, _capacity_initializers, _capacity_extraInitializers);
        __esDecorate(null, null, _isVirtual_decorators, { kind: "field", name: "isVirtual", static: false, private: false, access: { has: obj => "isVirtual" in obj, get: obj => obj.isVirtual, set: (obj, value) => { obj.isVirtual = value; } }, metadata: _metadata }, _isVirtual_initializers, _isVirtual_extraInitializers);
        __esDecorate(null, null, _isPrimary_decorators, { kind: "field", name: "isPrimary", static: false, private: false, access: { has: obj => "isPrimary" in obj, get: obj => obj.isPrimary, set: (obj, value) => { obj.isPrimary = value; } }, metadata: _metadata }, _isPrimary_initializers, _isPrimary_extraInitializers);
        __esDecorate(null, null, _parentLocationId_decorators, { kind: "field", name: "parentLocationId", static: false, private: false, access: { has: obj => "parentLocationId" in obj, get: obj => obj.parentLocationId, set: (obj, value) => { obj.parentLocationId = value; } }, metadata: _metadata }, _parentLocationId_initializers, _parentLocationId_extraInitializers);
        __esDecorate(null, null, _contactInfo_decorators, { kind: "field", name: "contactInfo", static: false, private: false, access: { has: obj => "contactInfo" in obj, get: obj => obj.contactInfo, set: (obj, value) => { obj.contactInfo = value; } }, metadata: _metadata }, _contactInfo_initializers, _contactInfo_extraInitializers);
        __esDecorate(null, null, _operatingHours_decorators, { kind: "field", name: "operatingHours", static: false, private: false, access: { has: obj => "operatingHours" in obj, get: obj => obj.operatingHours, set: (obj, value) => { obj.operatingHours = value; } }, metadata: _metadata }, _operatingHours_initializers, _operatingHours_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _parentLocation_decorators, { kind: "field", name: "parentLocation", static: false, private: false, access: { has: obj => "parentLocation" in obj, get: obj => obj.parentLocation, set: (obj, value) => { obj.parentLocation = value; } }, metadata: _metadata }, _parentLocation_initializers, _parentLocation_extraInitializers);
        __esDecorate(null, null, _childLocations_decorators, { kind: "field", name: "childLocations", static: false, private: false, access: { has: obj => "childLocations" in obj, get: obj => obj.childLocations, set: (obj, value) => { obj.childLocations = value; } }, metadata: _metadata }, _childLocations_initializers, _childLocations_extraInitializers);
        __esDecorate(null, null, _organizationUnits_decorators, { kind: "field", name: "organizationUnits", static: false, private: false, access: { has: obj => "organizationUnits" in obj, get: obj => obj.organizationUnits, set: (obj, value) => { obj.organizationUnits = value; } }, metadata: _metadata }, _organizationUnits_initializers, _organizationUnits_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LocationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LocationModel = _classThis;
})();
exports.LocationModel = LocationModel;
/**
 * Reporting Relationship Model
 */
let ReportingRelationshipModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _managerId_decorators;
    let _managerId_initializers = [];
    let _managerId_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _orgUnitId_decorators;
    let _orgUnitId_initializers = [];
    let _orgUnitId_extraInitializers = [];
    let _isPrimary_decorators;
    let _isPrimary_initializers = [];
    let _isPrimary_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _percentage_decorators;
    let _percentage_initializers = [];
    let _percentage_extraInitializers = [];
    let _organizationUnit_decorators;
    let _organizationUnit_initializers = [];
    let _organizationUnit_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ReportingRelationshipModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.managerId = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _managerId_initializers, void 0));
            this.type = (__runInitializers(this, _managerId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.orgUnitId = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _orgUnitId_initializers, void 0));
            this.isPrimary = (__runInitializers(this, _orgUnitId_extraInitializers), __runInitializers(this, _isPrimary_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _isPrimary_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.percentage = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _percentage_initializers, void 0));
            this.organizationUnit = (__runInitializers(this, _percentage_extraInitializers), __runInitializers(this, _organizationUnit_initializers, void 0));
            this.createdAt = (__runInitializers(this, _organizationUnit_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ReportingRelationshipModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
            })];
        _managerId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'manager_id',
            })];
        _type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReportingType)),
                allowNull: false,
                comment: 'Type of reporting relationship',
            })];
        _orgUnitId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => OrganizationUnitModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'org_unit_id',
            })];
        _isPrimary_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                field: 'is_primary',
            })];
        _effectiveDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: false,
                field: 'effective_date',
            })];
        _endDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: true,
                field: 'end_date',
            })];
        _percentage_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: true,
                comment: 'Percentage allocation (for matrix)',
            })];
        _organizationUnit_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => OrganizationUnitModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _managerId_decorators, { kind: "field", name: "managerId", static: false, private: false, access: { has: obj => "managerId" in obj, get: obj => obj.managerId, set: (obj, value) => { obj.managerId = value; } }, metadata: _metadata }, _managerId_initializers, _managerId_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _orgUnitId_decorators, { kind: "field", name: "orgUnitId", static: false, private: false, access: { has: obj => "orgUnitId" in obj, get: obj => obj.orgUnitId, set: (obj, value) => { obj.orgUnitId = value; } }, metadata: _metadata }, _orgUnitId_initializers, _orgUnitId_extraInitializers);
        __esDecorate(null, null, _isPrimary_decorators, { kind: "field", name: "isPrimary", static: false, private: false, access: { has: obj => "isPrimary" in obj, get: obj => obj.isPrimary, set: (obj, value) => { obj.isPrimary = value; } }, metadata: _metadata }, _isPrimary_initializers, _isPrimary_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _percentage_decorators, { kind: "field", name: "percentage", static: false, private: false, access: { has: obj => "percentage" in obj, get: obj => obj.percentage, set: (obj, value) => { obj.percentage = value; } }, metadata: _metadata }, _percentage_initializers, _percentage_extraInitializers);
        __esDecorate(null, null, _organizationUnit_decorators, { kind: "field", name: "organizationUnit", static: false, private: false, access: { has: obj => "organizationUnit" in obj, get: obj => obj.organizationUnit, set: (obj, value) => { obj.organizationUnit = value; } }, metadata: _metadata }, _organizationUnit_initializers, _organizationUnit_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReportingRelationshipModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReportingRelationshipModel = _classThis;
})();
exports.ReportingRelationshipModel = ReportingRelationshipModel;
/**
 * Team Model
 */
let TeamModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _code_decorators;
    let _code_initializers = [];
    let _code_extraInitializers = [];
    let _orgUnitId_decorators;
    let _orgUnitId_initializers = [];
    let _orgUnitId_extraInitializers = [];
    let _leaderId_decorators;
    let _leaderId_initializers = [];
    let _leaderId_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _purpose_decorators;
    let _purpose_initializers = [];
    let _purpose_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _memberIds_decorators;
    let _memberIds_initializers = [];
    let _memberIds_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _organizationUnit_decorators;
    let _organizationUnit_initializers = [];
    let _organizationUnit_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var TeamModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.code = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _code_initializers, void 0));
            this.orgUnitId = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _orgUnitId_initializers, void 0));
            this.leaderId = (__runInitializers(this, _orgUnitId_extraInitializers), __runInitializers(this, _leaderId_initializers, void 0));
            this.type = (__runInitializers(this, _leaderId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.purpose = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _purpose_initializers, void 0));
            this.startDate = (__runInitializers(this, _purpose_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.memberIds = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _memberIds_initializers, void 0));
            this.metadata = (__runInitializers(this, _memberIds_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.organizationUnit = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _organizationUnit_initializers, void 0));
            this.createdAt = (__runInitializers(this, _organizationUnit_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TeamModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _code_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _orgUnitId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => OrganizationUnitModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'org_unit_id',
            })];
        _leaderId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'leader_id',
            })];
        _type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('permanent', 'temporary', 'project', 'virtual'),
                allowNull: false,
            })];
        _purpose_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _startDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: false,
                field: 'start_date',
            })];
        _endDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: true,
                field: 'end_date',
            })];
        _memberIds_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
                defaultValue: [],
                field: 'member_ids',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _organizationUnit_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => OrganizationUnitModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: obj => "code" in obj, get: obj => obj.code, set: (obj, value) => { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
        __esDecorate(null, null, _orgUnitId_decorators, { kind: "field", name: "orgUnitId", static: false, private: false, access: { has: obj => "orgUnitId" in obj, get: obj => obj.orgUnitId, set: (obj, value) => { obj.orgUnitId = value; } }, metadata: _metadata }, _orgUnitId_initializers, _orgUnitId_extraInitializers);
        __esDecorate(null, null, _leaderId_decorators, { kind: "field", name: "leaderId", static: false, private: false, access: { has: obj => "leaderId" in obj, get: obj => obj.leaderId, set: (obj, value) => { obj.leaderId = value; } }, metadata: _metadata }, _leaderId_initializers, _leaderId_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _purpose_decorators, { kind: "field", name: "purpose", static: false, private: false, access: { has: obj => "purpose" in obj, get: obj => obj.purpose, set: (obj, value) => { obj.purpose = value; } }, metadata: _metadata }, _purpose_initializers, _purpose_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _memberIds_decorators, { kind: "field", name: "memberIds", static: false, private: false, access: { has: obj => "memberIds" in obj, get: obj => obj.memberIds, set: (obj, value) => { obj.memberIds = value; } }, metadata: _metadata }, _memberIds_initializers, _memberIds_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _organizationUnit_decorators, { kind: "field", name: "organizationUnit", static: false, private: false, access: { has: obj => "organizationUnit" in obj, get: obj => obj.organizationUnit, set: (obj, value) => { obj.organizationUnit = value; } }, metadata: _metadata }, _organizationUnit_initializers, _organizationUnit_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TeamModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TeamModel = _classThis;
})();
exports.TeamModel = TeamModel;
/**
 * Reorganization Plan Model
 */
let ReorganizationPlanModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'reorganization_plans',
            timestamps: true,
            indexes: [
                { fields: ['type'] },
                { fields: ['status'] },
                { fields: ['effective_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _completionDate_decorators;
    let _completionDate_initializers = [];
    let _completionDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _changes_decorators;
    let _changes_initializers = [];
    let _changes_extraInitializers = [];
    let _impactedEmployees_decorators;
    let _impactedEmployees_initializers = [];
    let _impactedEmployees_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ReorganizationPlanModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.type = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.description = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.completionDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _completionDate_initializers, void 0));
            this.status = (__runInitializers(this, _completionDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.changes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _changes_initializers, void 0));
            this.impactedEmployees = (__runInitializers(this, _changes_extraInitializers), __runInitializers(this, _impactedEmployees_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _impactedEmployees_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ReorganizationPlanModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReorganizationType)),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _effectiveDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: false,
                field: 'effective_date',
            })];
        _completionDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: true,
                field: 'completion_date',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('draft', 'approved', 'in_progress', 'completed', 'cancelled'),
                allowNull: false,
                defaultValue: 'draft',
            })];
        _changes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _impactedEmployees_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                field: 'impacted_employees',
            })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'approved_by',
            })];
        _approvedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'approved_at',
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _completionDate_decorators, { kind: "field", name: "completionDate", static: false, private: false, access: { has: obj => "completionDate" in obj, get: obj => obj.completionDate, set: (obj, value) => { obj.completionDate = value; } }, metadata: _metadata }, _completionDate_initializers, _completionDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _changes_decorators, { kind: "field", name: "changes", static: false, private: false, access: { has: obj => "changes" in obj, get: obj => obj.changes, set: (obj, value) => { obj.changes = value; } }, metadata: _metadata }, _changes_initializers, _changes_extraInitializers);
        __esDecorate(null, null, _impactedEmployees_decorators, { kind: "field", name: "impactedEmployees", static: false, private: false, access: { has: obj => "impactedEmployees" in obj, get: obj => obj.impactedEmployees, set: (obj, value) => { obj.impactedEmployees = value; } }, metadata: _metadata }, _impactedEmployees_initializers, _impactedEmployees_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReorganizationPlanModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReorganizationPlanModel = _classThis;
})();
exports.ReorganizationPlanModel = ReorganizationPlanModel;
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
async function createOrganizationUnit(unitData, transaction) {
    const validated = exports.OrgUnitSchema.parse(unitData);
    // Check for duplicate code
    const existing = await OrganizationUnitModel.findOne({
        where: { code: validated.code },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException(`Organization unit code ${validated.code} already exists`);
    }
    return OrganizationUnitModel.create(validated, { transaction });
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
async function updateOrganizationUnit(unitId, updates, transaction) {
    const unit = await OrganizationUnitModel.findByPk(unitId, { transaction });
    if (!unit) {
        throw new common_1.NotFoundException(`Organization unit ${unitId} not found`);
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
async function deleteOrganizationUnit(unitId, transaction) {
    const unit = await OrganizationUnitModel.findByPk(unitId, { transaction });
    if (!unit) {
        throw new common_1.NotFoundException(`Organization unit ${unitId} not found`);
    }
    // Check for children
    const children = await OrganizationUnitModel.count({
        where: { parentId: unitId },
        transaction,
    });
    if (children > 0) {
        throw new common_1.BadRequestException('Cannot delete unit with children');
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
async function getOrganizationUnit(unitId, includeChildren = false) {
    const options = {
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
async function getOrganizationUnitByCode(code) {
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
async function getRootOrganizationUnits() {
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
async function getChildrenUnits(parentId, recursive = false) {
    if (!recursive) {
        return OrganizationUnitModel.findAll({
            where: { parentId },
            order: [['name', 'ASC']],
        });
    }
    // Recursive query using path
    const parent = await OrganizationUnitModel.findByPk(parentId);
    if (!parent) {
        throw new common_1.NotFoundException(`Organization unit ${parentId} not found`);
    }
    return OrganizationUnitModel.findAll({
        where: {
            path: {
                [sequelize_1.Op.like]: `${parent.path}/%`,
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
async function getParentHierarchy(unitId) {
    const unit = await OrganizationUnitModel.findByPk(unitId);
    if (!unit) {
        throw new common_1.NotFoundException(`Organization unit ${unitId} not found`);
    }
    const pathParts = unit.path.split('/').filter(Boolean);
    const codes = pathParts.slice(0, -1); // Exclude self
    if (codes.length === 0) {
        return [];
    }
    return OrganizationUnitModel.findAll({
        where: { code: { [sequelize_1.Op.in]: codes } },
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
async function moveOrganizationUnit(unitId, newParentId, transaction) {
    const unit = await OrganizationUnitModel.findByPk(unitId, { transaction });
    if (!unit) {
        throw new common_1.NotFoundException(`Organization unit ${unitId} not found`);
    }
    // Check for circular reference
    if (newParentId) {
        const descendants = await getChildrenUnits(unitId, true);
        if (descendants.some((d) => d.id === newParentId)) {
            throw new common_1.BadRequestException('Cannot move unit to its own descendant');
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
async function updateDescendantPaths(unitId, transaction) {
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
async function createLocation(locationData, transaction) {
    const validated = exports.LocationSchema.parse(locationData);
    const existing = await LocationModel.findOne({
        where: { code: validated.code },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException(`Location code ${validated.code} already exists`);
    }
    return LocationModel.create(validated, { transaction });
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
async function updateLocation(locationId, updates, transaction) {
    const location = await LocationModel.findByPk(locationId, { transaction });
    if (!location) {
        throw new common_1.NotFoundException(`Location ${locationId} not found`);
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
async function getLocationByCode(code) {
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
async function getLocationsByType(type) {
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
async function getLocationsByCountry(country) {
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
async function getPrimaryLocation() {
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
async function createReportingRelationship(relationshipData, transaction) {
    const validated = exports.ReportingRelationshipSchema.parse(relationshipData);
    // If primary, end other primary relationships
    if (validated.isPrimary) {
        await ReportingRelationshipModel.update({ endDate: validated.effectiveDate }, {
            where: {
                employeeId: validated.employeeId,
                isPrimary: true,
                endDate: null,
            },
            transaction,
        });
    }
    return ReportingRelationshipModel.create(validated, { transaction });
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
async function getDirectReports(managerId, activeOnly = true) {
    const where = {
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
async function getAllReports(managerId) {
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
async function getManager(employeeId, type = ReportingType.DIRECT) {
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
async function getReportingChain(employeeId) {
    const chain = [];
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
async function calculateSpanOfControl(managerId) {
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
async function getManagementLevel(employeeId, topManagerId) {
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
async function createTeam(teamData, transaction) {
    const validated = exports.TeamSchema.parse(teamData);
    const existing = await TeamModel.findOne({
        where: { code: validated.code },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException(`Team code ${validated.code} already exists`);
    }
    return TeamModel.create(validated, { transaction });
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
async function addTeamMember(teamId, employeeId, transaction) {
    const team = await TeamModel.findByPk(teamId, { transaction });
    if (!team) {
        throw new common_1.NotFoundException(`Team ${teamId} not found`);
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
async function removeTeamMember(teamId, employeeId, transaction) {
    const team = await TeamModel.findByPk(teamId, { transaction });
    if (!team) {
        throw new common_1.NotFoundException(`Team ${teamId} not found`);
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
async function getTeamMembers(teamId) {
    const team = await TeamModel.findByPk(teamId);
    if (!team) {
        throw new common_1.NotFoundException(`Team ${teamId} not found`);
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
async function getEmployeeTeams(employeeId) {
    return TeamModel.findAll({
        where: {
            memberIds: { [sequelize_1.Op.contains]: [employeeId] },
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
async function generateOrgChart(rootUnitId, maxDepth = 5) {
    const roots = rootUnitId
        ? [await OrganizationUnitModel.findByPk(rootUnitId)]
        : await getRootOrganizationUnits();
    const nodes = [];
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
async function buildOrgChartNode(unit, currentDepth, maxDepth) {
    const node = {
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
        node.metrics.spanOfControl = span.directReports;
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
async function generateOrgChartJSON(rootUnitId) {
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
async function getOrgChartFlat(rootUnitId) {
    const tree = await generateOrgChart(rootUnitId);
    const flat = [];
    function flatten(nodes) {
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
async function createReorganizationPlan(planData, transaction) {
    return ReorganizationPlanModel.create(planData, { transaction });
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
async function approveReorganizationPlan(planId, approvedBy, transaction) {
    const plan = await ReorganizationPlanModel.findByPk(planId, { transaction });
    if (!plan) {
        throw new common_1.NotFoundException(`Reorganization plan ${planId} not found`);
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
async function executeReorganizationPlan(planId, transaction) {
    const plan = await ReorganizationPlanModel.findByPk(planId, { transaction });
    if (!plan) {
        throw new common_1.NotFoundException(`Reorganization plan ${planId} not found`);
    }
    if (plan.status !== 'approved') {
        throw new common_1.BadRequestException('Plan must be approved before execution');
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
async function executeReorgChange(change, transaction) {
    switch (change.type) {
        case 'create':
            if (change.entityType === 'org_unit') {
                await createOrganizationUnit(change.newValues, transaction);
            }
            break;
        case 'update':
            if (change.entityType === 'org_unit') {
                await updateOrganizationUnit(change.entityId, change.newValues, transaction);
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
async function getOrganizationAnalytics() {
    const units = await OrganizationUnitModel.findAll();
    const byType = {};
    const byLevel = {};
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
        const span = await calculateSpanOfControl(manager.managerId);
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
async function getHeadcountByType() {
    const units = await OrganizationUnitModel.findAll();
    const headcounts = {};
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
async function getUnitBudget(unitId, includeChildren = false) {
    const unit = await OrganizationUnitModel.findByPk(unitId);
    if (!unit) {
        throw new common_1.NotFoundException(`Organization unit ${unitId} not found`);
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
async function calculateOrganizationDepth() {
    const result = await OrganizationUnitModel.max('level');
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
async function findUnitsByCriteria(criteria) {
    return OrganizationUnitModel.findAll({
        where: criteria,
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
async function validateOrgHierarchy(unitId) {
    const errors = [];
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
    }
    else if (unit.level !== 0) {
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
async function calculateExpectedPath(unitId) {
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
async function exportOrganizationStructure(rootUnitId) {
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
let OrganizationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var OrganizationService = _classThis = class {
        async createUnit(data) {
            return createOrganizationUnit(data);
        }
        async updateUnit(id, updates) {
            return updateOrganizationUnit(id, updates);
        }
        async getUnit(id, includeChildren = false) {
            return getOrganizationUnit(id, includeChildren);
        }
        async deleteUnit(id) {
            return deleteOrganizationUnit(id);
        }
        async generateChart(rootUnitId, maxDepth = 5) {
            return generateOrgChart(rootUnitId, maxDepth);
        }
        async getAnalytics() {
            return getOrganizationAnalytics();
        }
        async createLocation(data) {
            return createLocation(data);
        }
        async createTeam(data) {
            return createTeam(data);
        }
    };
    __setFunctionName(_classThis, "OrganizationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrganizationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrganizationService = _classThis;
})();
exports.OrganizationService = OrganizationService;
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
/**
 * Organization Controller
 */
let OrganizationController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Organization'), (0, common_1.Controller)('organization'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createUnit_decorators;
    let _getUnit_decorators;
    let _updateUnit_decorators;
    let _deleteUnit_decorators;
    let _getChart_decorators;
    let _getAnalytics_decorators;
    var OrganizationController = _classThis = class {
        constructor(organizationService) {
            this.organizationService = (__runInitializers(this, _instanceExtraInitializers), organizationService);
        }
        async createUnit(data) {
            return this.organizationService.createUnit(data);
        }
        async getUnit(id, includeChildren) {
            const unit = await this.organizationService.getUnit(id, includeChildren);
            if (!unit) {
                throw new common_1.NotFoundException(`Organization unit ${id} not found`);
            }
            return unit;
        }
        async updateUnit(id, updates) {
            return this.organizationService.updateUnit(id, updates);
        }
        async deleteUnit(id) {
            return this.organizationService.deleteUnit(id);
        }
        async getChart(rootUnitId, maxDepth = 5) {
            return this.organizationService.generateChart(rootUnitId, maxDepth);
        }
        async getAnalytics() {
            return this.organizationService.getAnalytics();
        }
    };
    __setFunctionName(_classThis, "OrganizationController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createUnit_decorators = [(0, common_1.Post)('units'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create organization unit' })];
        _getUnit_decorators = [(0, common_1.Get)('units/:id'), (0, swagger_1.ApiOperation)({ summary: 'Get organization unit' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string' })];
        _updateUnit_decorators = [(0, common_1.Put)('units/:id'), (0, swagger_1.ApiOperation)({ summary: 'Update organization unit' })];
        _deleteUnit_decorators = [(0, common_1.Delete)('units/:id'), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT), (0, swagger_1.ApiOperation)({ summary: 'Delete organization unit' })];
        _getChart_decorators = [(0, common_1.Get)('chart'), (0, swagger_1.ApiOperation)({ summary: 'Generate organization chart' }), (0, swagger_1.ApiQuery)({ name: 'rootUnitId', required: false }), (0, swagger_1.ApiQuery)({ name: 'maxDepth', required: false, type: 'number' })];
        _getAnalytics_decorators = [(0, common_1.Get)('analytics'), (0, swagger_1.ApiOperation)({ summary: 'Get organization analytics' })];
        __esDecorate(_classThis, null, _createUnit_decorators, { kind: "method", name: "createUnit", static: false, private: false, access: { has: obj => "createUnit" in obj, get: obj => obj.createUnit }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUnit_decorators, { kind: "method", name: "getUnit", static: false, private: false, access: { has: obj => "getUnit" in obj, get: obj => obj.getUnit }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateUnit_decorators, { kind: "method", name: "updateUnit", static: false, private: false, access: { has: obj => "updateUnit" in obj, get: obj => obj.updateUnit }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteUnit_decorators, { kind: "method", name: "deleteUnit", static: false, private: false, access: { has: obj => "deleteUnit" in obj, get: obj => obj.deleteUnit }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getChart_decorators, { kind: "method", name: "getChart", static: false, private: false, access: { has: obj => "getChart" in obj, get: obj => obj.getChart }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAnalytics_decorators, { kind: "method", name: "getAnalytics", static: false, private: false, access: { has: obj => "getAnalytics" in obj, get: obj => obj.getAnalytics }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrganizationController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrganizationController = _classThis;
})();
exports.OrganizationController = OrganizationController;
//# sourceMappingURL=organizational-structure-kit.js.map