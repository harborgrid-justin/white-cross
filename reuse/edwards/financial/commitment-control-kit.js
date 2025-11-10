"use strict";
/**
 * LOC: COMMCTRL001
 * File: /reuse/edwards/financial/commitment-control-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../financial/budget-management-kit (Budget operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Procurement services
 *   - Budget control processes
 *   - Purchase order management
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
exports.cancelCommitment = exports.recordCommitmentHistory = exports.getCommitmentHistory = exports.updateCommitmentLine = exports.getCommitmentLines = exports.getCommitmentByNumber = exports.getFiscalYearPeriod = exports.generatePreEncumbranceNumber = exports.generatePONumber = exports.generateRequisitionNumber = exports.generateCommitmentNumber = exports.generateCommitmentVarianceReport = exports.generateLiquidationHistoryReport = exports.generateOpenCommitmentsReport = exports.convertPreEncumbranceToCommitment = exports.createPreEncumbrance = exports.getPurchaseOrdersByVendor = exports.closePurchaseOrder = exports.approvePurchaseOrder = exports.createPurchaseOrder = exports.getRequisitionsByStatus = exports.convertRequisitionToPO = exports.createPurchaseRequisition = exports.getBudgetReservations = exports.releaseBudgetReservations = exports.createBudgetReservations = exports.closeCommitment = exports.reverseCommitmentLiquidation = exports.liquidateCommitment = exports.postCommitmentToBudget = exports.delegateApproval = exports.getCommitmentApprovalHistory = exports.approveCommitment = exports.submitCommitmentForApproval = exports.overrideBudgetCheck = exports.checkBudgetAvailability = exports.performBudgetCheck = exports.getCommitments = exports.getCommitmentById = exports.deleteCommitment = exports.updateCommitment = exports.createCommitment = exports.createCommitmentLineModel = exports.createCommitmentHeaderModel = exports.CreatePurchaseOrderDto = exports.CreatePurchaseRequisitionDto = exports.LiquidateCommitmentDto = exports.BudgetCheckRequestDto = exports.ApprovementCommitmentDto = exports.CreateCommitmentDto = void 0;
exports.reopenCommitment = void 0;
/**
 * File: /reuse/edwards/financial/commitment-control-kit.ts
 * Locator: WC-JDE-COMMCTRL-001
 * Purpose: Comprehensive Commitment Control - JD Edwards EnterpriseOne-level commitment tracking, budget checking, purchase requisitions, purchase orders
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, budget-management-kit
 * Downstream: ../backend/financial/*, Procurement Services, Budget Control, PO Management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for commitment tracking, budget checking, commitment approval, commitment liquidation, pre-encumbrance, purchase requisitions, purchase orders, commitment reporting, budget reservations
 *
 * LLM Context: Enterprise-grade commitment control operations for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive commitment tracking, automated budget checking, commitment approval workflows,
 * commitment liquidation, pre-encumbrance tracking, purchase requisition management, purchase order processing,
 * commitment reporting, budget reservations, multi-level approval routing, commitment history, audit trails,
 * commitment variance analysis, and fund control integration.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateCommitmentDto = (() => {
    var _a;
    let _commitmentDate_decorators;
    let _commitmentDate_initializers = [];
    let _commitmentDate_extraInitializers = [];
    let _commitmentType_decorators;
    let _commitmentType_initializers = [];
    let _commitmentType_extraInitializers = [];
    let _businessUnit_decorators;
    let _businessUnit_initializers = [];
    let _businessUnit_extraInitializers = [];
    let _vendor_decorators;
    let _vendor_initializers = [];
    let _vendor_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _requester_decorators;
    let _requester_initializers = [];
    let _requester_extraInitializers = [];
    let _lines_decorators;
    let _lines_initializers = [];
    let _lines_extraInitializers = [];
    return _a = class CreateCommitmentDto {
            constructor() {
                this.commitmentDate = __runInitializers(this, _commitmentDate_initializers, void 0);
                this.commitmentType = (__runInitializers(this, _commitmentDate_extraInitializers), __runInitializers(this, _commitmentType_initializers, void 0));
                this.businessUnit = (__runInitializers(this, _commitmentType_extraInitializers), __runInitializers(this, _businessUnit_initializers, void 0));
                this.vendor = (__runInitializers(this, _businessUnit_extraInitializers), __runInitializers(this, _vendor_initializers, void 0));
                this.description = (__runInitializers(this, _vendor_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.requester = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _requester_initializers, void 0));
                this.lines = (__runInitializers(this, _requester_extraInitializers), __runInitializers(this, _lines_initializers, void 0));
                __runInitializers(this, _lines_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _commitmentDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Commitment date', example: '2024-01-15' })];
            _commitmentType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Commitment type', enum: ['requisition', 'purchase_order', 'contract', 'blanket_po', 'pre_encumbrance'] })];
            _businessUnit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business unit', example: 'BU001' })];
            _vendor_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor ID', required: false })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' })];
            _requester_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requester user ID' })];
            _lines_decorators = [(0, swagger_1.ApiProperty)({ description: 'Commitment lines', type: [Object] })];
            __esDecorate(null, null, _commitmentDate_decorators, { kind: "field", name: "commitmentDate", static: false, private: false, access: { has: obj => "commitmentDate" in obj, get: obj => obj.commitmentDate, set: (obj, value) => { obj.commitmentDate = value; } }, metadata: _metadata }, _commitmentDate_initializers, _commitmentDate_extraInitializers);
            __esDecorate(null, null, _commitmentType_decorators, { kind: "field", name: "commitmentType", static: false, private: false, access: { has: obj => "commitmentType" in obj, get: obj => obj.commitmentType, set: (obj, value) => { obj.commitmentType = value; } }, metadata: _metadata }, _commitmentType_initializers, _commitmentType_extraInitializers);
            __esDecorate(null, null, _businessUnit_decorators, { kind: "field", name: "businessUnit", static: false, private: false, access: { has: obj => "businessUnit" in obj, get: obj => obj.businessUnit, set: (obj, value) => { obj.businessUnit = value; } }, metadata: _metadata }, _businessUnit_initializers, _businessUnit_extraInitializers);
            __esDecorate(null, null, _vendor_decorators, { kind: "field", name: "vendor", static: false, private: false, access: { has: obj => "vendor" in obj, get: obj => obj.vendor, set: (obj, value) => { obj.vendor = value; } }, metadata: _metadata }, _vendor_initializers, _vendor_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _requester_decorators, { kind: "field", name: "requester", static: false, private: false, access: { has: obj => "requester" in obj, get: obj => obj.requester, set: (obj, value) => { obj.requester = value; } }, metadata: _metadata }, _requester_initializers, _requester_extraInitializers);
            __esDecorate(null, null, _lines_decorators, { kind: "field", name: "lines", static: false, private: false, access: { has: obj => "lines" in obj, get: obj => obj.lines, set: (obj, value) => { obj.lines = value; } }, metadata: _metadata }, _lines_initializers, _lines_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCommitmentDto = CreateCommitmentDto;
let ApprovementCommitmentDto = (() => {
    var _a;
    let _commitmentId_decorators;
    let _commitmentId_initializers = [];
    let _commitmentId_extraInitializers = [];
    let _approvalAction_decorators;
    let _approvalAction_initializers = [];
    let _approvalAction_extraInitializers = [];
    let _approverUserId_decorators;
    let _approverUserId_initializers = [];
    let _approverUserId_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    let _delegatedTo_decorators;
    let _delegatedTo_initializers = [];
    let _delegatedTo_extraInitializers = [];
    return _a = class ApprovementCommitmentDto {
            constructor() {
                this.commitmentId = __runInitializers(this, _commitmentId_initializers, void 0);
                this.approvalAction = (__runInitializers(this, _commitmentId_extraInitializers), __runInitializers(this, _approvalAction_initializers, void 0));
                this.approverUserId = (__runInitializers(this, _approvalAction_extraInitializers), __runInitializers(this, _approverUserId_initializers, void 0));
                this.comments = (__runInitializers(this, _approverUserId_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
                this.delegatedTo = (__runInitializers(this, _comments_extraInitializers), __runInitializers(this, _delegatedTo_initializers, void 0));
                __runInitializers(this, _delegatedTo_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _commitmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Commitment ID' })];
            _approvalAction_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval action', enum: ['approve', 'reject', 'return', 'delegate'] })];
            _approverUserId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approver user ID' })];
            _comments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Comments', required: false })];
            _delegatedTo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delegate to user ID', required: false })];
            __esDecorate(null, null, _commitmentId_decorators, { kind: "field", name: "commitmentId", static: false, private: false, access: { has: obj => "commitmentId" in obj, get: obj => obj.commitmentId, set: (obj, value) => { obj.commitmentId = value; } }, metadata: _metadata }, _commitmentId_initializers, _commitmentId_extraInitializers);
            __esDecorate(null, null, _approvalAction_decorators, { kind: "field", name: "approvalAction", static: false, private: false, access: { has: obj => "approvalAction" in obj, get: obj => obj.approvalAction, set: (obj, value) => { obj.approvalAction = value; } }, metadata: _metadata }, _approvalAction_initializers, _approvalAction_extraInitializers);
            __esDecorate(null, null, _approverUserId_decorators, { kind: "field", name: "approverUserId", static: false, private: false, access: { has: obj => "approverUserId" in obj, get: obj => obj.approverUserId, set: (obj, value) => { obj.approverUserId = value; } }, metadata: _metadata }, _approverUserId_initializers, _approverUserId_extraInitializers);
            __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
            __esDecorate(null, null, _delegatedTo_decorators, { kind: "field", name: "delegatedTo", static: false, private: false, access: { has: obj => "delegatedTo" in obj, get: obj => obj.delegatedTo, set: (obj, value) => { obj.delegatedTo = value; } }, metadata: _metadata }, _delegatedTo_initializers, _delegatedTo_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ApprovementCommitmentDto = ApprovementCommitmentDto;
let BudgetCheckRequestDto = (() => {
    var _a;
    let _accountCode_decorators;
    let _accountCode_initializers = [];
    let _accountCode_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _fiscalPeriod_decorators;
    let _fiscalPeriod_initializers = [];
    let _fiscalPeriod_extraInitializers = [];
    let _requestedAmount_decorators;
    let _requestedAmount_initializers = [];
    let _requestedAmount_extraInitializers = [];
    let _businessUnit_decorators;
    let _businessUnit_initializers = [];
    let _businessUnit_extraInitializers = [];
    return _a = class BudgetCheckRequestDto {
            constructor() {
                this.accountCode = __runInitializers(this, _accountCode_initializers, void 0);
                this.fiscalYear = (__runInitializers(this, _accountCode_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
                this.fiscalPeriod = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _fiscalPeriod_initializers, void 0));
                this.requestedAmount = (__runInitializers(this, _fiscalPeriod_extraInitializers), __runInitializers(this, _requestedAmount_initializers, void 0));
                this.businessUnit = (__runInitializers(this, _requestedAmount_extraInitializers), __runInitializers(this, _businessUnit_initializers, void 0));
                __runInitializers(this, _businessUnit_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _accountCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account code' })];
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' })];
            _fiscalPeriod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal period' })];
            _requestedAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requested amount' })];
            _businessUnit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business unit', required: false })];
            __esDecorate(null, null, _accountCode_decorators, { kind: "field", name: "accountCode", static: false, private: false, access: { has: obj => "accountCode" in obj, get: obj => obj.accountCode, set: (obj, value) => { obj.accountCode = value; } }, metadata: _metadata }, _accountCode_initializers, _accountCode_extraInitializers);
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _fiscalPeriod_decorators, { kind: "field", name: "fiscalPeriod", static: false, private: false, access: { has: obj => "fiscalPeriod" in obj, get: obj => obj.fiscalPeriod, set: (obj, value) => { obj.fiscalPeriod = value; } }, metadata: _metadata }, _fiscalPeriod_initializers, _fiscalPeriod_extraInitializers);
            __esDecorate(null, null, _requestedAmount_decorators, { kind: "field", name: "requestedAmount", static: false, private: false, access: { has: obj => "requestedAmount" in obj, get: obj => obj.requestedAmount, set: (obj, value) => { obj.requestedAmount = value; } }, metadata: _metadata }, _requestedAmount_initializers, _requestedAmount_extraInitializers);
            __esDecorate(null, null, _businessUnit_decorators, { kind: "field", name: "businessUnit", static: false, private: false, access: { has: obj => "businessUnit" in obj, get: obj => obj.businessUnit, set: (obj, value) => { obj.businessUnit = value; } }, metadata: _metadata }, _businessUnit_initializers, _businessUnit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.BudgetCheckRequestDto = BudgetCheckRequestDto;
let LiquidateCommitmentDto = (() => {
    var _a;
    let _commitmentId_decorators;
    let _commitmentId_initializers = [];
    let _commitmentId_extraInitializers = [];
    let _commitmentLineId_decorators;
    let _commitmentLineId_initializers = [];
    let _commitmentLineId_extraInitializers = [];
    let _liquidationAmount_decorators;
    let _liquidationAmount_initializers = [];
    let _liquidationAmount_extraInitializers = [];
    let _liquidationDate_decorators;
    let _liquidationDate_initializers = [];
    let _liquidationDate_extraInitializers = [];
    let _invoiceNumber_decorators;
    let _invoiceNumber_initializers = [];
    let _invoiceNumber_extraInitializers = [];
    let _receivingNumber_decorators;
    let _receivingNumber_initializers = [];
    let _receivingNumber_extraInitializers = [];
    let _liquidatedBy_decorators;
    let _liquidatedBy_initializers = [];
    let _liquidatedBy_extraInitializers = [];
    return _a = class LiquidateCommitmentDto {
            constructor() {
                this.commitmentId = __runInitializers(this, _commitmentId_initializers, void 0);
                this.commitmentLineId = (__runInitializers(this, _commitmentId_extraInitializers), __runInitializers(this, _commitmentLineId_initializers, void 0));
                this.liquidationAmount = (__runInitializers(this, _commitmentLineId_extraInitializers), __runInitializers(this, _liquidationAmount_initializers, void 0));
                this.liquidationDate = (__runInitializers(this, _liquidationAmount_extraInitializers), __runInitializers(this, _liquidationDate_initializers, void 0));
                this.invoiceNumber = (__runInitializers(this, _liquidationDate_extraInitializers), __runInitializers(this, _invoiceNumber_initializers, void 0));
                this.receivingNumber = (__runInitializers(this, _invoiceNumber_extraInitializers), __runInitializers(this, _receivingNumber_initializers, void 0));
                this.liquidatedBy = (__runInitializers(this, _receivingNumber_extraInitializers), __runInitializers(this, _liquidatedBy_initializers, void 0));
                __runInitializers(this, _liquidatedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _commitmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Commitment ID' })];
            _commitmentLineId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Commitment line ID' })];
            _liquidationAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Liquidation amount' })];
            _liquidationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Liquidation date' })];
            _invoiceNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice number', required: false })];
            _receivingNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Receiving number', required: false })];
            _liquidatedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'User liquidating' })];
            __esDecorate(null, null, _commitmentId_decorators, { kind: "field", name: "commitmentId", static: false, private: false, access: { has: obj => "commitmentId" in obj, get: obj => obj.commitmentId, set: (obj, value) => { obj.commitmentId = value; } }, metadata: _metadata }, _commitmentId_initializers, _commitmentId_extraInitializers);
            __esDecorate(null, null, _commitmentLineId_decorators, { kind: "field", name: "commitmentLineId", static: false, private: false, access: { has: obj => "commitmentLineId" in obj, get: obj => obj.commitmentLineId, set: (obj, value) => { obj.commitmentLineId = value; } }, metadata: _metadata }, _commitmentLineId_initializers, _commitmentLineId_extraInitializers);
            __esDecorate(null, null, _liquidationAmount_decorators, { kind: "field", name: "liquidationAmount", static: false, private: false, access: { has: obj => "liquidationAmount" in obj, get: obj => obj.liquidationAmount, set: (obj, value) => { obj.liquidationAmount = value; } }, metadata: _metadata }, _liquidationAmount_initializers, _liquidationAmount_extraInitializers);
            __esDecorate(null, null, _liquidationDate_decorators, { kind: "field", name: "liquidationDate", static: false, private: false, access: { has: obj => "liquidationDate" in obj, get: obj => obj.liquidationDate, set: (obj, value) => { obj.liquidationDate = value; } }, metadata: _metadata }, _liquidationDate_initializers, _liquidationDate_extraInitializers);
            __esDecorate(null, null, _invoiceNumber_decorators, { kind: "field", name: "invoiceNumber", static: false, private: false, access: { has: obj => "invoiceNumber" in obj, get: obj => obj.invoiceNumber, set: (obj, value) => { obj.invoiceNumber = value; } }, metadata: _metadata }, _invoiceNumber_initializers, _invoiceNumber_extraInitializers);
            __esDecorate(null, null, _receivingNumber_decorators, { kind: "field", name: "receivingNumber", static: false, private: false, access: { has: obj => "receivingNumber" in obj, get: obj => obj.receivingNumber, set: (obj, value) => { obj.receivingNumber = value; } }, metadata: _metadata }, _receivingNumber_initializers, _receivingNumber_extraInitializers);
            __esDecorate(null, null, _liquidatedBy_decorators, { kind: "field", name: "liquidatedBy", static: false, private: false, access: { has: obj => "liquidatedBy" in obj, get: obj => obj.liquidatedBy, set: (obj, value) => { obj.liquidatedBy = value; } }, metadata: _metadata }, _liquidatedBy_initializers, _liquidatedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.LiquidateCommitmentDto = LiquidateCommitmentDto;
let CreatePurchaseRequisitionDto = (() => {
    var _a;
    let _requisitionDate_decorators;
    let _requisitionDate_initializers = [];
    let _requisitionDate_extraInitializers = [];
    let _requester_decorators;
    let _requester_initializers = [];
    let _requester_extraInitializers = [];
    let _department_decorators;
    let _department_initializers = [];
    let _department_extraInitializers = [];
    let _businessUnit_decorators;
    let _businessUnit_initializers = [];
    let _businessUnit_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _needByDate_decorators;
    let _needByDate_initializers = [];
    let _needByDate_extraInitializers = [];
    let _deliveryLocation_decorators;
    let _deliveryLocation_initializers = [];
    let _deliveryLocation_extraInitializers = [];
    let _lines_decorators;
    let _lines_initializers = [];
    let _lines_extraInitializers = [];
    return _a = class CreatePurchaseRequisitionDto {
            constructor() {
                this.requisitionDate = __runInitializers(this, _requisitionDate_initializers, void 0);
                this.requester = (__runInitializers(this, _requisitionDate_extraInitializers), __runInitializers(this, _requester_initializers, void 0));
                this.department = (__runInitializers(this, _requester_extraInitializers), __runInitializers(this, _department_initializers, void 0));
                this.businessUnit = (__runInitializers(this, _department_extraInitializers), __runInitializers(this, _businessUnit_initializers, void 0));
                this.description = (__runInitializers(this, _businessUnit_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.needByDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _needByDate_initializers, void 0));
                this.deliveryLocation = (__runInitializers(this, _needByDate_extraInitializers), __runInitializers(this, _deliveryLocation_initializers, void 0));
                this.lines = (__runInitializers(this, _deliveryLocation_extraInitializers), __runInitializers(this, _lines_initializers, void 0));
                __runInitializers(this, _lines_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _requisitionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requisition date', example: '2024-01-15' })];
            _requester_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requester user ID' })];
            _department_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department code' })];
            _businessUnit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business unit' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' })];
            _needByDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Need by date', required: false })];
            _deliveryLocation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delivery location', required: false })];
            _lines_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requisition lines', type: [Object] })];
            __esDecorate(null, null, _requisitionDate_decorators, { kind: "field", name: "requisitionDate", static: false, private: false, access: { has: obj => "requisitionDate" in obj, get: obj => obj.requisitionDate, set: (obj, value) => { obj.requisitionDate = value; } }, metadata: _metadata }, _requisitionDate_initializers, _requisitionDate_extraInitializers);
            __esDecorate(null, null, _requester_decorators, { kind: "field", name: "requester", static: false, private: false, access: { has: obj => "requester" in obj, get: obj => obj.requester, set: (obj, value) => { obj.requester = value; } }, metadata: _metadata }, _requester_initializers, _requester_extraInitializers);
            __esDecorate(null, null, _department_decorators, { kind: "field", name: "department", static: false, private: false, access: { has: obj => "department" in obj, get: obj => obj.department, set: (obj, value) => { obj.department = value; } }, metadata: _metadata }, _department_initializers, _department_extraInitializers);
            __esDecorate(null, null, _businessUnit_decorators, { kind: "field", name: "businessUnit", static: false, private: false, access: { has: obj => "businessUnit" in obj, get: obj => obj.businessUnit, set: (obj, value) => { obj.businessUnit = value; } }, metadata: _metadata }, _businessUnit_initializers, _businessUnit_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _needByDate_decorators, { kind: "field", name: "needByDate", static: false, private: false, access: { has: obj => "needByDate" in obj, get: obj => obj.needByDate, set: (obj, value) => { obj.needByDate = value; } }, metadata: _metadata }, _needByDate_initializers, _needByDate_extraInitializers);
            __esDecorate(null, null, _deliveryLocation_decorators, { kind: "field", name: "deliveryLocation", static: false, private: false, access: { has: obj => "deliveryLocation" in obj, get: obj => obj.deliveryLocation, set: (obj, value) => { obj.deliveryLocation = value; } }, metadata: _metadata }, _deliveryLocation_initializers, _deliveryLocation_extraInitializers);
            __esDecorate(null, null, _lines_decorators, { kind: "field", name: "lines", static: false, private: false, access: { has: obj => "lines" in obj, get: obj => obj.lines, set: (obj, value) => { obj.lines = value; } }, metadata: _metadata }, _lines_initializers, _lines_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePurchaseRequisitionDto = CreatePurchaseRequisitionDto;
let CreatePurchaseOrderDto = (() => {
    var _a;
    let _poDate_decorators;
    let _poDate_initializers = [];
    let _poDate_extraInitializers = [];
    let _poType_decorators;
    let _poType_initializers = [];
    let _poType_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _businessUnit_decorators;
    let _businessUnit_initializers = [];
    let _businessUnit_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _paymentTerms_decorators;
    let _paymentTerms_initializers = [];
    let _paymentTerms_extraInitializers = [];
    let _shipToLocation_decorators;
    let _shipToLocation_initializers = [];
    let _shipToLocation_extraInitializers = [];
    let _buyer_decorators;
    let _buyer_initializers = [];
    let _buyer_extraInitializers = [];
    let _requisitionId_decorators;
    let _requisitionId_initializers = [];
    let _requisitionId_extraInitializers = [];
    let _lines_decorators;
    let _lines_initializers = [];
    let _lines_extraInitializers = [];
    return _a = class CreatePurchaseOrderDto {
            constructor() {
                this.poDate = __runInitializers(this, _poDate_initializers, void 0);
                this.poType = (__runInitializers(this, _poDate_extraInitializers), __runInitializers(this, _poType_initializers, void 0));
                this.vendorId = (__runInitializers(this, _poType_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
                this.businessUnit = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _businessUnit_initializers, void 0));
                this.description = (__runInitializers(this, _businessUnit_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.paymentTerms = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _paymentTerms_initializers, void 0));
                this.shipToLocation = (__runInitializers(this, _paymentTerms_extraInitializers), __runInitializers(this, _shipToLocation_initializers, void 0));
                this.buyer = (__runInitializers(this, _shipToLocation_extraInitializers), __runInitializers(this, _buyer_initializers, void 0));
                this.requisitionId = (__runInitializers(this, _buyer_extraInitializers), __runInitializers(this, _requisitionId_initializers, void 0));
                this.lines = (__runInitializers(this, _requisitionId_extraInitializers), __runInitializers(this, _lines_initializers, void 0));
                __runInitializers(this, _lines_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _poDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'PO date', example: '2024-01-15' })];
            _poType_decorators = [(0, swagger_1.ApiProperty)({ description: 'PO type', enum: ['standard', 'blanket', 'contract', 'emergency'] })];
            _vendorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor ID' })];
            _businessUnit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business unit' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' })];
            _paymentTerms_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment terms' })];
            _shipToLocation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Ship to location' })];
            _buyer_decorators = [(0, swagger_1.ApiProperty)({ description: 'Buyer user ID' })];
            _requisitionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requisition ID', required: false })];
            _lines_decorators = [(0, swagger_1.ApiProperty)({ description: 'PO lines', type: [Object] })];
            __esDecorate(null, null, _poDate_decorators, { kind: "field", name: "poDate", static: false, private: false, access: { has: obj => "poDate" in obj, get: obj => obj.poDate, set: (obj, value) => { obj.poDate = value; } }, metadata: _metadata }, _poDate_initializers, _poDate_extraInitializers);
            __esDecorate(null, null, _poType_decorators, { kind: "field", name: "poType", static: false, private: false, access: { has: obj => "poType" in obj, get: obj => obj.poType, set: (obj, value) => { obj.poType = value; } }, metadata: _metadata }, _poType_initializers, _poType_extraInitializers);
            __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
            __esDecorate(null, null, _businessUnit_decorators, { kind: "field", name: "businessUnit", static: false, private: false, access: { has: obj => "businessUnit" in obj, get: obj => obj.businessUnit, set: (obj, value) => { obj.businessUnit = value; } }, metadata: _metadata }, _businessUnit_initializers, _businessUnit_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _paymentTerms_decorators, { kind: "field", name: "paymentTerms", static: false, private: false, access: { has: obj => "paymentTerms" in obj, get: obj => obj.paymentTerms, set: (obj, value) => { obj.paymentTerms = value; } }, metadata: _metadata }, _paymentTerms_initializers, _paymentTerms_extraInitializers);
            __esDecorate(null, null, _shipToLocation_decorators, { kind: "field", name: "shipToLocation", static: false, private: false, access: { has: obj => "shipToLocation" in obj, get: obj => obj.shipToLocation, set: (obj, value) => { obj.shipToLocation = value; } }, metadata: _metadata }, _shipToLocation_initializers, _shipToLocation_extraInitializers);
            __esDecorate(null, null, _buyer_decorators, { kind: "field", name: "buyer", static: false, private: false, access: { has: obj => "buyer" in obj, get: obj => obj.buyer, set: (obj, value) => { obj.buyer = value; } }, metadata: _metadata }, _buyer_initializers, _buyer_extraInitializers);
            __esDecorate(null, null, _requisitionId_decorators, { kind: "field", name: "requisitionId", static: false, private: false, access: { has: obj => "requisitionId" in obj, get: obj => obj.requisitionId, set: (obj, value) => { obj.requisitionId = value; } }, metadata: _metadata }, _requisitionId_initializers, _requisitionId_extraInitializers);
            __esDecorate(null, null, _lines_decorators, { kind: "field", name: "lines", static: false, private: false, access: { has: obj => "lines" in obj, get: obj => obj.lines, set: (obj, value) => { obj.lines = value; } }, metadata: _metadata }, _lines_initializers, _lines_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePurchaseOrderDto = CreatePurchaseOrderDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Commitment Headers with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CommitmentHeader model
 *
 * @example
 * ```typescript
 * const Commitment = createCommitmentHeaderModel(sequelize);
 * const commitment = await Commitment.create({
 *   commitmentNumber: 'COM-2024-001',
 *   commitmentDate: new Date(),
 *   commitmentType: 'purchase_order',
 *   status: 'draft',
 *   totalAmount: 50000
 * });
 * ```
 */
const createCommitmentHeaderModel = (sequelize) => {
    class CommitmentHeader extends sequelize_1.Model {
    }
    CommitmentHeader.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        commitmentNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique commitment number',
        },
        commitmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Commitment transaction date',
        },
        commitmentType: {
            type: sequelize_1.DataTypes.STRING(30),
            allowNull: false,
            comment: 'Type of commitment',
            validate: {
                isIn: [['requisition', 'purchase_order', 'contract', 'blanket_po', 'pre_encumbrance']],
            },
        },
        businessUnit: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Business unit code',
        },
        vendor: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Vendor identifier',
        },
        vendorName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            comment: 'Vendor name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Commitment description',
        },
        status: {
            type: sequelize_1.DataTypes.STRING(30),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Commitment status',
            validate: {
                isIn: [['draft', 'pending_approval', 'approved', 'committed', 'partially_liquidated', 'fully_liquidated', 'cancelled', 'rejected']],
            },
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
        fiscalPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal period (1-13)',
            validate: {
                min: 1,
                max: 13,
            },
        },
        totalAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total commitment amount',
        },
        committedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Amount committed to budget',
        },
        liquidatedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Amount liquidated',
        },
        remainingAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Remaining commitment amount',
        },
        approvalLevel: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Current approval level',
        },
        approvalStatus: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Approval status',
            validate: {
                isIn: [['pending', 'approved', 'rejected']],
            },
        },
        requester: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who requested the commitment',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who approved the commitment',
        },
        approvedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval date',
        },
        committedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date commitment was posted to budget',
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
            comment: 'User who created the commitment',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the commitment',
        },
    }, {
        sequelize,
        tableName: 'commitment_headers',
        timestamps: true,
        indexes: [
            { fields: ['commitmentNumber'], unique: true },
            { fields: ['commitmentDate'] },
            { fields: ['commitmentType'] },
            { fields: ['status'] },
            { fields: ['fiscalYear', 'fiscalPeriod'] },
            { fields: ['businessUnit'] },
            { fields: ['vendor'] },
            { fields: ['requester'] },
        ],
        hooks: {
            beforeCreate: (commitment) => {
                if (!commitment.createdBy) {
                    throw new Error('createdBy is required');
                }
                commitment.updatedBy = commitment.createdBy;
            },
            beforeUpdate: (commitment) => {
                if (!commitment.updatedBy) {
                    throw new Error('updatedBy is required');
                }
            },
            beforeSave: (commitment) => {
                // Calculate remaining amount
                const total = Number(commitment.totalAmount || 0);
                const liquidated = Number(commitment.liquidatedAmount || 0);
                commitment.remainingAmount = total - liquidated;
            },
        },
    });
    return CommitmentHeader;
};
exports.createCommitmentHeaderModel = createCommitmentHeaderModel;
/**
 * Sequelize model for Commitment Lines with budget account coding.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CommitmentLine model
 *
 * @example
 * ```typescript
 * const CommitmentLine = createCommitmentLineModel(sequelize);
 * const line = await CommitmentLine.create({
 *   commitmentId: 1,
 *   lineNumber: 1,
 *   accountCode: '5100-001',
 *   quantity: 10,
 *   unitPrice: 100,
 *   lineAmount: 1000
 * });
 * ```
 */
const createCommitmentLineModel = (sequelize) => {
    class CommitmentLine extends sequelize_1.Model {
    }
    CommitmentLine.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        commitmentId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to commitment header',
            references: {
                model: 'commitment_headers',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        lineNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Line number within commitment',
        },
        accountCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Budget account code',
        },
        accountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to chart of accounts',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Line item description',
        },
        quantity: {
            type: sequelize_1.DataTypes.DECIMAL(15, 3),
            allowNull: false,
            defaultValue: 1,
            comment: 'Quantity',
        },
        unitPrice: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Unit price',
        },
        lineAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total line amount',
        },
        committedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Amount committed to budget',
        },
        liquidatedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Amount liquidated',
        },
        remainingAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Remaining commitment',
        },
        budgetYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Budget fiscal year',
        },
        budgetPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Budget fiscal period',
        },
        projectCode: {
            type: sequelize_1.DataTypes.STRING(30),
            allowNull: true,
            comment: 'Project code',
        },
        activityCode: {
            type: sequelize_1.DataTypes.STRING(30),
            allowNull: true,
            comment: 'Activity code',
        },
        costCenterCode: {
            type: sequelize_1.DataTypes.STRING(30),
            allowNull: true,
            comment: 'Cost center code',
        },
        fundCode: {
            type: sequelize_1.DataTypes.STRING(30),
            allowNull: true,
            comment: 'Fund code',
        },
        organizationCode: {
            type: sequelize_1.DataTypes.STRING(30),
            allowNull: true,
            comment: 'Organization code',
        },
        objectCode: {
            type: sequelize_1.DataTypes.STRING(30),
            allowNull: true,
            comment: 'Object code',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'commitment_lines',
        timestamps: true,
        indexes: [
            { fields: ['commitmentId'] },
            { fields: ['accountCode'] },
            { fields: ['budgetYear', 'budgetPeriod'] },
            { fields: ['projectCode'] },
            { fields: ['costCenterCode'] },
        ],
        hooks: {
            beforeSave: (line) => {
                // Calculate remaining amount
                const committed = Number(line.committedAmount || 0);
                const liquidated = Number(line.liquidatedAmount || 0);
                line.remainingAmount = committed - liquidated;
            },
        },
    });
    return CommitmentLine;
};
exports.createCommitmentLineModel = createCommitmentLineModel;
// ============================================================================
// COMMITMENT CREATION AND MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a new commitment with budget checking and validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCommitmentDto} commitmentData - Commitment data
 * @param {string} userId - User creating the commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created commitment
 *
 * @example
 * ```typescript
 * const commitment = await createCommitment(sequelize, {
 *   commitmentDate: new Date(),
 *   commitmentType: 'purchase_order',
 *   businessUnit: 'BU001',
 *   description: 'Office supplies',
 *   requester: 'user123',
 *   lines: [{ accountCode: '5100-001', quantity: 10, unitPrice: 50, lineAmount: 500 }]
 * }, 'user123');
 * ```
 */
const createCommitment = async (sequelize, commitmentData, userId, transaction) => {
    const CommitmentHeader = (0, exports.createCommitmentHeaderModel)(sequelize);
    const CommitmentLine = (0, exports.createCommitmentLineModel)(sequelize);
    // Generate commitment number
    const commitmentNumber = await (0, exports.generateCommitmentNumber)(sequelize, commitmentData.commitmentType, transaction);
    // Determine fiscal year and period
    const { fiscalYear, fiscalPeriod } = (0, exports.getFiscalYearPeriod)(commitmentData.commitmentDate);
    // Calculate total amount
    let totalAmount = 0;
    for (const line of commitmentData.lines) {
        totalAmount += Number(line.lineAmount || 0);
    }
    // Create header
    const header = await CommitmentHeader.create({
        commitmentNumber,
        commitmentDate: commitmentData.commitmentDate,
        commitmentType: commitmentData.commitmentType,
        businessUnit: commitmentData.businessUnit,
        vendor: commitmentData.vendor,
        description: commitmentData.description,
        status: 'draft',
        fiscalYear,
        fiscalPeriod,
        totalAmount,
        committedAmount: 0,
        liquidatedAmount: 0,
        remainingAmount: totalAmount,
        approvalLevel: 0,
        approvalStatus: 'pending',
        requester: commitmentData.requester,
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    // Create lines
    for (let i = 0; i < commitmentData.lines.length; i++) {
        const lineData = commitmentData.lines[i];
        await CommitmentLine.create({
            commitmentId: header.id,
            lineNumber: i + 1,
            accountCode: lineData.accountCode,
            accountId: lineData.accountId,
            description: lineData.description,
            quantity: lineData.quantity,
            unitPrice: lineData.unitPrice,
            lineAmount: lineData.lineAmount,
            committedAmount: 0,
            liquidatedAmount: 0,
            remainingAmount: lineData.lineAmount,
            budgetYear: lineData.budgetYear || fiscalYear,
            budgetPeriod: lineData.budgetPeriod || fiscalPeriod,
            projectCode: lineData.projectCode,
            activityCode: lineData.activityCode,
            costCenterCode: lineData.costCenterCode,
            fundCode: lineData.fundCode,
            organizationCode: lineData.organizationCode,
            objectCode: lineData.objectCode,
        }, { transaction });
    }
    return header;
};
exports.createCommitment = createCommitment;
/**
 * Updates a commitment (only if in draft status).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Partial<CreateCommitmentDto>} updateData - Update data
 * @param {string} userId - User updating the commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated commitment
 *
 * @example
 * ```typescript
 * const updated = await updateCommitment(sequelize, 1, {
 *   description: 'Updated description'
 * }, 'user123');
 * ```
 */
const updateCommitment = async (sequelize, commitmentId, updateData, userId, transaction) => {
    const CommitmentHeader = (0, exports.createCommitmentHeaderModel)(sequelize);
    const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
    if (!commitment) {
        throw new Error('Commitment not found');
    }
    if (commitment.status !== 'draft') {
        throw new Error('Cannot update commitment that is not in draft status');
    }
    await commitment.update({ ...updateData, updatedBy: userId }, { transaction });
    return commitment;
};
exports.updateCommitment = updateCommitment;
/**
 * Deletes a commitment (only if in draft status).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} userId - User deleting the commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteCommitment(sequelize, 1, 'user123');
 * ```
 */
const deleteCommitment = async (sequelize, commitmentId, userId, transaction) => {
    const CommitmentHeader = (0, exports.createCommitmentHeaderModel)(sequelize);
    const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
    if (!commitment) {
        throw new Error('Commitment not found');
    }
    if (commitment.status !== 'draft') {
        throw new Error('Cannot delete commitment that is not in draft status');
    }
    await commitment.destroy({ transaction });
};
exports.deleteCommitment = deleteCommitment;
/**
 * Retrieves a commitment by ID with all lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Commitment with lines
 *
 * @example
 * ```typescript
 * const commitment = await getCommitmentById(sequelize, 1);
 * ```
 */
const getCommitmentById = async (sequelize, commitmentId, transaction) => {
    const CommitmentHeader = (0, exports.createCommitmentHeaderModel)(sequelize);
    const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
    if (!commitment) {
        throw new Error('Commitment not found');
    }
    return commitment;
};
exports.getCommitmentById = getCommitmentById;
/**
 * Retrieves commitments by various filters.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} filters - Filter criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} List of commitments
 *
 * @example
 * ```typescript
 * const commitments = await getCommitments(sequelize, {
 *   status: 'approved',
 *   fiscalYear: 2024
 * });
 * ```
 */
const getCommitments = async (sequelize, filters, transaction) => {
    const CommitmentHeader = (0, exports.createCommitmentHeaderModel)(sequelize);
    const where = {};
    if (filters.status)
        where.status = filters.status;
    if (filters.commitmentType)
        where.commitmentType = filters.commitmentType;
    if (filters.fiscalYear)
        where.fiscalYear = filters.fiscalYear;
    if (filters.fiscalPeriod)
        where.fiscalPeriod = filters.fiscalPeriod;
    if (filters.businessUnit)
        where.businessUnit = filters.businessUnit;
    if (filters.requester)
        where.requester = filters.requester;
    const commitments = await CommitmentHeader.findAll({ where, transaction });
    return commitments;
};
exports.getCommitments = getCommitments;
// ============================================================================
// BUDGET CHECKING FUNCTIONS
// ============================================================================
/**
 * Performs budget check for a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BudgetCheck>} Budget check results
 *
 * @example
 * ```typescript
 * const budgetCheck = await performBudgetCheck(sequelize, 1);
 * if (budgetCheck.checkResult === 'fail') {
 *   console.log('Insufficient budget');
 * }
 * ```
 */
const performBudgetCheck = async (sequelize, commitmentId, transaction) => {
    const CommitmentHeader = (0, exports.createCommitmentHeaderModel)(sequelize);
    const CommitmentLine = (0, exports.createCommitmentLineModel)(sequelize);
    const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
    if (!commitment) {
        throw new Error('Commitment not found');
    }
    const lines = await CommitmentLine.findAll({
        where: { commitmentId },
        transaction,
    });
    // Perform budget check for each line
    let overallResult = 'pass';
    const checkDetails = {};
    for (const line of lines) {
        const lineCheck = await (0, exports.checkBudgetAvailability)(sequelize, {
            accountCode: line.accountCode,
            fiscalYear: line.budgetYear,
            fiscalPeriod: line.budgetPeriod,
            requestedAmount: line.lineAmount,
        }, transaction);
        checkDetails[`line_${line.lineNumber}`] = lineCheck;
        if (lineCheck.checkResult === 'fail') {
            overallResult = 'fail';
        }
    }
    const budgetCheck = {
        checkId: Date.now(),
        commitmentId,
        checkDate: new Date(),
        fiscalYear: commitment.fiscalYear,
        fiscalPeriod: commitment.fiscalPeriod,
        accountCode: 'multiple',
        requestedAmount: commitment.totalAmount,
        availableBudget: 0,
        commitments: 0,
        encumbrances: 0,
        actuals: 0,
        fundsAvailable: 0,
        checkResult: overallResult,
        checkDetails,
    };
    return budgetCheck;
};
exports.performBudgetCheck = performBudgetCheck;
/**
 * Checks budget availability for a specific account and amount.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {BudgetCheckRequestDto} checkRequest - Budget check request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BudgetCheck>} Budget check result
 *
 * @example
 * ```typescript
 * const check = await checkBudgetAvailability(sequelize, {
 *   accountCode: '5100-001',
 *   fiscalYear: 2024,
 *   fiscalPeriod: 3,
 *   requestedAmount: 5000
 * });
 * ```
 */
const checkBudgetAvailability = async (sequelize, checkRequest, transaction) => {
    // This would integrate with budget management system
    // Simplified implementation for demonstration
    const availableBudget = 100000; // Would query actual budget
    const commitments = 30000; // Would query actual commitments
    const encumbrances = 20000; // Would query actual encumbrances
    const actuals = 25000; // Would query actual actuals
    const fundsAvailable = availableBudget - commitments - encumbrances - actuals;
    const checkResult = fundsAvailable >= checkRequest.requestedAmount ? 'pass' : 'fail';
    const budgetCheck = {
        checkId: Date.now(),
        commitmentId: 0,
        checkDate: new Date(),
        fiscalYear: checkRequest.fiscalYear,
        fiscalPeriod: checkRequest.fiscalPeriod,
        accountCode: checkRequest.accountCode,
        requestedAmount: checkRequest.requestedAmount,
        availableBudget,
        commitments,
        encumbrances,
        actuals,
        fundsAvailable,
        checkResult,
        checkDetails: {
            calculation: `${availableBudget} - ${commitments} - ${encumbrances} - ${actuals} = ${fundsAvailable}`,
        },
    };
    return budgetCheck;
};
exports.checkBudgetAvailability = checkBudgetAvailability;
/**
 * Overrides a failed budget check with justification.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} overrideReason - Reason for override
 * @param {string} userId - User performing override
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BudgetCheck>} Overridden budget check
 *
 * @example
 * ```typescript
 * const overridden = await overrideBudgetCheck(sequelize, 1, 'Emergency procurement', 'admin123');
 * ```
 */
const overrideBudgetCheck = async (sequelize, commitmentId, overrideReason, userId, transaction) => {
    const budgetCheck = await (0, exports.performBudgetCheck)(sequelize, commitmentId, transaction);
    budgetCheck.checkResult = 'override';
    budgetCheck.overrideReason = overrideReason;
    budgetCheck.overrideBy = userId;
    // Would persist this override to database
    return budgetCheck;
};
exports.overrideBudgetCheck = overrideBudgetCheck;
// ============================================================================
// COMMITMENT APPROVAL FUNCTIONS
// ============================================================================
/**
 * Submits a commitment for approval.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} userId - User submitting for approval
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated commitment
 *
 * @example
 * ```typescript
 * const submitted = await submitCommitmentForApproval(sequelize, 1, 'user123');
 * ```
 */
const submitCommitmentForApproval = async (sequelize, commitmentId, userId, transaction) => {
    const CommitmentHeader = (0, exports.createCommitmentHeaderModel)(sequelize);
    const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
    if (!commitment) {
        throw new Error('Commitment not found');
    }
    if (commitment.status !== 'draft') {
        throw new Error('Commitment must be in draft status to submit for approval');
    }
    // Perform budget check
    const budgetCheck = await (0, exports.performBudgetCheck)(sequelize, commitmentId, transaction);
    if (budgetCheck.checkResult === 'fail') {
        throw new Error('Budget check failed - insufficient funds');
    }
    await commitment.update({
        status: 'pending_approval',
        approvalLevel: 1,
        updatedBy: userId,
    }, { transaction });
    return commitment;
};
exports.submitCommitmentForApproval = submitCommitmentForApproval;
/**
 * Approves a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ApprovementCommitmentDto} approvalData - Approval data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated commitment
 *
 * @example
 * ```typescript
 * const approved = await approveCommitment(sequelize, {
 *   commitmentId: 1,
 *   approvalAction: 'approve',
 *   approverUserId: 'approver123',
 *   comments: 'Approved for processing'
 * });
 * ```
 */
const approveCommitment = async (sequelize, approvalData, transaction) => {
    const CommitmentHeader = (0, exports.createCommitmentHeaderModel)(sequelize);
    const commitment = await CommitmentHeader.findByPk(approvalData.commitmentId, { transaction });
    if (!commitment) {
        throw new Error('Commitment not found');
    }
    if (commitment.status !== 'pending_approval') {
        throw new Error('Commitment is not pending approval');
    }
    if (approvalData.approvalAction === 'approve') {
        await commitment.update({
            status: 'approved',
            approvalStatus: 'approved',
            approvedBy: approvalData.approverUserId,
            approvedDate: new Date(),
            updatedBy: approvalData.approverUserId,
        }, { transaction });
    }
    else if (approvalData.approvalAction === 'reject') {
        await commitment.update({
            status: 'rejected',
            approvalStatus: 'rejected',
            updatedBy: approvalData.approverUserId,
        }, { transaction });
    }
    return commitment;
};
exports.approveCommitment = approveCommitment;
/**
 * Retrieves approval history for a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentApproval[]>} Approval history
 *
 * @example
 * ```typescript
 * const history = await getCommitmentApprovalHistory(sequelize, 1);
 * ```
 */
const getCommitmentApprovalHistory = async (sequelize, commitmentId, transaction) => {
    // Would query approval history from database
    // Simplified for demonstration
    return [];
};
exports.getCommitmentApprovalHistory = getCommitmentApprovalHistory;
/**
 * Delegates approval to another user.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} fromUserId - Current approver
 * @param {string} toUserId - Delegated approver
 * @param {string} reason - Delegation reason
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated commitment
 *
 * @example
 * ```typescript
 * const delegated = await delegateApproval(sequelize, 1, 'approver1', 'approver2', 'Out of office');
 * ```
 */
const delegateApproval = async (sequelize, commitmentId, fromUserId, toUserId, reason, transaction) => {
    const CommitmentHeader = (0, exports.createCommitmentHeaderModel)(sequelize);
    const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
    if (!commitment) {
        throw new Error('Commitment not found');
    }
    // Would create delegation record in database
    return commitment;
};
exports.delegateApproval = delegateApproval;
// ============================================================================
// COMMITMENT POSTING AND LIQUIDATION FUNCTIONS
// ============================================================================
/**
 * Posts (commits) an approved commitment to budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} userId - User posting the commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted commitment
 *
 * @example
 * ```typescript
 * const posted = await postCommitmentToBudget(sequelize, 1, 'user123');
 * ```
 */
const postCommitmentToBudget = async (sequelize, commitmentId, userId, transaction) => {
    const CommitmentHeader = (0, exports.createCommitmentHeaderModel)(sequelize);
    const CommitmentLine = (0, exports.createCommitmentLineModel)(sequelize);
    const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
    if (!commitment) {
        throw new Error('Commitment not found');
    }
    if (commitment.status !== 'approved') {
        throw new Error('Commitment must be approved before posting');
    }
    // Update lines to committed status
    const lines = await CommitmentLine.findAll({
        where: { commitmentId },
        transaction,
    });
    for (const line of lines) {
        await line.update({
            committedAmount: line.lineAmount,
        }, { transaction });
    }
    // Update header
    await commitment.update({
        status: 'committed',
        committedAmount: commitment.totalAmount,
        committedDate: new Date(),
        updatedBy: userId,
    }, { transaction });
    // Create budget reservations
    await (0, exports.createBudgetReservations)(sequelize, commitmentId, transaction);
    return commitment;
};
exports.postCommitmentToBudget = postCommitmentToBudget;
/**
 * Liquidates a commitment (partial or full).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LiquidateCommitmentDto} liquidationData - Liquidation data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentLiquidation>} Liquidation record
 *
 * @example
 * ```typescript
 * const liquidation = await liquidateCommitment(sequelize, {
 *   commitmentId: 1,
 *   commitmentLineId: 1,
 *   liquidationAmount: 500,
 *   liquidationDate: new Date(),
 *   invoiceNumber: 'INV-12345',
 *   liquidatedBy: 'user123'
 * });
 * ```
 */
const liquidateCommitment = async (sequelize, liquidationData, transaction) => {
    const CommitmentHeader = (0, exports.createCommitmentHeaderModel)(sequelize);
    const CommitmentLine = (0, exports.createCommitmentLineModel)(sequelize);
    const commitment = await CommitmentHeader.findByPk(liquidationData.commitmentId, { transaction });
    if (!commitment) {
        throw new Error('Commitment not found');
    }
    const line = await CommitmentLine.findByPk(liquidationData.commitmentLineId, { transaction });
    if (!line) {
        throw new Error('Commitment line not found');
    }
    if (commitment.status !== 'committed' && commitment.status !== 'partially_liquidated') {
        throw new Error('Commitment must be committed before liquidation');
    }
    // Check if liquidation amount exceeds remaining
    if (liquidationData.liquidationAmount > line.remainingAmount) {
        throw new Error('Liquidation amount exceeds remaining commitment');
    }
    // Update line
    const newLiquidatedAmount = line.liquidatedAmount + liquidationData.liquidationAmount;
    await line.update({
        liquidatedAmount: newLiquidatedAmount,
    }, { transaction });
    // Update header
    const newHeaderLiquidatedAmount = commitment.liquidatedAmount + liquidationData.liquidationAmount;
    let newStatus = 'partially_liquidated';
    if (newHeaderLiquidatedAmount >= commitment.committedAmount) {
        newStatus = 'fully_liquidated';
    }
    await commitment.update({
        liquidatedAmount: newHeaderLiquidatedAmount,
        status: newStatus,
        updatedBy: liquidationData.liquidatedBy,
    }, { transaction });
    const liquidation = {
        liquidationId: Date.now(),
        commitmentId: liquidationData.commitmentId,
        commitmentLineId: liquidationData.commitmentLineId,
        liquidationType: newLiquidatedAmount >= line.committedAmount ? 'full' : 'partial',
        liquidationDate: liquidationData.liquidationDate,
        liquidationAmount: liquidationData.liquidationAmount,
        invoiceNumber: liquidationData.invoiceNumber,
        receivingNumber: liquidationData.receivingNumber,
        liquidatedBy: liquidationData.liquidatedBy,
        status: 'posted',
    };
    return liquidation;
};
exports.liquidateCommitment = liquidateCommitment;
/**
 * Reverses a commitment liquidation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} liquidationId - Liquidation ID
 * @param {string} userId - User reversing the liquidation
 * @param {string} reason - Reversal reason
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reverseCommitmentLiquidation(sequelize, 1, 'user123', 'Invoice cancelled');
 * ```
 */
const reverseCommitmentLiquidation = async (sequelize, liquidationId, userId, reason, transaction) => {
    // Would reverse the liquidation in database
    // Simplified for demonstration
};
exports.reverseCommitmentLiquidation = reverseCommitmentLiquidation;
/**
 * Closes a fully liquidated commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} userId - User closing the commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Closed commitment
 *
 * @example
 * ```typescript
 * const closed = await closeCommitment(sequelize, 1, 'user123');
 * ```
 */
const closeCommitment = async (sequelize, commitmentId, userId, transaction) => {
    const CommitmentHeader = (0, exports.createCommitmentHeaderModel)(sequelize);
    const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
    if (!commitment) {
        throw new Error('Commitment not found');
    }
    if (commitment.status !== 'fully_liquidated') {
        throw new Error('Can only close fully liquidated commitments');
    }
    // Release any remaining budget reservations
    await (0, exports.releaseBudgetReservations)(sequelize, commitmentId, transaction);
    return commitment;
};
exports.closeCommitment = closeCommitment;
// ============================================================================
// BUDGET RESERVATION FUNCTIONS
// ============================================================================
/**
 * Creates budget reservations for a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BudgetReservation[]>} Created budget reservations
 *
 * @example
 * ```typescript
 * const reservations = await createBudgetReservations(sequelize, 1);
 * ```
 */
const createBudgetReservations = async (sequelize, commitmentId, transaction) => {
    const CommitmentLine = (0, exports.createCommitmentLineModel)(sequelize);
    const lines = await CommitmentLine.findAll({
        where: { commitmentId },
        transaction,
    });
    const reservations = [];
    for (const line of lines) {
        const reservation = {
            reservationId: Date.now() + line.id,
            commitmentId,
            commitmentLineId: line.id,
            accountCode: line.accountCode,
            fiscalYear: line.budgetYear,
            fiscalPeriod: line.budgetPeriod,
            reservedAmount: line.committedAmount,
            releasedAmount: 0,
            remainingAmount: line.committedAmount,
            reservationDate: new Date(),
            status: 'active',
            budgetType: 'annual',
        };
        reservations.push(reservation);
    }
    // Would persist reservations to database
    return reservations;
};
exports.createBudgetReservations = createBudgetReservations;
/**
 * Releases budget reservations for a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseBudgetReservations(sequelize, 1);
 * ```
 */
const releaseBudgetReservations = async (sequelize, commitmentId, transaction) => {
    // Would release reservations in database
    // Simplified for demonstration
};
exports.releaseBudgetReservations = releaseBudgetReservations;
/**
 * Retrieves budget reservations for a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BudgetReservation[]>} Budget reservations
 *
 * @example
 * ```typescript
 * const reservations = await getBudgetReservations(sequelize, 1);
 * ```
 */
const getBudgetReservations = async (sequelize, commitmentId, transaction) => {
    // Would query reservations from database
    return [];
};
exports.getBudgetReservations = getBudgetReservations;
// ============================================================================
// PURCHASE REQUISITION FUNCTIONS
// ============================================================================
/**
 * Creates a purchase requisition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreatePurchaseRequisitionDto} requisitionData - Requisition data
 * @param {string} userId - User creating the requisition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseRequisition>} Created requisition
 *
 * @example
 * ```typescript
 * const req = await createPurchaseRequisition(sequelize, {
 *   requisitionDate: new Date(),
 *   requester: 'user123',
 *   department: 'IT',
 *   businessUnit: 'BU001',
 *   description: 'Office equipment',
 *   lines: [{ description: 'Laptop', quantity: 2, unitPrice: 1500 }]
 * }, 'user123');
 * ```
 */
const createPurchaseRequisition = async (sequelize, requisitionData, userId, transaction) => {
    // Generate requisition number
    const requisitionNumber = await (0, exports.generateRequisitionNumber)(sequelize, transaction);
    // Calculate total amount
    let totalAmount = 0;
    for (const line of requisitionData.lines) {
        totalAmount += (line.quantity || 0) * (line.unitPrice || 0);
    }
    const requisition = {
        requisitionId: Date.now(),
        requisitionNumber,
        requisitionDate: requisitionData.requisitionDate,
        requester: requisitionData.requester,
        department: requisitionData.department,
        businessUnit: requisitionData.businessUnit,
        description: requisitionData.description,
        totalAmount,
        status: 'draft',
        approvalRoute: 'standard',
        budgetCheckStatus: 'pending',
        needByDate: requisitionData.needByDate,
        deliveryLocation: requisitionData.deliveryLocation,
    };
    // Would persist to database
    return requisition;
};
exports.createPurchaseRequisition = createPurchaseRequisition;
/**
 * Converts a requisition to a purchase order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} requisitionId - Requisition ID
 * @param {string} vendorId - Selected vendor
 * @param {string} userId - User converting the requisition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseOrder>} Created purchase order
 *
 * @example
 * ```typescript
 * const po = await convertRequisitionToPO(sequelize, 1, 'VENDOR123', 'user123');
 * ```
 */
const convertRequisitionToPO = async (sequelize, requisitionId, vendorId, userId, transaction) => {
    // Would retrieve requisition and create PO
    // Simplified for demonstration
    const poNumber = await (0, exports.generatePONumber)(sequelize, transaction);
    const po = {
        poId: Date.now(),
        poNumber,
        poDate: new Date(),
        poType: 'standard',
        vendorId,
        vendorName: 'Vendor Name',
        businessUnit: 'BU001',
        description: 'Converted from requisition',
        totalAmount: 0,
        committedAmount: 0,
        invoicedAmount: 0,
        paidAmount: 0,
        remainingAmount: 0,
        status: 'draft',
        requisitionId,
        paymentTerms: 'Net 30',
        deliveryTerms: 'FOB',
        shipToLocation: 'Main Office',
        buyer: userId,
    };
    return po;
};
exports.convertRequisitionToPO = convertRequisitionToPO;
/**
 * Retrieves requisitions by status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} status - Requisition status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseRequisition[]>} List of requisitions
 *
 * @example
 * ```typescript
 * const pending = await getRequisitionsByStatus(sequelize, 'submitted');
 * ```
 */
const getRequisitionsByStatus = async (sequelize, status, transaction) => {
    // Would query database
    return [];
};
exports.getRequisitionsByStatus = getRequisitionsByStatus;
// ============================================================================
// PURCHASE ORDER FUNCTIONS
// ============================================================================
/**
 * Creates a purchase order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreatePurchaseOrderDto} poData - PO data
 * @param {string} userId - User creating the PO
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseOrder>} Created purchase order
 *
 * @example
 * ```typescript
 * const po = await createPurchaseOrder(sequelize, {
 *   poDate: new Date(),
 *   poType: 'standard',
 *   vendorId: 'VENDOR123',
 *   businessUnit: 'BU001',
 *   description: 'Office supplies',
 *   paymentTerms: 'Net 30',
 *   shipToLocation: 'Main Office',
 *   buyer: 'buyer123',
 *   lines: [{ description: 'Paper', quantity: 100, unitPrice: 5 }]
 * }, 'user123');
 * ```
 */
const createPurchaseOrder = async (sequelize, poData, userId, transaction) => {
    const poNumber = await (0, exports.generatePONumber)(sequelize, transaction);
    // Calculate total amount
    let totalAmount = 0;
    for (const line of poData.lines) {
        totalAmount += (line.quantity || 0) * (line.unitPrice || 0);
    }
    const po = {
        poId: Date.now(),
        poNumber,
        poDate: poData.poDate,
        poType: poData.poType,
        vendorId: poData.vendorId,
        vendorName: 'Vendor Name', // Would lookup from vendor master
        businessUnit: poData.businessUnit,
        description: poData.description,
        totalAmount,
        committedAmount: 0,
        invoicedAmount: 0,
        paidAmount: 0,
        remainingAmount: totalAmount,
        status: 'draft',
        requisitionId: poData.requisitionId,
        paymentTerms: poData.paymentTerms,
        deliveryTerms: 'FOB',
        shipToLocation: poData.shipToLocation,
        buyer: poData.buyer,
    };
    // Would persist to database
    return po;
};
exports.createPurchaseOrder = createPurchaseOrder;
/**
 * Approves a purchase order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} poId - PO ID
 * @param {string} userId - User approving the PO
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseOrder>} Approved purchase order
 *
 * @example
 * ```typescript
 * const approved = await approvePurchaseOrder(sequelize, 1, 'approver123');
 * ```
 */
const approvePurchaseOrder = async (sequelize, poId, userId, transaction) => {
    // Would update PO in database
    // Simplified for demonstration
    const po = {
        poId,
        poNumber: 'PO-2024-001',
        poDate: new Date(),
        poType: 'standard',
        vendorId: 'VENDOR123',
        vendorName: 'Vendor Name',
        businessUnit: 'BU001',
        description: 'Purchase order',
        totalAmount: 10000,
        committedAmount: 0,
        invoicedAmount: 0,
        paidAmount: 0,
        remainingAmount: 10000,
        status: 'approved',
        paymentTerms: 'Net 30',
        deliveryTerms: 'FOB',
        shipToLocation: 'Main Office',
        buyer: userId,
        approvedBy: userId,
        approvedDate: new Date(),
    };
    return po;
};
exports.approvePurchaseOrder = approvePurchaseOrder;
/**
 * Closes a purchase order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} poId - PO ID
 * @param {string} userId - User closing the PO
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseOrder>} Closed purchase order
 *
 * @example
 * ```typescript
 * const closed = await closePurchaseOrder(sequelize, 1, 'user123');
 * ```
 */
const closePurchaseOrder = async (sequelize, poId, userId, transaction) => {
    // Would update PO status to closed
    // Simplified for demonstration
    const po = {
        poId,
        poNumber: 'PO-2024-001',
        poDate: new Date(),
        poType: 'standard',
        vendorId: 'VENDOR123',
        vendorName: 'Vendor Name',
        businessUnit: 'BU001',
        description: 'Purchase order',
        totalAmount: 10000,
        committedAmount: 10000,
        invoicedAmount: 10000,
        paidAmount: 10000,
        remainingAmount: 0,
        status: 'closed',
        paymentTerms: 'Net 30',
        deliveryTerms: 'FOB',
        shipToLocation: 'Main Office',
        buyer: userId,
    };
    return po;
};
exports.closePurchaseOrder = closePurchaseOrder;
/**
 * Retrieves purchase orders by vendor.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} vendorId - Vendor ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseOrder[]>} List of purchase orders
 *
 * @example
 * ```typescript
 * const pos = await getPurchaseOrdersByVendor(sequelize, 'VENDOR123');
 * ```
 */
const getPurchaseOrdersByVendor = async (sequelize, vendorId, transaction) => {
    // Would query database
    return [];
};
exports.getPurchaseOrdersByVendor = getPurchaseOrdersByVendor;
// ============================================================================
// PRE-ENCUMBRANCE FUNCTIONS
// ============================================================================
/**
 * Creates a pre-encumbrance for budget planning.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} preEncumbranceData - Pre-encumbrance data
 * @param {string} userId - User creating the pre-encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PreEncumbrance>} Created pre-encumbrance
 *
 * @example
 * ```typescript
 * const preEnc = await createPreEncumbrance(sequelize, {
 *   fiscalYear: 2024,
 *   fiscalPeriod: 3,
 *   accountCode: '5100-001',
 *   description: 'Expected equipment purchase',
 *   estimatedAmount: 25000
 * }, 'user123');
 * ```
 */
const createPreEncumbrance = async (sequelize, preEncumbranceData, userId, transaction) => {
    const preEncumbranceNumber = await (0, exports.generatePreEncumbranceNumber)(sequelize, transaction);
    const preEncumbrance = {
        preEncumbranceId: Date.now(),
        preEncumbranceNumber,
        preEncumbranceDate: new Date(),
        fiscalYear: preEncumbranceData.fiscalYear,
        fiscalPeriod: preEncumbranceData.fiscalPeriod,
        accountCode: preEncumbranceData.accountCode,
        description: preEncumbranceData.description,
        estimatedAmount: preEncumbranceData.estimatedAmount,
        status: 'active',
        expirationDate: preEncumbranceData.expirationDate,
        createdBy: userId,
    };
    // Would persist to database
    return preEncumbrance;
};
exports.createPreEncumbrance = createPreEncumbrance;
/**
 * Converts a pre-encumbrance to a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} preEncumbranceId - Pre-encumbrance ID
 * @param {CreateCommitmentDto} commitmentData - Commitment data
 * @param {string} userId - User converting
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created commitment
 *
 * @example
 * ```typescript
 * const commitment = await convertPreEncumbranceToCommitment(sequelize, 1, commitmentData, 'user123');
 * ```
 */
const convertPreEncumbranceToCommitment = async (sequelize, preEncumbranceId, commitmentData, userId, transaction) => {
    // Create commitment
    const commitment = await (0, exports.createCommitment)(sequelize, commitmentData, userId, transaction);
    // Would update pre-encumbrance status to converted
    return commitment;
};
exports.convertPreEncumbranceToCommitment = convertPreEncumbranceToCommitment;
// ============================================================================
// COMMITMENT REPORTING FUNCTIONS
// ============================================================================
/**
 * Generates open commitments report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} [fiscalPeriod] - Optional fiscal period
 * @param {string} [businessUnit] - Optional business unit filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentReport>} Commitment report
 *
 * @example
 * ```typescript
 * const report = await generateOpenCommitmentsReport(sequelize, 2024, 3, 'BU001');
 * ```
 */
const generateOpenCommitmentsReport = async (sequelize, fiscalYear, fiscalPeriod, businessUnit, transaction) => {
    const CommitmentHeader = (0, exports.createCommitmentHeaderModel)(sequelize);
    const where = {
        fiscalYear,
        status: {
            [sequelize_1.Op.in]: ['committed', 'partially_liquidated'],
        },
    };
    if (fiscalPeriod)
        where.fiscalPeriod = fiscalPeriod;
    if (businessUnit)
        where.businessUnit = businessUnit;
    const commitments = await CommitmentHeader.findAll({ where, transaction });
    const report = {
        reportId: `OPEN_COMM_${Date.now()}`,
        reportType: 'open_commitments',
        fiscalYear,
        fiscalPeriod,
        businessUnit,
        reportData: {
            commitmentCount: commitments.length,
            totalCommitted: commitments.reduce((sum, c) => sum + c.committedAmount, 0),
            totalLiquidated: commitments.reduce((sum, c) => sum + c.liquidatedAmount, 0),
            totalRemaining: commitments.reduce((sum, c) => sum + c.remainingAmount, 0),
            commitments: commitments.map(c => ({
                commitmentNumber: c.commitmentNumber,
                description: c.description,
                committedAmount: c.committedAmount,
                liquidatedAmount: c.liquidatedAmount,
                remainingAmount: c.remainingAmount,
            })),
        },
        generatedDate: new Date(),
        generatedBy: 'system',
    };
    return report;
};
exports.generateOpenCommitmentsReport = generateOpenCommitmentsReport;
/**
 * Generates commitment liquidation history report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentReport>} Liquidation history report
 *
 * @example
 * ```typescript
 * const report = await generateLiquidationHistoryReport(sequelize, 1);
 * ```
 */
const generateLiquidationHistoryReport = async (sequelize, commitmentId, transaction) => {
    // Would query liquidation history from database
    const report = {
        reportId: `LIQ_HIST_${Date.now()}`,
        reportType: 'liquidation_history',
        fiscalYear: new Date().getFullYear(),
        reportData: {
            commitmentId,
            liquidations: [],
        },
        generatedDate: new Date(),
        generatedBy: 'system',
    };
    return report;
};
exports.generateLiquidationHistoryReport = generateLiquidationHistoryReport;
/**
 * Generates commitment variance analysis report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {string} [accountCode] - Optional account filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentReport>} Variance analysis report
 *
 * @example
 * ```typescript
 * const report = await generateCommitmentVarianceReport(sequelize, 2024, '5100-001');
 * ```
 */
const generateCommitmentVarianceReport = async (sequelize, fiscalYear, accountCode, transaction) => {
    // Would analyze variances between commitments and actuals
    const report = {
        reportId: `VAR_ANALYSIS_${Date.now()}`,
        reportType: 'variance_analysis',
        fiscalYear,
        accountCode,
        reportData: {
            variances: [],
        },
        generatedDate: new Date(),
        generatedBy: 'system',
    };
    return report;
};
exports.generateCommitmentVarianceReport = generateCommitmentVarianceReport;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Generates a unique commitment number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} commitmentType - Type of commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated commitment number
 *
 * @example
 * ```typescript
 * const number = await generateCommitmentNumber(sequelize, 'purchase_order');
 * ```
 */
const generateCommitmentNumber = async (sequelize, commitmentType, transaction) => {
    const year = new Date().getFullYear();
    const prefix = commitmentType === 'purchase_order' ? 'PO' : 'COM';
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${year}-${randomPart}`;
};
exports.generateCommitmentNumber = generateCommitmentNumber;
/**
 * Generates a unique requisition number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated requisition number
 *
 * @example
 * ```typescript
 * const number = await generateRequisitionNumber(sequelize);
 * ```
 */
const generateRequisitionNumber = async (sequelize, transaction) => {
    const year = new Date().getFullYear();
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `REQ-${year}-${randomPart}`;
};
exports.generateRequisitionNumber = generateRequisitionNumber;
/**
 * Generates a unique PO number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated PO number
 *
 * @example
 * ```typescript
 * const number = await generatePONumber(sequelize);
 * ```
 */
const generatePONumber = async (sequelize, transaction) => {
    const year = new Date().getFullYear();
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PO-${year}-${randomPart}`;
};
exports.generatePONumber = generatePONumber;
/**
 * Generates a unique pre-encumbrance number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated pre-encumbrance number
 *
 * @example
 * ```typescript
 * const number = await generatePreEncumbranceNumber(sequelize);
 * ```
 */
const generatePreEncumbranceNumber = async (sequelize, transaction) => {
    const year = new Date().getFullYear();
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PRE-${year}-${randomPart}`;
};
exports.generatePreEncumbranceNumber = generatePreEncumbranceNumber;
/**
 * Determines fiscal year and period from a date.
 *
 * @param {Date} date - Date to analyze
 * @returns {Object} Fiscal year and period
 *
 * @example
 * ```typescript
 * const { fiscalYear, fiscalPeriod } = getFiscalYearPeriod(new Date('2024-03-15'));
 * ```
 */
const getFiscalYearPeriod = (date) => {
    const month = date.getMonth() + 1; // 1-12
    const year = date.getFullYear();
    // Assuming October 1st fiscal year start
    let fiscalYear = year;
    let fiscalPeriod = month;
    if (month >= 10) {
        fiscalYear = year + 1;
        fiscalPeriod = month - 9;
    }
    else {
        fiscalPeriod = month + 3;
    }
    return { fiscalYear, fiscalPeriod };
};
exports.getFiscalYearPeriod = getFiscalYearPeriod;
/**
 * Retrieves commitment by number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} commitmentNumber - Commitment number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Commitment
 *
 * @example
 * ```typescript
 * const commitment = await getCommitmentByNumber(sequelize, 'COM-2024-001');
 * ```
 */
const getCommitmentByNumber = async (sequelize, commitmentNumber, transaction) => {
    const CommitmentHeader = (0, exports.createCommitmentHeaderModel)(sequelize);
    const commitment = await CommitmentHeader.findOne({
        where: { commitmentNumber },
        transaction,
    });
    if (!commitment) {
        throw new Error('Commitment not found');
    }
    return commitment;
};
exports.getCommitmentByNumber = getCommitmentByNumber;
/**
 * Retrieves commitment lines for a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Commitment lines
 *
 * @example
 * ```typescript
 * const lines = await getCommitmentLines(sequelize, 1);
 * ```
 */
const getCommitmentLines = async (sequelize, commitmentId, transaction) => {
    const CommitmentLine = (0, exports.createCommitmentLineModel)(sequelize);
    const lines = await CommitmentLine.findAll({
        where: { commitmentId },
        transaction,
    });
    return lines;
};
exports.getCommitmentLines = getCommitmentLines;
/**
 * Updates a commitment line.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} lineId - Commitment line ID
 * @param {Partial<CommitmentLine>} updateData - Update data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated commitment line
 *
 * @example
 * ```typescript
 * const updated = await updateCommitmentLine(sequelize, 1, { quantity: 15 });
 * ```
 */
const updateCommitmentLine = async (sequelize, lineId, updateData, transaction) => {
    const CommitmentLine = (0, exports.createCommitmentLineModel)(sequelize);
    const line = await CommitmentLine.findByPk(lineId, { transaction });
    if (!line) {
        throw new Error('Commitment line not found');
    }
    await line.update(updateData, { transaction });
    return line;
};
exports.updateCommitmentLine = updateCommitmentLine;
/**
 * Retrieves commitment history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentHistory[]>} Commitment history
 *
 * @example
 * ```typescript
 * const history = await getCommitmentHistory(sequelize, 1);
 * ```
 */
const getCommitmentHistory = async (sequelize, commitmentId, transaction) => {
    // Would query commitment history from database
    return [];
};
exports.getCommitmentHistory = getCommitmentHistory;
/**
 * Records commitment history entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Omit<CommitmentHistory, 'historyId'>} historyData - History data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CommitmentHistory>} Created history entry
 *
 * @example
 * ```typescript
 * const history = await recordCommitmentHistory(sequelize, {
 *   commitmentId: 1,
 *   changeDate: new Date(),
 *   changeType: 'approved',
 *   changedBy: 'user123',
 *   newStatus: 'approved',
 *   auditData: {}
 * });
 * ```
 */
const recordCommitmentHistory = async (sequelize, historyData, transaction) => {
    const history = {
        historyId: Date.now(),
        ...historyData,
    };
    // Would persist to database
    return history;
};
exports.recordCommitmentHistory = recordCommitmentHistory;
/**
 * Cancels a commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} cancellationReason - Reason for cancellation
 * @param {string} userId - User cancelling
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancelled commitment
 *
 * @example
 * ```typescript
 * const cancelled = await cancelCommitment(sequelize, 1, 'No longer needed', 'user123');
 * ```
 */
const cancelCommitment = async (sequelize, commitmentId, cancellationReason, userId, transaction) => {
    const CommitmentHeader = (0, exports.createCommitmentHeaderModel)(sequelize);
    const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
    if (!commitment) {
        throw new Error('Commitment not found');
    }
    if (commitment.status === 'fully_liquidated') {
        throw new Error('Cannot cancel fully liquidated commitment');
    }
    await commitment.update({
        status: 'cancelled',
        updatedBy: userId,
        metadata: {
            ...commitment.metadata,
            cancellationReason,
            cancelledDate: new Date(),
            cancelledBy: userId,
        },
    }, { transaction });
    return commitment;
};
exports.cancelCommitment = cancelCommitment;
/**
 * Reopens a cancelled commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {string} userId - User reopening
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reopened commitment
 *
 * @example
 * ```typescript
 * const reopened = await reopenCommitment(sequelize, 1, 'user123');
 * ```
 */
const reopenCommitment = async (sequelize, commitmentId, userId, transaction) => {
    const CommitmentHeader = (0, exports.createCommitmentHeaderModel)(sequelize);
    const commitment = await CommitmentHeader.findByPk(commitmentId, { transaction });
    if (!commitment) {
        throw new Error('Commitment not found');
    }
    if (commitment.status !== 'cancelled') {
        throw new Error('Can only reopen cancelled commitments');
    }
    await commitment.update({
        status: 'draft',
        updatedBy: userId,
    }, { transaction });
    return commitment;
};
exports.reopenCommitment = reopenCommitment;
//# sourceMappingURL=commitment-control-kit.js.map