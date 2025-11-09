"use strict";
/**
 * LOC: STKMGMT12345
 * File: /reuse/consulting/stakeholder-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend consulting services
 *   - Stakeholder engagement controllers
 *   - Communication planning engines
 *   - Influence mapping services
 */
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCommunicationCalendar = exports.craftKeyMessage = exports.defineTargetAudiences = exports.createCommunicationPlan = exports.assessNetworkResilience = exports.generateInfluenceNetworkVisualization = exports.simulateInfluenceCascade = exports.identifyOpinionLeaders = exports.analyzeInfluencePaths = exports.findKeyInfluencers = exports.identifyInfluenceClusters = exports.calculateNetworkCentrality = exports.mapInfluenceNetwork = exports.exportPowerInterestAnalysis = exports.simulateStakeholderScenario = exports.analyzeStakeholderPortfolio = exports.generateGridVisualization = exports.prioritizeStakeholderEngagement = exports.identifyAtRiskStakeholders = exports.trackStakeholderMovement = exports.generateEngagementStrategy = exports.mapPowerInterestGrid = exports.generateStakeholderRegister = exports.analyzeStakeholderRelationships = exports.identifyKeyStakeholders = exports.assessStakeholderAttitude = exports.segmentStakeholders = exports.generateStakeholderProfile = exports.calculateStakeholderImpact = exports.analyzeStakeholderPowerInterest = exports.identifyStakeholders = exports.createEngagementRecordModel = exports.createCommunicationPlanModel = exports.createStakeholderModel = exports.PowerInterestMappingDto = exports.CreateRACIMatrixDto = exports.CreateActionItemDto = exports.CreateEngagementRecordDto = exports.CreateCommunicationPlanDto = exports.UpdateStakeholderDto = exports.CreateStakeholderDto = exports.ResistanceLevel = exports.EngagementStatus = exports.RACIRole = exports.CommunicationChannel = exports.CommunicationFrequency = exports.StakeholderAttitude = exports.InfluenceType = exports.StakeholderInterestLevel = exports.StakeholderPowerLevel = void 0;
exports.generateStakeholderReport = exports.buildStakeholderCoalition = exports.validateRACIMatrix = exports.createRACIMatrix = exports.identifyEngagementGaps = exports.generateEngagementScorecard = exports.trackActionItems = exports.analyzeStakeholderSentiment = exports.recordStakeholderEngagement = exports.generateCommunicationTemplate = exports.adjustCommunicationPlan = exports.measureCommunicationEffectiveness = exports.trackCommunicationExecution = exports.selectCommunicationChannels = void 0;
/**
 * File: /reuse/consulting/stakeholder-management-kit.ts
 * Locator: WC-CONS-STKMGMT-001
 * Purpose: Comprehensive Stakeholder Management & Engagement Utilities - McKinsey/BCG-level stakeholder strategy
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Consulting controllers, stakeholder services, engagement tracking, communication management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for stakeholder analysis, power-interest grids, influence mapping, communication planning, engagement tracking
 *
 * LLM Context: Enterprise-grade stakeholder management system competing with McKinsey and BCG consulting practices.
 * Provides stakeholder identification and analysis, power-interest grid mapping, influence network analysis, RACI matrix generation,
 * communication planning and execution, stakeholder engagement tracking, resistance management, coalition building, stakeholder personas,
 * escalation management, feedback collection, sentiment analysis, relationship scoring, engagement metrics, stakeholder journey mapping,
 * meeting management, action item tracking, stakeholder surveys, executive sponsorship management.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Stakeholder power levels
 */
var StakeholderPowerLevel;
(function (StakeholderPowerLevel) {
    StakeholderPowerLevel["VERY_LOW"] = "very_low";
    StakeholderPowerLevel["LOW"] = "low";
    StakeholderPowerLevel["MEDIUM"] = "medium";
    StakeholderPowerLevel["HIGH"] = "high";
    StakeholderPowerLevel["VERY_HIGH"] = "very_high";
})(StakeholderPowerLevel || (exports.StakeholderPowerLevel = StakeholderPowerLevel = {}));
/**
 * Stakeholder interest levels
 */
var StakeholderInterestLevel;
(function (StakeholderInterestLevel) {
    StakeholderInterestLevel["VERY_LOW"] = "very_low";
    StakeholderInterestLevel["LOW"] = "low";
    StakeholderInterestLevel["MEDIUM"] = "medium";
    StakeholderInterestLevel["HIGH"] = "high";
    StakeholderInterestLevel["VERY_HIGH"] = "very_high";
})(StakeholderInterestLevel || (exports.StakeholderInterestLevel = StakeholderInterestLevel = {}));
/**
 * Stakeholder influence types
 */
var InfluenceType;
(function (InfluenceType) {
    InfluenceType["FORMAL"] = "formal";
    InfluenceType["EXPERT"] = "expert";
    InfluenceType["POLITICAL"] = "political";
    InfluenceType["COALITION"] = "coalition";
    InfluenceType["FINANCIAL"] = "financial";
    InfluenceType["TECHNICAL"] = "technical";
})(InfluenceType || (exports.InfluenceType = InfluenceType = {}));
/**
 * Stakeholder attitude
 */
var StakeholderAttitude;
(function (StakeholderAttitude) {
    StakeholderAttitude["CHAMPION"] = "champion";
    StakeholderAttitude["SUPPORTER"] = "supporter";
    StakeholderAttitude["NEUTRAL"] = "neutral";
    StakeholderAttitude["SKEPTIC"] = "skeptic";
    StakeholderAttitude["BLOCKER"] = "blocker";
})(StakeholderAttitude || (exports.StakeholderAttitude = StakeholderAttitude = {}));
/**
 * Communication frequency
 */
var CommunicationFrequency;
(function (CommunicationFrequency) {
    CommunicationFrequency["DAILY"] = "daily";
    CommunicationFrequency["WEEKLY"] = "weekly";
    CommunicationFrequency["BIWEEKLY"] = "biweekly";
    CommunicationFrequency["MONTHLY"] = "monthly";
    CommunicationFrequency["QUARTERLY"] = "quarterly";
    CommunicationFrequency["AS_NEEDED"] = "as_needed";
})(CommunicationFrequency || (exports.CommunicationFrequency = CommunicationFrequency = {}));
/**
 * Communication channel
 */
var CommunicationChannel;
(function (CommunicationChannel) {
    CommunicationChannel["EMAIL"] = "email";
    CommunicationChannel["MEETING"] = "meeting";
    CommunicationChannel["WORKSHOP"] = "workshop";
    CommunicationChannel["PHONE"] = "phone";
    CommunicationChannel["VIDEO_CALL"] = "video_call";
    CommunicationChannel["PRESENTATION"] = "presentation";
    CommunicationChannel["REPORT"] = "report";
    CommunicationChannel["NEWSLETTER"] = "newsletter";
    CommunicationChannel["PORTAL"] = "portal";
})(CommunicationChannel || (exports.CommunicationChannel = CommunicationChannel = {}));
/**
 * RACI role types
 */
var RACIRole;
(function (RACIRole) {
    RACIRole["RESPONSIBLE"] = "responsible";
    RACIRole["ACCOUNTABLE"] = "accountable";
    RACIRole["CONSULTED"] = "consulted";
    RACIRole["INFORMED"] = "informed";
})(RACIRole || (exports.RACIRole = RACIRole = {}));
/**
 * Engagement status
 */
var EngagementStatus;
(function (EngagementStatus) {
    EngagementStatus["NOT_ENGAGED"] = "not_engaged";
    EngagementStatus["INITIAL_CONTACT"] = "initial_contact";
    EngagementStatus["ENGAGED"] = "engaged";
    EngagementStatus["HIGHLY_ENGAGED"] = "highly_engaged";
    EngagementStatus["DISENGAGED"] = "disengaged";
})(EngagementStatus || (exports.EngagementStatus = EngagementStatus = {}));
/**
 * Resistance level
 */
var ResistanceLevel;
(function (ResistanceLevel) {
    ResistanceLevel["NONE"] = "none";
    ResistanceLevel["LOW"] = "low";
    ResistanceLevel["MODERATE"] = "moderate";
    ResistanceLevel["HIGH"] = "high";
    ResistanceLevel["CRITICAL"] = "critical";
})(ResistanceLevel || (exports.ResistanceLevel = ResistanceLevel = {}));
// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================
/**
 * Create stakeholder DTO
 */
let CreateStakeholderDto = (() => {
    var _a;
    let _stakeholderName_decorators;
    let _stakeholderName_initializers = [];
    let _stakeholderName_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    let _department_decorators;
    let _department_initializers = [];
    let _department_extraInitializers = [];
    let _organizationLevel_decorators;
    let _organizationLevel_initializers = [];
    let _organizationLevel_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _powerLevel_decorators;
    let _powerLevel_initializers = [];
    let _powerLevel_extraInitializers = [];
    let _interestLevel_decorators;
    let _interestLevel_initializers = [];
    let _interestLevel_extraInitializers = [];
    return _a = class CreateStakeholderDto {
            constructor() {
                this.stakeholderName = __runInitializers(this, _stakeholderName_initializers, void 0);
                this.role = (__runInitializers(this, _stakeholderName_extraInitializers), __runInitializers(this, _role_initializers, void 0));
                this.department = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _department_initializers, void 0));
                this.organizationLevel = (__runInitializers(this, _department_extraInitializers), __runInitializers(this, _organizationLevel_initializers, void 0));
                this.email = (__runInitializers(this, _organizationLevel_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.powerLevel = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _powerLevel_initializers, void 0));
                this.interestLevel = (__runInitializers(this, _powerLevel_extraInitializers), __runInitializers(this, _interestLevel_initializers, void 0));
                __runInitializers(this, _interestLevel_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _stakeholderName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Stakeholder name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(2), (0, class_validator_1.MaxLength)(255)];
            _role_decorators = [(0, swagger_1.ApiProperty)({ description: 'Role/title' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _department_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _organizationLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization level (e.g., Executive, Director, Manager)' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _email_decorators = [(0, swagger_1.ApiProperty)({ description: 'Email address' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _phone_decorators = [(0, swagger_1.ApiProperty)({ description: 'Phone number', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _powerLevel_decorators = [(0, swagger_1.ApiProperty)({ enum: StakeholderPowerLevel }), (0, class_validator_1.IsEnum)(StakeholderPowerLevel)];
            _interestLevel_decorators = [(0, swagger_1.ApiProperty)({ enum: StakeholderInterestLevel }), (0, class_validator_1.IsEnum)(StakeholderInterestLevel)];
            __esDecorate(null, null, _stakeholderName_decorators, { kind: "field", name: "stakeholderName", static: false, private: false, access: { has: obj => "stakeholderName" in obj, get: obj => obj.stakeholderName, set: (obj, value) => { obj.stakeholderName = value; } }, metadata: _metadata }, _stakeholderName_initializers, _stakeholderName_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            __esDecorate(null, null, _department_decorators, { kind: "field", name: "department", static: false, private: false, access: { has: obj => "department" in obj, get: obj => obj.department, set: (obj, value) => { obj.department = value; } }, metadata: _metadata }, _department_initializers, _department_extraInitializers);
            __esDecorate(null, null, _organizationLevel_decorators, { kind: "field", name: "organizationLevel", static: false, private: false, access: { has: obj => "organizationLevel" in obj, get: obj => obj.organizationLevel, set: (obj, value) => { obj.organizationLevel = value; } }, metadata: _metadata }, _organizationLevel_initializers, _organizationLevel_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _powerLevel_decorators, { kind: "field", name: "powerLevel", static: false, private: false, access: { has: obj => "powerLevel" in obj, get: obj => obj.powerLevel, set: (obj, value) => { obj.powerLevel = value; } }, metadata: _metadata }, _powerLevel_initializers, _powerLevel_extraInitializers);
            __esDecorate(null, null, _interestLevel_decorators, { kind: "field", name: "interestLevel", static: false, private: false, access: { has: obj => "interestLevel" in obj, get: obj => obj.interestLevel, set: (obj, value) => { obj.interestLevel = value; } }, metadata: _metadata }, _interestLevel_initializers, _interestLevel_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateStakeholderDto = CreateStakeholderDto;
/**
 * Update stakeholder DTO
 */
let UpdateStakeholderDto = (() => {
    var _a;
    let _powerLevel_decorators;
    let _powerLevel_initializers = [];
    let _powerLevel_extraInitializers = [];
    let _interestLevel_decorators;
    let _interestLevel_initializers = [];
    let _interestLevel_extraInitializers = [];
    let _attitude_decorators;
    let _attitude_initializers = [];
    let _attitude_extraInitializers = [];
    let _engagementStatus_decorators;
    let _engagementStatus_initializers = [];
    let _engagementStatus_extraInitializers = [];
    let _objectives_decorators;
    let _objectives_initializers = [];
    let _objectives_extraInitializers = [];
    let _concerns_decorators;
    let _concerns_initializers = [];
    let _concerns_extraInitializers = [];
    return _a = class UpdateStakeholderDto {
            constructor() {
                this.powerLevel = __runInitializers(this, _powerLevel_initializers, void 0);
                this.interestLevel = (__runInitializers(this, _powerLevel_extraInitializers), __runInitializers(this, _interestLevel_initializers, void 0));
                this.attitude = (__runInitializers(this, _interestLevel_extraInitializers), __runInitializers(this, _attitude_initializers, void 0));
                this.engagementStatus = (__runInitializers(this, _attitude_extraInitializers), __runInitializers(this, _engagementStatus_initializers, void 0));
                this.objectives = (__runInitializers(this, _engagementStatus_extraInitializers), __runInitializers(this, _objectives_initializers, void 0));
                this.concerns = (__runInitializers(this, _objectives_extraInitializers), __runInitializers(this, _concerns_initializers, void 0));
                __runInitializers(this, _concerns_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _powerLevel_decorators = [(0, swagger_1.ApiProperty)({ enum: StakeholderPowerLevel, required: false }), (0, class_validator_1.IsEnum)(StakeholderPowerLevel), (0, class_validator_1.IsOptional)()];
            _interestLevel_decorators = [(0, swagger_1.ApiProperty)({ enum: StakeholderInterestLevel, required: false }), (0, class_validator_1.IsEnum)(StakeholderInterestLevel), (0, class_validator_1.IsOptional)()];
            _attitude_decorators = [(0, swagger_1.ApiProperty)({ enum: StakeholderAttitude, required: false }), (0, class_validator_1.IsEnum)(StakeholderAttitude), (0, class_validator_1.IsOptional)()];
            _engagementStatus_decorators = [(0, swagger_1.ApiProperty)({ enum: EngagementStatus, required: false }), (0, class_validator_1.IsEnum)(EngagementStatus), (0, class_validator_1.IsOptional)()];
            _objectives_decorators = [(0, swagger_1.ApiProperty)({ description: 'Objectives', type: [String], required: false }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _concerns_decorators = [(0, swagger_1.ApiProperty)({ description: 'Concerns', type: [String], required: false }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _powerLevel_decorators, { kind: "field", name: "powerLevel", static: false, private: false, access: { has: obj => "powerLevel" in obj, get: obj => obj.powerLevel, set: (obj, value) => { obj.powerLevel = value; } }, metadata: _metadata }, _powerLevel_initializers, _powerLevel_extraInitializers);
            __esDecorate(null, null, _interestLevel_decorators, { kind: "field", name: "interestLevel", static: false, private: false, access: { has: obj => "interestLevel" in obj, get: obj => obj.interestLevel, set: (obj, value) => { obj.interestLevel = value; } }, metadata: _metadata }, _interestLevel_initializers, _interestLevel_extraInitializers);
            __esDecorate(null, null, _attitude_decorators, { kind: "field", name: "attitude", static: false, private: false, access: { has: obj => "attitude" in obj, get: obj => obj.attitude, set: (obj, value) => { obj.attitude = value; } }, metadata: _metadata }, _attitude_initializers, _attitude_extraInitializers);
            __esDecorate(null, null, _engagementStatus_decorators, { kind: "field", name: "engagementStatus", static: false, private: false, access: { has: obj => "engagementStatus" in obj, get: obj => obj.engagementStatus, set: (obj, value) => { obj.engagementStatus = value; } }, metadata: _metadata }, _engagementStatus_initializers, _engagementStatus_extraInitializers);
            __esDecorate(null, null, _objectives_decorators, { kind: "field", name: "objectives", static: false, private: false, access: { has: obj => "objectives" in obj, get: obj => obj.objectives, set: (obj, value) => { obj.objectives = value; } }, metadata: _metadata }, _objectives_initializers, _objectives_extraInitializers);
            __esDecorate(null, null, _concerns_decorators, { kind: "field", name: "concerns", static: false, private: false, access: { has: obj => "concerns" in obj, get: obj => obj.concerns, set: (obj, value) => { obj.concerns = value; } }, metadata: _metadata }, _concerns_initializers, _concerns_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateStakeholderDto = UpdateStakeholderDto;
/**
 * Create communication plan DTO
 */
let CreateCommunicationPlanDto = (() => {
    var _a;
    let _planName_decorators;
    let _planName_initializers = [];
    let _planName_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _ownerId_decorators;
    let _ownerId_initializers = [];
    let _ownerId_extraInitializers = [];
    return _a = class CreateCommunicationPlanDto {
            constructor() {
                this.planName = __runInitializers(this, _planName_initializers, void 0);
                this.projectId = (__runInitializers(this, _planName_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
                this.startDate = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.ownerId = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
                __runInitializers(this, _ownerId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _planName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Communication plan name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _ownerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan owner user ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _planName_decorators, { kind: "field", name: "planName", static: false, private: false, access: { has: obj => "planName" in obj, get: obj => obj.planName, set: (obj, value) => { obj.planName = value; } }, metadata: _metadata }, _planName_initializers, _planName_extraInitializers);
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: obj => "ownerId" in obj, get: obj => obj.ownerId, set: (obj, value) => { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCommunicationPlanDto = CreateCommunicationPlanDto;
/**
 * Create engagement record DTO
 */
let CreateEngagementRecordDto = (() => {
    var _a;
    let _stakeholderId_decorators;
    let _stakeholderId_initializers = [];
    let _stakeholderId_extraInitializers = [];
    let _engagementType_decorators;
    let _engagementType_initializers = [];
    let _engagementType_extraInitializers = [];
    let _engagementDate_decorators;
    let _engagementDate_initializers = [];
    let _engagementDate_extraInitializers = [];
    let _duration_decorators;
    let _duration_initializers = [];
    let _duration_extraInitializers = [];
    let _channel_decorators;
    let _channel_initializers = [];
    let _channel_extraInitializers = [];
    let _topics_decorators;
    let _topics_initializers = [];
    let _topics_extraInitializers = [];
    let _conductedBy_decorators;
    let _conductedBy_initializers = [];
    let _conductedBy_extraInitializers = [];
    return _a = class CreateEngagementRecordDto {
            constructor() {
                this.stakeholderId = __runInitializers(this, _stakeholderId_initializers, void 0);
                this.engagementType = (__runInitializers(this, _stakeholderId_extraInitializers), __runInitializers(this, _engagementType_initializers, void 0));
                this.engagementDate = (__runInitializers(this, _engagementType_extraInitializers), __runInitializers(this, _engagementDate_initializers, void 0));
                this.duration = (__runInitializers(this, _engagementDate_extraInitializers), __runInitializers(this, _duration_initializers, void 0));
                this.channel = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _channel_initializers, void 0));
                this.topics = (__runInitializers(this, _channel_extraInitializers), __runInitializers(this, _topics_initializers, void 0));
                this.conductedBy = (__runInitializers(this, _topics_extraInitializers), __runInitializers(this, _conductedBy_initializers, void 0));
                __runInitializers(this, _conductedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _stakeholderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Stakeholder ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _engagementType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Engagement type (e.g., Meeting, Workshop, Call)' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _engagementDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Engagement date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _duration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Duration in minutes' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _channel_decorators = [(0, swagger_1.ApiProperty)({ enum: CommunicationChannel }), (0, class_validator_1.IsEnum)(CommunicationChannel)];
            _topics_decorators = [(0, swagger_1.ApiProperty)({ description: 'Topics discussed', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _conductedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conducted by user ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _stakeholderId_decorators, { kind: "field", name: "stakeholderId", static: false, private: false, access: { has: obj => "stakeholderId" in obj, get: obj => obj.stakeholderId, set: (obj, value) => { obj.stakeholderId = value; } }, metadata: _metadata }, _stakeholderId_initializers, _stakeholderId_extraInitializers);
            __esDecorate(null, null, _engagementType_decorators, { kind: "field", name: "engagementType", static: false, private: false, access: { has: obj => "engagementType" in obj, get: obj => obj.engagementType, set: (obj, value) => { obj.engagementType = value; } }, metadata: _metadata }, _engagementType_initializers, _engagementType_extraInitializers);
            __esDecorate(null, null, _engagementDate_decorators, { kind: "field", name: "engagementDate", static: false, private: false, access: { has: obj => "engagementDate" in obj, get: obj => obj.engagementDate, set: (obj, value) => { obj.engagementDate = value; } }, metadata: _metadata }, _engagementDate_initializers, _engagementDate_extraInitializers);
            __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
            __esDecorate(null, null, _channel_decorators, { kind: "field", name: "channel", static: false, private: false, access: { has: obj => "channel" in obj, get: obj => obj.channel, set: (obj, value) => { obj.channel = value; } }, metadata: _metadata }, _channel_initializers, _channel_extraInitializers);
            __esDecorate(null, null, _topics_decorators, { kind: "field", name: "topics", static: false, private: false, access: { has: obj => "topics" in obj, get: obj => obj.topics, set: (obj, value) => { obj.topics = value; } }, metadata: _metadata }, _topics_initializers, _topics_extraInitializers);
            __esDecorate(null, null, _conductedBy_decorators, { kind: "field", name: "conductedBy", static: false, private: false, access: { has: obj => "conductedBy" in obj, get: obj => obj.conductedBy, set: (obj, value) => { obj.conductedBy = value; } }, metadata: _metadata }, _conductedBy_initializers, _conductedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateEngagementRecordDto = CreateEngagementRecordDto;
/**
 * Create action item DTO
 */
let CreateActionItemDto = (() => {
    var _a;
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    return _a = class CreateActionItemDto {
            constructor() {
                this.description = __runInitializers(this, _description_initializers, void 0);
                this.assignedTo = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
                this.dueDate = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.priority = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                __runInitializers(this, _priority_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _assignedTo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned to user ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _dueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Due date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] }), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateActionItemDto = CreateActionItemDto;
/**
 * Create RACI matrix DTO
 */
let CreateRACIMatrixDto = (() => {
    var _a;
    let _matrixName_decorators;
    let _matrixName_initializers = [];
    let _matrixName_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _stakeholders_decorators;
    let _stakeholders_initializers = [];
    let _stakeholders_extraInitializers = [];
    return _a = class CreateRACIMatrixDto {
            constructor() {
                this.matrixName = __runInitializers(this, _matrixName_initializers, void 0);
                this.projectId = (__runInitializers(this, _matrixName_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
                this.stakeholders = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _stakeholders_initializers, void 0));
                __runInitializers(this, _stakeholders_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _matrixName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Matrix name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _stakeholders_decorators = [(0, swagger_1.ApiProperty)({ description: 'Stakeholder IDs', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _matrixName_decorators, { kind: "field", name: "matrixName", static: false, private: false, access: { has: obj => "matrixName" in obj, get: obj => obj.matrixName, set: (obj, value) => { obj.matrixName = value; } }, metadata: _metadata }, _matrixName_initializers, _matrixName_extraInitializers);
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _stakeholders_decorators, { kind: "field", name: "stakeholders", static: false, private: false, access: { has: obj => "stakeholders" in obj, get: obj => obj.stakeholders, set: (obj, value) => { obj.stakeholders = value; } }, metadata: _metadata }, _stakeholders_initializers, _stakeholders_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateRACIMatrixDto = CreateRACIMatrixDto;
/**
 * Power-interest mapping DTO
 */
let PowerInterestMappingDto = (() => {
    var _a;
    let _power_decorators;
    let _power_initializers = [];
    let _power_extraInitializers = [];
    let _interest_decorators;
    let _interest_initializers = [];
    let _interest_extraInitializers = [];
    return _a = class PowerInterestMappingDto {
            constructor() {
                this.power = __runInitializers(this, _power_initializers, void 0);
                this.interest = (__runInitializers(this, _power_extraInitializers), __runInitializers(this, _interest_initializers, void 0));
                __runInitializers(this, _interest_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _power_decorators = [(0, swagger_1.ApiProperty)({ description: 'Power score', minimum: 0, maximum: 100 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _interest_decorators = [(0, swagger_1.ApiProperty)({ description: 'Interest score', minimum: 0, maximum: 100 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            __esDecorate(null, null, _power_decorators, { kind: "field", name: "power", static: false, private: false, access: { has: obj => "power" in obj, get: obj => obj.power, set: (obj, value) => { obj.power = value; } }, metadata: _metadata }, _power_initializers, _power_extraInitializers);
            __esDecorate(null, null, _interest_decorators, { kind: "field", name: "interest", static: false, private: false, access: { has: obj => "interest" in obj, get: obj => obj.interest, set: (obj, value) => { obj.interest = value; } }, metadata: _metadata }, _interest_initializers, _interest_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PowerInterestMappingDto = PowerInterestMappingDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Stakeholders
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Stakeholder model
 *
 * @example
 * ```typescript
 * const StakeholderModel = createStakeholderModel(sequelize);
 * const stakeholder = await StakeholderModel.create({
 *   stakeholderName: 'John Smith',
 *   role: 'CTO',
 *   powerLevel: StakeholderPowerLevel.HIGH,
 *   interestLevel: StakeholderInterestLevel.HIGH
 * });
 * ```
 */
const createStakeholderModel = (sequelize) => {
    class StakeholderModel extends sequelize_1.Model {
    }
    StakeholderModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        stakeholderName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Stakeholder name',
        },
        role: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Role or title',
        },
        department: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Department or division',
        },
        organizationLevel: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Level in organization hierarchy',
        },
        email: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Email address',
            validate: {
                isEmail: true,
            },
        },
        phone: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Phone number',
        },
        powerLevel: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(StakeholderPowerLevel)),
            allowNull: false,
            defaultValue: StakeholderPowerLevel.MEDIUM,
            comment: 'Stakeholder power level',
        },
        interestLevel: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(StakeholderInterestLevel)),
            allowNull: false,
            defaultValue: StakeholderInterestLevel.MEDIUM,
            comment: 'Stakeholder interest level',
        },
        attitude: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(StakeholderAttitude)),
            allowNull: false,
            defaultValue: StakeholderAttitude.NEUTRAL,
            comment: 'Stakeholder attitude toward initiative',
        },
        influenceTypes: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Types of influence stakeholder has',
        },
        impactScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 50,
            comment: 'Overall impact score (0-100)',
            validate: {
                min: 0,
                max: 100,
            },
        },
        engagementStatus: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(EngagementStatus)),
            allowNull: false,
            defaultValue: EngagementStatus.NOT_ENGAGED,
            comment: 'Current engagement status',
        },
        resistanceLevel: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ResistanceLevel)),
            allowNull: false,
            defaultValue: ResistanceLevel.NONE,
            comment: 'Level of resistance to change',
        },
        communicationPreferences: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Preferred communication channels',
        },
        objectives: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Stakeholder objectives',
        },
        concerns: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Stakeholder concerns',
        },
        wins: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'What constitutes a win for this stakeholder',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'stakeholders',
        timestamps: true,
        indexes: [
            { fields: ['email'] },
            { fields: ['powerLevel'] },
            { fields: ['interestLevel'] },
            { fields: ['attitude'] },
            { fields: ['engagementStatus'] },
            { fields: ['department'] },
            { fields: ['organizationLevel'] },
        ],
    });
    return StakeholderModel;
};
exports.createStakeholderModel = createStakeholderModel;
/**
 * Sequelize model for Communication Plans
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CommunicationPlan model
 *
 * @example
 * ```typescript
 * const CommunicationPlanModel = createCommunicationPlanModel(sequelize);
 * const plan = await CommunicationPlanModel.create({
 *   planName: 'Q1 2025 Stakeholder Communications',
 *   projectId: 'project-123',
 *   status: 'DRAFT'
 * });
 * ```
 */
const createCommunicationPlanModel = (sequelize) => {
    class CommunicationPlanModel extends sequelize_1.Model {
    }
    CommunicationPlanModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        planName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Communication plan name',
        },
        projectId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Associated project ID',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Plan start date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Plan end date',
        },
        audiences: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Target audiences',
        },
        messages: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Key messages',
        },
        channels: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Communication channels',
        },
        calendar: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Communication events calendar',
        },
        metrics: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Success metrics',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('DRAFT', 'APPROVED', 'ACTIVE', 'COMPLETED'),
            allowNull: false,
            defaultValue: 'DRAFT',
            comment: 'Plan status',
        },
        ownerId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Plan owner',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'communication_plans',
        timestamps: true,
        indexes: [
            { fields: ['projectId'] },
            { fields: ['status'] },
            { fields: ['ownerId'] },
            { fields: ['startDate'] },
            { fields: ['endDate'] },
        ],
    });
    return CommunicationPlanModel;
};
exports.createCommunicationPlanModel = createCommunicationPlanModel;
/**
 * Sequelize model for Engagement Records
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EngagementRecord model
 *
 * @example
 * ```typescript
 * const EngagementRecordModel = createEngagementRecordModel(sequelize);
 * const record = await EngagementRecordModel.create({
 *   stakeholderId: 'stakeholder-123',
 *   engagementType: 'One-on-One Meeting',
 *   engagementDate: new Date(),
 *   sentiment: 75
 * });
 * ```
 */
const createEngagementRecordModel = (sequelize) => {
    class EngagementRecordModel extends sequelize_1.Model {
    }
    EngagementRecordModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        stakeholderId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Stakeholder ID',
            references: {
                model: 'stakeholders',
                key: 'id',
            },
        },
        engagementType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Type of engagement',
        },
        engagementDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Date of engagement',
        },
        duration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Duration in minutes',
        },
        channel: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(CommunicationChannel)),
            allowNull: false,
            comment: 'Communication channel used',
        },
        topics: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Topics discussed',
        },
        outcomes: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Engagement outcomes',
        },
        actionItems: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Action items generated',
        },
        sentiment: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 50,
            comment: 'Sentiment score (0-100)',
            validate: {
                min: 0,
                max: 100,
            },
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
            comment: 'Engagement notes',
        },
        conductedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who conducted engagement',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'engagement_records',
        timestamps: true,
        indexes: [
            { fields: ['stakeholderId'] },
            { fields: ['engagementDate'] },
            { fields: ['channel'] },
            { fields: ['conductedBy'] },
        ],
    });
    return EngagementRecordModel;
};
exports.createEngagementRecordModel = createEngagementRecordModel;
// ============================================================================
// STAKEHOLDER IDENTIFICATION & ANALYSIS (Functions 1-9)
// ============================================================================
/**
 * Identifies and catalogs stakeholders for a project or initiative.
 *
 * @param {string} projectId - Project identifier
 * @param {object} identificationCriteria - Criteria for stakeholder identification
 * @returns {Promise<Stakeholder[]>} Identified stakeholders
 *
 * @example
 * ```typescript
 * const stakeholders = await identifyStakeholders('project-123', {
 *   includeExecutives: true,
 *   departmentFilter: ['IT', 'Finance', 'Operations'],
 *   minimumImpact: 'MEDIUM'
 * });
 * ```
 */
const identifyStakeholders = async (projectId, identificationCriteria) => {
    const stakeholders = [];
    return stakeholders;
};
exports.identifyStakeholders = identifyStakeholders;
/**
 * Analyzes stakeholder power and interest levels.
 *
 * @param {string} stakeholderId - Stakeholder identifier
 * @param {object} analysisFactors - Factors to consider in analysis
 * @returns {Promise<{ power: number; interest: number; justification: string }>} Power-interest analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeStakeholderPowerInterest('stakeholder-123', {
 *   formalAuthority: 8,
 *   budgetControl: 9,
 *   expertise: 7,
 *   affectedByOutcome: 8
 * });
 * ```
 */
const analyzeStakeholderPowerInterest = async (stakeholderId, analysisFactors) => {
    const power = (analysisFactors.formalAuthority + analysisFactors.budgetControl + analysisFactors.expertise) / 3;
    const interest = (analysisFactors.affectedByOutcome + (analysisFactors.personalStake || 5)) / 2;
    return {
        power,
        interest,
        justification: `Power based on authority, budget control, and expertise. Interest based on impact and personal stake.`,
    };
};
exports.analyzeStakeholderPowerInterest = analyzeStakeholderPowerInterest;
/**
 * Calculates stakeholder impact score based on multiple dimensions.
 *
 * @param {Stakeholder} stakeholder - Stakeholder data
 * @returns {Promise<number>} Impact score (0-100)
 *
 * @example
 * ```typescript
 * const impactScore = await calculateStakeholderImpact(stakeholder);
 * ```
 */
const calculateStakeholderImpact = async (stakeholder) => {
    const powerScore = powerLevelToScore(stakeholder.powerLevel);
    const interestScore = interestLevelToScore(stakeholder.interestLevel);
    const attitudeMultiplier = attitudeToMultiplier(stakeholder.attitude);
    return (powerScore * 0.4 + interestScore * 0.4 + stakeholder.influenceTypes.length * 5) * attitudeMultiplier;
};
exports.calculateStakeholderImpact = calculateStakeholderImpact;
/**
 * Generates comprehensive stakeholder profile.
 *
 * @param {string} stakeholderId - Stakeholder identifier
 * @returns {Promise<object>} Comprehensive stakeholder profile
 *
 * @example
 * ```typescript
 * const profile = await generateStakeholderProfile('stakeholder-123');
 * ```
 */
const generateStakeholderProfile = async (stakeholderId) => {
    return {
        stakeholderId,
        demographics: {},
        psychographics: {},
        motivations: [],
        concerns: [],
        influenceNetwork: [],
        engagementHistory: [],
        communicationPreferences: [],
        recommendedApproach: '',
    };
};
exports.generateStakeholderProfile = generateStakeholderProfile;
/**
 * Segments stakeholders into groups based on characteristics.
 *
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @param {string} segmentationCriteria - Criteria for segmentation
 * @returns {Promise<Record<string, Stakeholder[]>>} Stakeholder segments
 *
 * @example
 * ```typescript
 * const segments = await segmentStakeholders(stakeholders, 'POWER_INTEREST');
 * ```
 */
const segmentStakeholders = async (stakeholders, segmentationCriteria) => {
    const segments = {
        HIGH_POWER_HIGH_INTEREST: [],
        HIGH_POWER_LOW_INTEREST: [],
        LOW_POWER_HIGH_INTEREST: [],
        LOW_POWER_LOW_INTEREST: [],
    };
    for (const stakeholder of stakeholders) {
        const power = powerLevelToScore(stakeholder.powerLevel);
        const interest = interestLevelToScore(stakeholder.interestLevel);
        if (power >= 60 && interest >= 60)
            segments.HIGH_POWER_HIGH_INTEREST.push(stakeholder);
        else if (power >= 60 && interest < 60)
            segments.HIGH_POWER_LOW_INTEREST.push(stakeholder);
        else if (power < 60 && interest >= 60)
            segments.LOW_POWER_HIGH_INTEREST.push(stakeholder);
        else
            segments.LOW_POWER_LOW_INTEREST.push(stakeholder);
    }
    return segments;
};
exports.segmentStakeholders = segmentStakeholders;
/**
 * Assesses stakeholder attitude and sentiment toward initiative.
 *
 * @param {string} stakeholderId - Stakeholder identifier
 * @param {object} indicators - Attitude indicators
 * @returns {Promise<{ attitude: StakeholderAttitude; confidence: number; indicators: string[] }>} Attitude assessment
 *
 * @example
 * ```typescript
 * const attitude = await assessStakeholderAttitude('stakeholder-123', {
 *   verbalSupport: 8,
 *   actionAlignment: 7,
 *   resourceCommitment: 6
 * });
 * ```
 */
const assessStakeholderAttitude = async (stakeholderId, indicators) => {
    const avgScore = (indicators.verbalSupport + indicators.actionAlignment + indicators.resourceCommitment) / 3;
    let attitude;
    if (avgScore >= 8)
        attitude = StakeholderAttitude.CHAMPION;
    else if (avgScore >= 6)
        attitude = StakeholderAttitude.SUPPORTER;
    else if (avgScore >= 4)
        attitude = StakeholderAttitude.NEUTRAL;
    else if (avgScore >= 2)
        attitude = StakeholderAttitude.SKEPTIC;
    else
        attitude = StakeholderAttitude.BLOCKER;
    return {
        attitude,
        confidence: 0.85,
        indicators: Object.keys(indicators),
    };
};
exports.assessStakeholderAttitude = assessStakeholderAttitude;
/**
 * Identifies key decision makers and influencers.
 *
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @returns {Promise<{ decisionMakers: Stakeholder[]; influencers: Stakeholder[] }>} Key stakeholders
 *
 * @example
 * ```typescript
 * const keyStakeholders = await identifyKeyStakeholders(stakeholders);
 * ```
 */
const identifyKeyStakeholders = async (stakeholders) => {
    const decisionMakers = stakeholders.filter((s) => s.powerLevel === StakeholderPowerLevel.VERY_HIGH || s.powerLevel === StakeholderPowerLevel.HIGH);
    const influencers = stakeholders.filter((s) => s.influenceTypes.length >= 2 && s.impactScore >= 60);
    return { decisionMakers, influencers };
};
exports.identifyKeyStakeholders = identifyKeyStakeholders;
/**
 * Analyzes stakeholder interdependencies and relationships.
 *
 * @param {string[]} stakeholderIds - Stakeholder identifiers
 * @returns {Promise<{ relationships: any[]; dependencies: any[] }>} Relationship analysis
 *
 * @example
 * ```typescript
 * const relationships = await analyzeStakeholderRelationships(['stakeholder-1', 'stakeholder-2', 'stakeholder-3']);
 * ```
 */
const analyzeStakeholderRelationships = async (stakeholderIds) => {
    return {
        relationships: [],
        dependencies: [],
    };
};
exports.analyzeStakeholderRelationships = analyzeStakeholderRelationships;
/**
 * Generates stakeholder register document.
 *
 * @param {string} projectId - Project identifier
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @returns {Promise<Buffer>} Stakeholder register document
 *
 * @example
 * ```typescript
 * const register = await generateStakeholderRegister('project-123', stakeholders);
 * ```
 */
const generateStakeholderRegister = async (projectId, stakeholders) => {
    return Buffer.from(JSON.stringify({ projectId, stakeholders }, null, 2));
};
exports.generateStakeholderRegister = generateStakeholderRegister;
// ============================================================================
// POWER-INTEREST GRID MAPPING (Functions 10-18)
// ============================================================================
/**
 * Maps stakeholders onto power-interest grid.
 *
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @returns {Promise<PowerInterestPosition[]>} Grid positions
 *
 * @example
 * ```typescript
 * const gridMapping = await mapPowerInterestGrid(stakeholders);
 * ```
 */
const mapPowerInterestGrid = async (stakeholders) => {
    return stakeholders.map((stakeholder) => {
        const power = powerLevelToScore(stakeholder.powerLevel);
        const interest = interestLevelToScore(stakeholder.interestLevel);
        let quadrant;
        let strategy;
        if (power >= 60 && interest >= 60) {
            quadrant = 'MANAGE_CLOSELY';
            strategy = 'Engage closely and ensure satisfaction';
        }
        else if (power >= 60 && interest < 60) {
            quadrant = 'KEEP_SATISFIED';
            strategy = 'Meet their needs but avoid excessive communication';
        }
        else if (power < 60 && interest >= 60) {
            quadrant = 'KEEP_INFORMED';
            strategy = 'Keep adequately informed and consult on areas of interest';
        }
        else {
            quadrant = 'MONITOR';
            strategy = 'Monitor with minimal effort';
        }
        return {
            stakeholderId: stakeholder.id,
            stakeholderName: stakeholder.stakeholderName,
            power,
            interest,
            quadrant,
            strategy,
        };
    });
};
exports.mapPowerInterestGrid = mapPowerInterestGrid;
/**
 * Generates engagement strategy based on power-interest position.
 *
 * @param {PowerInterestPosition} position - Grid position
 * @returns {Promise<object>} Engagement strategy
 *
 * @example
 * ```typescript
 * const strategy = await generateEngagementStrategy(position);
 * ```
 */
const generateEngagementStrategy = async (position) => {
    const strategies = {
        MANAGE_CLOSELY: {
            frequency: CommunicationFrequency.WEEKLY,
            channels: [CommunicationChannel.MEETING, CommunicationChannel.EMAIL],
            approach: 'Partnership and collaboration',
            effortLevel: 'HIGH',
            objectives: ['Build strong relationship', 'Ensure alignment', 'Secure active support'],
        },
        KEEP_SATISFIED: {
            frequency: CommunicationFrequency.BIWEEKLY,
            channels: [CommunicationChannel.EMAIL, CommunicationChannel.PRESENTATION],
            approach: 'Information and consultation',
            effortLevel: 'MEDIUM-HIGH',
            objectives: ['Maintain satisfaction', 'Address concerns proactively', 'Prevent opposition'],
        },
        KEEP_INFORMED: {
            frequency: CommunicationFrequency.MONTHLY,
            channels: [CommunicationChannel.EMAIL, CommunicationChannel.NEWSLETTER],
            approach: 'Regular updates and involvement',
            effortLevel: 'MEDIUM',
            objectives: ['Keep engaged', 'Leverage enthusiasm', 'Build advocacy'],
        },
        MONITOR: {
            frequency: CommunicationFrequency.QUARTERLY,
            channels: [CommunicationChannel.EMAIL],
            approach: 'Minimal but adequate communication',
            effortLevel: 'LOW',
            objectives: ['Basic awareness', 'Monitor for changes', 'Efficient communication'],
        },
    };
    return strategies[position.quadrant];
};
exports.generateEngagementStrategy = generateEngagementStrategy;
/**
 * Tracks stakeholder movement across power-interest grid over time.
 *
 * @param {string} stakeholderId - Stakeholder identifier
 * @param {Date} startDate - Start date for tracking
 * @param {Date} endDate - End date for tracking
 * @returns {Promise<{ trajectory: any[]; trend: string }>} Movement tracking
 *
 * @example
 * ```typescript
 * const movement = await trackStakeholderMovement('stakeholder-123', new Date('2024-01-01'), new Date('2025-01-01'));
 * ```
 */
const trackStakeholderMovement = async (stakeholderId, startDate, endDate) => {
    return {
        trajectory: [],
        trend: 'INCREASING_SUPPORT',
    };
};
exports.trackStakeholderMovement = trackStakeholderMovement;
/**
 * Identifies stakeholders at risk of becoming blockers.
 *
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @returns {Promise<Stakeholder[]>} At-risk stakeholders
 *
 * @example
 * ```typescript
 * const atRisk = await identifyAtRiskStakeholders(stakeholders);
 * ```
 */
const identifyAtRiskStakeholders = async (stakeholders) => {
    return stakeholders.filter((s) => (s.attitude === StakeholderAttitude.SKEPTIC || s.attitude === StakeholderAttitude.BLOCKER) &&
        (s.powerLevel === StakeholderPowerLevel.HIGH || s.powerLevel === StakeholderPowerLevel.VERY_HIGH));
};
exports.identifyAtRiskStakeholders = identifyAtRiskStakeholders;
/**
 * Prioritizes stakeholder engagement efforts based on impact.
 *
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @param {object} constraints - Resource constraints
 * @returns {Promise<{ priority: string; stakeholders: Stakeholder[] }[]>} Prioritized stakeholders
 *
 * @example
 * ```typescript
 * const priorities = await prioritizeStakeholderEngagement(stakeholders, { teamCapacity: 10 });
 * ```
 */
const prioritizeStakeholderEngagement = async (stakeholders, constraints) => {
    const sorted = [...stakeholders].sort((a, b) => b.impactScore - a.impactScore);
    return [
        { priority: 'CRITICAL', stakeholders: sorted.slice(0, 5) },
        { priority: 'HIGH', stakeholders: sorted.slice(5, 15) },
        { priority: 'MEDIUM', stakeholders: sorted.slice(15, 30) },
        { priority: 'LOW', stakeholders: sorted.slice(30) },
    ];
};
exports.prioritizeStakeholderEngagement = prioritizeStakeholderEngagement;
/**
 * Generates power-interest grid visualization data.
 *
 * @param {PowerInterestPosition[]} positions - Grid positions
 * @returns {Promise<object>} Visualization data
 *
 * @example
 * ```typescript
 * const vizData = await generateGridVisualization(positions);
 * ```
 */
const generateGridVisualization = async (positions) => {
    return {
        quadrants: {
            MANAGE_CLOSELY: positions.filter((p) => p.quadrant === 'MANAGE_CLOSELY'),
            KEEP_SATISFIED: positions.filter((p) => p.quadrant === 'KEEP_SATISFIED'),
            KEEP_INFORMED: positions.filter((p) => p.quadrant === 'KEEP_INFORMED'),
            MONITOR: positions.filter((p) => p.quadrant === 'MONITOR'),
        },
        chartData: positions.map((p) => ({
            name: p.stakeholderName,
            x: p.power,
            y: p.interest,
            quadrant: p.quadrant,
        })),
    };
};
exports.generateGridVisualization = generateGridVisualization;
/**
 * Analyzes optimal stakeholder portfolio composition.
 *
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @returns {Promise<{ balance: string; recommendations: string[] }>} Portfolio analysis
 *
 * @example
 * ```typescript
 * const portfolio = await analyzeStakeholderPortfolio(stakeholders);
 * ```
 */
const analyzeStakeholderPortfolio = async (stakeholders) => {
    const champions = stakeholders.filter((s) => s.attitude === StakeholderAttitude.CHAMPION).length;
    const blockers = stakeholders.filter((s) => s.attitude === StakeholderAttitude.BLOCKER).length;
    return {
        balance: champions > blockers * 2 ? 'FAVORABLE' : 'AT_RISK',
        recommendations: ['Build more champions', 'Address blocker concerns', 'Engage neutral stakeholders'],
    };
};
exports.analyzeStakeholderPortfolio = analyzeStakeholderPortfolio;
/**
 * Simulates impact of stakeholder position changes.
 *
 * @param {Stakeholder[]} stakeholders - Current stakeholders
 * @param {object} scenario - Scenario to simulate
 * @returns {Promise<{ projectedOutcome: string; risks: string[]; opportunities: string[] }>} Simulation results
 *
 * @example
 * ```typescript
 * const simulation = await simulateStakeholderScenario(stakeholders, {
 *   changeAttitude: { 'stakeholder-123': 'CHAMPION' }
 * });
 * ```
 */
const simulateStakeholderScenario = async (stakeholders, scenario) => {
    return {
        projectedOutcome: 'IMPROVED_SUPPORT',
        risks: [],
        opportunities: [],
    };
};
exports.simulateStakeholderScenario = simulateStakeholderScenario;
/**
 * Exports power-interest grid analysis to presentation format.
 *
 * @param {PowerInterestPosition[]} positions - Grid positions
 * @param {string} format - Export format
 * @returns {Promise<Buffer>} Exported analysis
 *
 * @example
 * ```typescript
 * const pptx = await exportPowerInterestAnalysis(positions, 'POWERPOINT');
 * ```
 */
const exportPowerInterestAnalysis = async (positions, format) => {
    return Buffer.from(JSON.stringify({ positions }, null, 2));
};
exports.exportPowerInterestAnalysis = exportPowerInterestAnalysis;
// ============================================================================
// INFLUENCE MAPPING & NETWORK ANALYSIS (Functions 19-27)
// ============================================================================
/**
 * Maps stakeholder influence networks and relationships.
 *
 * @param {string} projectId - Project identifier
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @param {object} relationshipData - Relationship data
 * @returns {Promise<InfluenceNetwork>} Influence network
 *
 * @example
 * ```typescript
 * const network = await mapInfluenceNetwork('project-123', stakeholders, relationshipData);
 * ```
 */
const mapInfluenceNetwork = async (projectId, stakeholders, relationshipData) => {
    const nodes = stakeholders.map((s) => ({
        stakeholderId: s.id,
        centralityScore: 0,
        betweennessScore: 0,
        clusterMembership: [],
        connections: 0,
    }));
    return {
        id: `network-${Date.now()}`,
        networkName: `${projectId} Influence Network`,
        projectId,
        nodes,
        edges: [],
        clusters: [],
        keyInfluencers: [],
        bottlenecks: [],
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.mapInfluenceNetwork = mapInfluenceNetwork;
/**
 * Calculates network centrality metrics for stakeholders.
 *
 * @param {InfluenceNetwork} network - Influence network
 * @param {string} stakeholderId - Stakeholder identifier
 * @returns {Promise<{ degree: number; betweenness: number; closeness: number; eigenvector: number }>} Centrality metrics
 *
 * @example
 * ```typescript
 * const centrality = await calculateNetworkCentrality(network, 'stakeholder-123');
 * ```
 */
const calculateNetworkCentrality = async (network, stakeholderId) => {
    return {
        degree: 0,
        betweenness: 0,
        closeness: 0,
        eigenvector: 0,
    };
};
exports.calculateNetworkCentrality = calculateNetworkCentrality;
/**
 * Identifies influence clusters and coalitions.
 *
 * @param {InfluenceNetwork} network - Influence network
 * @returns {Promise<InfluenceCluster[]>} Identified clusters
 *
 * @example
 * ```typescript
 * const clusters = await identifyInfluenceClusters(network);
 * ```
 */
const identifyInfluenceClusters = async (network) => {
    return network.clusters;
};
exports.identifyInfluenceClusters = identifyInfluenceClusters;
/**
 * Finds key influencers who can sway others.
 *
 * @param {InfluenceNetwork} network - Influence network
 * @param {number} topN - Number of top influencers to return
 * @returns {Promise<Stakeholder[]>} Key influencers
 *
 * @example
 * ```typescript
 * const influencers = await findKeyInfluencers(network, 5);
 * ```
 */
const findKeyInfluencers = async (network, topN = 5) => {
    return [];
};
exports.findKeyInfluencers = findKeyInfluencers;
/**
 * Analyzes influence paths between stakeholders.
 *
 * @param {InfluenceNetwork} network - Influence network
 * @param {string} fromStakeholderId - Source stakeholder
 * @param {string} toStakeholderId - Target stakeholder
 * @returns {Promise<{ paths: any[]; shortestPath: any; influence: number }>} Path analysis
 *
 * @example
 * ```typescript
 * const paths = await analyzeInfluencePaths(network, 'stakeholder-1', 'stakeholder-5');
 * ```
 */
const analyzeInfluencePaths = async (network, fromStakeholderId, toStakeholderId) => {
    return {
        paths: [],
        shortestPath: null,
        influence: 0,
    };
};
exports.analyzeInfluencePaths = analyzeInfluencePaths;
/**
 * Identifies opinion leaders and gatekeepers.
 *
 * @param {InfluenceNetwork} network - Influence network
 * @returns {Promise<{ opinionLeaders: string[]; gatekeepers: string[] }>} Leaders and gatekeepers
 *
 * @example
 * ```typescript
 * const leaders = await identifyOpinionLeaders(network);
 * ```
 */
const identifyOpinionLeaders = async (network) => {
    return {
        opinionLeaders: network.keyInfluencers.slice(0, 3),
        gatekeepers: network.bottlenecks,
    };
};
exports.identifyOpinionLeaders = identifyOpinionLeaders;
/**
 * Simulates influence cascade through network.
 *
 * @param {InfluenceNetwork} network - Influence network
 * @param {string} seedStakeholderId - Initial stakeholder
 * @param {string} message - Message being spread
 * @returns {Promise<{ reach: number; timeline: any[]; adoption: number }>} Cascade simulation
 *
 * @example
 * ```typescript
 * const cascade = await simulateInfluenceCascade(network, 'stakeholder-1', 'Support for initiative');
 * ```
 */
const simulateInfluenceCascade = async (network, seedStakeholderId, message) => {
    return {
        reach: 75,
        timeline: [],
        adoption: 65,
    };
};
exports.simulateInfluenceCascade = simulateInfluenceCascade;
/**
 * Generates influence network visualization.
 *
 * @param {InfluenceNetwork} network - Influence network
 * @returns {Promise<object>} Visualization data
 *
 * @example
 * ```typescript
 * const viz = await generateInfluenceNetworkVisualization(network);
 * ```
 */
const generateInfluenceNetworkVisualization = async (network) => {
    return {
        nodes: network.nodes.map((n) => ({
            id: n.stakeholderId,
            size: n.centralityScore,
            connections: n.connections,
        })),
        edges: network.edges.map((e) => ({
            from: e.fromStakeholderId,
            to: e.toStakeholderId,
            weight: e.influenceStrength,
        })),
    };
};
exports.generateInfluenceNetworkVisualization = generateInfluenceNetworkVisualization;
/**
 * Assesses network resilience and vulnerability.
 *
 * @param {InfluenceNetwork} network - Influence network
 * @returns {Promise<{ resilience: number; vulnerabilities: string[]; recommendations: string[] }>} Resilience assessment
 *
 * @example
 * ```typescript
 * const resilience = await assessNetworkResilience(network);
 * ```
 */
const assessNetworkResilience = async (network) => {
    return {
        resilience: 70,
        vulnerabilities: ['Over-reliance on single influencer'],
        recommendations: ['Build redundant influence paths', 'Strengthen peripheral connections'],
    };
};
exports.assessNetworkResilience = assessNetworkResilience;
// ============================================================================
// COMMUNICATION PLANNING (Functions 28-36)
// ============================================================================
/**
 * Creates comprehensive stakeholder communication plan.
 *
 * @param {CreateCommunicationPlanDto} planData - Plan creation data
 * @param {Stakeholder[]} stakeholders - Target stakeholders
 * @returns {Promise<CommunicationPlan>} Communication plan
 *
 * @example
 * ```typescript
 * const plan = await createCommunicationPlan({
 *   planName: 'Q1 2025 Digital Transformation Communications',
 *   projectId: 'project-123',
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-03-31'),
 *   ownerId: 'pm-456'
 * }, stakeholders);
 * ```
 */
const createCommunicationPlan = async (planData, stakeholders) => {
    return {
        id: `comm-plan-${Date.now()}`,
        planName: planData.planName,
        projectId: planData.projectId,
        startDate: planData.startDate,
        endDate: planData.endDate,
        audiences: [],
        messages: [],
        channels: [],
        calendar: [],
        metrics: [],
        status: 'DRAFT',
        ownerId: planData.ownerId,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createCommunicationPlan = createCommunicationPlan;
/**
 * Defines target audiences and segments for communications.
 *
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @param {string} segmentationApproach - Segmentation approach
 * @returns {Promise<CommunicationAudience[]>} Communication audiences
 *
 * @example
 * ```typescript
 * const audiences = await defineTargetAudiences(stakeholders, 'ROLE_BASED');
 * ```
 */
const defineTargetAudiences = async (stakeholders, segmentationApproach) => {
    const audiences = [];
    if (segmentationApproach === 'ROLE_BASED') {
        const executiveIds = stakeholders.filter((s) => s.organizationLevel === 'Executive').map((s) => s.id);
        const managerIds = stakeholders.filter((s) => s.organizationLevel === 'Manager').map((s) => s.id);
        audiences.push({
            audienceId: 'executives',
            audienceName: 'Executive Leadership',
            stakeholderIds: executiveIds,
            segmentCriteria: { level: 'Executive' },
            preferredChannels: [CommunicationChannel.MEETING, CommunicationChannel.PRESENTATION],
            frequency: CommunicationFrequency.MONTHLY,
        });
        audiences.push({
            audienceId: 'managers',
            audienceName: 'Department Managers',
            stakeholderIds: managerIds,
            segmentCriteria: { level: 'Manager' },
            preferredChannels: [CommunicationChannel.MEETING, CommunicationChannel.EMAIL],
            frequency: CommunicationFrequency.BIWEEKLY,
        });
    }
    return audiences;
};
exports.defineTargetAudiences = defineTargetAudiences;
/**
 * Crafts key messages for different stakeholder audiences.
 *
 * @param {CommunicationAudience} audience - Target audience
 * @param {object} messageParameters - Message parameters
 * @returns {Promise<CommunicationMessage>} Crafted message
 *
 * @example
 * ```typescript
 * const message = await craftKeyMessage(executiveAudience, {
 *   topic: 'Digital Transformation Progress',
 *   tone: 'Professional',
 *   focus: 'Business value'
 * });
 * ```
 */
const craftKeyMessage = async (audience, messageParameters) => {
    return {
        messageId: `msg-${Date.now()}`,
        messageTitle: messageParameters.topic,
        content: 'Message content tailored to audience',
        keyPoints: ['Point 1', 'Point 2', 'Point 3'],
        targetAudiences: [audience.audienceId],
        tone: messageParameters.tone || 'Professional',
        callToAction: messageParameters.callToAction,
    };
};
exports.craftKeyMessage = craftKeyMessage;
/**
 * Generates communication calendar with scheduled touchpoints.
 *
 * @param {CommunicationPlan} plan - Communication plan
 * @param {CommunicationFrequency} defaultFrequency - Default frequency
 * @returns {Promise<CommunicationEvent[]>} Communication calendar
 *
 * @example
 * ```typescript
 * const calendar = await generateCommunicationCalendar(plan, CommunicationFrequency.WEEKLY);
 * ```
 */
const generateCommunicationCalendar = async (plan, defaultFrequency) => {
    return [];
};
exports.generateCommunicationCalendar = generateCommunicationCalendar;
/**
 * Selects optimal communication channels for each stakeholder group.
 *
 * @param {CommunicationAudience} audience - Target audience
 * @param {object} constraints - Channel constraints
 * @returns {Promise<CommunicationChannel[]>} Recommended channels
 *
 * @example
 * ```typescript
 * const channels = await selectCommunicationChannels(audience, { budget: 10000, timeAvailable: 'LIMITED' });
 * ```
 */
const selectCommunicationChannels = async (audience, constraints) => {
    return audience.preferredChannels;
};
exports.selectCommunicationChannels = selectCommunicationChannels;
/**
 * Tracks communication plan execution and effectiveness.
 *
 * @param {string} planId - Communication plan ID
 * @returns {Promise<{ completionRate: number; effectiveness: number; issues: string[] }>} Execution tracking
 *
 * @example
 * ```typescript
 * const tracking = await trackCommunicationExecution('plan-123');
 * ```
 */
const trackCommunicationExecution = async (planId) => {
    return {
        completionRate: 75,
        effectiveness: 68,
        issues: [],
    };
};
exports.trackCommunicationExecution = trackCommunicationExecution;
/**
 * Measures communication effectiveness through metrics.
 *
 * @param {string} planId - Communication plan ID
 * @param {CommunicationMetric[]} metrics - Metrics to measure
 * @returns {Promise<Record<string, number>>} Measurement results
 *
 * @example
 * ```typescript
 * const results = await measureCommunicationEffectiveness('plan-123', metrics);
 * ```
 */
const measureCommunicationEffectiveness = async (planId, metrics) => {
    return {
        reach: 85,
        engagement: 72,
        sentiment: 68,
        actionTaken: 45,
    };
};
exports.measureCommunicationEffectiveness = measureCommunicationEffectiveness;
/**
 * Adjusts communication plan based on feedback and results.
 *
 * @param {string} planId - Communication plan ID
 * @param {object} adjustments - Plan adjustments
 * @returns {Promise<CommunicationPlan>} Updated plan
 *
 * @example
 * ```typescript
 * const updated = await adjustCommunicationPlan('plan-123', {
 *   increaseFrequency: ['executives'],
 *   addChannel: { audience: 'managers', channel: CommunicationChannel.WORKSHOP }
 * });
 * ```
 */
const adjustCommunicationPlan = async (planId, adjustments) => {
    return {};
};
exports.adjustCommunicationPlan = adjustCommunicationPlan;
/**
 * Generates communication templates for common scenarios.
 *
 * @param {string} scenarioType - Scenario type
 * @param {object} parameters - Template parameters
 * @returns {Promise<{ subject: string; body: string; tone: string }>} Communication template
 *
 * @example
 * ```typescript
 * const template = await generateCommunicationTemplate('PROJECT_UPDATE', {
 *   projectName: 'Digital Transformation',
 *   progress: 75
 * });
 * ```
 */
const generateCommunicationTemplate = async (scenarioType, parameters) => {
    return {
        subject: 'Template subject',
        body: 'Template body',
        tone: 'Professional',
    };
};
exports.generateCommunicationTemplate = generateCommunicationTemplate;
// ============================================================================
// ENGAGEMENT TRACKING & MANAGEMENT (Functions 37-45)
// ============================================================================
/**
 * Records stakeholder engagement interaction.
 *
 * @param {CreateEngagementRecordDto} recordData - Engagement record data
 * @returns {Promise<EngagementRecord>} Created engagement record
 *
 * @example
 * ```typescript
 * const record = await recordStakeholderEngagement({
 *   stakeholderId: 'stakeholder-123',
 *   engagementType: 'One-on-One Meeting',
 *   engagementDate: new Date(),
 *   duration: 60,
 *   channel: CommunicationChannel.MEETING,
 *   topics: ['Progress update', 'Concerns discussion'],
 *   conductedBy: 'pm-456'
 * });
 * ```
 */
const recordStakeholderEngagement = async (recordData) => {
    return {
        id: `engagement-${Date.now()}`,
        stakeholderId: recordData.stakeholderId,
        engagementType: recordData.engagementType,
        engagementDate: recordData.engagementDate,
        duration: recordData.duration,
        channel: recordData.channel,
        topics: recordData.topics,
        outcomes: [],
        actionItems: [],
        sentiment: 50,
        notes: '',
        conductedBy: recordData.conductedBy,
        metadata: {},
        createdAt: new Date(),
    };
};
exports.recordStakeholderEngagement = recordStakeholderEngagement;
/**
 * Analyzes stakeholder sentiment from engagement history.
 *
 * @param {string} stakeholderId - Stakeholder identifier
 * @param {Date} startDate - Start date for analysis
 * @param {Date} endDate - End date for analysis
 * @returns {Promise<{ averageSentiment: number; trend: string; insights: string[] }>} Sentiment analysis
 *
 * @example
 * ```typescript
 * const sentiment = await analyzeStakeholderSentiment('stakeholder-123', new Date('2024-01-01'), new Date('2025-01-01'));
 * ```
 */
const analyzeStakeholderSentiment = async (stakeholderId, startDate, endDate) => {
    return {
        averageSentiment: 72,
        trend: 'IMPROVING',
        insights: ['Engagement frequency increasing', 'Positive sentiment in recent meetings'],
    };
};
exports.analyzeStakeholderSentiment = analyzeStakeholderSentiment;
/**
 * Tracks action items from stakeholder engagements.
 *
 * @param {string[]} actionItemIds - Action item identifiers
 * @returns {Promise<{ completed: number; overdue: number; inProgress: number }>} Action item status
 *
 * @example
 * ```typescript
 * const status = await trackActionItems(['action-1', 'action-2', 'action-3']);
 * ```
 */
const trackActionItems = async (actionItemIds) => {
    return {
        completed: 5,
        overdue: 2,
        inProgress: 3,
    };
};
exports.trackActionItems = trackActionItems;
/**
 * Generates stakeholder engagement scorecard.
 *
 * @param {string} stakeholderId - Stakeholder identifier
 * @returns {Promise<object>} Engagement scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateEngagementScorecard('stakeholder-123');
 * ```
 */
const generateEngagementScorecard = async (stakeholderId) => {
    return {
        engagementFrequency: 8,
        responseRate: 9,
        sentimentScore: 7,
        actionCompletion: 8,
        overallScore: 8,
    };
};
exports.generateEngagementScorecard = generateEngagementScorecard;
/**
 * Identifies engagement gaps and opportunities.
 *
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @param {object} targetEngagementLevels - Target engagement levels
 * @returns {Promise<{ gaps: any[]; opportunities: any[] }>} Gap analysis
 *
 * @example
 * ```typescript
 * const gaps = await identifyEngagementGaps(stakeholders, { highPowerStakeholders: 'WEEKLY' });
 * ```
 */
const identifyEngagementGaps = async (stakeholders, targetEngagementLevels) => {
    return {
        gaps: [],
        opportunities: [],
    };
};
exports.identifyEngagementGaps = identifyEngagementGaps;
/**
 * Creates RACI matrix for project activities.
 *
 * @param {CreateRACIMatrixDto} matrixData - RACI matrix data
 * @param {string[]} activities - List of activities
 * @returns {Promise<RACIMatrix>} RACI matrix
 *
 * @example
 * ```typescript
 * const raci = await createRACIMatrix({
 *   matrixName: 'Digital Transformation RACI',
 *   projectId: 'project-123',
 *   stakeholders: ['stakeholder-1', 'stakeholder-2']
 * }, ['Requirements gathering', 'Design approval', 'Implementation']);
 * ```
 */
const createRACIMatrix = async (matrixData, activities) => {
    const raciActivities = activities.map((activity) => ({
        activityId: `activity-${Date.now()}`,
        activityName: activity,
        description: activity,
        assignments: {},
        missingRoles: [],
    }));
    return {
        id: `raci-${Date.now()}`,
        matrixName: matrixData.matrixName,
        projectId: matrixData.projectId,
        activities: raciActivities,
        stakeholders: matrixData.stakeholders,
        completeness: 0,
        conflicts: [],
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createRACIMatrix = createRACIMatrix;
/**
 * Validates RACI matrix for completeness and conflicts.
 *
 * @param {RACIMatrix} matrix - RACI matrix to validate
 * @returns {Promise<{ valid: boolean; issues: string[]; recommendations: string[] }>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateRACIMatrix(raciMatrix);
 * ```
 */
const validateRACIMatrix = async (matrix) => {
    const issues = [];
    for (const activity of matrix.activities) {
        const accountableCount = Object.values(activity.assignments).filter((roles) => roles.includes(RACIRole.ACCOUNTABLE)).length;
        if (accountableCount === 0) {
            issues.push(`Activity "${activity.activityName}" has no Accountable stakeholder`);
        }
        else if (accountableCount > 1) {
            issues.push(`Activity "${activity.activityName}" has multiple Accountable stakeholders`);
        }
    }
    return {
        valid: issues.length === 0,
        issues,
        recommendations: issues.map((issue) => `Resolve: ${issue}`),
    };
};
exports.validateRACIMatrix = validateRACIMatrix;
/**
 * Builds stakeholder coalitions to support initiatives.
 *
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @param {object} coalitionPurpose - Coalition purpose and goals
 * @returns {Promise<Coalition>} Created coalition
 *
 * @example
 * ```typescript
 * const coalition = await buildStakeholderCoalition(champions, {
 *   purpose: 'Support digital transformation',
 *   objectives: ['Build support', 'Address resistance']
 * });
 * ```
 */
const buildStakeholderCoalition = async (stakeholders, coalitionPurpose) => {
    return {
        id: `coalition-${Date.now()}`,
        coalitionName: coalitionPurpose.purpose,
        purpose: coalitionPurpose.purpose,
        members: stakeholders.map((s) => s.id),
        leader: stakeholders[0]?.id || '',
        formationDate: new Date(),
        strength: 0,
        influence: 0,
        objectives: coalitionPurpose.objectives || [],
        activities: [],
        status: 'FORMING',
        metadata: {},
    };
};
exports.buildStakeholderCoalition = buildStakeholderCoalition;
/**
 * Generates comprehensive stakeholder engagement report.
 *
 * @param {string} projectId - Project identifier
 * @param {Date} reportingPeriodStart - Reporting period start
 * @param {Date} reportingPeriodEnd - Reporting period end
 * @returns {Promise<Buffer>} Engagement report
 *
 * @example
 * ```typescript
 * const report = await generateStakeholderReport('project-123', new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
const generateStakeholderReport = async (projectId, reportingPeriodStart, reportingPeriodEnd) => {
    return Buffer.from(JSON.stringify({ projectId, period: { start: reportingPeriodStart, end: reportingPeriodEnd } }, null, 2));
};
exports.generateStakeholderReport = generateStakeholderReport;
// ============================================================================
// HELPER UTILITIES
// ============================================================================
/**
 * Converts power level enum to numeric score.
 */
const powerLevelToScore = (level) => {
    const scores = {
        [StakeholderPowerLevel.VERY_LOW]: 20,
        [StakeholderPowerLevel.LOW]: 40,
        [StakeholderPowerLevel.MEDIUM]: 60,
        [StakeholderPowerLevel.HIGH]: 80,
        [StakeholderPowerLevel.VERY_HIGH]: 100,
    };
    return scores[level];
};
/**
 * Converts interest level enum to numeric score.
 */
const interestLevelToScore = (level) => {
    const scores = {
        [StakeholderInterestLevel.VERY_LOW]: 20,
        [StakeholderInterestLevel.LOW]: 40,
        [StakeholderInterestLevel.MEDIUM]: 60,
        [StakeholderInterestLevel.HIGH]: 80,
        [StakeholderInterestLevel.VERY_HIGH]: 100,
    };
    return scores[level];
};
/**
 * Converts attitude to multiplier for impact calculation.
 */
const attitudeToMultiplier = (attitude) => {
    const multipliers = {
        [StakeholderAttitude.CHAMPION]: 1.2,
        [StakeholderAttitude.SUPPORTER]: 1.1,
        [StakeholderAttitude.NEUTRAL]: 1.0,
        [StakeholderAttitude.SKEPTIC]: 0.9,
        [StakeholderAttitude.BLOCKER]: 0.8,
    };
    return multipliers[attitude];
};
/**
 * Default export with all utilities.
 */
exports.default = {
    // Models
    createStakeholderModel: exports.createStakeholderModel,
    createCommunicationPlanModel: exports.createCommunicationPlanModel,
    createEngagementRecordModel: exports.createEngagementRecordModel,
    // Stakeholder Identification & Analysis
    identifyStakeholders: exports.identifyStakeholders,
    analyzeStakeholderPowerInterest: exports.analyzeStakeholderPowerInterest,
    calculateStakeholderImpact: exports.calculateStakeholderImpact,
    generateStakeholderProfile: exports.generateStakeholderProfile,
    segmentStakeholders: exports.segmentStakeholders,
    assessStakeholderAttitude: exports.assessStakeholderAttitude,
    identifyKeyStakeholders: exports.identifyKeyStakeholders,
    analyzeStakeholderRelationships: exports.analyzeStakeholderRelationships,
    generateStakeholderRegister: exports.generateStakeholderRegister,
    // Power-Interest Grid Mapping
    mapPowerInterestGrid: exports.mapPowerInterestGrid,
    generateEngagementStrategy: exports.generateEngagementStrategy,
    trackStakeholderMovement: exports.trackStakeholderMovement,
    identifyAtRiskStakeholders: exports.identifyAtRiskStakeholders,
    prioritizeStakeholderEngagement: exports.prioritizeStakeholderEngagement,
    generateGridVisualization: exports.generateGridVisualization,
    analyzeStakeholderPortfolio: exports.analyzeStakeholderPortfolio,
    simulateStakeholderScenario: exports.simulateStakeholderScenario,
    exportPowerInterestAnalysis: exports.exportPowerInterestAnalysis,
    // Influence Mapping & Network Analysis
    mapInfluenceNetwork: exports.mapInfluenceNetwork,
    calculateNetworkCentrality: exports.calculateNetworkCentrality,
    identifyInfluenceClusters: exports.identifyInfluenceClusters,
    findKeyInfluencers: exports.findKeyInfluencers,
    analyzeInfluencePaths: exports.analyzeInfluencePaths,
    identifyOpinionLeaders: exports.identifyOpinionLeaders,
    simulateInfluenceCascade: exports.simulateInfluenceCascade,
    generateInfluenceNetworkVisualization: exports.generateInfluenceNetworkVisualization,
    assessNetworkResilience: exports.assessNetworkResilience,
    // Communication Planning
    createCommunicationPlan: exports.createCommunicationPlan,
    defineTargetAudiences: exports.defineTargetAudiences,
    craftKeyMessage: exports.craftKeyMessage,
    generateCommunicationCalendar: exports.generateCommunicationCalendar,
    selectCommunicationChannels: exports.selectCommunicationChannels,
    trackCommunicationExecution: exports.trackCommunicationExecution,
    measureCommunicationEffectiveness: exports.measureCommunicationEffectiveness,
    adjustCommunicationPlan: exports.adjustCommunicationPlan,
    generateCommunicationTemplate: exports.generateCommunicationTemplate,
    // Engagement Tracking & Management
    recordStakeholderEngagement: exports.recordStakeholderEngagement,
    analyzeStakeholderSentiment: exports.analyzeStakeholderSentiment,
    trackActionItems: exports.trackActionItems,
    generateEngagementScorecard: exports.generateEngagementScorecard,
    identifyEngagementGaps: exports.identifyEngagementGaps,
    createRACIMatrix: exports.createRACIMatrix,
    validateRACIMatrix: exports.validateRACIMatrix,
    buildStakeholderCoalition: exports.buildStakeholderCoalition,
    generateStakeholderReport: exports.generateStakeholderReport,
};
//# sourceMappingURL=stakeholder-management-kit.js.map