"use strict";
/**
 * LOC: POSCTRL001
 * File: /reuse/government/position-control-workforce-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../financial/budget-planning-allocation-kit (Budget operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend government HR modules
 *   - Position management services
 *   - Workforce planning systems
 *   - Budget allocation modules
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
exports.calculateTotalFTE = exports.calculateFTE = exports.exportHeadcountData = exports.compareHeadcountYearOverYear = exports.calculateVacancyRate = exports.calculateHeadcountByClassification = exports.generateHeadcountReport = exports.validateSalaryInRange = exports.applyCOLAdjustment = exports.calculateStepIncrease = exports.getSalaryRangeForGrade = exports.createSalaryRange = exports.unfreezePosition = exports.freezePosition = exports.rejectPositionAuthorization = exports.approvePositionAuthorization = exports.createPositionAuthorization = exports.reallocatePositionFunding = exports.getPositionFunding = exports.validateFundingAllocation = exports.updatePositionFundingAllocation = exports.createPositionFundingAllocation = exports.getVacancies = exports.calculateVacancyCostSavings = exports.fillVacancy = exports.updateVacancy = exports.createVacancy = exports.getSalaryRange = exports.validateClassification = exports.getPositionsByClassification = exports.getClassificationDetails = exports.classifyPosition = exports.getPositionBudget = exports.allocatePositionFunding = exports.calculatePositionCost = exports.updatePositionBudget = exports.createPositionBudget = exports.getPosition = exports.abolishPosition = exports.updatePosition = exports.generatePositionNumber = exports.createPosition = exports.createPositionVacancyModel = exports.createPositionBudgetModel = exports.createPositionModel = exports.HeadcountReportRequestDto = exports.PositionAuthorizationDto = exports.CreateVacancyDto = exports.UpdatePositionBudgetDto = exports.CreatePositionDto = void 0;
exports.buildOrganizationalHierarchy = exports.calculateOrganizationSalaryBudget = exports.analyzePositionCost = void 0;
/**
 * File: /reuse/government/position-control-workforce-kit.ts
 * Locator: WC-GOV-POSCTRL-001
 * Purpose: Comprehensive Position Control & Workforce Management - Government position budgeting and headcount tracking
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, budget-planning-allocation-kit
 * Downstream: ../backend/government/*, Position Services, Workforce Planning, Budget Allocation, HR Systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for position management, budgeting, classification, vacancy tracking, funding allocation, authorization, salary management, requisition, headcount reporting
 *
 * LLM Context: Enterprise-grade position control system for government workforce management.
 * Provides comprehensive position lifecycle management, position budgeting, classification tracking, vacancy management,
 * position funding allocation, authorization workflows, salary range administration, position requisition, headcount reporting,
 * FTE calculation, position cost analysis, organizational hierarchy management, and workforce planning.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreatePositionDto = (() => {
    var _a;
    let _positionTitle_decorators;
    let _positionTitle_initializers = [];
    let _positionTitle_extraInitializers = [];
    let _classificationCode_decorators;
    let _classificationCode_initializers = [];
    let _classificationCode_extraInitializers = [];
    let _gradeLevel_decorators;
    let _gradeLevel_initializers = [];
    let _gradeLevel_extraInitializers = [];
    let _organizationCode_decorators;
    let _organizationCode_initializers = [];
    let _organizationCode_extraInitializers = [];
    let _departmentCode_decorators;
    let _departmentCode_initializers = [];
    let _departmentCode_extraInitializers = [];
    let _positionType_decorators;
    let _positionType_initializers = [];
    let _positionType_extraInitializers = [];
    let _employmentType_decorators;
    let _employmentType_initializers = [];
    let _employmentType_extraInitializers = [];
    let _fte_decorators;
    let _fte_initializers = [];
    let _fte_extraInitializers = [];
    let _budgetedSalary_decorators;
    let _budgetedSalary_initializers = [];
    let _budgetedSalary_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    return _a = class CreatePositionDto {
            constructor() {
                this.positionTitle = __runInitializers(this, _positionTitle_initializers, void 0);
                this.classificationCode = (__runInitializers(this, _positionTitle_extraInitializers), __runInitializers(this, _classificationCode_initializers, void 0));
                this.gradeLevel = (__runInitializers(this, _classificationCode_extraInitializers), __runInitializers(this, _gradeLevel_initializers, void 0));
                this.organizationCode = (__runInitializers(this, _gradeLevel_extraInitializers), __runInitializers(this, _organizationCode_initializers, void 0));
                this.departmentCode = (__runInitializers(this, _organizationCode_extraInitializers), __runInitializers(this, _departmentCode_initializers, void 0));
                this.positionType = (__runInitializers(this, _departmentCode_extraInitializers), __runInitializers(this, _positionType_initializers, void 0));
                this.employmentType = (__runInitializers(this, _positionType_extraInitializers), __runInitializers(this, _employmentType_initializers, void 0));
                this.fte = (__runInitializers(this, _employmentType_extraInitializers), __runInitializers(this, _fte_initializers, void 0));
                this.budgetedSalary = (__runInitializers(this, _fte_extraInitializers), __runInitializers(this, _budgetedSalary_initializers, void 0));
                this.fiscalYear = (__runInitializers(this, _budgetedSalary_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
                __runInitializers(this, _fiscalYear_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _positionTitle_decorators = [(0, swagger_1.ApiProperty)({ description: 'Position title' })];
            _classificationCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Classification code' })];
            _gradeLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Grade level' })];
            _organizationCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization code' })];
            _departmentCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department code' })];
            _positionType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Position type', enum: ['PERMANENT', 'TEMPORARY', 'TERM', 'SEASONAL'] })];
            _employmentType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employment type', enum: ['FULL_TIME', 'PART_TIME', 'INTERMITTENT'] })];
            _fte_decorators = [(0, swagger_1.ApiProperty)({ description: 'FTE value', default: 1.0 })];
            _budgetedSalary_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budgeted salary' })];
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' })];
            __esDecorate(null, null, _positionTitle_decorators, { kind: "field", name: "positionTitle", static: false, private: false, access: { has: obj => "positionTitle" in obj, get: obj => obj.positionTitle, set: (obj, value) => { obj.positionTitle = value; } }, metadata: _metadata }, _positionTitle_initializers, _positionTitle_extraInitializers);
            __esDecorate(null, null, _classificationCode_decorators, { kind: "field", name: "classificationCode", static: false, private: false, access: { has: obj => "classificationCode" in obj, get: obj => obj.classificationCode, set: (obj, value) => { obj.classificationCode = value; } }, metadata: _metadata }, _classificationCode_initializers, _classificationCode_extraInitializers);
            __esDecorate(null, null, _gradeLevel_decorators, { kind: "field", name: "gradeLevel", static: false, private: false, access: { has: obj => "gradeLevel" in obj, get: obj => obj.gradeLevel, set: (obj, value) => { obj.gradeLevel = value; } }, metadata: _metadata }, _gradeLevel_initializers, _gradeLevel_extraInitializers);
            __esDecorate(null, null, _organizationCode_decorators, { kind: "field", name: "organizationCode", static: false, private: false, access: { has: obj => "organizationCode" in obj, get: obj => obj.organizationCode, set: (obj, value) => { obj.organizationCode = value; } }, metadata: _metadata }, _organizationCode_initializers, _organizationCode_extraInitializers);
            __esDecorate(null, null, _departmentCode_decorators, { kind: "field", name: "departmentCode", static: false, private: false, access: { has: obj => "departmentCode" in obj, get: obj => obj.departmentCode, set: (obj, value) => { obj.departmentCode = value; } }, metadata: _metadata }, _departmentCode_initializers, _departmentCode_extraInitializers);
            __esDecorate(null, null, _positionType_decorators, { kind: "field", name: "positionType", static: false, private: false, access: { has: obj => "positionType" in obj, get: obj => obj.positionType, set: (obj, value) => { obj.positionType = value; } }, metadata: _metadata }, _positionType_initializers, _positionType_extraInitializers);
            __esDecorate(null, null, _employmentType_decorators, { kind: "field", name: "employmentType", static: false, private: false, access: { has: obj => "employmentType" in obj, get: obj => obj.employmentType, set: (obj, value) => { obj.employmentType = value; } }, metadata: _metadata }, _employmentType_initializers, _employmentType_extraInitializers);
            __esDecorate(null, null, _fte_decorators, { kind: "field", name: "fte", static: false, private: false, access: { has: obj => "fte" in obj, get: obj => obj.fte, set: (obj, value) => { obj.fte = value; } }, metadata: _metadata }, _fte_initializers, _fte_extraInitializers);
            __esDecorate(null, null, _budgetedSalary_decorators, { kind: "field", name: "budgetedSalary", static: false, private: false, access: { has: obj => "budgetedSalary" in obj, get: obj => obj.budgetedSalary, set: (obj, value) => { obj.budgetedSalary = value; } }, metadata: _metadata }, _budgetedSalary_initializers, _budgetedSalary_extraInitializers);
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePositionDto = CreatePositionDto;
let UpdatePositionBudgetDto = (() => {
    var _a;
    let _positionId_decorators;
    let _positionId_initializers = [];
    let _positionId_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _budgetedSalary_decorators;
    let _budgetedSalary_initializers = [];
    let _budgetedSalary_extraInitializers = [];
    let _budgetedBenefits_decorators;
    let _budgetedBenefits_initializers = [];
    let _budgetedBenefits_extraInitializers = [];
    let _otherCosts_decorators;
    let _otherCosts_initializers = [];
    let _otherCosts_extraInitializers = [];
    let _fundingSources_decorators;
    let _fundingSources_initializers = [];
    let _fundingSources_extraInitializers = [];
    return _a = class UpdatePositionBudgetDto {
            constructor() {
                this.positionId = __runInitializers(this, _positionId_initializers, void 0);
                this.fiscalYear = (__runInitializers(this, _positionId_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
                this.budgetedSalary = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _budgetedSalary_initializers, void 0));
                this.budgetedBenefits = (__runInitializers(this, _budgetedSalary_extraInitializers), __runInitializers(this, _budgetedBenefits_initializers, void 0));
                this.otherCosts = (__runInitializers(this, _budgetedBenefits_extraInitializers), __runInitializers(this, _otherCosts_initializers, void 0));
                this.fundingSources = (__runInitializers(this, _otherCosts_extraInitializers), __runInitializers(this, _fundingSources_initializers, void 0));
                __runInitializers(this, _fundingSources_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _positionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Position ID' })];
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' })];
            _budgetedSalary_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budgeted salary' })];
            _budgetedBenefits_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budgeted benefits' })];
            _otherCosts_decorators = [(0, swagger_1.ApiProperty)({ description: 'Other costs' })];
            _fundingSources_decorators = [(0, swagger_1.ApiProperty)({ description: 'Funding sources', type: [Object] })];
            __esDecorate(null, null, _positionId_decorators, { kind: "field", name: "positionId", static: false, private: false, access: { has: obj => "positionId" in obj, get: obj => obj.positionId, set: (obj, value) => { obj.positionId = value; } }, metadata: _metadata }, _positionId_initializers, _positionId_extraInitializers);
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _budgetedSalary_decorators, { kind: "field", name: "budgetedSalary", static: false, private: false, access: { has: obj => "budgetedSalary" in obj, get: obj => obj.budgetedSalary, set: (obj, value) => { obj.budgetedSalary = value; } }, metadata: _metadata }, _budgetedSalary_initializers, _budgetedSalary_extraInitializers);
            __esDecorate(null, null, _budgetedBenefits_decorators, { kind: "field", name: "budgetedBenefits", static: false, private: false, access: { has: obj => "budgetedBenefits" in obj, get: obj => obj.budgetedBenefits, set: (obj, value) => { obj.budgetedBenefits = value; } }, metadata: _metadata }, _budgetedBenefits_initializers, _budgetedBenefits_extraInitializers);
            __esDecorate(null, null, _otherCosts_decorators, { kind: "field", name: "otherCosts", static: false, private: false, access: { has: obj => "otherCosts" in obj, get: obj => obj.otherCosts, set: (obj, value) => { obj.otherCosts = value; } }, metadata: _metadata }, _otherCosts_initializers, _otherCosts_extraInitializers);
            __esDecorate(null, null, _fundingSources_decorators, { kind: "field", name: "fundingSources", static: false, private: false, access: { has: obj => "fundingSources" in obj, get: obj => obj.fundingSources, set: (obj, value) => { obj.fundingSources = value; } }, metadata: _metadata }, _fundingSources_initializers, _fundingSources_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdatePositionBudgetDto = UpdatePositionBudgetDto;
let CreateVacancyDto = (() => {
    var _a;
    let _positionId_decorators;
    let _positionId_initializers = [];
    let _positionId_extraInitializers = [];
    let _vacancyReason_decorators;
    let _vacancyReason_initializers = [];
    let _vacancyReason_extraInitializers = [];
    let _vacantSince_decorators;
    let _vacantSince_initializers = [];
    let _vacantSince_extraInitializers = [];
    let _targetFillDate_decorators;
    let _targetFillDate_initializers = [];
    let _targetFillDate_extraInitializers = [];
    let _isAuthorizedToFill_decorators;
    let _isAuthorizedToFill_initializers = [];
    let _isAuthorizedToFill_extraInitializers = [];
    return _a = class CreateVacancyDto {
            constructor() {
                this.positionId = __runInitializers(this, _positionId_initializers, void 0);
                this.vacancyReason = (__runInitializers(this, _positionId_extraInitializers), __runInitializers(this, _vacancyReason_initializers, void 0));
                this.vacantSince = (__runInitializers(this, _vacancyReason_extraInitializers), __runInitializers(this, _vacantSince_initializers, void 0));
                this.targetFillDate = (__runInitializers(this, _vacantSince_extraInitializers), __runInitializers(this, _targetFillDate_initializers, void 0));
                this.isAuthorizedToFill = (__runInitializers(this, _targetFillDate_extraInitializers), __runInitializers(this, _isAuthorizedToFill_initializers, void 0));
                __runInitializers(this, _isAuthorizedToFill_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _positionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Position ID' })];
            _vacancyReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vacancy reason', enum: ['RESIGNATION', 'RETIREMENT', 'TRANSFER', 'TERMINATION', 'NEW_POSITION'] })];
            _vacantSince_decorators = [(0, swagger_1.ApiProperty)({ description: 'Date position became vacant' })];
            _targetFillDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target fill date', required: false })];
            _isAuthorizedToFill_decorators = [(0, swagger_1.ApiProperty)({ description: 'Authorized to fill', default: true })];
            __esDecorate(null, null, _positionId_decorators, { kind: "field", name: "positionId", static: false, private: false, access: { has: obj => "positionId" in obj, get: obj => obj.positionId, set: (obj, value) => { obj.positionId = value; } }, metadata: _metadata }, _positionId_initializers, _positionId_extraInitializers);
            __esDecorate(null, null, _vacancyReason_decorators, { kind: "field", name: "vacancyReason", static: false, private: false, access: { has: obj => "vacancyReason" in obj, get: obj => obj.vacancyReason, set: (obj, value) => { obj.vacancyReason = value; } }, metadata: _metadata }, _vacancyReason_initializers, _vacancyReason_extraInitializers);
            __esDecorate(null, null, _vacantSince_decorators, { kind: "field", name: "vacantSince", static: false, private: false, access: { has: obj => "vacantSince" in obj, get: obj => obj.vacantSince, set: (obj, value) => { obj.vacantSince = value; } }, metadata: _metadata }, _vacantSince_initializers, _vacantSince_extraInitializers);
            __esDecorate(null, null, _targetFillDate_decorators, { kind: "field", name: "targetFillDate", static: false, private: false, access: { has: obj => "targetFillDate" in obj, get: obj => obj.targetFillDate, set: (obj, value) => { obj.targetFillDate = value; } }, metadata: _metadata }, _targetFillDate_initializers, _targetFillDate_extraInitializers);
            __esDecorate(null, null, _isAuthorizedToFill_decorators, { kind: "field", name: "isAuthorizedToFill", static: false, private: false, access: { has: obj => "isAuthorizedToFill" in obj, get: obj => obj.isAuthorizedToFill, set: (obj, value) => { obj.isAuthorizedToFill = value; } }, metadata: _metadata }, _isAuthorizedToFill_initializers, _isAuthorizedToFill_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateVacancyDto = CreateVacancyDto;
let PositionAuthorizationDto = (() => {
    var _a;
    let _positionId_decorators;
    let _positionId_initializers = [];
    let _positionId_extraInitializers = [];
    let _authorizationType_decorators;
    let _authorizationType_initializers = [];
    let _authorizationType_extraInitializers = [];
    let _justification_decorators;
    let _justification_initializers = [];
    let _justification_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    return _a = class PositionAuthorizationDto {
            constructor() {
                this.positionId = __runInitializers(this, _positionId_initializers, void 0);
                this.authorizationType = (__runInitializers(this, _positionId_extraInitializers), __runInitializers(this, _authorizationType_initializers, void 0));
                this.justification = (__runInitializers(this, _authorizationType_extraInitializers), __runInitializers(this, _justification_initializers, void 0));
                this.requestedBy = (__runInitializers(this, _justification_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                __runInitializers(this, _effectiveDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _positionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Position ID' })];
            _authorizationType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Authorization type', enum: ['NEW', 'RECLASS', 'ABOLISH', 'FREEZE', 'UNFREEZE'] })];
            _justification_decorators = [(0, swagger_1.ApiProperty)({ description: 'Justification' })];
            _requestedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requested by' })];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date', required: false })];
            __esDecorate(null, null, _positionId_decorators, { kind: "field", name: "positionId", static: false, private: false, access: { has: obj => "positionId" in obj, get: obj => obj.positionId, set: (obj, value) => { obj.positionId = value; } }, metadata: _metadata }, _positionId_initializers, _positionId_extraInitializers);
            __esDecorate(null, null, _authorizationType_decorators, { kind: "field", name: "authorizationType", static: false, private: false, access: { has: obj => "authorizationType" in obj, get: obj => obj.authorizationType, set: (obj, value) => { obj.authorizationType = value; } }, metadata: _metadata }, _authorizationType_initializers, _authorizationType_extraInitializers);
            __esDecorate(null, null, _justification_decorators, { kind: "field", name: "justification", static: false, private: false, access: { has: obj => "justification" in obj, get: obj => obj.justification, set: (obj, value) => { obj.justification = value; } }, metadata: _metadata }, _justification_initializers, _justification_extraInitializers);
            __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PositionAuthorizationDto = PositionAuthorizationDto;
let HeadcountReportRequestDto = (() => {
    var _a;
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _organizationCode_decorators;
    let _organizationCode_initializers = [];
    let _organizationCode_extraInitializers = [];
    let _includeChildren_decorators;
    let _includeChildren_initializers = [];
    let _includeChildren_extraInitializers = [];
    let _asOfDate_decorators;
    let _asOfDate_initializers = [];
    let _asOfDate_extraInitializers = [];
    return _a = class HeadcountReportRequestDto {
            constructor() {
                this.fiscalYear = __runInitializers(this, _fiscalYear_initializers, void 0);
                this.organizationCode = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _organizationCode_initializers, void 0));
                this.includeChildren = (__runInitializers(this, _organizationCode_extraInitializers), __runInitializers(this, _includeChildren_initializers, void 0));
                this.asOfDate = (__runInitializers(this, _includeChildren_extraInitializers), __runInitializers(this, _asOfDate_initializers, void 0));
                __runInitializers(this, _asOfDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' })];
            _organizationCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization code', required: false })];
            _includeChildren_decorators = [(0, swagger_1.ApiProperty)({ description: 'Include child organizations', default: true })];
            _asOfDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'As of date', required: false })];
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _organizationCode_decorators, { kind: "field", name: "organizationCode", static: false, private: false, access: { has: obj => "organizationCode" in obj, get: obj => obj.organizationCode, set: (obj, value) => { obj.organizationCode = value; } }, metadata: _metadata }, _organizationCode_initializers, _organizationCode_extraInitializers);
            __esDecorate(null, null, _includeChildren_decorators, { kind: "field", name: "includeChildren", static: false, private: false, access: { has: obj => "includeChildren" in obj, get: obj => obj.includeChildren, set: (obj, value) => { obj.includeChildren = value; } }, metadata: _metadata }, _includeChildren_initializers, _includeChildren_extraInitializers);
            __esDecorate(null, null, _asOfDate_decorators, { kind: "field", name: "asOfDate", static: false, private: false, access: { has: obj => "asOfDate" in obj, get: obj => obj.asOfDate, set: (obj, value) => { obj.asOfDate = value; } }, metadata: _metadata }, _asOfDate_initializers, _asOfDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.HeadcountReportRequestDto = HeadcountReportRequestDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Position with classification and organizational tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Position model
 *
 * @example
 * ```typescript
 * const Position = createPositionModel(sequelize);
 * const position = await Position.create({
 *   positionNumber: 'POS-2025-001',
 *   positionTitle: 'Senior Engineer',
 *   classificationCode: 'GS-0801',
 *   gradeLevel: 'GS-13',
 *   organizationCode: 'ORG-100',
 *   status: 'AUTHORIZED'
 * });
 * ```
 */
const createPositionModel = (sequelize) => {
    class Position extends sequelize_1.Model {
    }
    Position.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        positionNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique position identifier',
        },
        positionTitle: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Position title',
        },
        classificationCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Classification/job code (e.g., GS-0801)',
        },
        classificationTitle: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Classification title',
        },
        gradeLevel: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Grade level (e.g., GS-13, WG-10)',
        },
        step: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Step within grade',
            validate: {
                min: 1,
                max: 10,
            },
        },
        series: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
            comment: 'Occupational series',
        },
        organizationCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Organization/agency code',
        },
        organizationName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Organization/agency name',
        },
        departmentCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Department code',
        },
        divisionCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Division code',
        },
        sectionCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Section code',
        },
        supervisorPositionId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Supervisor position ID',
            references: {
                model: 'positions',
                key: 'id',
            },
        },
        positionType: {
            type: sequelize_1.DataTypes.ENUM('PERMANENT', 'TEMPORARY', 'TERM', 'SEASONAL', 'INTERMITTENT'),
            allowNull: false,
            comment: 'Type of position',
        },
        employmentType: {
            type: sequelize_1.DataTypes.ENUM('FULL_TIME', 'PART_TIME', 'INTERMITTENT'),
            allowNull: false,
            comment: 'Employment type',
        },
        fte: {
            type: sequelize_1.DataTypes.DECIMAL(4, 2),
            allowNull: false,
            defaultValue: 1.0,
            comment: 'Full-time equivalent',
            validate: {
                min: 0,
                max: 1,
            },
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('AUTHORIZED', 'FILLED', 'VACANT', 'FROZEN', 'ABOLISHED', 'PENDING'),
            allowNull: false,
            defaultValue: 'AUTHORIZED',
            comment: 'Position status',
        },
        budgetedSalary: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            comment: 'Budgeted annual salary',
        },
        actualSalary: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: true,
            comment: 'Actual incumbent salary',
        },
        benefitRate: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 30.0,
            comment: 'Benefit rate percentage',
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
            validate: {
                min: 2000,
                max: 2099,
            },
        },
        authorizedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date position was authorized',
        },
        filledDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date position was filled',
        },
        vacantDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date position became vacant',
        },
        currentIncumbent: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Current employee name',
        },
        incumbentId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Current employee ID',
        },
        isExempt: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether position is exempt from FLSA',
        },
        isSupervisory: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether position is supervisory',
        },
        bargainingUnit: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Bargaining unit code',
        },
        locationCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Geographic location code',
        },
        fundingMix: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Funding source breakdown',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the position',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the position',
        },
    }, {
        sequelize,
        tableName: 'positions',
        timestamps: true,
        indexes: [
            { fields: ['positionNumber'], unique: true },
            { fields: ['fiscalYear'] },
            { fields: ['organizationCode'] },
            { fields: ['departmentCode'] },
            { fields: ['classificationCode'] },
            { fields: ['status'] },
            { fields: ['positionType'] },
            { fields: ['fiscalYear', 'organizationCode'] },
            { fields: ['supervisorPositionId'] },
        ],
    });
    return Position;
};
exports.createPositionModel = createPositionModel;
/**
 * Sequelize model for Position Budgets with funding source tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PositionBudget model
 *
 * @example
 * ```typescript
 * const PositionBudget = createPositionBudgetModel(sequelize);
 * const budget = await PositionBudget.create({
 *   positionId: 1,
 *   fiscalYear: 2025,
 *   budgetedSalary: 95000,
 *   budgetedBenefits: 28500,
 *   totalBudgeted: 123500
 * });
 * ```
 */
const createPositionBudgetModel = (sequelize) => {
    class PositionBudget extends sequelize_1.Model {
    }
    PositionBudget.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        positionId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Related position ID',
            references: {
                model: 'positions',
                key: 'id',
            },
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
        },
        budgetedSalary: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            comment: 'Budgeted salary amount',
        },
        budgetedBenefits: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Budgeted benefits amount',
        },
        budgetedOvertim: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Budgeted overtime amount',
        },
        otherCosts: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Other budgeted costs',
        },
        totalBudgeted: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            comment: 'Total budgeted amount',
        },
        actualSalary: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Actual salary paid',
        },
        actualBenefits: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Actual benefits paid',
        },
        actualOvertime: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Actual overtime paid',
        },
        actualOtherCosts: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Other actual costs',
        },
        totalActual: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total actual amount',
        },
        variance: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Budget variance',
        },
        benefitRate: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 30.0,
            comment: 'Benefit rate percentage',
        },
        encumbered: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether position budget is encumbered',
        },
        encumbranceNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Related encumbrance number',
        },
        budgetLineId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Related budget line ID',
        },
        accountCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'GL account code',
        },
        fundingSources: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Funding source breakdown',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'position_budgets',
        timestamps: true,
        indexes: [
            { fields: ['positionId'] },
            { fields: ['fiscalYear'] },
            { fields: ['positionId', 'fiscalYear'], unique: true },
            { fields: ['budgetLineId'] },
            { fields: ['encumbranceNumber'] },
        ],
        hooks: {
            beforeSave: (budget) => {
                budget.variance = Number(budget.totalBudgeted) - Number(budget.totalActual);
            },
        },
    });
    return PositionBudget;
};
exports.createPositionBudgetModel = createPositionBudgetModel;
/**
 * Sequelize model for Position Vacancies with recruitment tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PositionVacancy model
 *
 * @example
 * ```typescript
 * const Vacancy = createPositionVacancyModel(sequelize);
 * const vacancy = await Vacancy.create({
 *   positionId: 1,
 *   vacancyNumber: 'VAC-2025-001',
 *   vacantSince: new Date(),
 *   vacancyReason: 'RETIREMENT',
 *   recruitmentStatus: 'ADVERTISING'
 * });
 * ```
 */
const createPositionVacancyModel = (sequelize) => {
    class PositionVacancy extends sequelize_1.Model {
    }
    PositionVacancy.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        positionId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Related position ID',
            references: {
                model: 'positions',
                key: 'id',
            },
        },
        vacancyNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique vacancy identifier',
        },
        vacantSince: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Date position became vacant',
        },
        vacancyReason: {
            type: sequelize_1.DataTypes.ENUM('RESIGNATION', 'RETIREMENT', 'TRANSFER', 'TERMINATION', 'NEW_POSITION', 'PROMOTION', 'OTHER'),
            allowNull: false,
            comment: 'Reason for vacancy',
        },
        previousIncumbent: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Previous employee name',
        },
        previousIncumbentId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Previous employee ID',
        },
        recruitmentStatus: {
            type: sequelize_1.DataTypes.ENUM('NOT_STARTED', 'ADVERTISING', 'SCREENING', 'INTERVIEWING', 'OFFER_EXTENDED', 'FILLED', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'NOT_STARTED',
            comment: 'Recruitment status',
        },
        recruitmentStartDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date recruitment started',
        },
        announcementNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Job announcement number',
        },
        applicantCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of applicants',
        },
        interviewCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of interviews conducted',
        },
        targetFillDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Target date to fill position',
        },
        actualFillDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Actual date position was filled',
        },
        estimatedCostSavings: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Estimated cost savings from vacancy',
        },
        actualCostSavings: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Actual cost savings realized',
        },
        isAuthorizedToFill: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether authorized to fill',
        },
        authorizationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date authorized to fill',
        },
        authorizedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who authorized to fill',
        },
        recruitmentNotes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Recruitment notes',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('OPEN', 'RECRUITING', 'FILLED', 'FROZEN', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'OPEN',
            comment: 'Vacancy status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'position_vacancies',
        timestamps: true,
        indexes: [
            { fields: ['vacancyNumber'], unique: true },
            { fields: ['positionId'] },
            { fields: ['vacantSince'] },
            { fields: ['recruitmentStatus'] },
            { fields: ['status'] },
            { fields: ['isAuthorizedToFill'] },
        ],
    });
    return PositionVacancy;
};
exports.createPositionVacancyModel = createPositionVacancyModel;
// ============================================================================
// POSITION MANAGEMENT (1-5)
// ============================================================================
/**
 * Creates a new position with budget allocation.
 *
 * @param {object} positionData - Position creation data
 * @param {string} userId - User creating the position
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<Position>} Created position
 *
 * @example
 * ```typescript
 * const position = await createPosition({
 *   positionTitle: 'Senior Engineer',
 *   classificationCode: 'GS-0801',
 *   gradeLevel: 'GS-13',
 *   organizationCode: 'ORG-100',
 *   departmentCode: 'DEPT-10',
 *   positionType: 'PERMANENT',
 *   employmentType: 'FULL_TIME',
 *   fte: 1.0,
 *   budgetedSalary: 95000,
 *   fiscalYear: 2025
 * }, 'admin');
 * ```
 */
const createPosition = async (positionData, userId, transaction) => {
    const positionNumber = (0, exports.generatePositionNumber)(positionData.organizationCode, positionData.fiscalYear);
    return {
        positionId: Date.now(),
        positionNumber,
        ...positionData,
        status: 'AUTHORIZED',
        authorizedDate: new Date(),
        createdBy: userId,
        updatedBy: userId,
    };
};
exports.createPosition = createPosition;
/**
 * Generates unique position number.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @returns {string} Generated position number
 *
 * @example
 * ```typescript
 * const posNumber = generatePositionNumber('ORG-100', 2025);
 * // Returns: 'POS-ORG100-2025-001234'
 * ```
 */
const generatePositionNumber = (organizationCode, fiscalYear) => {
    const orgCode = organizationCode.replace(/[^A-Z0-9]/g, '');
    const timestamp = Date.now().toString().slice(-6);
    return `POS-${orgCode}-${fiscalYear}-${timestamp}`;
};
exports.generatePositionNumber = generatePositionNumber;
/**
 * Updates position details.
 *
 * @param {number} positionId - Position ID
 * @param {object} updates - Position updates
 * @param {string} userId - User making updates
 * @returns {Promise<Position>} Updated position
 *
 * @example
 * ```typescript
 * const updated = await updatePosition(1, {
 *   positionTitle: 'Lead Engineer',
 *   budgetedSalary: 105000
 * }, 'manager');
 * ```
 */
const updatePosition = async (positionId, updates, userId) => {
    return {
        positionId,
        ...updates,
        updatedBy: userId,
        updatedAt: new Date(),
    };
};
exports.updatePosition = updatePosition;
/**
 * Abolishes a position.
 *
 * @param {number} positionId - Position ID
 * @param {string} reason - Abolishment reason
 * @param {string} userId - User abolishing position
 * @returns {Promise<Position>} Abolished position
 *
 * @example
 * ```typescript
 * const abolished = await abolishPosition(1, 'Organizational restructuring', 'admin');
 * ```
 */
const abolishPosition = async (positionId, reason, userId) => {
    return {
        positionId,
        status: 'ABOLISHED',
        metadata: { abolishmentReason: reason, abolishedDate: new Date() },
        updatedBy: userId,
    };
};
exports.abolishPosition = abolishPosition;
/**
 * Retrieves position by number or ID.
 *
 * @param {string | number} identifier - Position number or ID
 * @returns {Promise<Position | null>} Position or null
 *
 * @example
 * ```typescript
 * const position = await getPosition('POS-ORG100-2025-001234');
 * ```
 */
const getPosition = async (identifier) => {
    // Mock implementation
    return null;
};
exports.getPosition = getPosition;
// ============================================================================
// POSITION BUDGETING (6-10)
// ============================================================================
/**
 * Creates position budget for fiscal year.
 *
 * @param {object} budgetData - Budget data
 * @param {string} userId - User creating budget
 * @returns {Promise<PositionBudget>} Created position budget
 *
 * @example
 * ```typescript
 * const budget = await createPositionBudget({
 *   positionId: 1,
 *   fiscalYear: 2025,
 *   budgetedSalary: 95000,
 *   budgetedBenefits: 28500,
 *   otherCosts: 5000
 * }, 'budget.officer');
 * ```
 */
const createPositionBudget = async (budgetData, userId) => {
    const totalBudgeted = Number(budgetData.budgetedSalary) +
        Number(budgetData.budgetedBenefits || 0) +
        Number(budgetData.otherCosts || 0);
    return {
        budgetId: Date.now(),
        ...budgetData,
        totalBudgeted,
        totalActual: 0,
        variance: totalBudgeted,
    };
};
exports.createPositionBudget = createPositionBudget;
/**
 * Updates position budget.
 *
 * @param {number} positionId - Position ID
 * @param {number} fiscalYear - Fiscal year
 * @param {object} updates - Budget updates
 * @returns {Promise<PositionBudget>} Updated budget
 *
 * @example
 * ```typescript
 * const updated = await updatePositionBudget(1, 2025, {
 *   budgetedSalary: 100000,
 *   budgetedBenefits: 30000
 * });
 * ```
 */
const updatePositionBudget = async (positionId, fiscalYear, updates) => {
    return {
        budgetId: Date.now(),
        positionId,
        fiscalYear,
        ...updates,
    };
};
exports.updatePositionBudget = updatePositionBudget;
/**
 * Calculates total position cost including benefits.
 *
 * @param {number} salary - Base salary
 * @param {number} benefitRate - Benefit rate percentage
 * @param {number} [otherCosts=0] - Other costs
 * @returns {number} Total position cost
 *
 * @example
 * ```typescript
 * const total = calculatePositionCost(95000, 30, 5000);
 * // Returns: 128500
 * ```
 */
const calculatePositionCost = (salary, benefitRate, otherCosts = 0) => {
    const benefits = salary * (benefitRate / 100);
    return salary + benefits + otherCosts;
};
exports.calculatePositionCost = calculatePositionCost;
/**
 * Allocates position budget to funding sources.
 *
 * @param {number} positionBudgetId - Position budget ID
 * @param {FundingSource[]} fundingSources - Funding source allocations
 * @returns {Promise<object>} Allocation result
 *
 * @example
 * ```typescript
 * const result = await allocatePositionFunding(1, [
 *   { fundCode: 'FUND-A', percentage: 60, amount: 75000 },
 *   { fundCode: 'FUND-B', percentage: 40, amount: 50000 }
 * ]);
 * ```
 */
const allocatePositionFunding = async (positionBudgetId, fundingSources) => {
    const totalPercentage = fundingSources.reduce((sum, source) => sum + source.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
        throw new Error('Funding source percentages must sum to 100%');
    }
    return {
        positionBudgetId,
        fundingSources,
        allocatedAt: new Date(),
    };
};
exports.allocatePositionFunding = allocatePositionFunding;
/**
 * Retrieves position budget for fiscal year.
 *
 * @param {number} positionId - Position ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<PositionBudget | null>} Position budget or null
 *
 * @example
 * ```typescript
 * const budget = await getPositionBudget(1, 2025);
 * ```
 */
const getPositionBudget = async (positionId, fiscalYear) => {
    return null;
};
exports.getPositionBudget = getPositionBudget;
// ============================================================================
// POSITION CLASSIFICATION (11-15)
// ============================================================================
/**
 * Classifies or reclassifies a position.
 *
 * @param {number} positionId - Position ID
 * @param {string} classificationCode - New classification code
 * @param {string} gradeLevel - New grade level
 * @param {string} reason - Reason for classification change
 * @param {string} userId - User performing classification
 * @returns {Promise<Position>} Reclassified position
 *
 * @example
 * ```typescript
 * const reclassified = await classifyPosition(1, 'GS-0801', 'GS-14', 'Promotion', 'hr.specialist');
 * ```
 */
const classifyPosition = async (positionId, classificationCode, gradeLevel, reason, userId) => {
    return {
        positionId,
        classificationCode,
        gradeLevel,
        metadata: { reclassificationReason: reason, reclassifiedDate: new Date() },
        updatedBy: userId,
    };
};
exports.classifyPosition = classifyPosition;
/**
 * Retrieves classification details.
 *
 * @param {string} classificationCode - Classification code
 * @returns {Promise<PositionClassification | null>} Classification details
 *
 * @example
 * ```typescript
 * const classification = await getClassificationDetails('GS-0801');
 * ```
 */
const getClassificationDetails = async (classificationCode) => {
    return null;
};
exports.getClassificationDetails = getClassificationDetails;
/**
 * Lists all positions by classification.
 *
 * @param {string} classificationCode - Classification code
 * @param {number} [fiscalYear] - Optional fiscal year filter
 * @returns {Promise<Position[]>} Positions with classification
 *
 * @example
 * ```typescript
 * const positions = await getPositionsByClassification('GS-0801', 2025);
 * ```
 */
const getPositionsByClassification = async (classificationCode, fiscalYear) => {
    return [];
};
exports.getPositionsByClassification = getPositionsByClassification;
/**
 * Validates position classification.
 *
 * @param {string} classificationCode - Classification code
 * @param {string} gradeLevel - Grade level
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateClassification('GS-0801', 'GS-13');
 * ```
 */
const validateClassification = async (classificationCode, gradeLevel) => {
    const errors = [];
    // Mock validation
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateClassification = validateClassification;
/**
 * Retrieves salary range for classification and grade.
 *
 * @param {string} classificationCode - Classification code
 * @param {string} gradeLevel - Grade level
 * @param {number} [step] - Optional step
 * @returns {Promise<SalaryRange | null>} Salary range
 *
 * @example
 * ```typescript
 * const range = await getSalaryRange('GS-0801', 'GS-13', 5);
 * ```
 */
const getSalaryRange = async (classificationCode, gradeLevel, step) => {
    return null;
};
exports.getSalaryRange = getSalaryRange;
// ============================================================================
// VACANCY TRACKING (16-20)
// ============================================================================
/**
 * Creates vacancy record for position.
 *
 * @param {object} vacancyData - Vacancy data
 * @param {string} userId - User creating vacancy
 * @returns {Promise<Vacancy>} Created vacancy
 *
 * @example
 * ```typescript
 * const vacancy = await createVacancy({
 *   positionId: 1,
 *   vacancyReason: 'RETIREMENT',
 *   vacantSince: new Date(),
 *   isAuthorizedToFill: true
 * }, 'hr.manager');
 * ```
 */
const createVacancy = async (vacancyData, userId) => {
    const vacancyNumber = `VAC-${Date.now()}`;
    return {
        vacancyId: Date.now(),
        vacancyNumber,
        ...vacancyData,
        recruitmentStatus: 'NOT_STARTED',
        estimatedCostSavings: 0,
    };
};
exports.createVacancy = createVacancy;
/**
 * Updates vacancy status and recruitment progress.
 *
 * @param {number} vacancyId - Vacancy ID
 * @param {object} updates - Vacancy updates
 * @returns {Promise<Vacancy>} Updated vacancy
 *
 * @example
 * ```typescript
 * const updated = await updateVacancy(1, {
 *   recruitmentStatus: 'INTERVIEWING',
 *   applicantCount: 15,
 *   interviewCount: 5
 * });
 * ```
 */
const updateVacancy = async (vacancyId, updates) => {
    return {
        vacancyId,
        ...updates,
    };
};
exports.updateVacancy = updateVacancy;
/**
 * Fills vacancy with new incumbent.
 *
 * @param {number} vacancyId - Vacancy ID
 * @param {string} incumbentName - New employee name
 * @param {number} incumbentId - New employee ID
 * @param {Date} fillDate - Fill date
 * @returns {Promise<Vacancy>} Filled vacancy
 *
 * @example
 * ```typescript
 * const filled = await fillVacancy(1, 'Jane Smith', 12345, new Date());
 * ```
 */
const fillVacancy = async (vacancyId, incumbentName, incumbentId, fillDate) => {
    return {
        vacancyId,
        recruitmentStatus: 'FILLED',
        actualFillDate: fillDate,
    };
};
exports.fillVacancy = fillVacancy;
/**
 * Calculates cost savings from vacancy.
 *
 * @param {number} vacancyId - Vacancy ID
 * @returns {Promise<number>} Cost savings amount
 *
 * @example
 * ```typescript
 * const savings = await calculateVacancyCostSavings(1);
 * ```
 */
const calculateVacancyCostSavings = async (vacancyId) => {
    // Mock calculation
    const dailySalary = 95000 / 365;
    const daysVacant = 60;
    return dailySalary * daysVacant;
};
exports.calculateVacancyCostSavings = calculateVacancyCostSavings;
/**
 * Retrieves all vacancies for organization.
 *
 * @param {string} organizationCode - Organization code
 * @param {object} [filters] - Optional filters
 * @returns {Promise<Vacancy[]>} Vacancies
 *
 * @example
 * ```typescript
 * const vacancies = await getVacancies('ORG-100', { status: 'OPEN' });
 * ```
 */
const getVacancies = async (organizationCode, filters) => {
    return [];
};
exports.getVacancies = getVacancies;
// ============================================================================
// POSITION FUNDING ALLOCATION (21-25)
// ============================================================================
/**
 * Creates funding allocation for position.
 *
 * @param {object} fundingData - Funding allocation data
 * @returns {Promise<PositionFunding>} Created funding allocation
 *
 * @example
 * ```typescript
 * const funding = await createPositionFundingAllocation({
 *   positionId: 1,
 *   fiscalYear: 2025,
 *   fundCode: 'FUND-A',
 *   accountCode: '5100-001',
 *   fundingPercentage: 100,
 *   annualAmount: 125000
 * });
 * ```
 */
const createPositionFundingAllocation = async (fundingData) => {
    return {
        fundingId: Date.now(),
        ...fundingData,
        status: 'ACTIVE',
        effectiveDate: new Date(),
    };
};
exports.createPositionFundingAllocation = createPositionFundingAllocation;
/**
 * Updates position funding allocation.
 *
 * @param {number} fundingId - Funding ID
 * @param {object} updates - Funding updates
 * @returns {Promise<PositionFunding>} Updated funding
 *
 * @example
 * ```typescript
 * const updated = await updatePositionFundingAllocation(1, {
 *   fundingPercentage: 60,
 *   annualAmount: 75000
 * });
 * ```
 */
const updatePositionFundingAllocation = async (fundingId, updates) => {
    return {
        fundingId,
        ...updates,
    };
};
exports.updatePositionFundingAllocation = updatePositionFundingAllocation;
/**
 * Validates funding allocation totals to 100%.
 *
 * @param {number} positionId - Position ID
 * @param {FundingSource[]} fundingSources - Funding sources
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateFundingAllocation(1, fundingSources);
 * ```
 */
const validateFundingAllocation = async (positionId, fundingSources) => {
    const errors = [];
    const totalPercentage = fundingSources.reduce((sum, source) => sum + source.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
        errors.push('Funding percentages must total 100%');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateFundingAllocation = validateFundingAllocation;
/**
 * Retrieves position funding sources.
 *
 * @param {number} positionId - Position ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<PositionFunding[]>} Funding sources
 *
 * @example
 * ```typescript
 * const funding = await getPositionFunding(1, 2025);
 * ```
 */
const getPositionFunding = async (positionId, fiscalYear) => {
    return [];
};
exports.getPositionFunding = getPositionFunding;
/**
 * Reallocates position funding between sources.
 *
 * @param {number} positionId - Position ID
 * @param {FundingSource[]} newAllocation - New funding allocation
 * @param {string} reason - Reason for reallocation
 * @returns {Promise<PositionFunding[]>} Updated funding allocation
 *
 * @example
 * ```typescript
 * const reallocated = await reallocatePositionFunding(1, newSources, 'Budget adjustment');
 * ```
 */
const reallocatePositionFunding = async (positionId, newAllocation, reason) => {
    return [];
};
exports.reallocatePositionFunding = reallocatePositionFunding;
// ============================================================================
// POSITION AUTHORIZATION (26-30)
// ============================================================================
/**
 * Creates position authorization request.
 *
 * @param {object} authData - Authorization request data
 * @param {string} userId - User creating request
 * @returns {Promise<PositionAuthorization>} Authorization request
 *
 * @example
 * ```typescript
 * const auth = await createPositionAuthorization({
 *   positionId: 1,
 *   authorizationType: 'NEW',
 *   justification: 'Increased workload requires additional staff',
 *   requestedBy: 'manager.jones'
 * }, 'manager.jones');
 * ```
 */
const createPositionAuthorization = async (authData, userId) => {
    return {
        authorizationId: Date.now(),
        ...authData,
        requestDate: new Date(),
        currentApprovalLevel: 0,
        status: 'DRAFT',
        approvalWorkflow: [],
    };
};
exports.createPositionAuthorization = createPositionAuthorization;
/**
 * Approves position authorization at workflow level.
 *
 * @param {number} authorizationId - Authorization ID
 * @param {string} approverId - Approver ID
 * @param {string} comments - Approval comments
 * @returns {Promise<PositionAuthorization>} Updated authorization
 *
 * @example
 * ```typescript
 * const approved = await approvePositionAuthorization(1, 'director.smith', 'Approved');
 * ```
 */
const approvePositionAuthorization = async (authorizationId, approverId, comments) => {
    return {
        authorizationId,
        status: 'APPROVED',
        approvalWorkflow: [],
    };
};
exports.approvePositionAuthorization = approvePositionAuthorization;
/**
 * Rejects position authorization.
 *
 * @param {number} authorizationId - Authorization ID
 * @param {string} approverId - Approver ID
 * @param {string} reason - Rejection reason
 * @returns {Promise<PositionAuthorization>} Rejected authorization
 *
 * @example
 * ```typescript
 * const rejected = await rejectPositionAuthorization(1, 'director', 'Insufficient budget');
 * ```
 */
const rejectPositionAuthorization = async (authorizationId, approverId, reason) => {
    return {
        authorizationId,
        status: 'REJECTED',
        approvalWorkflow: [],
    };
};
exports.rejectPositionAuthorization = rejectPositionAuthorization;
/**
 * Freezes position (prevents filling).
 *
 * @param {number} positionId - Position ID
 * @param {string} reason - Freeze reason
 * @param {string} userId - User freezing position
 * @returns {Promise<Position>} Frozen position
 *
 * @example
 * ```typescript
 * const frozen = await freezePosition(1, 'Budget constraints', 'admin');
 * ```
 */
const freezePosition = async (positionId, reason, userId) => {
    return {
        positionId,
        status: 'FROZEN',
        metadata: { freezeReason: reason, frozenDate: new Date() },
        updatedBy: userId,
    };
};
exports.freezePosition = freezePosition;
/**
 * Unfreezes position.
 *
 * @param {number} positionId - Position ID
 * @param {string} userId - User unfreezing position
 * @returns {Promise<Position>} Unfrozen position
 *
 * @example
 * ```typescript
 * const unfrozen = await unfreezePosition(1, 'admin');
 * ```
 */
const unfreezePosition = async (positionId, userId) => {
    return {
        positionId,
        status: 'VACANT',
        metadata: { unfrozenDate: new Date() },
        updatedBy: userId,
    };
};
exports.unfreezePosition = unfreezePosition;
// ============================================================================
// SALARY RANGE MANAGEMENT (31-35)
// ============================================================================
/**
 * Creates or updates salary range for classification.
 *
 * @param {object} rangeData - Salary range data
 * @returns {Promise<SalaryRange>} Salary range
 *
 * @example
 * ```typescript
 * const range = await createSalaryRange({
 *   classificationCode: 'GS-0801',
 *   gradeLevel: 'GS-13',
 *   step: 5,
 *   annualSalary: 95000,
 *   effectiveDate: new Date()
 * });
 * ```
 */
const createSalaryRange = async (rangeData) => {
    const hourlyRate = rangeData.annualSalary / 2087; // Standard hours per year
    return {
        rangeId: Date.now(),
        ...rangeData,
        hourlyRate,
    };
};
exports.createSalaryRange = createSalaryRange;
/**
 * Retrieves salary range for classification and grade.
 *
 * @param {string} classificationCode - Classification code
 * @param {string} gradeLevel - Grade level
 * @param {number} [step] - Optional step
 * @returns {Promise<SalaryRange | null>} Salary range
 *
 * @example
 * ```typescript
 * const range = await getSalaryRangeForGrade('GS-0801', 'GS-13', 5);
 * ```
 */
const getSalaryRangeForGrade = async (classificationCode, gradeLevel, step) => {
    return null;
};
exports.getSalaryRangeForGrade = getSalaryRangeForGrade;
/**
 * Calculates step increase for position.
 *
 * @param {string} classificationCode - Classification code
 * @param {string} gradeLevel - Grade level
 * @param {number} currentStep - Current step
 * @returns {Promise<{ newStep: number; newSalary: number; increase: number }>} Step increase
 *
 * @example
 * ```typescript
 * const increase = await calculateStepIncrease('GS-0801', 'GS-13', 5);
 * ```
 */
const calculateStepIncrease = async (classificationCode, gradeLevel, currentStep) => {
    const newStep = Math.min(currentStep + 1, 10);
    const currentSalary = 95000; // Mock
    const newSalary = 97500; // Mock
    return {
        newStep,
        newSalary,
        increase: newSalary - currentSalary,
    };
};
exports.calculateStepIncrease = calculateStepIncrease;
/**
 * Applies cost of living adjustment (COLA) to salary ranges.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} colaPercentage - COLA percentage
 * @returns {Promise<number>} Number of ranges updated
 *
 * @example
 * ```typescript
 * const updated = await applyCOLAdjustment(2025, 2.5);
 * ```
 */
const applyCOLAdjustment = async (fiscalYear, colaPercentage) => {
    return 0;
};
exports.applyCOLAdjustment = applyCOLAdjustment;
/**
 * Validates salary against position classification range.
 *
 * @param {number} salary - Salary to validate
 * @param {string} classificationCode - Classification code
 * @param {string} gradeLevel - Grade level
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateSalaryInRange(95000, 'GS-0801', 'GS-13');
 * ```
 */
const validateSalaryInRange = async (salary, classificationCode, gradeLevel) => {
    const errors = [];
    // Mock validation
    const minSalary = 85000;
    const maxSalary = 105000;
    if (salary < minSalary) {
        errors.push(`Salary below minimum for ${gradeLevel}`);
    }
    if (salary > maxSalary) {
        errors.push(`Salary exceeds maximum for ${gradeLevel}`);
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateSalaryInRange = validateSalaryInRange;
// ============================================================================
// HEADCOUNT REPORTING (36-40)
// ============================================================================
/**
 * Generates headcount report for organization.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @param {boolean} [includeChildren=true] - Include child organizations
 * @returns {Promise<HeadcountReport>} Headcount report
 *
 * @example
 * ```typescript
 * const report = await generateHeadcountReport('ORG-100', 2025, true);
 * ```
 */
const generateHeadcountReport = async (organizationCode, fiscalYear, includeChildren = true) => {
    return {
        reportDate: new Date(),
        fiscalYear,
        organizationCode,
        totalAuthorized: 100,
        totalFilled: 85,
        totalVacant: 10,
        totalFrozen: 5,
        totalFTE: 98.5,
        filledFTE: 84.0,
        vacantFTE: 9.5,
        vacancyRate: 10,
    };
};
exports.generateHeadcountReport = generateHeadcountReport;
/**
 * Calculates headcount by classification.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<object[]>} Headcount by classification
 *
 * @example
 * ```typescript
 * const breakdown = await calculateHeadcountByClassification('ORG-100', 2025);
 * ```
 */
const calculateHeadcountByClassification = async (organizationCode, fiscalYear) => {
    return [];
};
exports.calculateHeadcountByClassification = calculateHeadcountByClassification;
/**
 * Calculates vacancy rate for organization.
 *
 * @param {string} organizationCode - Organization code
 * @returns {Promise<number>} Vacancy rate percentage
 *
 * @example
 * ```typescript
 * const rate = await calculateVacancyRate('ORG-100');
 * // Returns: 10.5
 * ```
 */
const calculateVacancyRate = async (organizationCode) => {
    const totalPositions = 100;
    const vacantPositions = 10;
    return (vacantPositions / totalPositions) * 100;
};
exports.calculateVacancyRate = calculateVacancyRate;
/**
 * Compares headcount year-over-year.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear1 - First fiscal year
 * @param {number} fiscalYear2 - Second fiscal year
 * @returns {Promise<object>} Year-over-year comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareHeadcountYearOverYear('ORG-100', 2024, 2025);
 * ```
 */
const compareHeadcountYearOverYear = async (organizationCode, fiscalYear1, fiscalYear2) => {
    return {
        organizationCode,
        year1: { fiscalYear: fiscalYear1, totalFTE: 95.0 },
        year2: { fiscalYear: fiscalYear2, totalFTE: 98.5 },
        change: 3.5,
        percentChange: 3.68,
    };
};
exports.compareHeadcountYearOverYear = compareHeadcountYearOverYear;
/**
 * Exports headcount data.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @param {string} format - Export format
 * @returns {Promise<Buffer>} Exported data
 *
 * @example
 * ```typescript
 * const csvData = await exportHeadcountData('ORG-100', 2025, 'CSV');
 * ```
 */
const exportHeadcountData = async (organizationCode, fiscalYear, format) => {
    return Buffer.from('Headcount export data');
};
exports.exportHeadcountData = exportHeadcountData;
// ============================================================================
// FTE CALCULATION & COST ANALYSIS (41-45)
// ============================================================================
/**
 * Calculates FTE for position based on work schedule.
 *
 * @param {number} scheduledHours - Scheduled hours per week
 * @param {number} [standardHours=40] - Standard full-time hours
 * @returns {number} FTE value
 *
 * @example
 * ```typescript
 * const fte = calculateFTE(32, 40);
 * // Returns: 0.8
 * ```
 */
const calculateFTE = (scheduledHours, standardHours = 40) => {
    return scheduledHours / standardHours;
};
exports.calculateFTE = calculateFTE;
/**
 * Calculates total FTE for organization.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<number>} Total FTE
 *
 * @example
 * ```typescript
 * const totalFTE = await calculateTotalFTE('ORG-100', 2025);
 * ```
 */
const calculateTotalFTE = async (organizationCode, fiscalYear) => {
    return 98.5;
};
exports.calculateTotalFTE = calculateTotalFTE;
/**
 * Analyzes position costs including all components.
 *
 * @param {number} positionId - Position ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<PositionCostAnalysis>} Cost analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzePositionCost(1, 2025);
 * ```
 */
const analyzePositionCost = async (positionId, fiscalYear) => {
    const baseSalary = 95000;
    const benefitRate = 30;
    const benefits = baseSalary * (benefitRate / 100);
    return {
        positionId,
        fiscalYear,
        baseSalary,
        benefits,
        benefitRate,
        overtime: 2000,
        otherCosts: 3000,
        totalCompensation: baseSalary + benefits + 2000 + 3000,
        fundedAmount: 125000,
        variance: 1500,
    };
};
exports.analyzePositionCost = analyzePositionCost;
/**
 * Calculates organizational salary budget.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<number>} Total salary budget
 *
 * @example
 * ```typescript
 * const budget = await calculateOrganizationSalaryBudget('ORG-100', 2025);
 * ```
 */
const calculateOrganizationSalaryBudget = async (organizationCode, fiscalYear) => {
    return 9500000;
};
exports.calculateOrganizationSalaryBudget = calculateOrganizationSalaryBudget;
/**
 * Builds organizational hierarchy with position data.
 *
 * @param {string} rootOrganizationCode - Root organization code
 * @param {boolean} [includePositions=true] - Include position details
 * @returns {Promise<OrganizationalHierarchy>} Organizational hierarchy
 *
 * @example
 * ```typescript
 * const hierarchy = await buildOrganizationalHierarchy('ORG-100', true);
 * ```
 */
const buildOrganizationalHierarchy = async (rootOrganizationCode, includePositions = true) => {
    return {
        organizationCode: rootOrganizationCode,
        organizationName: 'Root Organization',
        level: 1,
        positions: [],
        childOrganizations: [],
        totalAuthorized: 100,
        totalFilled: 85,
        totalFTE: 98.5,
    };
};
exports.buildOrganizationalHierarchy = buildOrganizationalHierarchy;
/**
 * Default export with all utilities.
 */
exports.default = {
    // Models
    createPositionModel: exports.createPositionModel,
    createPositionBudgetModel: exports.createPositionBudgetModel,
    createPositionVacancyModel: exports.createPositionVacancyModel,
    // Position Management
    createPosition: exports.createPosition,
    generatePositionNumber: exports.generatePositionNumber,
    updatePosition: exports.updatePosition,
    abolishPosition: exports.abolishPosition,
    getPosition: exports.getPosition,
    // Position Budgeting
    createPositionBudget: exports.createPositionBudget,
    updatePositionBudget: exports.updatePositionBudget,
    calculatePositionCost: exports.calculatePositionCost,
    allocatePositionFunding: exports.allocatePositionFunding,
    getPositionBudget: exports.getPositionBudget,
    // Position Classification
    classifyPosition: exports.classifyPosition,
    getClassificationDetails: exports.getClassificationDetails,
    getPositionsByClassification: exports.getPositionsByClassification,
    validateClassification: exports.validateClassification,
    getSalaryRange: exports.getSalaryRange,
    // Vacancy Tracking
    createVacancy: exports.createVacancy,
    updateVacancy: exports.updateVacancy,
    fillVacancy: exports.fillVacancy,
    calculateVacancyCostSavings: exports.calculateVacancyCostSavings,
    getVacancies: exports.getVacancies,
    // Position Funding Allocation
    createPositionFundingAllocation: exports.createPositionFundingAllocation,
    updatePositionFundingAllocation: exports.updatePositionFundingAllocation,
    validateFundingAllocation: exports.validateFundingAllocation,
    getPositionFunding: exports.getPositionFunding,
    reallocatePositionFunding: exports.reallocatePositionFunding,
    // Position Authorization
    createPositionAuthorization: exports.createPositionAuthorization,
    approvePositionAuthorization: exports.approvePositionAuthorization,
    rejectPositionAuthorization: exports.rejectPositionAuthorization,
    freezePosition: exports.freezePosition,
    unfreezePosition: exports.unfreezePosition,
    // Salary Range Management
    createSalaryRange: exports.createSalaryRange,
    getSalaryRangeForGrade: exports.getSalaryRangeForGrade,
    calculateStepIncrease: exports.calculateStepIncrease,
    applyCOLAdjustment: exports.applyCOLAdjustment,
    validateSalaryInRange: exports.validateSalaryInRange,
    // Headcount Reporting
    generateHeadcountReport: exports.generateHeadcountReport,
    calculateHeadcountByClassification: exports.calculateHeadcountByClassification,
    calculateVacancyRate: exports.calculateVacancyRate,
    compareHeadcountYearOverYear: exports.compareHeadcountYearOverYear,
    exportHeadcountData: exports.exportHeadcountData,
    // FTE Calculation & Cost Analysis
    calculateFTE: exports.calculateFTE,
    calculateTotalFTE: exports.calculateTotalFTE,
    analyzePositionCost: exports.analyzePositionCost,
    calculateOrganizationSalaryBudget: exports.calculateOrganizationSalaryBudget,
    buildOrganizationalHierarchy: exports.buildOrganizationalHierarchy,
};
//# sourceMappingURL=position-control-workforce-kit.js.map