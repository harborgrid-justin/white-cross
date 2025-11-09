"use strict";
/**
 * LOC: GOVERNMENT_FINANCIAL_REPORTING_KIT_001
 * File: /reuse/government/government-financial-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Government financial services
 *   - CAFR generation systems
 *   - Audit reporting platforms
 *   - Financial disclosure systems
 *   - Budget management systems
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFinancialDisclosure = exports.createDebtCapacityTable = exports.createRevenueCapacityTable = exports.createFinancialTrendTable = exports.createPensionRSI = exports.createBudgetComparison = exports.generateRequiredNotes = exports.addNoteSubsection = exports.createNote = exports.createFinancialSection = exports.createIntroductorySection = exports.createCAFR = exports.addReconciliationAdjustment = exports.createReconciliation = exports.calculateBudgetVariance = exports.createStatementOfRevenuesExpenditures = exports.classifyFundBalance = exports.createFundBalanceSheet = exports.createStatementOfActivities = exports.createStatementOfNetPosition = exports.reverseTransaction = exports.validateJournalEntries = exports.createTransaction = exports.determineNormalBalance = exports.createAccount = exports.categorizeFund = exports.createFund = exports.createDisclosureId = exports.createTransactionId = exports.createAccountId = exports.createFundId = exports.createReportId = exports.GenerateCAFRDto = exports.CreateTransactionDto = exports.CreateAccountDto = exports.CreateFundDto = exports.FinancialDisclosureModel = exports.FinancialReportModel = exports.TransactionModel = exports.AccountModel = exports.GovernmentFundModel = exports.AuditOpinionType = exports.ReportSection = exports.FundBalanceClassification = exports.NetPositionComponent = exports.AccountClassification = exports.GASBStatement = exports.FinancialStatementType = exports.FundCategory = exports.FundType = void 0;
exports.formatFinancialAmount = exports.calculateDebtRatio = exports.calculatePerCapita = exports.addEmphasisOfMatter = exports.createAuditorsReport = exports.validateGASBCompliance = void 0;
/**
 * File: /reuse/government/government-financial-reporting-kit.ts
 * Locator: WC-GOV-FINANCIAL-REPORTING-001
 * Purpose: Comprehensive Government Financial Reporting & GASB Compliance Kit
 *
 * Upstream: NestJS, Sequelize, Swagger, TypeScript 5.x
 * Downstream: ../backend/government/*, Financial reporting services, CAFR generation
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 50 financial reporting functions for GASB compliance, CAFR, fund accounting, financial statements
 *
 * LLM Context: Enterprise-grade government financial reporting utilities for GASB compliance.
 * Provides comprehensive financial reporting capabilities including GASB-compliant reporting, CAFR
 * (Comprehensive Annual Financial Report) generation, fund financial statements, government-wide
 * financial statements, notes to financial statements, required supplementary information, statistical
 * section reporting, reconciliation statements, schedule generation, financial disclosure management,
 * and audit report preparation. Supports federal, state, and local government accounting standards.
 */
const crypto = __importStar(require("crypto"));
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Fund type per GASB standards
 */
var FundType;
(function (FundType) {
    FundType["GENERAL"] = "general";
    FundType["SPECIAL_REVENUE"] = "special_revenue";
    FundType["CAPITAL_PROJECTS"] = "capital_projects";
    FundType["DEBT_SERVICE"] = "debt_service";
    FundType["PERMANENT"] = "permanent";
    FundType["ENTERPRISE"] = "enterprise";
    FundType["INTERNAL_SERVICE"] = "internal_service";
    FundType["PENSION_TRUST"] = "pension_trust";
    FundType["INVESTMENT_TRUST"] = "investment_trust";
    FundType["PRIVATE_PURPOSE_TRUST"] = "private_purpose_trust";
    FundType["CUSTODIAL"] = "custodial";
})(FundType || (exports.FundType = FundType = {}));
/**
 * Fund category
 */
var FundCategory;
(function (FundCategory) {
    FundCategory["GOVERNMENTAL"] = "governmental";
    FundCategory["PROPRIETARY"] = "proprietary";
    FundCategory["FIDUCIARY"] = "fiduciary";
})(FundCategory || (exports.FundCategory = FundCategory = {}));
/**
 * Financial statement type
 */
var FinancialStatementType;
(function (FinancialStatementType) {
    // Government-wide statements
    FinancialStatementType["STATEMENT_OF_NET_POSITION"] = "statement_of_net_position";
    FinancialStatementType["STATEMENT_OF_ACTIVITIES"] = "statement_of_activities";
    // Fund financial statements
    FinancialStatementType["BALANCE_SHEET_GOVERNMENTAL"] = "balance_sheet_governmental";
    FinancialStatementType["STATEMENT_OF_REVENUES_EXPENDITURES"] = "statement_of_revenues_expenditures";
    FinancialStatementType["STATEMENT_OF_NET_POSITION_PROPRIETARY"] = "statement_of_net_position_proprietary";
    FinancialStatementType["STATEMENT_OF_REVENUES_EXPENSES_PROPRIETARY"] = "statement_of_revenues_expenses_proprietary";
    FinancialStatementType["STATEMENT_OF_CASH_FLOWS"] = "statement_of_cash_flows";
    FinancialStatementType["STATEMENT_OF_FIDUCIARY_NET_POSITION"] = "statement_of_fiduciary_net_position";
    FinancialStatementType["STATEMENT_OF_CHANGES_FIDUCIARY"] = "statement_of_changes_fiduciary";
})(FinancialStatementType || (exports.FinancialStatementType = FinancialStatementType = {}));
/**
 * GASB statement compliance
 */
var GASBStatement;
(function (GASBStatement) {
    GASBStatement["GASB_34"] = "gasb_34";
    GASBStatement["GASB_35"] = "gasb_35";
    GASBStatement["GASB_45"] = "gasb_45";
    GASBStatement["GASB_54"] = "gasb_54";
    GASBStatement["GASB_63"] = "gasb_63";
    GASBStatement["GASB_68"] = "gasb_68";
    GASBStatement["GASB_72"] = "gasb_72";
    GASBStatement["GASB_75"] = "gasb_75";
    GASBStatement["GASB_84"] = "gasb_84";
    GASBStatement["GASB_87"] = "gasb_87";
})(GASBStatement || (exports.GASBStatement = GASBStatement = {}));
/**
 * Account classification
 */
var AccountClassification;
(function (AccountClassification) {
    AccountClassification["ASSET"] = "asset";
    AccountClassification["LIABILITY"] = "liability";
    AccountClassification["DEFERRED_OUTFLOW"] = "deferred_outflow";
    AccountClassification["DEFERRED_INFLOW"] = "deferred_inflow";
    AccountClassification["NET_POSITION"] = "net_position";
    AccountClassification["REVENUE"] = "revenue";
    AccountClassification["EXPENSE"] = "expense";
    AccountClassification["EXPENDITURE"] = "expenditure";
    AccountClassification["OTHER_FINANCING_SOURCE"] = "other_financing_source";
    AccountClassification["OTHER_FINANCING_USE"] = "other_financing_use";
})(AccountClassification || (exports.AccountClassification = AccountClassification = {}));
/**
 * Net position component
 */
var NetPositionComponent;
(function (NetPositionComponent) {
    NetPositionComponent["NET_INVESTMENT_CAPITAL_ASSETS"] = "net_investment_capital_assets";
    NetPositionComponent["RESTRICTED"] = "restricted";
    NetPositionComponent["UNRESTRICTED"] = "unrestricted";
})(NetPositionComponent || (exports.NetPositionComponent = NetPositionComponent = {}));
/**
 * Fund balance classification (GASB 54)
 */
var FundBalanceClassification;
(function (FundBalanceClassification) {
    FundBalanceClassification["NONSPENDABLE"] = "nonspendable";
    FundBalanceClassification["RESTRICTED"] = "restricted";
    FundBalanceClassification["COMMITTED"] = "committed";
    FundBalanceClassification["ASSIGNED"] = "assigned";
    FundBalanceClassification["UNASSIGNED"] = "unassigned";
})(FundBalanceClassification || (exports.FundBalanceClassification = FundBalanceClassification = {}));
/**
 * Report section
 */
var ReportSection;
(function (ReportSection) {
    ReportSection["INTRODUCTORY"] = "introductory";
    ReportSection["FINANCIAL"] = "financial";
    ReportSection["STATISTICAL"] = "statistical";
})(ReportSection || (exports.ReportSection = ReportSection = {}));
/**
 * Audit opinion type
 */
var AuditOpinionType;
(function (AuditOpinionType) {
    AuditOpinionType["UNMODIFIED"] = "unmodified";
    AuditOpinionType["QUALIFIED"] = "qualified";
    AuditOpinionType["ADVERSE"] = "adverse";
    AuditOpinionType["DISCLAIMER"] = "disclaimer";
})(AuditOpinionType || (exports.AuditOpinionType = AuditOpinionType = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Fund model for Sequelize ORM
 */
let GovernmentFundModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'government_funds', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _entityId_decorators;
    let _entityId_initializers = [];
    let _entityId_extraInitializers = [];
    let _fundNumber_decorators;
    let _fundNumber_initializers = [];
    let _fundNumber_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _accounts_decorators;
    let _accounts_initializers = [];
    let _accounts_extraInitializers = [];
    let _transactions_decorators;
    let _transactions_initializers = [];
    let _transactions_extraInitializers = [];
    var GovernmentFundModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.entityId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _entityId_initializers, void 0));
            this.fundNumber = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _fundNumber_initializers, void 0));
            this.name = (__runInitializers(this, _fundNumber_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.type = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.category = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.description = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.isActive = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.metadata = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.accounts = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _accounts_initializers, void 0));
            this.transactions = (__runInitializers(this, _accounts_extraInitializers), __runInitializers(this, _transactions_initializers, void 0));
            __runInitializers(this, _transactions_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "GovernmentFundModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _entityId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _fundNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, unique: true })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(FundType)),
                allowNull: false,
            })];
        _category_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(FundCategory)),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: {} })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _accounts_decorators = [(0, sequelize_typescript_1.HasMany)(() => AccountModel)];
        _transactions_decorators = [(0, sequelize_typescript_1.HasMany)(() => TransactionModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
        __esDecorate(null, null, _fundNumber_decorators, { kind: "field", name: "fundNumber", static: false, private: false, access: { has: obj => "fundNumber" in obj, get: obj => obj.fundNumber, set: (obj, value) => { obj.fundNumber = value; } }, metadata: _metadata }, _fundNumber_initializers, _fundNumber_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _accounts_decorators, { kind: "field", name: "accounts", static: false, private: false, access: { has: obj => "accounts" in obj, get: obj => obj.accounts, set: (obj, value) => { obj.accounts = value; } }, metadata: _metadata }, _accounts_initializers, _accounts_extraInitializers);
        __esDecorate(null, null, _transactions_decorators, { kind: "field", name: "transactions", static: false, private: false, access: { has: obj => "transactions" in obj, get: obj => obj.transactions, set: (obj, value) => { obj.transactions = value; } }, metadata: _metadata }, _transactions_initializers, _transactions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GovernmentFundModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GovernmentFundModel = _classThis;
})();
exports.GovernmentFundModel = GovernmentFundModel;
/**
 * Account model for Sequelize ORM
 */
let AccountModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'government_accounts', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _fundId_decorators;
    let _fundId_initializers = [];
    let _fundId_extraInitializers = [];
    let _accountNumber_decorators;
    let _accountNumber_initializers = [];
    let _accountNumber_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _classification_decorators;
    let _classification_initializers = [];
    let _classification_extraInitializers = [];
    let _normalBalance_decorators;
    let _normalBalance_initializers = [];
    let _normalBalance_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _parentAccountId_decorators;
    let _parentAccountId_initializers = [];
    let _parentAccountId_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _fund_decorators;
    let _fund_initializers = [];
    let _fund_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var AccountModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.fundId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _fundId_initializers, void 0));
            this.accountNumber = (__runInitializers(this, _fundId_extraInitializers), __runInitializers(this, _accountNumber_initializers, void 0));
            this.name = (__runInitializers(this, _accountNumber_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.classification = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _classification_initializers, void 0));
            this.normalBalance = (__runInitializers(this, _classification_extraInitializers), __runInitializers(this, _normalBalance_initializers, void 0));
            this.isActive = (__runInitializers(this, _normalBalance_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.parentAccountId = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _parentAccountId_initializers, void 0));
            this.metadata = (__runInitializers(this, _parentAccountId_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.fund = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _fund_initializers, void 0));
            this.createdAt = (__runInitializers(this, _fund_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AccountModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _fundId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => GovernmentFundModel), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _accountNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, unique: true })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _classification_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(AccountClassification)),
                allowNull: false,
            })];
        _normalBalance_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('debit', 'credit'),
                allowNull: false,
            })];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _parentAccountId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: {} })];
        _fund_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => GovernmentFundModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _fundId_decorators, { kind: "field", name: "fundId", static: false, private: false, access: { has: obj => "fundId" in obj, get: obj => obj.fundId, set: (obj, value) => { obj.fundId = value; } }, metadata: _metadata }, _fundId_initializers, _fundId_extraInitializers);
        __esDecorate(null, null, _accountNumber_decorators, { kind: "field", name: "accountNumber", static: false, private: false, access: { has: obj => "accountNumber" in obj, get: obj => obj.accountNumber, set: (obj, value) => { obj.accountNumber = value; } }, metadata: _metadata }, _accountNumber_initializers, _accountNumber_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _classification_decorators, { kind: "field", name: "classification", static: false, private: false, access: { has: obj => "classification" in obj, get: obj => obj.classification, set: (obj, value) => { obj.classification = value; } }, metadata: _metadata }, _classification_initializers, _classification_extraInitializers);
        __esDecorate(null, null, _normalBalance_decorators, { kind: "field", name: "normalBalance", static: false, private: false, access: { has: obj => "normalBalance" in obj, get: obj => obj.normalBalance, set: (obj, value) => { obj.normalBalance = value; } }, metadata: _metadata }, _normalBalance_initializers, _normalBalance_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _parentAccountId_decorators, { kind: "field", name: "parentAccountId", static: false, private: false, access: { has: obj => "parentAccountId" in obj, get: obj => obj.parentAccountId, set: (obj, value) => { obj.parentAccountId = value; } }, metadata: _metadata }, _parentAccountId_initializers, _parentAccountId_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _fund_decorators, { kind: "field", name: "fund", static: false, private: false, access: { has: obj => "fund" in obj, get: obj => obj.fund, set: (obj, value) => { obj.fund = value; } }, metadata: _metadata }, _fund_initializers, _fund_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AccountModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AccountModel = _classThis;
})();
exports.AccountModel = AccountModel;
/**
 * Transaction model for Sequelize ORM
 */
let TransactionModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'government_transactions', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _fundId_decorators;
    let _fundId_initializers = [];
    let _fundId_extraInitializers = [];
    let _transactionDate_decorators;
    let _transactionDate_initializers = [];
    let _transactionDate_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _journalEntries_decorators;
    let _journalEntries_initializers = [];
    let _journalEntries_extraInitializers = [];
    let _referenceNumber_decorators;
    let _referenceNumber_initializers = [];
    let _referenceNumber_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _fiscalPeriod_decorators;
    let _fiscalPeriod_initializers = [];
    let _fiscalPeriod_extraInitializers = [];
    let _postedBy_decorators;
    let _postedBy_initializers = [];
    let _postedBy_extraInitializers = [];
    let _postedAt_decorators;
    let _postedAt_initializers = [];
    let _postedAt_extraInitializers = [];
    let _isReversed_decorators;
    let _isReversed_initializers = [];
    let _isReversed_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _fund_decorators;
    let _fund_initializers = [];
    let _fund_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var TransactionModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.fundId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _fundId_initializers, void 0));
            this.transactionDate = (__runInitializers(this, _fundId_extraInitializers), __runInitializers(this, _transactionDate_initializers, void 0));
            this.description = (__runInitializers(this, _transactionDate_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.journalEntries = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _journalEntries_initializers, void 0));
            this.referenceNumber = (__runInitializers(this, _journalEntries_extraInitializers), __runInitializers(this, _referenceNumber_initializers, void 0));
            this.fiscalYear = (__runInitializers(this, _referenceNumber_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
            this.fiscalPeriod = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _fiscalPeriod_initializers, void 0));
            this.postedBy = (__runInitializers(this, _fiscalPeriod_extraInitializers), __runInitializers(this, _postedBy_initializers, void 0));
            this.postedAt = (__runInitializers(this, _postedBy_extraInitializers), __runInitializers(this, _postedAt_initializers, void 0));
            this.isReversed = (__runInitializers(this, _postedAt_extraInitializers), __runInitializers(this, _isReversed_initializers, void 0));
            this.metadata = (__runInitializers(this, _isReversed_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.fund = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _fund_initializers, void 0));
            this.createdAt = (__runInitializers(this, _fund_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TransactionModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _fundId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => GovernmentFundModel), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _transactionDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _journalEntries_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _referenceNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _fiscalYear_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _fiscalPeriod_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _postedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _postedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW })];
        _isReversed_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: {} })];
        _fund_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => GovernmentFundModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _fundId_decorators, { kind: "field", name: "fundId", static: false, private: false, access: { has: obj => "fundId" in obj, get: obj => obj.fundId, set: (obj, value) => { obj.fundId = value; } }, metadata: _metadata }, _fundId_initializers, _fundId_extraInitializers);
        __esDecorate(null, null, _transactionDate_decorators, { kind: "field", name: "transactionDate", static: false, private: false, access: { has: obj => "transactionDate" in obj, get: obj => obj.transactionDate, set: (obj, value) => { obj.transactionDate = value; } }, metadata: _metadata }, _transactionDate_initializers, _transactionDate_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _journalEntries_decorators, { kind: "field", name: "journalEntries", static: false, private: false, access: { has: obj => "journalEntries" in obj, get: obj => obj.journalEntries, set: (obj, value) => { obj.journalEntries = value; } }, metadata: _metadata }, _journalEntries_initializers, _journalEntries_extraInitializers);
        __esDecorate(null, null, _referenceNumber_decorators, { kind: "field", name: "referenceNumber", static: false, private: false, access: { has: obj => "referenceNumber" in obj, get: obj => obj.referenceNumber, set: (obj, value) => { obj.referenceNumber = value; } }, metadata: _metadata }, _referenceNumber_initializers, _referenceNumber_extraInitializers);
        __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
        __esDecorate(null, null, _fiscalPeriod_decorators, { kind: "field", name: "fiscalPeriod", static: false, private: false, access: { has: obj => "fiscalPeriod" in obj, get: obj => obj.fiscalPeriod, set: (obj, value) => { obj.fiscalPeriod = value; } }, metadata: _metadata }, _fiscalPeriod_initializers, _fiscalPeriod_extraInitializers);
        __esDecorate(null, null, _postedBy_decorators, { kind: "field", name: "postedBy", static: false, private: false, access: { has: obj => "postedBy" in obj, get: obj => obj.postedBy, set: (obj, value) => { obj.postedBy = value; } }, metadata: _metadata }, _postedBy_initializers, _postedBy_extraInitializers);
        __esDecorate(null, null, _postedAt_decorators, { kind: "field", name: "postedAt", static: false, private: false, access: { has: obj => "postedAt" in obj, get: obj => obj.postedAt, set: (obj, value) => { obj.postedAt = value; } }, metadata: _metadata }, _postedAt_initializers, _postedAt_extraInitializers);
        __esDecorate(null, null, _isReversed_decorators, { kind: "field", name: "isReversed", static: false, private: false, access: { has: obj => "isReversed" in obj, get: obj => obj.isReversed, set: (obj, value) => { obj.isReversed = value; } }, metadata: _metadata }, _isReversed_initializers, _isReversed_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _fund_decorators, { kind: "field", name: "fund", static: false, private: false, access: { has: obj => "fund" in obj, get: obj => obj.fund, set: (obj, value) => { obj.fund = value; } }, metadata: _metadata }, _fund_initializers, _fund_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TransactionModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TransactionModel = _classThis;
})();
exports.TransactionModel = TransactionModel;
/**
 * Financial report model for Sequelize ORM
 */
let FinancialReportModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'financial_reports', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _entityId_decorators;
    let _entityId_initializers = [];
    let _entityId_extraInitializers = [];
    let _statementType_decorators;
    let _statementType_initializers = [];
    let _statementType_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _reportDate_decorators;
    let _reportDate_initializers = [];
    let _reportDate_extraInitializers = [];
    let _data_decorators;
    let _data_initializers = [];
    let _data_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var FinancialReportModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.entityId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _entityId_initializers, void 0));
            this.statementType = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _statementType_initializers, void 0));
            this.fiscalYear = (__runInitializers(this, _statementType_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
            this.reportDate = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _reportDate_initializers, void 0));
            this.data = (__runInitializers(this, _reportDate_extraInitializers), __runInitializers(this, _data_initializers, void 0));
            this.metadata = (__runInitializers(this, _data_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "FinancialReportModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _entityId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _statementType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(FinancialStatementType)),
                allowNull: false,
            })];
        _fiscalYear_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _reportDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _data_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: {} })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
        __esDecorate(null, null, _statementType_decorators, { kind: "field", name: "statementType", static: false, private: false, access: { has: obj => "statementType" in obj, get: obj => obj.statementType, set: (obj, value) => { obj.statementType = value; } }, metadata: _metadata }, _statementType_initializers, _statementType_extraInitializers);
        __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
        __esDecorate(null, null, _reportDate_decorators, { kind: "field", name: "reportDate", static: false, private: false, access: { has: obj => "reportDate" in obj, get: obj => obj.reportDate, set: (obj, value) => { obj.reportDate = value; } }, metadata: _metadata }, _reportDate_initializers, _reportDate_extraInitializers);
        __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: obj => "data" in obj, get: obj => obj.data, set: (obj, value) => { obj.data = value; } }, metadata: _metadata }, _data_initializers, _data_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FinancialReportModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FinancialReportModel = _classThis;
})();
exports.FinancialReportModel = FinancialReportModel;
/**
 * Financial disclosure model for Sequelize ORM
 */
let FinancialDisclosureModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'financial_disclosures', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _entityId_decorators;
    let _entityId_initializers = [];
    let _entityId_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _disclosureType_decorators;
    let _disclosureType_initializers = [];
    let _disclosureType_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _gasb_decorators;
    let _gasb_initializers = [];
    let _gasb_extraInitializers = [];
    let _required_decorators;
    let _required_initializers = [];
    let _required_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var FinancialDisclosureModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.entityId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _entityId_initializers, void 0));
            this.fiscalYear = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
            this.disclosureType = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _disclosureType_initializers, void 0));
            this.title = (__runInitializers(this, _disclosureType_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.content = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.gasb = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _gasb_initializers, void 0));
            this.required = (__runInitializers(this, _gasb_extraInitializers), __runInitializers(this, _required_initializers, void 0));
            this.metadata = (__runInitializers(this, _required_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "FinancialDisclosureModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _entityId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _fiscalYear_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _disclosureType_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _title_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _content_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _gasb_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                defaultValue: [],
            })];
        _required_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: {} })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
        __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
        __esDecorate(null, null, _disclosureType_decorators, { kind: "field", name: "disclosureType", static: false, private: false, access: { has: obj => "disclosureType" in obj, get: obj => obj.disclosureType, set: (obj, value) => { obj.disclosureType = value; } }, metadata: _metadata }, _disclosureType_initializers, _disclosureType_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _gasb_decorators, { kind: "field", name: "gasb", static: false, private: false, access: { has: obj => "gasb" in obj, get: obj => obj.gasb, set: (obj, value) => { obj.gasb = value; } }, metadata: _metadata }, _gasb_initializers, _gasb_extraInitializers);
        __esDecorate(null, null, _required_decorators, { kind: "field", name: "required", static: false, private: false, access: { has: obj => "required" in obj, get: obj => obj.required, set: (obj, value) => { obj.required = value; } }, metadata: _metadata }, _required_initializers, _required_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FinancialDisclosureModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FinancialDisclosureModel = _classThis;
})();
exports.FinancialDisclosureModel = FinancialDisclosureModel;
// ============================================================================
// SWAGGER/OPENAPI DTOs
// ============================================================================
/**
 * Fund creation DTO for Swagger
 */
let CreateFundDto = (() => {
    var _a;
    let _entityId_decorators;
    let _entityId_initializers = [];
    let _entityId_extraInitializers = [];
    let _fundNumber_decorators;
    let _fundNumber_initializers = [];
    let _fundNumber_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    return _a = class CreateFundDto {
            constructor() {
                this.entityId = __runInitializers(this, _entityId_initializers, void 0);
                this.fundNumber = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _fundNumber_initializers, void 0));
                this.name = (__runInitializers(this, _fundNumber_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.type = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.category = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.description = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _entityId_decorators = [(0, swagger_1.ApiProperty)()];
            _fundNumber_decorators = [(0, swagger_1.ApiProperty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)()];
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: FundType })];
            _category_decorators = [(0, swagger_1.ApiProperty)({ enum: FundCategory })];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
            __esDecorate(null, null, _fundNumber_decorators, { kind: "field", name: "fundNumber", static: false, private: false, access: { has: obj => "fundNumber" in obj, get: obj => obj.fundNumber, set: (obj, value) => { obj.fundNumber = value; } }, metadata: _metadata }, _fundNumber_initializers, _fundNumber_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateFundDto = CreateFundDto;
/**
 * Account creation DTO for Swagger
 */
let CreateAccountDto = (() => {
    var _a;
    let _fundId_decorators;
    let _fundId_initializers = [];
    let _fundId_extraInitializers = [];
    let _accountNumber_decorators;
    let _accountNumber_initializers = [];
    let _accountNumber_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _classification_decorators;
    let _classification_initializers = [];
    let _classification_extraInitializers = [];
    let _normalBalance_decorators;
    let _normalBalance_initializers = [];
    let _normalBalance_extraInitializers = [];
    let _parentAccountId_decorators;
    let _parentAccountId_initializers = [];
    let _parentAccountId_extraInitializers = [];
    return _a = class CreateAccountDto {
            constructor() {
                this.fundId = __runInitializers(this, _fundId_initializers, void 0);
                this.accountNumber = (__runInitializers(this, _fundId_extraInitializers), __runInitializers(this, _accountNumber_initializers, void 0));
                this.name = (__runInitializers(this, _accountNumber_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.classification = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _classification_initializers, void 0));
                this.normalBalance = (__runInitializers(this, _classification_extraInitializers), __runInitializers(this, _normalBalance_initializers, void 0));
                this.parentAccountId = (__runInitializers(this, _normalBalance_extraInitializers), __runInitializers(this, _parentAccountId_initializers, void 0));
                __runInitializers(this, _parentAccountId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fundId_decorators = [(0, swagger_1.ApiProperty)()];
            _accountNumber_decorators = [(0, swagger_1.ApiProperty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)()];
            _classification_decorators = [(0, swagger_1.ApiProperty)({ enum: AccountClassification })];
            _normalBalance_decorators = [(0, swagger_1.ApiProperty)({ enum: ['debit', 'credit'] })];
            _parentAccountId_decorators = [(0, swagger_1.ApiProperty)({ required: false })];
            __esDecorate(null, null, _fundId_decorators, { kind: "field", name: "fundId", static: false, private: false, access: { has: obj => "fundId" in obj, get: obj => obj.fundId, set: (obj, value) => { obj.fundId = value; } }, metadata: _metadata }, _fundId_initializers, _fundId_extraInitializers);
            __esDecorate(null, null, _accountNumber_decorators, { kind: "field", name: "accountNumber", static: false, private: false, access: { has: obj => "accountNumber" in obj, get: obj => obj.accountNumber, set: (obj, value) => { obj.accountNumber = value; } }, metadata: _metadata }, _accountNumber_initializers, _accountNumber_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _classification_decorators, { kind: "field", name: "classification", static: false, private: false, access: { has: obj => "classification" in obj, get: obj => obj.classification, set: (obj, value) => { obj.classification = value; } }, metadata: _metadata }, _classification_initializers, _classification_extraInitializers);
            __esDecorate(null, null, _normalBalance_decorators, { kind: "field", name: "normalBalance", static: false, private: false, access: { has: obj => "normalBalance" in obj, get: obj => obj.normalBalance, set: (obj, value) => { obj.normalBalance = value; } }, metadata: _metadata }, _normalBalance_initializers, _normalBalance_extraInitializers);
            __esDecorate(null, null, _parentAccountId_decorators, { kind: "field", name: "parentAccountId", static: false, private: false, access: { has: obj => "parentAccountId" in obj, get: obj => obj.parentAccountId, set: (obj, value) => { obj.parentAccountId = value; } }, metadata: _metadata }, _parentAccountId_initializers, _parentAccountId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateAccountDto = CreateAccountDto;
/**
 * Transaction creation DTO for Swagger
 */
let CreateTransactionDto = (() => {
    var _a;
    let _fundId_decorators;
    let _fundId_initializers = [];
    let _fundId_extraInitializers = [];
    let _transactionDate_decorators;
    let _transactionDate_initializers = [];
    let _transactionDate_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _journalEntries_decorators;
    let _journalEntries_initializers = [];
    let _journalEntries_extraInitializers = [];
    let _referenceNumber_decorators;
    let _referenceNumber_initializers = [];
    let _referenceNumber_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _fiscalPeriod_decorators;
    let _fiscalPeriod_initializers = [];
    let _fiscalPeriod_extraInitializers = [];
    return _a = class CreateTransactionDto {
            constructor() {
                this.fundId = __runInitializers(this, _fundId_initializers, void 0);
                this.transactionDate = (__runInitializers(this, _fundId_extraInitializers), __runInitializers(this, _transactionDate_initializers, void 0));
                this.description = (__runInitializers(this, _transactionDate_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.journalEntries = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _journalEntries_initializers, void 0));
                this.referenceNumber = (__runInitializers(this, _journalEntries_extraInitializers), __runInitializers(this, _referenceNumber_initializers, void 0));
                this.fiscalYear = (__runInitializers(this, _referenceNumber_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
                this.fiscalPeriod = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _fiscalPeriod_initializers, void 0));
                __runInitializers(this, _fiscalPeriod_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fundId_decorators = [(0, swagger_1.ApiProperty)()];
            _transactionDate_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _journalEntries_decorators = [(0, swagger_1.ApiProperty)({ type: [Object] })];
            _referenceNumber_decorators = [(0, swagger_1.ApiProperty)({ required: false })];
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)()];
            _fiscalPeriod_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _fundId_decorators, { kind: "field", name: "fundId", static: false, private: false, access: { has: obj => "fundId" in obj, get: obj => obj.fundId, set: (obj, value) => { obj.fundId = value; } }, metadata: _metadata }, _fundId_initializers, _fundId_extraInitializers);
            __esDecorate(null, null, _transactionDate_decorators, { kind: "field", name: "transactionDate", static: false, private: false, access: { has: obj => "transactionDate" in obj, get: obj => obj.transactionDate, set: (obj, value) => { obj.transactionDate = value; } }, metadata: _metadata }, _transactionDate_initializers, _transactionDate_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _journalEntries_decorators, { kind: "field", name: "journalEntries", static: false, private: false, access: { has: obj => "journalEntries" in obj, get: obj => obj.journalEntries, set: (obj, value) => { obj.journalEntries = value; } }, metadata: _metadata }, _journalEntries_initializers, _journalEntries_extraInitializers);
            __esDecorate(null, null, _referenceNumber_decorators, { kind: "field", name: "referenceNumber", static: false, private: false, access: { has: obj => "referenceNumber" in obj, get: obj => obj.referenceNumber, set: (obj, value) => { obj.referenceNumber = value; } }, metadata: _metadata }, _referenceNumber_initializers, _referenceNumber_extraInitializers);
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _fiscalPeriod_decorators, { kind: "field", name: "fiscalPeriod", static: false, private: false, access: { has: obj => "fiscalPeriod" in obj, get: obj => obj.fiscalPeriod, set: (obj, value) => { obj.fiscalPeriod = value; } }, metadata: _metadata }, _fiscalPeriod_initializers, _fiscalPeriod_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateTransactionDto = CreateTransactionDto;
/**
 * CAFR generation DTO for Swagger
 */
let GenerateCAFRDto = (() => {
    var _a;
    let _entityId_decorators;
    let _entityId_initializers = [];
    let _entityId_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _transmittalLetter_decorators;
    let _transmittalLetter_initializers = [];
    let _transmittalLetter_extraInitializers = [];
    let _principalOfficials_decorators;
    let _principalOfficials_initializers = [];
    let _principalOfficials_extraInitializers = [];
    return _a = class GenerateCAFRDto {
            constructor() {
                this.entityId = __runInitializers(this, _entityId_initializers, void 0);
                this.fiscalYear = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
                this.transmittalLetter = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _transmittalLetter_initializers, void 0));
                this.principalOfficials = (__runInitializers(this, _transmittalLetter_extraInitializers), __runInitializers(this, _principalOfficials_initializers, void 0));
                __runInitializers(this, _principalOfficials_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _entityId_decorators = [(0, swagger_1.ApiProperty)()];
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)()];
            _transmittalLetter_decorators = [(0, swagger_1.ApiProperty)()];
            _principalOfficials_decorators = [(0, swagger_1.ApiProperty)({ type: [Object] })];
            __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _transmittalLetter_decorators, { kind: "field", name: "transmittalLetter", static: false, private: false, access: { has: obj => "transmittalLetter" in obj, get: obj => obj.transmittalLetter, set: (obj, value) => { obj.transmittalLetter = value; } }, metadata: _metadata }, _transmittalLetter_initializers, _transmittalLetter_extraInitializers);
            __esDecorate(null, null, _principalOfficials_decorators, { kind: "field", name: "principalOfficials", static: false, private: false, access: { has: obj => "principalOfficials" in obj, get: obj => obj.principalOfficials, set: (obj, value) => { obj.principalOfficials = value; } }, metadata: _metadata }, _principalOfficials_initializers, _principalOfficials_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.GenerateCAFRDto = GenerateCAFRDto;
// ============================================================================
// ID GENERATION
// ============================================================================
/**
 * @function createReportId
 * @description Generates a unique report ID
 * @returns {ReportId} Unique report ID
 *
 * @example
 * ```typescript
 * const reportId = createReportId();
 * ```
 */
const createReportId = () => {
    return `rpt_${crypto.randomUUID()}`;
};
exports.createReportId = createReportId;
/**
 * @function createFundId
 * @description Generates a unique fund ID
 * @returns {FundId} Unique fund ID
 *
 * @example
 * ```typescript
 * const fundId = createFundId();
 * ```
 */
const createFundId = () => {
    return `fund_${crypto.randomUUID()}`;
};
exports.createFundId = createFundId;
/**
 * @function createAccountId
 * @description Generates a unique account ID
 * @returns {AccountId} Unique account ID
 *
 * @example
 * ```typescript
 * const accountId = createAccountId();
 * ```
 */
const createAccountId = () => {
    return `acct_${crypto.randomUUID()}`;
};
exports.createAccountId = createAccountId;
/**
 * @function createTransactionId
 * @description Generates a unique transaction ID
 * @returns {TransactionId} Unique transaction ID
 *
 * @example
 * ```typescript
 * const transactionId = createTransactionId();
 * ```
 */
const createTransactionId = () => {
    return `txn_${crypto.randomUUID()}`;
};
exports.createTransactionId = createTransactionId;
/**
 * @function createDisclosureId
 * @description Generates a unique disclosure ID
 * @returns {DisclosureId} Unique disclosure ID
 *
 * @example
 * ```typescript
 * const disclosureId = createDisclosureId();
 * ```
 */
const createDisclosureId = () => {
    return `disc_${crypto.randomUUID()}`;
};
exports.createDisclosureId = createDisclosureId;
// ============================================================================
// FUND MANAGEMENT
// ============================================================================
/**
 * @function createFund
 * @description Creates a new government fund
 * @param {string} entityId - Entity ID
 * @param {string} fundNumber - Fund number
 * @param {string} name - Fund name
 * @param {FundType} type - Fund type
 * @param {FundCategory} category - Fund category
 * @param {string} description - Fund description
 * @returns {GovernmentFund} Created fund
 *
 * @example
 * ```typescript
 * const fund = createFund(
 *   entityId,
 *   '001',
 *   'General Fund',
 *   FundType.GENERAL,
 *   FundCategory.GOVERNMENTAL,
 *   'Primary operating fund'
 * );
 * ```
 */
const createFund = (entityId, fundNumber, name, type, category, description) => {
    return {
        id: (0, exports.createFundId)(),
        entityId,
        fundNumber,
        name,
        type,
        category,
        description,
        isActive: true,
        createdAt: new Date(),
        metadata: {},
    };
};
exports.createFund = createFund;
/**
 * @function categorizeFund
 * @description Categorizes fund based on type
 * @param {FundType} fundType - Fund type
 * @returns {FundCategory} Fund category
 *
 * @example
 * ```typescript
 * const category = categorizeFund(FundType.GENERAL);
 * // Returns FundCategory.GOVERNMENTAL
 * ```
 */
const categorizeFund = (fundType) => {
    const governmentalFunds = [
        FundType.GENERAL,
        FundType.SPECIAL_REVENUE,
        FundType.CAPITAL_PROJECTS,
        FundType.DEBT_SERVICE,
        FundType.PERMANENT,
    ];
    const proprietaryFunds = [
        FundType.ENTERPRISE,
        FundType.INTERNAL_SERVICE,
    ];
    if (governmentalFunds.includes(fundType)) {
        return FundCategory.GOVERNMENTAL;
    }
    else if (proprietaryFunds.includes(fundType)) {
        return FundCategory.PROPRIETARY;
    }
    return FundCategory.FIDUCIARY;
};
exports.categorizeFund = categorizeFund;
// ============================================================================
// CHART OF ACCOUNTS
// ============================================================================
/**
 * @function createAccount
 * @description Creates a new chart of accounts entry
 * @param {FundId} fundId - Fund ID
 * @param {string} accountNumber - Account number
 * @param {string} name - Account name
 * @param {AccountClassification} classification - Account classification
 * @param {string} normalBalance - Normal balance (debit/credit)
 * @returns {Account} Created account
 *
 * @example
 * ```typescript
 * const account = createAccount(
 *   fundId,
 *   '1010',
 *   'Cash',
 *   AccountClassification.ASSET,
 *   'debit'
 * );
 * ```
 */
const createAccount = (fundId, accountNumber, name, classification, normalBalance) => {
    return {
        id: (0, exports.createAccountId)(),
        fundId,
        accountNumber,
        name,
        classification,
        normalBalance,
        isActive: true,
        metadata: {},
    };
};
exports.createAccount = createAccount;
/**
 * @function determineNormalBalance
 * @description Determines normal balance for account classification
 * @param {AccountClassification} classification - Account classification
 * @returns {string} Normal balance (debit or credit)
 *
 * @example
 * ```typescript
 * const normalBalance = determineNormalBalance(AccountClassification.ASSET);
 * // Returns 'debit'
 * ```
 */
const determineNormalBalance = (classification) => {
    const debitAccounts = [
        AccountClassification.ASSET,
        AccountClassification.EXPENSE,
        AccountClassification.EXPENDITURE,
        AccountClassification.OTHER_FINANCING_USE,
        AccountClassification.DEFERRED_OUTFLOW,
    ];
    return debitAccounts.includes(classification) ? 'debit' : 'credit';
};
exports.determineNormalBalance = determineNormalBalance;
// ============================================================================
// JOURNAL ENTRIES AND TRANSACTIONS
// ============================================================================
/**
 * @function createTransaction
 * @description Creates a financial transaction with journal entries
 * @param {FundId} fundId - Fund ID
 * @param {Date} transactionDate - Transaction date
 * @param {string} description - Description
 * @param {JournalEntry[]} journalEntries - Journal entries
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} postedBy - Posted by user
 * @returns {FinancialTransaction} Created transaction
 *
 * @example
 * ```typescript
 * const transaction = createTransaction(
 *   fundId,
 *   new Date(),
 *   'Property tax revenue',
 *   journalEntries,
 *   2024,
 *   1,
 *   'admin@gov.org'
 * );
 * ```
 */
const createTransaction = (fundId, transactionDate, description, journalEntries, fiscalYear, fiscalPeriod, postedBy) => {
    return {
        id: (0, exports.createTransactionId)(),
        fundId,
        transactionDate,
        description,
        journalEntries,
        fiscalYear,
        fiscalPeriod,
        postedBy,
        postedAt: new Date(),
        isReversed: false,
        metadata: {},
    };
};
exports.createTransaction = createTransaction;
/**
 * @function validateJournalEntries
 * @description Validates that journal entries are balanced
 * @param {JournalEntry[]} entries - Journal entries to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateJournalEntries(journalEntries);
 * if (!validation.isBalanced) {
 *   console.error('Entries not balanced');
 * }
 * ```
 */
const validateJournalEntries = (entries) => {
    const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
    const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);
    const difference = Math.abs(totalDebit - totalCredit);
    return {
        isBalanced: difference < 0.01, // Allow for rounding errors
        totalDebit,
        totalCredit,
        difference,
    };
};
exports.validateJournalEntries = validateJournalEntries;
/**
 * @function reverseTransaction
 * @description Creates reversing journal entries
 * @param {FinancialTransaction} transaction - Transaction to reverse
 * @param {Date} reversalDate - Reversal date
 * @param {string} postedBy - Posted by user
 * @returns {FinancialTransaction} Reversing transaction
 *
 * @example
 * ```typescript
 * const reversal = reverseTransaction(transaction, new Date(), 'admin@gov.org');
 * ```
 */
const reverseTransaction = (transaction, reversalDate, postedBy) => {
    const reversedEntries = transaction.journalEntries.map(entry => ({
        ...entry,
        debit: entry.credit,
        credit: entry.debit,
    }));
    return {
        id: (0, exports.createTransactionId)(),
        fundId: transaction.fundId,
        transactionDate: reversalDate,
        description: `REVERSAL: ${transaction.description}`,
        journalEntries: reversedEntries,
        fiscalYear: transaction.fiscalYear,
        fiscalPeriod: transaction.fiscalPeriod,
        postedBy,
        postedAt: new Date(),
        isReversed: false,
        metadata: {
            reversalOf: transaction.id,
        },
    };
};
exports.reverseTransaction = reverseTransaction;
// ============================================================================
// GOVERNMENT-WIDE STATEMENTS
// ============================================================================
/**
 * @function createStatementOfNetPosition
 * @description Creates government-wide statement of net position
 * @param {EntityId} entityId - Entity ID
 * @param {Date} asOfDate - Statement date
 * @param {number} fiscalYear - Fiscal year
 * @param {NetPositionData} governmental - Governmental activities data
 * @param {NetPositionData} businessType - Business-type activities data
 * @returns {StatementOfNetPosition} Statement of net position
 *
 * @example
 * ```typescript
 * const statement = createStatementOfNetPosition(
 *   entityId,
 *   new Date('2024-06-30'),
 *   2024,
 *   governmentalData,
 *   businessTypeData
 * );
 * ```
 */
const createStatementOfNetPosition = (entityId, asOfDate, fiscalYear, governmental, businessType) => {
    const total = {
        assets: {
            currentAssets: governmental.assets.currentAssets + businessType.assets.currentAssets,
            capitalAssets: governmental.assets.capitalAssets + businessType.assets.capitalAssets,
            otherAssets: governmental.assets.otherAssets + businessType.assets.otherAssets,
            totalAssets: governmental.assets.totalAssets + businessType.assets.totalAssets,
        },
        deferredOutflows: governmental.deferredOutflows + businessType.deferredOutflows,
        liabilities: {
            currentLiabilities: governmental.liabilities.currentLiabilities + businessType.liabilities.currentLiabilities,
            longTermLiabilities: governmental.liabilities.longTermLiabilities + businessType.liabilities.longTermLiabilities,
            totalLiabilities: governmental.liabilities.totalLiabilities + businessType.liabilities.totalLiabilities,
        },
        deferredInflows: governmental.deferredInflows + businessType.deferredInflows,
        netPosition: {
            netInvestmentInCapitalAssets: governmental.netPosition.netInvestmentInCapitalAssets + businessType.netPosition.netInvestmentInCapitalAssets,
            restricted: governmental.netPosition.restricted + businessType.netPosition.restricted,
            unrestricted: governmental.netPosition.unrestricted + businessType.netPosition.unrestricted,
            totalNetPosition: governmental.netPosition.totalNetPosition + businessType.netPosition.totalNetPosition,
        },
    };
    return {
        reportId: (0, exports.createReportId)(),
        entityId,
        asOfDate,
        fiscalYear,
        governmental,
        businessType,
        total,
        metadata: {},
    };
};
exports.createStatementOfNetPosition = createStatementOfNetPosition;
/**
 * @function createStatementOfActivities
 * @description Creates government-wide statement of activities
 * @param {EntityId} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {FunctionActivity[]} functions - Function activities
 * @param {GeneralRevenue[]} generalRevenues - General revenues
 * @returns {StatementOfActivities} Statement of activities
 *
 * @example
 * ```typescript
 * const statement = createStatementOfActivities(
 *   entityId,
 *   2024,
 *   functionActivities,
 *   generalRevenues
 * );
 * ```
 */
const createStatementOfActivities = (entityId, fiscalYear, functions, generalRevenues) => {
    const totalNetExpenseRevenue = functions.reduce((sum, func) => ({
        governmental: sum.governmental + func.netExpenseRevenue.governmental,
        businessType: sum.businessType + func.netExpenseRevenue.businessType,
        total: sum.total + func.netExpenseRevenue.total,
    }), { governmental: 0, businessType: 0, total: 0 });
    const totalGeneralRevenues = generalRevenues.reduce((sum, rev) => ({
        description: 'Total',
        governmental: sum.governmental + rev.governmental,
        businessType: sum.businessType + rev.businessType,
        total: sum.total + rev.total,
    }), { description: 'Total', governmental: 0, businessType: 0, total: 0 });
    const changeInNetPosition = {
        governmental: totalNetExpenseRevenue.governmental + totalGeneralRevenues.governmental,
        businessType: totalNetExpenseRevenue.businessType + totalGeneralRevenues.businessType,
        total: totalNetExpenseRevenue.total + totalGeneralRevenues.total,
    };
    return {
        reportId: (0, exports.createReportId)(),
        entityId,
        fiscalYear,
        functions,
        generalRevenues,
        changeInNetPosition,
        metadata: {},
    };
};
exports.createStatementOfActivities = createStatementOfActivities;
// ============================================================================
// FUND FINANCIAL STATEMENTS
// ============================================================================
/**
 * @function createFundBalanceSheet
 * @description Creates fund balance sheet
 * @param {FundId} fundId - Fund ID
 * @param {Date} asOfDate - Statement date
 * @param {number} fiscalYear - Fiscal year
 * @param {FundAssets} assets - Fund assets
 * @param {FundLiabilities} liabilities - Fund liabilities
 * @param {FundBalance} fundBalance - Fund balance
 * @returns {FundBalanceSheet} Fund balance sheet
 *
 * @example
 * ```typescript
 * const balanceSheet = createFundBalanceSheet(
 *   fundId,
 *   new Date('2024-06-30'),
 *   2024,
 *   assets,
 *   liabilities,
 *   fundBalance
 * );
 * ```
 */
const createFundBalanceSheet = (fundId, asOfDate, fiscalYear, assets, liabilities, fundBalance) => {
    return {
        reportId: (0, exports.createReportId)(),
        fundId,
        asOfDate,
        fiscalYear,
        assets,
        liabilities,
        deferredInflows: 0,
        fundBalance,
        metadata: {},
    };
};
exports.createFundBalanceSheet = createFundBalanceSheet;
/**
 * @function classifyFundBalance
 * @description Classifies fund balance per GASB 54
 * @param {number} totalFundBalance - Total fund balance
 * @param {object} constraints - Fund balance constraints
 * @returns {FundBalance} Classified fund balance
 *
 * @example
 * ```typescript
 * const classified = classifyFundBalance(1000000, {
 *   nonspendable: 50000,
 *   restricted: 200000,
 *   committed: 150000,
 *   assigned: 100000
 * });
 * ```
 */
const classifyFundBalance = (totalFundBalance, constraints) => {
    const nonspendable = constraints.nonspendable || 0;
    const restricted = constraints.restricted || 0;
    const committed = constraints.committed || 0;
    const assigned = constraints.assigned || 0;
    const unassigned = totalFundBalance - nonspendable - restricted - committed - assigned;
    return {
        nonspendable,
        restricted,
        committed,
        assigned,
        unassigned,
        total: totalFundBalance,
    };
};
exports.classifyFundBalance = classifyFundBalance;
/**
 * @function createStatementOfRevenuesExpenditures
 * @description Creates statement of revenues, expenditures, and changes in fund balance
 * @param {FundId} fundId - Fund ID
 * @param {number} fiscalYear - Fiscal year
 * @param {RevenueCategory[]} revenues - Revenue categories
 * @param {ExpenditureCategory[]} expenditures - Expenditure categories
 * @param {number} fundBalanceBeginning - Beginning fund balance
 * @returns {StatementOfRevenuesExpenditures} Statement
 *
 * @example
 * ```typescript
 * const statement = createStatementOfRevenuesExpenditures(
 *   fundId,
 *   2024,
 *   revenues,
 *   expenditures,
 *   1000000
 * );
 * ```
 */
const createStatementOfRevenuesExpenditures = (fundId, fiscalYear, revenues, expenditures, fundBalanceBeginning) => {
    const totalRevenues = revenues.reduce((sum, r) => sum + r.actual, 0);
    const totalExpenditures = expenditures.reduce((sum, e) => sum + e.actual, 0);
    const excessDeficiency = totalRevenues - totalExpenditures;
    return {
        reportId: (0, exports.createReportId)(),
        fundId,
        fiscalYear,
        revenues,
        totalRevenues,
        expenditures,
        totalExpenditures,
        excessDeficiency,
        otherFinancingSources: [],
        otherFinancingUses: [],
        netOtherFinancing: 0,
        changeInFundBalance: excessDeficiency,
        fundBalanceBeginning,
        fundBalanceEnding: fundBalanceBeginning + excessDeficiency,
        metadata: {},
    };
};
exports.createStatementOfRevenuesExpenditures = createStatementOfRevenuesExpenditures;
/**
 * @function calculateBudgetVariance
 * @description Calculates budget variance
 * @param {number} budgeted - Budgeted amount
 * @param {number} actual - Actual amount
 * @returns {object} Variance data
 *
 * @example
 * ```typescript
 * const variance = calculateBudgetVariance(100000, 95000);
 * // Returns { variance: 5000, variancePercent: 5, favorable: true }
 * ```
 */
const calculateBudgetVariance = (budgeted, actual) => {
    const variance = budgeted - actual;
    const variancePercent = budgeted !== 0 ? (variance / budgeted) * 100 : 0;
    const favorable = variance >= 0;
    return {
        variance,
        variancePercent,
        favorable,
    };
};
exports.calculateBudgetVariance = calculateBudgetVariance;
// ============================================================================
// RECONCILIATION STATEMENTS
// ============================================================================
/**
 * @function createReconciliation
 * @description Creates reconciliation from fund to government-wide
 * @param {string} reconciliationType - Type of reconciliation
 * @param {number} fundBalance - Fund balance or change
 * @param {ReconciliationAdjustment[]} adjustments - Reconciliation adjustments
 * @returns {ReconciliationStatement} Reconciliation statement
 *
 * @example
 * ```typescript
 * const reconciliation = createReconciliation(
 *   'Fund Balance to Net Position',
 *   5000000,
 *   adjustments
 * );
 * ```
 */
const createReconciliation = (reconciliationType, fundBalance, adjustments) => {
    const totalAdjustments = adjustments.reduce((sum, adj) => sum + adj.amount, 0);
    const netPosition = fundBalance + totalAdjustments;
    return {
        reconciliationType,
        fundBalance,
        adjustments,
        netPosition,
    };
};
exports.createReconciliation = createReconciliation;
/**
 * @function addReconciliationAdjustment
 * @description Adds capital assets adjustment to reconciliation
 * @param {string} description - Adjustment description
 * @param {number} amount - Adjustment amount
 * @param {string} explanation - Detailed explanation
 * @returns {ReconciliationAdjustment} Reconciliation adjustment
 *
 * @example
 * ```typescript
 * const adjustment = addReconciliationAdjustment(
 *   'Capital assets used in governmental activities',
 *   10000000,
 *   'Capital assets are not financial resources...'
 * );
 * ```
 */
const addReconciliationAdjustment = (description, amount, explanation) => {
    return {
        description,
        amount,
        explanation,
    };
};
exports.addReconciliationAdjustment = addReconciliationAdjustment;
// ============================================================================
// CAFR GENERATION
// ============================================================================
/**
 * @function createCAFR
 * @description Creates Comprehensive Annual Financial Report
 * @param {EntityId} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {IntroductorySection} introductorySection - Introductory section
 * @param {FinancialSection} financialSection - Financial section
 * @param {StatisticalSection} statisticalSection - Statistical section
 * @returns {CAFR} CAFR report
 *
 * @example
 * ```typescript
 * const cafr = createCAFR(
 *   entityId,
 *   2024,
 *   introductorySection,
 *   financialSection,
 *   statisticalSection
 * );
 * ```
 */
const createCAFR = (entityId, fiscalYear, introductorySection, financialSection, statisticalSection) => {
    return {
        reportId: (0, exports.createReportId)(),
        entityId,
        fiscalYear,
        reportDate: new Date(),
        introductorySection,
        financialSection,
        statisticalSection,
        metadata: {},
    };
};
exports.createCAFR = createCAFR;
/**
 * @function createIntroductorySection
 * @description Creates CAFR introductory section
 * @param {string} transmittalLetter - Transmittal letter content
 * @param {PrincipalOfficial[]} principalOfficials - Principal officials
 * @returns {IntroductorySection} Introductory section
 *
 * @example
 * ```typescript
 * const intro = createIntroductorySection(letter, officials);
 * ```
 */
const createIntroductorySection = (transmittalLetter, principalOfficials) => {
    return {
        transmittalLetter,
        principalOfficials,
    };
};
exports.createIntroductorySection = createIntroductorySection;
/**
 * @function createFinancialSection
 * @description Creates CAFR financial section
 * @param {AuditorsReport} auditorsReport - Independent auditors report
 * @param {string} mda - Management discussion and analysis
 * @param {BasicFinancialStatements} basicStatements - Basic financial statements
 * @param {Note[]} notes - Notes to financial statements
 * @returns {FinancialSection} Financial section
 *
 * @example
 * ```typescript
 * const financial = createFinancialSection(audit, mda, statements, notes);
 * ```
 */
const createFinancialSection = (auditorsReport, mda, basicStatements, notes) => {
    return {
        independentAuditorsReport: auditorsReport,
        managementDiscussionAnalysis: mda,
        basicFinancialStatements: basicStatements,
        requiredSupplementaryInformation: [],
        notesToFinancialStatements: notes,
    };
};
exports.createFinancialSection = createFinancialSection;
// ============================================================================
// NOTES TO FINANCIAL STATEMENTS
// ============================================================================
/**
 * @function createNote
 * @description Creates note to financial statements
 * @param {string} noteNumber - Note number
 * @param {string} title - Note title
 * @param {string} content - Note content
 * @param {GASBStatement[]} gasb - Applicable GASB statements
 * @returns {Note} Financial statement note
 *
 * @example
 * ```typescript
 * const note = createNote(
 *   'I',
 *   'Summary of Significant Accounting Policies',
 *   content,
 *   [GASBStatement.GASB_34]
 * );
 * ```
 */
const createNote = (noteNumber, title, content, gasb) => {
    return {
        noteNumber,
        title,
        content,
        subsections: [],
        gasb,
    };
};
exports.createNote = createNote;
/**
 * @function addNoteSubsection
 * @description Adds subsection to note
 * @param {Note} note - Note to update
 * @param {string} letter - Subsection letter
 * @param {string} title - Subsection title
 * @param {string} content - Subsection content
 * @returns {Note} Updated note
 *
 * @example
 * ```typescript
 * const updated = addNoteSubsection(note, 'A', 'Reporting Entity', content);
 * ```
 */
const addNoteSubsection = (note, letter, title, content) => {
    return {
        ...note,
        subsections: [
            ...(note.subsections || []),
            { letter, title, content },
        ],
    };
};
exports.addNoteSubsection = addNoteSubsection;
/**
 * @function generateRequiredNotes
 * @description Generates list of required notes per GASB
 * @returns {object[]} Required notes list
 *
 * @example
 * ```typescript
 * const required = generateRequiredNotes();
 * ```
 */
const generateRequiredNotes = () => {
    return [
        { noteNumber: 'I', title: 'Summary of Significant Accounting Policies', gasb: [GASBStatement.GASB_34] },
        { noteNumber: 'II', title: 'Reconciliation of Government-wide and Fund Financial Statements', gasb: [GASBStatement.GASB_34] },
        { noteNumber: 'III', title: 'Detailed Notes on All Funds', gasb: [GASBStatement.GASB_34] },
        { noteNumber: 'IV', title: 'Capital Assets', gasb: [GASBStatement.GASB_34] },
        { noteNumber: 'V', title: 'Long-term Debt', gasb: [GASBStatement.GASB_34] },
        { noteNumber: 'VI', title: 'Fund Balances', gasb: [GASBStatement.GASB_54] },
        { noteNumber: 'VII', title: 'Pension Plans', gasb: [GASBStatement.GASB_68] },
        { noteNumber: 'VIII', title: 'Other Post-Employment Benefits', gasb: [GASBStatement.GASB_75] },
        { noteNumber: 'IX', title: 'Leases', gasb: [GASBStatement.GASB_87] },
        { noteNumber: 'X', title: 'Risk Management', gasb: [GASBStatement.GASB_34] },
    ];
};
exports.generateRequiredNotes = generateRequiredNotes;
// ============================================================================
// REQUIRED SUPPLEMENTARY INFORMATION
// ============================================================================
/**
 * @function createBudgetComparison
 * @description Creates budget comparison schedule
 * @param {FundId} fundId - Fund ID
 * @param {RevenueCategory[]} revenues - Revenue data
 * @param {ExpenditureCategory[]} expenditures - Expenditure data
 * @returns {RequiredSupplementaryInfo} Budget comparison RSI
 *
 * @example
 * ```typescript
 * const budgetRSI = createBudgetComparison(fundId, revenues, expenditures);
 * ```
 */
const createBudgetComparison = (fundId, revenues, expenditures) => {
    return {
        title: 'Budgetary Comparison Schedule',
        type: 'budget_comparison',
        data: {
            fundId,
            revenues,
            expenditures,
        },
    };
};
exports.createBudgetComparison = createBudgetComparison;
/**
 * @function createPensionRSI
 * @description Creates pension required supplementary information
 * @param {number} fiscalYear - Fiscal year
 * @param {object} pensionData - Pension data
 * @returns {RequiredSupplementaryInfo} Pension RSI
 *
 * @example
 * ```typescript
 * const pensionRSI = createPensionRSI(2024, pensionData);
 * ```
 */
const createPensionRSI = (fiscalYear, pensionData) => {
    return {
        title: 'Schedule of Changes in Net Pension Liability',
        type: 'pension',
        data: {
            fiscalYear,
            ...pensionData,
        },
        notes: 'Required by GASB 68',
    };
};
exports.createPensionRSI = createPensionRSI;
// ============================================================================
// STATISTICAL SECTION
// ============================================================================
/**
 * @function createFinancialTrendTable
 * @description Creates financial trend table
 * @param {string} title - Table title
 * @param {number[]} years - Fiscal years (10 years)
 * @param {object} data - Trend data
 * @returns {FinancialTrendTable} Financial trend table
 *
 * @example
 * ```typescript
 * const trends = createFinancialTrendTable(
 *   'Net Position by Component',
 *   [2015, 2016, ...2024],
 *   trendData
 * );
 * ```
 */
const createFinancialTrendTable = (title, years, data) => {
    return {
        title,
        years,
        data,
    };
};
exports.createFinancialTrendTable = createFinancialTrendTable;
/**
 * @function createRevenueCapacityTable
 * @description Creates revenue capacity table
 * @param {string} title - Table title
 * @param {number[]} years - Fiscal years
 * @param {object} data - Revenue capacity data
 * @returns {RevenueCapacityTable} Revenue capacity table
 *
 * @example
 * ```typescript
 * const revenue = createRevenueCapacityTable(
 *   'Property Tax Levies and Collections',
 *   years,
 *   data
 * );
 * ```
 */
const createRevenueCapacityTable = (title, years, data) => {
    return {
        title,
        years,
        data,
    };
};
exports.createRevenueCapacityTable = createRevenueCapacityTable;
/**
 * @function createDebtCapacityTable
 * @description Creates debt capacity table
 * @param {string} title - Table title
 * @param {number[]} years - Fiscal years
 * @param {object} data - Debt capacity data
 * @returns {DebtCapacityTable} Debt capacity table
 *
 * @example
 * ```typescript
 * const debt = createDebtCapacityTable(
 *   'Ratios of Outstanding Debt',
 *   years,
 *   data
 * );
 * ```
 */
const createDebtCapacityTable = (title, years, data) => {
    return {
        title,
        years,
        data,
    };
};
exports.createDebtCapacityTable = createDebtCapacityTable;
// ============================================================================
// FINANCIAL DISCLOSURES
// ============================================================================
/**
 * @function createFinancialDisclosure
 * @description Creates financial disclosure
 * @param {EntityId} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {string} disclosureType - Disclosure type
 * @param {string} title - Disclosure title
 * @param {string} content - Disclosure content
 * @param {GASBStatement[]} gasb - Applicable GASB statements
 * @returns {FinancialDisclosure} Financial disclosure
 *
 * @example
 * ```typescript
 * const disclosure = createFinancialDisclosure(
 *   entityId,
 *   2024,
 *   'contingent_liabilities',
 *   'Contingent Liabilities',
 *   content,
 *   [GASBStatement.GASB_34]
 * );
 * ```
 */
const createFinancialDisclosure = (entityId, fiscalYear, disclosureType, title, content, gasb) => {
    return {
        id: (0, exports.createDisclosureId)(),
        entityId,
        fiscalYear,
        disclosureType,
        title,
        content,
        gasb,
        required: true,
        createdAt: new Date(),
        metadata: {},
    };
};
exports.createFinancialDisclosure = createFinancialDisclosure;
/**
 * @function validateGASBCompliance
 * @description Validates GASB compliance for report
 * @param {CAFR} cafr - CAFR to validate
 * @returns {object} Compliance validation result
 *
 * @example
 * ```typescript
 * const validation = validateGASBCompliance(cafr);
 * if (!validation.isCompliant) {
 *   console.log(validation.missingRequirements);
 * }
 * ```
 */
const validateGASBCompliance = (cafr) => {
    const missingRequirements = [];
    // Check for required statements
    if (!cafr.financialSection.basicFinancialStatements.governmentWideStatements.statementOfNetPosition) {
        missingRequirements.push('Statement of Net Position');
    }
    if (!cafr.financialSection.basicFinancialStatements.governmentWideStatements.statementOfActivities) {
        missingRequirements.push('Statement of Activities');
    }
    // Check for required notes
    const requiredNotes = (0, exports.generateRequiredNotes)();
    const noteNumbers = cafr.financialSection.notesToFinancialStatements.map(n => n.noteNumber);
    for (const req of requiredNotes) {
        if (!noteNumbers.includes(req.noteNumber)) {
            missingRequirements.push(`Note ${req.noteNumber}: ${req.title}`);
        }
    }
    // Check for MD&A
    if (!cafr.financialSection.managementDiscussionAnalysis ||
        cafr.financialSection.managementDiscussionAnalysis.length < 100) {
        missingRequirements.push("Management's Discussion and Analysis");
    }
    return {
        isCompliant: missingRequirements.length === 0,
        missingRequirements,
    };
};
exports.validateGASBCompliance = validateGASBCompliance;
// ============================================================================
// AUDIT REPORT PREPARATION
// ============================================================================
/**
 * @function createAuditorsReport
 * @description Creates independent auditors report
 * @param {string} auditFirm - Audit firm name
 * @param {Date} reportDate - Report date
 * @param {AuditOpinionType} opinionType - Opinion type
 * @param {string} opinionText - Opinion text
 * @returns {AuditorsReport} Auditors report
 *
 * @example
 * ```typescript
 * const audit = createAuditorsReport(
 *   'Smith & Associates CPA',
 *   new Date(),
 *   AuditOpinionType.UNMODIFIED,
 *   opinionText
 * );
 * ```
 */
const createAuditorsReport = (auditFirm, reportDate, opinionType, opinionText) => {
    return {
        reportId: crypto.randomUUID(),
        auditFirm,
        reportDate,
        opinionType,
        opinionText,
        emphasis: [],
        otherMatters: [],
    };
};
exports.createAuditorsReport = createAuditorsReport;
/**
 * @function addEmphasisOfMatter
 * @description Adds emphasis of matter paragraph to audit report
 * @param {AuditorsReport} report - Auditors report
 * @param {string} emphasis - Emphasis text
 * @returns {AuditorsReport} Updated report
 *
 * @example
 * ```typescript
 * const updated = addEmphasisOfMatter(report, 'Implementation of GASB 87');
 * ```
 */
const addEmphasisOfMatter = (report, emphasis) => {
    return {
        ...report,
        emphasis: [...(report.emphasis || []), emphasis],
    };
};
exports.addEmphasisOfMatter = addEmphasisOfMatter;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * @function calculatePerCapita
 * @description Calculates per capita amount
 * @param {number} totalAmount - Total amount
 * @param {number} population - Population
 * @returns {number} Per capita amount
 *
 * @example
 * ```typescript
 * const perCapita = calculatePerCapita(10000000, 50000);
 * // Returns 200
 * ```
 */
const calculatePerCapita = (totalAmount, population) => {
    return population > 0 ? totalAmount / population : 0;
};
exports.calculatePerCapita = calculatePerCapita;
/**
 * @function calculateDebtRatio
 * @description Calculates debt to assets ratio
 * @param {number} totalDebt - Total debt
 * @param {number} totalAssets - Total assets
 * @returns {number} Debt ratio percentage
 *
 * @example
 * ```typescript
 * const ratio = calculateDebtRatio(5000000, 20000000);
 * // Returns 25
 * ```
 */
const calculateDebtRatio = (totalDebt, totalAssets) => {
    return totalAssets > 0 ? (totalDebt / totalAssets) * 100 : 0;
};
exports.calculateDebtRatio = calculateDebtRatio;
/**
 * @function formatFinancialAmount
 * @description Formats financial amount for display
 * @param {number} amount - Amount to format
 * @param {boolean} showCents - Show cents (default: false)
 * @returns {string} Formatted amount
 *
 * @example
 * ```typescript
 * const formatted = formatFinancialAmount(1234567.89);
 * // Returns '$1,234,568'
 * ```
 */
const formatFinancialAmount = (amount, showCents = false) => {
    const options = {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: showCents ? 2 : 0,
        maximumFractionDigits: showCents ? 2 : 0,
    };
    return new Intl.NumberFormat('en-US', options).format(amount);
};
exports.formatFinancialAmount = formatFinancialAmount;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // ID Generation
    createReportId: exports.createReportId,
    createFundId: exports.createFundId,
    createAccountId: exports.createAccountId,
    createTransactionId: exports.createTransactionId,
    createDisclosureId: exports.createDisclosureId,
    // Fund Management
    createFund: exports.createFund,
    categorizeFund: exports.categorizeFund,
    // Chart of Accounts
    createAccount: exports.createAccount,
    determineNormalBalance: exports.determineNormalBalance,
    // Transactions
    createTransaction: exports.createTransaction,
    validateJournalEntries: exports.validateJournalEntries,
    reverseTransaction: exports.reverseTransaction,
    // Government-wide Statements
    createStatementOfNetPosition: exports.createStatementOfNetPosition,
    createStatementOfActivities: exports.createStatementOfActivities,
    // Fund Statements
    createFundBalanceSheet: exports.createFundBalanceSheet,
    classifyFundBalance: exports.classifyFundBalance,
    createStatementOfRevenuesExpenditures: exports.createStatementOfRevenuesExpenditures,
    calculateBudgetVariance: exports.calculateBudgetVariance,
    // Reconciliations
    createReconciliation: exports.createReconciliation,
    addReconciliationAdjustment: exports.addReconciliationAdjustment,
    // CAFR
    createCAFR: exports.createCAFR,
    createIntroductorySection: exports.createIntroductorySection,
    createFinancialSection: exports.createFinancialSection,
    // Notes
    createNote: exports.createNote,
    addNoteSubsection: exports.addNoteSubsection,
    generateRequiredNotes: exports.generateRequiredNotes,
    // RSI
    createBudgetComparison: exports.createBudgetComparison,
    createPensionRSI: exports.createPensionRSI,
    // Statistical
    createFinancialTrendTable: exports.createFinancialTrendTable,
    createRevenueCapacityTable: exports.createRevenueCapacityTable,
    createDebtCapacityTable: exports.createDebtCapacityTable,
    // Disclosures
    createFinancialDisclosure: exports.createFinancialDisclosure,
    validateGASBCompliance: exports.validateGASBCompliance,
    // Audit
    createAuditorsReport: exports.createAuditorsReport,
    addEmphasisOfMatter: exports.addEmphasisOfMatter,
    // Utilities
    calculatePerCapita: exports.calculatePerCapita,
    calculateDebtRatio: exports.calculateDebtRatio,
    formatFinancialAmount: exports.formatFinancialAmount,
};
//# sourceMappingURL=government-financial-reporting-kit.js.map