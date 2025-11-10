"use strict";
/**
 * ASSET DEPLOYMENT COMMAND FUNCTIONS
 *
 * Enterprise-grade asset deployment and commissioning management system competing with
 * Oracle JD Edwards EnterpriseOne. Provides comprehensive functionality for:
 * - Deployment workflow orchestration
 * - Installation tracking and management
 * - Site preparation validation
 * - Resource allocation and scheduling
 * - Configuration setup and testing
 * - Commissioning procedures
 * - Acceptance testing workflows
 * - Go-live procedures and cutover
 * - Deployment rollback capabilities
 * - Post-deployment verification
 *
 * @module AssetDeploymentCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   createDeploymentPlan,
 *   scheduleDeployment,
 *   allocateDeploymentResources,
 *   executeDeployment,
 *   DeploymentPlan,
 *   DeploymentStatus
 * } from './asset-deployment-commands';
 *
 * // Create deployment plan
 * const plan = await createDeploymentPlan({
 *   assetId: 'asset-123',
 *   siteId: 'site-456',
 *   plannedDate: new Date('2024-06-15'),
 *   deploymentType: DeploymentType.NEW_INSTALLATION,
 *   requiresSitePrep: true,
 *   estimatedDuration: 480 // minutes
 * });
 *
 * // Schedule deployment with resources
 * await scheduleDeployment(plan.id, {
 *   technicianIds: ['tech-1', 'tech-2'],
 *   equipmentIds: ['crane-1', 'tools-set-5']
 * });
 * ```
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
exports.CommissioningRecord = exports.GoLivePlan = exports.DeploymentAcceptance = exports.DeploymentTest = exports.DeploymentConfiguration = exports.InstallationProgress = exports.ResourceAllocation = exports.SitePreparation = exports.DeploymentPlan = exports.DeploymentPriority = exports.CommissioningStatus = exports.ResourceType = exports.AcceptanceStatus = exports.TestStatus = exports.InstallationPhase = exports.SitePrepStatus = exports.DeploymentType = exports.DeploymentStatus = void 0;
exports.createDeploymentPlan = createDeploymentPlan;
exports.updateDeploymentPlan = updateDeploymentPlan;
exports.scheduleDeployment = scheduleDeployment;
exports.getDeploymentsByStatus = getDeploymentsByStatus;
exports.getDeploymentsBySite = getDeploymentsBySite;
exports.getDeploymentsByAsset = getDeploymentsByAsset;
exports.cancelDeployment = cancelDeployment;
exports.createSitePreparation = createSitePreparation;
exports.updateSitePrepRequirement = updateSitePrepRequirement;
exports.startSitePreparation = startSitePreparation;
exports.completeSitePreparation = completeSitePreparation;
exports.getSitePreparationForDeployment = getSitePreparationForDeployment;
exports.allocateDeploymentResource = allocateDeploymentResource;
exports.deallocateDeploymentResource = deallocateDeploymentResource;
exports.getDeploymentResourceAllocations = getDeploymentResourceAllocations;
exports.checkResourceAvailability = checkResourceAvailability;
exports.bulkAllocateResources = bulkAllocateResources;
exports.startDeploymentExecution = startDeploymentExecution;
exports.updateInstallationProgress = updateInstallationProgress;
exports.recordInstallationIssue = recordInstallationIssue;
exports.resolveInstallationIssue = resolveInstallationIssue;
exports.getInstallationProgressHistory = getInstallationProgressHistory;
exports.recordDeploymentConfiguration = recordDeploymentConfiguration;
exports.validateConfiguration = validateConfiguration;
exports.getDeploymentConfigurations = getDeploymentConfigurations;
exports.executeDeploymentTests = executeDeploymentTests;
exports.updateTestCaseResult = updateTestCaseResult;
exports.createAcceptanceCriteria = createAcceptanceCriteria;
exports.recordAcceptanceDecision = recordAcceptanceDecision;
exports.createGoLivePlan = createGoLivePlan;
exports.executeGoLive = executeGoLive;
exports.triggerRollback = triggerRollback;
exports.createCommissioningRecord = createCommissioningRecord;
exports.completeCommissioning = completeCommissioning;
exports.getCommissioningRecord = getCommissioningRecord;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Deployment status
 */
var DeploymentStatus;
(function (DeploymentStatus) {
    DeploymentStatus["PLANNED"] = "planned";
    DeploymentStatus["SCHEDULED"] = "scheduled";
    DeploymentStatus["SITE_PREP_IN_PROGRESS"] = "site_prep_in_progress";
    DeploymentStatus["READY_FOR_DEPLOYMENT"] = "ready_for_deployment";
    DeploymentStatus["IN_PROGRESS"] = "in_progress";
    DeploymentStatus["TESTING"] = "testing";
    DeploymentStatus["COMPLETED"] = "completed";
    DeploymentStatus["ON_HOLD"] = "on_hold";
    DeploymentStatus["CANCELLED"] = "cancelled";
    DeploymentStatus["FAILED"] = "failed";
    DeploymentStatus["ROLLED_BACK"] = "rolled_back";
})(DeploymentStatus || (exports.DeploymentStatus = DeploymentStatus = {}));
/**
 * Deployment type
 */
var DeploymentType;
(function (DeploymentType) {
    DeploymentType["NEW_INSTALLATION"] = "new_installation";
    DeploymentType["REPLACEMENT"] = "replacement";
    DeploymentType["UPGRADE"] = "upgrade";
    DeploymentType["RELOCATION"] = "relocation";
    DeploymentType["EXPANSION"] = "expansion";
    DeploymentType["TEMPORARY"] = "temporary";
})(DeploymentType || (exports.DeploymentType = DeploymentType = {}));
/**
 * Site preparation status
 */
var SitePrepStatus;
(function (SitePrepStatus) {
    SitePrepStatus["NOT_REQUIRED"] = "not_required";
    SitePrepStatus["PENDING"] = "pending";
    SitePrepStatus["IN_PROGRESS"] = "in_progress";
    SitePrepStatus["COMPLETED"] = "completed";
    SitePrepStatus["FAILED"] = "failed";
})(SitePrepStatus || (exports.SitePrepStatus = SitePrepStatus = {}));
/**
 * Installation phase
 */
var InstallationPhase;
(function (InstallationPhase) {
    InstallationPhase["PRE_INSTALLATION"] = "pre_installation";
    InstallationPhase["PHYSICAL_INSTALLATION"] = "physical_installation";
    InstallationPhase["ELECTRICAL_INSTALLATION"] = "electrical_installation";
    InstallationPhase["NETWORK_INSTALLATION"] = "network_installation";
    InstallationPhase["CONFIGURATION"] = "configuration";
    InstallationPhase["CALIBRATION"] = "calibration";
    InstallationPhase["TESTING"] = "testing";
    InstallationPhase["DOCUMENTATION"] = "documentation";
})(InstallationPhase || (exports.InstallationPhase = InstallationPhase = {}));
/**
 * Test status
 */
var TestStatus;
(function (TestStatus) {
    TestStatus["NOT_STARTED"] = "not_started";
    TestStatus["IN_PROGRESS"] = "in_progress";
    TestStatus["PASSED"] = "passed";
    TestStatus["FAILED"] = "failed";
    TestStatus["CONDITIONAL_PASS"] = "conditional_pass";
})(TestStatus || (exports.TestStatus = TestStatus = {}));
/**
 * Acceptance status
 */
var AcceptanceStatus;
(function (AcceptanceStatus) {
    AcceptanceStatus["PENDING"] = "pending";
    AcceptanceStatus["CUSTOMER_REVIEW"] = "customer_review";
    AcceptanceStatus["ACCEPTED"] = "accepted";
    AcceptanceStatus["REJECTED"] = "rejected";
    AcceptanceStatus["ACCEPTED_WITH_EXCEPTIONS"] = "accepted_with_exceptions";
})(AcceptanceStatus || (exports.AcceptanceStatus = AcceptanceStatus = {}));
/**
 * Resource type
 */
var ResourceType;
(function (ResourceType) {
    ResourceType["TECHNICIAN"] = "technician";
    ResourceType["EQUIPMENT"] = "equipment";
    ResourceType["TOOL"] = "tool";
    ResourceType["MATERIAL"] = "material";
    ResourceType["VEHICLE"] = "vehicle";
    ResourceType["SPECIALIST"] = "specialist";
})(ResourceType || (exports.ResourceType = ResourceType = {}));
/**
 * Commissioning status
 */
var CommissioningStatus;
(function (CommissioningStatus) {
    CommissioningStatus["NOT_STARTED"] = "not_started";
    CommissioningStatus["IN_PROGRESS"] = "in_progress";
    CommissioningStatus["COMPLETED"] = "completed";
    CommissioningStatus["FAILED"] = "failed";
    CommissioningStatus["DEFERRED"] = "deferred";
})(CommissioningStatus || (exports.CommissioningStatus = CommissioningStatus = {}));
/**
 * Deployment priority
 */
var DeploymentPriority;
(function (DeploymentPriority) {
    DeploymentPriority["CRITICAL"] = "critical";
    DeploymentPriority["HIGH"] = "high";
    DeploymentPriority["MEDIUM"] = "medium";
    DeploymentPriority["LOW"] = "low";
})(DeploymentPriority || (exports.DeploymentPriority = DeploymentPriority = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Deployment Plan Model
 */
let DeploymentPlan = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'deployment_plans',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['deployment_number'], unique: true },
                { fields: ['asset_id'] },
                { fields: ['site_id'] },
                { fields: ['status'] },
                { fields: ['priority'] },
                { fields: ['planned_start_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateDeploymentNumber_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _deploymentNumber_decorators;
    let _deploymentNumber_initializers = [];
    let _deploymentNumber_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _siteId_decorators;
    let _siteId_initializers = [];
    let _siteId_extraInitializers = [];
    let _locationId_decorators;
    let _locationId_initializers = [];
    let _locationId_extraInitializers = [];
    let _deploymentType_decorators;
    let _deploymentType_initializers = [];
    let _deploymentType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _plannedStartDate_decorators;
    let _plannedStartDate_initializers = [];
    let _plannedStartDate_extraInitializers = [];
    let _plannedEndDate_decorators;
    let _plannedEndDate_initializers = [];
    let _plannedEndDate_extraInitializers = [];
    let _actualStartDate_decorators;
    let _actualStartDate_initializers = [];
    let _actualStartDate_extraInitializers = [];
    let _actualEndDate_decorators;
    let _actualEndDate_initializers = [];
    let _actualEndDate_extraInitializers = [];
    let _estimatedDuration_decorators;
    let _estimatedDuration_initializers = [];
    let _estimatedDuration_extraInitializers = [];
    let _actualDuration_decorators;
    let _actualDuration_initializers = [];
    let _actualDuration_extraInitializers = [];
    let _requiresSitePrep_decorators;
    let _requiresSitePrep_initializers = [];
    let _requiresSitePrep_extraInitializers = [];
    let _sitePrepRequirements_decorators;
    let _sitePrepRequirements_initializers = [];
    let _sitePrepRequirements_extraInitializers = [];
    let _installationSteps_decorators;
    let _installationSteps_initializers = [];
    let _installationSteps_extraInitializers = [];
    let _requiredResources_decorators;
    let _requiredResources_initializers = [];
    let _requiredResources_extraInitializers = [];
    let _prerequisites_decorators;
    let _prerequisites_initializers = [];
    let _prerequisites_extraInitializers = [];
    let _currentPhase_decorators;
    let _currentPhase_initializers = [];
    let _currentPhase_extraInitializers = [];
    let _percentComplete_decorators;
    let _percentComplete_initializers = [];
    let _percentComplete_extraInitializers = [];
    let _projectManagerId_decorators;
    let _projectManagerId_initializers = [];
    let _projectManagerId_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _sitePreparations_decorators;
    let _sitePreparations_initializers = [];
    let _sitePreparations_extraInitializers = [];
    let _resourceAllocations_decorators;
    let _resourceAllocations_initializers = [];
    let _resourceAllocations_extraInitializers = [];
    let _configurations_decorators;
    let _configurations_initializers = [];
    let _configurations_extraInitializers = [];
    let _tests_decorators;
    let _tests_initializers = [];
    let _tests_extraInitializers = [];
    var DeploymentPlan = _classThis = class extends _classSuper {
        static async generateDeploymentNumber(instance) {
            if (!instance.deploymentNumber) {
                const count = await DeploymentPlan.count();
                const year = new Date().getFullYear();
                instance.deploymentNumber = `DEP-${year}-${String(count + 1).padStart(6, '0')}`;
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.deploymentNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _deploymentNumber_initializers, void 0));
            this.assetId = (__runInitializers(this, _deploymentNumber_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.siteId = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _siteId_initializers, void 0));
            this.locationId = (__runInitializers(this, _siteId_extraInitializers), __runInitializers(this, _locationId_initializers, void 0));
            this.deploymentType = (__runInitializers(this, _locationId_extraInitializers), __runInitializers(this, _deploymentType_initializers, void 0));
            this.status = (__runInitializers(this, _deploymentType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.plannedStartDate = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _plannedStartDate_initializers, void 0));
            this.plannedEndDate = (__runInitializers(this, _plannedStartDate_extraInitializers), __runInitializers(this, _plannedEndDate_initializers, void 0));
            this.actualStartDate = (__runInitializers(this, _plannedEndDate_extraInitializers), __runInitializers(this, _actualStartDate_initializers, void 0));
            this.actualEndDate = (__runInitializers(this, _actualStartDate_extraInitializers), __runInitializers(this, _actualEndDate_initializers, void 0));
            this.estimatedDuration = (__runInitializers(this, _actualEndDate_extraInitializers), __runInitializers(this, _estimatedDuration_initializers, void 0));
            this.actualDuration = (__runInitializers(this, _estimatedDuration_extraInitializers), __runInitializers(this, _actualDuration_initializers, void 0));
            this.requiresSitePrep = (__runInitializers(this, _actualDuration_extraInitializers), __runInitializers(this, _requiresSitePrep_initializers, void 0));
            this.sitePrepRequirements = (__runInitializers(this, _requiresSitePrep_extraInitializers), __runInitializers(this, _sitePrepRequirements_initializers, void 0));
            this.installationSteps = (__runInitializers(this, _sitePrepRequirements_extraInitializers), __runInitializers(this, _installationSteps_initializers, void 0));
            this.requiredResources = (__runInitializers(this, _installationSteps_extraInitializers), __runInitializers(this, _requiredResources_initializers, void 0));
            this.prerequisites = (__runInitializers(this, _requiredResources_extraInitializers), __runInitializers(this, _prerequisites_initializers, void 0));
            this.currentPhase = (__runInitializers(this, _prerequisites_extraInitializers), __runInitializers(this, _currentPhase_initializers, void 0));
            this.percentComplete = (__runInitializers(this, _currentPhase_extraInitializers), __runInitializers(this, _percentComplete_initializers, void 0));
            this.projectManagerId = (__runInitializers(this, _percentComplete_extraInitializers), __runInitializers(this, _projectManagerId_initializers, void 0));
            this.notes = (__runInitializers(this, _projectManagerId_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.attachments = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.createdAt = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.sitePreparations = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _sitePreparations_initializers, void 0));
            this.resourceAllocations = (__runInitializers(this, _sitePreparations_extraInitializers), __runInitializers(this, _resourceAllocations_initializers, void 0));
            this.configurations = (__runInitializers(this, _resourceAllocations_extraInitializers), __runInitializers(this, _configurations_initializers, void 0));
            this.tests = (__runInitializers(this, _configurations_extraInitializers), __runInitializers(this, _tests_initializers, void 0));
            __runInitializers(this, _tests_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DeploymentPlan");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _deploymentNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deployment number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _siteId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Site ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _locationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _deploymentType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deployment type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(DeploymentType)), allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(DeploymentStatus)), defaultValue: DeploymentStatus.PLANNED }), sequelize_typescript_1.Index];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(DeploymentPriority)), defaultValue: DeploymentPriority.MEDIUM }), sequelize_typescript_1.Index];
        _plannedStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Planned start date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _plannedEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Planned end date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _actualStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual start date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _actualEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual end date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _estimatedDuration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated duration in minutes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _actualDuration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual duration in minutes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _requiresSitePrep_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requires site preparation' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _sitePrepRequirements_decorators = [(0, swagger_1.ApiProperty)({ description: 'Site prep requirements' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _installationSteps_decorators = [(0, swagger_1.ApiProperty)({ description: 'Installation steps' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _requiredResources_decorators = [(0, swagger_1.ApiProperty)({ description: 'Required resources' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _prerequisites_decorators = [(0, swagger_1.ApiProperty)({ description: 'Prerequisites' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _currentPhase_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current phase' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(InstallationPhase)) })];
        _percentComplete_decorators = [(0, swagger_1.ApiProperty)({ description: 'Percent complete' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), defaultValue: 0 })];
        _projectManagerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project manager ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _attachments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attachments' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _sitePreparations_decorators = [(0, sequelize_typescript_1.HasMany)(() => SitePreparation)];
        _resourceAllocations_decorators = [(0, sequelize_typescript_1.HasMany)(() => ResourceAllocation)];
        _configurations_decorators = [(0, sequelize_typescript_1.HasMany)(() => DeploymentConfiguration)];
        _tests_decorators = [(0, sequelize_typescript_1.HasMany)(() => DeploymentTest)];
        _static_generateDeploymentNumber_decorators = [sequelize_typescript_1.BeforeCreate];
        __esDecorate(_classThis, null, _static_generateDeploymentNumber_decorators, { kind: "method", name: "generateDeploymentNumber", static: true, private: false, access: { has: obj => "generateDeploymentNumber" in obj, get: obj => obj.generateDeploymentNumber }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _deploymentNumber_decorators, { kind: "field", name: "deploymentNumber", static: false, private: false, access: { has: obj => "deploymentNumber" in obj, get: obj => obj.deploymentNumber, set: (obj, value) => { obj.deploymentNumber = value; } }, metadata: _metadata }, _deploymentNumber_initializers, _deploymentNumber_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _siteId_decorators, { kind: "field", name: "siteId", static: false, private: false, access: { has: obj => "siteId" in obj, get: obj => obj.siteId, set: (obj, value) => { obj.siteId = value; } }, metadata: _metadata }, _siteId_initializers, _siteId_extraInitializers);
        __esDecorate(null, null, _locationId_decorators, { kind: "field", name: "locationId", static: false, private: false, access: { has: obj => "locationId" in obj, get: obj => obj.locationId, set: (obj, value) => { obj.locationId = value; } }, metadata: _metadata }, _locationId_initializers, _locationId_extraInitializers);
        __esDecorate(null, null, _deploymentType_decorators, { kind: "field", name: "deploymentType", static: false, private: false, access: { has: obj => "deploymentType" in obj, get: obj => obj.deploymentType, set: (obj, value) => { obj.deploymentType = value; } }, metadata: _metadata }, _deploymentType_initializers, _deploymentType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _plannedStartDate_decorators, { kind: "field", name: "plannedStartDate", static: false, private: false, access: { has: obj => "plannedStartDate" in obj, get: obj => obj.plannedStartDate, set: (obj, value) => { obj.plannedStartDate = value; } }, metadata: _metadata }, _plannedStartDate_initializers, _plannedStartDate_extraInitializers);
        __esDecorate(null, null, _plannedEndDate_decorators, { kind: "field", name: "plannedEndDate", static: false, private: false, access: { has: obj => "plannedEndDate" in obj, get: obj => obj.plannedEndDate, set: (obj, value) => { obj.plannedEndDate = value; } }, metadata: _metadata }, _plannedEndDate_initializers, _plannedEndDate_extraInitializers);
        __esDecorate(null, null, _actualStartDate_decorators, { kind: "field", name: "actualStartDate", static: false, private: false, access: { has: obj => "actualStartDate" in obj, get: obj => obj.actualStartDate, set: (obj, value) => { obj.actualStartDate = value; } }, metadata: _metadata }, _actualStartDate_initializers, _actualStartDate_extraInitializers);
        __esDecorate(null, null, _actualEndDate_decorators, { kind: "field", name: "actualEndDate", static: false, private: false, access: { has: obj => "actualEndDate" in obj, get: obj => obj.actualEndDate, set: (obj, value) => { obj.actualEndDate = value; } }, metadata: _metadata }, _actualEndDate_initializers, _actualEndDate_extraInitializers);
        __esDecorate(null, null, _estimatedDuration_decorators, { kind: "field", name: "estimatedDuration", static: false, private: false, access: { has: obj => "estimatedDuration" in obj, get: obj => obj.estimatedDuration, set: (obj, value) => { obj.estimatedDuration = value; } }, metadata: _metadata }, _estimatedDuration_initializers, _estimatedDuration_extraInitializers);
        __esDecorate(null, null, _actualDuration_decorators, { kind: "field", name: "actualDuration", static: false, private: false, access: { has: obj => "actualDuration" in obj, get: obj => obj.actualDuration, set: (obj, value) => { obj.actualDuration = value; } }, metadata: _metadata }, _actualDuration_initializers, _actualDuration_extraInitializers);
        __esDecorate(null, null, _requiresSitePrep_decorators, { kind: "field", name: "requiresSitePrep", static: false, private: false, access: { has: obj => "requiresSitePrep" in obj, get: obj => obj.requiresSitePrep, set: (obj, value) => { obj.requiresSitePrep = value; } }, metadata: _metadata }, _requiresSitePrep_initializers, _requiresSitePrep_extraInitializers);
        __esDecorate(null, null, _sitePrepRequirements_decorators, { kind: "field", name: "sitePrepRequirements", static: false, private: false, access: { has: obj => "sitePrepRequirements" in obj, get: obj => obj.sitePrepRequirements, set: (obj, value) => { obj.sitePrepRequirements = value; } }, metadata: _metadata }, _sitePrepRequirements_initializers, _sitePrepRequirements_extraInitializers);
        __esDecorate(null, null, _installationSteps_decorators, { kind: "field", name: "installationSteps", static: false, private: false, access: { has: obj => "installationSteps" in obj, get: obj => obj.installationSteps, set: (obj, value) => { obj.installationSteps = value; } }, metadata: _metadata }, _installationSteps_initializers, _installationSteps_extraInitializers);
        __esDecorate(null, null, _requiredResources_decorators, { kind: "field", name: "requiredResources", static: false, private: false, access: { has: obj => "requiredResources" in obj, get: obj => obj.requiredResources, set: (obj, value) => { obj.requiredResources = value; } }, metadata: _metadata }, _requiredResources_initializers, _requiredResources_extraInitializers);
        __esDecorate(null, null, _prerequisites_decorators, { kind: "field", name: "prerequisites", static: false, private: false, access: { has: obj => "prerequisites" in obj, get: obj => obj.prerequisites, set: (obj, value) => { obj.prerequisites = value; } }, metadata: _metadata }, _prerequisites_initializers, _prerequisites_extraInitializers);
        __esDecorate(null, null, _currentPhase_decorators, { kind: "field", name: "currentPhase", static: false, private: false, access: { has: obj => "currentPhase" in obj, get: obj => obj.currentPhase, set: (obj, value) => { obj.currentPhase = value; } }, metadata: _metadata }, _currentPhase_initializers, _currentPhase_extraInitializers);
        __esDecorate(null, null, _percentComplete_decorators, { kind: "field", name: "percentComplete", static: false, private: false, access: { has: obj => "percentComplete" in obj, get: obj => obj.percentComplete, set: (obj, value) => { obj.percentComplete = value; } }, metadata: _metadata }, _percentComplete_initializers, _percentComplete_extraInitializers);
        __esDecorate(null, null, _projectManagerId_decorators, { kind: "field", name: "projectManagerId", static: false, private: false, access: { has: obj => "projectManagerId" in obj, get: obj => obj.projectManagerId, set: (obj, value) => { obj.projectManagerId = value; } }, metadata: _metadata }, _projectManagerId_initializers, _projectManagerId_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _sitePreparations_decorators, { kind: "field", name: "sitePreparations", static: false, private: false, access: { has: obj => "sitePreparations" in obj, get: obj => obj.sitePreparations, set: (obj, value) => { obj.sitePreparations = value; } }, metadata: _metadata }, _sitePreparations_initializers, _sitePreparations_extraInitializers);
        __esDecorate(null, null, _resourceAllocations_decorators, { kind: "field", name: "resourceAllocations", static: false, private: false, access: { has: obj => "resourceAllocations" in obj, get: obj => obj.resourceAllocations, set: (obj, value) => { obj.resourceAllocations = value; } }, metadata: _metadata }, _resourceAllocations_initializers, _resourceAllocations_extraInitializers);
        __esDecorate(null, null, _configurations_decorators, { kind: "field", name: "configurations", static: false, private: false, access: { has: obj => "configurations" in obj, get: obj => obj.configurations, set: (obj, value) => { obj.configurations = value; } }, metadata: _metadata }, _configurations_initializers, _configurations_extraInitializers);
        __esDecorate(null, null, _tests_decorators, { kind: "field", name: "tests", static: false, private: false, access: { has: obj => "tests" in obj, get: obj => obj.tests, set: (obj, value) => { obj.tests = value; } }, metadata: _metadata }, _tests_initializers, _tests_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DeploymentPlan = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DeploymentPlan = _classThis;
})();
exports.DeploymentPlan = DeploymentPlan;
/**
 * Site Preparation Model
 */
let SitePreparation = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'site_preparations',
            timestamps: true,
            indexes: [
                { fields: ['deployment_id'] },
                { fields: ['status'] },
                { fields: ['scheduled_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _deploymentId_decorators;
    let _deploymentId_initializers = [];
    let _deploymentId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _requirements_decorators;
    let _requirements_initializers = [];
    let _requirements_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _startedDate_decorators;
    let _startedDate_initializers = [];
    let _startedDate_extraInitializers = [];
    let _completedDate_decorators;
    let _completedDate_initializers = [];
    let _completedDate_extraInitializers = [];
    let _verificationChecklist_decorators;
    let _verificationChecklist_initializers = [];
    let _verificationChecklist_extraInitializers = [];
    let _photos_decorators;
    let _photos_initializers = [];
    let _photos_extraInitializers = [];
    let _documents_decorators;
    let _documents_initializers = [];
    let _documents_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deployment_decorators;
    let _deployment_initializers = [];
    let _deployment_extraInitializers = [];
    var SitePreparation = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.deploymentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _deploymentId_initializers, void 0));
            this.status = (__runInitializers(this, _deploymentId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.requirements = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _requirements_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _requirements_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.scheduledDate = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
            this.startedDate = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _startedDate_initializers, void 0));
            this.completedDate = (__runInitializers(this, _startedDate_extraInitializers), __runInitializers(this, _completedDate_initializers, void 0));
            this.verificationChecklist = (__runInitializers(this, _completedDate_extraInitializers), __runInitializers(this, _verificationChecklist_initializers, void 0));
            this.photos = (__runInitializers(this, _verificationChecklist_extraInitializers), __runInitializers(this, _photos_initializers, void 0));
            this.documents = (__runInitializers(this, _photos_extraInitializers), __runInitializers(this, _documents_initializers, void 0));
            this.notes = (__runInitializers(this, _documents_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deployment = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deployment_initializers, void 0));
            __runInitializers(this, _deployment_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SitePreparation");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _deploymentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deployment ID' }), (0, sequelize_typescript_1.ForeignKey)(() => DeploymentPlan), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(SitePrepStatus)), defaultValue: SitePrepStatus.PENDING }), sequelize_typescript_1.Index];
        _requirements_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requirements' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _assignedTo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned to user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _scheduledDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _startedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Started date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _completedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completed date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _verificationChecklist_decorators = [(0, swagger_1.ApiProperty)({ description: 'Verification checklist' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _photos_decorators = [(0, swagger_1.ApiProperty)({ description: 'Photos' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _documents_decorators = [(0, swagger_1.ApiProperty)({ description: 'Documents' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deployment_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => DeploymentPlan)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _deploymentId_decorators, { kind: "field", name: "deploymentId", static: false, private: false, access: { has: obj => "deploymentId" in obj, get: obj => obj.deploymentId, set: (obj, value) => { obj.deploymentId = value; } }, metadata: _metadata }, _deploymentId_initializers, _deploymentId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _requirements_decorators, { kind: "field", name: "requirements", static: false, private: false, access: { has: obj => "requirements" in obj, get: obj => obj.requirements, set: (obj, value) => { obj.requirements = value; } }, metadata: _metadata }, _requirements_initializers, _requirements_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
        __esDecorate(null, null, _startedDate_decorators, { kind: "field", name: "startedDate", static: false, private: false, access: { has: obj => "startedDate" in obj, get: obj => obj.startedDate, set: (obj, value) => { obj.startedDate = value; } }, metadata: _metadata }, _startedDate_initializers, _startedDate_extraInitializers);
        __esDecorate(null, null, _completedDate_decorators, { kind: "field", name: "completedDate", static: false, private: false, access: { has: obj => "completedDate" in obj, get: obj => obj.completedDate, set: (obj, value) => { obj.completedDate = value; } }, metadata: _metadata }, _completedDate_initializers, _completedDate_extraInitializers);
        __esDecorate(null, null, _verificationChecklist_decorators, { kind: "field", name: "verificationChecklist", static: false, private: false, access: { has: obj => "verificationChecklist" in obj, get: obj => obj.verificationChecklist, set: (obj, value) => { obj.verificationChecklist = value; } }, metadata: _metadata }, _verificationChecklist_initializers, _verificationChecklist_extraInitializers);
        __esDecorate(null, null, _photos_decorators, { kind: "field", name: "photos", static: false, private: false, access: { has: obj => "photos" in obj, get: obj => obj.photos, set: (obj, value) => { obj.photos = value; } }, metadata: _metadata }, _photos_initializers, _photos_extraInitializers);
        __esDecorate(null, null, _documents_decorators, { kind: "field", name: "documents", static: false, private: false, access: { has: obj => "documents" in obj, get: obj => obj.documents, set: (obj, value) => { obj.documents = value; } }, metadata: _metadata }, _documents_initializers, _documents_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deployment_decorators, { kind: "field", name: "deployment", static: false, private: false, access: { has: obj => "deployment" in obj, get: obj => obj.deployment, set: (obj, value) => { obj.deployment = value; } }, metadata: _metadata }, _deployment_initializers, _deployment_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SitePreparation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SitePreparation = _classThis;
})();
exports.SitePreparation = SitePreparation;
/**
 * Resource Allocation Model
 */
let ResourceAllocation = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'resource_allocations',
            timestamps: true,
            indexes: [
                { fields: ['deployment_id'] },
                { fields: ['resource_type'] },
                { fields: ['resource_id'] },
                { fields: ['allocated_from'] },
                { fields: ['allocated_until'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _deploymentId_decorators;
    let _deploymentId_initializers = [];
    let _deploymentId_extraInitializers = [];
    let _resourceType_decorators;
    let _resourceType_initializers = [];
    let _resourceType_extraInitializers = [];
    let _resourceId_decorators;
    let _resourceId_initializers = [];
    let _resourceId_extraInitializers = [];
    let _allocatedFrom_decorators;
    let _allocatedFrom_initializers = [];
    let _allocatedFrom_extraInitializers = [];
    let _allocatedUntil_decorators;
    let _allocatedUntil_initializers = [];
    let _allocatedUntil_extraInitializers = [];
    let _primaryAssignment_decorators;
    let _primaryAssignment_initializers = [];
    let _primaryAssignment_extraInitializers = [];
    let _utilizationPercentage_decorators;
    let _utilizationPercentage_initializers = [];
    let _utilizationPercentage_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deployment_decorators;
    let _deployment_initializers = [];
    let _deployment_extraInitializers = [];
    var ResourceAllocation = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.deploymentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _deploymentId_initializers, void 0));
            this.resourceType = (__runInitializers(this, _deploymentId_extraInitializers), __runInitializers(this, _resourceType_initializers, void 0));
            this.resourceId = (__runInitializers(this, _resourceType_extraInitializers), __runInitializers(this, _resourceId_initializers, void 0));
            this.allocatedFrom = (__runInitializers(this, _resourceId_extraInitializers), __runInitializers(this, _allocatedFrom_initializers, void 0));
            this.allocatedUntil = (__runInitializers(this, _allocatedFrom_extraInitializers), __runInitializers(this, _allocatedUntil_initializers, void 0));
            this.primaryAssignment = (__runInitializers(this, _allocatedUntil_extraInitializers), __runInitializers(this, _primaryAssignment_initializers, void 0));
            this.utilizationPercentage = (__runInitializers(this, _primaryAssignment_extraInitializers), __runInitializers(this, _utilizationPercentage_initializers, void 0));
            this.notes = (__runInitializers(this, _utilizationPercentage_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deployment = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deployment_initializers, void 0));
            __runInitializers(this, _deployment_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ResourceAllocation");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _deploymentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deployment ID' }), (0, sequelize_typescript_1.ForeignKey)(() => DeploymentPlan), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _resourceType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resource type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ResourceType)), allowNull: false }), sequelize_typescript_1.Index];
        _resourceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resource ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _allocatedFrom_decorators = [(0, swagger_1.ApiProperty)({ description: 'Allocated from' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _allocatedUntil_decorators = [(0, swagger_1.ApiProperty)({ description: 'Allocated until' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _primaryAssignment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Primary assignment' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _utilizationPercentage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Utilization percentage' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2) })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deployment_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => DeploymentPlan)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _deploymentId_decorators, { kind: "field", name: "deploymentId", static: false, private: false, access: { has: obj => "deploymentId" in obj, get: obj => obj.deploymentId, set: (obj, value) => { obj.deploymentId = value; } }, metadata: _metadata }, _deploymentId_initializers, _deploymentId_extraInitializers);
        __esDecorate(null, null, _resourceType_decorators, { kind: "field", name: "resourceType", static: false, private: false, access: { has: obj => "resourceType" in obj, get: obj => obj.resourceType, set: (obj, value) => { obj.resourceType = value; } }, metadata: _metadata }, _resourceType_initializers, _resourceType_extraInitializers);
        __esDecorate(null, null, _resourceId_decorators, { kind: "field", name: "resourceId", static: false, private: false, access: { has: obj => "resourceId" in obj, get: obj => obj.resourceId, set: (obj, value) => { obj.resourceId = value; } }, metadata: _metadata }, _resourceId_initializers, _resourceId_extraInitializers);
        __esDecorate(null, null, _allocatedFrom_decorators, { kind: "field", name: "allocatedFrom", static: false, private: false, access: { has: obj => "allocatedFrom" in obj, get: obj => obj.allocatedFrom, set: (obj, value) => { obj.allocatedFrom = value; } }, metadata: _metadata }, _allocatedFrom_initializers, _allocatedFrom_extraInitializers);
        __esDecorate(null, null, _allocatedUntil_decorators, { kind: "field", name: "allocatedUntil", static: false, private: false, access: { has: obj => "allocatedUntil" in obj, get: obj => obj.allocatedUntil, set: (obj, value) => { obj.allocatedUntil = value; } }, metadata: _metadata }, _allocatedUntil_initializers, _allocatedUntil_extraInitializers);
        __esDecorate(null, null, _primaryAssignment_decorators, { kind: "field", name: "primaryAssignment", static: false, private: false, access: { has: obj => "primaryAssignment" in obj, get: obj => obj.primaryAssignment, set: (obj, value) => { obj.primaryAssignment = value; } }, metadata: _metadata }, _primaryAssignment_initializers, _primaryAssignment_extraInitializers);
        __esDecorate(null, null, _utilizationPercentage_decorators, { kind: "field", name: "utilizationPercentage", static: false, private: false, access: { has: obj => "utilizationPercentage" in obj, get: obj => obj.utilizationPercentage, set: (obj, value) => { obj.utilizationPercentage = value; } }, metadata: _metadata }, _utilizationPercentage_initializers, _utilizationPercentage_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deployment_decorators, { kind: "field", name: "deployment", static: false, private: false, access: { has: obj => "deployment" in obj, get: obj => obj.deployment, set: (obj, value) => { obj.deployment = value; } }, metadata: _metadata }, _deployment_initializers, _deployment_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ResourceAllocation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ResourceAllocation = _classThis;
})();
exports.ResourceAllocation = ResourceAllocation;
/**
 * Installation Progress Model
 */
let InstallationProgress = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'installation_progress',
            timestamps: true,
            indexes: [
                { fields: ['deployment_id'] },
                { fields: ['current_phase'] },
                { fields: ['updated_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _deploymentId_decorators;
    let _deploymentId_initializers = [];
    let _deploymentId_extraInitializers = [];
    let _currentPhase_decorators;
    let _currentPhase_initializers = [];
    let _currentPhase_extraInitializers = [];
    let _currentStep_decorators;
    let _currentStep_initializers = [];
    let _currentStep_extraInitializers = [];
    let _completedSteps_decorators;
    let _completedSteps_initializers = [];
    let _completedSteps_extraInitializers = [];
    let _issues_decorators;
    let _issues_initializers = [];
    let _issues_extraInitializers = [];
    let _percentComplete_decorators;
    let _percentComplete_initializers = [];
    let _percentComplete_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var InstallationProgress = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.deploymentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _deploymentId_initializers, void 0));
            this.currentPhase = (__runInitializers(this, _deploymentId_extraInitializers), __runInitializers(this, _currentPhase_initializers, void 0));
            this.currentStep = (__runInitializers(this, _currentPhase_extraInitializers), __runInitializers(this, _currentStep_initializers, void 0));
            this.completedSteps = (__runInitializers(this, _currentStep_extraInitializers), __runInitializers(this, _completedSteps_initializers, void 0));
            this.issues = (__runInitializers(this, _completedSteps_extraInitializers), __runInitializers(this, _issues_initializers, void 0));
            this.percentComplete = (__runInitializers(this, _issues_extraInitializers), __runInitializers(this, _percentComplete_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _percentComplete_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.notes = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "InstallationProgress");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _deploymentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deployment ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _currentPhase_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current phase' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(InstallationPhase)), allowNull: false }), sequelize_typescript_1.Index];
        _currentStep_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current step' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _completedSteps_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completed steps' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.INTEGER), defaultValue: [] })];
        _issues_decorators = [(0, swagger_1.ApiProperty)({ description: 'Issues' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _percentComplete_decorators = [(0, swagger_1.ApiProperty)({ description: 'Percent complete' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), allowNull: false })];
        _updatedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Updated by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _deploymentId_decorators, { kind: "field", name: "deploymentId", static: false, private: false, access: { has: obj => "deploymentId" in obj, get: obj => obj.deploymentId, set: (obj, value) => { obj.deploymentId = value; } }, metadata: _metadata }, _deploymentId_initializers, _deploymentId_extraInitializers);
        __esDecorate(null, null, _currentPhase_decorators, { kind: "field", name: "currentPhase", static: false, private: false, access: { has: obj => "currentPhase" in obj, get: obj => obj.currentPhase, set: (obj, value) => { obj.currentPhase = value; } }, metadata: _metadata }, _currentPhase_initializers, _currentPhase_extraInitializers);
        __esDecorate(null, null, _currentStep_decorators, { kind: "field", name: "currentStep", static: false, private: false, access: { has: obj => "currentStep" in obj, get: obj => obj.currentStep, set: (obj, value) => { obj.currentStep = value; } }, metadata: _metadata }, _currentStep_initializers, _currentStep_extraInitializers);
        __esDecorate(null, null, _completedSteps_decorators, { kind: "field", name: "completedSteps", static: false, private: false, access: { has: obj => "completedSteps" in obj, get: obj => obj.completedSteps, set: (obj, value) => { obj.completedSteps = value; } }, metadata: _metadata }, _completedSteps_initializers, _completedSteps_extraInitializers);
        __esDecorate(null, null, _issues_decorators, { kind: "field", name: "issues", static: false, private: false, access: { has: obj => "issues" in obj, get: obj => obj.issues, set: (obj, value) => { obj.issues = value; } }, metadata: _metadata }, _issues_initializers, _issues_extraInitializers);
        __esDecorate(null, null, _percentComplete_decorators, { kind: "field", name: "percentComplete", static: false, private: false, access: { has: obj => "percentComplete" in obj, get: obj => obj.percentComplete, set: (obj, value) => { obj.percentComplete = value; } }, metadata: _metadata }, _percentComplete_initializers, _percentComplete_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InstallationProgress = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InstallationProgress = _classThis;
})();
exports.InstallationProgress = InstallationProgress;
/**
 * Deployment Configuration Model
 */
let DeploymentConfiguration = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'deployment_configurations',
            timestamps: true,
            indexes: [
                { fields: ['deployment_id'] },
                { fields: ['configuration_type'] },
                { fields: ['configuration_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _deploymentId_decorators;
    let _deploymentId_initializers = [];
    let _deploymentId_extraInitializers = [];
    let _configurationType_decorators;
    let _configurationType_initializers = [];
    let _configurationType_extraInitializers = [];
    let _parameters_decorators;
    let _parameters_initializers = [];
    let _parameters_extraInitializers = [];
    let _configuredBy_decorators;
    let _configuredBy_initializers = [];
    let _configuredBy_extraInitializers = [];
    let _configurationDate_decorators;
    let _configurationDate_initializers = [];
    let _configurationDate_extraInitializers = [];
    let _backupCreated_decorators;
    let _backupCreated_initializers = [];
    let _backupCreated_extraInitializers = [];
    let _backupLocation_decorators;
    let _backupLocation_initializers = [];
    let _backupLocation_extraInitializers = [];
    let _validationRequired_decorators;
    let _validationRequired_initializers = [];
    let _validationRequired_extraInitializers = [];
    let _validated_decorators;
    let _validated_initializers = [];
    let _validated_extraInitializers = [];
    let _validatedBy_decorators;
    let _validatedBy_initializers = [];
    let _validatedBy_extraInitializers = [];
    let _validationDate_decorators;
    let _validationDate_initializers = [];
    let _validationDate_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deployment_decorators;
    let _deployment_initializers = [];
    let _deployment_extraInitializers = [];
    var DeploymentConfiguration = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.deploymentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _deploymentId_initializers, void 0));
            this.configurationType = (__runInitializers(this, _deploymentId_extraInitializers), __runInitializers(this, _configurationType_initializers, void 0));
            this.parameters = (__runInitializers(this, _configurationType_extraInitializers), __runInitializers(this, _parameters_initializers, void 0));
            this.configuredBy = (__runInitializers(this, _parameters_extraInitializers), __runInitializers(this, _configuredBy_initializers, void 0));
            this.configurationDate = (__runInitializers(this, _configuredBy_extraInitializers), __runInitializers(this, _configurationDate_initializers, void 0));
            this.backupCreated = (__runInitializers(this, _configurationDate_extraInitializers), __runInitializers(this, _backupCreated_initializers, void 0));
            this.backupLocation = (__runInitializers(this, _backupCreated_extraInitializers), __runInitializers(this, _backupLocation_initializers, void 0));
            this.validationRequired = (__runInitializers(this, _backupLocation_extraInitializers), __runInitializers(this, _validationRequired_initializers, void 0));
            this.validated = (__runInitializers(this, _validationRequired_extraInitializers), __runInitializers(this, _validated_initializers, void 0));
            this.validatedBy = (__runInitializers(this, _validated_extraInitializers), __runInitializers(this, _validatedBy_initializers, void 0));
            this.validationDate = (__runInitializers(this, _validatedBy_extraInitializers), __runInitializers(this, _validationDate_initializers, void 0));
            this.notes = (__runInitializers(this, _validationDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deployment = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deployment_initializers, void 0));
            __runInitializers(this, _deployment_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DeploymentConfiguration");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _deploymentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deployment ID' }), (0, sequelize_typescript_1.ForeignKey)(() => DeploymentPlan), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _configurationType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Configuration type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }), sequelize_typescript_1.Index];
        _parameters_decorators = [(0, swagger_1.ApiProperty)({ description: 'Configuration parameters' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _configuredBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Configured by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _configurationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Configuration date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _backupCreated_decorators = [(0, swagger_1.ApiProperty)({ description: 'Backup created' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _backupLocation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Backup location' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _validationRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Validation required' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _validated_decorators = [(0, swagger_1.ApiProperty)({ description: 'Validated' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _validatedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Validated by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _validationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Validation date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deployment_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => DeploymentPlan)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _deploymentId_decorators, { kind: "field", name: "deploymentId", static: false, private: false, access: { has: obj => "deploymentId" in obj, get: obj => obj.deploymentId, set: (obj, value) => { obj.deploymentId = value; } }, metadata: _metadata }, _deploymentId_initializers, _deploymentId_extraInitializers);
        __esDecorate(null, null, _configurationType_decorators, { kind: "field", name: "configurationType", static: false, private: false, access: { has: obj => "configurationType" in obj, get: obj => obj.configurationType, set: (obj, value) => { obj.configurationType = value; } }, metadata: _metadata }, _configurationType_initializers, _configurationType_extraInitializers);
        __esDecorate(null, null, _parameters_decorators, { kind: "field", name: "parameters", static: false, private: false, access: { has: obj => "parameters" in obj, get: obj => obj.parameters, set: (obj, value) => { obj.parameters = value; } }, metadata: _metadata }, _parameters_initializers, _parameters_extraInitializers);
        __esDecorate(null, null, _configuredBy_decorators, { kind: "field", name: "configuredBy", static: false, private: false, access: { has: obj => "configuredBy" in obj, get: obj => obj.configuredBy, set: (obj, value) => { obj.configuredBy = value; } }, metadata: _metadata }, _configuredBy_initializers, _configuredBy_extraInitializers);
        __esDecorate(null, null, _configurationDate_decorators, { kind: "field", name: "configurationDate", static: false, private: false, access: { has: obj => "configurationDate" in obj, get: obj => obj.configurationDate, set: (obj, value) => { obj.configurationDate = value; } }, metadata: _metadata }, _configurationDate_initializers, _configurationDate_extraInitializers);
        __esDecorate(null, null, _backupCreated_decorators, { kind: "field", name: "backupCreated", static: false, private: false, access: { has: obj => "backupCreated" in obj, get: obj => obj.backupCreated, set: (obj, value) => { obj.backupCreated = value; } }, metadata: _metadata }, _backupCreated_initializers, _backupCreated_extraInitializers);
        __esDecorate(null, null, _backupLocation_decorators, { kind: "field", name: "backupLocation", static: false, private: false, access: { has: obj => "backupLocation" in obj, get: obj => obj.backupLocation, set: (obj, value) => { obj.backupLocation = value; } }, metadata: _metadata }, _backupLocation_initializers, _backupLocation_extraInitializers);
        __esDecorate(null, null, _validationRequired_decorators, { kind: "field", name: "validationRequired", static: false, private: false, access: { has: obj => "validationRequired" in obj, get: obj => obj.validationRequired, set: (obj, value) => { obj.validationRequired = value; } }, metadata: _metadata }, _validationRequired_initializers, _validationRequired_extraInitializers);
        __esDecorate(null, null, _validated_decorators, { kind: "field", name: "validated", static: false, private: false, access: { has: obj => "validated" in obj, get: obj => obj.validated, set: (obj, value) => { obj.validated = value; } }, metadata: _metadata }, _validated_initializers, _validated_extraInitializers);
        __esDecorate(null, null, _validatedBy_decorators, { kind: "field", name: "validatedBy", static: false, private: false, access: { has: obj => "validatedBy" in obj, get: obj => obj.validatedBy, set: (obj, value) => { obj.validatedBy = value; } }, metadata: _metadata }, _validatedBy_initializers, _validatedBy_extraInitializers);
        __esDecorate(null, null, _validationDate_decorators, { kind: "field", name: "validationDate", static: false, private: false, access: { has: obj => "validationDate" in obj, get: obj => obj.validationDate, set: (obj, value) => { obj.validationDate = value; } }, metadata: _metadata }, _validationDate_initializers, _validationDate_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deployment_decorators, { kind: "field", name: "deployment", static: false, private: false, access: { has: obj => "deployment" in obj, get: obj => obj.deployment, set: (obj, value) => { obj.deployment = value; } }, metadata: _metadata }, _deployment_initializers, _deployment_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DeploymentConfiguration = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DeploymentConfiguration = _classThis;
})();
exports.DeploymentConfiguration = DeploymentConfiguration;
/**
 * Deployment Test Model
 */
let DeploymentTest = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'deployment_tests',
            timestamps: true,
            indexes: [
                { fields: ['deployment_id'] },
                { fields: ['test_plan_id'] },
                { fields: ['overall_status'] },
                { fields: ['execution_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _deploymentId_decorators;
    let _deploymentId_initializers = [];
    let _deploymentId_extraInitializers = [];
    let _testPlanId_decorators;
    let _testPlanId_initializers = [];
    let _testPlanId_extraInitializers = [];
    let _testCases_decorators;
    let _testCases_initializers = [];
    let _testCases_extraInitializers = [];
    let _overallStatus_decorators;
    let _overallStatus_initializers = [];
    let _overallStatus_extraInitializers = [];
    let _executedBy_decorators;
    let _executedBy_initializers = [];
    let _executedBy_extraInitializers = [];
    let _executionDate_decorators;
    let _executionDate_initializers = [];
    let _executionDate_extraInitializers = [];
    let _environment_decorators;
    let _environment_initializers = [];
    let _environment_extraInitializers = [];
    let _resultsSummary_decorators;
    let _resultsSummary_initializers = [];
    let _resultsSummary_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deployment_decorators;
    let _deployment_initializers = [];
    let _deployment_extraInitializers = [];
    var DeploymentTest = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.deploymentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _deploymentId_initializers, void 0));
            this.testPlanId = (__runInitializers(this, _deploymentId_extraInitializers), __runInitializers(this, _testPlanId_initializers, void 0));
            this.testCases = (__runInitializers(this, _testPlanId_extraInitializers), __runInitializers(this, _testCases_initializers, void 0));
            this.overallStatus = (__runInitializers(this, _testCases_extraInitializers), __runInitializers(this, _overallStatus_initializers, void 0));
            this.executedBy = (__runInitializers(this, _overallStatus_extraInitializers), __runInitializers(this, _executedBy_initializers, void 0));
            this.executionDate = (__runInitializers(this, _executedBy_extraInitializers), __runInitializers(this, _executionDate_initializers, void 0));
            this.environment = (__runInitializers(this, _executionDate_extraInitializers), __runInitializers(this, _environment_initializers, void 0));
            this.resultsSummary = (__runInitializers(this, _environment_extraInitializers), __runInitializers(this, _resultsSummary_initializers, void 0));
            this.notes = (__runInitializers(this, _resultsSummary_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.attachments = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.createdAt = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deployment = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deployment_initializers, void 0));
            __runInitializers(this, _deployment_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DeploymentTest");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _deploymentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deployment ID' }), (0, sequelize_typescript_1.ForeignKey)(() => DeploymentPlan), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _testPlanId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Test plan ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _testCases_decorators = [(0, swagger_1.ApiProperty)({ description: 'Test cases' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _overallStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Overall status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(TestStatus)), defaultValue: TestStatus.NOT_STARTED }), sequelize_typescript_1.Index];
        _executedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Executed by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _executionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Execution date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _environment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Environment' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _resultsSummary_decorators = [(0, swagger_1.ApiProperty)({ description: 'Test results summary' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _attachments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attachments' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deployment_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => DeploymentPlan)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _deploymentId_decorators, { kind: "field", name: "deploymentId", static: false, private: false, access: { has: obj => "deploymentId" in obj, get: obj => obj.deploymentId, set: (obj, value) => { obj.deploymentId = value; } }, metadata: _metadata }, _deploymentId_initializers, _deploymentId_extraInitializers);
        __esDecorate(null, null, _testPlanId_decorators, { kind: "field", name: "testPlanId", static: false, private: false, access: { has: obj => "testPlanId" in obj, get: obj => obj.testPlanId, set: (obj, value) => { obj.testPlanId = value; } }, metadata: _metadata }, _testPlanId_initializers, _testPlanId_extraInitializers);
        __esDecorate(null, null, _testCases_decorators, { kind: "field", name: "testCases", static: false, private: false, access: { has: obj => "testCases" in obj, get: obj => obj.testCases, set: (obj, value) => { obj.testCases = value; } }, metadata: _metadata }, _testCases_initializers, _testCases_extraInitializers);
        __esDecorate(null, null, _overallStatus_decorators, { kind: "field", name: "overallStatus", static: false, private: false, access: { has: obj => "overallStatus" in obj, get: obj => obj.overallStatus, set: (obj, value) => { obj.overallStatus = value; } }, metadata: _metadata }, _overallStatus_initializers, _overallStatus_extraInitializers);
        __esDecorate(null, null, _executedBy_decorators, { kind: "field", name: "executedBy", static: false, private: false, access: { has: obj => "executedBy" in obj, get: obj => obj.executedBy, set: (obj, value) => { obj.executedBy = value; } }, metadata: _metadata }, _executedBy_initializers, _executedBy_extraInitializers);
        __esDecorate(null, null, _executionDate_decorators, { kind: "field", name: "executionDate", static: false, private: false, access: { has: obj => "executionDate" in obj, get: obj => obj.executionDate, set: (obj, value) => { obj.executionDate = value; } }, metadata: _metadata }, _executionDate_initializers, _executionDate_extraInitializers);
        __esDecorate(null, null, _environment_decorators, { kind: "field", name: "environment", static: false, private: false, access: { has: obj => "environment" in obj, get: obj => obj.environment, set: (obj, value) => { obj.environment = value; } }, metadata: _metadata }, _environment_initializers, _environment_extraInitializers);
        __esDecorate(null, null, _resultsSummary_decorators, { kind: "field", name: "resultsSummary", static: false, private: false, access: { has: obj => "resultsSummary" in obj, get: obj => obj.resultsSummary, set: (obj, value) => { obj.resultsSummary = value; } }, metadata: _metadata }, _resultsSummary_initializers, _resultsSummary_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deployment_decorators, { kind: "field", name: "deployment", static: false, private: false, access: { has: obj => "deployment" in obj, get: obj => obj.deployment, set: (obj, value) => { obj.deployment = value; } }, metadata: _metadata }, _deployment_initializers, _deployment_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DeploymentTest = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DeploymentTest = _classThis;
})();
exports.DeploymentTest = DeploymentTest;
/**
 * Deployment Acceptance Model
 */
let DeploymentAcceptance = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'deployment_acceptances',
            timestamps: true,
            indexes: [
                { fields: ['deployment_id'], unique: true },
                { fields: ['status'] },
                { fields: ['acceptance_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _deploymentId_decorators;
    let _deploymentId_initializers = [];
    let _deploymentId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _criteria_decorators;
    let _criteria_initializers = [];
    let _criteria_extraInitializers = [];
    let _acceptedBy_decorators;
    let _acceptedBy_initializers = [];
    let _acceptedBy_extraInitializers = [];
    let _acceptanceDate_decorators;
    let _acceptanceDate_initializers = [];
    let _acceptanceDate_extraInitializers = [];
    let _exceptions_decorators;
    let _exceptions_initializers = [];
    let _exceptions_extraInitializers = [];
    let _signOffDocuments_decorators;
    let _signOffDocuments_initializers = [];
    let _signOffDocuments_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var DeploymentAcceptance = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.deploymentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _deploymentId_initializers, void 0));
            this.status = (__runInitializers(this, _deploymentId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.criteria = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _criteria_initializers, void 0));
            this.acceptedBy = (__runInitializers(this, _criteria_extraInitializers), __runInitializers(this, _acceptedBy_initializers, void 0));
            this.acceptanceDate = (__runInitializers(this, _acceptedBy_extraInitializers), __runInitializers(this, _acceptanceDate_initializers, void 0));
            this.exceptions = (__runInitializers(this, _acceptanceDate_extraInitializers), __runInitializers(this, _exceptions_initializers, void 0));
            this.signOffDocuments = (__runInitializers(this, _exceptions_extraInitializers), __runInitializers(this, _signOffDocuments_initializers, void 0));
            this.notes = (__runInitializers(this, _signOffDocuments_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DeploymentAcceptance");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _deploymentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deployment ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, unique: true }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(AcceptanceStatus)), defaultValue: AcceptanceStatus.PENDING }), sequelize_typescript_1.Index];
        _criteria_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acceptance criteria' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _acceptedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Accepted by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _acceptanceDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acceptance date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _exceptions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Exceptions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _signOffDocuments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sign-off documents' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _deploymentId_decorators, { kind: "field", name: "deploymentId", static: false, private: false, access: { has: obj => "deploymentId" in obj, get: obj => obj.deploymentId, set: (obj, value) => { obj.deploymentId = value; } }, metadata: _metadata }, _deploymentId_initializers, _deploymentId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _criteria_decorators, { kind: "field", name: "criteria", static: false, private: false, access: { has: obj => "criteria" in obj, get: obj => obj.criteria, set: (obj, value) => { obj.criteria = value; } }, metadata: _metadata }, _criteria_initializers, _criteria_extraInitializers);
        __esDecorate(null, null, _acceptedBy_decorators, { kind: "field", name: "acceptedBy", static: false, private: false, access: { has: obj => "acceptedBy" in obj, get: obj => obj.acceptedBy, set: (obj, value) => { obj.acceptedBy = value; } }, metadata: _metadata }, _acceptedBy_initializers, _acceptedBy_extraInitializers);
        __esDecorate(null, null, _acceptanceDate_decorators, { kind: "field", name: "acceptanceDate", static: false, private: false, access: { has: obj => "acceptanceDate" in obj, get: obj => obj.acceptanceDate, set: (obj, value) => { obj.acceptanceDate = value; } }, metadata: _metadata }, _acceptanceDate_initializers, _acceptanceDate_extraInitializers);
        __esDecorate(null, null, _exceptions_decorators, { kind: "field", name: "exceptions", static: false, private: false, access: { has: obj => "exceptions" in obj, get: obj => obj.exceptions, set: (obj, value) => { obj.exceptions = value; } }, metadata: _metadata }, _exceptions_initializers, _exceptions_extraInitializers);
        __esDecorate(null, null, _signOffDocuments_decorators, { kind: "field", name: "signOffDocuments", static: false, private: false, access: { has: obj => "signOffDocuments" in obj, get: obj => obj.signOffDocuments, set: (obj, value) => { obj.signOffDocuments = value; } }, metadata: _metadata }, _signOffDocuments_initializers, _signOffDocuments_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DeploymentAcceptance = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DeploymentAcceptance = _classThis;
})();
exports.DeploymentAcceptance = DeploymentAcceptance;
/**
 * Go-Live Plan Model
 */
let GoLivePlan = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'go_live_plans',
            timestamps: true,
            indexes: [
                { fields: ['deployment_id'], unique: true },
                { fields: ['go_live_date'] },
                { fields: ['status'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _deploymentId_decorators;
    let _deploymentId_initializers = [];
    let _deploymentId_extraInitializers = [];
    let _goLiveDate_decorators;
    let _goLiveDate_initializers = [];
    let _goLiveDate_extraInitializers = [];
    let _actualGoLiveDate_decorators;
    let _actualGoLiveDate_initializers = [];
    let _actualGoLiveDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _cutoverPlan_decorators;
    let _cutoverPlan_initializers = [];
    let _cutoverPlan_extraInitializers = [];
    let _rollbackPlan_decorators;
    let _rollbackPlan_initializers = [];
    let _rollbackPlan_extraInitializers = [];
    let _stakeholderApprovals_decorators;
    let _stakeholderApprovals_initializers = [];
    let _stakeholderApprovals_extraInitializers = [];
    let _allApprovalsReceived_decorators;
    let _allApprovalsReceived_initializers = [];
    let _allApprovalsReceived_extraInitializers = [];
    let _communicationPlan_decorators;
    let _communicationPlan_initializers = [];
    let _communicationPlan_extraInitializers = [];
    let _supportPlan_decorators;
    let _supportPlan_initializers = [];
    let _supportPlan_extraInitializers = [];
    let _rollbackTriggered_decorators;
    let _rollbackTriggered_initializers = [];
    let _rollbackTriggered_extraInitializers = [];
    let _rollbackReason_decorators;
    let _rollbackReason_initializers = [];
    let _rollbackReason_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var GoLivePlan = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.deploymentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _deploymentId_initializers, void 0));
            this.goLiveDate = (__runInitializers(this, _deploymentId_extraInitializers), __runInitializers(this, _goLiveDate_initializers, void 0));
            this.actualGoLiveDate = (__runInitializers(this, _goLiveDate_extraInitializers), __runInitializers(this, _actualGoLiveDate_initializers, void 0));
            this.status = (__runInitializers(this, _actualGoLiveDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.cutoverPlan = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _cutoverPlan_initializers, void 0));
            this.rollbackPlan = (__runInitializers(this, _cutoverPlan_extraInitializers), __runInitializers(this, _rollbackPlan_initializers, void 0));
            this.stakeholderApprovals = (__runInitializers(this, _rollbackPlan_extraInitializers), __runInitializers(this, _stakeholderApprovals_initializers, void 0));
            this.allApprovalsReceived = (__runInitializers(this, _stakeholderApprovals_extraInitializers), __runInitializers(this, _allApprovalsReceived_initializers, void 0));
            this.communicationPlan = (__runInitializers(this, _allApprovalsReceived_extraInitializers), __runInitializers(this, _communicationPlan_initializers, void 0));
            this.supportPlan = (__runInitializers(this, _communicationPlan_extraInitializers), __runInitializers(this, _supportPlan_initializers, void 0));
            this.rollbackTriggered = (__runInitializers(this, _supportPlan_extraInitializers), __runInitializers(this, _rollbackTriggered_initializers, void 0));
            this.rollbackReason = (__runInitializers(this, _rollbackTriggered_extraInitializers), __runInitializers(this, _rollbackReason_initializers, void 0));
            this.notes = (__runInitializers(this, _rollbackReason_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "GoLivePlan");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _deploymentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deployment ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, unique: true }), sequelize_typescript_1.Index];
        _goLiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Go-live date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _actualGoLiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual go-live date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('planned', 'ready', 'in_progress', 'completed', 'aborted'), defaultValue: 'planned' }), sequelize_typescript_1.Index];
        _cutoverPlan_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cutover plan' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _rollbackPlan_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rollback plan' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _stakeholderApprovals_decorators = [(0, swagger_1.ApiProperty)({ description: 'Stakeholder approvals' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID), allowNull: false })];
        _allApprovalsReceived_decorators = [(0, swagger_1.ApiProperty)({ description: 'All approvals received' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _communicationPlan_decorators = [(0, swagger_1.ApiProperty)({ description: 'Communication plan' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _supportPlan_decorators = [(0, swagger_1.ApiProperty)({ description: 'Support plan' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _rollbackTriggered_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rollback triggered' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _rollbackReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rollback reason' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _deploymentId_decorators, { kind: "field", name: "deploymentId", static: false, private: false, access: { has: obj => "deploymentId" in obj, get: obj => obj.deploymentId, set: (obj, value) => { obj.deploymentId = value; } }, metadata: _metadata }, _deploymentId_initializers, _deploymentId_extraInitializers);
        __esDecorate(null, null, _goLiveDate_decorators, { kind: "field", name: "goLiveDate", static: false, private: false, access: { has: obj => "goLiveDate" in obj, get: obj => obj.goLiveDate, set: (obj, value) => { obj.goLiveDate = value; } }, metadata: _metadata }, _goLiveDate_initializers, _goLiveDate_extraInitializers);
        __esDecorate(null, null, _actualGoLiveDate_decorators, { kind: "field", name: "actualGoLiveDate", static: false, private: false, access: { has: obj => "actualGoLiveDate" in obj, get: obj => obj.actualGoLiveDate, set: (obj, value) => { obj.actualGoLiveDate = value; } }, metadata: _metadata }, _actualGoLiveDate_initializers, _actualGoLiveDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _cutoverPlan_decorators, { kind: "field", name: "cutoverPlan", static: false, private: false, access: { has: obj => "cutoverPlan" in obj, get: obj => obj.cutoverPlan, set: (obj, value) => { obj.cutoverPlan = value; } }, metadata: _metadata }, _cutoverPlan_initializers, _cutoverPlan_extraInitializers);
        __esDecorate(null, null, _rollbackPlan_decorators, { kind: "field", name: "rollbackPlan", static: false, private: false, access: { has: obj => "rollbackPlan" in obj, get: obj => obj.rollbackPlan, set: (obj, value) => { obj.rollbackPlan = value; } }, metadata: _metadata }, _rollbackPlan_initializers, _rollbackPlan_extraInitializers);
        __esDecorate(null, null, _stakeholderApprovals_decorators, { kind: "field", name: "stakeholderApprovals", static: false, private: false, access: { has: obj => "stakeholderApprovals" in obj, get: obj => obj.stakeholderApprovals, set: (obj, value) => { obj.stakeholderApprovals = value; } }, metadata: _metadata }, _stakeholderApprovals_initializers, _stakeholderApprovals_extraInitializers);
        __esDecorate(null, null, _allApprovalsReceived_decorators, { kind: "field", name: "allApprovalsReceived", static: false, private: false, access: { has: obj => "allApprovalsReceived" in obj, get: obj => obj.allApprovalsReceived, set: (obj, value) => { obj.allApprovalsReceived = value; } }, metadata: _metadata }, _allApprovalsReceived_initializers, _allApprovalsReceived_extraInitializers);
        __esDecorate(null, null, _communicationPlan_decorators, { kind: "field", name: "communicationPlan", static: false, private: false, access: { has: obj => "communicationPlan" in obj, get: obj => obj.communicationPlan, set: (obj, value) => { obj.communicationPlan = value; } }, metadata: _metadata }, _communicationPlan_initializers, _communicationPlan_extraInitializers);
        __esDecorate(null, null, _supportPlan_decorators, { kind: "field", name: "supportPlan", static: false, private: false, access: { has: obj => "supportPlan" in obj, get: obj => obj.supportPlan, set: (obj, value) => { obj.supportPlan = value; } }, metadata: _metadata }, _supportPlan_initializers, _supportPlan_extraInitializers);
        __esDecorate(null, null, _rollbackTriggered_decorators, { kind: "field", name: "rollbackTriggered", static: false, private: false, access: { has: obj => "rollbackTriggered" in obj, get: obj => obj.rollbackTriggered, set: (obj, value) => { obj.rollbackTriggered = value; } }, metadata: _metadata }, _rollbackTriggered_initializers, _rollbackTriggered_extraInitializers);
        __esDecorate(null, null, _rollbackReason_decorators, { kind: "field", name: "rollbackReason", static: false, private: false, access: { has: obj => "rollbackReason" in obj, get: obj => obj.rollbackReason, set: (obj, value) => { obj.rollbackReason = value; } }, metadata: _metadata }, _rollbackReason_initializers, _rollbackReason_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GoLivePlan = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GoLivePlan = _classThis;
})();
exports.GoLivePlan = GoLivePlan;
/**
 * Commissioning Record Model
 */
let CommissioningRecord = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'commissioning_records',
            timestamps: true,
            indexes: [
                { fields: ['deployment_id'] },
                { fields: ['status'] },
                { fields: ['commissioning_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _deploymentId_decorators;
    let _deploymentId_initializers = [];
    let _deploymentId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _commissioningDate_decorators;
    let _commissioningDate_initializers = [];
    let _commissioningDate_extraInitializers = [];
    let _commissionedBy_decorators;
    let _commissionedBy_initializers = [];
    let _commissionedBy_extraInitializers = [];
    let _commissioningChecklist_decorators;
    let _commissioningChecklist_initializers = [];
    let _commissioningChecklist_extraInitializers = [];
    let _performanceBaseline_decorators;
    let _performanceBaseline_initializers = [];
    let _performanceBaseline_extraInitializers = [];
    let _calibrationResults_decorators;
    let _calibrationResults_initializers = [];
    let _calibrationResults_extraInitializers = [];
    let _trainingCompleted_decorators;
    let _trainingCompleted_initializers = [];
    let _trainingCompleted_extraInitializers = [];
    let _documentationDelivered_decorators;
    let _documentationDelivered_initializers = [];
    let _documentationDelivered_extraInitializers = [];
    let _warrantyActivated_decorators;
    let _warrantyActivated_initializers = [];
    let _warrantyActivated_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var CommissioningRecord = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.deploymentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _deploymentId_initializers, void 0));
            this.status = (__runInitializers(this, _deploymentId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.commissioningDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _commissioningDate_initializers, void 0));
            this.commissionedBy = (__runInitializers(this, _commissioningDate_extraInitializers), __runInitializers(this, _commissionedBy_initializers, void 0));
            this.commissioningChecklist = (__runInitializers(this, _commissionedBy_extraInitializers), __runInitializers(this, _commissioningChecklist_initializers, void 0));
            this.performanceBaseline = (__runInitializers(this, _commissioningChecklist_extraInitializers), __runInitializers(this, _performanceBaseline_initializers, void 0));
            this.calibrationResults = (__runInitializers(this, _performanceBaseline_extraInitializers), __runInitializers(this, _calibrationResults_initializers, void 0));
            this.trainingCompleted = (__runInitializers(this, _calibrationResults_extraInitializers), __runInitializers(this, _trainingCompleted_initializers, void 0));
            this.documentationDelivered = (__runInitializers(this, _trainingCompleted_extraInitializers), __runInitializers(this, _documentationDelivered_initializers, void 0));
            this.warrantyActivated = (__runInitializers(this, _documentationDelivered_extraInitializers), __runInitializers(this, _warrantyActivated_initializers, void 0));
            this.notes = (__runInitializers(this, _warrantyActivated_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.attachments = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.createdAt = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CommissioningRecord");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _deploymentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deployment ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(CommissioningStatus)), defaultValue: CommissioningStatus.NOT_STARTED }), sequelize_typescript_1.Index];
        _commissioningDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Commissioning date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _commissionedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Commissioned by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _commissioningChecklist_decorators = [(0, swagger_1.ApiProperty)({ description: 'Commissioning checklist' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _performanceBaseline_decorators = [(0, swagger_1.ApiProperty)({ description: 'Performance baseline' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _calibrationResults_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calibration results' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _trainingCompleted_decorators = [(0, swagger_1.ApiProperty)({ description: 'Training completed' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _documentationDelivered_decorators = [(0, swagger_1.ApiProperty)({ description: 'Documentation delivered' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _warrantyActivated_decorators = [(0, swagger_1.ApiProperty)({ description: 'Warranty activated' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _attachments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attachments' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _deploymentId_decorators, { kind: "field", name: "deploymentId", static: false, private: false, access: { has: obj => "deploymentId" in obj, get: obj => obj.deploymentId, set: (obj, value) => { obj.deploymentId = value; } }, metadata: _metadata }, _deploymentId_initializers, _deploymentId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _commissioningDate_decorators, { kind: "field", name: "commissioningDate", static: false, private: false, access: { has: obj => "commissioningDate" in obj, get: obj => obj.commissioningDate, set: (obj, value) => { obj.commissioningDate = value; } }, metadata: _metadata }, _commissioningDate_initializers, _commissioningDate_extraInitializers);
        __esDecorate(null, null, _commissionedBy_decorators, { kind: "field", name: "commissionedBy", static: false, private: false, access: { has: obj => "commissionedBy" in obj, get: obj => obj.commissionedBy, set: (obj, value) => { obj.commissionedBy = value; } }, metadata: _metadata }, _commissionedBy_initializers, _commissionedBy_extraInitializers);
        __esDecorate(null, null, _commissioningChecklist_decorators, { kind: "field", name: "commissioningChecklist", static: false, private: false, access: { has: obj => "commissioningChecklist" in obj, get: obj => obj.commissioningChecklist, set: (obj, value) => { obj.commissioningChecklist = value; } }, metadata: _metadata }, _commissioningChecklist_initializers, _commissioningChecklist_extraInitializers);
        __esDecorate(null, null, _performanceBaseline_decorators, { kind: "field", name: "performanceBaseline", static: false, private: false, access: { has: obj => "performanceBaseline" in obj, get: obj => obj.performanceBaseline, set: (obj, value) => { obj.performanceBaseline = value; } }, metadata: _metadata }, _performanceBaseline_initializers, _performanceBaseline_extraInitializers);
        __esDecorate(null, null, _calibrationResults_decorators, { kind: "field", name: "calibrationResults", static: false, private: false, access: { has: obj => "calibrationResults" in obj, get: obj => obj.calibrationResults, set: (obj, value) => { obj.calibrationResults = value; } }, metadata: _metadata }, _calibrationResults_initializers, _calibrationResults_extraInitializers);
        __esDecorate(null, null, _trainingCompleted_decorators, { kind: "field", name: "trainingCompleted", static: false, private: false, access: { has: obj => "trainingCompleted" in obj, get: obj => obj.trainingCompleted, set: (obj, value) => { obj.trainingCompleted = value; } }, metadata: _metadata }, _trainingCompleted_initializers, _trainingCompleted_extraInitializers);
        __esDecorate(null, null, _documentationDelivered_decorators, { kind: "field", name: "documentationDelivered", static: false, private: false, access: { has: obj => "documentationDelivered" in obj, get: obj => obj.documentationDelivered, set: (obj, value) => { obj.documentationDelivered = value; } }, metadata: _metadata }, _documentationDelivered_initializers, _documentationDelivered_extraInitializers);
        __esDecorate(null, null, _warrantyActivated_decorators, { kind: "field", name: "warrantyActivated", static: false, private: false, access: { has: obj => "warrantyActivated" in obj, get: obj => obj.warrantyActivated, set: (obj, value) => { obj.warrantyActivated = value; } }, metadata: _metadata }, _warrantyActivated_initializers, _warrantyActivated_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CommissioningRecord = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CommissioningRecord = _classThis;
})();
exports.CommissioningRecord = CommissioningRecord;
// ============================================================================
// DEPLOYMENT PLANNING FUNCTIONS
// ============================================================================
/**
 * Creates a deployment plan
 *
 * @param data - Deployment plan data
 * @param transaction - Optional database transaction
 * @returns Created deployment plan
 *
 * @example
 * ```typescript
 * const plan = await createDeploymentPlan({
 *   assetId: 'asset-123',
 *   siteId: 'site-456',
 *   locationId: 'loc-789',
 *   deploymentType: DeploymentType.NEW_INSTALLATION,
 *   priority: DeploymentPriority.HIGH,
 *   plannedStartDate: new Date('2024-06-01'),
 *   plannedEndDate: new Date('2024-06-05'),
 *   estimatedDuration: 2400,
 *   requiresSitePrep: true
 * });
 * ```
 */
async function createDeploymentPlan(data, transaction) {
    const plan = await DeploymentPlan.create({
        ...data,
        status: DeploymentStatus.PLANNED,
        percentComplete: 0,
    }, { transaction });
    return plan;
}
/**
 * Updates deployment plan
 *
 * @param planId - Plan identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * await updateDeploymentPlan('plan-123', {
 *   priority: DeploymentPriority.CRITICAL,
 *   plannedStartDate: new Date('2024-05-25')
 * });
 * ```
 */
async function updateDeploymentPlan(planId, updates, transaction) {
    const plan = await DeploymentPlan.findByPk(planId, { transaction });
    if (!plan) {
        throw new common_1.NotFoundException(`Deployment plan ${planId} not found`);
    }
    if (plan.status === DeploymentStatus.COMPLETED || plan.status === DeploymentStatus.CANCELLED) {
        throw new common_1.BadRequestException('Cannot update completed or cancelled deployment');
    }
    await plan.update(updates, { transaction });
    return plan;
}
/**
 * Schedules a deployment
 *
 * @param planId - Plan identifier
 * @param scheduledDate - Scheduled start date
 * @param transaction - Optional database transaction
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * await scheduleDeployment('plan-123', new Date('2024-06-01'));
 * ```
 */
async function scheduleDeployment(planId, scheduledDate, transaction) {
    const plan = await DeploymentPlan.findByPk(planId, { transaction });
    if (!plan) {
        throw new common_1.NotFoundException(`Deployment plan ${planId} not found`);
    }
    if (plan.status !== DeploymentStatus.PLANNED) {
        throw new common_1.BadRequestException('Can only schedule planned deployments');
    }
    await plan.update({
        status: DeploymentStatus.SCHEDULED,
        plannedStartDate: scheduledDate,
    }, { transaction });
    return plan;
}
/**
 * Gets deployment plans by status
 *
 * @param status - Deployment status
 * @param options - Query options
 * @returns Deployment plans
 *
 * @example
 * ```typescript
 * const scheduled = await getDeploymentsByStatus(DeploymentStatus.SCHEDULED);
 * ```
 */
async function getDeploymentsByStatus(status, options = {}) {
    return DeploymentPlan.findAll({
        where: { status },
        order: [['plannedStartDate', 'ASC']],
        ...options,
    });
}
/**
 * Gets deployments by site
 *
 * @param siteId - Site identifier
 * @param options - Query options
 * @returns Deployments
 *
 * @example
 * ```typescript
 * const siteDeployments = await getDeploymentsBySite('site-123');
 * ```
 */
async function getDeploymentsBySite(siteId, options = {}) {
    return DeploymentPlan.findAll({
        where: { siteId },
        order: [['plannedStartDate', 'DESC']],
        ...options,
    });
}
/**
 * Gets deployments by asset
 *
 * @param assetId - Asset identifier
 * @returns Deployment history
 *
 * @example
 * ```typescript
 * const history = await getDeploymentsByAsset('asset-123');
 * ```
 */
async function getDeploymentsByAsset(assetId) {
    return DeploymentPlan.findAll({
        where: { assetId },
        order: [['createdAt', 'DESC']],
    });
}
/**
 * Cancels a deployment
 *
 * @param planId - Plan identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * await cancelDeployment('plan-123', 'Site not ready');
 * ```
 */
async function cancelDeployment(planId, reason, transaction) {
    const plan = await DeploymentPlan.findByPk(planId, { transaction });
    if (!plan) {
        throw new common_1.NotFoundException(`Deployment plan ${planId} not found`);
    }
    if (plan.status === DeploymentStatus.COMPLETED) {
        throw new common_1.BadRequestException('Cannot cancel completed deployment');
    }
    await plan.update({
        status: DeploymentStatus.CANCELLED,
        notes: `${plan.notes || ''}\nCancelled: ${reason}`,
    }, { transaction });
    return plan;
}
// ============================================================================
// SITE PREPARATION FUNCTIONS
// ============================================================================
/**
 * Creates site preparation record
 *
 * @param data - Site prep data
 * @param transaction - Optional database transaction
 * @returns Created site preparation
 *
 * @example
 * ```typescript
 * const prep = await createSitePreparation({
 *   deploymentId: 'dep-123',
 *   requirements: [{
 *     category: 'Electrical',
 *     description: 'Install 220V outlet',
 *     completed: false,
 *     verificationRequired: true
 *   }],
 *   assignedTo: 'tech-456',
 *   scheduledDate: new Date('2024-05-28')
 * });
 * ```
 */
async function createSitePreparation(data, transaction) {
    const deployment = await DeploymentPlan.findByPk(data.deploymentId, { transaction });
    if (!deployment) {
        throw new common_1.NotFoundException(`Deployment ${data.deploymentId} not found`);
    }
    const prep = await SitePreparation.create({
        ...data,
        status: SitePrepStatus.PENDING,
    }, { transaction });
    return prep;
}
/**
 * Updates site preparation requirement
 *
 * @param prepId - Site prep identifier
 * @param requirementIndex - Index of requirement to update
 * @param updates - Requirement updates
 * @param transaction - Optional database transaction
 * @returns Updated site preparation
 *
 * @example
 * ```typescript
 * await updateSitePrepRequirement('prep-123', 0, {
 *   completed: true,
 *   completedBy: 'tech-456',
 *   completedDate: new Date()
 * });
 * ```
 */
async function updateSitePrepRequirement(prepId, requirementIndex, updates, transaction) {
    const prep = await SitePreparation.findByPk(prepId, { transaction });
    if (!prep) {
        throw new common_1.NotFoundException(`Site preparation ${prepId} not found`);
    }
    const requirements = [...prep.requirements];
    if (requirementIndex >= requirements.length) {
        throw new common_1.BadRequestException('Invalid requirement index');
    }
    requirements[requirementIndex] = { ...requirements[requirementIndex], ...updates };
    await prep.update({ requirements }, { transaction });
    // Check if all requirements completed
    const allCompleted = requirements.every(r => r.completed);
    if (allCompleted && prep.status !== SitePrepStatus.COMPLETED) {
        await prep.update({
            status: SitePrepStatus.COMPLETED,
            completedDate: new Date(),
        }, { transaction });
        // Update deployment status
        await DeploymentPlan.update({ status: DeploymentStatus.READY_FOR_DEPLOYMENT }, { where: { id: prep.deploymentId }, transaction });
    }
    return prep;
}
/**
 * Starts site preparation
 *
 * @param prepId - Site prep identifier
 * @param transaction - Optional database transaction
 * @returns Updated site preparation
 *
 * @example
 * ```typescript
 * await startSitePreparation('prep-123');
 * ```
 */
async function startSitePreparation(prepId, transaction) {
    const prep = await SitePreparation.findByPk(prepId, { transaction });
    if (!prep) {
        throw new common_1.NotFoundException(`Site preparation ${prepId} not found`);
    }
    await prep.update({
        status: SitePrepStatus.IN_PROGRESS,
        startedDate: new Date(),
    }, { transaction });
    // Update deployment status
    await DeploymentPlan.update({ status: DeploymentStatus.SITE_PREP_IN_PROGRESS }, { where: { id: prep.deploymentId }, transaction });
    return prep;
}
/**
 * Completes site preparation
 *
 * @param prepId - Site prep identifier
 * @param verificationData - Verification checklist data
 * @param transaction - Optional database transaction
 * @returns Updated site preparation
 *
 * @example
 * ```typescript
 * await completeSitePreparation('prep-123', {
 *   electricalVerified: true,
 *   structuralVerified: true,
 *   safetyVerified: true
 * });
 * ```
 */
async function completeSitePreparation(prepId, verificationData, transaction) {
    const prep = await SitePreparation.findByPk(prepId, { transaction });
    if (!prep) {
        throw new common_1.NotFoundException(`Site preparation ${prepId} not found`);
    }
    await prep.update({
        status: SitePrepStatus.COMPLETED,
        completedDate: new Date(),
        verificationChecklist: verificationData,
    }, { transaction });
    // Update deployment status
    await DeploymentPlan.update({ status: DeploymentStatus.READY_FOR_DEPLOYMENT }, { where: { id: prep.deploymentId }, transaction });
    return prep;
}
/**
 * Gets site preparation for deployment
 *
 * @param deploymentId - Deployment identifier
 * @returns Site preparation records
 *
 * @example
 * ```typescript
 * const preps = await getSitePreparationForDeployment('dep-123');
 * ```
 */
async function getSitePreparationForDeployment(deploymentId) {
    return SitePreparation.findAll({
        where: { deploymentId },
        order: [['scheduledDate', 'ASC']],
    });
}
// ============================================================================
// RESOURCE ALLOCATION FUNCTIONS
// ============================================================================
/**
 * Allocates resource to deployment
 *
 * @param data - Resource allocation data
 * @param transaction - Optional database transaction
 * @returns Created allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocateDeploymentResource({
 *   deploymentId: 'dep-123',
 *   resourceType: ResourceType.TECHNICIAN,
 *   resourceId: 'tech-456',
 *   allocatedFrom: new Date('2024-06-01 08:00'),
 *   allocatedUntil: new Date('2024-06-01 17:00'),
 *   primaryAssignment: true
 * });
 * ```
 */
async function allocateDeploymentResource(data, transaction) {
    // Check for conflicts
    const conflicts = await ResourceAllocation.findAll({
        where: {
            resourceId: data.resourceId,
            [sequelize_1.Op.or]: [
                {
                    allocatedFrom: { [sequelize_1.Op.between]: [data.allocatedFrom, data.allocatedUntil] },
                },
                {
                    allocatedUntil: { [sequelize_1.Op.between]: [data.allocatedFrom, data.allocatedUntil] },
                },
            ],
        },
        transaction,
    });
    if (conflicts.length > 0) {
        throw new common_1.ConflictException('Resource already allocated for this time period');
    }
    const allocation = await ResourceAllocation.create(data, { transaction });
    return allocation;
}
/**
 * Deallocates resource from deployment
 *
 * @param allocationId - Allocation identifier
 * @param transaction - Optional database transaction
 * @returns Deletion result
 *
 * @example
 * ```typescript
 * await deallocateDeploymentResource('alloc-123');
 * ```
 */
async function deallocateDeploymentResource(allocationId, transaction) {
    const allocation = await ResourceAllocation.findByPk(allocationId, { transaction });
    if (!allocation) {
        throw new common_1.NotFoundException(`Allocation ${allocationId} not found`);
    }
    await allocation.destroy({ transaction });
    return true;
}
/**
 * Gets resource allocations for deployment
 *
 * @param deploymentId - Deployment identifier
 * @returns Resource allocations
 *
 * @example
 * ```typescript
 * const resources = await getDeploymentResourceAllocations('dep-123');
 * ```
 */
async function getDeploymentResourceAllocations(deploymentId) {
    return ResourceAllocation.findAll({
        where: { deploymentId },
        order: [['allocatedFrom', 'ASC']],
    });
}
/**
 * Gets resource availability
 *
 * @param resourceId - Resource identifier
 * @param startDate - Start of period
 * @param endDate - End of period
 * @returns Availability status
 *
 * @example
 * ```typescript
 * const available = await checkResourceAvailability(
 *   'tech-123',
 *   new Date('2024-06-01'),
 *   new Date('2024-06-05')
 * );
 * ```
 */
async function checkResourceAvailability(resourceId, startDate, endDate) {
    const allocations = await ResourceAllocation.findAll({
        where: {
            resourceId,
            [sequelize_1.Op.or]: [
                {
                    allocatedFrom: { [sequelize_1.Op.between]: [startDate, endDate] },
                },
                {
                    allocatedUntil: { [sequelize_1.Op.between]: [startDate, endDate] },
                },
            ],
        },
    });
    return {
        available: allocations.length === 0,
        allocations,
    };
}
/**
 * Bulk allocates resources
 *
 * @param deploymentId - Deployment identifier
 * @param resources - Resource allocations
 * @param transaction - Optional database transaction
 * @returns Created allocations
 *
 * @example
 * ```typescript
 * await bulkAllocateResources('dep-123', [
 *   { resourceType: ResourceType.TECHNICIAN, resourceId: 'tech-1', ... },
 *   { resourceType: ResourceType.EQUIPMENT, resourceId: 'crane-1', ... }
 * ]);
 * ```
 */
async function bulkAllocateResources(deploymentId, resources, transaction) {
    const allocations = [];
    for (const resource of resources) {
        try {
            const allocation = await allocateDeploymentResource({ ...resource, deploymentId }, transaction);
            allocations.push(allocation);
        }
        catch (error) {
            // Continue with other resources, collect errors
            console.error(`Failed to allocate resource ${resource.resourceId}:`, error.message);
        }
    }
    return allocations;
}
// ============================================================================
// INSTALLATION EXECUTION FUNCTIONS
// ============================================================================
/**
 * Starts deployment execution
 *
 * @param deploymentId - Deployment identifier
 * @param startedBy - User starting deployment
 * @param transaction - Optional database transaction
 * @returns Updated deployment
 *
 * @example
 * ```typescript
 * await startDeploymentExecution('dep-123', 'pm-456');
 * ```
 */
async function startDeploymentExecution(deploymentId, startedBy, transaction) {
    const deployment = await DeploymentPlan.findByPk(deploymentId, { transaction });
    if (!deployment) {
        throw new common_1.NotFoundException(`Deployment ${deploymentId} not found`);
    }
    if (deployment.status !== DeploymentStatus.READY_FOR_DEPLOYMENT &&
        deployment.status !== DeploymentStatus.SCHEDULED) {
        throw new common_1.BadRequestException('Deployment not ready for execution');
    }
    await deployment.update({
        status: DeploymentStatus.IN_PROGRESS,
        actualStartDate: new Date(),
        currentPhase: InstallationPhase.PRE_INSTALLATION,
    }, { transaction });
    return deployment;
}
/**
 * Updates installation progress
 *
 * @param data - Progress data
 * @param transaction - Optional database transaction
 * @returns Created progress record
 *
 * @example
 * ```typescript
 * await updateInstallationProgress({
 *   deploymentId: 'dep-123',
 *   currentPhase: InstallationPhase.PHYSICAL_INSTALLATION,
 *   currentStep: 3,
 *   completedSteps: [1, 2],
 *   percentComplete: 25,
 *   updatedBy: 'tech-456'
 * });
 * ```
 */
async function updateInstallationProgress(data, transaction) {
    const progress = await InstallationProgress.create(data, { transaction });
    // Update deployment
    await DeploymentPlan.update({
        currentPhase: data.currentPhase,
        percentComplete: data.percentComplete,
    }, {
        where: { id: data.deploymentId },
        transaction,
    });
    return progress;
}
/**
 * Records installation issue
 *
 * @param deploymentId - Deployment identifier
 * @param issue - Issue details
 * @param transaction - Optional database transaction
 * @returns Updated progress
 *
 * @example
 * ```typescript
 * await recordInstallationIssue('dep-123', {
 *   severity: 'high',
 *   description: 'Missing mounting hardware',
 *   reportedBy: 'tech-456',
 *   reportedAt: new Date()
 * });
 * ```
 */
async function recordInstallationIssue(deploymentId, issue, transaction) {
    const latestProgress = await InstallationProgress.findOne({
        where: { deploymentId },
        order: [['createdAt', 'DESC']],
        transaction,
    });
    if (!latestProgress) {
        throw new common_1.NotFoundException('No installation progress found');
    }
    const issues = latestProgress.issues || [];
    issues.push(issue);
    await latestProgress.update({ issues }, { transaction });
    // Update deployment status if critical
    if (issue.severity === 'critical') {
        await DeploymentPlan.update({ status: DeploymentStatus.ON_HOLD }, { where: { id: deploymentId }, transaction });
    }
    return latestProgress;
}
/**
 * Resolves installation issue
 *
 * @param deploymentId - Deployment identifier
 * @param issueIndex - Issue index
 * @param resolution - Resolution details
 * @param resolvedBy - User resolving issue
 * @param transaction - Optional database transaction
 * @returns Updated progress
 *
 * @example
 * ```typescript
 * await resolveInstallationIssue('dep-123', 0, 'Hardware procured and installed', 'tech-456');
 * ```
 */
async function resolveInstallationIssue(deploymentId, issueIndex, resolution, resolvedBy, transaction) {
    const latestProgress = await InstallationProgress.findOne({
        where: { deploymentId },
        order: [['createdAt', 'DESC']],
        transaction,
    });
    if (!latestProgress) {
        throw new common_1.NotFoundException('No installation progress found');
    }
    const issues = latestProgress.issues || [];
    if (issueIndex >= issues.length) {
        throw new common_1.BadRequestException('Invalid issue index');
    }
    issues[issueIndex] = {
        ...issues[issueIndex],
        resolution,
        resolvedBy,
        resolvedAt: new Date(),
    };
    await latestProgress.update({ issues }, { transaction });
    return latestProgress;
}
/**
 * Gets installation progress history
 *
 * @param deploymentId - Deployment identifier
 * @returns Progress records
 *
 * @example
 * ```typescript
 * const history = await getInstallationProgressHistory('dep-123');
 * ```
 */
async function getInstallationProgressHistory(deploymentId) {
    return InstallationProgress.findAll({
        where: { deploymentId },
        order: [['createdAt', 'ASC']],
    });
}
// ============================================================================
// CONFIGURATION MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Records deployment configuration
 *
 * @param data - Configuration data
 * @param transaction - Optional database transaction
 * @returns Created configuration
 *
 * @example
 * ```typescript
 * const config = await recordDeploymentConfiguration({
 *   deploymentId: 'dep-123',
 *   configurationType: 'network',
 *   parameters: { ip: '192.168.1.100', subnet: '255.255.255.0' },
 *   configuredBy: 'tech-456',
 *   configurationDate: new Date(),
 *   backupCreated: true,
 *   validationRequired: true
 * });
 * ```
 */
async function recordDeploymentConfiguration(data, transaction) {
    const config = await DeploymentConfiguration.create(data, { transaction });
    return config;
}
/**
 * Validates configuration
 *
 * @param configId - Configuration identifier
 * @param validatedBy - User validating
 * @param transaction - Optional database transaction
 * @returns Updated configuration
 *
 * @example
 * ```typescript
 * await validateConfiguration('config-123', 'engineer-789');
 * ```
 */
async function validateConfiguration(configId, validatedBy, transaction) {
    const config = await DeploymentConfiguration.findByPk(configId, { transaction });
    if (!config) {
        throw new common_1.NotFoundException(`Configuration ${configId} not found`);
    }
    await config.update({
        validated: true,
        validatedBy,
        validationDate: new Date(),
    }, { transaction });
    return config;
}
/**
 * Gets configurations for deployment
 *
 * @param deploymentId - Deployment identifier
 * @returns Configuration records
 *
 * @example
 * ```typescript
 * const configs = await getDeploymentConfigurations('dep-123');
 * ```
 */
async function getDeploymentConfigurations(deploymentId) {
    return DeploymentConfiguration.findAll({
        where: { deploymentId },
        order: [['configurationDate', 'DESC']],
    });
}
// ============================================================================
// TESTING AND ACCEPTANCE FUNCTIONS
// ============================================================================
/**
 * Executes deployment tests
 *
 * @param data - Test execution data
 * @param transaction - Optional database transaction
 * @returns Created test record
 *
 * @example
 * ```typescript
 * const test = await executeDeploymentTests({
 *   deploymentId: 'dep-123',
 *   testPlanId: 'plan-456',
 *   testCases: [{
 *     testId: 'test-1',
 *     name: 'Power on test',
 *     description: 'Verify system powers on correctly',
 *     expectedResult: 'System starts within 30 seconds',
 *     status: TestStatus.NOT_STARTED
 *   }],
 *   executedBy: 'tester-789',
 *   executionDate: new Date(),
 *   environment: 'production'
 * });
 * ```
 */
async function executeDeploymentTests(data, transaction) {
    const test = await DeploymentTest.create({
        ...data,
        overallStatus: TestStatus.IN_PROGRESS,
    }, { transaction });
    // Update deployment status
    await DeploymentPlan.update({ status: DeploymentStatus.TESTING }, { where: { id: data.deploymentId }, transaction });
    return test;
}
/**
 * Updates test case result
 *
 * @param testId - Test identifier
 * @param testCaseId - Test case identifier
 * @param result - Test result
 * @param transaction - Optional database transaction
 * @returns Updated test
 *
 * @example
 * ```typescript
 * await updateTestCaseResult('test-123', 'case-1', {
 *   actualResult: 'System started in 15 seconds',
 *   status: TestStatus.PASSED,
 *   executedAt: new Date()
 * });
 * ```
 */
async function updateTestCaseResult(testId, testCaseId, result, transaction) {
    const test = await DeploymentTest.findByPk(testId, { transaction });
    if (!test) {
        throw new common_1.NotFoundException(`Test ${testId} not found`);
    }
    const testCases = test.testCases.map(tc => tc.testId === testCaseId ? { ...tc, ...result } : tc);
    // Calculate summary
    const summary = {
        totalTests: testCases.length,
        passed: testCases.filter(tc => tc.status === TestStatus.PASSED).length,
        failed: testCases.filter(tc => tc.status === TestStatus.FAILED).length,
        conditionalPass: testCases.filter(tc => tc.status === TestStatus.CONDITIONAL_PASS).length,
        notStarted: testCases.filter(tc => tc.status === TestStatus.NOT_STARTED).length,
    };
    // Determine overall status
    let overallStatus = test.overallStatus;
    if (summary.notStarted === 0) {
        if (summary.failed > 0) {
            overallStatus = TestStatus.FAILED;
        }
        else if (summary.conditionalPass > 0) {
            overallStatus = TestStatus.CONDITIONAL_PASS;
        }
        else {
            overallStatus = TestStatus.PASSED;
        }
    }
    await test.update({
        testCases,
        resultsSummary: summary,
        overallStatus,
    }, { transaction });
    return test;
}
/**
 * Creates acceptance criteria
 *
 * @param data - Acceptance data
 * @param transaction - Optional database transaction
 * @returns Created acceptance record
 *
 * @example
 * ```typescript
 * const acceptance = await createAcceptanceCriteria({
 *   deploymentId: 'dep-123',
 *   criteria: [{
 *     criterionId: 'crit-1',
 *     description: 'All tests passed',
 *     met: true,
 *     verifiedBy: 'qa-456',
 *     verificationDate: new Date()
 *   }]
 * });
 * ```
 */
async function createAcceptanceCriteria(data, transaction) {
    const acceptance = await DeploymentAcceptance.create({
        ...data,
        status: AcceptanceStatus.PENDING,
    }, { transaction });
    return acceptance;
}
/**
 * Records acceptance decision
 *
 * @param deploymentId - Deployment identifier
 * @param accepted - Whether accepted
 * @param acceptedBy - User accepting
 * @param exceptions - Acceptance exceptions
 * @param transaction - Optional database transaction
 * @returns Updated acceptance
 *
 * @example
 * ```typescript
 * await recordAcceptanceDecision('dep-123', true, 'customer-789', []);
 * ```
 */
async function recordAcceptanceDecision(deploymentId, accepted, acceptedBy, exceptions = [], transaction) {
    const acceptance = await DeploymentAcceptance.findOne({
        where: { deploymentId },
        transaction,
    });
    if (!acceptance) {
        throw new common_1.NotFoundException('Acceptance criteria not found');
    }
    const status = accepted
        ? (exceptions.length > 0 ? AcceptanceStatus.ACCEPTED_WITH_EXCEPTIONS : AcceptanceStatus.ACCEPTED)
        : AcceptanceStatus.REJECTED;
    await acceptance.update({
        status,
        acceptedBy,
        acceptanceDate: new Date(),
        exceptions,
    }, { transaction });
    // Update deployment status
    if (accepted) {
        await DeploymentPlan.update({ status: DeploymentStatus.COMPLETED, actualEndDate: new Date() }, { where: { id: deploymentId }, transaction });
    }
    return acceptance;
}
// ============================================================================
// GO-LIVE AND COMMISSIONING FUNCTIONS
// ============================================================================
/**
 * Creates go-live plan
 *
 * @param data - Go-live data
 * @param transaction - Optional database transaction
 * @returns Created go-live plan
 *
 * @example
 * ```typescript
 * const goLive = await createGoLivePlan({
 *   deploymentId: 'dep-123',
 *   goLiveDate: new Date('2024-06-15'),
 *   cutoverPlan: [...],
 *   rollbackPlan: [...],
 *   stakeholderApprovals: ['user-1', 'user-2']
 * });
 * ```
 */
async function createGoLivePlan(data, transaction) {
    const plan = await GoLivePlan.create({
        ...data,
        status: 'planned',
        allApprovalsReceived: false,
        rollbackTriggered: false,
    }, { transaction });
    return plan;
}
/**
 * Executes go-live
 *
 * @param planId - Go-live plan identifier
 * @param transaction - Optional database transaction
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * await executeGoLive('plan-123');
 * ```
 */
async function executeGoLive(planId, transaction) {
    const plan = await GoLivePlan.findByPk(planId, { transaction });
    if (!plan) {
        throw new common_1.NotFoundException(`Go-live plan ${planId} not found`);
    }
    if (!plan.allApprovalsReceived) {
        throw new common_1.BadRequestException('Not all approvals received');
    }
    await plan.update({
        status: 'in_progress',
        actualGoLiveDate: new Date(),
    }, { transaction });
    return plan;
}
/**
 * Triggers rollback
 *
 * @param planId - Go-live plan identifier
 * @param reason - Rollback reason
 * @param transaction - Optional database transaction
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * await triggerRollback('plan-123', 'Critical system error detected');
 * ```
 */
async function triggerRollback(planId, reason, transaction) {
    const plan = await GoLivePlan.findByPk(planId, { transaction });
    if (!plan) {
        throw new common_1.NotFoundException(`Go-live plan ${planId} not found`);
    }
    await plan.update({
        status: 'aborted',
        rollbackTriggered: true,
        rollbackReason: reason,
    }, { transaction });
    // Update deployment status
    const deployment = await DeploymentPlan.findByPk(plan.deploymentId, { transaction });
    if (deployment) {
        await deployment.update({
            status: DeploymentStatus.ROLLED_BACK,
        }, { transaction });
    }
    return plan;
}
/**
 * Creates commissioning record
 *
 * @param deploymentId - Deployment identifier
 * @param transaction - Optional database transaction
 * @returns Created commissioning record
 *
 * @example
 * ```typescript
 * const commissioning = await createCommissioningRecord('dep-123');
 * ```
 */
async function createCommissioningRecord(deploymentId, transaction) {
    const record = await CommissioningRecord.create({
        deploymentId,
        status: CommissioningStatus.NOT_STARTED,
        trainingCompleted: false,
        documentationDelivered: false,
        warrantyActivated: false,
    }, { transaction });
    return record;
}
/**
 * Completes commissioning
 *
 * @param recordId - Commissioning record identifier
 * @param commissionedBy - User completing commissioning
 * @param data - Commissioning data
 * @param transaction - Optional database transaction
 * @returns Updated record
 *
 * @example
 * ```typescript
 * await completeCommissioning('comm-123', 'engineer-456', {
 *   performanceBaseline: {...},
 *   calibrationResults: {...}
 * });
 * ```
 */
async function completeCommissioning(recordId, commissionedBy, data, transaction) {
    const record = await CommissioningRecord.findByPk(recordId, { transaction });
    if (!record) {
        throw new common_1.NotFoundException(`Commissioning record ${recordId} not found`);
    }
    await record.update({
        status: CommissioningStatus.COMPLETED,
        commissionedBy,
        commissioningDate: new Date(),
        ...data,
    }, { transaction });
    return record;
}
/**
 * Gets commissioning record for deployment
 *
 * @param deploymentId - Deployment identifier
 * @returns Commissioning record
 *
 * @example
 * ```typescript
 * const commissioning = await getCommissioningRecord('dep-123');
 * ```
 */
async function getCommissioningRecord(deploymentId) {
    return CommissioningRecord.findOne({
        where: { deploymentId },
    });
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    DeploymentPlan,
    SitePreparation,
    ResourceAllocation,
    InstallationProgress,
    DeploymentConfiguration,
    DeploymentTest,
    DeploymentAcceptance,
    GoLivePlan,
    CommissioningRecord,
    // Planning Functions
    createDeploymentPlan,
    updateDeploymentPlan,
    scheduleDeployment,
    getDeploymentsByStatus,
    getDeploymentsBySite,
    getDeploymentsByAsset,
    cancelDeployment,
    // Site Preparation Functions
    createSitePreparation,
    updateSitePrepRequirement,
    startSitePreparation,
    completeSitePreparation,
    getSitePreparationForDeployment,
    // Resource Allocation Functions
    allocateDeploymentResource,
    deallocateDeploymentResource,
    getDeploymentResourceAllocations,
    checkResourceAvailability,
    bulkAllocateResources,
    // Installation Functions
    startDeploymentExecution,
    updateInstallationProgress,
    recordInstallationIssue,
    resolveInstallationIssue,
    getInstallationProgressHistory,
    // Configuration Functions
    recordDeploymentConfiguration,
    validateConfiguration,
    getDeploymentConfigurations,
    // Testing and Acceptance Functions
    executeDeploymentTests,
    updateTestCaseResult,
    createAcceptanceCriteria,
    recordAcceptanceDecision,
    // Go-Live and Commissioning Functions
    createGoLivePlan,
    executeGoLive,
    triggerRollback,
    createCommissioningRecord,
    completeCommissioning,
    getCommissioningRecord,
};
//# sourceMappingURL=asset-deployment-commands.js.map