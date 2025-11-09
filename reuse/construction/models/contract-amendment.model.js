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
exports.ContractAmendment = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const contract_types_1 = require("../types/contract.types");
const construction_contract_model_1 = require("./construction-contract.model");
let ContractAmendment = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'contract_amendments',
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
    let _amendmentNumber_decorators;
    let _amendmentNumber_initializers = [];
    let _amendmentNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _changeType_decorators;
    let _changeType_initializers = [];
    let _changeType_extraInitializers = [];
    let _costImpact_decorators;
    let _costImpact_initializers = [];
    let _costImpact_extraInitializers = [];
    let _timeImpact_decorators;
    let _timeImpact_initializers = [];
    let _timeImpact_extraInitializers = [];
    let _newCompletionDate_decorators;
    let _newCompletionDate_initializers = [];
    let _newCompletionDate_extraInitializers = [];
    let _newContractAmount_decorators;
    let _newContractAmount_initializers = [];
    let _newContractAmount_extraInitializers = [];
    let _justification_decorators;
    let _justification_initializers = [];
    let _justification_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _requestedDate_decorators;
    let _requestedDate_initializers = [];
    let _requestedDate_extraInitializers = [];
    let _reviewedBy_decorators;
    let _reviewedBy_initializers = [];
    let _reviewedBy_extraInitializers = [];
    let _reviewedDate_decorators;
    let _reviewedDate_initializers = [];
    let _reviewedDate_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedDate_decorators;
    let _approvedDate_initializers = [];
    let _approvedDate_extraInitializers = [];
    let _executedDate_decorators;
    let _executedDate_initializers = [];
    let _executedDate_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _contract_decorators;
    let _contract_initializers = [];
    let _contract_extraInitializers = [];
    var ContractAmendment = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.contractId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
            this.amendmentNumber = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _amendmentNumber_initializers, void 0));
            this.title = (__runInitializers(this, _amendmentNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.changeType = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _changeType_initializers, void 0));
            this.costImpact = (__runInitializers(this, _changeType_extraInitializers), __runInitializers(this, _costImpact_initializers, void 0));
            this.timeImpact = (__runInitializers(this, _costImpact_extraInitializers), __runInitializers(this, _timeImpact_initializers, void 0)); // in days
            this.newCompletionDate = (__runInitializers(this, _timeImpact_extraInitializers), __runInitializers(this, _newCompletionDate_initializers, void 0));
            this.newContractAmount = (__runInitializers(this, _newCompletionDate_extraInitializers), __runInitializers(this, _newContractAmount_initializers, void 0));
            this.justification = (__runInitializers(this, _newContractAmount_extraInitializers), __runInitializers(this, _justification_initializers, void 0));
            this.requestedBy = (__runInitializers(this, _justification_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
            this.requestedDate = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _requestedDate_initializers, void 0));
            this.reviewedBy = (__runInitializers(this, _requestedDate_extraInitializers), __runInitializers(this, _reviewedBy_initializers, void 0));
            this.reviewedDate = (__runInitializers(this, _reviewedBy_extraInitializers), __runInitializers(this, _reviewedDate_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _reviewedDate_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedDate_initializers, void 0));
            this.executedDate = (__runInitializers(this, _approvedDate_extraInitializers), __runInitializers(this, _executedDate_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _executedDate_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.attachments = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.contract = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _contract_initializers, void 0));
            __runInitializers(this, _contract_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ContractAmendment");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _contractId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => construction_contract_model_1.ConstructionContract), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _amendmentNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _title_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(contract_types_1.AmendmentStatus.DRAFT), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(contract_types_1.AmendmentStatus)),
            })];
        _changeType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('scope', 'time', 'cost', 'terms', 'multiple'))];
        _costImpact_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _timeImpact_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _newCompletionDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _newContractAmount_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _justification_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _requestedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _requestedDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _reviewedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _reviewedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _approvedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _executedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _effectiveDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _attachments_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _contract_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => construction_contract_model_1.ConstructionContract)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _amendmentNumber_decorators, { kind: "field", name: "amendmentNumber", static: false, private: false, access: { has: obj => "amendmentNumber" in obj, get: obj => obj.amendmentNumber, set: (obj, value) => { obj.amendmentNumber = value; } }, metadata: _metadata }, _amendmentNumber_initializers, _amendmentNumber_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _changeType_decorators, { kind: "field", name: "changeType", static: false, private: false, access: { has: obj => "changeType" in obj, get: obj => obj.changeType, set: (obj, value) => { obj.changeType = value; } }, metadata: _metadata }, _changeType_initializers, _changeType_extraInitializers);
        __esDecorate(null, null, _costImpact_decorators, { kind: "field", name: "costImpact", static: false, private: false, access: { has: obj => "costImpact" in obj, get: obj => obj.costImpact, set: (obj, value) => { obj.costImpact = value; } }, metadata: _metadata }, _costImpact_initializers, _costImpact_extraInitializers);
        __esDecorate(null, null, _timeImpact_decorators, { kind: "field", name: "timeImpact", static: false, private: false, access: { has: obj => "timeImpact" in obj, get: obj => obj.timeImpact, set: (obj, value) => { obj.timeImpact = value; } }, metadata: _metadata }, _timeImpact_initializers, _timeImpact_extraInitializers);
        __esDecorate(null, null, _newCompletionDate_decorators, { kind: "field", name: "newCompletionDate", static: false, private: false, access: { has: obj => "newCompletionDate" in obj, get: obj => obj.newCompletionDate, set: (obj, value) => { obj.newCompletionDate = value; } }, metadata: _metadata }, _newCompletionDate_initializers, _newCompletionDate_extraInitializers);
        __esDecorate(null, null, _newContractAmount_decorators, { kind: "field", name: "newContractAmount", static: false, private: false, access: { has: obj => "newContractAmount" in obj, get: obj => obj.newContractAmount, set: (obj, value) => { obj.newContractAmount = value; } }, metadata: _metadata }, _newContractAmount_initializers, _newContractAmount_extraInitializers);
        __esDecorate(null, null, _justification_decorators, { kind: "field", name: "justification", static: false, private: false, access: { has: obj => "justification" in obj, get: obj => obj.justification, set: (obj, value) => { obj.justification = value; } }, metadata: _metadata }, _justification_initializers, _justification_extraInitializers);
        __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
        __esDecorate(null, null, _requestedDate_decorators, { kind: "field", name: "requestedDate", static: false, private: false, access: { has: obj => "requestedDate" in obj, get: obj => obj.requestedDate, set: (obj, value) => { obj.requestedDate = value; } }, metadata: _metadata }, _requestedDate_initializers, _requestedDate_extraInitializers);
        __esDecorate(null, null, _reviewedBy_decorators, { kind: "field", name: "reviewedBy", static: false, private: false, access: { has: obj => "reviewedBy" in obj, get: obj => obj.reviewedBy, set: (obj, value) => { obj.reviewedBy = value; } }, metadata: _metadata }, _reviewedBy_initializers, _reviewedBy_extraInitializers);
        __esDecorate(null, null, _reviewedDate_decorators, { kind: "field", name: "reviewedDate", static: false, private: false, access: { has: obj => "reviewedDate" in obj, get: obj => obj.reviewedDate, set: (obj, value) => { obj.reviewedDate = value; } }, metadata: _metadata }, _reviewedDate_initializers, _reviewedDate_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedDate_decorators, { kind: "field", name: "approvedDate", static: false, private: false, access: { has: obj => "approvedDate" in obj, get: obj => obj.approvedDate, set: (obj, value) => { obj.approvedDate = value; } }, metadata: _metadata }, _approvedDate_initializers, _approvedDate_extraInitializers);
        __esDecorate(null, null, _executedDate_decorators, { kind: "field", name: "executedDate", static: false, private: false, access: { has: obj => "executedDate" in obj, get: obj => obj.executedDate, set: (obj, value) => { obj.executedDate = value; } }, metadata: _metadata }, _executedDate_initializers, _executedDate_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _contract_decorators, { kind: "field", name: "contract", static: false, private: false, access: { has: obj => "contract" in obj, get: obj => obj.contract, set: (obj, value) => { obj.contract = value; } }, metadata: _metadata }, _contract_initializers, _contract_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractAmendment = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractAmendment = _classThis;
})();
exports.ContractAmendment = ContractAmendment;
//# sourceMappingURL=contract-amendment.model.js.map