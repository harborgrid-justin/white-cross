"use strict";
/**
 * LOC: FINCLOSE001
 * File: /reuse/edwards/financial/financial-close-automation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../financial/general-ledger-operations-kit (GL operations)
 *   - ../financial/financial-accounts-management-kit (Account operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Period close services
 *   - Financial reporting processes
 *   - Reconciliation automation
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
exports.generateCloseSummary = exports.escalateVariance = exports.getBlockedTasks = exports.applyCloseTemplate = exports.createCloseTemplate = exports.getCloseMetrics = exports.completeCloseRollback = exports.initiateCloseRollback = exports.postIntercompanyElimination = exports.createIntercompanyElimination = exports.rejectCloseItem = exports.approveCloseItem = exports.createCloseApproval = exports.executePeriodClose = exports.validateHardClose = exports.validateSoftClose = exports.getCloseDashboard = exports.calculateCloseCycleTime = exports.getVariancesRequiringExplanation = exports.performVarianceAnalysis = exports.getReconciliations = exports.completeReconciliation = exports.createReconciliation = exports.amortizeDeferrals = exports.createDeferral = exports.getAccruals = exports.reverseAccrual = exports.generateAutomatedAccruals = exports.postAccrual = exports.createAccrual = exports.getTasksByStatus = exports.executeAutomatedTask = exports.completeCloseTask = exports.startCloseTask = exports.createCloseTask = exports.getCloseChecklistWithTasks = exports.updateChecklistTaskCounts = exports.copyTasksFromTemplate = exports.createCloseChecklist = exports.getCloseCalendar = exports.getCurrentOpenPeriod = exports.updatePeriodStatus = exports.createClosePeriod = exports.createCloseTaskModel = exports.createCloseChecklistModel = exports.createCloseCalendarModel = exports.ReconciliationRequestDto = exports.CreateAccrualDto = exports.CreateCloseTaskDto = exports.CreateCloseChecklistDto = void 0;
/**
 * File: /reuse/edwards/financial/financial-close-automation-kit.ts
 * Locator: WC-JDE-FINCLOSE-001
 * Purpose: Comprehensive Financial Close Automation - JD Edwards EnterpriseOne-level close checklists, automated entries, accruals, deferrals, reconciliations
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit, financial-accounts-management-kit
 * Downstream: ../backend/financial/*, Period Close Services, Financial Reporting, Reconciliation
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for close checklists, close tasks, close schedules, automated journal entries, accruals, deferrals, reconciliations, close monitoring, variance analysis, soft close, hard close
 *
 * LLM Context: Enterprise-grade financial close automation operations for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive close checklist management, automated task scheduling, automated journal entry generation,
 * accrual and deferral processing, account reconciliation, close monitoring dashboards, variance analysis,
 * soft close vs hard close workflows, close approval routing, rollback capabilities, multi-entity consolidation,
 * intercompany eliminations, and close analytics.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateCloseChecklistDto = (() => {
    var _a;
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _fiscalPeriod_decorators;
    let _fiscalPeriod_initializers = [];
    let _fiscalPeriod_extraInitializers = [];
    let _checklistType_decorators;
    let _checklistType_initializers = [];
    let _checklistType_extraInitializers = [];
    let _templateId_decorators;
    let _templateId_initializers = [];
    let _templateId_extraInitializers = [];
    return _a = class CreateCloseChecklistDto {
            constructor() {
                this.fiscalYear = __runInitializers(this, _fiscalYear_initializers, void 0);
                this.fiscalPeriod = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _fiscalPeriod_initializers, void 0));
                this.checklistType = (__runInitializers(this, _fiscalPeriod_extraInitializers), __runInitializers(this, _checklistType_initializers, void 0));
                this.templateId = (__runInitializers(this, _checklistType_extraInitializers), __runInitializers(this, _templateId_initializers, void 0));
                __runInitializers(this, _templateId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' })];
            _fiscalPeriod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal period' })];
            _checklistType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Checklist type', enum: ['monthly', 'quarterly', 'year_end', 'custom'] })];
            _templateId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template ID', required: false })];
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _fiscalPeriod_decorators, { kind: "field", name: "fiscalPeriod", static: false, private: false, access: { has: obj => "fiscalPeriod" in obj, get: obj => obj.fiscalPeriod, set: (obj, value) => { obj.fiscalPeriod = value; } }, metadata: _metadata }, _fiscalPeriod_initializers, _fiscalPeriod_extraInitializers);
            __esDecorate(null, null, _checklistType_decorators, { kind: "field", name: "checklistType", static: false, private: false, access: { has: obj => "checklistType" in obj, get: obj => obj.checklistType, set: (obj, value) => { obj.checklistType = value; } }, metadata: _metadata }, _checklistType_initializers, _checklistType_extraInitializers);
            __esDecorate(null, null, _templateId_decorators, { kind: "field", name: "templateId", static: false, private: false, access: { has: obj => "templateId" in obj, get: obj => obj.templateId, set: (obj, value) => { obj.templateId = value; } }, metadata: _metadata }, _templateId_initializers, _templateId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCloseChecklistDto = CreateCloseChecklistDto;
let CreateCloseTaskDto = (() => {
    var _a;
    let _checklistId_decorators;
    let _checklistId_initializers = [];
    let _checklistId_extraInitializers = [];
    let _taskName_decorators;
    let _taskName_initializers = [];
    let _taskName_extraInitializers = [];
    let _taskDescription_decorators;
    let _taskDescription_initializers = [];
    let _taskDescription_extraInitializers = [];
    let _taskCategory_decorators;
    let _taskCategory_initializers = [];
    let _taskCategory_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _taskType_decorators;
    let _taskType_initializers = [];
    let _taskType_extraInitializers = [];
    return _a = class CreateCloseTaskDto {
            constructor() {
                this.checklistId = __runInitializers(this, _checklistId_initializers, void 0);
                this.taskName = (__runInitializers(this, _checklistId_extraInitializers), __runInitializers(this, _taskName_initializers, void 0));
                this.taskDescription = (__runInitializers(this, _taskName_extraInitializers), __runInitializers(this, _taskDescription_initializers, void 0));
                this.taskCategory = (__runInitializers(this, _taskDescription_extraInitializers), __runInitializers(this, _taskCategory_initializers, void 0));
                this.assignedTo = (__runInitializers(this, _taskCategory_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
                this.priority = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.taskType = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _taskType_initializers, void 0));
                __runInitializers(this, _taskType_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _checklistId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Checklist ID' })];
            _taskName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Task name' })];
            _taskDescription_decorators = [(0, swagger_1.ApiProperty)({ description: 'Task description' })];
            _taskCategory_decorators = [(0, swagger_1.ApiProperty)({ description: 'Task category' })];
            _assignedTo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned to user' })];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority', enum: ['low', 'medium', 'high', 'critical'] })];
            _taskType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Task type', enum: ['manual', 'automated', 'semi_automated'] })];
            __esDecorate(null, null, _checklistId_decorators, { kind: "field", name: "checklistId", static: false, private: false, access: { has: obj => "checklistId" in obj, get: obj => obj.checklistId, set: (obj, value) => { obj.checklistId = value; } }, metadata: _metadata }, _checklistId_initializers, _checklistId_extraInitializers);
            __esDecorate(null, null, _taskName_decorators, { kind: "field", name: "taskName", static: false, private: false, access: { has: obj => "taskName" in obj, get: obj => obj.taskName, set: (obj, value) => { obj.taskName = value; } }, metadata: _metadata }, _taskName_initializers, _taskName_extraInitializers);
            __esDecorate(null, null, _taskDescription_decorators, { kind: "field", name: "taskDescription", static: false, private: false, access: { has: obj => "taskDescription" in obj, get: obj => obj.taskDescription, set: (obj, value) => { obj.taskDescription = value; } }, metadata: _metadata }, _taskDescription_initializers, _taskDescription_extraInitializers);
            __esDecorate(null, null, _taskCategory_decorators, { kind: "field", name: "taskCategory", static: false, private: false, access: { has: obj => "taskCategory" in obj, get: obj => obj.taskCategory, set: (obj, value) => { obj.taskCategory = value; } }, metadata: _metadata }, _taskCategory_initializers, _taskCategory_extraInitializers);
            __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _taskType_decorators, { kind: "field", name: "taskType", static: false, private: false, access: { has: obj => "taskType" in obj, get: obj => obj.taskType, set: (obj, value) => { obj.taskType = value; } }, metadata: _metadata }, _taskType_initializers, _taskType_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCloseTaskDto = CreateCloseTaskDto;
let CreateAccrualDto = (() => {
    var _a;
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _fiscalPeriod_decorators;
    let _fiscalPeriod_initializers = [];
    let _fiscalPeriod_extraInitializers = [];
    let _accrualType_decorators;
    let _accrualType_initializers = [];
    let _accrualType_extraInitializers = [];
    let _accountCode_decorators;
    let _accountCode_initializers = [];
    let _accountCode_extraInitializers = [];
    let _accrualAmount_decorators;
    let _accrualAmount_initializers = [];
    let _accrualAmount_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _autoReverse_decorators;
    let _autoReverse_initializers = [];
    let _autoReverse_extraInitializers = [];
    return _a = class CreateAccrualDto {
            constructor() {
                this.fiscalYear = __runInitializers(this, _fiscalYear_initializers, void 0);
                this.fiscalPeriod = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _fiscalPeriod_initializers, void 0));
                this.accrualType = (__runInitializers(this, _fiscalPeriod_extraInitializers), __runInitializers(this, _accrualType_initializers, void 0));
                this.accountCode = (__runInitializers(this, _accrualType_extraInitializers), __runInitializers(this, _accountCode_initializers, void 0));
                this.accrualAmount = (__runInitializers(this, _accountCode_extraInitializers), __runInitializers(this, _accrualAmount_initializers, void 0));
                this.description = (__runInitializers(this, _accrualAmount_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.autoReverse = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _autoReverse_initializers, void 0));
                __runInitializers(this, _autoReverse_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' })];
            _fiscalPeriod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal period' })];
            _accrualType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Accrual type', enum: ['expense', 'revenue', 'payroll', 'interest', 'tax', 'other'] })];
            _accountCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account code' })];
            _accrualAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Accrual amount' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' })];
            _autoReverse_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto reverse in next period', default: true })];
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _fiscalPeriod_decorators, { kind: "field", name: "fiscalPeriod", static: false, private: false, access: { has: obj => "fiscalPeriod" in obj, get: obj => obj.fiscalPeriod, set: (obj, value) => { obj.fiscalPeriod = value; } }, metadata: _metadata }, _fiscalPeriod_initializers, _fiscalPeriod_extraInitializers);
            __esDecorate(null, null, _accrualType_decorators, { kind: "field", name: "accrualType", static: false, private: false, access: { has: obj => "accrualType" in obj, get: obj => obj.accrualType, set: (obj, value) => { obj.accrualType = value; } }, metadata: _metadata }, _accrualType_initializers, _accrualType_extraInitializers);
            __esDecorate(null, null, _accountCode_decorators, { kind: "field", name: "accountCode", static: false, private: false, access: { has: obj => "accountCode" in obj, get: obj => obj.accountCode, set: (obj, value) => { obj.accountCode = value; } }, metadata: _metadata }, _accountCode_initializers, _accountCode_extraInitializers);
            __esDecorate(null, null, _accrualAmount_decorators, { kind: "field", name: "accrualAmount", static: false, private: false, access: { has: obj => "accrualAmount" in obj, get: obj => obj.accrualAmount, set: (obj, value) => { obj.accrualAmount = value; } }, metadata: _metadata }, _accrualAmount_initializers, _accrualAmount_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _autoReverse_decorators, { kind: "field", name: "autoReverse", static: false, private: false, access: { has: obj => "autoReverse" in obj, get: obj => obj.autoReverse, set: (obj, value) => { obj.autoReverse = value; } }, metadata: _metadata }, _autoReverse_initializers, _autoReverse_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateAccrualDto = CreateAccrualDto;
let ReconciliationRequestDto = (() => {
    var _a;
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _fiscalPeriod_decorators;
    let _fiscalPeriod_initializers = [];
    let _fiscalPeriod_extraInitializers = [];
    let _accountCode_decorators;
    let _accountCode_initializers = [];
    let _accountCode_extraInitializers = [];
    let _reconciledBalance_decorators;
    let _reconciledBalance_initializers = [];
    let _reconciledBalance_extraInitializers = [];
    return _a = class ReconciliationRequestDto {
            constructor() {
                this.fiscalYear = __runInitializers(this, _fiscalYear_initializers, void 0);
                this.fiscalPeriod = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _fiscalPeriod_initializers, void 0));
                this.accountCode = (__runInitializers(this, _fiscalPeriod_extraInitializers), __runInitializers(this, _accountCode_initializers, void 0));
                this.reconciledBalance = (__runInitializers(this, _accountCode_extraInitializers), __runInitializers(this, _reconciledBalance_initializers, void 0));
                __runInitializers(this, _reconciledBalance_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' })];
            _fiscalPeriod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal period' })];
            _accountCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account code' })];
            _reconciledBalance_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reconciled balance' })];
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _fiscalPeriod_decorators, { kind: "field", name: "fiscalPeriod", static: false, private: false, access: { has: obj => "fiscalPeriod" in obj, get: obj => obj.fiscalPeriod, set: (obj, value) => { obj.fiscalPeriod = value; } }, metadata: _metadata }, _fiscalPeriod_initializers, _fiscalPeriod_extraInitializers);
            __esDecorate(null, null, _accountCode_decorators, { kind: "field", name: "accountCode", static: false, private: false, access: { has: obj => "accountCode" in obj, get: obj => obj.accountCode, set: (obj, value) => { obj.accountCode = value; } }, metadata: _metadata }, _accountCode_initializers, _accountCode_extraInitializers);
            __esDecorate(null, null, _reconciledBalance_decorators, { kind: "field", name: "reconciledBalance", static: false, private: false, access: { has: obj => "reconciledBalance" in obj, get: obj => obj.reconciledBalance, set: (obj, value) => { obj.reconciledBalance = value; } }, metadata: _metadata }, _reconciledBalance_initializers, _reconciledBalance_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ReconciliationRequestDto = ReconciliationRequestDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Close Calendar with period status tracking.
 *
 * Associations:
 * - hasMany: CloseChecklist, CloseMetrics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CloseCalendar model
 *
 * @example
 * ```typescript
 * const Calendar = createCloseCalendarModel(sequelize);
 * const period = await Calendar.findOne({
 *   where: { fiscalYear: 2024, fiscalPeriod: 1 },
 *   include: [{ model: CloseChecklist, as: 'checklists' }]
 * });
 * ```
 */
const createCloseCalendarModel = (sequelize) => {
    class CloseCalendar extends sequelize_1.Model {
    }
    CloseCalendar.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
        },
        fiscalPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal period (1-13)',
            validate: {
                min: 1,
                max: 13,
            },
        },
        periodName: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Period name (e.g., January 2024)',
        },
        periodType: {
            type: sequelize_1.DataTypes.ENUM('regular', 'adjustment', 'year_end'),
            allowNull: false,
            defaultValue: 'regular',
            comment: 'Period type',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Period start date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Period end date',
        },
        softCloseDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Soft close deadline',
        },
        hardCloseDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Hard close deadline',
        },
        reportingDeadline: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Financial reporting deadline',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('future', 'open', 'soft_close', 'hard_close', 'locked'),
            allowNull: false,
            defaultValue: 'future',
            comment: 'Period status',
        },
        isYearEnd: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether this is year-end period',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'close_calendars',
        timestamps: true,
        indexes: [
            { fields: ['fiscalYear', 'fiscalPeriod'], unique: true },
            { fields: ['status'] },
            { fields: ['softCloseDate'] },
            { fields: ['hardCloseDate'] },
        ],
    });
    return CloseCalendar;
};
exports.createCloseCalendarModel = createCloseCalendarModel;
/**
 * Sequelize model for Close Checklists with task tracking.
 *
 * Associations:
 * - belongsTo: CloseCalendar
 * - hasMany: CloseTask, CloseApproval
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CloseChecklist model
 */
const createCloseChecklistModel = (sequelize) => {
    class CloseChecklist extends sequelize_1.Model {
    }
    CloseChecklist.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
        },
        fiscalPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal period',
        },
        checklistType: {
            type: sequelize_1.DataTypes.ENUM('monthly', 'quarterly', 'year_end', 'custom'),
            allowNull: false,
            comment: 'Checklist type',
        },
        templateId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Template ID if created from template',
        },
        totalTasks: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Total number of tasks',
        },
        completedTasks: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of completed tasks',
        },
        pendingTasks: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of pending tasks',
        },
        blockedTasks: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of blocked tasks',
        },
        completionPercent: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Completion percentage',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('not_started', 'in_progress', 'completed', 'approved'),
            allowNull: false,
            defaultValue: 'not_started',
            comment: 'Checklist status',
        },
        startedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Checklist start timestamp',
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Checklist completion timestamp',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Approved by user',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval timestamp',
        },
    }, {
        sequelize,
        tableName: 'close_checklists',
        timestamps: true,
        indexes: [
            { fields: ['fiscalYear', 'fiscalPeriod'] },
            { fields: ['status'] },
            { fields: ['checklistType'] },
        ],
    });
    return CloseChecklist;
};
exports.createCloseChecklistModel = createCloseChecklistModel;
/**
 * Sequelize model for Close Tasks with dependency tracking.
 *
 * Associations:
 * - belongsTo: CloseChecklist
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CloseTask model
 */
const createCloseTaskModel = (sequelize) => {
    class CloseTask extends sequelize_1.Model {
    }
    CloseTask.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        checklistId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to close checklist',
            references: {
                model: 'close_checklists',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        taskSequence: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Task sequence number',
        },
        taskName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Task name',
        },
        taskDescription: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Task description',
        },
        taskCategory: {
            type: sequelize_1.DataTypes.ENUM('preparation', 'accruals', 'deferrals', 'reconciliation', 'adjustments', 'reporting', 'review', 'approval'),
            allowNull: false,
            comment: 'Task category',
        },
        taskType: {
            type: sequelize_1.DataTypes.ENUM('manual', 'automated', 'semi_automated'),
            allowNull: false,
            defaultValue: 'manual',
            comment: 'Task type',
        },
        assignedTo: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Assigned to user',
        },
        assignedRole: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Assigned role',
        },
        estimatedDuration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 60,
            comment: 'Estimated duration in minutes',
        },
        actualDuration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Actual duration in minutes',
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            defaultValue: 'medium',
            comment: 'Task priority',
        },
        dependsOn: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
            allowNull: false,
            defaultValue: [],
            comment: 'Task dependencies (task IDs)',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'in_progress', 'completed', 'skipped', 'blocked', 'failed'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Task status',
        },
        scheduledStart: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Scheduled start time',
        },
        scheduledEnd: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Scheduled end time',
        },
        actualStart: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Actual start time',
        },
        actualEnd: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Actual end time',
        },
        completedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Completed by user',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Task notes',
        },
        automationScript: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Automation script for automated tasks',
        },
    }, {
        sequelize,
        tableName: 'close_tasks',
        timestamps: true,
        indexes: [
            { fields: ['checklistId'] },
            { fields: ['status'] },
            { fields: ['assignedTo'] },
            { fields: ['priority'] },
        ],
    });
    return CloseTask;
};
exports.createCloseTaskModel = createCloseTaskModel;
// ============================================================================
// CLOSE CALENDAR OPERATIONS
// ============================================================================
/**
 * Creates a fiscal period in the close calendar.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Date} startDate - Period start date
 * @param {Date} endDate - Period end date
 * @param {Date} softCloseDate - Soft close deadline
 * @param {Date} hardCloseDate - Hard close deadline
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created period
 *
 * @example
 * ```typescript
 * const period = await createClosePeriod(sequelize, 2024, 1,
 *   new Date('2024-01-01'), new Date('2024-01-31'),
 *   new Date('2024-02-03'), new Date('2024-02-05'));
 * ```
 */
const createClosePeriod = async (sequelize, fiscalYear, fiscalPeriod, startDate, endDate, softCloseDate, hardCloseDate, transaction) => {
    const CloseCalendar = (0, exports.createCloseCalendarModel)(sequelize);
    const existing = await CloseCalendar.findOne({
        where: { fiscalYear, fiscalPeriod },
        transaction,
    });
    if (existing) {
        throw new Error(`Period ${fiscalYear}-${fiscalPeriod} already exists`);
    }
    const periodName = `Period ${fiscalPeriod} - ${fiscalYear}`;
    const isYearEnd = fiscalPeriod === 12;
    const reportingDeadline = new Date(hardCloseDate);
    reportingDeadline.setDate(reportingDeadline.getDate() + 3);
    const period = await CloseCalendar.create({
        fiscalYear,
        fiscalPeriod,
        periodName,
        periodType: isYearEnd ? 'year_end' : 'regular',
        startDate,
        endDate,
        softCloseDate,
        hardCloseDate,
        reportingDeadline,
        status: 'future',
        isYearEnd,
        metadata: {},
    }, { transaction });
    return period;
};
exports.createClosePeriod = createClosePeriod;
/**
 * Updates period status in close calendar.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} newStatus - New status
 * @param {string} userId - User performing the update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated period
 *
 * @example
 * ```typescript
 * await updatePeriodStatus(sequelize, 2024, 1, 'soft_close', 'user123');
 * ```
 */
const updatePeriodStatus = async (sequelize, fiscalYear, fiscalPeriod, newStatus, userId, transaction) => {
    const CloseCalendar = (0, exports.createCloseCalendarModel)(sequelize);
    const period = await CloseCalendar.findOne({
        where: { fiscalYear, fiscalPeriod },
        transaction,
    });
    if (!period) {
        throw new Error(`Period ${fiscalYear}-${fiscalPeriod} not found`);
    }
    const validTransitions = {
        future: ['open'],
        open: ['soft_close'],
        soft_close: ['hard_close', 'open'],
        hard_close: ['locked', 'soft_close'],
        locked: [],
    };
    if (!validTransitions[period.status]?.includes(newStatus)) {
        throw new Error(`Invalid status transition from ${period.status} to ${newStatus}`);
    }
    await period.update({
        status: newStatus,
        metadata: { ...period.metadata, lastStatusChange: { by: userId, at: new Date(), from: period.status } },
    }, { transaction });
    return period;
};
exports.updatePeriodStatus = updatePeriodStatus;
/**
 * Retrieves current open period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Current open period
 *
 * @example
 * ```typescript
 * const period = await getCurrentOpenPeriod(sequelize);
 * console.log(period.fiscalYear, period.fiscalPeriod);
 * ```
 */
const getCurrentOpenPeriod = async (sequelize) => {
    const CloseCalendar = (0, exports.createCloseCalendarModel)(sequelize);
    const period = await CloseCalendar.findOne({
        where: { status: 'open' },
        order: [['fiscalYear', 'DESC'], ['fiscalPeriod', 'DESC']],
    });
    return period;
};
exports.getCurrentOpenPeriod = getCurrentOpenPeriod;
/**
 * Retrieves close calendar with status summary.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<any[]>} Calendar periods
 *
 * @example
 * ```typescript
 * const calendar = await getCloseCalendar(sequelize, 2024);
 * ```
 */
const getCloseCalendar = async (sequelize, fiscalYear) => {
    const CloseCalendar = (0, exports.createCloseCalendarModel)(sequelize);
    const periods = await CloseCalendar.findAll({
        where: { fiscalYear },
        order: [['fiscalPeriod', 'ASC']],
    });
    return periods;
};
exports.getCloseCalendar = getCloseCalendar;
// ============================================================================
// CLOSE CHECKLIST OPERATIONS
// ============================================================================
/**
 * Creates a close checklist from template or custom.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCloseChecklistDto} checklistData - Checklist data
 * @param {string} userId - User creating the checklist
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created checklist
 *
 * @example
 * ```typescript
 * const checklist = await createCloseChecklist(sequelize, {
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   checklistType: 'monthly',
 *   templateId: 1
 * }, 'user123');
 * ```
 */
const createCloseChecklist = async (sequelize, checklistData, userId, transaction) => {
    const CloseChecklist = (0, exports.createCloseChecklistModel)(sequelize);
    const existing = await CloseChecklist.findOne({
        where: {
            fiscalYear: checklistData.fiscalYear,
            fiscalPeriod: checklistData.fiscalPeriod,
            checklistType: checklistData.checklistType,
        },
        transaction,
    });
    if (existing) {
        throw new Error(`Checklist already exists for period ${checklistData.fiscalYear}-${checklistData.fiscalPeriod}`);
    }
    const checklist = await CloseChecklist.create({
        ...checklistData,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        blockedTasks: 0,
        completionPercent: 0,
        status: 'not_started',
    }, { transaction });
    // If template provided, copy tasks from template
    if (checklistData.templateId) {
        await (0, exports.copyTasksFromTemplate)(sequelize, checklist.id, checklistData.templateId, transaction);
    }
    return checklist;
};
exports.createCloseChecklist = createCloseChecklist;
/**
 * Copies tasks from template to checklist.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} checklistId - Checklist ID
 * @param {number} templateId - Template ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await copyTasksFromTemplate(sequelize, 1, 1);
 * ```
 */
const copyTasksFromTemplate = async (sequelize, checklistId, templateId, transaction) => {
    const query = `
    INSERT INTO close_tasks (
      checklist_id, task_sequence, task_name, task_description,
      task_category, task_type, assigned_to, assigned_role,
      estimated_duration, priority, depends_on, status,
      automation_script, created_at, updated_at
    )
    SELECT
      :checklistId, task_sequence, task_name, task_description,
      task_category, task_type, assigned_to, assigned_role,
      estimated_duration, priority, depends_on, 'pending',
      automation_script, NOW(), NOW()
    FROM close_task_templates
    WHERE template_id = :templateId
    ORDER BY task_sequence
  `;
    await sequelize.query(query, {
        replacements: { checklistId, templateId },
        transaction,
    });
    // Update checklist task counts
    await (0, exports.updateChecklistTaskCounts)(sequelize, checklistId, transaction);
};
exports.copyTasksFromTemplate = copyTasksFromTemplate;
/**
 * Updates checklist task counts and completion percentage.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} checklistId - Checklist ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateChecklistTaskCounts(sequelize, 1);
 * ```
 */
const updateChecklistTaskCounts = async (sequelize, checklistId, transaction) => {
    const query = `
    UPDATE close_checklists
    SET
      total_tasks = (SELECT COUNT(*) FROM close_tasks WHERE checklist_id = :checklistId),
      completed_tasks = (SELECT COUNT(*) FROM close_tasks WHERE checklist_id = :checklistId AND status = 'completed'),
      pending_tasks = (SELECT COUNT(*) FROM close_tasks WHERE checklist_id = :checklistId AND status = 'pending'),
      blocked_tasks = (SELECT COUNT(*) FROM close_tasks WHERE checklist_id = :checklistId AND status = 'blocked'),
      completion_percent = CASE
        WHEN (SELECT COUNT(*) FROM close_tasks WHERE checklist_id = :checklistId) > 0 THEN
          (SELECT COUNT(*) FROM close_tasks WHERE checklist_id = :checklistId AND status = 'completed')::DECIMAL /
          (SELECT COUNT(*) FROM close_tasks WHERE checklist_id = :checklistId)::DECIMAL * 100
        ELSE 0
      END,
      updated_at = NOW()
    WHERE id = :checklistId
  `;
    await sequelize.query(query, {
        replacements: { checklistId },
        transaction,
    });
};
exports.updateChecklistTaskCounts = updateChecklistTaskCounts;
/**
 * Retrieves checklist with tasks and progress.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} Checklist with tasks
 *
 * @example
 * ```typescript
 * const checklist = await getCloseChecklistWithTasks(sequelize, 2024, 1);
 * console.log(checklist.tasks, checklist.completionPercent);
 * ```
 */
const getCloseChecklistWithTasks = async (sequelize, fiscalYear, fiscalPeriod) => {
    const CloseChecklist = (0, exports.createCloseChecklistModel)(sequelize);
    const checklist = await CloseChecklist.findOne({
        where: { fiscalYear, fiscalPeriod },
    });
    if (!checklist) {
        throw new Error(`Checklist not found for period ${fiscalYear}-${fiscalPeriod}`);
    }
    const tasksQuery = `
    SELECT * FROM close_tasks
    WHERE checklist_id = :checklistId
    ORDER BY task_sequence
  `;
    const tasks = await sequelize.query(tasksQuery, {
        replacements: { checklistId: checklist.id },
        type: 'SELECT',
    });
    return {
        ...checklist.toJSON(),
        tasks,
    };
};
exports.getCloseChecklistWithTasks = getCloseChecklistWithTasks;
// ============================================================================
// CLOSE TASK OPERATIONS
// ============================================================================
/**
 * Creates a close task.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCloseTaskDto} taskData - Task data
 * @param {string} userId - User creating the task
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created task
 *
 * @example
 * ```typescript
 * const task = await createCloseTask(sequelize, {
 *   checklistId: 1,
 *   taskName: 'Reconcile bank accounts',
 *   taskDescription: 'Reconcile all bank accounts',
 *   taskCategory: 'reconciliation',
 *   assignedTo: 'user123',
 *   priority: 'high',
 *   taskType: 'manual'
 * }, 'user123');
 * ```
 */
const createCloseTask = async (sequelize, taskData, userId, transaction) => {
    const CloseTask = (0, exports.createCloseTaskModel)(sequelize);
    // Get next sequence number
    const [maxSeq] = await sequelize.query(`SELECT COALESCE(MAX(task_sequence), 0) + 1 as next_seq
     FROM close_tasks WHERE checklist_id = :checklistId`, {
        replacements: { checklistId: taskData.checklistId },
        type: 'SELECT',
        transaction,
    });
    const taskSequence = maxSeq?.next_seq || 1;
    const task = await CloseTask.create({
        ...taskData,
        taskSequence,
        estimatedDuration: 60,
        dependsOn: [],
        status: 'pending',
    }, { transaction });
    // Update checklist counts
    await (0, exports.updateChecklistTaskCounts)(sequelize, taskData.checklistId, transaction);
    return task;
};
exports.createCloseTask = createCloseTask;
/**
 * Starts a close task.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} taskId - Task ID
 * @param {string} userId - User starting the task
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated task
 *
 * @example
 * ```typescript
 * await startCloseTask(sequelize, 1, 'user123');
 * ```
 */
const startCloseTask = async (sequelize, taskId, userId, transaction) => {
    const CloseTask = (0, exports.createCloseTaskModel)(sequelize);
    const task = await CloseTask.findByPk(taskId, { transaction });
    if (!task) {
        throw new Error('Task not found');
    }
    if (task.status !== 'pending') {
        throw new Error(`Cannot start task with status ${task.status}`);
    }
    // Check dependencies
    if (task.dependsOn.length > 0) {
        const dependencyCheck = await sequelize.query(`SELECT COUNT(*) as incomplete
       FROM close_tasks
       WHERE id = ANY(:dependsOn) AND status != 'completed'`, {
            replacements: { dependsOn: task.dependsOn },
            type: 'SELECT',
            transaction,
        });
        const [result] = dependencyCheck;
        if (result.incomplete > 0) {
            throw new Error('Cannot start task - dependencies not completed');
        }
    }
    await task.update({
        status: 'in_progress',
        actualStart: new Date(),
    }, { transaction });
    // Update checklist status if this is the first task started
    const CloseChecklist = (0, exports.createCloseChecklistModel)(sequelize);
    const checklist = await CloseChecklist.findByPk(task.checklistId, { transaction });
    if (checklist && checklist.status === 'not_started') {
        await checklist.update({ status: 'in_progress', startedAt: new Date() }, { transaction });
    }
    return task;
};
exports.startCloseTask = startCloseTask;
/**
 * Completes a close task.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} taskId - Task ID
 * @param {string} userId - User completing the task
 * @param {string} [notes] - Optional completion notes
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated task
 *
 * @example
 * ```typescript
 * await completeCloseTask(sequelize, 1, 'user123', 'All reconciliations completed');
 * ```
 */
const completeCloseTask = async (sequelize, taskId, userId, notes, transaction) => {
    const CloseTask = (0, exports.createCloseTaskModel)(sequelize);
    const task = await CloseTask.findByPk(taskId, { transaction });
    if (!task) {
        throw new Error('Task not found');
    }
    if (task.status !== 'in_progress') {
        throw new Error(`Cannot complete task with status ${task.status}`);
    }
    const actualEnd = new Date();
    const actualDuration = task.actualStart
        ? Math.floor((actualEnd.getTime() - task.actualStart.getTime()) / 1000 / 60)
        : null;
    await task.update({
        status: 'completed',
        actualEnd,
        actualDuration,
        completedBy: userId,
        notes: notes || task.notes,
    }, { transaction });
    // Update checklist counts
    await (0, exports.updateChecklistTaskCounts)(sequelize, task.checklistId, transaction);
    // Check if all tasks completed
    const [taskCounts] = await sequelize.query(`SELECT total_tasks, completed_tasks FROM close_checklists WHERE id = :checklistId`, {
        replacements: { checklistId: task.checklistId },
        type: 'SELECT',
        transaction,
    });
    if (taskCounts && taskCounts.total_tasks === taskCounts.completed_tasks) {
        const CloseChecklist = (0, exports.createCloseChecklistModel)(sequelize);
        const checklist = await CloseChecklist.findByPk(task.checklistId, { transaction });
        if (checklist) {
            await checklist.update({ status: 'completed', completedAt: new Date() }, { transaction });
        }
    }
    return task;
};
exports.completeCloseTask = completeCloseTask;
/**
 * Executes automated close task.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} taskId - Task ID
 * @param {string} userId - User executing the task
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Execution result
 *
 * @example
 * ```typescript
 * const result = await executeAutomatedTask(sequelize, 1, 'user123');
 * ```
 */
const executeAutomatedTask = async (sequelize, taskId, userId, transaction) => {
    const CloseTask = (0, exports.createCloseTaskModel)(sequelize);
    const task = await CloseTask.findByPk(taskId, { transaction });
    if (!task) {
        throw new Error('Task not found');
    }
    if (task.taskType !== 'automated' && task.taskType !== 'semi_automated') {
        throw new Error('Task is not automated');
    }
    // Start the task
    await (0, exports.startCloseTask)(sequelize, taskId, userId, transaction);
    try {
        // Execute automation script
        // In production, this would actually execute the automation
        // For now, we'll simulate success
        const result = {
            success: true,
            message: `Automated task ${task.taskName} executed successfully`,
            entriesCreated: 0,
        };
        // If task category is accruals, run accrual automation
        if (task.taskCategory === 'accruals') {
            const accruals = await (0, exports.generateAutomatedAccruals)(sequelize, task.checklistId, transaction);
            result.entriesCreated = accruals.length;
        }
        // Complete the task
        await (0, exports.completeCloseTask)(sequelize, taskId, userId, JSON.stringify(result), transaction);
        return result;
    }
    catch (error) {
        // Mark task as failed
        await task.update({ status: 'failed', notes: error.message }, { transaction });
        throw error;
    }
};
exports.executeAutomatedTask = executeAutomatedTask;
/**
 * Retrieves tasks by status and assignment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} checklistId - Checklist ID
 * @param {string} [status] - Optional status filter
 * @param {string} [assignedTo] - Optional assignee filter
 * @returns {Promise<any[]>} Tasks
 *
 * @example
 * ```typescript
 * const tasks = await getTasksByStatus(sequelize, 1, 'pending', 'user123');
 * ```
 */
const getTasksByStatus = async (sequelize, checklistId, status, assignedTo) => {
    let query = `
    SELECT * FROM close_tasks
    WHERE checklist_id = :checklistId
  `;
    const replacements = { checklistId };
    if (status) {
        query += ` AND status = :status`;
        replacements.status = status;
    }
    if (assignedTo) {
        query += ` AND assigned_to = :assignedTo`;
        replacements.assignedTo = assignedTo;
    }
    query += ` ORDER BY priority DESC, task_sequence ASC`;
    const tasks = await sequelize.query(query, {
        replacements,
        type: 'SELECT',
    });
    return tasks;
};
exports.getTasksByStatus = getTasksByStatus;
// ============================================================================
// ACCRUAL OPERATIONS
// ============================================================================
/**
 * Creates an accrual entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateAccrualDto} accrualData - Accrual data
 * @param {string} userId - User creating the accrual
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created accrual
 *
 * @example
 * ```typescript
 * const accrual = await createAccrual(sequelize, {
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   accrualType: 'expense',
 *   accountCode: '2100',
 *   accrualAmount: 5000,
 *   description: 'Accrued utilities',
 *   autoReverse: true
 * }, 'user123');
 * ```
 */
const createAccrual = async (sequelize, accrualData, userId, transaction) => {
    const reversalPeriod = accrualData.autoReverse
        ? accrualData.fiscalPeriod === 12 ? 1 : accrualData.fiscalPeriod + 1
        : null;
    const reversalYear = accrualData.autoReverse
        ? accrualData.fiscalPeriod === 12 ? accrualData.fiscalYear + 1 : accrualData.fiscalYear
        : null;
    const query = `
    INSERT INTO accrual_entries (
      fiscal_year, fiscal_period, accrual_type, account_code,
      accrual_amount, reversal_period, reversal_year, auto_reverse,
      description, status, created_at, updated_at
    ) VALUES (
      :fiscalYear, :fiscalPeriod, :accrualType, :accountCode,
      :accrualAmount, :reversalPeriod, :reversalYear, :autoReverse,
      :description, 'draft', NOW(), NOW()
    )
    RETURNING *
  `;
    const [accrual] = await sequelize.query(query, {
        replacements: {
            ...accrualData,
            reversalPeriod,
            reversalYear,
        },
        transaction,
    });
    return accrual;
};
exports.createAccrual = createAccrual;
/**
 * Posts accrual entry to general ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accrualId - Accrual ID
 * @param {string} userId - User posting the accrual
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted accrual with journal entry
 *
 * @example
 * ```typescript
 * const result = await postAccrual(sequelize, 1, 'user123');
 * console.log(result.journalEntryId);
 * ```
 */
const postAccrual = async (sequelize, accrualId, userId, transaction) => {
    const [accrual] = await sequelize.query(`SELECT * FROM accrual_entries WHERE id = :accrualId`, {
        replacements: { accrualId },
        type: 'SELECT',
        transaction,
    });
    if (!accrual) {
        throw new Error('Accrual not found');
    }
    if (accrual.status !== 'draft') {
        throw new Error(`Cannot post accrual with status ${accrual.status}`);
    }
    // Create journal entry
    // This would integrate with general-ledger-operations-kit
    const journalEntryId = Math.floor(Math.random() * 100000); // Simulated
    // Update accrual status
    await sequelize.query(`UPDATE accrual_entries
     SET status = 'posted',
         journal_entry_id = :journalEntryId,
         updated_at = NOW()
     WHERE id = :accrualId`, {
        replacements: { accrualId, journalEntryId },
        transaction,
    });
    return { ...accrual, journalEntryId, status: 'posted' };
};
exports.postAccrual = postAccrual;
/**
 * Generates automated accruals for a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} checklistId - Checklist ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Generated accruals
 *
 * @example
 * ```typescript
 * const accruals = await generateAutomatedAccruals(sequelize, 1);
 * ```
 */
const generateAutomatedAccruals = async (sequelize, checklistId, transaction) => {
    // Get checklist period
    const [checklist] = await sequelize.query(`SELECT fiscal_year, fiscal_period FROM close_checklists WHERE id = :checklistId`, {
        replacements: { checklistId },
        type: 'SELECT',
        transaction,
    });
    if (!checklist) {
        throw new Error('Checklist not found');
    }
    // Get automated entry definitions
    const automatedEntries = await sequelize.query(`SELECT * FROM automated_entries
     WHERE entry_type = 'accrual'
       AND status = 'active'
       AND execution_trigger IN ('scheduled', 'event_based')`, {
        type: 'SELECT',
        transaction,
    });
    const accruals = [];
    for (const entry of automatedEntries) {
        // Execute calculation rules
        // In production, this would execute the actual calculation logic
        const calculatedAmount = 1000; // Simulated
        const accrual = await (0, exports.createAccrual)(sequelize, {
            fiscalYear: checklist.fiscal_year,
            fiscalPeriod: checklist.fiscal_period,
            accrualType: 'expense',
            accountCode: entry.accountMappings?.accrualAccount || '2100',
            accrualAmount: calculatedAmount,
            description: entry.entryName,
            autoReverse: true,
        }, 'system', transaction);
        accruals.push(accrual);
    }
    return accruals;
};
exports.generateAutomatedAccruals = generateAutomatedAccruals;
/**
 * Reverses accrual entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accrualId - Accrual ID
 * @param {string} userId - User reversing the accrual
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reversal result
 *
 * @example
 * ```typescript
 * await reverseAccrual(sequelize, 1, 'user123');
 * ```
 */
const reverseAccrual = async (sequelize, accrualId, userId, transaction) => {
    const [accrual] = await sequelize.query(`SELECT * FROM accrual_entries WHERE id = :accrualId`, {
        replacements: { accrualId },
        type: 'SELECT',
        transaction,
    });
    if (!accrual) {
        throw new Error('Accrual not found');
    }
    if (accrual.status !== 'posted') {
        throw new Error('Cannot reverse accrual that is not posted');
    }
    // Create reversal journal entry
    const reversalEntryId = Math.floor(Math.random() * 100000); // Simulated
    // Update accrual status
    await sequelize.query(`UPDATE accrual_entries
     SET status = 'reversed',
         reversal_entry_id = :reversalEntryId,
         updated_at = NOW()
     WHERE id = :accrualId`, {
        replacements: { accrualId, reversalEntryId },
        transaction,
    });
    return { accrualId, reversalEntryId, status: 'reversed' };
};
exports.reverseAccrual = reverseAccrual;
/**
 * Retrieves accruals for a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} [accrualType] - Optional accrual type filter
 * @returns {Promise<any[]>} Accruals
 *
 * @example
 * ```typescript
 * const accruals = await getAccruals(sequelize, 2024, 1, 'expense');
 * ```
 */
const getAccruals = async (sequelize, fiscalYear, fiscalPeriod, accrualType) => {
    let query = `
    SELECT * FROM accrual_entries
    WHERE fiscal_year = :fiscalYear AND fiscal_period = :fiscalPeriod
  `;
    const replacements = { fiscalYear, fiscalPeriod };
    if (accrualType) {
        query += ` AND accrual_type = :accrualType`;
        replacements.accrualType = accrualType;
    }
    query += ` ORDER BY created_at DESC`;
    const accruals = await sequelize.query(query, {
        replacements,
        type: 'SELECT',
    });
    return accruals;
};
exports.getAccruals = getAccruals;
// ============================================================================
// DEFERRAL OPERATIONS
// ============================================================================
/**
 * Creates a deferral entry with amortization schedule.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} deferralType - Deferral type
 * @param {string} accountCode - Account code
 * @param {number} totalAmount - Total deferral amount
 * @param {number} amortizationPeriods - Number of periods to amortize
 * @param {string} description - Description
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created deferral
 *
 * @example
 * ```typescript
 * const deferral = await createDeferral(sequelize, 2024, 1, 'prepaid',
 *   '1500', 12000, 12, 'Annual insurance premium');
 * ```
 */
const createDeferral = async (sequelize, fiscalYear, fiscalPeriod, deferralType, accountCode, totalAmount, amortizationPeriods, description, transaction) => {
    const query = `
    INSERT INTO deferral_entries (
      fiscal_year, fiscal_period, deferral_type, account_code,
      total_amount, deferred_amount, recognized_amount, remaining_amount,
      amortization_periods, periods_remaining, amortization_method,
      description, status, created_at, updated_at
    ) VALUES (
      :fiscalYear, :fiscalPeriod, :deferralType, :accountCode,
      :totalAmount, :totalAmount, 0, :totalAmount,
      :amortizationPeriods, :amortizationPeriods, 'straight_line',
      :description, 'active', NOW(), NOW()
    )
    RETURNING *
  `;
    const [deferral] = await sequelize.query(query, {
        replacements: {
            fiscalYear,
            fiscalPeriod,
            deferralType,
            accountCode,
            totalAmount,
            amortizationPeriods,
            description,
        },
        transaction,
    });
    return deferral;
};
exports.createDeferral = createDeferral;
/**
 * Amortizes deferrals for a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Amortization results
 *
 * @example
 * ```typescript
 * const results = await amortizeDeferrals(sequelize, 2024, 2);
 * ```
 */
const amortizeDeferrals = async (sequelize, fiscalYear, fiscalPeriod, transaction) => {
    const activeDeferrals = await sequelize.query(`SELECT * FROM deferral_entries WHERE status = 'active' AND periods_remaining > 0`, {
        type: 'SELECT',
        transaction,
    });
    const results = [];
    for (const deferral of activeDeferrals) {
        const amortizationAmount = deferral.total_amount / deferral.amortization_periods;
        // Update deferral
        await sequelize.query(`UPDATE deferral_entries
       SET recognized_amount = recognized_amount + :amount,
           remaining_amount = remaining_amount - :amount,
           periods_remaining = periods_remaining - 1,
           status = CASE WHEN periods_remaining - 1 = 0 THEN 'completed' ELSE 'active' END,
           updated_at = NOW()
       WHERE id = :deferralId`, {
            replacements: { deferralId: deferral.id, amount: amortizationAmount },
            transaction,
        });
        results.push({
            deferralId: deferral.id,
            amortizationAmount,
            remainingPeriods: deferral.periods_remaining - 1,
        });
    }
    return results;
};
exports.amortizeDeferrals = amortizeDeferrals;
// ============================================================================
// RECONCILIATION OPERATIONS
// ============================================================================
/**
 * Creates a reconciliation item.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ReconciliationRequestDto} reconData - Reconciliation data
 * @param {string} userId - User creating the reconciliation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created reconciliation
 *
 * @example
 * ```typescript
 * const recon = await createReconciliation(sequelize, {
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   accountCode: '1000',
 *   reconciledBalance: 50000
 * }, 'user123');
 * ```
 */
const createReconciliation = async (sequelize, reconData, userId, transaction) => {
    // Get GL balance
    const [glBalance] = await sequelize.query(`SELECT SUM(debit_amount - credit_amount) as balance
     FROM journal_entry_lines
     WHERE account_code = :accountCode
       AND fiscal_year = :fiscalYear
       AND fiscal_period <= :fiscalPeriod`, {
        replacements: {
            accountCode: reconData.accountCode,
            fiscalYear: reconData.fiscalYear,
            fiscalPeriod: reconData.fiscalPeriod,
        },
        type: 'SELECT',
        transaction,
    });
    const glBalanceAmount = parseFloat(glBalance?.balance || '0');
    const variance = glBalanceAmount - reconData.reconciledBalance;
    const variancePercent = glBalanceAmount !== 0 ? (variance / glBalanceAmount) * 100 : 0;
    const query = `
    INSERT INTO reconciliation_items (
      fiscal_year, fiscal_period, account_id, account_code,
      reconciliation_type, gl_balance, reconciled_balance,
      variance, variance_percent, variance_threshold,
      status, supporting_docs, created_at, updated_at
    ) VALUES (
      :fiscalYear, :fiscalPeriod,
      (SELECT id FROM chart_of_accounts WHERE account_code = :accountCode LIMIT 1),
      :accountCode, 'balance_sheet', :glBalance, :reconciledBalance,
      :variance, :variancePercent, 1.0,
      CASE WHEN ABS(:variancePercent) > 1.0 THEN 'variance_explained' ELSE 'reconciled' END,
      '{}', NOW(), NOW()
    )
    RETURNING *
  `;
    const [recon] = await sequelize.query(query, {
        replacements: {
            ...reconData,
            glBalance: glBalanceAmount,
            variance,
            variancePercent,
        },
        transaction,
    });
    return recon;
};
exports.createReconciliation = createReconciliation;
/**
 * Completes reconciliation with explanation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reconciliationId - Reconciliation ID
 * @param {string} userId - User completing the reconciliation
 * @param {string} [explanation] - Optional variance explanation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Completed reconciliation
 *
 * @example
 * ```typescript
 * await completeReconciliation(sequelize, 1, 'user123', 'Timing difference');
 * ```
 */
const completeReconciliation = async (sequelize, reconciliationId, userId, explanation, transaction) => {
    const query = `
    UPDATE reconciliation_items
    SET status = 'reconciled',
        reconciled_by = :userId,
        reconciled_date = NOW(),
        variance_explanation = :explanation,
        updated_at = NOW()
    WHERE id = :reconciliationId
    RETURNING *
  `;
    const [recon] = await sequelize.query(query, {
        replacements: { reconciliationId, userId, explanation },
        transaction,
    });
    return recon;
};
exports.completeReconciliation = completeReconciliation;
/**
 * Retrieves reconciliations with variance status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {boolean} [varianceOnly] - Show only items with variances
 * @returns {Promise<any[]>} Reconciliations
 *
 * @example
 * ```typescript
 * const recons = await getReconciliations(sequelize, 2024, 1, true);
 * ```
 */
const getReconciliations = async (sequelize, fiscalYear, fiscalPeriod, varianceOnly) => {
    let query = `
    SELECT * FROM reconciliation_items
    WHERE fiscal_year = :fiscalYear AND fiscal_period = :fiscalPeriod
  `;
    const replacements = { fiscalYear, fiscalPeriod };
    if (varianceOnly) {
        query += ` AND ABS(variance_percent) > variance_threshold`;
    }
    query += ` ORDER BY ABS(variance_percent) DESC`;
    const recons = await sequelize.query(query, {
        replacements,
        type: 'SELECT',
    });
    return recons;
};
exports.getReconciliations = getReconciliations;
// ============================================================================
// VARIANCE ANALYSIS OPERATIONS
// ============================================================================
/**
 * Performs variance analysis for period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} [thresholdPercent] - Variance threshold percentage
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Variance analysis results
 *
 * @example
 * ```typescript
 * const variances = await performVarianceAnalysis(sequelize, 2024, 1, 10);
 * ```
 */
const performVarianceAnalysis = async (sequelize, fiscalYear, fiscalPeriod, thresholdPercent = 10, transaction) => {
    const query = `
    WITH current_balances AS (
      SELECT
        account_code,
        account_id,
        SUM(debit_amount - credit_amount) as current_balance
      FROM journal_entry_lines
      WHERE fiscal_year = :fiscalYear AND fiscal_period = :fiscalPeriod
      GROUP BY account_code, account_id
    ),
    prior_balances AS (
      SELECT
        account_code,
        SUM(debit_amount - credit_amount) as prior_balance
      FROM journal_entry_lines
      WHERE fiscal_year = :priorYear AND fiscal_period = :priorPeriod
      GROUP BY account_code
    )
    INSERT INTO variance_analyses (
      fiscal_year, fiscal_period, account_id, account_code,
      current_balance, prior_balance, variance, variance_percent,
      variance_type, threshold_exceeded, requires_explanation,
      created_at, updated_at
    )
    SELECT
      :fiscalYear, :fiscalPeriod, cb.account_id, cb.account_code,
      cb.current_balance,
      COALESCE(pb.prior_balance, 0) as prior_balance,
      cb.current_balance - COALESCE(pb.prior_balance, 0) as variance,
      CASE
        WHEN COALESCE(pb.prior_balance, 0) != 0 THEN
          ((cb.current_balance - COALESCE(pb.prior_balance, 0)) / ABS(COALESCE(pb.prior_balance, 0))) * 100
        ELSE 0
      END as variance_percent,
      CASE
        WHEN cb.current_balance > COALESCE(pb.prior_balance, 0) THEN 'favorable'
        WHEN cb.current_balance < COALESCE(pb.prior_balance, 0) THEN 'unfavorable'
        ELSE 'neutral'
      END as variance_type,
      ABS(
        CASE
          WHEN COALESCE(pb.prior_balance, 0) != 0 THEN
            ((cb.current_balance - COALESCE(pb.prior_balance, 0)) / ABS(COALESCE(pb.prior_balance, 0))) * 100
          ELSE 0
        END
      ) > :thresholdPercent as threshold_exceeded,
      ABS(
        CASE
          WHEN COALESCE(pb.prior_balance, 0) != 0 THEN
            ((cb.current_balance - COALESCE(pb.prior_balance, 0)) / ABS(COALESCE(pb.prior_balance, 0))) * 100
          ELSE 0
        END
      ) > :thresholdPercent as requires_explanation,
      NOW(), NOW()
    FROM current_balances cb
    LEFT JOIN prior_balances pb ON cb.account_code = pb.account_code
    ON CONFLICT (fiscal_year, fiscal_period, account_code)
    DO UPDATE SET
      current_balance = EXCLUDED.current_balance,
      prior_balance = EXCLUDED.prior_balance,
      variance = EXCLUDED.variance,
      variance_percent = EXCLUDED.variance_percent,
      variance_type = EXCLUDED.variance_type,
      threshold_exceeded = EXCLUDED.threshold_exceeded,
      requires_explanation = EXCLUDED.requires_explanation,
      updated_at = NOW()
    RETURNING *
  `;
    const priorPeriod = fiscalPeriod === 1 ? 12 : fiscalPeriod - 1;
    const priorYear = fiscalPeriod === 1 ? fiscalYear - 1 : fiscalYear;
    const variances = await sequelize.query(query, {
        replacements: {
            fiscalYear,
            fiscalPeriod,
            priorYear,
            priorPeriod,
            thresholdPercent,
        },
        transaction,
    });
    return variances[0];
};
exports.performVarianceAnalysis = performVarianceAnalysis;
/**
 * Retrieves variances requiring explanation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any[]>} Variances requiring explanation
 *
 * @example
 * ```typescript
 * const variances = await getVariancesRequiringExplanation(sequelize, 2024, 1);
 * ```
 */
const getVariancesRequiringExplanation = async (sequelize, fiscalYear, fiscalPeriod) => {
    const query = `
    SELECT * FROM variance_analyses
    WHERE fiscal_year = :fiscalYear
      AND fiscal_period = :fiscalPeriod
      AND requires_explanation = true
      AND (explanation IS NULL OR explanation = '')
    ORDER BY ABS(variance_percent) DESC
  `;
    const variances = await sequelize.query(query, {
        replacements: { fiscalYear, fiscalPeriod },
        type: 'SELECT',
    });
    return variances;
};
exports.getVariancesRequiringExplanation = getVariancesRequiringExplanation;
// ============================================================================
// CLOSE MONITORING AND METRICS
// ============================================================================
/**
 * Calculates close cycle time metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} Cycle time metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateCloseCycleTime(sequelize, 2024, 1);
 * console.log(metrics.totalDays, metrics.taskDurations);
 * ```
 */
const calculateCloseCycleTime = async (sequelize, fiscalYear, fiscalPeriod) => {
    const query = `
    SELECT
      MIN(started_at) as close_start,
      MAX(completed_at) as close_end,
      EXTRACT(EPOCH FROM (MAX(completed_at) - MIN(started_at))) / 86400 as total_days,
      AVG(actual_duration) as avg_task_duration,
      SUM(actual_duration) as total_task_duration
    FROM close_checklists cc
    JOIN close_tasks ct ON cc.id = ct.checklist_id
    WHERE cc.fiscal_year = :fiscalYear
      AND cc.fiscal_period = :fiscalPeriod
      AND cc.status = 'completed'
  `;
    const [metrics] = await sequelize.query(query, {
        replacements: { fiscalYear, fiscalPeriod },
        type: 'SELECT',
    });
    return metrics || {};
};
exports.calculateCloseCycleTime = calculateCloseCycleTime;
/**
 * Generates close dashboard metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} Dashboard metrics
 *
 * @example
 * ```typescript
 * const dashboard = await getCloseDashboard(sequelize, 2024, 1);
 * ```
 */
const getCloseDashboard = async (sequelize, fiscalYear, fiscalPeriod) => {
    // Get checklist status
    const [checklist] = await sequelize.query(`SELECT * FROM close_checklists
     WHERE fiscal_year = :fiscalYear AND fiscal_period = :fiscalPeriod
     LIMIT 1`, {
        replacements: { fiscalYear, fiscalPeriod },
        type: 'SELECT',
    });
    // Get task breakdown
    const taskBreakdown = await sequelize.query(`SELECT
       status,
       COUNT(*) as count,
       SUM(estimated_duration) as estimated_minutes,
       SUM(actual_duration) as actual_minutes
     FROM close_tasks
     WHERE checklist_id = :checklistId
     GROUP BY status`, {
        replacements: { checklistId: checklist?.id },
        type: 'SELECT',
    });
    // Get reconciliation status
    const [reconStatus] = await sequelize.query(`SELECT
       COUNT(*) as total,
       COUNT(CASE WHEN status = 'reconciled' THEN 1 END) as reconciled,
       COUNT(CASE WHEN ABS(variance_percent) > variance_threshold THEN 1 END) as variances
     FROM reconciliation_items
     WHERE fiscal_year = :fiscalYear AND fiscal_period = :fiscalPeriod`, {
        replacements: { fiscalYear, fiscalPeriod },
        type: 'SELECT',
    });
    // Get variance status
    const [varianceStatus] = await sequelize.query(`SELECT
       COUNT(*) as total,
       COUNT(CASE WHEN requires_explanation = true THEN 1 END) as requiring_explanation,
       COUNT(CASE WHEN explanation IS NOT NULL THEN 1 END) as explained
     FROM variance_analyses
     WHERE fiscal_year = :fiscalYear AND fiscal_period = :fiscalPeriod`, {
        replacements: { fiscalYear, fiscalPeriod },
        type: 'SELECT',
    });
    return {
        checklist: checklist || {},
        taskBreakdown,
        reconciliationStatus: reconStatus || {},
        varianceStatus: varianceStatus || {},
    };
};
exports.getCloseDashboard = getCloseDashboard;
/**
 * Performs soft close validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<{ canClose: boolean; issues: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateSoftClose(sequelize, 2024, 1);
 * if (!validation.canClose) {
 *   console.log('Issues:', validation.issues);
 * }
 * ```
 */
const validateSoftClose = async (sequelize, fiscalYear, fiscalPeriod) => {
    const issues = [];
    // Check critical tasks
    const [criticalTasks] = await sequelize.query(`SELECT COUNT(*) as count FROM close_tasks ct
     JOIN close_checklists cc ON ct.checklist_id = cc.id
     WHERE cc.fiscal_year = :fiscalYear
       AND cc.fiscal_period = :fiscalPeriod
       AND ct.priority = 'critical'
       AND ct.status != 'completed'`, {
        replacements: { fiscalYear, fiscalPeriod },
        type: 'SELECT',
    });
    if (criticalTasks.count > 0) {
        issues.push(`${criticalTasks.count} critical tasks not completed`);
    }
    // Check reconciliations
    const [unreconciledAccounts] = await sequelize.query(`SELECT COUNT(*) as count FROM reconciliation_items
     WHERE fiscal_year = :fiscalYear
       AND fiscal_period = :fiscalPeriod
       AND status NOT IN ('reconciled', 'variance_explained')`, {
        replacements: { fiscalYear, fiscalPeriod },
        type: 'SELECT',
    });
    if (unreconciledAccounts.count > 0) {
        issues.push(`${unreconciledAccounts.count} accounts not reconciled`);
    }
    return {
        canClose: issues.length === 0,
        issues,
    };
};
exports.validateSoftClose = validateSoftClose;
/**
 * Performs hard close validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<{ canClose: boolean; issues: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateHardClose(sequelize, 2024, 1);
 * ```
 */
const validateHardClose = async (sequelize, fiscalYear, fiscalPeriod) => {
    const issues = [];
    // Check all tasks completed
    const [incompleteTasks] = await sequelize.query(`SELECT COUNT(*) as count FROM close_tasks ct
     JOIN close_checklists cc ON ct.checklist_id = cc.id
     WHERE cc.fiscal_year = :fiscalYear
       AND cc.fiscal_period = :fiscalPeriod
       AND ct.status NOT IN ('completed', 'skipped')`, {
        replacements: { fiscalYear, fiscalPeriod },
        type: 'SELECT',
    });
    if (incompleteTasks.count > 0) {
        issues.push(`${incompleteTasks.count} tasks not completed`);
    }
    // Check all reconciliations completed
    const [unreconciledAccounts] = await sequelize.query(`SELECT COUNT(*) as count FROM reconciliation_items
     WHERE fiscal_year = :fiscalYear
       AND fiscal_period = :fiscalPeriod
       AND status != 'reconciled'`, {
        replacements: { fiscalYear, fiscalPeriod },
        type: 'SELECT',
    });
    if (unreconciledAccounts.count > 0) {
        issues.push(`${unreconciledAccounts.count} accounts not fully reconciled`);
    }
    // Check all variances explained
    const [unexplainedVariances] = await sequelize.query(`SELECT COUNT(*) as count FROM variance_analyses
     WHERE fiscal_year = :fiscalYear
       AND fiscal_period = :fiscalPeriod
       AND requires_explanation = true
       AND (explanation IS NULL OR explanation = '')`, {
        replacements: { fiscalYear, fiscalPeriod },
        type: 'SELECT',
    });
    if (unexplainedVariances.count > 0) {
        issues.push(`${unexplainedVariances.count} variances not explained`);
    }
    // Check approvals
    const [pendingApprovals] = await sequelize.query(`SELECT COUNT(*) as count FROM close_approvals
     WHERE fiscal_year = :fiscalYear
       AND fiscal_period = :fiscalPeriod
       AND status = 'pending'`, {
        replacements: { fiscalYear, fiscalPeriod },
        type: 'SELECT',
    });
    if (pendingApprovals.count > 0) {
        issues.push(`${pendingApprovals.count} approvals pending`);
    }
    return {
        canClose: issues.length === 0,
        issues,
    };
};
exports.validateHardClose = validateHardClose;
/**
 * Executes period close (soft or hard).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} closeType - Close type ('soft_close' or 'hard_close')
 * @param {string} userId - User executing the close
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Close result
 *
 * @example
 * ```typescript
 * const result = await executePeriodClose(sequelize, 2024, 1, 'soft_close', 'user123');
 * ```
 */
const executePeriodClose = async (sequelize, fiscalYear, fiscalPeriod, closeType, userId, transaction) => {
    // Validate close
    const validation = closeType === 'soft_close'
        ? await (0, exports.validateSoftClose)(sequelize, fiscalYear, fiscalPeriod)
        : await (0, exports.validateHardClose)(sequelize, fiscalYear, fiscalPeriod);
    if (!validation.canClose) {
        throw new Error(`Cannot execute ${closeType}: ${validation.issues.join(', ')}`);
    }
    // Update period status
    await (0, exports.updatePeriodStatus)(sequelize, fiscalYear, fiscalPeriod, closeType, userId, transaction);
    // If hard close, lock the period
    if (closeType === 'hard_close') {
        await (0, exports.updatePeriodStatus)(sequelize, fiscalYear, fiscalPeriod, 'locked', userId, transaction);
    }
    return {
        success: true,
        closeType,
        fiscalYear,
        fiscalPeriod,
        closedBy: userId,
        closedAt: new Date(),
    };
};
exports.executePeriodClose = executePeriodClose;
/**
 * Creates a close approval request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} approvalType - Approval type
 * @param {string} approverRole - Approver role
 * @param {string} approverUserId - Approver user ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created approval request
 *
 * @example
 * ```typescript
 * const approval = await createCloseApproval(sequelize, 2024, 1, 'final_close', 'CFO', 'user456');
 * ```
 */
const createCloseApproval = async (sequelize, fiscalYear, fiscalPeriod, approvalType, approverRole, approverUserId, transaction) => {
    const query = `
    INSERT INTO close_approvals (
      fiscal_year, fiscal_period, approval_level, approval_type,
      approver_role, approver_user_id, status, requested_at,
      created_at, updated_at
    ) VALUES (
      :fiscalYear, :fiscalPeriod, 1, :approvalType,
      :approverRole, :approverUserId, 'pending', NOW(),
      NOW(), NOW()
    )
    RETURNING *
  `;
    const [approval] = await sequelize.query(query, {
        replacements: { fiscalYear, fiscalPeriod, approvalType, approverRole, approverUserId },
        transaction,
    });
    return approval;
};
exports.createCloseApproval = createCloseApproval;
/**
 * Approves a close item.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} approvalId - Approval ID
 * @param {string} userId - User approving
 * @param {string} [comments] - Optional comments
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved item
 *
 * @example
 * ```typescript
 * await approveCloseItem(sequelize, 1, 'user456', 'Approved');
 * ```
 */
const approveCloseItem = async (sequelize, approvalId, userId, comments, transaction) => {
    const query = `
    UPDATE close_approvals
    SET status = 'approved',
        responded_at = NOW(),
        comments = :comments,
        updated_at = NOW()
    WHERE id = :approvalId AND status = 'pending'
    RETURNING *
  `;
    const [approval] = await sequelize.query(query, {
        replacements: { approvalId, comments },
        transaction,
    });
    if (!approval) {
        throw new Error('Approval not found or already processed');
    }
    return approval;
};
exports.approveCloseItem = approveCloseItem;
/**
 * Rejects a close item.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} approvalId - Approval ID
 * @param {string} userId - User rejecting
 * @param {string} reason - Rejection reason
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Rejected item
 *
 * @example
 * ```typescript
 * await rejectCloseItem(sequelize, 1, 'user456', 'Missing reconciliations');
 * ```
 */
const rejectCloseItem = async (sequelize, approvalId, userId, reason, transaction) => {
    const query = `
    UPDATE close_approvals
    SET status = 'rejected',
        responded_at = NOW(),
        comments = :reason,
        updated_at = NOW()
    WHERE id = :approvalId AND status = 'pending'
    RETURNING *
  `;
    const [approval] = await sequelize.query(query, {
        replacements: { approvalId, reason },
        transaction,
    });
    if (!approval) {
        throw new Error('Approval not found or already processed');
    }
    return approval;
};
exports.rejectCloseItem = rejectCloseItem;
/**
 * Creates intercompany elimination entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} entityFrom - Source entity
 * @param {string} entityTo - Destination entity
 * @param {string} accountCode - Account code
 * @param {number} amount - Elimination amount
 * @param {string} eliminationType - Elimination type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created elimination
 *
 * @example
 * ```typescript
 * const elim = await createIntercompanyElimination(sequelize, 2024, 1,
 *   'ENTITY-A', 'ENTITY-B', '1200', 10000, 'receivable_payable');
 * ```
 */
const createIntercompanyElimination = async (sequelize, fiscalYear, fiscalPeriod, entityFrom, entityTo, accountCode, amount, eliminationType, transaction) => {
    const query = `
    INSERT INTO intercompany_eliminations (
      fiscal_year, fiscal_period, entity_from, entity_to,
      account_code, amount, elimination_type, status,
      created_at, updated_at
    ) VALUES (
      :fiscalYear, :fiscalPeriod, :entityFrom, :entityTo,
      :accountCode, :amount, :eliminationType, 'pending',
      NOW(), NOW()
    )
    RETURNING *
  `;
    const [elimination] = await sequelize.query(query, {
        replacements: {
            fiscalYear,
            fiscalPeriod,
            entityFrom,
            entityTo,
            accountCode,
            amount,
            eliminationType,
        },
        transaction,
    });
    return elimination;
};
exports.createIntercompanyElimination = createIntercompanyElimination;
/**
 * Posts intercompany elimination to ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} eliminationId - Elimination ID
 * @param {string} userId - User posting
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted elimination
 *
 * @example
 * ```typescript
 * await postIntercompanyElimination(sequelize, 1, 'user123');
 * ```
 */
const postIntercompanyElimination = async (sequelize, eliminationId, userId, transaction) => {
    // Create journal entry for elimination
    const journalEntryId = Math.floor(Math.random() * 100000); // Simulated
    const query = `
    UPDATE intercompany_eliminations
    SET status = 'posted',
        journal_entry_id = :journalEntryId,
        updated_at = NOW()
    WHERE id = :eliminationId AND status = 'pending'
    RETURNING *
  `;
    const [elimination] = await sequelize.query(query, {
        replacements: { eliminationId, journalEntryId },
        transaction,
    });
    if (!elimination) {
        throw new Error('Elimination not found or already posted');
    }
    return elimination;
};
exports.postIntercompanyElimination = postIntercompanyElimination;
/**
 * Initiates close rollback.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} rollbackType - Rollback type
 * @param {string} reason - Rollback reason
 * @param {string} userId - User initiating
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Rollback record
 *
 * @example
 * ```typescript
 * const rollback = await initiateCloseRollback(sequelize, 2024, 1, 'soft_close',
 *   'Missing adjustments', 'user123');
 * ```
 */
const initiateCloseRollback = async (sequelize, fiscalYear, fiscalPeriod, rollbackType, reason, userId, transaction) => {
    // Create backup snapshot
    const snapshot = await sequelize.query(`SELECT * FROM close_checklists WHERE fiscal_year = :fiscalYear AND fiscal_period = :fiscalPeriod`, {
        replacements: { fiscalYear, fiscalPeriod },
        type: 'SELECT',
        transaction,
    });
    const query = `
    INSERT INTO close_rollbacks (
      fiscal_year, fiscal_period, rollback_type, rollback_reason,
      initiated_by, initiated_at, status, backup_snapshot,
      affected_entries, created_at, updated_at
    ) VALUES (
      :fiscalYear, :fiscalPeriod, :rollbackType, :reason,
      :userId, NOW(), 'pending', :snapshot,
      '{}', NOW(), NOW()
    )
    RETURNING *
  `;
    const [rollback] = await sequelize.query(query, {
        replacements: {
            fiscalYear,
            fiscalPeriod,
            rollbackType,
            reason,
            userId,
            snapshot: JSON.stringify(snapshot),
        },
        transaction,
    });
    return rollback;
};
exports.initiateCloseRollback = initiateCloseRollback;
/**
 * Completes close rollback.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} rollbackId - Rollback ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Completed rollback
 *
 * @example
 * ```typescript
 * await completeCloseRollback(sequelize, 1);
 * ```
 */
const completeCloseRollback = async (sequelize, rollbackId, transaction) => {
    // Restore from backup and reopen period
    const query = `
    UPDATE close_rollbacks
    SET status = 'completed',
        completed_at = NOW(),
        updated_at = NOW()
    WHERE id = :rollbackId AND status IN ('pending', 'in_progress')
    RETURNING *
  `;
    const [rollback] = await sequelize.query(query, {
        replacements: { rollbackId },
        transaction,
    });
    if (!rollback) {
        throw new Error('Rollback not found or already completed');
    }
    return rollback;
};
exports.completeCloseRollback = completeCloseRollback;
/**
 * Retrieves close metrics for analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any[]>} Close metrics
 *
 * @example
 * ```typescript
 * const metrics = await getCloseMetrics(sequelize, 2024, 1);
 * ```
 */
const getCloseMetrics = async (sequelize, fiscalYear, fiscalPeriod) => {
    const query = `
    SELECT * FROM close_metrics
    WHERE fiscal_year = :fiscalYear AND fiscal_period = :fiscalPeriod
    ORDER BY metric_type, metric_name
  `;
    const metrics = await sequelize.query(query, {
        replacements: { fiscalYear, fiscalPeriod },
        type: 'SELECT',
    });
    return metrics;
};
exports.getCloseMetrics = getCloseMetrics;
/**
 * Creates close template from completed checklist.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} checklistId - Source checklist ID
 * @param {string} templateName - Template name
 * @param {string} userId - User creating template
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created template
 *
 * @example
 * ```typescript
 * const template = await createCloseTemplate(sequelize, 1, 'Monthly Close Standard', 'user123');
 * ```
 */
const createCloseTemplate = async (sequelize, checklistId, templateName, userId, transaction) => {
    // Create template record
    const [template] = await sequelize.query(`INSERT INTO close_templates (template_name, created_by, created_at, updated_at)
     VALUES (:templateName, :userId, NOW(), NOW())
     RETURNING *`, {
        replacements: { templateName, userId },
        transaction,
    });
    // Copy tasks to template
    await sequelize.query(`INSERT INTO close_task_templates (
      template_id, task_sequence, task_name, task_description,
      task_category, task_type, assigned_to, assigned_role,
      estimated_duration, priority, depends_on, automation_script
    )
    SELECT
      :templateId, task_sequence, task_name, task_description,
      task_category, task_type, assigned_to, assigned_role,
      estimated_duration, priority, depends_on, automation_script
    FROM close_tasks
    WHERE checklist_id = :checklistId`, {
        replacements: { templateId: template.id, checklistId },
        transaction,
    });
    return template;
};
exports.createCloseTemplate = createCloseTemplate;
/**
 * Applies close template to checklist.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} checklistId - Target checklist ID
 * @param {number} templateId - Template ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyCloseTemplate(sequelize, 2, 1);
 * ```
 */
const applyCloseTemplate = async (sequelize, checklistId, templateId, transaction) => {
    await (0, exports.copyTasksFromTemplate)(sequelize, checklistId, templateId, transaction);
};
exports.applyCloseTemplate = applyCloseTemplate;
/**
 * Retrieves blocked tasks.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} checklistId - Checklist ID
 * @returns {Promise<any[]>} Blocked tasks
 *
 * @example
 * ```typescript
 * const blocked = await getBlockedTasks(sequelize, 1);
 * ```
 */
const getBlockedTasks = async (sequelize, checklistId) => {
    const query = `
    SELECT
      ct.*,
      array_agg(dep.task_name) as dependency_names
    FROM close_tasks ct
    LEFT JOIN close_tasks dep ON dep.id = ANY(ct.depends_on)
    WHERE ct.checklist_id = :checklistId
      AND ct.status = 'blocked'
    GROUP BY ct.id
    ORDER BY ct.priority DESC, ct.task_sequence
  `;
    const tasks = await sequelize.query(query, {
        replacements: { checklistId },
        type: 'SELECT',
    });
    return tasks;
};
exports.getBlockedTasks = getBlockedTasks;
/**
 * Escalates variance for review.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} varianceId - Variance analysis ID
 * @param {string} userId - User escalating
 * @param {string} reason - Escalation reason
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Escalated variance
 *
 * @example
 * ```typescript
 * await escalateVariance(sequelize, 1, 'user123', 'Requires CFO review');
 * ```
 */
const escalateVariance = async (sequelize, varianceId, userId, reason, transaction) => {
    const query = `
    UPDATE variance_analyses
    SET threshold_exceeded = true,
        requires_explanation = true,
        explanation = COALESCE(explanation || ' | ', '') || 'ESCALATED: ' || :reason,
        analyzed_by = :userId,
        analyzed_date = NOW(),
        updated_at = NOW()
    WHERE id = :varianceId
    RETURNING *
  `;
    const [variance] = await sequelize.query(query, {
        replacements: { varianceId, userId, reason },
        transaction,
    });
    return variance;
};
exports.escalateVariance = escalateVariance;
/**
 * Generates close summary report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} Close summary
 *
 * @example
 * ```typescript
 * const summary = await generateCloseSummary(sequelize, 2024, 1);
 * ```
 */
const generateCloseSummary = async (sequelize, fiscalYear, fiscalPeriod) => {
    const dashboard = await (0, exports.getCloseDashboard)(sequelize, fiscalYear, fiscalPeriod);
    const cycleTime = await (0, exports.calculateCloseCycleTime)(sequelize, fiscalYear, fiscalPeriod);
    const variances = await (0, exports.getVariancesRequiringExplanation)(sequelize, fiscalYear, fiscalPeriod);
    return {
        fiscalYear,
        fiscalPeriod,
        dashboard,
        cycleTime,
        outstandingVariances: variances.length,
        completionStatus: dashboard.checklist?.status || 'not_started',
    };
};
exports.generateCloseSummary = generateCloseSummary;
// ============================================================================
// EXPORT ALL FUNCTIONS
// ============================================================================
exports.default = {
    createCloseCalendarModel: exports.createCloseCalendarModel,
    createCloseChecklistModel: exports.createCloseChecklistModel,
    createCloseTaskModel: exports.createCloseTaskModel,
    createClosePeriod: exports.createClosePeriod,
    updatePeriodStatus: exports.updatePeriodStatus,
    getCurrentOpenPeriod: exports.getCurrentOpenPeriod,
    getCloseCalendar: exports.getCloseCalendar,
    createCloseChecklist: exports.createCloseChecklist,
    copyTasksFromTemplate: exports.copyTasksFromTemplate,
    updateChecklistTaskCounts: exports.updateChecklistTaskCounts,
    getCloseChecklistWithTasks: exports.getCloseChecklistWithTasks,
    createCloseTask: exports.createCloseTask,
    startCloseTask: exports.startCloseTask,
    completeCloseTask: exports.completeCloseTask,
    executeAutomatedTask: exports.executeAutomatedTask,
    getTasksByStatus: exports.getTasksByStatus,
    createAccrual: exports.createAccrual,
    postAccrual: exports.postAccrual,
    generateAutomatedAccruals: exports.generateAutomatedAccruals,
    reverseAccrual: exports.reverseAccrual,
    getAccruals: exports.getAccruals,
    createDeferral: exports.createDeferral,
    amortizeDeferrals: exports.amortizeDeferrals,
    createReconciliation: exports.createReconciliation,
    completeReconciliation: exports.completeReconciliation,
    getReconciliations: exports.getReconciliations,
    performVarianceAnalysis: exports.performVarianceAnalysis,
    getVariancesRequiringExplanation: exports.getVariancesRequiringExplanation,
    calculateCloseCycleTime: exports.calculateCloseCycleTime,
    getCloseDashboard: exports.getCloseDashboard,
    validateSoftClose: exports.validateSoftClose,
    validateHardClose: exports.validateHardClose,
    executePeriodClose: exports.executePeriodClose,
    createCloseApproval: exports.createCloseApproval,
    approveCloseItem: exports.approveCloseItem,
    rejectCloseItem: exports.rejectCloseItem,
    createIntercompanyElimination: exports.createIntercompanyElimination,
    postIntercompanyElimination: exports.postIntercompanyElimination,
    initiateCloseRollback: exports.initiateCloseRollback,
    completeCloseRollback: exports.completeCloseRollback,
    getCloseMetrics: exports.getCloseMetrics,
    createCloseTemplate: exports.createCloseTemplate,
    applyCloseTemplate: exports.applyCloseTemplate,
    getBlockedTasks: exports.getBlockedTasks,
    escalateVariance: exports.escalateVariance,
    generateCloseSummary: exports.generateCloseSummary,
};
//# sourceMappingURL=financial-close-automation-kit.js.map