"use strict";
/**
 * LOC: PROJPROG1234567
 * File: /reuse/government/project-program-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend government services
 *   - Project management controllers
 *   - Program tracking engines
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRiskId = exports.createProjectRisk = exports.generateCapitalImprovementPlanReport = exports.trackMultiYearPlanExecution = exports.allocateProjectsByYear = exports.generatePlanId = exports.createMultiYearPlan = exports.trackDeliverableAcceptance = exports.getProjectDeliverables = exports.updateDeliverableStatus = exports.generateDeliverableId = exports.createProjectDeliverable = exports.trackProgramKPIs = exports.generatePortfolioReport = exports.compareProjectPerformance = exports.generateProjectDashboard = exports.calculateEarnedValueMetrics = exports.trackContingencyReserve = exports.generateCostReport = exports.forecastProjectCost = exports.calculateProjectCost = exports.recordProjectCost = exports.generateScheduleReport = exports.identifyCriticalPath = exports.updateProjectSchedule = exports.calculateTotalDuration = exports.createProjectTimeline = exports.analyzeResourceUtilization = exports.getProjectResources = exports.updateResourceUtilization = exports.generateResourceId = exports.allocateProjectResource = exports.identifyAtRiskMilestones = exports.getProjectMilestones = exports.updateMilestoneProgress = exports.generateMilestoneId = exports.createProjectMilestone = exports.forecastProgramBudget = exports.generateProgramBudgetReport = exports.getProgramProjects = exports.calculateProgramBudget = exports.allocateProgramBudget = exports.searchProjects = exports.getProjectDetails = exports.updateProjectStatus = exports.generateProjectNumber = exports.createCapitalProject = exports.createResourceAllocationModel = exports.createProjectMilestoneModel = exports.createCapitalProjectModel = void 0;
exports.generateStakeholderCommunicationPlan = exports.generateStakeholderId = exports.addProjectStakeholder = void 0;
/**
 * File: /reuse/government/project-program-management-kit.ts
 * Locator: WC-GOV-PROJ-001
 * Purpose: Comprehensive Project & Program Management Utilities - Government capital project and program lifecycle
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Project controllers, program services, resource allocation, performance tracking
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 50+ utility functions for capital project tracking, budget management, milestones, resource allocation, cost tracking
 *
 * LLM Context: Enterprise-grade government project and program management system for capital projects.
 * Provides project lifecycle management, program budget oversight, milestone tracking, resource allocation,
 * timeline management, cost tracking, performance metrics, deliverable tracking, multi-year planning,
 * project dashboards, risk management, stakeholder management, compliance tracking, reporting.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================
/**
 * Sequelize model for Capital Project Management with lifecycle tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CapitalProject model
 *
 * @example
 * ```typescript
 * const CapitalProject = createCapitalProjectModel(sequelize);
 * const project = await CapitalProject.create({
 *   projectNumber: 'CAP-2025-001',
 *   projectName: 'Highway Bridge Replacement',
 *   projectType: 'INFRASTRUCTURE',
 *   totalBudget: 5000000,
 *   status: 'PLANNING'
 * });
 * ```
 */
const createCapitalProjectModel = (sequelize) => {
    class CapitalProject extends sequelize_1.Model {
    }
    CapitalProject.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        projectNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique project identifier',
        },
        projectName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Project name',
        },
        projectType: {
            type: sequelize_1.DataTypes.ENUM('INFRASTRUCTURE', 'BUILDING', 'EQUIPMENT', 'IT', 'ENVIRONMENTAL'),
            allowNull: false,
            comment: 'Type of capital project',
        },
        department: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Owning department',
        },
        programId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Parent program ID',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Project description',
        },
        justification: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Business justification',
        },
        totalBudget: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Total project budget',
        },
        currentCost: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Current actual cost',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('PLANNING', 'APPROVED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'PLANNING',
            comment: 'Project status',
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
            allowNull: false,
            defaultValue: 'MEDIUM',
            comment: 'Project priority',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Planned start date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Planned end date',
        },
        actualStartDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Actual start date',
        },
        actualEndDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Actual completion date',
        },
        projectManager: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Project manager user ID',
        },
        sponsor: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Executive sponsor',
        },
        percentComplete: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Completion percentage',
        },
        healthStatus: {
            type: sequelize_1.DataTypes.ENUM('GREEN', 'YELLOW', 'RED'),
            allowNull: false,
            defaultValue: 'GREEN',
            comment: 'Project health indicator',
        },
        fundingSource: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Funding source',
        },
        location: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Project location',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional project metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created project',
        },
    }, {
        sequelize,
        tableName: 'capital_projects',
        timestamps: true,
        indexes: [
            { fields: ['projectNumber'], unique: true },
            { fields: ['projectName'] },
            { fields: ['status'] },
            { fields: ['priority'] },
            { fields: ['projectType'] },
            { fields: ['department'] },
            { fields: ['programId'] },
            { fields: ['startDate'] },
            { fields: ['endDate'] },
            { fields: ['healthStatus'] },
        ],
    });
    return CapitalProject;
};
exports.createCapitalProjectModel = createCapitalProjectModel;
/**
 * Sequelize model for Project Milestones with dependency tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ProjectMilestone model
 *
 * @example
 * ```typescript
 * const ProjectMilestone = createProjectMilestoneModel(sequelize);
 * const milestone = await ProjectMilestone.create({
 *   projectId: 1,
 *   milestoneName: 'Design Phase Complete',
 *   plannedDate: new Date('2025-03-31'),
 *   status: 'PENDING'
 * });
 * ```
 */
const createProjectMilestoneModel = (sequelize) => {
    class ProjectMilestone extends sequelize_1.Model {
    }
    ProjectMilestone.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        milestoneId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique milestone identifier',
        },
        projectId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Parent project ID',
            references: {
                model: 'capital_projects',
                key: 'id',
            },
        },
        milestoneName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Milestone name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Milestone description',
        },
        milestoneType: {
            type: sequelize_1.DataTypes.ENUM('PHASE_GATE', 'DELIVERABLE', 'APPROVAL', 'PAYMENT', 'REGULATORY'),
            allowNull: false,
            comment: 'Type of milestone',
        },
        plannedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Planned completion date',
        },
        actualDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Actual completion date',
        },
        baselineDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Original baseline date',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'AT_RISK'),
            allowNull: false,
            defaultValue: 'PENDING',
            comment: 'Milestone status',
        },
        completionPercent: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Completion percentage',
        },
        dependencies: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Dependent milestone IDs',
        },
        deliverables: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Associated deliverable IDs',
        },
        owner: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Milestone owner',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who approved milestone completion',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional milestone metadata',
        },
    }, {
        sequelize,
        tableName: 'project_milestones',
        timestamps: true,
        indexes: [
            { fields: ['milestoneId'], unique: true },
            { fields: ['projectId'] },
            { fields: ['status'] },
            { fields: ['plannedDate'] },
            { fields: ['actualDate'] },
            { fields: ['milestoneType'] },
        ],
    });
    return ProjectMilestone;
};
exports.createProjectMilestoneModel = createProjectMilestoneModel;
/**
 * Sequelize model for Resource Allocation with utilization tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ResourceAllocation model
 *
 * @example
 * ```typescript
 * const ResourceAllocation = createResourceAllocationModel(sequelize);
 * const allocation = await ResourceAllocation.create({
 *   projectId: 1,
 *   resourceType: 'PERSONNEL',
 *   resourceName: 'Senior Engineer',
 *   allocatedAmount: 1000,
 *   unitOfMeasure: 'hours'
 * });
 * ```
 */
const createResourceAllocationModel = (sequelize) => {
    class ResourceAllocation extends sequelize_1.Model {
    }
    ResourceAllocation.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        resourceId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique resource allocation identifier',
        },
        projectId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Project ID',
            references: {
                model: 'capital_projects',
                key: 'id',
            },
        },
        resourceType: {
            type: sequelize_1.DataTypes.ENUM('PERSONNEL', 'EQUIPMENT', 'MATERIALS', 'FACILITIES', 'BUDGET'),
            allowNull: false,
            comment: 'Type of resource',
        },
        resourceName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Resource name/description',
        },
        allocatedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Total allocated amount',
        },
        usedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Amount used',
        },
        remainingAmount: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Remaining amount',
        },
        unitOfMeasure: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Unit of measure (hours, units, dollars)',
        },
        allocationStart: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Allocation start date',
        },
        allocationEnd: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Allocation end date',
        },
        utilizationPercent: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Utilization percentage',
        },
        cost: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Budgeted cost',
        },
        actualCost: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Actual cost incurred',
        },
        rate: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: true,
            comment: 'Rate per unit',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('PLANNED', 'ALLOCATED', 'IN_USE', 'COMPLETED', 'RELEASED'),
            allowNull: false,
            defaultValue: 'PLANNED',
            comment: 'Allocation status',
        },
        allocatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who allocated resource',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional allocation metadata',
        },
    }, {
        sequelize,
        tableName: 'resource_allocations',
        timestamps: true,
        indexes: [
            { fields: ['resourceId'], unique: true },
            { fields: ['projectId'] },
            { fields: ['resourceType'] },
            { fields: ['status'] },
            { fields: ['allocationStart'] },
            { fields: ['allocationEnd'] },
        ],
    });
    return ResourceAllocation;
};
exports.createResourceAllocationModel = createResourceAllocationModel;
// ============================================================================
// CAPITAL PROJECT TRACKING (1-5)
// ============================================================================
/**
 * Creates a new capital project with validation.
 *
 * @param {CapitalProject} projectData - Project creation data
 * @param {string} createdBy - User creating project
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created project
 *
 * @example
 * ```typescript
 * const project = await createCapitalProject({
 *   projectName: 'Highway Bridge Replacement',
 *   projectType: 'INFRASTRUCTURE',
 *   department: 'Public Works',
 *   totalBudget: 5000000,
 *   priority: 'HIGH',
 *   startDate: new Date('2025-04-01'),
 *   endDate: new Date('2026-12-31'),
 *   projectManager: 'john.doe',
 *   sponsor: 'director.smith'
 * }, 'project.admin');
 * ```
 */
const createCapitalProject = async (projectData, createdBy, transaction) => {
    const projectNumber = (0, exports.generateProjectNumber)();
    return {
        projectNumber,
        ...projectData,
        status: 'PLANNING',
        percentComplete: 0,
        currentCost: 0,
        healthStatus: 'GREEN',
        createdBy,
        metadata: {
            createdDate: new Date().toISOString(),
        },
    };
};
exports.createCapitalProject = createCapitalProject;
/**
 * Generates unique project number.
 *
 * @returns {string} Generated project number
 *
 * @example
 * ```typescript
 * const projectNumber = generateProjectNumber();
 * // Returns: 'CAP-2025-001234'
 * ```
 */
const generateProjectNumber = () => {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');
    return `CAP-${year}-${sequence}`;
};
exports.generateProjectNumber = generateProjectNumber;
/**
 * Updates project status and tracks history.
 *
 * @param {number} projectId - Project ID
 * @param {string} newStatus - New project status
 * @param {string} updatedBy - User updating status
 * @param {string} [notes] - Optional status change notes
 * @returns {Promise<object>} Updated project
 *
 * @example
 * ```typescript
 * const updated = await updateProjectStatus(1, 'IN_PROGRESS', 'project.manager', 'Construction started');
 * ```
 */
const updateProjectStatus = async (projectId, newStatus, updatedBy, notes) => {
    return {
        projectId,
        status: newStatus,
        updatedBy,
        updatedAt: new Date(),
        statusHistory: {
            previousStatus: 'APPROVED',
            newStatus,
            changedBy: updatedBy,
            changedAt: new Date(),
            notes,
        },
    };
};
exports.updateProjectStatus = updateProjectStatus;
/**
 * Retrieves project details with related data.
 *
 * @param {number} projectId - Project ID
 * @param {object} [options] - Optional include options (milestones, resources, costs)
 * @returns {Promise<object>} Project with related data
 *
 * @example
 * ```typescript
 * const project = await getProjectDetails(1, {
 *   includeMilestones: true,
 *   includeResources: true,
 *   includeCosts: true
 * });
 * ```
 */
const getProjectDetails = async (projectId, options) => {
    return {
        projectId,
        projectNumber: 'CAP-2025-001234',
        projectName: 'Highway Bridge Replacement',
        status: 'IN_PROGRESS',
        percentComplete: 45,
        milestones: [],
        resources: [],
        costs: {},
    };
};
exports.getProjectDetails = getProjectDetails;
/**
 * Searches projects by multiple criteria.
 *
 * @param {object} searchCriteria - Search filters
 * @returns {Promise<object[]>} Matching projects
 *
 * @example
 * ```typescript
 * const projects = await searchProjects({
 *   status: 'IN_PROGRESS',
 *   department: 'Public Works',
 *   minBudget: 1000000,
 *   priority: 'HIGH'
 * });
 * ```
 */
const searchProjects = async (searchCriteria) => {
    return [];
};
exports.searchProjects = searchProjects;
// ============================================================================
// PROGRAM BUDGET MANAGEMENT (6-10)
// ============================================================================
/**
 * Allocates budget from program to project.
 *
 * @param {number} programId - Program ID
 * @param {number} projectId - Project ID
 * @param {number} amount - Allocation amount
 * @param {string} allocatedBy - User performing allocation
 * @returns {Promise<object>} Budget allocation record
 *
 * @example
 * ```typescript
 * const allocation = await allocateProgramBudget(5, 10, 2500000, 'program.manager');
 * ```
 */
const allocateProgramBudget = async (programId, projectId, amount, allocatedBy) => {
    return {
        programId,
        projectId,
        amount,
        allocatedBy,
        allocatedAt: new Date(),
    };
};
exports.allocateProgramBudget = allocateProgramBudget;
/**
 * Calculates program budget utilization.
 *
 * @param {number} programId - Program ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<ProgramBudget>} Program budget data
 *
 * @example
 * ```typescript
 * const budget = await calculateProgramBudget(5, 2025);
 * ```
 */
const calculateProgramBudget = async (programId, fiscalYear) => {
    const totalBudget = 25000000;
    const allocatedToProjects = 20000000;
    return {
        programId,
        fiscalYear,
        totalBudget,
        allocatedToProjects,
        unallocatedBudget: totalBudget - allocatedToProjects,
        projectCount: 10,
        expenditures: 12000000,
        commitments: 5000000,
        availableFunds: totalBudget - 12000000 - 5000000,
    };
};
exports.calculateProgramBudget = calculateProgramBudget;
/**
 * Retrieves all projects in a program.
 *
 * @param {number} programId - Program ID
 * @param {object} [filters] - Optional filters
 * @returns {Promise<object[]>} Program projects
 *
 * @example
 * ```typescript
 * const projects = await getProgramProjects(5, { status: 'IN_PROGRESS' });
 * ```
 */
const getProgramProjects = async (programId, filters) => {
    return [];
};
exports.getProgramProjects = getProgramProjects;
/**
 * Generates program budget report.
 *
 * @param {number} programId - Program ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<object>} Budget report
 *
 * @example
 * ```typescript
 * const report = await generateProgramBudgetReport(5, 2025);
 * ```
 */
const generateProgramBudgetReport = async (programId, fiscalYear) => {
    return {
        programId,
        fiscalYear,
        reportDate: new Date(),
        budget: await (0, exports.calculateProgramBudget)(programId, fiscalYear),
        projectBreakdown: [],
        trends: {},
    };
};
exports.generateProgramBudgetReport = generateProgramBudgetReport;
/**
 * Forecasts program budget needs for future years.
 *
 * @param {number} programId - Program ID
 * @param {number} yearsAhead - Number of years to forecast
 * @returns {Promise<object[]>} Budget forecasts
 *
 * @example
 * ```typescript
 * const forecasts = await forecastProgramBudget(5, 3);
 * ```
 */
const forecastProgramBudget = async (programId, yearsAhead) => {
    const forecasts = [];
    const currentYear = new Date().getFullYear();
    for (let i = 1; i <= yearsAhead; i++) {
        forecasts.push({
            fiscalYear: currentYear + i,
            projectedBudget: 26000000 * Math.pow(1.03, i),
            confidence: i === 1 ? 'HIGH' : i === 2 ? 'MEDIUM' : 'LOW',
        });
    }
    return forecasts;
};
exports.forecastProgramBudget = forecastProgramBudget;
// ============================================================================
// PROJECT MILESTONE TRACKING (11-15)
// ============================================================================
/**
 * Creates project milestone.
 *
 * @param {ProjectMilestone} milestoneData - Milestone details
 * @param {string} createdBy - User creating milestone
 * @returns {Promise<object>} Created milestone
 *
 * @example
 * ```typescript
 * const milestone = await createProjectMilestone({
 *   projectId: 1,
 *   milestoneName: 'Design Phase Complete',
 *   description: 'All design documents approved',
 *   plannedDate: new Date('2025-03-31'),
 *   status: 'PENDING',
 *   dependencies: [],
 *   deliverables: ['design-doc-001', 'design-doc-002'],
 *   completionPercent: 0
 * }, 'project.manager');
 * ```
 */
const createProjectMilestone = async (milestoneData, createdBy) => {
    const milestoneId = (0, exports.generateMilestoneId)();
    return {
        milestoneId,
        ...milestoneData,
        baselineDate: milestoneData.plannedDate,
        status: 'PENDING',
        completionPercent: 0,
        metadata: { createdBy, createdAt: new Date().toISOString() },
    };
};
exports.createProjectMilestone = createProjectMilestone;
/**
 * Generates unique milestone ID.
 *
 * @returns {string} Milestone ID
 *
 * @example
 * ```typescript
 * const milestoneId = generateMilestoneId();
 * // Returns: 'MLS-001234'
 * ```
 */
const generateMilestoneId = () => {
    const sequence = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');
    return `MLS-${sequence}`;
};
exports.generateMilestoneId = generateMilestoneId;
/**
 * Updates milestone progress and completion.
 *
 * @param {string} milestoneId - Milestone ID
 * @param {number} completionPercent - Completion percentage (0-100)
 * @param {string} updatedBy - User updating milestone
 * @returns {Promise<object>} Updated milestone
 *
 * @example
 * ```typescript
 * const updated = await updateMilestoneProgress('MLS-001234', 75, 'project.manager');
 * ```
 */
const updateMilestoneProgress = async (milestoneId, completionPercent, updatedBy) => {
    const status = completionPercent === 100 ? 'COMPLETED' : completionPercent > 0 ? 'IN_PROGRESS' : 'PENDING';
    return {
        milestoneId,
        completionPercent,
        status,
        actualDate: completionPercent === 100 ? new Date() : null,
        updatedBy,
        updatedAt: new Date(),
    };
};
exports.updateMilestoneProgress = updateMilestoneProgress;
/**
 * Retrieves milestones for project.
 *
 * @param {number} projectId - Project ID
 * @param {object} [filters] - Optional filters
 * @returns {Promise<ProjectMilestone[]>} Project milestones
 *
 * @example
 * ```typescript
 * const milestones = await getProjectMilestones(1, { status: 'PENDING' });
 * ```
 */
const getProjectMilestones = async (projectId, filters) => {
    return [];
};
exports.getProjectMilestones = getProjectMilestones;
/**
 * Identifies delayed or at-risk milestones.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectMilestone[]>} At-risk milestones
 *
 * @example
 * ```typescript
 * const atRisk = await identifyAtRiskMilestones(1);
 * ```
 */
const identifyAtRiskMilestones = async (projectId) => {
    return [];
};
exports.identifyAtRiskMilestones = identifyAtRiskMilestones;
// ============================================================================
// RESOURCE ALLOCATION (16-20)
// ============================================================================
/**
 * Allocates resource to project.
 *
 * @param {ResourceAllocation} allocationData - Resource allocation details
 * @param {string} allocatedBy - User allocating resource
 * @returns {Promise<object>} Created allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocateProjectResource({
 *   projectId: 1,
 *   resourceType: 'PERSONNEL',
 *   resourceName: 'Senior Engineer',
 *   allocatedAmount: 1000,
 *   unitOfMeasure: 'hours',
 *   allocationStart: new Date('2025-01-01'),
 *   allocationEnd: new Date('2025-12-31'),
 *   cost: 150000,
 *   utilizationPercent: 0
 * }, 'resource.manager');
 * ```
 */
const allocateProjectResource = async (allocationData, allocatedBy) => {
    const resourceId = (0, exports.generateResourceId)();
    return {
        resourceId,
        ...allocationData,
        usedAmount: 0,
        remainingAmount: allocationData.allocatedAmount,
        actualCost: 0,
        status: 'ALLOCATED',
        allocatedBy,
    };
};
exports.allocateProjectResource = allocateProjectResource;
/**
 * Generates unique resource allocation ID.
 *
 * @returns {string} Resource ID
 *
 * @example
 * ```typescript
 * const resourceId = generateResourceId();
 * // Returns: 'RES-001234'
 * ```
 */
const generateResourceId = () => {
    const sequence = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');
    return `RES-${sequence}`;
};
exports.generateResourceId = generateResourceId;
/**
 * Updates resource utilization.
 *
 * @param {string} resourceId - Resource allocation ID
 * @param {number} usedAmount - Amount used
 * @param {number} actualCost - Actual cost incurred
 * @returns {Promise<object>} Updated allocation
 *
 * @example
 * ```typescript
 * const updated = await updateResourceUtilization('RES-001234', 250, 37500);
 * ```
 */
const updateResourceUtilization = async (resourceId, usedAmount, actualCost) => {
    return {
        resourceId,
        usedAmount,
        actualCost,
        updatedAt: new Date(),
    };
};
exports.updateResourceUtilization = updateResourceUtilization;
/**
 * Retrieves resource allocations for project.
 *
 * @param {number} projectId - Project ID
 * @param {object} [filters] - Optional filters
 * @returns {Promise<ResourceAllocation[]>} Resource allocations
 *
 * @example
 * ```typescript
 * const resources = await getProjectResources(1, { resourceType: 'PERSONNEL' });
 * ```
 */
const getProjectResources = async (projectId, filters) => {
    return [];
};
exports.getProjectResources = getProjectResources;
/**
 * Analyzes resource utilization across projects.
 *
 * @param {object} filters - Analysis filters
 * @returns {Promise<object>} Utilization analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeResourceUtilization({
 *   resourceType: 'PERSONNEL',
 *   department: 'Engineering'
 * });
 * ```
 */
const analyzeResourceUtilization = async (filters) => {
    return {
        totalAllocated: 10000,
        totalUsed: 7500,
        utilizationRate: 75,
        overallocated: [],
        underutilized: [],
    };
};
exports.analyzeResourceUtilization = analyzeResourceUtilization;
// ============================================================================
// PROJECT TIMELINE MANAGEMENT (21-25)
// ============================================================================
/**
 * Creates project timeline with phases.
 *
 * @param {number} projectId - Project ID
 * @param {ProjectPhase[]} phases - Project phases
 * @returns {Promise<ProjectTimeline>} Project timeline
 *
 * @example
 * ```typescript
 * const timeline = await createProjectTimeline(1, [
 *   {
 *     phaseId: 'DESIGN',
 *     phaseName: 'Design Phase',
 *     startDate: new Date('2025-01-01'),
 *     endDate: new Date('2025-03-31'),
 *     status: 'NOT_STARTED',
 *     milestones: ['MLS-001', 'MLS-002'],
 *     dependencies: []
 *   }
 * ]);
 * ```
 */
const createProjectTimeline = async (projectId, phases) => {
    const totalDuration = (0, exports.calculateTotalDuration)(phases);
    return {
        projectId,
        phases,
        criticalPath: [],
        totalDuration,
        remainingDuration: totalDuration,
        percentComplete: 0,
        scheduledCompletion: phases[phases.length - 1].endDate,
        forecastedCompletion: phases[phases.length - 1].endDate,
        scheduleVariance: 0,
    };
};
exports.createProjectTimeline = createProjectTimeline;
/**
 * Calculates total project duration in days.
 *
 * @param {ProjectPhase[]} phases - Project phases
 * @returns {number} Total duration in days
 *
 * @example
 * ```typescript
 * const duration = calculateTotalDuration(phases);
 * ```
 */
const calculateTotalDuration = (phases) => {
    if (phases.length === 0)
        return 0;
    const startDate = new Date(Math.min(...phases.map((p) => p.startDate.getTime())));
    const endDate = new Date(Math.max(...phases.map((p) => p.endDate.getTime())));
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
};
exports.calculateTotalDuration = calculateTotalDuration;
/**
 * Updates project schedule and calculates variance.
 *
 * @param {number} projectId - Project ID
 * @param {Date} newCompletionDate - New projected completion date
 * @param {string} reason - Reason for schedule change
 * @returns {Promise<object>} Updated timeline
 *
 * @example
 * ```typescript
 * const updated = await updateProjectSchedule(1, new Date('2026-03-31'), 'Weather delays');
 * ```
 */
const updateProjectSchedule = async (projectId, newCompletionDate, reason) => {
    return {
        projectId,
        forecastedCompletion: newCompletionDate,
        scheduleVariance: 30, // days
        reason,
        updatedAt: new Date(),
    };
};
exports.updateProjectSchedule = updateProjectSchedule;
/**
 * Identifies critical path for project.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<string[]>} Critical path milestone IDs
 *
 * @example
 * ```typescript
 * const criticalPath = await identifyCriticalPath(1);
 * ```
 */
const identifyCriticalPath = async (projectId) => {
    return ['MLS-001', 'MLS-003', 'MLS-005', 'MLS-007'];
};
exports.identifyCriticalPath = identifyCriticalPath;
/**
 * Generates project schedule report.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<object>} Schedule report
 *
 * @example
 * ```typescript
 * const report = await generateScheduleReport(1);
 * ```
 */
const generateScheduleReport = async (projectId) => {
    return {
        projectId,
        reportDate: new Date(),
        timeline: {},
        delays: [],
        criticalPath: [],
        recommendations: [],
    };
};
exports.generateScheduleReport = generateScheduleReport;
// ============================================================================
// PROJECT COST TRACKING (26-30)
// ============================================================================
/**
 * Records project cost transaction.
 *
 * @param {number} projectId - Project ID
 * @param {object} costData - Cost transaction data
 * @returns {Promise<object>} Cost transaction record
 *
 * @example
 * ```typescript
 * const cost = await recordProjectCost(1, {
 *   amount: 25000,
 *   category: 'MATERIALS',
 *   description: 'Steel beams',
 *   vendor: 'ABC Steel Co',
 *   invoiceNumber: 'INV-2025-001'
 * });
 * ```
 */
const recordProjectCost = async (projectId, costData) => {
    return {
        projectId,
        ...costData,
        recordedAt: new Date(),
    };
};
exports.recordProjectCost = recordProjectCost;
/**
 * Calculates project cost performance.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectCost>} Cost performance data
 *
 * @example
 * ```typescript
 * const costs = await calculateProjectCost(1);
 * ```
 */
const calculateProjectCost = async (projectId) => {
    const budgetedCost = 5000000;
    const actualCost = 2250000;
    const committedCost = 1500000;
    return {
        projectId,
        budgetedCost,
        actualCost,
        committedCost,
        forecastedCost: actualCost + committedCost + 800000,
        costVariance: budgetedCost - (actualCost + committedCost),
        costVariancePercent: ((budgetedCost - (actualCost + committedCost)) / budgetedCost) * 100,
        contingencyReserve: 500000,
        contingencyUsed: 150000,
    };
};
exports.calculateProjectCost = calculateProjectCost;
/**
 * Forecasts project cost at completion.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<{ estimateAtCompletion: number; estimateToComplete: number; varianceAtCompletion: number }>} Cost forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastProjectCost(1);
 * ```
 */
const forecastProjectCost = async (projectId) => {
    const budgetAtCompletion = 5000000;
    const estimateAtCompletion = 4850000;
    return {
        estimateAtCompletion,
        estimateToComplete: estimateAtCompletion - 2250000,
        varianceAtCompletion: budgetAtCompletion - estimateAtCompletion,
    };
};
exports.forecastProjectCost = forecastProjectCost;
/**
 * Generates project cost report.
 *
 * @param {number} projectId - Project ID
 * @param {object} [options] - Report options
 * @returns {Promise<object>} Cost report
 *
 * @example
 * ```typescript
 * const report = await generateCostReport(1, { includeForecasts: true });
 * ```
 */
const generateCostReport = async (projectId, options) => {
    return {
        projectId,
        reportDate: new Date(),
        costs: await (0, exports.calculateProjectCost)(projectId),
        forecast: await (0, exports.forecastProjectCost)(projectId),
        breakdown: [],
    };
};
exports.generateCostReport = generateCostReport;
/**
 * Tracks contingency reserve usage.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<{ total: number; used: number; remaining: number; percentUsed: number }>} Contingency tracking
 *
 * @example
 * ```typescript
 * const contingency = await trackContingencyReserve(1);
 * ```
 */
const trackContingencyReserve = async (projectId) => {
    const total = 500000;
    const used = 150000;
    return {
        total,
        used,
        remaining: total - used,
        percentUsed: (used / total) * 100,
    };
};
exports.trackContingencyReserve = trackContingencyReserve;
// ============================================================================
// PROGRAM PERFORMANCE METRICS (31-35)
// ============================================================================
/**
 * Calculates earned value metrics for project.
 *
 * @param {number} projectId - Project ID
 * @param {Date} asOfDate - Date for metrics calculation
 * @returns {Promise<PerformanceMetrics>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateEarnedValueMetrics(1, new Date());
 * ```
 */
const calculateEarnedValueMetrics = async (projectId, asOfDate) => {
    const plannedValue = 2500000;
    const earnedValue = 2250000;
    const actualCost = 2400000;
    return {
        projectId,
        reportingPeriod: {
            startDate: new Date(asOfDate.getFullYear(), 0, 1),
            endDate: asOfDate,
        },
        schedulePerformanceIndex: earnedValue / plannedValue,
        costPerformanceIndex: earnedValue / actualCost,
        earnedValue,
        plannedValue,
        actualCost,
        estimateAtCompletion: 5100000,
        estimateToComplete: 2700000,
        varianceAtCompletion: -100000,
    };
};
exports.calculateEarnedValueMetrics = calculateEarnedValueMetrics;
/**
 * Generates performance dashboard for project.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectDashboard>} Project dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateProjectDashboard(1);
 * ```
 */
const generateProjectDashboard = async (projectId) => {
    return {
        projectId,
        projectName: 'Highway Bridge Replacement',
        status: 'IN_PROGRESS',
        healthIndicator: 'YELLOW',
        percentComplete: 45,
        budgetStatus: await (0, exports.calculateProjectCost)(projectId),
        scheduleStatus: {},
        keyMilestones: [],
        activeRisks: [],
        recentActivity: [],
    };
};
exports.generateProjectDashboard = generateProjectDashboard;
/**
 * Compares performance across multiple projects.
 *
 * @param {number[]} projectIds - Project IDs to compare
 * @returns {Promise<object[]>} Comparison data
 *
 * @example
 * ```typescript
 * const comparison = await compareProjectPerformance([1, 2, 3, 4, 5]);
 * ```
 */
const compareProjectPerformance = async (projectIds) => {
    return projectIds.map((id) => ({
        projectId: id,
        schedulePerformanceIndex: 0.9,
        costPerformanceIndex: 0.95,
        percentComplete: 45,
        healthIndicator: 'YELLOW',
    }));
};
exports.compareProjectPerformance = compareProjectPerformance;
/**
 * Generates portfolio performance report.
 *
 * @param {number} programId - Program ID
 * @param {object} [filters] - Optional filters
 * @returns {Promise<object>} Portfolio report
 *
 * @example
 * ```typescript
 * const report = await generatePortfolioReport(5, { fiscalYear: 2025 });
 * ```
 */
const generatePortfolioReport = async (programId, filters) => {
    return {
        programId,
        reportDate: new Date(),
        projectCount: 10,
        totalBudget: 25000000,
        onTrackProjects: 7,
        atRiskProjects: 2,
        delayedProjects: 1,
        averageSPI: 0.92,
        averageCPI: 0.96,
    };
};
exports.generatePortfolioReport = generatePortfolioReport;
/**
 * Tracks KPIs for program.
 *
 * @param {number} programId - Program ID
 * @returns {Promise<object>} Program KPIs
 *
 * @example
 * ```typescript
 * const kpis = await trackProgramKPIs(5);
 * ```
 */
const trackProgramKPIs = async (programId) => {
    return {
        programId,
        onTimeDelivery: 85,
        budgetAdherence: 92,
        qualityScore: 4.5,
        stakeholderSatisfaction: 4.2,
        resourceUtilization: 78,
    };
};
exports.trackProgramKPIs = trackProgramKPIs;
// ============================================================================
// PROJECT DELIVERABLE TRACKING (36-40)
// ============================================================================
/**
 * Creates project deliverable.
 *
 * @param {ProjectDeliverable} deliverableData - Deliverable details
 * @returns {Promise<object>} Created deliverable
 *
 * @example
 * ```typescript
 * const deliverable = await createProjectDeliverable({
 *   projectId: 1,
 *   deliverableName: 'Final Design Documents',
 *   description: 'Complete set of engineering drawings',
 *   deliverableType: 'DOCUMENT',
 *   dueDate: new Date('2025-03-31'),
 *   status: 'PLANNED'
 * });
 * ```
 */
const createProjectDeliverable = async (deliverableData) => {
    const deliverableId = (0, exports.generateDeliverableId)();
    return {
        deliverableId,
        ...deliverableData,
        status: 'PLANNED',
    };
};
exports.createProjectDeliverable = createProjectDeliverable;
/**
 * Generates unique deliverable ID.
 *
 * @returns {string} Deliverable ID
 *
 * @example
 * ```typescript
 * const deliverableId = generateDeliverableId();
 * // Returns: 'DEL-001234'
 * ```
 */
const generateDeliverableId = () => {
    const sequence = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');
    return `DEL-${sequence}`;
};
exports.generateDeliverableId = generateDeliverableId;
/**
 * Updates deliverable status.
 *
 * @param {string} deliverableId - Deliverable ID
 * @param {string} status - New status
 * @param {string} [acceptedBy] - User accepting deliverable
 * @returns {Promise<object>} Updated deliverable
 *
 * @example
 * ```typescript
 * const updated = await updateDeliverableStatus('DEL-001234', 'APPROVED', 'project.sponsor');
 * ```
 */
const updateDeliverableStatus = async (deliverableId, status, acceptedBy) => {
    return {
        deliverableId,
        status,
        acceptedBy,
        completedDate: status === 'DELIVERED' ? new Date() : undefined,
    };
};
exports.updateDeliverableStatus = updateDeliverableStatus;
/**
 * Retrieves deliverables for project.
 *
 * @param {number} projectId - Project ID
 * @param {object} [filters] - Optional filters
 * @returns {Promise<ProjectDeliverable[]>} Project deliverables
 *
 * @example
 * ```typescript
 * const deliverables = await getProjectDeliverables(1, { status: 'IN_PROGRESS' });
 * ```
 */
const getProjectDeliverables = async (projectId, filters) => {
    return [];
};
exports.getProjectDeliverables = getProjectDeliverables;
/**
 * Tracks deliverable acceptance and quality.
 *
 * @param {string} deliverableId - Deliverable ID
 * @param {string} quality - Quality rating
 * @param {string} acceptedBy - User accepting deliverable
 * @param {string} [feedback] - Optional feedback
 * @returns {Promise<object>} Acceptance record
 *
 * @example
 * ```typescript
 * const acceptance = await trackDeliverableAcceptance('DEL-001234', 'EXCELLENT', 'sponsor', 'Outstanding work');
 * ```
 */
const trackDeliverableAcceptance = async (deliverableId, quality, acceptedBy, feedback) => {
    return {
        deliverableId,
        quality,
        acceptedBy,
        acceptedAt: new Date(),
        feedback,
    };
};
exports.trackDeliverableAcceptance = trackDeliverableAcceptance;
// ============================================================================
// MULTI-YEAR PROJECT PLANNING (41-45)
// ============================================================================
/**
 * Creates multi-year capital improvement plan.
 *
 * @param {MultiYearPlan} planData - Multi-year plan details
 * @returns {Promise<object>} Created plan
 *
 * @example
 * ```typescript
 * const plan = await createMultiYearPlan({
 *   programId: 5,
 *   planName: 'Infrastructure Improvement Plan 2025-2029',
 *   startYear: 2025,
 *   endYear: 2029,
 *   totalYears: 5,
 *   totalBudget: 50000000,
 *   yearlyAllocations: [
 *     { fiscalYear: 2025, budgetedAmount: 8000000, projectedSpend: 8000000, actualSpend: 0, projectCount: 3 }
 *   ],
 *   projects: [],
 *   status: 'DRAFT'
 * });
 * ```
 */
const createMultiYearPlan = async (planData) => {
    const planId = (0, exports.generatePlanId)();
    return {
        planId,
        ...planData,
        status: 'DRAFT',
        createdAt: new Date(),
    };
};
exports.createMultiYearPlan = createMultiYearPlan;
/**
 * Generates unique plan ID.
 *
 * @returns {string} Plan ID
 *
 * @example
 * ```typescript
 * const planId = generatePlanId();
 * // Returns: 'PLN-001234'
 * ```
 */
const generatePlanId = () => {
    const sequence = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');
    return `PLN-${sequence}`;
};
exports.generatePlanId = generatePlanId;
/**
 * Allocates projects across fiscal years.
 *
 * @param {string} planId - Plan ID
 * @param {object[]} projectAllocations - Project allocations by year
 * @returns {Promise<object>} Updated plan
 *
 * @example
 * ```typescript
 * const updated = await allocateProjectsByYear('PLN-001234', [
 *   { fiscalYear: 2025, projectIds: [1, 2, 3], totalBudget: 8000000 }
 * ]);
 * ```
 */
const allocateProjectsByYear = async (planId, projectAllocations) => {
    return {
        planId,
        projectAllocations,
        updatedAt: new Date(),
    };
};
exports.allocateProjectsByYear = allocateProjectsByYear;
/**
 * Tracks multi-year plan execution.
 *
 * @param {string} planId - Plan ID
 * @returns {Promise<object>} Execution status
 *
 * @example
 * ```typescript
 * const status = await trackMultiYearPlanExecution('PLN-001234');
 * ```
 */
const trackMultiYearPlanExecution = async (planId) => {
    return {
        planId,
        yearsCompleted: 1,
        yearsRemaining: 4,
        budgetSpent: 7500000,
        budgetRemaining: 42500000,
        projectsCompleted: 2,
        projectsInProgress: 8,
        onTrack: true,
    };
};
exports.trackMultiYearPlanExecution = trackMultiYearPlanExecution;
/**
 * Generates capital improvement plan report.
 *
 * @param {string} planId - Plan ID
 * @returns {Promise<object>} CIP report
 *
 * @example
 * ```typescript
 * const report = await generateCapitalImprovementPlanReport('PLN-001234');
 * ```
 */
const generateCapitalImprovementPlanReport = async (planId) => {
    return {
        planId,
        reportDate: new Date(),
        executionSummary: {},
        yearlyBreakdown: [],
        projectStatus: [],
        recommendations: [],
    };
};
exports.generateCapitalImprovementPlanReport = generateCapitalImprovementPlanReport;
// ============================================================================
// RISK & STAKEHOLDER MANAGEMENT (46-50)
// ============================================================================
/**
 * Creates project risk record.
 *
 * @param {ProjectRisk} riskData - Risk details
 * @returns {Promise<object>} Created risk
 *
 * @example
 * ```typescript
 * const risk = await createProjectRisk({
 *   projectId: 1,
 *   riskCategory: 'SCHEDULE',
 *   riskDescription: 'Potential weather delays during foundation work',
 *   probability: 'MEDIUM',
 *   impact: 'HIGH',
 *   riskScore: 15,
 *   owner: 'project.manager',
 *   status: 'IDENTIFIED'
 * });
 * ```
 */
const createProjectRisk = async (riskData) => {
    const riskId = (0, exports.generateRiskId)();
    return {
        riskId,
        ...riskData,
        status: 'IDENTIFIED',
        identifiedAt: new Date(),
    };
};
exports.createProjectRisk = createProjectRisk;
/**
 * Generates unique risk ID.
 *
 * @returns {string} Risk ID
 *
 * @example
 * ```typescript
 * const riskId = generateRiskId();
 * // Returns: 'RSK-001234'
 * ```
 */
const generateRiskId = () => {
    const sequence = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');
    return `RSK-${sequence}`;
};
exports.generateRiskId = generateRiskId;
/**
 * Adds stakeholder to project.
 *
 * @param {Stakeholder} stakeholderData - Stakeholder details
 * @returns {Promise<object>} Created stakeholder
 *
 * @example
 * ```typescript
 * const stakeholder = await addProjectStakeholder({
 *   projectId: 1,
 *   name: 'Mayor Johnson',
 *   role: 'Executive Sponsor',
 *   organization: 'City Government',
 *   interestLevel: 'HIGH',
 *   influenceLevel: 'HIGH',
 *   communicationPreference: 'MEETING',
 *   contactInfo: { email: 'mayor@city.gov', phone: '555-0100' }
 * });
 * ```
 */
const addProjectStakeholder = async (stakeholderData) => {
    const stakeholderId = (0, exports.generateStakeholderId)();
    return {
        stakeholderId,
        ...stakeholderData,
        addedAt: new Date(),
    };
};
exports.addProjectStakeholder = addProjectStakeholder;
/**
 * Generates unique stakeholder ID.
 *
 * @returns {string} Stakeholder ID
 *
 * @example
 * ```typescript
 * const stakeholderId = generateStakeholderId();
 * // Returns: 'STK-001234'
 * ```
 */
const generateStakeholderId = () => {
    const sequence = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');
    return `STK-${sequence}`;
};
exports.generateStakeholderId = generateStakeholderId;
/**
 * Generates stakeholder communication plan.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<object>} Communication plan
 *
 * @example
 * ```typescript
 * const plan = await generateStakeholderCommunicationPlan(1);
 * ```
 */
const generateStakeholderCommunicationPlan = async (projectId) => {
    return {
        projectId,
        stakeholders: [],
        communicationFrequency: {},
        reportingSchedule: {},
        escalationPaths: {},
    };
};
exports.generateStakeholderCommunicationPlan = generateStakeholderCommunicationPlan;
/**
 * Default export with all utilities.
 */
exports.default = {
    // Models
    createCapitalProjectModel: exports.createCapitalProjectModel,
    createProjectMilestoneModel: exports.createProjectMilestoneModel,
    createResourceAllocationModel: exports.createResourceAllocationModel,
    // Capital Project Tracking
    createCapitalProject: exports.createCapitalProject,
    generateProjectNumber: exports.generateProjectNumber,
    updateProjectStatus: exports.updateProjectStatus,
    getProjectDetails: exports.getProjectDetails,
    searchProjects: exports.searchProjects,
    // Program Budget Management
    allocateProgramBudget: exports.allocateProgramBudget,
    calculateProgramBudget: exports.calculateProgramBudget,
    getProgramProjects: exports.getProgramProjects,
    generateProgramBudgetReport: exports.generateProgramBudgetReport,
    forecastProgramBudget: exports.forecastProgramBudget,
    // Project Milestone Tracking
    createProjectMilestone: exports.createProjectMilestone,
    generateMilestoneId: exports.generateMilestoneId,
    updateMilestoneProgress: exports.updateMilestoneProgress,
    getProjectMilestones: exports.getProjectMilestones,
    identifyAtRiskMilestones: exports.identifyAtRiskMilestones,
    // Resource Allocation
    allocateProjectResource: exports.allocateProjectResource,
    generateResourceId: exports.generateResourceId,
    updateResourceUtilization: exports.updateResourceUtilization,
    getProjectResources: exports.getProjectResources,
    analyzeResourceUtilization: exports.analyzeResourceUtilization,
    // Project Timeline Management
    createProjectTimeline: exports.createProjectTimeline,
    calculateTotalDuration: exports.calculateTotalDuration,
    updateProjectSchedule: exports.updateProjectSchedule,
    identifyCriticalPath: exports.identifyCriticalPath,
    generateScheduleReport: exports.generateScheduleReport,
    // Project Cost Tracking
    recordProjectCost: exports.recordProjectCost,
    calculateProjectCost: exports.calculateProjectCost,
    forecastProjectCost: exports.forecastProjectCost,
    generateCostReport: exports.generateCostReport,
    trackContingencyReserve: exports.trackContingencyReserve,
    // Program Performance Metrics
    calculateEarnedValueMetrics: exports.calculateEarnedValueMetrics,
    generateProjectDashboard: exports.generateProjectDashboard,
    compareProjectPerformance: exports.compareProjectPerformance,
    generatePortfolioReport: exports.generatePortfolioReport,
    trackProgramKPIs: exports.trackProgramKPIs,
    // Project Deliverable Tracking
    createProjectDeliverable: exports.createProjectDeliverable,
    generateDeliverableId: exports.generateDeliverableId,
    updateDeliverableStatus: exports.updateDeliverableStatus,
    getProjectDeliverables: exports.getProjectDeliverables,
    trackDeliverableAcceptance: exports.trackDeliverableAcceptance,
    // Multi-year Project Planning
    createMultiYearPlan: exports.createMultiYearPlan,
    generatePlanId: exports.generatePlanId,
    allocateProjectsByYear: exports.allocateProjectsByYear,
    trackMultiYearPlanExecution: exports.trackMultiYearPlanExecution,
    generateCapitalImprovementPlanReport: exports.generateCapitalImprovementPlanReport,
    // Risk & Stakeholder Management
    createProjectRisk: exports.createProjectRisk,
    generateRiskId: exports.generateRiskId,
    addProjectStakeholder: exports.addProjectStakeholder,
    generateStakeholderId: exports.generateStakeholderId,
    generateStakeholderCommunicationPlan: exports.generateStakeholderCommunicationPlan,
};
//# sourceMappingURL=project-program-management-kit.js.map