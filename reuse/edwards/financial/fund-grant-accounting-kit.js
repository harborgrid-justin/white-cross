"use strict";
/**
 * LOC: FUNDGRNT001
 * File: /reuse/edwards/financial/fund-grant-accounting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../financial/general-ledger-operations-kit (GL operations)
 *   - ../financial/budget-management-kit (Budget operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Grant management services
 *   - Fund accounting processes
 *   - Grant billing and reporting modules
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
exports.getGrantsByFund = exports.activateFund = exports.closeFund = exports.generateGrantFinancialStatement = exports.validateCostSharingCommitment = exports.getGrantExpenditureSummary = exports.updateGrantBudgetLine = exports.getFundTransferHistory = exports.validateGrantCloseout = exports.generateFundAuditTrail = exports.performGrantComplianceCheck = exports.approveFundTransfer = exports.createFundTransfer = exports.getGrantReports = exports.submitGrantReport = exports.createGrantReport = exports.getGrantBillingHistory = exports.recordGrantPayment = exports.submitGrantInvoice = exports.generateGrantInvoice = exports.getIndirectCostAllocations = exports.calculateIndirectCosts = exports.getCostSharingStatus = exports.updateCostSharingMet = exports.recordCostSharingCommitment = exports.performComplianceCheck = exports.getGrantExpenditures = exports.recordGrantExpenditure = exports.checkGrantBudgetAvailability = exports.getGrantBudgetVariance = exports.approveGrantBudget = exports.createGrantBudget = exports.validateGrantAward = exports.updateGrantStatus = exports.getGrantWithDetails = exports.createGrantAward = exports.calculateFundBalancesByType = exports.validateFundAvailability = exports.addFundRestriction = exports.updateFundBalance = exports.getFundWithDetails = exports.createFund = exports.createGrantBudgetModel = exports.createGrantAwardModel = exports.createFundStructureModel = exports.GrantBillingDto = exports.GrantExpenditureDto = exports.CreateGrantAwardDto = exports.CreateFundDto = void 0;
/**
 * File: /reuse/edwards/financial/fund-grant-accounting-kit.ts
 * Locator: WC-JDE-FUNDGRNT-001
 * Purpose: Comprehensive Fund & Grant Accounting - JD Edwards EnterpriseOne-level fund structures, fund balances, grant management, grant budgets, compliance
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit, budget-management-kit
 * Downstream: ../backend/financial/*, Grant Services, Fund Accounting, Grant Billing, Compliance Reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for fund structures, fund balances, fund restrictions, grant management, grant budgets, grant reporting, fund compliance, cost sharing, indirect costs, grant billing
 *
 * LLM Context: Enterprise-grade fund and grant accounting operations for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive fund structure management, fund balance tracking, fund restriction enforcement,
 * grant lifecycle management, grant budget control, grant reporting, fund compliance validation,
 * cost sharing allocation, indirect cost calculation, grant billing, advance management, award tracking,
 * federal compliance (2 CFR 200), audit trails, grant closeout, and multi-fund consolidation.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateFundDto = (() => {
    var _a;
    let _fundCode_decorators;
    let _fundCode_initializers = [];
    let _fundCode_extraInitializers = [];
    let _fundName_decorators;
    let _fundName_initializers = [];
    let _fundName_extraInitializers = [];
    let _fundType_decorators;
    let _fundType_initializers = [];
    let _fundType_extraInitializers = [];
    let _fundCategory_decorators;
    let _fundCategory_initializers = [];
    let _fundCategory_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _restrictionLevel_decorators;
    let _restrictionLevel_initializers = [];
    let _restrictionLevel_extraInitializers = [];
    let _isGrantFund_decorators;
    let _isGrantFund_initializers = [];
    let _isGrantFund_extraInitializers = [];
    return _a = class CreateFundDto {
            constructor() {
                this.fundCode = __runInitializers(this, _fundCode_initializers, void 0);
                this.fundName = (__runInitializers(this, _fundCode_extraInitializers), __runInitializers(this, _fundName_initializers, void 0));
                this.fundType = (__runInitializers(this, _fundName_extraInitializers), __runInitializers(this, _fundType_initializers, void 0));
                this.fundCategory = (__runInitializers(this, _fundType_extraInitializers), __runInitializers(this, _fundCategory_initializers, void 0));
                this.organizationId = (__runInitializers(this, _fundCategory_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
                this.restrictionLevel = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _restrictionLevel_initializers, void 0));
                this.isGrantFund = (__runInitializers(this, _restrictionLevel_extraInitializers), __runInitializers(this, _isGrantFund_initializers, void 0));
                __runInitializers(this, _isGrantFund_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fundCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fund code', example: 'FUND-001' })];
            _fundName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fund name', example: 'General Fund' })];
            _fundType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fund type', enum: ['general', 'special_revenue', 'capital_projects', 'debt_service', 'enterprise', 'internal_service', 'trust', 'agency'] })];
            _fundCategory_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fund category', enum: ['governmental', 'proprietary', 'fiduciary'] })];
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' })];
            _restrictionLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Restriction level', enum: ['unrestricted', 'temporarily_restricted', 'permanently_restricted'] })];
            _isGrantFund_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is grant fund', default: false })];
            __esDecorate(null, null, _fundCode_decorators, { kind: "field", name: "fundCode", static: false, private: false, access: { has: obj => "fundCode" in obj, get: obj => obj.fundCode, set: (obj, value) => { obj.fundCode = value; } }, metadata: _metadata }, _fundCode_initializers, _fundCode_extraInitializers);
            __esDecorate(null, null, _fundName_decorators, { kind: "field", name: "fundName", static: false, private: false, access: { has: obj => "fundName" in obj, get: obj => obj.fundName, set: (obj, value) => { obj.fundName = value; } }, metadata: _metadata }, _fundName_initializers, _fundName_extraInitializers);
            __esDecorate(null, null, _fundType_decorators, { kind: "field", name: "fundType", static: false, private: false, access: { has: obj => "fundType" in obj, get: obj => obj.fundType, set: (obj, value) => { obj.fundType = value; } }, metadata: _metadata }, _fundType_initializers, _fundType_extraInitializers);
            __esDecorate(null, null, _fundCategory_decorators, { kind: "field", name: "fundCategory", static: false, private: false, access: { has: obj => "fundCategory" in obj, get: obj => obj.fundCategory, set: (obj, value) => { obj.fundCategory = value; } }, metadata: _metadata }, _fundCategory_initializers, _fundCategory_extraInitializers);
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _restrictionLevel_decorators, { kind: "field", name: "restrictionLevel", static: false, private: false, access: { has: obj => "restrictionLevel" in obj, get: obj => obj.restrictionLevel, set: (obj, value) => { obj.restrictionLevel = value; } }, metadata: _metadata }, _restrictionLevel_initializers, _restrictionLevel_extraInitializers);
            __esDecorate(null, null, _isGrantFund_decorators, { kind: "field", name: "isGrantFund", static: false, private: false, access: { has: obj => "isGrantFund" in obj, get: obj => obj.isGrantFund, set: (obj, value) => { obj.isGrantFund = value; } }, metadata: _metadata }, _isGrantFund_initializers, _isGrantFund_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateFundDto = CreateFundDto;
let CreateGrantAwardDto = (() => {
    var _a;
    let _grantNumber_decorators;
    let _grantNumber_initializers = [];
    let _grantNumber_extraInitializers = [];
    let _grantName_decorators;
    let _grantName_initializers = [];
    let _grantName_extraInitializers = [];
    let _fundId_decorators;
    let _fundId_initializers = [];
    let _fundId_extraInitializers = [];
    let _grantorId_decorators;
    let _grantorId_initializers = [];
    let _grantorId_extraInitializers = [];
    let _grantType_decorators;
    let _grantType_initializers = [];
    let _grantType_extraInitializers = [];
    let _awardAmount_decorators;
    let _awardAmount_initializers = [];
    let _awardAmount_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _indirectCostRate_decorators;
    let _indirectCostRate_initializers = [];
    let _indirectCostRate_extraInitializers = [];
    let _costSharingRequired_decorators;
    let _costSharingRequired_initializers = [];
    let _costSharingRequired_extraInitializers = [];
    return _a = class CreateGrantAwardDto {
            constructor() {
                this.grantNumber = __runInitializers(this, _grantNumber_initializers, void 0);
                this.grantName = (__runInitializers(this, _grantNumber_extraInitializers), __runInitializers(this, _grantName_initializers, void 0));
                this.fundId = (__runInitializers(this, _grantName_extraInitializers), __runInitializers(this, _fundId_initializers, void 0));
                this.grantorId = (__runInitializers(this, _fundId_extraInitializers), __runInitializers(this, _grantorId_initializers, void 0));
                this.grantType = (__runInitializers(this, _grantorId_extraInitializers), __runInitializers(this, _grantType_initializers, void 0));
                this.awardAmount = (__runInitializers(this, _grantType_extraInitializers), __runInitializers(this, _awardAmount_initializers, void 0));
                this.startDate = (__runInitializers(this, _awardAmount_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.indirectCostRate = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _indirectCostRate_initializers, void 0));
                this.costSharingRequired = (__runInitializers(this, _indirectCostRate_extraInitializers), __runInitializers(this, _costSharingRequired_initializers, void 0));
                __runInitializers(this, _costSharingRequired_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _grantNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Grant number', example: 'GR-2024-001' })];
            _grantName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Grant name' })];
            _fundId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fund ID' })];
            _grantorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Grantor ID' })];
            _grantType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Grant type', enum: ['federal', 'state', 'local', 'foundation', 'corporate', 'individual'] })];
            _awardAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Award amount' })];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' })];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' })];
            _indirectCostRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Indirect cost rate', default: 0 })];
            _costSharingRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost sharing required', default: false })];
            __esDecorate(null, null, _grantNumber_decorators, { kind: "field", name: "grantNumber", static: false, private: false, access: { has: obj => "grantNumber" in obj, get: obj => obj.grantNumber, set: (obj, value) => { obj.grantNumber = value; } }, metadata: _metadata }, _grantNumber_initializers, _grantNumber_extraInitializers);
            __esDecorate(null, null, _grantName_decorators, { kind: "field", name: "grantName", static: false, private: false, access: { has: obj => "grantName" in obj, get: obj => obj.grantName, set: (obj, value) => { obj.grantName = value; } }, metadata: _metadata }, _grantName_initializers, _grantName_extraInitializers);
            __esDecorate(null, null, _fundId_decorators, { kind: "field", name: "fundId", static: false, private: false, access: { has: obj => "fundId" in obj, get: obj => obj.fundId, set: (obj, value) => { obj.fundId = value; } }, metadata: _metadata }, _fundId_initializers, _fundId_extraInitializers);
            __esDecorate(null, null, _grantorId_decorators, { kind: "field", name: "grantorId", static: false, private: false, access: { has: obj => "grantorId" in obj, get: obj => obj.grantorId, set: (obj, value) => { obj.grantorId = value; } }, metadata: _metadata }, _grantorId_initializers, _grantorId_extraInitializers);
            __esDecorate(null, null, _grantType_decorators, { kind: "field", name: "grantType", static: false, private: false, access: { has: obj => "grantType" in obj, get: obj => obj.grantType, set: (obj, value) => { obj.grantType = value; } }, metadata: _metadata }, _grantType_initializers, _grantType_extraInitializers);
            __esDecorate(null, null, _awardAmount_decorators, { kind: "field", name: "awardAmount", static: false, private: false, access: { has: obj => "awardAmount" in obj, get: obj => obj.awardAmount, set: (obj, value) => { obj.awardAmount = value; } }, metadata: _metadata }, _awardAmount_initializers, _awardAmount_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _indirectCostRate_decorators, { kind: "field", name: "indirectCostRate", static: false, private: false, access: { has: obj => "indirectCostRate" in obj, get: obj => obj.indirectCostRate, set: (obj, value) => { obj.indirectCostRate = value; } }, metadata: _metadata }, _indirectCostRate_initializers, _indirectCostRate_extraInitializers);
            __esDecorate(null, null, _costSharingRequired_decorators, { kind: "field", name: "costSharingRequired", static: false, private: false, access: { has: obj => "costSharingRequired" in obj, get: obj => obj.costSharingRequired, set: (obj, value) => { obj.costSharingRequired = value; } }, metadata: _metadata }, _costSharingRequired_initializers, _costSharingRequired_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateGrantAwardDto = CreateGrantAwardDto;
let GrantExpenditureDto = (() => {
    var _a;
    let _grantId_decorators;
    let _grantId_initializers = [];
    let _grantId_extraInitializers = [];
    let _transactionDate_decorators;
    let _transactionDate_initializers = [];
    let _transactionDate_extraInitializers = [];
    let _accountCode_decorators;
    let _accountCode_initializers = [];
    let _accountCode_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _costType_decorators;
    let _costType_initializers = [];
    let _costType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    return _a = class GrantExpenditureDto {
            constructor() {
                this.grantId = __runInitializers(this, _grantId_initializers, void 0);
                this.transactionDate = (__runInitializers(this, _grantId_extraInitializers), __runInitializers(this, _transactionDate_initializers, void 0));
                this.accountCode = (__runInitializers(this, _transactionDate_extraInitializers), __runInitializers(this, _accountCode_initializers, void 0));
                this.amount = (__runInitializers(this, _accountCode_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.costType = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _costType_initializers, void 0));
                this.description = (__runInitializers(this, _costType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _grantId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Grant ID' })];
            _transactionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transaction date' })];
            _accountCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account code' })];
            _amount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Amount' })];
            _costType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost type', enum: ['direct', 'indirect', 'cost_sharing'] })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' })];
            __esDecorate(null, null, _grantId_decorators, { kind: "field", name: "grantId", static: false, private: false, access: { has: obj => "grantId" in obj, get: obj => obj.grantId, set: (obj, value) => { obj.grantId = value; } }, metadata: _metadata }, _grantId_initializers, _grantId_extraInitializers);
            __esDecorate(null, null, _transactionDate_decorators, { kind: "field", name: "transactionDate", static: false, private: false, access: { has: obj => "transactionDate" in obj, get: obj => obj.transactionDate, set: (obj, value) => { obj.transactionDate = value; } }, metadata: _metadata }, _transactionDate_initializers, _transactionDate_extraInitializers);
            __esDecorate(null, null, _accountCode_decorators, { kind: "field", name: "accountCode", static: false, private: false, access: { has: obj => "accountCode" in obj, get: obj => obj.accountCode, set: (obj, value) => { obj.accountCode = value; } }, metadata: _metadata }, _accountCode_initializers, _accountCode_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _costType_decorators, { kind: "field", name: "costType", static: false, private: false, access: { has: obj => "costType" in obj, get: obj => obj.costType, set: (obj, value) => { obj.costType = value; } }, metadata: _metadata }, _costType_initializers, _costType_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.GrantExpenditureDto = GrantExpenditureDto;
let GrantBillingDto = (() => {
    var _a;
    let _grantId_decorators;
    let _grantId_initializers = [];
    let _grantId_extraInitializers = [];
    let _billingPeriodStart_decorators;
    let _billingPeriodStart_initializers = [];
    let _billingPeriodStart_extraInitializers = [];
    let _billingPeriodEnd_decorators;
    let _billingPeriodEnd_initializers = [];
    let _billingPeriodEnd_extraInitializers = [];
    let _directCosts_decorators;
    let _directCosts_initializers = [];
    let _directCosts_extraInitializers = [];
    let _indirectCosts_decorators;
    let _indirectCosts_initializers = [];
    let _indirectCosts_extraInitializers = [];
    return _a = class GrantBillingDto {
            constructor() {
                this.grantId = __runInitializers(this, _grantId_initializers, void 0);
                this.billingPeriodStart = (__runInitializers(this, _grantId_extraInitializers), __runInitializers(this, _billingPeriodStart_initializers, void 0));
                this.billingPeriodEnd = (__runInitializers(this, _billingPeriodStart_extraInitializers), __runInitializers(this, _billingPeriodEnd_initializers, void 0));
                this.directCosts = (__runInitializers(this, _billingPeriodEnd_extraInitializers), __runInitializers(this, _directCosts_initializers, void 0));
                this.indirectCosts = (__runInitializers(this, _directCosts_extraInitializers), __runInitializers(this, _indirectCosts_initializers, void 0));
                __runInitializers(this, _indirectCosts_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _grantId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Grant ID' })];
            _billingPeriodStart_decorators = [(0, swagger_1.ApiProperty)({ description: 'Billing period start' })];
            _billingPeriodEnd_decorators = [(0, swagger_1.ApiProperty)({ description: 'Billing period end' })];
            _directCosts_decorators = [(0, swagger_1.ApiProperty)({ description: 'Direct costs' })];
            _indirectCosts_decorators = [(0, swagger_1.ApiProperty)({ description: 'Indirect costs' })];
            __esDecorate(null, null, _grantId_decorators, { kind: "field", name: "grantId", static: false, private: false, access: { has: obj => "grantId" in obj, get: obj => obj.grantId, set: (obj, value) => { obj.grantId = value; } }, metadata: _metadata }, _grantId_initializers, _grantId_extraInitializers);
            __esDecorate(null, null, _billingPeriodStart_decorators, { kind: "field", name: "billingPeriodStart", static: false, private: false, access: { has: obj => "billingPeriodStart" in obj, get: obj => obj.billingPeriodStart, set: (obj, value) => { obj.billingPeriodStart = value; } }, metadata: _metadata }, _billingPeriodStart_initializers, _billingPeriodStart_extraInitializers);
            __esDecorate(null, null, _billingPeriodEnd_decorators, { kind: "field", name: "billingPeriodEnd", static: false, private: false, access: { has: obj => "billingPeriodEnd" in obj, get: obj => obj.billingPeriodEnd, set: (obj, value) => { obj.billingPeriodEnd = value; } }, metadata: _metadata }, _billingPeriodEnd_initializers, _billingPeriodEnd_extraInitializers);
            __esDecorate(null, null, _directCosts_decorators, { kind: "field", name: "directCosts", static: false, private: false, access: { has: obj => "directCosts" in obj, get: obj => obj.directCosts, set: (obj, value) => { obj.directCosts = value; } }, metadata: _metadata }, _directCosts_initializers, _directCosts_extraInitializers);
            __esDecorate(null, null, _indirectCosts_decorators, { kind: "field", name: "indirectCosts", static: false, private: false, access: { has: obj => "indirectCosts" in obj, get: obj => obj.indirectCosts, set: (obj, value) => { obj.indirectCosts = value; } }, metadata: _metadata }, _indirectCosts_initializers, _indirectCosts_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.GrantBillingDto = GrantBillingDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Fund Structure with hierarchical relationships.
 *
 * Associations:
 * - hasMany: FundBalance, FundRestriction, GrantAward, FundTransfer (as source/destination)
 * - belongsTo: FundStructure (parent fund for hierarchical structure)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FundStructure model
 *
 * @example
 * ```typescript
 * const Fund = createFundStructureModel(sequelize);
 * const fund = await Fund.findOne({
 *   where: { fundCode: 'FUND-001' },
 *   include: [
 *     { model: FundBalance, as: 'balances' },
 *     { model: FundRestriction, as: 'restrictions' },
 *     { model: GrantAward, as: 'grants' }
 *   ]
 * });
 * ```
 */
const createFundStructureModel = (sequelize) => {
    class FundStructure extends sequelize_1.Model {
    }
    FundStructure.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fundCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique fund code',
        },
        fundName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Fund name',
        },
        fundType: {
            type: sequelize_1.DataTypes.ENUM('general', 'special_revenue', 'capital_projects', 'debt_service', 'enterprise', 'internal_service', 'trust', 'agency'),
            allowNull: false,
            comment: 'Fund type per GASB classification',
        },
        fundCategory: {
            type: sequelize_1.DataTypes.ENUM('governmental', 'proprietary', 'fiduciary'),
            allowNull: false,
            comment: 'Fund category',
        },
        parentFundId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Parent fund for hierarchical structure',
            references: {
                model: 'fund_structures',
                key: 'id',
            },
        },
        organizationId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Organization ID',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'closed'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Fund status',
        },
        fiscalYearEnd: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Fiscal year end date',
        },
        restrictionLevel: {
            type: sequelize_1.DataTypes.ENUM('unrestricted', 'temporarily_restricted', 'permanently_restricted'),
            allowNull: false,
            defaultValue: 'unrestricted',
            comment: 'Net asset restriction level',
        },
        isGrantFund: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether this is a grant fund',
        },
        requiresCompliance: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether compliance checking is required',
        },
        complianceFramework: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Compliance framework (2 CFR 200, etc.)',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'fund_structures',
        timestamps: true,
        indexes: [
            { fields: ['fundCode'], unique: true },
            { fields: ['fundType'] },
            { fields: ['organizationId'] },
            { fields: ['status'] },
            { fields: ['parentFundId'] },
        ],
    });
    return FundStructure;
};
exports.createFundStructureModel = createFundStructureModel;
/**
 * Sequelize model for Grant Awards with comprehensive tracking.
 *
 * Associations:
 * - belongsTo: FundStructure
 * - hasMany: GrantBudget, GrantExpenditure, GrantBilling, GrantAdvance, GrantReport, CostSharingCommitment
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GrantAward model
 */
const createGrantAwardModel = (sequelize) => {
    class GrantAward extends sequelize_1.Model {
    }
    GrantAward.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        grantNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique grant number',
        },
        grantName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Grant name',
        },
        fundId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to fund',
            references: {
                model: 'fund_structures',
                key: 'id',
            },
        },
        grantorId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Grantor organization ID',
        },
        grantorName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Grantor name',
        },
        grantType: {
            type: sequelize_1.DataTypes.ENUM('federal', 'state', 'local', 'foundation', 'corporate', 'individual'),
            allowNull: false,
            comment: 'Grant type',
        },
        federalAwardNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Federal award identification number',
        },
        cfdaNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
            comment: 'Catalog of Federal Domestic Assistance number',
        },
        awardAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Total award amount',
        },
        awardDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Award date',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Grant start date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Grant end date',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('awarded', 'active', 'completed', 'closed', 'terminated', 'suspended'),
            allowNull: false,
            defaultValue: 'awarded',
            comment: 'Grant status',
        },
        principalInvestigator: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Principal investigator',
        },
        programManager: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Program manager',
        },
        indirectCostRate: {
            type: sequelize_1.DataTypes.DECIMAL(5, 4),
            allowNull: false,
            defaultValue: 0,
            comment: 'Indirect cost rate (F&A rate)',
        },
        costSharingRequired: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether cost sharing is required',
        },
        costSharingAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Required cost sharing amount',
        },
        complianceRequirements: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Compliance requirements',
        },
        totalExpended: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total expended to date',
        },
        totalBilled: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total billed to date',
        },
        remainingBalance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Remaining balance',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'grant_awards',
        timestamps: true,
        indexes: [
            { fields: ['grantNumber'], unique: true },
            { fields: ['fundId'] },
            { fields: ['grantType'] },
            { fields: ['status'] },
            { fields: ['startDate', 'endDate'] },
            { fields: ['cfdaNumber'] },
        ],
    });
    return GrantAward;
};
exports.createGrantAwardModel = createGrantAwardModel;
/**
 * Sequelize model for Grant Budgets with version control.
 *
 * Associations:
 * - belongsTo: GrantAward
 * - hasMany: GrantBudgetLine
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GrantBudget model
 */
const createGrantBudgetModel = (sequelize) => {
    class GrantBudget extends sequelize_1.Model {
    }
    GrantBudget.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        grantId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to grant award',
            references: {
                model: 'grant_awards',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        budgetVersion: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Budget version number',
        },
        budgetType: {
            type: sequelize_1.DataTypes.ENUM('original', 'revised', 'current'),
            allowNull: false,
            defaultValue: 'original',
            comment: 'Budget type',
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
        },
        totalBudget: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total budget amount',
        },
        directCostsBudget: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Direct costs budget',
        },
        indirectCostsBudget: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Indirect costs budget (F&A)',
        },
        costSharingBudget: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Cost sharing budget',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'submitted', 'approved', 'active', 'expired'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Budget status',
        },
        approvedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval date',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Approved by',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Budget notes',
        },
    }, {
        sequelize,
        tableName: 'grant_budgets',
        timestamps: true,
        indexes: [
            { fields: ['grantId', 'budgetVersion'], unique: true },
            { fields: ['fiscalYear'] },
            { fields: ['status'] },
        ],
    });
    return GrantBudget;
};
exports.createGrantBudgetModel = createGrantBudgetModel;
// ============================================================================
// FUND STRUCTURE OPERATIONS
// ============================================================================
/**
 * Creates a new fund structure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateFundDto} fundData - Fund data
 * @param {string} userId - User creating the fund
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created fund
 *
 * @example
 * ```typescript
 * const fund = await createFund(sequelize, {
 *   fundCode: 'FUND-001',
 *   fundName: 'General Fund',
 *   fundType: 'general',
 *   fundCategory: 'governmental',
 *   organizationId: 1,
 *   restrictionLevel: 'unrestricted'
 * }, 'user123');
 * ```
 */
const createFund = async (sequelize, fundData, userId, transaction) => {
    const FundStructure = (0, exports.createFundStructureModel)(sequelize);
    // Check for duplicate fund code
    const existing = await FundStructure.findOne({
        where: { fundCode: fundData.fundCode },
        transaction,
    });
    if (existing) {
        throw new Error(`Fund code ${fundData.fundCode} already exists`);
    }
    const fund = await FundStructure.create({
        ...fundData,
        status: 'active',
        metadata: { createdBy: userId },
    }, { transaction });
    return fund;
};
exports.createFund = createFund;
/**
 * Retrieves fund structure with balances and restrictions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fundId - Fund ID
 * @param {number} [fiscalYear] - Optional fiscal year filter
 * @returns {Promise<any>} Fund with balances and restrictions
 *
 * @example
 * ```typescript
 * const fund = await getFundWithDetails(sequelize, 1, 2024);
 * console.log(fund.balances, fund.restrictions);
 * ```
 */
const getFundWithDetails = async (sequelize, fundId, fiscalYear) => {
    const FundStructure = (0, exports.createFundStructureModel)(sequelize);
    const fund = await FundStructure.findByPk(fundId);
    if (!fund) {
        throw new Error('Fund not found');
    }
    // Get balances
    const balanceQuery = `
    SELECT
      account_code,
      balance_type,
      SUM(debit_amount) as total_debit,
      SUM(credit_amount) as total_credit,
      SUM(net_balance) as net_balance
    FROM fund_balances
    WHERE fund_id = :fundId
    ${fiscalYear ? 'AND fiscal_year = :fiscalYear' : ''}
    GROUP BY account_code, balance_type
  `;
    const balances = await sequelize.query(balanceQuery, {
        replacements: { fundId, fiscalYear },
        type: 'SELECT',
    });
    // Get restrictions
    const restrictionQuery = `
    SELECT * FROM fund_restrictions
    WHERE fund_id = :fundId AND status = 'active'
    ORDER BY effective_date DESC
  `;
    const restrictions = await sequelize.query(restrictionQuery, {
        replacements: { fundId },
        type: 'SELECT',
    });
    return {
        ...fund.toJSON(),
        balances,
        restrictions,
    };
};
exports.getFundWithDetails = getFundWithDetails;
/**
 * Updates fund balance for a fiscal period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fundId - Fund ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} accountId - Account ID
 * @param {number} debitAmount - Debit amount
 * @param {number} creditAmount - Credit amount
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated balance
 *
 * @example
 * ```typescript
 * await updateFundBalance(sequelize, 1, 2024, 1, 1000, 1000, 0);
 * ```
 */
const updateFundBalance = async (sequelize, fundId, fiscalYear, fiscalPeriod, accountId, debitAmount, creditAmount, transaction) => {
    const query = `
    INSERT INTO fund_balances (
      fund_id, fiscal_year, fiscal_period, account_id,
      balance_type, debit_amount, credit_amount, net_balance,
      created_at, updated_at
    ) VALUES (
      :fundId, :fiscalYear, :fiscalPeriod, :accountId,
      'current', :debitAmount, :creditAmount, :debitAmount - :creditAmount,
      NOW(), NOW()
    )
    ON CONFLICT (fund_id, fiscal_year, fiscal_period, account_id, balance_type)
    DO UPDATE SET
      debit_amount = fund_balances.debit_amount + :debitAmount,
      credit_amount = fund_balances.credit_amount + :creditAmount,
      net_balance = fund_balances.net_balance + (:debitAmount - :creditAmount),
      updated_at = NOW()
    RETURNING *
  `;
    const [result] = await sequelize.query(query, {
        replacements: { fundId, fiscalYear, fiscalPeriod, accountId, debitAmount, creditAmount },
        transaction,
    });
    return result;
};
exports.updateFundBalance = updateFundBalance;
/**
 * Adds a restriction to a fund.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fundId - Fund ID
 * @param {string} restrictionType - Restriction type
 * @param {string} restrictionCategory - Restriction category
 * @param {string} description - Description
 * @param {Date} effectiveDate - Effective date
 * @param {Date} [expirationDate] - Optional expiration date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created restriction
 *
 * @example
 * ```typescript
 * await addFundRestriction(sequelize, 1, 'donor', 'purpose',
 *   'Restricted for scholarship use', new Date());
 * ```
 */
const addFundRestriction = async (sequelize, fundId, restrictionType, restrictionCategory, description, effectiveDate, expirationDate, transaction) => {
    const query = `
    INSERT INTO fund_restrictions (
      fund_id, restriction_type, restriction_category,
      restriction_description, effective_date, expiration_date,
      compliance_rules, status, created_at, updated_at
    ) VALUES (
      :fundId, :restrictionType, :restrictionCategory,
      :description, :effectiveDate, :expirationDate,
      '{}', 'active', NOW(), NOW()
    )
    RETURNING *
  `;
    const [result] = await sequelize.query(query, {
        replacements: {
            fundId,
            restrictionType,
            restrictionCategory,
            description,
            effectiveDate,
            expirationDate,
        },
        transaction,
    });
    return result;
};
exports.addFundRestriction = addFundRestriction;
/**
 * Validates fund balance availability before transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fundId - Fund ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} amount - Amount to check
 * @returns {Promise<{ available: boolean; balance: number; message?: string }>} Availability result
 *
 * @example
 * ```typescript
 * const check = await validateFundAvailability(sequelize, 1, 2024, 5000);
 * if (!check.available) {
 *   throw new Error(check.message);
 * }
 * ```
 */
const validateFundAvailability = async (sequelize, fundId, fiscalYear, amount) => {
    const query = `
    SELECT
      SUM(net_balance) - SUM(encumbered_balance) as available_balance
    FROM fund_balances
    WHERE fund_id = :fundId AND fiscal_year = :fiscalYear
  `;
    const [result] = await sequelize.query(query, {
        replacements: { fundId, fiscalYear },
        type: 'SELECT',
    });
    const availableBalance = parseFloat(result?.available_balance || '0');
    if (availableBalance < amount) {
        return {
            available: false,
            balance: availableBalance,
            message: `Insufficient funds. Available: ${availableBalance}, Required: ${amount}`,
        };
    }
    return {
        available: true,
        balance: availableBalance,
    };
};
exports.validateFundAvailability = validateFundAvailability;
/**
 * Calculates fund balance by type (unrestricted, restricted, etc.).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fundId - Fund ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<Record<string, number>>} Balance breakdown
 *
 * @example
 * ```typescript
 * const balances = await calculateFundBalancesByType(sequelize, 1, 2024);
 * console.log(balances.unrestricted, balances.restricted);
 * ```
 */
const calculateFundBalancesByType = async (sequelize, fundId, fiscalYear) => {
    const query = `
    SELECT
      SUM(unrestricted_balance) as unrestricted,
      SUM(restricted_balance) as restricted,
      SUM(encumbered_balance) as encumbered,
      SUM(available_balance) as available
    FROM fund_balances
    WHERE fund_id = :fundId AND fiscal_year = :fiscalYear
  `;
    const [result] = await sequelize.query(query, {
        replacements: { fundId, fiscalYear },
        type: 'SELECT',
    });
    return {
        unrestricted: parseFloat(result?.unrestricted || '0'),
        restricted: parseFloat(result?.restricted || '0'),
        encumbered: parseFloat(result?.encumbered || '0'),
        available: parseFloat(result?.available || '0'),
    };
};
exports.calculateFundBalancesByType = calculateFundBalancesByType;
// ============================================================================
// GRANT AWARD OPERATIONS
// ============================================================================
/**
 * Creates a new grant award.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateGrantAwardDto} grantData - Grant award data
 * @param {string} userId - User creating the grant
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created grant award
 *
 * @example
 * ```typescript
 * const grant = await createGrantAward(sequelize, {
 *   grantNumber: 'GR-2024-001',
 *   grantName: 'Research Grant',
 *   fundId: 1,
 *   grantorId: 100,
 *   grantType: 'federal',
 *   awardAmount: 500000,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2025-12-31')
 * }, 'user123');
 * ```
 */
const createGrantAward = async (sequelize, grantData, userId, transaction) => {
    const GrantAward = (0, exports.createGrantAwardModel)(sequelize);
    // Check for duplicate grant number
    const existing = await GrantAward.findOne({
        where: { grantNumber: grantData.grantNumber },
        transaction,
    });
    if (existing) {
        throw new Error(`Grant number ${grantData.grantNumber} already exists`);
    }
    // Calculate remaining balance
    const remainingBalance = grantData.awardAmount;
    const grant = await GrantAward.create({
        ...grantData,
        status: 'awarded',
        totalExpended: 0,
        totalBilled: 0,
        remainingBalance,
        complianceRequirements: grantData.grantType === 'federal' ? ['2 CFR 200'] : [],
        metadata: { createdBy: userId },
    }, { transaction });
    return grant;
};
exports.createGrantAward = createGrantAward;
/**
 * Retrieves grant award with budget, expenditures, and billing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @returns {Promise<any>} Grant with comprehensive details
 *
 * @example
 * ```typescript
 * const grant = await getGrantWithDetails(sequelize, 1);
 * console.log(grant.budget, grant.expenditures, grant.billing);
 * ```
 */
const getGrantWithDetails = async (sequelize, grantId) => {
    const GrantAward = (0, exports.createGrantAwardModel)(sequelize);
    const grant = await GrantAward.findByPk(grantId);
    if (!grant) {
        throw new Error('Grant not found');
    }
    // Get current budget
    const budgetQuery = `
    SELECT * FROM grant_budgets
    WHERE grant_id = :grantId AND status = 'active'
    ORDER BY budget_version DESC
    LIMIT 1
  `;
    const [budget] = await sequelize.query(budgetQuery, {
        replacements: { grantId },
        type: 'SELECT',
    });
    // Get budget lines
    if (budget) {
        const linesQuery = `
      SELECT * FROM grant_budget_lines
      WHERE budget_id = :budgetId
      ORDER BY line_number
    `;
        budget.lines = await sequelize.query(linesQuery, {
            replacements: { budgetId: budget.id },
            type: 'SELECT',
        });
    }
    // Get expenditures summary
    const expendituresQuery = `
    SELECT
      cost_type,
      COUNT(*) as transaction_count,
      SUM(amount) as total_amount
    FROM grant_expenditures
    WHERE grant_id = :grantId
    GROUP BY cost_type
  `;
    const expenditures = await sequelize.query(expendituresQuery, {
        replacements: { grantId },
        type: 'SELECT',
    });
    // Get billing summary
    const billingQuery = `
    SELECT
      COUNT(*) as invoice_count,
      SUM(billing_amount) as total_billed,
      SUM(CASE WHEN status = 'paid' THEN payment_amount ELSE 0 END) as total_paid
    FROM grant_billings
    WHERE grant_id = :grantId
  `;
    const [billing] = await sequelize.query(billingQuery, {
        replacements: { grantId },
        type: 'SELECT',
    });
    return {
        ...grant.toJSON(),
        budget,
        expenditures,
        billing,
    };
};
exports.getGrantWithDetails = getGrantWithDetails;
/**
 * Updates grant award status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {string} newStatus - New status
 * @param {string} userId - User performing the update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated grant
 *
 * @example
 * ```typescript
 * await updateGrantStatus(sequelize, 1, 'active', 'user123');
 * ```
 */
const updateGrantStatus = async (sequelize, grantId, newStatus, userId, transaction) => {
    const GrantAward = (0, exports.createGrantAwardModel)(sequelize);
    const grant = await GrantAward.findByPk(grantId, { transaction });
    if (!grant) {
        throw new Error('Grant not found');
    }
    const validStatuses = ['awarded', 'active', 'completed', 'closed', 'terminated', 'suspended'];
    if (!validStatuses.includes(newStatus)) {
        throw new Error(`Invalid status: ${newStatus}`);
    }
    await grant.update({
        status: newStatus,
        metadata: { ...grant.metadata, lastStatusChange: { by: userId, at: new Date() } },
    }, { transaction });
    return grant;
};
exports.updateGrantStatus = updateGrantStatus;
/**
 * Validates grant award dates and amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateGrantAward(sequelize, 1);
 * if (!validation.valid) {
 *   console.log('Errors:', validation.errors);
 * }
 * ```
 */
const validateGrantAward = async (sequelize, grantId) => {
    const GrantAward = (0, exports.createGrantAwardModel)(sequelize);
    const errors = [];
    const grant = await GrantAward.findByPk(grantId);
    if (!grant) {
        return { valid: false, errors: ['Grant not found'] };
    }
    // Validate dates
    if (grant.startDate >= grant.endDate) {
        errors.push('End date must be after start date');
    }
    // Validate award amount
    if (grant.awardAmount <= 0) {
        errors.push('Award amount must be greater than zero');
    }
    // Validate expenditures don't exceed award
    if (grant.totalExpended > grant.awardAmount) {
        errors.push('Total expenditures exceed award amount');
    }
    // Validate indirect cost rate
    if (grant.indirectCostRate < 0 || grant.indirectCostRate > 1) {
        errors.push('Indirect cost rate must be between 0 and 1');
    }
    // Validate cost sharing if required
    if (grant.costSharingRequired && grant.costSharingAmount <= 0) {
        errors.push('Cost sharing amount is required but not specified');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateGrantAward = validateGrantAward;
// ============================================================================
// GRANT BUDGET OPERATIONS
// ============================================================================
/**
 * Creates a grant budget with lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {number} fiscalYear - Fiscal year
 * @param {Array<{ categoryCode: string; accountCode: string; budgetAmount: number; costType: string }>} budgetLines - Budget lines
 * @param {string} userId - User creating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created budget with lines
 *
 * @example
 * ```typescript
 * const budget = await createGrantBudget(sequelize, 1, 2024, [
 *   { categoryCode: 'SALARY', accountCode: '6000', budgetAmount: 100000, costType: 'direct' },
 *   { categoryCode: 'SUPPLIES', accountCode: '6500', budgetAmount: 25000, costType: 'direct' }
 * ], 'user123');
 * ```
 */
const createGrantBudget = async (sequelize, grantId, fiscalYear, budgetLines, userId, transaction) => {
    const GrantBudget = (0, exports.createGrantBudgetModel)(sequelize);
    // Calculate totals
    let totalBudget = 0;
    let directCostsBudget = 0;
    let indirectCostsBudget = 0;
    let costSharingBudget = 0;
    for (const line of budgetLines) {
        totalBudget += line.budgetAmount;
        if (line.costType === 'direct') {
            directCostsBudget += line.budgetAmount;
        }
        else if (line.costType === 'indirect') {
            indirectCostsBudget += line.budgetAmount;
        }
        else if (line.costType === 'cost_sharing') {
            costSharingBudget += line.budgetAmount;
        }
    }
    // Get next version number
    const [maxVersion] = await sequelize.query(`SELECT COALESCE(MAX(budget_version), 0) + 1 as next_version
     FROM grant_budgets WHERE grant_id = :grantId`, {
        replacements: { grantId },
        type: 'SELECT',
        transaction,
    });
    const budgetVersion = maxVersion?.next_version || 1;
    const budget = await GrantBudget.create({
        grantId,
        budgetVersion,
        budgetType: budgetVersion === 1 ? 'original' : 'revised',
        fiscalYear,
        totalBudget,
        directCostsBudget,
        indirectCostsBudget,
        costSharingBudget,
        status: 'draft',
    }, { transaction });
    // Create budget lines
    for (let i = 0; i < budgetLines.length; i++) {
        const line = budgetLines[i];
        await sequelize.query(`INSERT INTO grant_budget_lines (
        budget_id, grant_id, line_number, category_code, account_code,
        budget_amount, expended_amount, encumbered_amount, available_amount,
        cost_type, allowable, allocable, reasonable, created_at, updated_at
      ) VALUES (
        :budgetId, :grantId, :lineNumber, :categoryCode, :accountCode,
        :budgetAmount, 0, 0, :budgetAmount,
        :costType, true, true, true, NOW(), NOW()
      )`, {
            replacements: {
                budgetId: budget.id,
                grantId,
                lineNumber: i + 1,
                categoryCode: line.categoryCode,
                accountCode: line.accountCode,
                budgetAmount: line.budgetAmount,
                costType: line.costType,
            },
            transaction,
        });
    }
    return budget;
};
exports.createGrantBudget = createGrantBudget;
/**
 * Approves a grant budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {string} userId - User approving the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved budget
 *
 * @example
 * ```typescript
 * await approveGrantBudget(sequelize, 1, 'user123');
 * ```
 */
const approveGrantBudget = async (sequelize, budgetId, userId, transaction) => {
    const GrantBudget = (0, exports.createGrantBudgetModel)(sequelize);
    const budget = await GrantBudget.findByPk(budgetId, { transaction });
    if (!budget) {
        throw new Error('Budget not found');
    }
    if (budget.status !== 'submitted' && budget.status !== 'draft') {
        throw new Error(`Cannot approve budget with status ${budget.status}`);
    }
    // Deactivate previous budgets for same grant
    await sequelize.query(`UPDATE grant_budgets SET status = 'expired'
     WHERE grant_id = :grantId AND id != :budgetId AND status = 'active'`, {
        replacements: { grantId: budget.grantId, budgetId },
        transaction,
    });
    await budget.update({
        status: 'active',
        approvedBy: userId,
        approvedDate: new Date(),
    }, { transaction });
    return budget;
};
exports.approveGrantBudget = approveGrantBudget;
/**
 * Retrieves grant budget with variance analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {number} [fiscalYear] - Optional fiscal year filter
 * @returns {Promise<any>} Budget with variance details
 *
 * @example
 * ```typescript
 * const analysis = await getGrantBudgetVariance(sequelize, 1, 2024);
 * console.log(analysis.variancePercent);
 * ```
 */
const getGrantBudgetVariance = async (sequelize, grantId, fiscalYear) => {
    const query = `
    SELECT
      gb.*,
      gbl.category_code,
      gbl.account_code,
      gbl.budget_amount,
      gbl.expended_amount,
      gbl.encumbered_amount,
      gbl.available_amount,
      gbl.budget_amount - gbl.expended_amount - gbl.encumbered_amount as variance,
      CASE
        WHEN gbl.budget_amount > 0 THEN
          ((gbl.budget_amount - gbl.expended_amount - gbl.encumbered_amount) / gbl.budget_amount) * 100
        ELSE 0
      END as variance_percent
    FROM grant_budgets gb
    JOIN grant_budget_lines gbl ON gb.id = gbl.budget_id
    WHERE gb.grant_id = :grantId
      AND gb.status = 'active'
      ${fiscalYear ? 'AND gb.fiscal_year = :fiscalYear' : ''}
    ORDER BY gbl.line_number
  `;
    const lines = await sequelize.query(query, {
        replacements: { grantId, fiscalYear },
        type: 'SELECT',
    });
    return lines;
};
exports.getGrantBudgetVariance = getGrantBudgetVariance;
/**
 * Checks budget availability for grant expenditure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {string} accountCode - Account code
 * @param {number} amount - Amount to check
 * @returns {Promise<{ available: boolean; budgetAmount: number; availableAmount: number; message?: string }>} Availability result
 *
 * @example
 * ```typescript
 * const check = await checkGrantBudgetAvailability(sequelize, 1, '6000', 5000);
 * if (!check.available) {
 *   throw new Error(check.message);
 * }
 * ```
 */
const checkGrantBudgetAvailability = async (sequelize, grantId, accountCode, amount) => {
    const query = `
    SELECT
      gbl.budget_amount,
      gbl.available_amount
    FROM grant_budgets gb
    JOIN grant_budget_lines gbl ON gb.id = gbl.budget_id
    WHERE gb.grant_id = :grantId
      AND gb.status = 'active'
      AND gbl.account_code = :accountCode
    LIMIT 1
  `;
    const [result] = await sequelize.query(query, {
        replacements: { grantId, accountCode },
        type: 'SELECT',
    });
    if (!result) {
        return {
            available: false,
            budgetAmount: 0,
            availableAmount: 0,
            message: `No active budget found for account ${accountCode}`,
        };
    }
    const availableAmount = parseFloat(result.available_amount);
    if (availableAmount < amount) {
        return {
            available: false,
            budgetAmount: parseFloat(result.budget_amount),
            availableAmount,
            message: `Insufficient budget. Available: ${availableAmount}, Required: ${amount}`,
        };
    }
    return {
        available: true,
        budgetAmount: parseFloat(result.budget_amount),
        availableAmount,
    };
};
exports.checkGrantBudgetAvailability = checkGrantBudgetAvailability;
// ============================================================================
// GRANT EXPENDITURE OPERATIONS
// ============================================================================
/**
 * Records a grant expenditure with compliance checking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {GrantExpenditureDto} expenditureData - Expenditure data
 * @param {string} userId - User recording the expenditure
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created expenditure
 *
 * @example
 * ```typescript
 * const expenditure = await recordGrantExpenditure(sequelize, {
 *   grantId: 1,
 *   transactionDate: new Date(),
 *   accountCode: '6000',
 *   amount: 5000,
 *   costType: 'direct',
 *   description: 'Laboratory supplies'
 * }, 'user123');
 * ```
 */
const recordGrantExpenditure = async (sequelize, expenditureData, userId, transaction) => {
    // Check budget availability
    const budgetCheck = await (0, exports.checkGrantBudgetAvailability)(sequelize, expenditureData.grantId, expenditureData.accountCode, expenditureData.amount);
    if (!budgetCheck.available) {
        throw new Error(budgetCheck.message);
    }
    // Perform compliance check
    const complianceCheck = await (0, exports.performComplianceCheck)(sequelize, expenditureData.grantId, expenditureData.amount, expenditureData.costType);
    // Record expenditure
    const query = `
    INSERT INTO grant_expenditures (
      grant_id, transaction_date, fiscal_year, fiscal_period,
      account_code, account_id, amount, cost_type, description,
      document_number, approved_by, approved_date,
      compliance_checked, allowable, allocable, reasonable,
      created_at, updated_at
    ) VALUES (
      :grantId, :transactionDate, EXTRACT(YEAR FROM :transactionDate), EXTRACT(MONTH FROM :transactionDate),
      :accountCode, (SELECT id FROM chart_of_accounts WHERE account_code = :accountCode LIMIT 1),
      :amount, :costType, :description,
      :documentNumber, :userId, NOW(),
      true, :allowable, :allocable, :reasonable,
      NOW(), NOW()
    )
    RETURNING *
  `;
    const [expenditure] = await sequelize.query(query, {
        replacements: {
            ...expenditureData,
            userId,
            documentNumber: `EXP-${Date.now()}`,
            allowable: complianceCheck.allowable,
            allocable: complianceCheck.allocable,
            reasonable: complianceCheck.reasonable,
        },
        transaction,
    });
    // Update budget line
    await sequelize.query(`UPDATE grant_budget_lines
     SET expended_amount = expended_amount + :amount,
         available_amount = available_amount - :amount,
         updated_at = NOW()
     WHERE grant_id = :grantId
       AND account_code = :accountCode
       AND budget_id IN (SELECT id FROM grant_budgets WHERE grant_id = :grantId AND status = 'active')`, {
        replacements: {
            grantId: expenditureData.grantId,
            accountCode: expenditureData.accountCode,
            amount: expenditureData.amount,
        },
        transaction,
    });
    // Update grant totals
    await sequelize.query(`UPDATE grant_awards
     SET total_expended = total_expended + :amount,
         remaining_balance = remaining_balance - :amount,
         updated_at = NOW()
     WHERE id = :grantId`, {
        replacements: { grantId: expenditureData.grantId, amount: expenditureData.amount },
        transaction,
    });
    return expenditure;
};
exports.recordGrantExpenditure = recordGrantExpenditure;
/**
 * Retrieves grant expenditures with filters.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {Date} [startDate] - Optional start date filter
 * @param {Date} [endDate] - Optional end date filter
 * @param {string} [costType] - Optional cost type filter
 * @returns {Promise<any[]>} Grant expenditures
 *
 * @example
 * ```typescript
 * const expenditures = await getGrantExpenditures(sequelize, 1,
 *   new Date('2024-01-01'), new Date('2024-12-31'), 'direct');
 * ```
 */
const getGrantExpenditures = async (sequelize, grantId, startDate, endDate, costType) => {
    let query = `
    SELECT * FROM grant_expenditures
    WHERE grant_id = :grantId
  `;
    const replacements = { grantId };
    if (startDate) {
        query += ` AND transaction_date >= :startDate`;
        replacements.startDate = startDate;
    }
    if (endDate) {
        query += ` AND transaction_date <= :endDate`;
        replacements.endDate = endDate;
    }
    if (costType) {
        query += ` AND cost_type = :costType`;
        replacements.costType = costType;
    }
    query += ` ORDER BY transaction_date DESC, id DESC`;
    const expenditures = await sequelize.query(query, {
        replacements,
        type: 'SELECT',
    });
    return expenditures;
};
exports.getGrantExpenditures = getGrantExpenditures;
/**
 * Performs compliance check for grant expenditure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {number} amount - Expenditure amount
 * @param {string} costType - Cost type
 * @returns {Promise<{ allowable: boolean; allocable: boolean; reasonable: boolean }>} Compliance result
 *
 * @example
 * ```typescript
 * const compliance = await performComplianceCheck(sequelize, 1, 5000, 'direct');
 * ```
 */
const performComplianceCheck = async (sequelize, grantId, amount, costType) => {
    // Simplified compliance check - in production, this would check against 2 CFR 200 rules
    const GrantAward = (0, exports.createGrantAwardModel)(sequelize);
    const grant = await GrantAward.findByPk(grantId);
    if (!grant) {
        throw new Error('Grant not found');
    }
    // Check if cost type is allowed
    const allowable = true; // Would check against allowable cost categories
    // Check if cost is allocable to the grant
    const allocable = true; // Would verify grant benefit
    // Check if cost is reasonable
    const reasonable = amount <= 10000; // Simplified reasonableness test
    return { allowable, allocable, reasonable };
};
exports.performComplianceCheck = performComplianceCheck;
// ============================================================================
// COST SHARING OPERATIONS
// ============================================================================
/**
 * Records cost sharing commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {string} commitmentType - Commitment type
 * @param {string} source - Source
 * @param {number} cashAmount - Cash commitment amount
 * @param {number} inKindAmount - In-kind commitment amount
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created commitment
 *
 * @example
 * ```typescript
 * await recordCostSharingCommitment(sequelize, 1, 'mandatory', 'institution', 25000, 10000);
 * ```
 */
const recordCostSharingCommitment = async (sequelize, grantId, commitmentType, source, cashAmount, inKindAmount, transaction) => {
    const totalCommitment = cashAmount + inKindAmount;
    const query = `
    INSERT INTO cost_sharing_commitments (
      grant_id, commitment_type, source,
      total_commitment, cash_commitment, in_kind_commitment,
      met_amount, unmet_amount, status,
      created_at, updated_at
    ) VALUES (
      :grantId, :commitmentType, :source,
      :totalCommitment, :cashAmount, :inKindAmount,
      0, :totalCommitment, 'pending',
      NOW(), NOW()
    )
    RETURNING *
  `;
    const [commitment] = await sequelize.query(query, {
        replacements: { grantId, commitmentType, source, totalCommitment, cashAmount, inKindAmount },
        transaction,
    });
    return commitment;
};
exports.recordCostSharingCommitment = recordCostSharingCommitment;
/**
 * Updates cost sharing met amount.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {number} metAmount - Amount met
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated commitment
 *
 * @example
 * ```typescript
 * await updateCostSharingMet(sequelize, 1, 5000);
 * ```
 */
const updateCostSharingMet = async (sequelize, commitmentId, metAmount, transaction) => {
    const query = `
    UPDATE cost_sharing_commitments
    SET met_amount = met_amount + :metAmount,
        unmet_amount = total_commitment - (met_amount + :metAmount),
        status = CASE
          WHEN (met_amount + :metAmount) >= total_commitment THEN 'met'
          ELSE 'pending'
        END,
        updated_at = NOW()
    WHERE id = :commitmentId
    RETURNING *
  `;
    const [commitment] = await sequelize.query(query, {
        replacements: { commitmentId, metAmount },
        transaction,
    });
    return commitment;
};
exports.updateCostSharingMet = updateCostSharingMet;
/**
 * Retrieves cost sharing status for grant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @returns {Promise<any>} Cost sharing status
 *
 * @example
 * ```typescript
 * const status = await getCostSharingStatus(sequelize, 1);
 * console.log(status.percentMet);
 * ```
 */
const getCostSharingStatus = async (sequelize, grantId) => {
    const query = `
    SELECT
      commitment_type,
      source,
      SUM(total_commitment) as total_commitment,
      SUM(cash_commitment) as total_cash,
      SUM(in_kind_commitment) as total_in_kind,
      SUM(met_amount) as total_met,
      SUM(unmet_amount) as total_unmet,
      CASE
        WHEN SUM(total_commitment) > 0 THEN
          (SUM(met_amount) / SUM(total_commitment)) * 100
        ELSE 0
      END as percent_met
    FROM cost_sharing_commitments
    WHERE grant_id = :grantId
    GROUP BY commitment_type, source
  `;
    const status = await sequelize.query(query, {
        replacements: { grantId },
        type: 'SELECT',
    });
    return status;
};
exports.getCostSharingStatus = getCostSharingStatus;
// ============================================================================
// INDIRECT COST OPERATIONS
// ============================================================================
/**
 * Calculates and allocates indirect costs for grant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} baseAmount - Base amount for calculation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Indirect cost allocation
 *
 * @example
 * ```typescript
 * const allocation = await calculateIndirectCosts(sequelize, 1, 2024, 1, 50000);
 * console.log(allocation.indirectAmount);
 * ```
 */
const calculateIndirectCosts = async (sequelize, grantId, fiscalYear, fiscalPeriod, baseAmount, transaction) => {
    const GrantAward = (0, exports.createGrantAwardModel)(sequelize);
    const grant = await GrantAward.findByPk(grantId, { transaction });
    if (!grant) {
        throw new Error('Grant not found');
    }
    const indirectAmount = baseAmount * grant.indirectCostRate;
    const query = `
    INSERT INTO indirect_cost_allocations (
      grant_id, fiscal_year, fiscal_period,
      base_amount, indirect_rate, indirect_amount,
      rate_type, calculation_method,
      created_at, updated_at
    ) VALUES (
      :grantId, :fiscalYear, :fiscalPeriod,
      :baseAmount, :indirectRate, :indirectAmount,
      'predetermined', 'modified_total_direct_costs',
      NOW(), NOW()
    )
    RETURNING *
  `;
    const [allocation] = await sequelize.query(query, {
        replacements: {
            grantId,
            fiscalYear,
            fiscalPeriod,
            baseAmount,
            indirectRate: grant.indirectCostRate,
            indirectAmount,
        },
        transaction,
    });
    return allocation;
};
exports.calculateIndirectCosts = calculateIndirectCosts;
/**
 * Retrieves indirect cost allocations for grant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {number} [fiscalYear] - Optional fiscal year filter
 * @returns {Promise<any[]>} Indirect cost allocations
 *
 * @example
 * ```typescript
 * const allocations = await getIndirectCostAllocations(sequelize, 1, 2024);
 * ```
 */
const getIndirectCostAllocations = async (sequelize, grantId, fiscalYear) => {
    let query = `
    SELECT * FROM indirect_cost_allocations
    WHERE grant_id = :grantId
  `;
    const replacements = { grantId };
    if (fiscalYear) {
        query += ` AND fiscal_year = :fiscalYear`;
        replacements.fiscalYear = fiscalYear;
    }
    query += ` ORDER BY fiscal_year DESC, fiscal_period DESC`;
    const allocations = await sequelize.query(query, {
        replacements,
        type: 'SELECT',
    });
    return allocations;
};
exports.getIndirectCostAllocations = getIndirectCostAllocations;
// ============================================================================
// GRANT BILLING OPERATIONS
// ============================================================================
/**
 * Generates grant billing invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {GrantBillingDto} billingData - Billing data
 * @param {string} userId - User generating the invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created billing invoice
 *
 * @example
 * ```typescript
 * const invoice = await generateGrantInvoice(sequelize, {
 *   grantId: 1,
 *   billingPeriodStart: new Date('2024-01-01'),
 *   billingPeriodEnd: new Date('2024-03-31'),
 *   directCosts: 45000,
 *   indirectCosts: 9000
 * }, 'user123');
 * ```
 */
const generateGrantInvoice = async (sequelize, billingData, userId, transaction) => {
    const { grantId, billingPeriodStart, billingPeriodEnd, directCosts, indirectCosts } = billingData;
    const billingAmount = directCosts + indirectCosts;
    // Get previous billings
    const [previousBillings] = await sequelize.query(`SELECT COALESCE(SUM(billing_amount), 0) as total
     FROM grant_billings WHERE grant_id = :grantId`, {
        replacements: { grantId },
        type: 'SELECT',
        transaction,
    });
    const cumulativeBillings = parseFloat(previousBillings?.total || '0') + billingAmount;
    const invoiceNumber = `INV-${grantId}-${Date.now()}`;
    const query = `
    INSERT INTO grant_billings (
      grant_id, billing_period_start, billing_period_end,
      invoice_number, invoice_date, billing_amount,
      direct_costs, indirect_costs, cost_sharing,
      previous_billings, cumulative_billings,
      status, created_at, updated_at
    ) VALUES (
      :grantId, :billingPeriodStart, :billingPeriodEnd,
      :invoiceNumber, NOW(), :billingAmount,
      :directCosts, :indirectCosts, 0,
      :previousBillings, :cumulativeBillings,
      'draft', NOW(), NOW()
    )
    RETURNING *
  `;
    const [billing] = await sequelize.query(query, {
        replacements: {
            grantId,
            billingPeriodStart,
            billingPeriodEnd,
            invoiceNumber,
            billingAmount,
            directCosts,
            indirectCosts,
            previousBillings: previousBillings?.total || 0,
            cumulativeBillings,
        },
        transaction,
    });
    return billing;
};
exports.generateGrantInvoice = generateGrantInvoice;
/**
 * Submits grant billing invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} billingId - Billing ID
 * @param {string} userId - User submitting the invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Submitted billing
 *
 * @example
 * ```typescript
 * await submitGrantInvoice(sequelize, 1, 'user123');
 * ```
 */
const submitGrantInvoice = async (sequelize, billingId, userId, transaction) => {
    const query = `
    UPDATE grant_billings
    SET status = 'submitted',
        submitted_date = NOW(),
        updated_at = NOW()
    WHERE id = :billingId AND status = 'draft'
    RETURNING *
  `;
    const [billing] = await sequelize.query(query, {
        replacements: { billingId },
        transaction,
    });
    if (!billing) {
        throw new Error('Billing not found or already submitted');
    }
    // Update grant total billed
    await sequelize.query(`UPDATE grant_awards
     SET total_billed = total_billed + :billingAmount,
         updated_at = NOW()
     WHERE id = (SELECT grant_id FROM grant_billings WHERE id = :billingId)`, {
        replacements: { billingId },
        transaction,
    });
    return billing;
};
exports.submitGrantInvoice = submitGrantInvoice;
/**
 * Records grant billing payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} billingId - Billing ID
 * @param {number} paymentAmount - Payment amount
 * @param {Date} paymentDate - Payment date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated billing
 *
 * @example
 * ```typescript
 * await recordGrantPayment(sequelize, 1, 54000, new Date());
 * ```
 */
const recordGrantPayment = async (sequelize, billingId, paymentAmount, paymentDate, transaction) => {
    const query = `
    UPDATE grant_billings
    SET status = 'paid',
        payment_amount = :paymentAmount,
        paid_date = :paymentDate,
        updated_at = NOW()
    WHERE id = :billingId AND status = 'submitted'
    RETURNING *
  `;
    const [billing] = await sequelize.query(query, {
        replacements: { billingId, paymentAmount, paymentDate },
        transaction,
    });
    if (!billing) {
        throw new Error('Billing not found or not submitted');
    }
    return billing;
};
exports.recordGrantPayment = recordGrantPayment;
/**
 * Retrieves grant billing history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @returns {Promise<any[]>} Billing history
 *
 * @example
 * ```typescript
 * const history = await getGrantBillingHistory(sequelize, 1);
 * ```
 */
const getGrantBillingHistory = async (sequelize, grantId) => {
    const query = `
    SELECT * FROM grant_billings
    WHERE grant_id = :grantId
    ORDER BY invoice_date DESC
  `;
    const billings = await sequelize.query(query, {
        replacements: { grantId },
        type: 'SELECT',
    });
    return billings;
};
exports.getGrantBillingHistory = getGrantBillingHistory;
// ============================================================================
// GRANT REPORTING OPERATIONS
// ============================================================================
/**
 * Creates grant report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {string} reportType - Report type
 * @param {Date} periodStart - Reporting period start
 * @param {Date} periodEnd - Reporting period end
 * @param {Date} dueDate - Due date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created report
 *
 * @example
 * ```typescript
 * const report = await createGrantReport(sequelize, 1, 'financial',
 *   new Date('2024-01-01'), new Date('2024-03-31'), new Date('2024-04-15'));
 * ```
 */
const createGrantReport = async (sequelize, grantId, reportType, periodStart, periodEnd, dueDate, transaction) => {
    // Get expenditure data for period
    const expenditureQuery = `
    SELECT
      SUM(amount) as period_expenditure,
      cost_type
    FROM grant_expenditures
    WHERE grant_id = :grantId
      AND transaction_date BETWEEN :periodStart AND :periodEnd
    GROUP BY cost_type
  `;
    const expenditures = await sequelize.query(expenditureQuery, {
        replacements: { grantId, periodStart, periodEnd },
        type: 'SELECT',
        transaction,
    });
    const totalExpenditure = expenditures.reduce((sum, exp) => sum + parseFloat(exp.period_expenditure), 0);
    // Get cumulative expenditure
    const cumulativeQuery = `
    SELECT SUM(amount) as cumulative
    FROM grant_expenditures
    WHERE grant_id = :grantId AND transaction_date <= :periodEnd
  `;
    const [cumulative] = await sequelize.query(cumulativeQuery, {
        replacements: { grantId, periodEnd },
        type: 'SELECT',
        transaction,
    });
    const cumulativeExpenditure = parseFloat(cumulative?.cumulative || '0');
    // Get grant award amount
    const GrantAward = (0, exports.createGrantAwardModel)(sequelize);
    const grant = await GrantAward.findByPk(grantId, { transaction });
    const remainingBalance = grant ? grant.awardAmount - cumulativeExpenditure : 0;
    const query = `
    INSERT INTO grant_reports (
      grant_id, report_type, reporting_period_start, reporting_period_end,
      due_date, status, total_expenditure, cumulative_expenditure,
      remaining_balance, report_data, created_at, updated_at
    ) VALUES (
      :grantId, :reportType, :periodStart, :periodEnd,
      :dueDate, 'pending', :totalExpenditure, :cumulativeExpenditure,
      :remainingBalance, :reportData, NOW(), NOW()
    )
    RETURNING *
  `;
    const [report] = await sequelize.query(query, {
        replacements: {
            grantId,
            reportType,
            periodStart,
            periodEnd,
            dueDate,
            totalExpenditure,
            cumulativeExpenditure,
            remainingBalance,
            reportData: JSON.stringify({ expenditures }),
        },
        transaction,
    });
    return report;
};
exports.createGrantReport = createGrantReport;
/**
 * Submits grant report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reportId - Report ID
 * @param {string} userId - User submitting the report
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Submitted report
 *
 * @example
 * ```typescript
 * await submitGrantReport(sequelize, 1, 'user123');
 * ```
 */
const submitGrantReport = async (sequelize, reportId, userId, transaction) => {
    const query = `
    UPDATE grant_reports
    SET status = 'submitted',
        submitted_date = NOW(),
        updated_at = NOW()
    WHERE id = :reportId AND status IN ('pending', 'draft')
    RETURNING *
  `;
    const [report] = await sequelize.query(query, {
        replacements: { reportId },
        transaction,
    });
    if (!report) {
        throw new Error('Report not found or already submitted');
    }
    return report;
};
exports.submitGrantReport = submitGrantReport;
/**
 * Retrieves grant reports with late status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @returns {Promise<any[]>} Grant reports
 *
 * @example
 * ```typescript
 * const reports = await getGrantReports(sequelize, 1);
 * console.log(reports.filter(r => r.status === 'late'));
 * ```
 */
const getGrantReports = async (sequelize, grantId) => {
    const query = `
    SELECT *,
      CASE
        WHEN status IN ('pending', 'draft') AND due_date < NOW() THEN 'late'
        ELSE status
      END as current_status
    FROM grant_reports
    WHERE grant_id = :grantId
    ORDER BY due_date DESC
  `;
    const reports = await sequelize.query(query, {
        replacements: { grantId },
        type: 'SELECT',
    });
    return reports;
};
exports.getGrantReports = getGrantReports;
// ============================================================================
// FUND TRANSFER OPERATIONS
// ============================================================================
/**
 * Creates interfund transfer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} sourceFundId - Source fund ID
 * @param {number} destinationFundId - Destination fund ID
 * @param {number} amount - Transfer amount
 * @param {string} transferType - Transfer type
 * @param {string} reason - Transfer reason
 * @param {string} userId - User creating the transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created transfer
 *
 * @example
 * ```typescript
 * const transfer = await createFundTransfer(sequelize, 1, 2, 10000,
 *   'operating', 'Budget reallocation', 'user123');
 * ```
 */
const createFundTransfer = async (sequelize, sourceFundId, destinationFundId, amount, transferType, reason, userId, transaction) => {
    // Validate source fund availability
    const availability = await (0, exports.validateFundAvailability)(sequelize, sourceFundId, new Date().getFullYear(), amount);
    if (!availability.available) {
        throw new Error(availability.message);
    }
    const transferNumber = `TRF-${Date.now()}`;
    const query = `
    INSERT INTO fund_transfers (
      transfer_number, transfer_date, source_fund_id, destination_fund_id,
      transfer_amount, transfer_type, approval_required, status, reason,
      created_at, updated_at
    ) VALUES (
      :transferNumber, NOW(), :sourceFundId, :destinationFundId,
      :amount, :transferType, true, 'pending', :reason,
      NOW(), NOW()
    )
    RETURNING *
  `;
    const [transfer] = await sequelize.query(query, {
        replacements: {
            transferNumber,
            sourceFundId,
            destinationFundId,
            amount,
            transferType,
            reason,
        },
        transaction,
    });
    return transfer;
};
exports.createFundTransfer = createFundTransfer;
/**
 * Approves fund transfer and posts transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transferId - Transfer ID
 * @param {string} userId - User approving the transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved transfer
 *
 * @example
 * ```typescript
 * await approveFundTransfer(sequelize, 1, 'user123');
 * ```
 */
const approveFundTransfer = async (sequelize, transferId, userId, transaction) => {
    // Update transfer status
    const query = `
    UPDATE fund_transfers
    SET status = 'approved',
        approved_by = :userId,
        approved_date = NOW(),
        updated_at = NOW()
    WHERE id = :transferId AND status = 'pending'
    RETURNING *
  `;
    const [transfer] = await sequelize.query(query, {
        replacements: { transferId, userId },
        transaction,
    });
    if (!transfer) {
        throw new Error('Transfer not found or already processed');
    }
    // Post transfer would create GL entries here
    // This would integrate with general-ledger-operations-kit
    return transfer;
};
exports.approveFundTransfer = approveFundTransfer;
// ============================================================================
// COMPLIANCE AND AUDIT OPERATIONS
// ============================================================================
/**
 * Performs compliance validation check.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {string} checkType - Check type
 * @param {string} complianceArea - Compliance area
 * @param {string} userId - User performing the check
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Compliance check result
 *
 * @example
 * ```typescript
 * const check = await performGrantComplianceCheck(sequelize, 1,
 *   'post_award', 'allowable_costs', 'user123');
 * ```
 */
const performGrantComplianceCheck = async (sequelize, grantId, checkType, complianceArea, userId, transaction) => {
    const findings = [];
    const recommendations = [];
    // Perform various compliance checks based on area
    if (complianceArea === 'allowable_costs') {
        const nonCompliantQuery = `
      SELECT COUNT(*) as count FROM grant_expenditures
      WHERE grant_id = :grantId AND allowable = false
    `;
        const [result] = await sequelize.query(nonCompliantQuery, {
            replacements: { grantId },
            type: 'SELECT',
            transaction,
        });
        if (result.count > 0) {
            findings.push(`${result.count} expenditures marked as non-allowable`);
            recommendations.push('Review and reclassify non-allowable expenditures');
        }
    }
    const complianceResult = findings.length === 0 ? 'compliant' : 'non_compliant';
    const query = `
    INSERT INTO compliance_checks (
      grant_id, check_date, check_type, compliance_area,
      result, findings, recommendations, reviewed_by,
      follow_up_required, created_at, updated_at
    ) VALUES (
      :grantId, NOW(), :checkType, :complianceArea,
      :result, :findings, :recommendations, :userId,
      :followUpRequired, NOW(), NOW()
    )
    RETURNING *
  `;
    const [check] = await sequelize.query(query, {
        replacements: {
            grantId,
            checkType,
            complianceArea,
            result: complianceResult,
            findings: JSON.stringify(findings),
            recommendations: JSON.stringify(recommendations),
            userId,
            followUpRequired: findings.length > 0,
        },
        transaction,
    });
    return check;
};
exports.performGrantComplianceCheck = performGrantComplianceCheck;
/**
 * Generates fund accounting audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fundId - Fund ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any[]>} Audit trail entries
 *
 * @example
 * ```typescript
 * const trail = await generateFundAuditTrail(sequelize, 1,
 *   new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
const generateFundAuditTrail = async (sequelize, fundId, startDate, endDate) => {
    const query = `
    SELECT
      'fund_balance' as entity_type,
      fb.id as entity_id,
      fb.fiscal_year,
      fb.fiscal_period,
      fb.account_id,
      fb.debit_amount,
      fb.credit_amount,
      fb.created_at as transaction_date
    FROM fund_balances fb
    WHERE fb.fund_id = :fundId
      AND fb.created_at BETWEEN :startDate AND :endDate
    UNION ALL
    SELECT
      'grant_expenditure' as entity_type,
      ge.id as entity_id,
      ge.fiscal_year,
      ge.fiscal_period,
      ge.account_id,
      ge.amount as debit_amount,
      0 as credit_amount,
      ge.transaction_date
    FROM grant_expenditures ge
    JOIN grant_awards ga ON ge.grant_id = ga.id
    WHERE ga.fund_id = :fundId
      AND ge.transaction_date BETWEEN :startDate AND :endDate
    ORDER BY transaction_date DESC
  `;
    const trail = await sequelize.query(query, {
        replacements: { fundId, startDate, endDate },
        type: 'SELECT',
    });
    return trail;
};
exports.generateFundAuditTrail = generateFundAuditTrail;
/**
 * Validates grant closeout requirements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @returns {Promise<{ canClose: boolean; issues: string[]; checklist: any[] }>} Closeout validation
 *
 * @example
 * ```typescript
 * const validation = await validateGrantCloseout(sequelize, 1);
 * if (!validation.canClose) {
 *   console.log('Issues:', validation.issues);
 * }
 * ```
 */
const validateGrantCloseout = async (sequelize, grantId) => {
    const issues = [];
    const checklist = [];
    const GrantAward = (0, exports.createGrantAwardModel)(sequelize);
    const grant = await GrantAward.findByPk(grantId);
    if (!grant) {
        return { canClose: false, issues: ['Grant not found'], checklist: [] };
    }
    // Check if grant period has ended
    if (grant.endDate > new Date()) {
        issues.push('Grant period has not ended');
    }
    checklist.push({ item: 'Grant period ended', status: grant.endDate <= new Date() });
    // Check for pending expenditures
    const [pendingExp] = await sequelize.query(`SELECT COUNT(*) as count FROM grant_expenditures
     WHERE grant_id = :grantId AND compliance_checked = false`, { replacements: { grantId }, type: 'SELECT' });
    if (pendingExp.count > 0) {
        issues.push(`${pendingExp.count} expenditures pending compliance check`);
    }
    checklist.push({ item: 'All expenditures compliance checked', status: pendingExp.count === 0 });
    // Check for pending reports
    const [pendingReports] = await sequelize.query(`SELECT COUNT(*) as count FROM grant_reports
     WHERE grant_id = :grantId AND status IN ('pending', 'draft')`, { replacements: { grantId }, type: 'SELECT' });
    if (pendingReports.count > 0) {
        issues.push(`${pendingReports.count} reports pending submission`);
    }
    checklist.push({ item: 'All reports submitted', status: pendingReports.count === 0 });
    // Check cost sharing requirements
    if (grant.costSharingRequired) {
        const costSharingStatus = await (0, exports.getCostSharingStatus)(sequelize, grantId);
        const totalMet = costSharingStatus.reduce((sum, cs) => sum + parseFloat(cs.total_met), 0);
        if (totalMet < grant.costSharingAmount) {
            issues.push('Cost sharing requirement not met');
        }
        checklist.push({ item: 'Cost sharing requirement met', status: totalMet >= grant.costSharingAmount });
    }
    // Check for unpaid invoices
    const [unpaidInvoices] = await sequelize.query(`SELECT COUNT(*) as count FROM grant_billings
     WHERE grant_id = :grantId AND status IN ('submitted', 'approved')`, { replacements: { grantId }, type: 'SELECT' });
    if (unpaidInvoices.count > 0) {
        issues.push(`${unpaidInvoices.count} invoices not yet paid`);
    }
    checklist.push({ item: 'All invoices paid', status: unpaidInvoices.count === 0 });
    return {
        canClose: issues.length === 0,
        issues,
        checklist,
    };
};
exports.validateGrantCloseout = validateGrantCloseout;
/**
 * Retrieves fund transfer history with filtering.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [fundId] - Optional fund ID filter
 * @param {Date} [startDate] - Optional start date filter
 * @param {Date} [endDate] - Optional end date filter
 * @returns {Promise<any[]>} Fund transfers
 *
 * @example
 * ```typescript
 * const transfers = await getFundTransferHistory(sequelize, 1, new Date('2024-01-01'));
 * ```
 */
const getFundTransferHistory = async (sequelize, fundId, startDate, endDate) => {
    let query = `SELECT * FROM fund_transfers WHERE 1=1`;
    const replacements = {};
    if (fundId) {
        query += ` AND (source_fund_id = :fundId OR destination_fund_id = :fundId)`;
        replacements.fundId = fundId;
    }
    if (startDate) {
        query += ` AND transfer_date >= :startDate`;
        replacements.startDate = startDate;
    }
    if (endDate) {
        query += ` AND transfer_date <= :endDate`;
        replacements.endDate = endDate;
    }
    query += ` ORDER BY transfer_date DESC`;
    const transfers = await sequelize.query(query, {
        replacements,
        type: 'SELECT',
    });
    return transfers;
};
exports.getFundTransferHistory = getFundTransferHistory;
/**
 * Updates grant budget line.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetLineId - Budget line ID
 * @param {number} newBudgetAmount - New budget amount
 * @param {string} userId - User updating the line
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated budget line
 *
 * @example
 * ```typescript
 * await updateGrantBudgetLine(sequelize, 1, 150000, 'user123');
 * ```
 */
const updateGrantBudgetLine = async (sequelize, budgetLineId, newBudgetAmount, userId, transaction) => {
    const query = `
    UPDATE grant_budget_lines
    SET budget_amount = :newBudgetAmount,
        available_amount = :newBudgetAmount - expended_amount - encumbered_amount,
        updated_at = NOW()
    WHERE id = :budgetLineId
    RETURNING *
  `;
    const [line] = await sequelize.query(query, {
        replacements: { budgetLineId, newBudgetAmount },
        transaction,
    });
    return line;
};
exports.updateGrantBudgetLine = updateGrantBudgetLine;
/**
 * Retrieves grant expenditure summary by category.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {number} [fiscalYear] - Optional fiscal year filter
 * @returns {Promise<any[]>} Expenditure summary
 *
 * @example
 * ```typescript
 * const summary = await getGrantExpenditureSummary(sequelize, 1, 2024);
 * ```
 */
const getGrantExpenditureSummary = async (sequelize, grantId, fiscalYear) => {
    let query = `
    SELECT
      cost_type,
      COUNT(*) as transaction_count,
      SUM(amount) as total_amount,
      AVG(amount) as average_amount,
      MIN(transaction_date) as earliest_transaction,
      MAX(transaction_date) as latest_transaction
    FROM grant_expenditures
    WHERE grant_id = :grantId
  `;
    const replacements = { grantId };
    if (fiscalYear) {
        query += ` AND fiscal_year = :fiscalYear`;
        replacements.fiscalYear = fiscalYear;
    }
    query += ` GROUP BY cost_type ORDER BY total_amount DESC`;
    const summary = await sequelize.query(query, {
        replacements,
        type: 'SELECT',
    });
    return summary;
};
exports.getGrantExpenditureSummary = getGrantExpenditureSummary;
/**
 * Validates cost sharing commitment requirements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @returns {Promise<{ valid: boolean; message?: string; details: any }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateCostSharingCommitment(sequelize, 1);
 * ```
 */
const validateCostSharingCommitment = async (sequelize, grantId) => {
    const GrantAward = (0, exports.createGrantAwardModel)(sequelize);
    const grant = await GrantAward.findByPk(grantId);
    if (!grant) {
        return { valid: false, message: 'Grant not found', details: {} };
    }
    if (!grant.costSharingRequired) {
        return { valid: true, details: { required: false } };
    }
    const status = await (0, exports.getCostSharingStatus)(sequelize, grantId);
    const totalMet = status.reduce((sum, cs) => sum + parseFloat(cs.total_met), 0);
    const valid = totalMet >= grant.costSharingAmount;
    return {
        valid,
        message: valid ? 'Cost sharing requirement met' : `Cost sharing shortfall: ${grant.costSharingAmount - totalMet}`,
        details: {
            required: grant.costSharingAmount,
            met: totalMet,
            remaining: Math.max(0, grant.costSharingAmount - totalMet),
            breakdown: status,
        },
    };
};
exports.validateCostSharingCommitment = validateCostSharingCommitment;
/**
 * Generates grant financial statement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {Date} asOfDate - Statement date
 * @returns {Promise<any>} Financial statement
 *
 * @example
 * ```typescript
 * const statement = await generateGrantFinancialStatement(sequelize, 1, new Date());
 * ```
 */
const generateGrantFinancialStatement = async (sequelize, grantId, asOfDate) => {
    const grant = await (0, exports.getGrantWithDetails)(sequelize, grantId);
    const expenditureQuery = `
    SELECT
      cost_type,
      SUM(amount) as total
    FROM grant_expenditures
    WHERE grant_id = :grantId AND transaction_date <= :asOfDate
    GROUP BY cost_type
  `;
    const expenditures = await sequelize.query(expenditureQuery, {
        replacements: { grantId, asOfDate },
        type: 'SELECT',
    });
    const billingQuery = `
    SELECT
      SUM(billing_amount) as total_billed,
      SUM(CASE WHEN status = 'paid' THEN payment_amount ELSE 0 END) as total_received
    FROM grant_billings
    WHERE grant_id = :grantId AND invoice_date <= :asOfDate
  `;
    const [billing] = await sequelize.query(billingQuery, {
        replacements: { grantId, asOfDate },
        type: 'SELECT',
    });
    return {
        grantNumber: grant.grantNumber,
        grantName: grant.grantName,
        asOfDate,
        awardAmount: grant.awardAmount,
        expenditures,
        totalExpended: grant.totalExpended,
        totalBilled: billing?.total_billed || 0,
        totalReceived: billing?.total_received || 0,
        remainingBalance: grant.remainingBalance,
    };
};
exports.generateGrantFinancialStatement = generateGrantFinancialStatement;
/**
 * Closes a fund permanently.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fundId - Fund ID
 * @param {string} userId - User closing the fund
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Closed fund
 *
 * @example
 * ```typescript
 * await closeFund(sequelize, 1, 'user123');
 * ```
 */
const closeFund = async (sequelize, fundId, userId, transaction) => {
    const FundStructure = (0, exports.createFundStructureModel)(sequelize);
    const fund = await FundStructure.findByPk(fundId, { transaction });
    if (!fund) {
        throw new Error('Fund not found');
    }
    // Check for active grants
    const [activeGrants] = await sequelize.query(`SELECT COUNT(*) as count FROM grant_awards WHERE fund_id = :fundId AND status = 'active'`, {
        replacements: { fundId },
        type: 'SELECT',
        transaction,
    });
    if (activeGrants.count > 0) {
        throw new Error(`Cannot close fund with ${activeGrants.count} active grants`);
    }
    await fund.update({ status: 'closed', metadata: { ...fund.metadata, closedBy: userId, closedAt: new Date() } }, { transaction });
    return fund;
};
exports.closeFund = closeFund;
/**
 * Activates a fund.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fundId - Fund ID
 * @param {string} userId - User activating the fund
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Activated fund
 *
 * @example
 * ```typescript
 * await activateFund(sequelize, 1, 'user123');
 * ```
 */
const activateFund = async (sequelize, fundId, userId, transaction) => {
    const FundStructure = (0, exports.createFundStructureModel)(sequelize);
    const fund = await FundStructure.findByPk(fundId, { transaction });
    if (!fund) {
        throw new Error('Fund not found');
    }
    await fund.update({ status: 'active', metadata: { ...fund.metadata, activatedBy: userId, activatedAt: new Date() } }, { transaction });
    return fund;
};
exports.activateFund = activateFund;
/**
 * Retrieves grants by fund.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fundId - Fund ID
 * @param {string} [status] - Optional status filter
 * @returns {Promise<any[]>} Grants
 *
 * @example
 * ```typescript
 * const grants = await getGrantsByFund(sequelize, 1, 'active');
 * ```
 */
const getGrantsByFund = async (sequelize, fundId, status) => {
    const GrantAward = (0, exports.createGrantAwardModel)(sequelize);
    const where = { fundId };
    if (status) {
        where.status = status;
    }
    const grants = await GrantAward.findAll({ where, order: [['grantNumber', 'ASC']] });
    return grants;
};
exports.getGrantsByFund = getGrantsByFund;
// ============================================================================
// EXPORT ALL FUNCTIONS
// ============================================================================
exports.default = {
    createFundStructureModel: exports.createFundStructureModel,
    createGrantAwardModel: exports.createGrantAwardModel,
    createGrantBudgetModel: exports.createGrantBudgetModel,
    createFund: exports.createFund,
    getFundWithDetails: exports.getFundWithDetails,
    updateFundBalance: exports.updateFundBalance,
    addFundRestriction: exports.addFundRestriction,
    validateFundAvailability: exports.validateFundAvailability,
    calculateFundBalancesByType: exports.calculateFundBalancesByType,
    createGrantAward: exports.createGrantAward,
    getGrantWithDetails: exports.getGrantWithDetails,
    updateGrantStatus: exports.updateGrantStatus,
    validateGrantAward: exports.validateGrantAward,
    createGrantBudget: exports.createGrantBudget,
    approveGrantBudget: exports.approveGrantBudget,
    getGrantBudgetVariance: exports.getGrantBudgetVariance,
    checkGrantBudgetAvailability: exports.checkGrantBudgetAvailability,
    recordGrantExpenditure: exports.recordGrantExpenditure,
    getGrantExpenditures: exports.getGrantExpenditures,
    performComplianceCheck: exports.performComplianceCheck,
    recordCostSharingCommitment: exports.recordCostSharingCommitment,
    updateCostSharingMet: exports.updateCostSharingMet,
    getCostSharingStatus: exports.getCostSharingStatus,
    calculateIndirectCosts: exports.calculateIndirectCosts,
    getIndirectCostAllocations: exports.getIndirectCostAllocations,
    generateGrantInvoice: exports.generateGrantInvoice,
    submitGrantInvoice: exports.submitGrantInvoice,
    recordGrantPayment: exports.recordGrantPayment,
    getGrantBillingHistory: exports.getGrantBillingHistory,
    createGrantReport: exports.createGrantReport,
    submitGrantReport: exports.submitGrantReport,
    getGrantReports: exports.getGrantReports,
    createFundTransfer: exports.createFundTransfer,
    approveFundTransfer: exports.approveFundTransfer,
    performGrantComplianceCheck: exports.performGrantComplianceCheck,
    generateFundAuditTrail: exports.generateFundAuditTrail,
    validateGrantCloseout: exports.validateGrantCloseout,
    getFundTransferHistory: exports.getFundTransferHistory,
    updateGrantBudgetLine: exports.updateGrantBudgetLine,
    getGrantExpenditureSummary: exports.getGrantExpenditureSummary,
    validateCostSharingCommitment: exports.validateCostSharingCommitment,
    generateGrantFinancialStatement: exports.generateGrantFinancialStatement,
    closeFund: exports.closeFund,
    activateFund: exports.activateFund,
    getGrantsByFund: exports.getGrantsByFund,
};
//# sourceMappingURL=fund-grant-accounting-kit.js.map