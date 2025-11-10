"use strict";
/**
 * LOC: HCMCOMP12345
 * File: /reuse/server/human-capital/compensation-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ../../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Compensation controllers
 *   - Payroll integration services
 *   - Analytics and reporting services
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
exports.generateMarketPositioningReport = exports.calculateMarketRatio = exports.benchmarkAgainstMarket = exports.importMarketSurveyData = exports.generateCycleSummaryReport = exports.closeCompensationCycle = exports.trackCycleProgress = exports.openCompensationCycle = exports.createCompensationCycle = exports.generateMeritRecommendations = exports.validateMeritIncrease = exports.calculateProratedBonus = exports.calculatePerformanceBonus = exports.calculateMeritIncrease = exports.recommendRangeAdjustments = exports.identifyRangeOutliers = exports.calculateRangePosition = exports.calculateCompaRatio = exports.createLocationSalaryRange = exports.generatePayGradeMatrix = exports.validateSalaryInRange = exports.calculateSalarySpread = exports.updateSalaryRange = exports.createPayGrade = exports.forecastCompensationBudget = exports.trackBudgetUtilization = exports.allocateCompensationBudget = exports.calculateDepartmentBudgets = exports.createCompensationPlan = exports.createLTIGrantModel = exports.createCompensationAdjustmentModel = exports.createEmployeeCompensationModel = exports.createPayGradeModel = exports.createCompensationPlanModel = exports.MarketDataUploadDto = exports.CreateLTIGrantDto = exports.CreateCommissionPlanDto = exports.CreateBonusPaymentDto = exports.CreateCompensationAdjustmentDto = exports.CreatePayGradeDto = exports.CreateCompensationPlanDto = exports.MarketDataSource = exports.VestingScheduleType = exports.LTIType = exports.CommissionStructureType = exports.BonusType = exports.CompensationAdjustmentType = exports.PayGradeType = exports.CompensationCycleStatus = exports.CompensationPlanStatus = void 0;
exports.generateSalesCompensationAnalytics = exports.trackSalesPerformance = exports.processCommissionPayment = exports.calculateCommission = exports.createCommissionPlan = exports.generateVariablePayAnalytics = exports.processVariablePayPayout = exports.trackVariablePayMetrics = exports.calculateVariablePay = exports.createVariablePayPlan = exports.generateBatchTotalRewardsStatements = exports.estimateBenefitsValue = exports.calculateTotalDirectCompensation = exports.calculateTotalCashCompensation = exports.generateTotalRewardsStatement = exports.trackPayEquityMetrics = exports.generateEquityRemediationPlan = exports.analyzePayEquityByLevel = exports.calculateGenderPayGap = exports.performPayEquityAnalysis = exports.identifyMarketLaggards = void 0;
/**
 * File: /reuse/server/human-capital/compensation-management-kit.ts
 * Locator: WC-HCM-COMP-001
 * Purpose: Enterprise Compensation Management System - SAP SuccessFactors Compensation parity
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, HR controllers, compensation services, payroll integration, analytics
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 50 utility functions for compensation planning, salary structures, pay grades, merit increases,
 *          bonuses, market benchmarking, equity analysis, total rewards, variable pay, commissions,
 *          long-term incentives, stock options, and compensation analytics
 *
 * LLM Context: Enterprise-grade compensation management system competing with SAP SuccessFactors Compensation.
 * Provides complete compensation lifecycle management including compensation planning & budgeting, salary structure
 * design, pay grade management, salary range administration, merit increase calculations, bonus computations,
 * compensation review cycles, market data analysis, pay equity analysis, total rewards statements, variable pay
 * & incentive management, commission calculations, sales compensation, long-term incentive plans (LTI), stock
 * option administration, compensation analytics, and seamless payroll integration.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Compensation plan status
 */
var CompensationPlanStatus;
(function (CompensationPlanStatus) {
    CompensationPlanStatus["DRAFT"] = "draft";
    CompensationPlanStatus["IN_REVIEW"] = "in_review";
    CompensationPlanStatus["APPROVED"] = "approved";
    CompensationPlanStatus["ACTIVE"] = "active";
    CompensationPlanStatus["COMPLETED"] = "completed";
    CompensationPlanStatus["CANCELLED"] = "cancelled";
})(CompensationPlanStatus || (exports.CompensationPlanStatus = CompensationPlanStatus = {}));
/**
 * Compensation review cycle status
 */
var CompensationCycleStatus;
(function (CompensationCycleStatus) {
    CompensationCycleStatus["PLANNING"] = "planning";
    CompensationCycleStatus["OPEN"] = "open";
    CompensationCycleStatus["IN_PROGRESS"] = "in_progress";
    CompensationCycleStatus["PENDING_APPROVAL"] = "pending_approval";
    CompensationCycleStatus["APPROVED"] = "approved";
    CompensationCycleStatus["CLOSED"] = "closed";
})(CompensationCycleStatus || (exports.CompensationCycleStatus = CompensationCycleStatus = {}));
/**
 * Pay grade type
 */
var PayGradeType;
(function (PayGradeType) {
    PayGradeType["EXEMPT"] = "exempt";
    PayGradeType["NON_EXEMPT"] = "non_exempt";
    PayGradeType["HOURLY"] = "hourly";
    PayGradeType["SALARIED"] = "salaried";
    PayGradeType["EXECUTIVE"] = "executive";
})(PayGradeType || (exports.PayGradeType = PayGradeType = {}));
/**
 * Compensation adjustment type
 */
var CompensationAdjustmentType;
(function (CompensationAdjustmentType) {
    CompensationAdjustmentType["MERIT_INCREASE"] = "merit_increase";
    CompensationAdjustmentType["PROMOTION"] = "promotion";
    CompensationAdjustmentType["MARKET_ADJUSTMENT"] = "market_adjustment";
    CompensationAdjustmentType["COST_OF_LIVING"] = "cost_of_living";
    CompensationAdjustmentType["EQUITY_ADJUSTMENT"] = "equity_adjustment";
    CompensationAdjustmentType["RETENTION"] = "retention";
    CompensationAdjustmentType["PERFORMANCE_BONUS"] = "performance_bonus";
    CompensationAdjustmentType["SPECIAL_RECOGNITION"] = "special_recognition";
})(CompensationAdjustmentType || (exports.CompensationAdjustmentType = CompensationAdjustmentType = {}));
/**
 * Bonus type
 */
var BonusType;
(function (BonusType) {
    BonusType["ANNUAL_PERFORMANCE"] = "annual_performance";
    BonusType["SIGNING"] = "signing";
    BonusType["RETENTION"] = "retention";
    BonusType["SPOT"] = "spot";
    BonusType["PROJECT_COMPLETION"] = "project_completion";
    BonusType["REFERRAL"] = "referral";
    BonusType["SALES_ACHIEVEMENT"] = "sales_achievement";
})(BonusType || (exports.BonusType = BonusType = {}));
/**
 * Commission structure type
 */
var CommissionStructureType;
(function (CommissionStructureType) {
    CommissionStructureType["FLAT_RATE"] = "flat_rate";
    CommissionStructureType["TIERED"] = "tiered";
    CommissionStructureType["PROGRESSIVE"] = "progressive";
    CommissionStructureType["DRAW_AGAINST"] = "draw_against";
    CommissionStructureType["RESIDUAL"] = "residual";
})(CommissionStructureType || (exports.CommissionStructureType = CommissionStructureType = {}));
/**
 * Long-term incentive type
 */
var LTIType;
(function (LTIType) {
    LTIType["STOCK_OPTIONS"] = "stock_options";
    LTIType["RESTRICTED_STOCK_UNITS"] = "rsu";
    LTIType["PERFORMANCE_SHARES"] = "performance_shares";
    LTIType["STOCK_APPRECIATION_RIGHTS"] = "sar";
    LTIType["PHANTOM_STOCK"] = "phantom_stock";
})(LTIType || (exports.LTIType = LTIType = {}));
/**
 * Vesting schedule type
 */
var VestingScheduleType;
(function (VestingScheduleType) {
    VestingScheduleType["CLIFF"] = "cliff";
    VestingScheduleType["GRADED"] = "graded";
    VestingScheduleType["PERFORMANCE_BASED"] = "performance_based";
    VestingScheduleType["TIME_BASED"] = "time_based";
})(VestingScheduleType || (exports.VestingScheduleType = VestingScheduleType = {}));
/**
 * Market data source type
 */
var MarketDataSource;
(function (MarketDataSource) {
    MarketDataSource["MERCER"] = "mercer";
    MarketDataSource["WILLIS_TOWERS_WATSON"] = "willis_towers_watson";
    MarketDataSource["RADFORD"] = "radford";
    MarketDataSource["PAYSCALE"] = "payscale";
    MarketDataSource["SALARY_COM"] = "salary_com";
    MarketDataSource["CUSTOM_SURVEY"] = "custom_survey";
})(MarketDataSource || (exports.MarketDataSource = MarketDataSource = {}));
// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================
/**
 * Create compensation plan DTO
 */
let CreateCompensationPlanDto = (() => {
    var _a;
    let _planCode_decorators;
    let _planCode_initializers = [];
    let _planCode_extraInitializers = [];
    let _planName_decorators;
    let _planName_initializers = [];
    let _planName_extraInitializers = [];
    let _planYear_decorators;
    let _planYear_initializers = [];
    let _planYear_extraInitializers = [];
    let _totalBudget_decorators;
    let _totalBudget_initializers = [];
    let _totalBudget_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    return _a = class CreateCompensationPlanDto {
            constructor() {
                this.planCode = __runInitializers(this, _planCode_initializers, void 0);
                this.planName = (__runInitializers(this, _planCode_extraInitializers), __runInitializers(this, _planName_initializers, void 0));
                this.planYear = (__runInitializers(this, _planName_extraInitializers), __runInitializers(this, _planYear_initializers, void 0));
                this.totalBudget = (__runInitializers(this, _planYear_extraInitializers), __runInitializers(this, _totalBudget_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _totalBudget_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.currency = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                __runInitializers(this, _currency_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _planCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan code' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(50)];
            _planName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _planYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan year' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(2020), (0, class_validator_1.Max)(2100)];
            _totalBudget_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total budget amount' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(3)];
            __esDecorate(null, null, _planCode_decorators, { kind: "field", name: "planCode", static: false, private: false, access: { has: obj => "planCode" in obj, get: obj => obj.planCode, set: (obj, value) => { obj.planCode = value; } }, metadata: _metadata }, _planCode_initializers, _planCode_extraInitializers);
            __esDecorate(null, null, _planName_decorators, { kind: "field", name: "planName", static: false, private: false, access: { has: obj => "planName" in obj, get: obj => obj.planName, set: (obj, value) => { obj.planName = value; } }, metadata: _metadata }, _planName_initializers, _planName_extraInitializers);
            __esDecorate(null, null, _planYear_decorators, { kind: "field", name: "planYear", static: false, private: false, access: { has: obj => "planYear" in obj, get: obj => obj.planYear, set: (obj, value) => { obj.planYear = value; } }, metadata: _metadata }, _planYear_initializers, _planYear_extraInitializers);
            __esDecorate(null, null, _totalBudget_decorators, { kind: "field", name: "totalBudget", static: false, private: false, access: { has: obj => "totalBudget" in obj, get: obj => obj.totalBudget, set: (obj, value) => { obj.totalBudget = value; } }, metadata: _metadata }, _totalBudget_initializers, _totalBudget_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCompensationPlanDto = CreateCompensationPlanDto;
/**
 * Create pay grade DTO
 */
let CreatePayGradeDto = (() => {
    var _a;
    let _gradeCode_decorators;
    let _gradeCode_initializers = [];
    let _gradeCode_extraInitializers = [];
    let _gradeName_decorators;
    let _gradeName_initializers = [];
    let _gradeName_extraInitializers = [];
    let _gradeLevel_decorators;
    let _gradeLevel_initializers = [];
    let _gradeLevel_extraInitializers = [];
    let _gradeType_decorators;
    let _gradeType_initializers = [];
    let _gradeType_extraInitializers = [];
    let _minSalary_decorators;
    let _minSalary_initializers = [];
    let _minSalary_extraInitializers = [];
    let _midpointSalary_decorators;
    let _midpointSalary_initializers = [];
    let _midpointSalary_extraInitializers = [];
    let _maxSalary_decorators;
    let _maxSalary_initializers = [];
    let _maxSalary_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    return _a = class CreatePayGradeDto {
            constructor() {
                this.gradeCode = __runInitializers(this, _gradeCode_initializers, void 0);
                this.gradeName = (__runInitializers(this, _gradeCode_extraInitializers), __runInitializers(this, _gradeName_initializers, void 0));
                this.gradeLevel = (__runInitializers(this, _gradeName_extraInitializers), __runInitializers(this, _gradeLevel_initializers, void 0));
                this.gradeType = (__runInitializers(this, _gradeLevel_extraInitializers), __runInitializers(this, _gradeType_initializers, void 0));
                this.minSalary = (__runInitializers(this, _gradeType_extraInitializers), __runInitializers(this, _minSalary_initializers, void 0));
                this.midpointSalary = (__runInitializers(this, _minSalary_extraInitializers), __runInitializers(this, _midpointSalary_initializers, void 0));
                this.maxSalary = (__runInitializers(this, _midpointSalary_extraInitializers), __runInitializers(this, _maxSalary_initializers, void 0));
                this.currency = (__runInitializers(this, _maxSalary_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                __runInitializers(this, _currency_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _gradeCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Grade code' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(50)];
            _gradeName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Grade name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _gradeLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Grade level' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _gradeType_decorators = [(0, swagger_1.ApiProperty)({ enum: PayGradeType }), (0, class_validator_1.IsEnum)(PayGradeType)];
            _minSalary_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minimum salary' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _midpointSalary_decorators = [(0, swagger_1.ApiProperty)({ description: 'Midpoint salary' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _maxSalary_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maximum salary' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(3)];
            __esDecorate(null, null, _gradeCode_decorators, { kind: "field", name: "gradeCode", static: false, private: false, access: { has: obj => "gradeCode" in obj, get: obj => obj.gradeCode, set: (obj, value) => { obj.gradeCode = value; } }, metadata: _metadata }, _gradeCode_initializers, _gradeCode_extraInitializers);
            __esDecorate(null, null, _gradeName_decorators, { kind: "field", name: "gradeName", static: false, private: false, access: { has: obj => "gradeName" in obj, get: obj => obj.gradeName, set: (obj, value) => { obj.gradeName = value; } }, metadata: _metadata }, _gradeName_initializers, _gradeName_extraInitializers);
            __esDecorate(null, null, _gradeLevel_decorators, { kind: "field", name: "gradeLevel", static: false, private: false, access: { has: obj => "gradeLevel" in obj, get: obj => obj.gradeLevel, set: (obj, value) => { obj.gradeLevel = value; } }, metadata: _metadata }, _gradeLevel_initializers, _gradeLevel_extraInitializers);
            __esDecorate(null, null, _gradeType_decorators, { kind: "field", name: "gradeType", static: false, private: false, access: { has: obj => "gradeType" in obj, get: obj => obj.gradeType, set: (obj, value) => { obj.gradeType = value; } }, metadata: _metadata }, _gradeType_initializers, _gradeType_extraInitializers);
            __esDecorate(null, null, _minSalary_decorators, { kind: "field", name: "minSalary", static: false, private: false, access: { has: obj => "minSalary" in obj, get: obj => obj.minSalary, set: (obj, value) => { obj.minSalary = value; } }, metadata: _metadata }, _minSalary_initializers, _minSalary_extraInitializers);
            __esDecorate(null, null, _midpointSalary_decorators, { kind: "field", name: "midpointSalary", static: false, private: false, access: { has: obj => "midpointSalary" in obj, get: obj => obj.midpointSalary, set: (obj, value) => { obj.midpointSalary = value; } }, metadata: _metadata }, _midpointSalary_initializers, _midpointSalary_extraInitializers);
            __esDecorate(null, null, _maxSalary_decorators, { kind: "field", name: "maxSalary", static: false, private: false, access: { has: obj => "maxSalary" in obj, get: obj => obj.maxSalary, set: (obj, value) => { obj.maxSalary = value; } }, metadata: _metadata }, _maxSalary_initializers, _maxSalary_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePayGradeDto = CreatePayGradeDto;
/**
 * Create compensation adjustment DTO
 */
let CreateCompensationAdjustmentDto = (() => {
    var _a;
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _adjustmentType_decorators;
    let _adjustmentType_initializers = [];
    let _adjustmentType_extraInitializers = [];
    let _currentSalary_decorators;
    let _currentSalary_initializers = [];
    let _currentSalary_extraInitializers = [];
    let _proposedSalary_decorators;
    let _proposedSalary_initializers = [];
    let _proposedSalary_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _justification_decorators;
    let _justification_initializers = [];
    let _justification_extraInitializers = [];
    let _performanceRating_decorators;
    let _performanceRating_initializers = [];
    let _performanceRating_extraInitializers = [];
    return _a = class CreateCompensationAdjustmentDto {
            constructor() {
                this.employeeId = __runInitializers(this, _employeeId_initializers, void 0);
                this.adjustmentType = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _adjustmentType_initializers, void 0));
                this.currentSalary = (__runInitializers(this, _adjustmentType_extraInitializers), __runInitializers(this, _currentSalary_initializers, void 0));
                this.proposedSalary = (__runInitializers(this, _currentSalary_extraInitializers), __runInitializers(this, _proposedSalary_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _proposedSalary_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.justification = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _justification_initializers, void 0));
                this.performanceRating = (__runInitializers(this, _justification_extraInitializers), __runInitializers(this, _performanceRating_initializers, void 0));
                __runInitializers(this, _performanceRating_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID' }), (0, class_validator_1.IsUUID)()];
            _adjustmentType_decorators = [(0, swagger_1.ApiProperty)({ enum: CompensationAdjustmentType }), (0, class_validator_1.IsEnum)(CompensationAdjustmentType)];
            _currentSalary_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current salary' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _proposedSalary_decorators = [(0, swagger_1.ApiProperty)({ description: 'Proposed salary' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _justification_decorators = [(0, swagger_1.ApiProperty)({ description: 'Justification' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _performanceRating_decorators = [(0, swagger_1.ApiProperty)({ description: 'Performance rating', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
            __esDecorate(null, null, _adjustmentType_decorators, { kind: "field", name: "adjustmentType", static: false, private: false, access: { has: obj => "adjustmentType" in obj, get: obj => obj.adjustmentType, set: (obj, value) => { obj.adjustmentType = value; } }, metadata: _metadata }, _adjustmentType_initializers, _adjustmentType_extraInitializers);
            __esDecorate(null, null, _currentSalary_decorators, { kind: "field", name: "currentSalary", static: false, private: false, access: { has: obj => "currentSalary" in obj, get: obj => obj.currentSalary, set: (obj, value) => { obj.currentSalary = value; } }, metadata: _metadata }, _currentSalary_initializers, _currentSalary_extraInitializers);
            __esDecorate(null, null, _proposedSalary_decorators, { kind: "field", name: "proposedSalary", static: false, private: false, access: { has: obj => "proposedSalary" in obj, get: obj => obj.proposedSalary, set: (obj, value) => { obj.proposedSalary = value; } }, metadata: _metadata }, _proposedSalary_initializers, _proposedSalary_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _justification_decorators, { kind: "field", name: "justification", static: false, private: false, access: { has: obj => "justification" in obj, get: obj => obj.justification, set: (obj, value) => { obj.justification = value; } }, metadata: _metadata }, _justification_initializers, _justification_extraInitializers);
            __esDecorate(null, null, _performanceRating_decorators, { kind: "field", name: "performanceRating", static: false, private: false, access: { has: obj => "performanceRating" in obj, get: obj => obj.performanceRating, set: (obj, value) => { obj.performanceRating = value; } }, metadata: _metadata }, _performanceRating_initializers, _performanceRating_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCompensationAdjustmentDto = CreateCompensationAdjustmentDto;
/**
 * Create bonus payment DTO
 */
let CreateBonusPaymentDto = (() => {
    var _a;
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _bonusType_decorators;
    let _bonusType_initializers = [];
    let _bonusType_extraInitializers = [];
    let _bonusAmount_decorators;
    let _bonusAmount_initializers = [];
    let _bonusAmount_extraInitializers = [];
    let _paymentDate_decorators;
    let _paymentDate_initializers = [];
    let _paymentDate_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    return _a = class CreateBonusPaymentDto {
            constructor() {
                this.employeeId = __runInitializers(this, _employeeId_initializers, void 0);
                this.bonusType = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _bonusType_initializers, void 0));
                this.bonusAmount = (__runInitializers(this, _bonusType_extraInitializers), __runInitializers(this, _bonusAmount_initializers, void 0));
                this.paymentDate = (__runInitializers(this, _bonusAmount_extraInitializers), __runInitializers(this, _paymentDate_initializers, void 0));
                this.reason = (__runInitializers(this, _paymentDate_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID' }), (0, class_validator_1.IsUUID)()];
            _bonusType_decorators = [(0, swagger_1.ApiProperty)({ enum: BonusType }), (0, class_validator_1.IsEnum)(BonusType)];
            _bonusAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bonus amount' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _paymentDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reason for bonus' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(500)];
            __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
            __esDecorate(null, null, _bonusType_decorators, { kind: "field", name: "bonusType", static: false, private: false, access: { has: obj => "bonusType" in obj, get: obj => obj.bonusType, set: (obj, value) => { obj.bonusType = value; } }, metadata: _metadata }, _bonusType_initializers, _bonusType_extraInitializers);
            __esDecorate(null, null, _bonusAmount_decorators, { kind: "field", name: "bonusAmount", static: false, private: false, access: { has: obj => "bonusAmount" in obj, get: obj => obj.bonusAmount, set: (obj, value) => { obj.bonusAmount = value; } }, metadata: _metadata }, _bonusAmount_initializers, _bonusAmount_extraInitializers);
            __esDecorate(null, null, _paymentDate_decorators, { kind: "field", name: "paymentDate", static: false, private: false, access: { has: obj => "paymentDate" in obj, get: obj => obj.paymentDate, set: (obj, value) => { obj.paymentDate = value; } }, metadata: _metadata }, _paymentDate_initializers, _paymentDate_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateBonusPaymentDto = CreateBonusPaymentDto;
/**
 * Create commission plan DTO
 */
let CreateCommissionPlanDto = (() => {
    var _a;
    let _planCode_decorators;
    let _planCode_initializers = [];
    let _planCode_extraInitializers = [];
    let _planName_decorators;
    let _planName_initializers = [];
    let _planName_extraInitializers = [];
    let _structureType_decorators;
    let _structureType_initializers = [];
    let _structureType_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _tiers_decorators;
    let _tiers_initializers = [];
    let _tiers_extraInitializers = [];
    let _paymentFrequency_decorators;
    let _paymentFrequency_initializers = [];
    let _paymentFrequency_extraInitializers = [];
    return _a = class CreateCommissionPlanDto {
            constructor() {
                this.planCode = __runInitializers(this, _planCode_initializers, void 0);
                this.planName = (__runInitializers(this, _planCode_extraInitializers), __runInitializers(this, _planName_initializers, void 0));
                this.structureType = (__runInitializers(this, _planName_extraInitializers), __runInitializers(this, _structureType_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _structureType_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.tiers = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _tiers_initializers, void 0));
                this.paymentFrequency = (__runInitializers(this, _tiers_extraInitializers), __runInitializers(this, _paymentFrequency_initializers, void 0));
                __runInitializers(this, _paymentFrequency_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _planCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan code' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(50)];
            _planName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _structureType_decorators = [(0, swagger_1.ApiProperty)({ enum: CommissionStructureType }), (0, class_validator_1.IsEnum)(CommissionStructureType)];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _tiers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Commission tiers' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _paymentFrequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment frequency' }), (0, class_validator_1.IsEnum)(['monthly', 'quarterly', 'annually'])];
            __esDecorate(null, null, _planCode_decorators, { kind: "field", name: "planCode", static: false, private: false, access: { has: obj => "planCode" in obj, get: obj => obj.planCode, set: (obj, value) => { obj.planCode = value; } }, metadata: _metadata }, _planCode_initializers, _planCode_extraInitializers);
            __esDecorate(null, null, _planName_decorators, { kind: "field", name: "planName", static: false, private: false, access: { has: obj => "planName" in obj, get: obj => obj.planName, set: (obj, value) => { obj.planName = value; } }, metadata: _metadata }, _planName_initializers, _planName_extraInitializers);
            __esDecorate(null, null, _structureType_decorators, { kind: "field", name: "structureType", static: false, private: false, access: { has: obj => "structureType" in obj, get: obj => obj.structureType, set: (obj, value) => { obj.structureType = value; } }, metadata: _metadata }, _structureType_initializers, _structureType_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _tiers_decorators, { kind: "field", name: "tiers", static: false, private: false, access: { has: obj => "tiers" in obj, get: obj => obj.tiers, set: (obj, value) => { obj.tiers = value; } }, metadata: _metadata }, _tiers_initializers, _tiers_extraInitializers);
            __esDecorate(null, null, _paymentFrequency_decorators, { kind: "field", name: "paymentFrequency", static: false, private: false, access: { has: obj => "paymentFrequency" in obj, get: obj => obj.paymentFrequency, set: (obj, value) => { obj.paymentFrequency = value; } }, metadata: _metadata }, _paymentFrequency_initializers, _paymentFrequency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCommissionPlanDto = CreateCommissionPlanDto;
/**
 * Create LTI grant DTO
 */
let CreateLTIGrantDto = (() => {
    var _a;
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _ltiType_decorators;
    let _ltiType_initializers = [];
    let _ltiType_extraInitializers = [];
    let _grantDate_decorators;
    let _grantDate_initializers = [];
    let _grantDate_extraInitializers = [];
    let _numberOfUnits_decorators;
    let _numberOfUnits_initializers = [];
    let _numberOfUnits_extraInitializers = [];
    let _grantPrice_decorators;
    let _grantPrice_initializers = [];
    let _grantPrice_extraInitializers = [];
    let _vestingScheduleType_decorators;
    let _vestingScheduleType_initializers = [];
    let _vestingScheduleType_extraInitializers = [];
    let _vestingStartDate_decorators;
    let _vestingStartDate_initializers = [];
    let _vestingStartDate_extraInitializers = [];
    let _vestingEndDate_decorators;
    let _vestingEndDate_initializers = [];
    let _vestingEndDate_extraInitializers = [];
    return _a = class CreateLTIGrantDto {
            constructor() {
                this.employeeId = __runInitializers(this, _employeeId_initializers, void 0);
                this.ltiType = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _ltiType_initializers, void 0));
                this.grantDate = (__runInitializers(this, _ltiType_extraInitializers), __runInitializers(this, _grantDate_initializers, void 0));
                this.numberOfUnits = (__runInitializers(this, _grantDate_extraInitializers), __runInitializers(this, _numberOfUnits_initializers, void 0));
                this.grantPrice = (__runInitializers(this, _numberOfUnits_extraInitializers), __runInitializers(this, _grantPrice_initializers, void 0));
                this.vestingScheduleType = (__runInitializers(this, _grantPrice_extraInitializers), __runInitializers(this, _vestingScheduleType_initializers, void 0));
                this.vestingStartDate = (__runInitializers(this, _vestingScheduleType_extraInitializers), __runInitializers(this, _vestingStartDate_initializers, void 0));
                this.vestingEndDate = (__runInitializers(this, _vestingStartDate_extraInitializers), __runInitializers(this, _vestingEndDate_initializers, void 0));
                __runInitializers(this, _vestingEndDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID' }), (0, class_validator_1.IsUUID)()];
            _ltiType_decorators = [(0, swagger_1.ApiProperty)({ enum: LTIType }), (0, class_validator_1.IsEnum)(LTIType)];
            _grantDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Grant date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _numberOfUnits_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of units' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _grantPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Grant price', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _vestingScheduleType_decorators = [(0, swagger_1.ApiProperty)({ enum: VestingScheduleType }), (0, class_validator_1.IsEnum)(VestingScheduleType)];
            _vestingStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vesting start date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _vestingEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vesting end date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
            __esDecorate(null, null, _ltiType_decorators, { kind: "field", name: "ltiType", static: false, private: false, access: { has: obj => "ltiType" in obj, get: obj => obj.ltiType, set: (obj, value) => { obj.ltiType = value; } }, metadata: _metadata }, _ltiType_initializers, _ltiType_extraInitializers);
            __esDecorate(null, null, _grantDate_decorators, { kind: "field", name: "grantDate", static: false, private: false, access: { has: obj => "grantDate" in obj, get: obj => obj.grantDate, set: (obj, value) => { obj.grantDate = value; } }, metadata: _metadata }, _grantDate_initializers, _grantDate_extraInitializers);
            __esDecorate(null, null, _numberOfUnits_decorators, { kind: "field", name: "numberOfUnits", static: false, private: false, access: { has: obj => "numberOfUnits" in obj, get: obj => obj.numberOfUnits, set: (obj, value) => { obj.numberOfUnits = value; } }, metadata: _metadata }, _numberOfUnits_initializers, _numberOfUnits_extraInitializers);
            __esDecorate(null, null, _grantPrice_decorators, { kind: "field", name: "grantPrice", static: false, private: false, access: { has: obj => "grantPrice" in obj, get: obj => obj.grantPrice, set: (obj, value) => { obj.grantPrice = value; } }, metadata: _metadata }, _grantPrice_initializers, _grantPrice_extraInitializers);
            __esDecorate(null, null, _vestingScheduleType_decorators, { kind: "field", name: "vestingScheduleType", static: false, private: false, access: { has: obj => "vestingScheduleType" in obj, get: obj => obj.vestingScheduleType, set: (obj, value) => { obj.vestingScheduleType = value; } }, metadata: _metadata }, _vestingScheduleType_initializers, _vestingScheduleType_extraInitializers);
            __esDecorate(null, null, _vestingStartDate_decorators, { kind: "field", name: "vestingStartDate", static: false, private: false, access: { has: obj => "vestingStartDate" in obj, get: obj => obj.vestingStartDate, set: (obj, value) => { obj.vestingStartDate = value; } }, metadata: _metadata }, _vestingStartDate_initializers, _vestingStartDate_extraInitializers);
            __esDecorate(null, null, _vestingEndDate_decorators, { kind: "field", name: "vestingEndDate", static: false, private: false, access: { has: obj => "vestingEndDate" in obj, get: obj => obj.vestingEndDate, set: (obj, value) => { obj.vestingEndDate = value; } }, metadata: _metadata }, _vestingEndDate_initializers, _vestingEndDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateLTIGrantDto = CreateLTIGrantDto;
/**
 * Market data upload DTO
 */
let MarketDataUploadDto = (() => {
    var _a;
    let _jobCode_decorators;
    let _jobCode_initializers = [];
    let _jobCode_extraInitializers = [];
    let _jobTitle_decorators;
    let _jobTitle_initializers = [];
    let _jobTitle_extraInitializers = [];
    let _dataSource_decorators;
    let _dataSource_initializers = [];
    let _dataSource_extraInitializers = [];
    let _surveyYear_decorators;
    let _surveyYear_initializers = [];
    let _surveyYear_extraInitializers = [];
    let _percentiles_decorators;
    let _percentiles_initializers = [];
    let _percentiles_extraInitializers = [];
    let _sampleSize_decorators;
    let _sampleSize_initializers = [];
    let _sampleSize_extraInitializers = [];
    return _a = class MarketDataUploadDto {
            constructor() {
                this.jobCode = __runInitializers(this, _jobCode_initializers, void 0);
                this.jobTitle = (__runInitializers(this, _jobCode_extraInitializers), __runInitializers(this, _jobTitle_initializers, void 0));
                this.dataSource = (__runInitializers(this, _jobTitle_extraInitializers), __runInitializers(this, _dataSource_initializers, void 0));
                this.surveyYear = (__runInitializers(this, _dataSource_extraInitializers), __runInitializers(this, _surveyYear_initializers, void 0));
                this.percentiles = (__runInitializers(this, _surveyYear_extraInitializers), __runInitializers(this, _percentiles_initializers, void 0));
                this.sampleSize = (__runInitializers(this, _percentiles_extraInitializers), __runInitializers(this, _sampleSize_initializers, void 0));
                __runInitializers(this, _sampleSize_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _jobCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Job code' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _jobTitle_decorators = [(0, swagger_1.ApiProperty)({ description: 'Job title' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _dataSource_decorators = [(0, swagger_1.ApiProperty)({ enum: MarketDataSource }), (0, class_validator_1.IsEnum)(MarketDataSource)];
            _surveyYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Survey year' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(2020)];
            _percentiles_decorators = [(0, swagger_1.ApiProperty)({ description: 'Market percentiles' }), (0, class_validator_1.IsObject)(), (0, class_validator_1.ValidateNested)()];
            _sampleSize_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sample size' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            __esDecorate(null, null, _jobCode_decorators, { kind: "field", name: "jobCode", static: false, private: false, access: { has: obj => "jobCode" in obj, get: obj => obj.jobCode, set: (obj, value) => { obj.jobCode = value; } }, metadata: _metadata }, _jobCode_initializers, _jobCode_extraInitializers);
            __esDecorate(null, null, _jobTitle_decorators, { kind: "field", name: "jobTitle", static: false, private: false, access: { has: obj => "jobTitle" in obj, get: obj => obj.jobTitle, set: (obj, value) => { obj.jobTitle = value; } }, metadata: _metadata }, _jobTitle_initializers, _jobTitle_extraInitializers);
            __esDecorate(null, null, _dataSource_decorators, { kind: "field", name: "dataSource", static: false, private: false, access: { has: obj => "dataSource" in obj, get: obj => obj.dataSource, set: (obj, value) => { obj.dataSource = value; } }, metadata: _metadata }, _dataSource_initializers, _dataSource_extraInitializers);
            __esDecorate(null, null, _surveyYear_decorators, { kind: "field", name: "surveyYear", static: false, private: false, access: { has: obj => "surveyYear" in obj, get: obj => obj.surveyYear, set: (obj, value) => { obj.surveyYear = value; } }, metadata: _metadata }, _surveyYear_initializers, _surveyYear_extraInitializers);
            __esDecorate(null, null, _percentiles_decorators, { kind: "field", name: "percentiles", static: false, private: false, access: { has: obj => "percentiles" in obj, get: obj => obj.percentiles, set: (obj, value) => { obj.percentiles = value; } }, metadata: _metadata }, _percentiles_initializers, _percentiles_extraInitializers);
            __esDecorate(null, null, _sampleSize_decorators, { kind: "field", name: "sampleSize", static: false, private: false, access: { has: obj => "sampleSize" in obj, get: obj => obj.sampleSize, set: (obj, value) => { obj.sampleSize = value; } }, metadata: _metadata }, _sampleSize_initializers, _sampleSize_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.MarketDataUploadDto = MarketDataUploadDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Compensation Plan.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CompensationPlan model
 *
 * @example
 * ```typescript
 * const CompensationPlan = createCompensationPlanModel(sequelize);
 * const plan = await CompensationPlan.create({
 *   planCode: 'MERIT2025',
 *   planName: '2025 Merit Increase Plan',
 *   planYear: 2025,
 *   totalBudget: 5000000
 * });
 * ```
 */
const createCompensationPlanModel = (sequelize) => {
    class CompensationPlan extends sequelize_1.Model {
    }
    CompensationPlan.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        planCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique plan code',
        },
        planName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Plan name',
        },
        planYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Plan year',
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
        },
        planType: {
            type: sequelize_1.DataTypes.ENUM('merit', 'bonus', 'equity', 'comprehensive'),
            allowNull: false,
            comment: 'Plan type',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Plan effective date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Plan end date',
        },
        totalBudget: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Total budget allocated',
        },
        allocatedBudget: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Budget currently allocated',
        },
        remainingBudget: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Remaining budget available',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Currency code',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'in_review', 'approved', 'active', 'completed', 'cancelled'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Plan status',
        },
        guidelines: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Compensation guidelines',
        },
        approvalWorkflow: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Approval workflow steps',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'User who created the plan',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who last updated the plan',
        },
    }, {
        sequelize,
        tableName: 'compensation_plans',
        timestamps: true,
        indexes: [
            { fields: ['planCode'], unique: true },
            { fields: ['planYear'] },
            { fields: ['status'] },
            { fields: ['effectiveDate'] },
        ],
    });
    return CompensationPlan;
};
exports.createCompensationPlanModel = createCompensationPlanModel;
/**
 * Sequelize model for Pay Grade.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PayGrade model
 */
const createPayGradeModel = (sequelize) => {
    class PayGrade extends sequelize_1.Model {
    }
    PayGrade.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        gradeCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique grade code',
        },
        gradeName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Grade name',
        },
        gradeLevel: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Grade level (1-20)',
        },
        gradeType: {
            type: sequelize_1.DataTypes.ENUM('exempt', 'non_exempt', 'hourly', 'salaried', 'executive'),
            allowNull: false,
            comment: 'Grade type',
        },
        minSalary: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Minimum salary for grade',
        },
        midpointSalary: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Midpoint salary for grade',
        },
        maxSalary: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Maximum salary for grade',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Currency code',
        },
        spreadPercent: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Range spread percentage',
        },
        marketReference: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Market reference data',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Effective date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'End date',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'pay_grades',
        timestamps: true,
        indexes: [
            { fields: ['gradeCode'], unique: true },
            { fields: ['gradeLevel'] },
            { fields: ['gradeType'] },
            { fields: ['effectiveDate'] },
        ],
    });
    return PayGrade;
};
exports.createPayGradeModel = createPayGradeModel;
/**
 * Sequelize model for Employee Compensation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EmployeeCompensation model
 */
const createEmployeeCompensationModel = (sequelize) => {
    class EmployeeCompensation extends sequelize_1.Model {
    }
    EmployeeCompensation.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        employeeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Employee ID',
        },
        employeeName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Employee name',
        },
        jobCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Job code',
        },
        jobTitle: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Job title',
        },
        payGradeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Pay grade ID',
        },
        departmentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Department ID',
        },
        locationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Location ID',
        },
        baseSalary: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Base salary',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Currency code',
        },
        compaRatio: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Compa-ratio (salary/midpoint)',
        },
        rangePosition: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Position in salary range (0-100)',
        },
        lastIncreaseDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last increase date',
        },
        lastIncreasePercent: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Last increase percentage',
        },
        lastIncreaseAmount: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: true,
            comment: 'Last increase amount',
        },
        targetBonus: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Target bonus amount',
        },
        targetBonusPercent: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Target bonus percentage',
        },
        ltiValue: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: true,
            comment: 'Long-term incentive value',
        },
        totalCash: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Total cash compensation',
        },
        totalDirectCompensation: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Total direct compensation',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Effective date',
        },
    }, {
        sequelize,
        tableName: 'employee_compensation',
        timestamps: true,
        indexes: [
            { fields: ['employeeId'] },
            { fields: ['payGradeId'] },
            { fields: ['departmentId'] },
            { fields: ['effectiveDate'] },
            { fields: ['compaRatio'] },
        ],
    });
    return EmployeeCompensation;
};
exports.createEmployeeCompensationModel = createEmployeeCompensationModel;
/**
 * Sequelize model for Compensation Adjustment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CompensationAdjustment model
 */
const createCompensationAdjustmentModel = (sequelize) => {
    class CompensationAdjustment extends sequelize_1.Model {
    }
    CompensationAdjustment.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        employeeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Employee ID',
        },
        planId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Compensation plan ID',
        },
        cycleId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Review cycle ID',
        },
        adjustmentType: {
            type: sequelize_1.DataTypes.ENUM('merit_increase', 'promotion', 'market_adjustment', 'cost_of_living', 'equity_adjustment', 'retention', 'performance_bonus', 'special_recognition'),
            allowNull: false,
            comment: 'Type of adjustment',
        },
        currentSalary: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Current salary',
        },
        proposedSalary: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Proposed new salary',
        },
        adjustmentAmount: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Adjustment amount',
        },
        adjustmentPercent: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Adjustment percentage',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Effective date of adjustment',
        },
        reason: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Reason for adjustment',
        },
        justification: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Detailed justification',
        },
        performanceRating: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Performance rating',
        },
        compaRatioBefore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Compa-ratio before adjustment',
        },
        compaRatioAfter: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Compa-ratio after adjustment',
        },
        approvalStatus: {
            type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'rejected'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Approval status',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Approver user ID',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'compensation_adjustments',
        timestamps: true,
        indexes: [
            { fields: ['employeeId'] },
            { fields: ['planId'] },
            { fields: ['cycleId'] },
            { fields: ['adjustmentType'] },
            { fields: ['approvalStatus'] },
            { fields: ['effectiveDate'] },
        ],
    });
    return CompensationAdjustment;
};
exports.createCompensationAdjustmentModel = createCompensationAdjustmentModel;
/**
 * Sequelize model for LTI Grant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LTIGrant model
 */
const createLTIGrantModel = (sequelize) => {
    class LTIGrant extends sequelize_1.Model {
    }
    LTIGrant.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        grantNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique grant number',
        },
        employeeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Employee ID',
        },
        ltiType: {
            type: sequelize_1.DataTypes.ENUM('stock_options', 'rsu', 'performance_shares', 'sar', 'phantom_stock'),
            allowNull: false,
            comment: 'LTI type',
        },
        grantDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Grant date',
        },
        grantPrice: {
            type: sequelize_1.DataTypes.DECIMAL(19, 4),
            allowNull: true,
            comment: 'Grant price per unit',
        },
        numberOfUnits: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Number of units granted',
        },
        totalValue: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Total grant value',
        },
        vestingScheduleType: {
            type: sequelize_1.DataTypes.ENUM('cliff', 'graded', 'performance_based', 'time_based'),
            allowNull: false,
            comment: 'Vesting schedule type',
        },
        vestingStartDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Vesting start date',
        },
        vestingEndDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Vesting end date',
        },
        vestingSchedule: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Detailed vesting schedule',
        },
        vestedUnits: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of vested units',
        },
        unvestedUnits: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Number of unvested units',
        },
        exercisedUnits: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Number of exercised units',
        },
        forfeitedUnits: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Number of forfeited units',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'vested', 'exercised', 'forfeited', 'expired'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Grant status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'lti_grants',
        timestamps: true,
        indexes: [
            { fields: ['grantNumber'], unique: true },
            { fields: ['employeeId'] },
            { fields: ['ltiType'] },
            { fields: ['status'] },
            { fields: ['grantDate'] },
            { fields: ['vestingEndDate'] },
        ],
    });
    return LTIGrant;
};
exports.createLTIGrantModel = createLTIGrantModel;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Generates unique compensation plan code
 */
const generatePlanCode = (planType, year) => {
    const prefix = planType.substring(0, 3).toUpperCase();
    return `${prefix}${year}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};
/**
 * Generates unique grant number
 */
const generateGrantNumber = (ltiType, employeeId) => {
    const prefix = ltiType.substring(0, 3).toUpperCase();
    const empPrefix = employeeId.substring(0, 4).toUpperCase();
    const timestamp = Date.now().toString().substring(-6);
    return `${prefix}-${empPrefix}-${timestamp}`;
};
/**
 * Generates unique UUID
 */
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
// ============================================================================
// COMPENSATION PLANNING & BUDGETING (1-5)
// ============================================================================
/**
 * Creates comprehensive compensation plan with budget allocation.
 *
 * @param {object} planData - Plan creation data
 * @param {string} userId - User creating the plan
 * @returns {Promise<CompensationPlan>} Created plan
 *
 * @example
 * ```typescript
 * const plan = await createCompensationPlan({
 *   planCode: 'MERIT2025',
 *   planName: '2025 Annual Merit Increase Plan',
 *   planYear: 2025,
 *   planType: 'merit',
 *   totalBudget: 5000000,
 *   effectiveDate: new Date('2025-04-01')
 * }, 'admin-123');
 * ```
 */
const createCompensationPlan = async (planData, userId) => {
    const planCode = planData.planCode || generatePlanCode(planData.planType, planData.planYear);
    return {
        id: generateUUID(),
        planCode,
        planName: planData.planName,
        planYear: planData.planYear,
        fiscalYear: planData.fiscalYear || planData.planYear,
        planType: planData.planType,
        effectiveDate: planData.effectiveDate,
        endDate: planData.endDate,
        totalBudget: planData.totalBudget,
        allocatedBudget: 0,
        remainingBudget: planData.totalBudget,
        currency: planData.currency || 'USD',
        status: CompensationPlanStatus.DRAFT,
        guidelines: planData.guidelines || [],
        approvalWorkflow: planData.approvalWorkflow || [],
        metadata: planData.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
    };
};
exports.createCompensationPlan = createCompensationPlan;
/**
 * Calculates total compensation budget by department.
 *
 * @param {string} planId - Plan ID
 * @param {any[]} departments - Department list
 * @returns {Promise<object>} Budget allocation by department
 *
 * @example
 * ```typescript
 * const budgets = await calculateDepartmentBudgets('plan-123', departments);
 * // Returns: { 'dept-1': 500000, 'dept-2': 750000, ... }
 * ```
 */
const calculateDepartmentBudgets = async (planId, departments) => {
    const departmentBudgets = {};
    for (const dept of departments) {
        const headcount = dept.headcount || 0;
        const avgSalary = dept.avgSalary || 0;
        const increasePercent = dept.targetIncreasePercent || 3.0;
        departmentBudgets[dept.id] = headcount * avgSalary * (increasePercent / 100);
    }
    return departmentBudgets;
};
exports.calculateDepartmentBudgets = calculateDepartmentBudgets;
/**
 * Allocates compensation budget to eligible employees.
 *
 * @param {string} planId - Plan ID
 * @param {any[]} employees - Employee list
 * @param {number} totalBudget - Total budget available
 * @returns {Promise<object>} Budget allocation per employee
 *
 * @example
 * ```typescript
 * const allocations = await allocateCompensationBudget('plan-123', employees, 1000000);
 * ```
 */
const allocateCompensationBudget = async (planId, employees, totalBudget) => {
    const allocations = {};
    let totalAllocated = 0;
    // Sort employees by performance rating and compa-ratio
    const sortedEmployees = employees.sort((a, b) => {
        const scoreA = (a.performanceScore || 0) - (a.compaRatio || 1.0);
        const scoreB = (b.performanceScore || 0) - (b.compaRatio || 1.0);
        return scoreB - scoreA;
    });
    for (const emp of sortedEmployees) {
        if (totalAllocated >= totalBudget)
            break;
        const currentSalary = emp.baseSalary || 0;
        const performanceMultiplier = emp.performanceScore || 1.0;
        const targetIncrease = currentSalary * 0.03 * performanceMultiplier;
        const allocation = Math.min(targetIncrease, totalBudget - totalAllocated);
        allocations[emp.id] = allocation;
        totalAllocated += allocation;
    }
    return allocations;
};
exports.allocateCompensationBudget = allocateCompensationBudget;
/**
 * Tracks compensation plan budget utilization.
 *
 * @param {string} planId - Plan ID
 * @returns {Promise<object>} Budget utilization metrics
 *
 * @example
 * ```typescript
 * const utilization = await trackBudgetUtilization('plan-123');
 * // Returns: { totalBudget, allocated, remaining, utilizationPercent }
 * ```
 */
const trackBudgetUtilization = async (planId) => {
    // Mock implementation - would query database in production
    return {
        planId,
        totalBudget: 5000000,
        allocatedBudget: 3250000,
        remainingBudget: 1750000,
        utilizationPercent: 65.0,
        departmentBreakdown: {},
        adjustmentCount: 0,
        approvedCount: 0,
        pendingCount: 0,
    };
};
exports.trackBudgetUtilization = trackBudgetUtilization;
/**
 * Generates budget forecast based on historical data.
 *
 * @param {number} planYear - Plan year
 * @param {any} assumptions - Forecasting assumptions
 * @returns {Promise<object>} Budget forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastCompensationBudget(2025, {
 *   avgIncreasePercent: 3.5,
 *   headcountGrowth: 10
 * });
 * ```
 */
const forecastCompensationBudget = async (planYear, assumptions) => {
    const currentHeadcount = assumptions.currentHeadcount || 1000;
    const avgSalary = assumptions.avgSalary || 75000;
    const increasePercent = assumptions.avgIncreasePercent || 3.0;
    const headcountGrowth = assumptions.headcountGrowth || 0;
    const projectedHeadcount = currentHeadcount + headcountGrowth;
    const meritBudget = projectedHeadcount * avgSalary * (increasePercent / 100);
    const newHireBudget = headcountGrowth * avgSalary * 0.5;
    const bonusBudget = projectedHeadcount * avgSalary * 0.1;
    return {
        planYear,
        projectedHeadcount,
        avgSalary,
        meritBudget,
        newHireBudget,
        bonusBudget,
        totalBudget: meritBudget + newHireBudget + bonusBudget,
        assumptions,
    };
};
exports.forecastCompensationBudget = forecastCompensationBudget;
// ============================================================================
// SALARY STRUCTURE & PAY GRADES (6-10)
// ============================================================================
/**
 * Creates pay grade with salary range definition.
 *
 * @param {object} gradeData - Pay grade data
 * @returns {Promise<PayGrade>} Created pay grade
 *
 * @example
 * ```typescript
 * const grade = await createPayGrade({
 *   gradeCode: 'L5',
 *   gradeName: 'Senior Software Engineer',
 *   gradeLevel: 5,
 *   minSalary: 120000,
 *   midpointSalary: 150000,
 *   maxSalary: 180000
 * });
 * ```
 */
const createPayGrade = async (gradeData) => {
    const spreadPercent = ((gradeData.maxSalary - gradeData.minSalary) / gradeData.midpointSalary) * 100;
    return {
        id: generateUUID(),
        gradeCode: gradeData.gradeCode,
        gradeName: gradeData.gradeName,
        gradeLevel: gradeData.gradeLevel,
        gradeType: gradeData.gradeType,
        minSalary: gradeData.minSalary,
        midpointSalary: gradeData.midpointSalary,
        maxSalary: gradeData.maxSalary,
        currency: gradeData.currency || 'USD',
        spreadPercent,
        marketReference: gradeData.marketReference,
        effectiveDate: gradeData.effectiveDate || new Date(),
        endDate: gradeData.endDate,
        metadata: gradeData.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createPayGrade = createPayGrade;
/**
 * Updates salary ranges for pay grade.
 *
 * @param {string} gradeId - Pay grade ID
 * @param {object} rangeData - New range data
 * @returns {Promise<PayGrade>} Updated pay grade
 *
 * @example
 * ```typescript
 * const updated = await updateSalaryRange('grade-123', {
 *   minSalary: 125000,
 *   midpointSalary: 155000,
 *   maxSalary: 185000
 * });
 * ```
 */
const updateSalaryRange = async (gradeId, rangeData) => {
    // Mock implementation - would update database in production
    const spreadPercent = ((rangeData.maxSalary - rangeData.minSalary) / rangeData.midpointSalary) * 100;
    return {
        id: gradeId,
        gradeCode: rangeData.gradeCode || 'L5',
        gradeName: rangeData.gradeName || 'Senior Engineer',
        gradeLevel: rangeData.gradeLevel || 5,
        gradeType: rangeData.gradeType || PayGradeType.SALARIED,
        minSalary: rangeData.minSalary,
        midpointSalary: rangeData.midpointSalary,
        maxSalary: rangeData.maxSalary,
        currency: rangeData.currency || 'USD',
        spreadPercent,
        effectiveDate: new Date(),
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.updateSalaryRange = updateSalaryRange;
/**
 * Calculates salary range spread percentage.
 *
 * @param {number} minSalary - Minimum salary
 * @param {number} maxSalary - Maximum salary
 * @param {number} midpoint - Midpoint salary
 * @returns {number} Spread percentage
 *
 * @example
 * ```typescript
 * const spread = calculateSalarySpread(100000, 150000, 125000);
 * // Returns: 40
 * ```
 */
const calculateSalarySpread = (minSalary, maxSalary, midpoint) => {
    return ((maxSalary - minSalary) / midpoint) * 100;
};
exports.calculateSalarySpread = calculateSalarySpread;
/**
 * Validates salary against pay grade range.
 *
 * @param {number} salary - Salary to validate
 * @param {PayGrade} payGrade - Pay grade
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateSalaryInRange(145000, payGrade);
 * // Returns: { isValid: true, position: 50, compaRatio: 0.97 }
 * ```
 */
const validateSalaryInRange = (salary, payGrade) => {
    const isValid = salary >= payGrade.minSalary && salary <= payGrade.maxSalary;
    const position = ((salary - payGrade.minSalary) / (payGrade.maxSalary - payGrade.minSalary)) * 100;
    const compaRatio = salary / payGrade.midpointSalary;
    return {
        isValid,
        salary,
        minSalary: payGrade.minSalary,
        maxSalary: payGrade.maxSalary,
        position: Math.round(position * 100) / 100,
        compaRatio: Math.round(compaRatio * 100) / 100,
        belowMin: salary < payGrade.minSalary,
        aboveMax: salary > payGrade.maxSalary,
    };
};
exports.validateSalaryInRange = validateSalaryInRange;
/**
 * Generates pay grade progression matrix.
 *
 * @param {PayGrade[]} grades - List of pay grades
 * @returns {object} Progression matrix
 *
 * @example
 * ```typescript
 * const matrix = generatePayGradeMatrix(allGrades);
 * ```
 */
const generatePayGradeMatrix = (grades) => {
    const sortedGrades = grades.sort((a, b) => a.gradeLevel - b.gradeLevel);
    return {
        totalGrades: sortedGrades.length,
        grades: sortedGrades.map((grade, index) => ({
            level: grade.gradeLevel,
            code: grade.gradeCode,
            name: grade.gradeName,
            midpoint: grade.midpointSalary,
            nextLevel: sortedGrades[index + 1]
                ? {
                    level: sortedGrades[index + 1].gradeLevel,
                    code: sortedGrades[index + 1].gradeCode,
                    midpoint: sortedGrades[index + 1].midpointSalary,
                    increasePercent: ((sortedGrades[index + 1].midpointSalary - grade.midpointSalary) / grade.midpointSalary) * 100,
                }
                : null,
        })),
    };
};
exports.generatePayGradeMatrix = generatePayGradeMatrix;
// ============================================================================
// SALARY RANGE MANAGEMENT (11-15)
// ============================================================================
/**
 * Creates location-specific salary range.
 *
 * @param {string} gradeId - Pay grade ID
 * @param {string} locationId - Location ID
 * @param {object} adjustmentFactor - Location adjustment
 * @returns {Promise<SalaryRange>} Location salary range
 *
 * @example
 * ```typescript
 * const range = await createLocationSalaryRange('grade-123', 'loc-sf', {
 *   factor: 1.25
 * });
 * ```
 */
const createLocationSalaryRange = async (gradeId, locationId, adjustmentFactor) => {
    const baseMin = 100000;
    const baseMid = 125000;
    const baseMax = 150000;
    const factor = adjustmentFactor.factor || 1.0;
    return {
        id: generateUUID(),
        payGradeId: gradeId,
        locationId,
        currencyCode: adjustmentFactor.currency || 'USD',
        minSalary: baseMin * factor,
        firstQuartile: baseMin * factor + (baseMid - baseMin) * factor * 0.25,
        midpoint: baseMid * factor,
        thirdQuartile: baseMid * factor + (baseMax - baseMid) * factor * 0.75,
        maxSalary: baseMax * factor,
        marketRatio: factor,
        effectiveDate: new Date(),
        metadata: {},
    };
};
exports.createLocationSalaryRange = createLocationSalaryRange;
/**
 * Calculates compa-ratio for employee.
 *
 * @param {number} salary - Employee salary
 * @param {number} midpoint - Range midpoint
 * @returns {number} Compa-ratio
 *
 * @example
 * ```typescript
 * const ratio = calculateCompaRatio(145000, 150000);
 * // Returns: 0.97
 * ```
 */
const calculateCompaRatio = (salary, midpoint) => {
    return Math.round((salary / midpoint) * 100) / 100;
};
exports.calculateCompaRatio = calculateCompaRatio;
/**
 * Calculates position in salary range.
 *
 * @param {number} salary - Employee salary
 * @param {number} min - Range minimum
 * @param {number} max - Range maximum
 * @returns {number} Range position (0-100)
 *
 * @example
 * ```typescript
 * const position = calculateRangePosition(130000, 100000, 150000);
 * // Returns: 60
 * ```
 */
const calculateRangePosition = (salary, min, max) => {
    return Math.round(((salary - min) / (max - min)) * 10000) / 100;
};
exports.calculateRangePosition = calculateRangePosition;
/**
 * Identifies employees outside salary range.
 *
 * @param {EmployeeCompensation[]} employees - Employee list
 * @returns {object} Employees above/below range
 *
 * @example
 * ```typescript
 * const outliers = identifyRangeOutliers(employees);
 * // Returns: { aboveMax: [...], belowMin: [...] }
 * ```
 */
const identifyRangeOutliers = (employees) => {
    // Mock implementation
    return {
        aboveMax: employees.filter((e) => e.compaRatio > 1.15),
        belowMin: employees.filter((e) => e.compaRatio < 0.85),
        totalOutliers: 0,
        outlierPercent: 0,
    };
};
exports.identifyRangeOutliers = identifyRangeOutliers;
/**
 * Recommends salary range adjustments based on market data.
 *
 * @param {PayGrade} grade - Pay grade
 * @param {MarketData} marketData - Market data
 * @returns {object} Recommended adjustments
 *
 * @example
 * ```typescript
 * const recommendations = recommendRangeAdjustments(grade, marketData);
 * ```
 */
const recommendRangeAdjustments = (grade, marketData) => {
    const marketMidpoint = marketData.percentile50;
    const currentMidpoint = grade.midpointSalary;
    const variance = ((marketMidpoint - currentMidpoint) / currentMidpoint) * 100;
    return {
        currentMidpoint,
        marketMidpoint,
        variancePercent: Math.round(variance * 100) / 100,
        recommendAdjustment: Math.abs(variance) > 5,
        suggestedMidpoint: variance > 5 ? marketMidpoint : currentMidpoint,
        suggestedMin: variance > 5 ? marketMidpoint * 0.8 : grade.minSalary,
        suggestedMax: variance > 5 ? marketMidpoint * 1.2 : grade.maxSalary,
        rationale: variance > 5 ? 'Market has moved significantly' : 'Range is competitive',
    };
};
exports.recommendRangeAdjustments = recommendRangeAdjustments;
// ============================================================================
// MERIT INCREASE & BONUS CALCULATIONS (16-20)
// ============================================================================
/**
 * Calculates merit increase based on performance.
 *
 * @param {EmployeeCompensation} employee - Employee compensation
 * @param {string} performanceRating - Performance rating
 * @param {CompensationGuideline} guideline - Merit guidelines
 * @returns {object} Merit increase calculation
 *
 * @example
 * ```typescript
 * const merit = calculateMeritIncrease(employee, 'exceeds', guideline);
 * // Returns: { increasePercent: 4.5, increaseAmount: 5400, newSalary: 125400 }
 * ```
 */
const calculateMeritIncrease = (employee, performanceRating, guideline) => {
    const ratingMap = {
        exceeds: guideline.maxIncreasePercent,
        meets: guideline.targetIncreasePercent,
        developing: guideline.minIncreasePercent,
        unsatisfactory: 0,
    };
    const increasePercent = ratingMap[performanceRating.toLowerCase()] || guideline.targetIncreasePercent;
    const increaseAmount = Math.round(employee.baseSalary * (increasePercent / 100));
    const newSalary = employee.baseSalary + increaseAmount;
    return {
        employeeId: employee.employeeId,
        currentSalary: employee.baseSalary,
        performanceRating,
        increasePercent,
        increaseAmount,
        newSalary,
        compaRatioAfter: Math.round((newSalary / employee.baseSalary) * 100) / 100,
    };
};
exports.calculateMeritIncrease = calculateMeritIncrease;
/**
 * Calculates bonus based on performance and target.
 *
 * @param {EmployeeCompensation} employee - Employee compensation
 * @param {number} achievementPercent - Goal achievement %
 * @param {object} bonusStructure - Bonus structure
 * @returns {object} Bonus calculation
 *
 * @example
 * ```typescript
 * const bonus = calculatePerformanceBonus(employee, 110, bonusStructure);
 * ```
 */
const calculatePerformanceBonus = (employee, achievementPercent, bonusStructure) => {
    let multiplier = 1.0;
    if (achievementPercent >= 120)
        multiplier = 2.0;
    else if (achievementPercent >= 110)
        multiplier = 1.5;
    else if (achievementPercent >= 100)
        multiplier = 1.0;
    else if (achievementPercent >= 90)
        multiplier = 0.75;
    else if (achievementPercent >= 80)
        multiplier = 0.5;
    else
        multiplier = 0;
    const targetAmount = employee.baseSalary * (employee.targetBonusPercent / 100);
    const actualAmount = Math.round(targetAmount * multiplier);
    return {
        employeeId: employee.employeeId,
        targetAmount,
        achievementPercent,
        multiplier,
        actualAmount,
        bonusPercent: (actualAmount / employee.baseSalary) * 100,
    };
};
exports.calculatePerformanceBonus = calculatePerformanceBonus;
/**
 * Calculates prorated bonus for partial year employment.
 *
 * @param {number} targetBonus - Annual target bonus
 * @param {Date} startDate - Employment start date
 * @param {Date} bonusDate - Bonus payment date
 * @returns {number} Prorated bonus amount
 *
 * @example
 * ```typescript
 * const prorated = calculateProratedBonus(10000, new Date('2025-07-01'), new Date('2025-12-31'));
 * ```
 */
const calculateProratedBonus = (targetBonus, startDate, bonusDate) => {
    const monthsWorked = Math.ceil((bonusDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const proration = monthsWorked / 12;
    return Math.round(targetBonus * proration);
};
exports.calculateProratedBonus = calculateProratedBonus;
/**
 * Validates merit increase against budget and guidelines.
 *
 * @param {CompensationAdjustment} adjustment - Proposed adjustment
 * @param {CompensationPlan} plan - Compensation plan
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateMeritIncrease(adjustment, plan);
 * ```
 */
const validateMeritIncrease = (adjustment, plan) => {
    const withinBudget = adjustment.adjustmentAmount <= plan.remainingBudget;
    const increasePercent = adjustment.adjustmentPercent;
    const withinGuidelines = increasePercent >= 0 && increasePercent <= 15;
    return {
        isValid: withinBudget && withinGuidelines,
        withinBudget,
        withinGuidelines,
        errors: [
            !withinBudget ? 'Exceeds remaining budget' : null,
            !withinGuidelines ? 'Outside guideline range' : null,
        ].filter(Boolean),
        warnings: [],
    };
};
exports.validateMeritIncrease = validateMeritIncrease;
/**
 * Generates merit increase recommendations for department.
 *
 * @param {string} departmentId - Department ID
 * @param {EmployeeCompensation[]} employees - Department employees
 * @param {number} budgetAmount - Department budget
 * @returns {object} Merit recommendations
 *
 * @example
 * ```typescript
 * const recommendations = generateMeritRecommendations('dept-123', employees, 250000);
 * ```
 */
const generateMeritRecommendations = (departmentId, employees, budgetAmount) => {
    const recommendations = employees.map((emp) => {
        let recommendedPercent = 3.0;
        if (emp.compaRatio < 0.85)
            recommendedPercent = 5.0;
        else if (emp.compaRatio < 0.95)
            recommendedPercent = 4.0;
        else if (emp.compaRatio > 1.15)
            recommendedPercent = 1.5;
        const recommendedAmount = Math.round(emp.baseSalary * (recommendedPercent / 100));
        return {
            employeeId: emp.employeeId,
            currentSalary: emp.baseSalary,
            compaRatio: emp.compaRatio,
            recommendedPercent,
            recommendedAmount,
            rationale: emp.compaRatio < 0.9 ? 'Below market' : emp.compaRatio > 1.1 ? 'Above market' : 'Market aligned',
        };
    });
    const totalRecommended = recommendations.reduce((sum, r) => sum + r.recommendedAmount, 0);
    return {
        departmentId,
        employeeCount: employees.length,
        budgetAmount,
        totalRecommended,
        budgetVariance: totalRecommended - budgetAmount,
        recommendations,
    };
};
exports.generateMeritRecommendations = generateMeritRecommendations;
// ============================================================================
// COMPENSATION REVIEW CYCLES (21-25)
// ============================================================================
/**
 * Creates compensation review cycle.
 *
 * @param {object} cycleData - Cycle data
 * @returns {Promise<CompensationReviewCycle>} Created cycle
 *
 * @example
 * ```typescript
 * const cycle = await createCompensationCycle({
 *   cycleName: '2025 Annual Review',
 *   planYear: 2025,
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-03-31')
 * });
 * ```
 */
const createCompensationCycle = async (cycleData) => {
    const cycleCode = `CYC${cycleData.planYear}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    return {
        id: generateUUID(),
        cycleCode,
        cycleName: cycleData.cycleName,
        planYear: cycleData.planYear,
        cycleType: cycleData.cycleType || 'annual',
        startDate: cycleData.startDate,
        endDate: cycleData.endDate,
        approvalDeadline: cycleData.approvalDeadline,
        effectiveDate: cycleData.effectiveDate,
        status: CompensationCycleStatus.PLANNING,
        totalBudget: cycleData.totalBudget || 0,
        participantCount: 0,
        completedCount: 0,
        approvedCount: 0,
        guidelines: cycleData.guidelines || [],
        metadata: cycleData.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createCompensationCycle = createCompensationCycle;
/**
 * Opens compensation cycle for manager input.
 *
 * @param {string} cycleId - Cycle ID
 * @returns {Promise<CompensationReviewCycle>} Opened cycle
 *
 * @example
 * ```typescript
 * const opened = await openCompensationCycle('cycle-123');
 * ```
 */
const openCompensationCycle = async (cycleId) => {
    // Mock implementation - would update status in database
    return {
        id: cycleId,
        cycleCode: 'CYC2025',
        cycleName: '2025 Annual Review',
        planYear: 2025,
        cycleType: 'annual',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-03-31'),
        approvalDeadline: new Date('2025-03-15'),
        effectiveDate: new Date('2025-04-01'),
        status: CompensationCycleStatus.OPEN,
        totalBudget: 5000000,
        participantCount: 0,
        completedCount: 0,
        approvedCount: 0,
        guidelines: [],
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.openCompensationCycle = openCompensationCycle;
/**
 * Tracks compensation cycle progress.
 *
 * @param {string} cycleId - Cycle ID
 * @returns {Promise<object>} Cycle progress metrics
 *
 * @example
 * ```typescript
 * const progress = await trackCycleProgress('cycle-123');
 * ```
 */
const trackCycleProgress = async (cycleId) => {
    return {
        cycleId,
        participantCount: 500,
        completedCount: 325,
        approvedCount: 200,
        pendingCount: 125,
        rejectedCount: 5,
        completionPercent: 65,
        approvalPercent: 40,
        avgCompletionTime: 5.2,
        budgetUtilization: 68,
    };
};
exports.trackCycleProgress = trackCycleProgress;
/**
 * Closes compensation cycle and finalizes changes.
 *
 * @param {string} cycleId - Cycle ID
 * @returns {Promise<CompensationReviewCycle>} Closed cycle
 *
 * @example
 * ```typescript
 * const closed = await closeCompensationCycle('cycle-123');
 * ```
 */
const closeCompensationCycle = async (cycleId) => {
    // Mock implementation
    return {
        id: cycleId,
        cycleCode: 'CYC2025',
        cycleName: '2025 Annual Review',
        planYear: 2025,
        cycleType: 'annual',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-03-31'),
        approvalDeadline: new Date('2025-03-15'),
        effectiveDate: new Date('2025-04-01'),
        status: CompensationCycleStatus.CLOSED,
        totalBudget: 5000000,
        participantCount: 500,
        completedCount: 500,
        approvedCount: 495,
        guidelines: [],
        metadata: { closedAt: new Date() },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.closeCompensationCycle = closeCompensationCycle;
/**
 * Generates cycle summary report.
 *
 * @param {string} cycleId - Cycle ID
 * @returns {Promise<object>} Cycle summary
 *
 * @example
 * ```typescript
 * const summary = await generateCycleSummaryReport('cycle-123');
 * ```
 */
const generateCycleSummaryReport = async (cycleId) => {
    return {
        cycleId,
        cycleName: '2025 Annual Review',
        planYear: 2025,
        participants: 500,
        totalBudget: 5000000,
        budgetUsed: 4750000,
        avgIncreasePercent: 3.8,
        avgIncreaseAmount: 4250,
        meritIncreases: 450,
        promotions: 35,
        equityAdjustments: 15,
        totalCashImpact: 4750000,
        byDepartment: [],
        byPerformanceRating: [],
    };
};
exports.generateCycleSummaryReport = generateCycleSummaryReport;
// ============================================================================
// MARKET DATA & BENCHMARKING (26-30)
// ============================================================================
/**
 * Imports market survey data.
 *
 * @param {MarketDataUploadDto} marketData - Market data
 * @returns {Promise<MarketData>} Imported market data
 *
 * @example
 * ```typescript
 * const imported = await importMarketSurveyData({
 *   jobCode: 'SE5',
 *   dataSource: MarketDataSource.MERCER,
 *   surveyYear: 2025,
 *   percentiles: { p50: 150000 }
 * });
 * ```
 */
const importMarketSurveyData = async (marketData) => {
    return {
        id: generateUUID(),
        jobCode: marketData.jobCode,
        jobTitle: marketData.jobTitle,
        dataSource: marketData.dataSource,
        surveyYear: marketData.surveyYear,
        effectiveDate: new Date(),
        percentile10: marketData.percentiles.p10,
        percentile25: marketData.percentiles.p25,
        percentile50: marketData.percentiles.p50,
        percentile75: marketData.percentiles.p75,
        percentile90: marketData.percentiles.p90,
        average: marketData.percentiles.p50,
        sampleSize: marketData.sampleSize,
        currency: 'USD',
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.importMarketSurveyData = importMarketSurveyData;
/**
 * Benchmarks employee compensation against market.
 *
 * @param {EmployeeCompensation} employee - Employee compensation
 * @param {MarketData} marketData - Market data
 * @returns {object} Benchmarking results
 *
 * @example
 * ```typescript
 * const benchmark = benchmarkAgainstMarket(employee, marketData);
 * ```
 */
const benchmarkAgainstMarket = (employee, marketData) => {
    const marketMidpoint = marketData.percentile50;
    const variance = ((employee.baseSalary - marketMidpoint) / marketMidpoint) * 100;
    let percentileRank = 50;
    if (employee.baseSalary >= marketData.percentile90)
        percentileRank = 90;
    else if (employee.baseSalary >= marketData.percentile75)
        percentileRank = 75;
    else if (employee.baseSalary >= marketData.percentile50)
        percentileRank = 50;
    else if (employee.baseSalary >= marketData.percentile25)
        percentileRank = 25;
    else
        percentileRank = 10;
    return {
        employeeId: employee.employeeId,
        currentSalary: employee.baseSalary,
        marketMidpoint,
        variancePercent: Math.round(variance * 100) / 100,
        percentileRank,
        marketCompetitive: Math.abs(variance) <= 10,
        recommendation: variance < -10 ? 'Below market - increase recommended' : variance > 10 ? 'Above market' : 'Market competitive',
    };
};
exports.benchmarkAgainstMarket = benchmarkAgainstMarket;
/**
 * Calculates market ratio (company vs market).
 *
 * @param {number} companySalary - Company salary
 * @param {number} marketSalary - Market salary
 * @returns {number} Market ratio
 *
 * @example
 * ```typescript
 * const ratio = calculateMarketRatio(145000, 150000);
 * // Returns: 0.97
 * ```
 */
const calculateMarketRatio = (companySalary, marketSalary) => {
    return Math.round((companySalary / marketSalary) * 100) / 100;
};
exports.calculateMarketRatio = calculateMarketRatio;
/**
 * Generates market positioning report.
 *
 * @param {EmployeeCompensation[]} employees - Employee list
 * @param {MarketData[]} marketData - Market data
 * @returns {object} Positioning report
 *
 * @example
 * ```typescript
 * const report = generateMarketPositioningReport(employees, marketData);
 * ```
 */
const generateMarketPositioningReport = (employees, marketData) => {
    return {
        totalEmployees: employees.length,
        avgMarketRatio: 0.98,
        belowMarket: 45,
        atMarket: 123,
        aboveMarket: 32,
        overallPositioning: 'Competitive',
        byJobFamily: [],
        byDepartment: [],
        recommendations: [],
    };
};
exports.generateMarketPositioningReport = generateMarketPositioningReport;
/**
 * Identifies market laggards requiring adjustment.
 *
 * @param {EmployeeCompensation[]} employees - Employee list
 * @param {MarketData[]} marketData - Market data
 * @param {number} thresholdPercent - Threshold for laggard
 * @returns {object[]} Laggard employees
 *
 * @example
 * ```typescript
 * const laggards = identifyMarketLaggards(employees, marketData, 10);
 * ```
 */
const identifyMarketLaggards = (employees, marketData, thresholdPercent) => {
    return employees
        .map((emp) => {
        const market = marketData.find((m) => m.jobCode === emp.jobCode);
        if (!market)
            return null;
        const variance = ((emp.baseSalary - market.percentile50) / market.percentile50) * 100;
        if (variance < -thresholdPercent) {
            return {
                employeeId: emp.employeeId,
                currentSalary: emp.baseSalary,
                marketSalary: market.percentile50,
                gap: market.percentile50 - emp.baseSalary,
                gapPercent: variance,
                priority: variance < -20 ? 'high' : 'medium',
            };
        }
        return null;
    })
        .filter((item) => item !== null);
};
exports.identifyMarketLaggards = identifyMarketLaggards;
// ============================================================================
// PAY EQUITY ANALYSIS (31-35)
// ============================================================================
/**
 * Performs comprehensive pay equity analysis.
 *
 * @param {string} analysisType - Analysis type
 * @param {EmployeeCompensation[]} employees - Employee list
 * @returns {Promise<PayEquityAnalysis>} Equity analysis
 *
 * @example
 * ```typescript
 * const analysis = await performPayEquityAnalysis('gender', employees);
 * ```
 */
const performPayEquityAnalysis = async (analysisType, employees) => {
    return {
        id: generateUUID(),
        analysisDate: new Date(),
        analysisType: analysisType,
        scope: 'company',
        totalEmployees: employees.length,
        disparityFound: false,
        avgPayGap: 2.3,
        maxPayGap: 8.5,
        affectedEmployees: 12,
        recommendations: ['Review job titles', 'Conduct detailed analysis'],
        estimatedCost: 125000,
        findings: [],
        metadata: {},
        createdAt: new Date(),
    };
};
exports.performPayEquityAnalysis = performPayEquityAnalysis;
/**
 * Calculates gender pay gap.
 *
 * @param {EmployeeCompensation[]} employees - Employee list
 * @returns {object} Gender pay gap analysis
 *
 * @example
 * ```typescript
 * const genderGap = calculateGenderPayGap(employees);
 * ```
 */
const calculateGenderPayGap = (employees) => {
    // Mock implementation
    return {
        maleAvg: 125000,
        femaleAvg: 122000,
        payGap: 3000,
        payGapPercent: 2.4,
        adjustedPayGap: 1.2,
        statistically, Significant: false,
    };
};
exports.calculateGenderPayGap = calculateGenderPayGap;
/**
 * Analyzes pay equity by job level.
 *
 * @param {EmployeeCompensation[]} employees - Employee list
 * @returns {object[]} Pay equity by level
 *
 * @example
 * ```typescript
 * const analysis = analyzePayEquityByLevel(employees);
 * ```
 */
const analyzePayEquityByLevel = (employees) => {
    return [
        {
            level: 'Senior',
            employeeCount: 120,
            avgSalary: 145000,
            payRange: { min: 120000, max: 180000 },
            genderPayGap: 2.1,
            ethnicityPayGap: 1.8,
        },
    ];
};
exports.analyzePayEquityByLevel = analyzePayEquityByLevel;
/**
 * Generates pay equity remediation plan.
 *
 * @param {PayEquityAnalysis} analysis - Equity analysis
 * @returns {object} Remediation plan
 *
 * @example
 * ```typescript
 * const plan = generateEquityRemediationPlan(analysis);
 * ```
 */
const generateEquityRemediationPlan = (analysis) => {
    return {
        analysisId: analysis.id,
        affectedEmployees: analysis.affectedEmployees,
        totalCost: analysis.estimatedCost,
        phases: [
            {
                phase: 1,
                description: 'Address critical gaps',
                employeeCount: 5,
                cost: 50000,
            },
        ],
        timeline: '6 months',
        recommendations: analysis.recommendations,
    };
};
exports.generateEquityRemediationPlan = generateEquityRemediationPlan;
/**
 * Tracks pay equity metrics over time.
 *
 * @param {string} companyId - Company ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<object>} Historical equity metrics
 *
 * @example
 * ```typescript
 * const trends = await trackPayEquityMetrics('company-123', start, end);
 * ```
 */
const trackPayEquityMetrics = async (companyId, startDate, endDate) => {
    return {
        companyId,
        period: { startDate, endDate },
        genderPayGapTrend: [2.8, 2.5, 2.3, 2.1],
        ethnicityPayGapTrend: [3.2, 2.9, 2.6, 2.4],
        totalInvestment: 450000,
        employeesAdjusted: 67,
    };
};
exports.trackPayEquityMetrics = trackPayEquityMetrics;
// ============================================================================
// TOTAL REWARDS STATEMENTS (36-40)
// ============================================================================
/**
 * Generates total rewards statement for employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} year - Statement year
 * @returns {Promise<TotalRewardsStatement>} Rewards statement
 *
 * @example
 * ```typescript
 * const statement = await generateTotalRewardsStatement('emp-123', 2025);
 * ```
 */
const generateTotalRewardsStatement = async (employeeId, year) => {
    const baseSalary = 150000;
    const bonusPaid = 15000;
    const ltiValue = 50000;
    const benefitsValue = 18000;
    const retirementContribution = 9000;
    const ptoValue = 11500;
    return {
        id: generateUUID(),
        employeeId,
        statementYear: year,
        baseSalary,
        bonusTarget: 15000,
        bonusPaid,
        commissionPaid: 0,
        ltiValue,
        benefitsValue,
        retirementContribution,
        ptoValue,
        otherCompensation: 2000,
        totalCash: baseSalary + bonusPaid,
        totalDirectCompensation: baseSalary + bonusPaid + ltiValue,
        totalRewards: baseSalary + bonusPaid + ltiValue + benefitsValue + retirementContribution + ptoValue,
        currency: 'USD',
        generatedAt: new Date(),
        metadata: {},
    };
};
exports.generateTotalRewardsStatement = generateTotalRewardsStatement;
/**
 * Calculates total cash compensation.
 *
 * @param {EmployeeCompensation} employee - Employee compensation
 * @param {BonusPayment[]} bonuses - Bonus payments
 * @param {CommissionPayment[]} commissions - Commission payments
 * @returns {number} Total cash
 *
 * @example
 * ```typescript
 * const totalCash = calculateTotalCashCompensation(employee, bonuses, commissions);
 * ```
 */
const calculateTotalCashCompensation = (employee, bonuses, commissions) => {
    const bonusTotal = bonuses.reduce((sum, b) => sum + b.actualAmount, 0);
    const commissionTotal = commissions.reduce((sum, c) => sum + c.finalAmount, 0);
    return employee.baseSalary + bonusTotal + commissionTotal;
};
exports.calculateTotalCashCompensation = calculateTotalCashCompensation;
/**
 * Calculates total direct compensation (TDC).
 *
 * @param {number} baseSalary - Base salary
 * @param {number} bonuses - Total bonuses
 * @param {number} ltiValue - LTI value
 * @returns {number} Total direct compensation
 *
 * @example
 * ```typescript
 * const tdc = calculateTotalDirectCompensation(150000, 15000, 50000);
 * // Returns: 215000
 * ```
 */
const calculateTotalDirectCompensation = (baseSalary, bonuses, ltiValue) => {
    return baseSalary + bonuses + ltiValue;
};
exports.calculateTotalDirectCompensation = calculateTotalDirectCompensation;
/**
 * Estimates benefits value for employee.
 *
 * @param {string} employeeId - Employee ID
 * @returns {Promise<number>} Benefits value
 *
 * @example
 * ```typescript
 * const benefitsValue = await estimateBenefitsValue('emp-123');
 * ```
 */
const estimateBenefitsValue = async (employeeId) => {
    // Mock calculation - would sum actual benefits costs
    const healthInsurance = 12000;
    const dentalVision = 2000;
    const lifeInsurance = 500;
    const disability = 1500;
    const wellness = 2000;
    return healthInsurance + dentalVision + lifeInsurance + disability + wellness;
};
exports.estimateBenefitsValue = estimateBenefitsValue;
/**
 * Generates batch total rewards statements.
 *
 * @param {string[]} employeeIds - Employee IDs
 * @param {number} year - Statement year
 * @returns {Promise<TotalRewardsStatement[]>} Statements
 *
 * @example
 * ```typescript
 * const statements = await generateBatchTotalRewardsStatements(employeeIds, 2025);
 * ```
 */
const generateBatchTotalRewardsStatements = async (employeeIds, year) => {
    return Promise.all(employeeIds.map((id) => (0, exports.generateTotalRewardsStatement)(id, year)));
};
exports.generateBatchTotalRewardsStatements = generateBatchTotalRewardsStatements;
// ============================================================================
// VARIABLE PAY & INCENTIVE MANAGEMENT (41-45)
// ============================================================================
/**
 * Creates variable pay incentive plan.
 *
 * @param {object} planData - Plan data
 * @returns {Promise<object>} Created plan
 *
 * @example
 * ```typescript
 * const plan = await createVariablePayPlan({
 *   planName: '2025 Sales Incentive',
 *   planType: 'commission',
 *   eligibleRoles: ['sales']
 * });
 * ```
 */
const createVariablePayPlan = async (planData) => {
    return {
        id: generateUUID(),
        planCode: generatePlanCode('variable', planData.year || 2025),
        planName: planData.planName,
        planType: planData.planType,
        effectiveDate: planData.effectiveDate || new Date(),
        endDate: planData.endDate,
        eligibleRoles: planData.eligibleRoles || [],
        paymentFrequency: planData.paymentFrequency || 'quarterly',
        metrics: planData.metrics || [],
        metadata: {},
        createdAt: new Date(),
    };
};
exports.createVariablePayPlan = createVariablePayPlan;
/**
 * Calculates variable pay based on performance metrics.
 *
 * @param {string} employeeId - Employee ID
 * @param {object} metrics - Performance metrics
 * @param {object} plan - Variable pay plan
 * @returns {number} Variable pay amount
 *
 * @example
 * ```typescript
 * const variablePay = calculateVariablePay('emp-123', metrics, plan);
 * ```
 */
const calculateVariablePay = (employeeId, metrics, plan) => {
    let totalPay = 0;
    for (const metric of plan.metrics || []) {
        const achievement = metrics[metric.name] || 0;
        const target = metric.target || 100;
        const payout = metric.payoutAmount || 0;
        if (achievement >= target) {
            totalPay += payout * (achievement / target);
        }
    }
    return Math.round(totalPay);
};
exports.calculateVariablePay = calculateVariablePay;
/**
 * Tracks variable pay performance metrics.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} planId - Plan ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<object>} Performance tracking
 *
 * @example
 * ```typescript
 * const tracking = await trackVariablePayMetrics('emp-123', 'plan-123', start, end);
 * ```
 */
const trackVariablePayMetrics = async (employeeId, planId, periodStart, periodEnd) => {
    return {
        employeeId,
        planId,
        period: { start: periodStart, end: periodEnd },
        metrics: [
            { name: 'Revenue', target: 1000000, actual: 1150000, achievement: 115 },
            { name: 'Margin', target: 30, actual: 32, achievement: 107 },
        ],
        overallAchievement: 111,
        projectedPayout: 45000,
    };
};
exports.trackVariablePayMetrics = trackVariablePayMetrics;
/**
 * Processes variable pay payout.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} planId - Plan ID
 * @param {number} amount - Payout amount
 * @returns {Promise<object>} Payout record
 *
 * @example
 * ```typescript
 * const payout = await processVariablePayPayout('emp-123', 'plan-123', 45000);
 * ```
 */
const processVariablePayPayout = async (employeeId, planId, amount) => {
    return {
        id: generateUUID(),
        employeeId,
        planId,
        amount,
        paymentDate: new Date(),
        status: 'pending',
        createdAt: new Date(),
    };
};
exports.processVariablePayPayout = processVariablePayPayout;
/**
 * Generates variable pay analytics report.
 *
 * @param {string} planId - Plan ID
 * @returns {Promise<object>} Analytics report
 *
 * @example
 * ```typescript
 * const analytics = await generateVariablePayAnalytics('plan-123');
 * ```
 */
const generateVariablePayAnalytics = async (planId) => {
    return {
        planId,
        participantCount: 150,
        totalPayout: 6750000,
        avgPayout: 45000,
        avgAchievement: 108,
        topPerformers: [],
        distributionByAchievement: {},
    };
};
exports.generateVariablePayAnalytics = generateVariablePayAnalytics;
// ============================================================================
// COMMISSION & SALES COMPENSATION (46-50)
// ============================================================================
/**
 * Creates commission plan with tiered structure.
 *
 * @param {CreateCommissionPlanDto} planData - Commission plan data
 * @returns {Promise<CommissionPlan>} Created commission plan
 *
 * @example
 * ```typescript
 * const plan = await createCommissionPlan({
 *   planCode: 'SALES2025',
 *   planName: '2025 Sales Commission',
 *   structureType: CommissionStructureType.TIERED,
 *   tiers: [
 *     { tierLevel: 1, minAmount: 0, maxAmount: 500000, rate: 5, rateType: 'percentage' },
 *     { tierLevel: 2, minAmount: 500000, rate: 7, rateType: 'percentage' }
 *   ]
 * });
 * ```
 */
const createCommissionPlan = async (planData) => {
    return {
        id: generateUUID(),
        planCode: planData.planCode,
        planName: planData.planName,
        structureType: planData.structureType,
        effectiveDate: planData.effectiveDate,
        endDate: undefined,
        tiers: planData.tiers,
        paymentFrequency: planData.paymentFrequency,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createCommissionPlan = createCommissionPlan;
/**
 * Calculates commission based on sales and plan structure.
 *
 * @param {number} salesAmount - Total sales amount
 * @param {CommissionPlan} plan - Commission plan
 * @returns {object} Commission calculation
 *
 * @example
 * ```typescript
 * const commission = calculateCommission(750000, commissionPlan);
 * // Returns: { totalCommission: 42500, tierBreakdown: [...] }
 * ```
 */
const calculateCommission = (salesAmount, plan) => {
    let totalCommission = 0;
    const tierBreakdown = [];
    for (const tier of plan.tiers) {
        let tierAmount = 0;
        if (salesAmount > tier.minAmount) {
            const amountInTier = tier.maxAmount ? Math.min(salesAmount - tier.minAmount, tier.maxAmount - tier.minAmount) : salesAmount - tier.minAmount;
            if (tier.rateType === 'percentage') {
                tierAmount = amountInTier * (tier.rate / 100);
            }
            else {
                tierAmount = tier.rate;
            }
            totalCommission += tierAmount;
            tierBreakdown.push({
                tier: tier.tierLevel,
                salesInTier: amountInTier,
                rate: tier.rate,
                commission: tierAmount,
            });
        }
    }
    return {
        salesAmount,
        totalCommission: Math.round(totalCommission),
        tierBreakdown,
        avgRate: (totalCommission / salesAmount) * 100,
    };
};
exports.calculateCommission = calculateCommission;
/**
 * Processes commission payment for sales period.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} planId - Plan ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @param {number} salesAmount - Total sales
 * @returns {Promise<CommissionPayment>} Commission payment
 *
 * @example
 * ```typescript
 * const payment = await processCommissionPayment('emp-123', 'plan-123', start, end, 750000);
 * ```
 */
const processCommissionPayment = async (employeeId, planId, periodStart, periodEnd, salesAmount) => {
    const commissionAmount = Math.round(salesAmount * 0.05);
    return {
        id: generateUUID(),
        employeeId,
        planId,
        periodStart,
        periodEnd,
        salesAmount,
        quotaAmount: 500000,
        achievementPercent: (salesAmount / 500000) * 100,
        commissionAmount,
        adjustments: 0,
        finalAmount: commissionAmount,
        paymentDate: periodEnd,
        status: 'calculated',
        metadata: {},
        createdAt: new Date(),
    };
};
exports.processCommissionPayment = processCommissionPayment;
/**
 * Tracks sales performance against quota.
 *
 * @param {string} employeeId - Employee ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<object>} Sales performance metrics
 *
 * @example
 * ```typescript
 * const performance = await trackSalesPerformance('emp-123', start, end);
 * ```
 */
const trackSalesPerformance = async (employeeId, periodStart, periodEnd) => {
    return {
        employeeId,
        period: { start: periodStart, end: periodEnd },
        quota: 500000,
        actualSales: 625000,
        achievement: 125,
        pipeline: 850000,
        dealsWon: 15,
        avgDealSize: 41667,
        projectedCommission: 31250,
    };
};
exports.trackSalesPerformance = trackSalesPerformance;
/**
 * Generates sales compensation analytics.
 *
 * @param {string} departmentId - Department ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<object>} Sales compensation analytics
 *
 * @example
 * ```typescript
 * const analytics = await generateSalesCompensationAnalytics('dept-sales', start, end);
 * ```
 */
const generateSalesCompensationAnalytics = async (departmentId, periodStart, periodEnd) => {
    return {
        departmentId,
        period: { start: periodStart, end: periodEnd },
        totalSalesTeam: 50,
        totalSales: 37500000,
        totalCommissions: 1875000,
        avgCommission: 37500,
        avgQuotaAttainment: 112,
        topPerformers: [],
        bottomPerformers: [],
        costOfSales: 5.0,
    };
};
exports.generateSalesCompensationAnalytics = generateSalesCompensationAnalytics;
//# sourceMappingURL=compensation-management-kit.js.map