"use strict";
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentApplication = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const contract_types_1 = require("../types/contract.types");
const construction_contract_model_1 = require("./construction-contract.model");
let PaymentApplication = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'payment_applications',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _applicationNumber_decorators;
    let _applicationNumber_initializers = [];
    let _applicationNumber_extraInitializers = [];
    let _periodStartDate_decorators;
    let _periodStartDate_initializers = [];
    let _periodStartDate_extraInitializers = [];
    let _periodEndDate_decorators;
    let _periodEndDate_initializers = [];
    let _periodEndDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _scheduledValue_decorators;
    let _scheduledValue_initializers = [];
    let _scheduledValue_extraInitializers = [];
    let _workCompleted_decorators;
    let _workCompleted_initializers = [];
    let _workCompleted_extraInitializers = [];
    let _storedMaterials_decorators;
    let _storedMaterials_initializers = [];
    let _storedMaterials_extraInitializers = [];
    let _totalCompleted_decorators;
    let _totalCompleted_initializers = [];
    let _totalCompleted_extraInitializers = [];
    let _previouslyPaid_decorators;
    let _previouslyPaid_initializers = [];
    let _previouslyPaid_extraInitializers = [];
    let _currentPaymentDue_decorators;
    let _currentPaymentDue_initializers = [];
    let _currentPaymentDue_extraInitializers = [];
    let _retainageWithheld_decorators;
    let _retainageWithheld_initializers = [];
    let _retainageWithheld_extraInitializers = [];
    let _netPayment_decorators;
    let _netPayment_initializers = [];
    let _netPayment_extraInitializers = [];
    let _percentComplete_decorators;
    let _percentComplete_initializers = [];
    let _percentComplete_extraInitializers = [];
    let _submittedDate_decorators;
    let _submittedDate_initializers = [];
    let _submittedDate_extraInitializers = [];
    let _reviewedDate_decorators;
    let _reviewedDate_initializers = [];
    let _reviewedDate_extraInitializers = [];
    let _approvedDate_decorators;
    let _approvedDate_initializers = [];
    let _approvedDate_extraInitializers = [];
    let _paidDate_decorators;
    let _paidDate_initializers = [];
    let _paidDate_extraInitializers = [];
    let _reviewedBy_decorators;
    let _reviewedBy_initializers = [];
    let _reviewedBy_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _contract_decorators;
    let _contract_initializers = [];
    let _contract_extraInitializers = [];
    var PaymentApplication = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.contractId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
            this.applicationNumber = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _applicationNumber_initializers, void 0));
            this.periodStartDate = (__runInitializers(this, _applicationNumber_extraInitializers), __runInitializers(this, _periodStartDate_initializers, void 0));
            this.periodEndDate = (__runInitializers(this, _periodStartDate_extraInitializers), __runInitializers(this, _periodEndDate_initializers, void 0));
            this.status = (__runInitializers(this, _periodEndDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.scheduledValue = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _scheduledValue_initializers, void 0));
            this.workCompleted = (__runInitializers(this, _scheduledValue_extraInitializers), __runInitializers(this, _workCompleted_initializers, void 0));
            this.storedMaterials = (__runInitializers(this, _workCompleted_extraInitializers), __runInitializers(this, _storedMaterials_initializers, void 0));
            this.totalCompleted = (__runInitializers(this, _storedMaterials_extraInitializers), __runInitializers(this, _totalCompleted_initializers, void 0));
            this.previouslyPaid = (__runInitializers(this, _totalCompleted_extraInitializers), __runInitializers(this, _previouslyPaid_initializers, void 0));
            this.currentPaymentDue = (__runInitializers(this, _previouslyPaid_extraInitializers), __runInitializers(this, _currentPaymentDue_initializers, void 0));
            this.retainageWithheld = (__runInitializers(this, _currentPaymentDue_extraInitializers), __runInitializers(this, _retainageWithheld_initializers, void 0));
            this.netPayment = (__runInitializers(this, _retainageWithheld_extraInitializers), __runInitializers(this, _netPayment_initializers, void 0));
            this.percentComplete = (__runInitializers(this, _netPayment_extraInitializers), __runInitializers(this, _percentComplete_initializers, void 0));
            this.submittedDate = (__runInitializers(this, _percentComplete_extraInitializers), __runInitializers(this, _submittedDate_initializers, void 0));
            this.reviewedDate = (__runInitializers(this, _submittedDate_extraInitializers), __runInitializers(this, _reviewedDate_initializers, void 0));
            this.approvedDate = (__runInitializers(this, _reviewedDate_extraInitializers), __runInitializers(this, _approvedDate_initializers, void 0));
            this.paidDate = (__runInitializers(this, _approvedDate_extraInitializers), __runInitializers(this, _paidDate_initializers, void 0));
            this.reviewedBy = (__runInitializers(this, _paidDate_extraInitializers), __runInitializers(this, _reviewedBy_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _reviewedBy_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.notes = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.attachments = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.createdBy = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.contract = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _contract_initializers, void 0));
            __runInitializers(this, _contract_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PaymentApplication");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _contractId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => construction_contract_model_1.ConstructionContract), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _applicationNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _periodStartDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _periodEndDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(contract_types_1.PaymentStatus.DRAFT), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(contract_types_1.PaymentStatus)),
            })];
        _scheduledValue_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _workCompleted_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _storedMaterials_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _totalCompleted_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _previouslyPaid_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _currentPaymentDue_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _retainageWithheld_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _netPayment_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _percentComplete_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _submittedDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _reviewedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _approvedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _paidDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _reviewedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _notes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _attachments_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _createdBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _contract_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => construction_contract_model_1.ConstructionContract)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _applicationNumber_decorators, { kind: "field", name: "applicationNumber", static: false, private: false, access: { has: obj => "applicationNumber" in obj, get: obj => obj.applicationNumber, set: (obj, value) => { obj.applicationNumber = value; } }, metadata: _metadata }, _applicationNumber_initializers, _applicationNumber_extraInitializers);
        __esDecorate(null, null, _periodStartDate_decorators, { kind: "field", name: "periodStartDate", static: false, private: false, access: { has: obj => "periodStartDate" in obj, get: obj => obj.periodStartDate, set: (obj, value) => { obj.periodStartDate = value; } }, metadata: _metadata }, _periodStartDate_initializers, _periodStartDate_extraInitializers);
        __esDecorate(null, null, _periodEndDate_decorators, { kind: "field", name: "periodEndDate", static: false, private: false, access: { has: obj => "periodEndDate" in obj, get: obj => obj.periodEndDate, set: (obj, value) => { obj.periodEndDate = value; } }, metadata: _metadata }, _periodEndDate_initializers, _periodEndDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _scheduledValue_decorators, { kind: "field", name: "scheduledValue", static: false, private: false, access: { has: obj => "scheduledValue" in obj, get: obj => obj.scheduledValue, set: (obj, value) => { obj.scheduledValue = value; } }, metadata: _metadata }, _scheduledValue_initializers, _scheduledValue_extraInitializers);
        __esDecorate(null, null, _workCompleted_decorators, { kind: "field", name: "workCompleted", static: false, private: false, access: { has: obj => "workCompleted" in obj, get: obj => obj.workCompleted, set: (obj, value) => { obj.workCompleted = value; } }, metadata: _metadata }, _workCompleted_initializers, _workCompleted_extraInitializers);
        __esDecorate(null, null, _storedMaterials_decorators, { kind: "field", name: "storedMaterials", static: false, private: false, access: { has: obj => "storedMaterials" in obj, get: obj => obj.storedMaterials, set: (obj, value) => { obj.storedMaterials = value; } }, metadata: _metadata }, _storedMaterials_initializers, _storedMaterials_extraInitializers);
        __esDecorate(null, null, _totalCompleted_decorators, { kind: "field", name: "totalCompleted", static: false, private: false, access: { has: obj => "totalCompleted" in obj, get: obj => obj.totalCompleted, set: (obj, value) => { obj.totalCompleted = value; } }, metadata: _metadata }, _totalCompleted_initializers, _totalCompleted_extraInitializers);
        __esDecorate(null, null, _previouslyPaid_decorators, { kind: "field", name: "previouslyPaid", static: false, private: false, access: { has: obj => "previouslyPaid" in obj, get: obj => obj.previouslyPaid, set: (obj, value) => { obj.previouslyPaid = value; } }, metadata: _metadata }, _previouslyPaid_initializers, _previouslyPaid_extraInitializers);
        __esDecorate(null, null, _currentPaymentDue_decorators, { kind: "field", name: "currentPaymentDue", static: false, private: false, access: { has: obj => "currentPaymentDue" in obj, get: obj => obj.currentPaymentDue, set: (obj, value) => { obj.currentPaymentDue = value; } }, metadata: _metadata }, _currentPaymentDue_initializers, _currentPaymentDue_extraInitializers);
        __esDecorate(null, null, _retainageWithheld_decorators, { kind: "field", name: "retainageWithheld", static: false, private: false, access: { has: obj => "retainageWithheld" in obj, get: obj => obj.retainageWithheld, set: (obj, value) => { obj.retainageWithheld = value; } }, metadata: _metadata }, _retainageWithheld_initializers, _retainageWithheld_extraInitializers);
        __esDecorate(null, null, _netPayment_decorators, { kind: "field", name: "netPayment", static: false, private: false, access: { has: obj => "netPayment" in obj, get: obj => obj.netPayment, set: (obj, value) => { obj.netPayment = value; } }, metadata: _metadata }, _netPayment_initializers, _netPayment_extraInitializers);
        __esDecorate(null, null, _percentComplete_decorators, { kind: "field", name: "percentComplete", static: false, private: false, access: { has: obj => "percentComplete" in obj, get: obj => obj.percentComplete, set: (obj, value) => { obj.percentComplete = value; } }, metadata: _metadata }, _percentComplete_initializers, _percentComplete_extraInitializers);
        __esDecorate(null, null, _submittedDate_decorators, { kind: "field", name: "submittedDate", static: false, private: false, access: { has: obj => "submittedDate" in obj, get: obj => obj.submittedDate, set: (obj, value) => { obj.submittedDate = value; } }, metadata: _metadata }, _submittedDate_initializers, _submittedDate_extraInitializers);
        __esDecorate(null, null, _reviewedDate_decorators, { kind: "field", name: "reviewedDate", static: false, private: false, access: { has: obj => "reviewedDate" in obj, get: obj => obj.reviewedDate, set: (obj, value) => { obj.reviewedDate = value; } }, metadata: _metadata }, _reviewedDate_initializers, _reviewedDate_extraInitializers);
        __esDecorate(null, null, _approvedDate_decorators, { kind: "field", name: "approvedDate", static: false, private: false, access: { has: obj => "approvedDate" in obj, get: obj => obj.approvedDate, set: (obj, value) => { obj.approvedDate = value; } }, metadata: _metadata }, _approvedDate_initializers, _approvedDate_extraInitializers);
        __esDecorate(null, null, _paidDate_decorators, { kind: "field", name: "paidDate", static: false, private: false, access: { has: obj => "paidDate" in obj, get: obj => obj.paidDate, set: (obj, value) => { obj.paidDate = value; } }, metadata: _metadata }, _paidDate_initializers, _paidDate_extraInitializers);
        __esDecorate(null, null, _reviewedBy_decorators, { kind: "field", name: "reviewedBy", static: false, private: false, access: { has: obj => "reviewedBy" in obj, get: obj => obj.reviewedBy, set: (obj, value) => { obj.reviewedBy = value; } }, metadata: _metadata }, _reviewedBy_initializers, _reviewedBy_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _contract_decorators, { kind: "field", name: "contract", static: false, private: false, access: { has: obj => "contract" in obj, get: obj => obj.contract, set: (obj, value) => { obj.contract = value; } }, metadata: _metadata }, _contract_initializers, _contract_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentApplication = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentApplication = _classThis;
})();
exports.PaymentApplication = PaymentApplication;
//# sourceMappingURL=payment-application.model.js.map