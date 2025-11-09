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
exports.ContractMilestone = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const contract_types_1 = require("../types/contract.types");
const construction_contract_model_1 = require("./construction-contract.model");
let ContractMilestone = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'contract_milestones',
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
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _actualDate_decorators;
    let _actualDate_initializers = [];
    let _actualDate_extraInitializers = [];
    let _paymentPercentage_decorators;
    let _paymentPercentage_initializers = [];
    let _paymentPercentage_extraInitializers = [];
    let _paymentAmount_decorators;
    let _paymentAmount_initializers = [];
    let _paymentAmount_extraInitializers = [];
    let _isPaid_decorators;
    let _isPaid_initializers = [];
    let _isPaid_extraInitializers = [];
    let _deliverables_decorators;
    let _deliverables_initializers = [];
    let _deliverables_extraInitializers = [];
    let _acceptanceCriteria_decorators;
    let _acceptanceCriteria_initializers = [];
    let _acceptanceCriteria_extraInitializers = [];
    let _verifiedBy_decorators;
    let _verifiedBy_initializers = [];
    let _verifiedBy_extraInitializers = [];
    let _verifiedDate_decorators;
    let _verifiedDate_initializers = [];
    let _verifiedDate_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _contract_decorators;
    let _contract_initializers = [];
    let _contract_extraInitializers = [];
    var ContractMilestone = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.contractId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
            this.name = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.scheduledDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
            this.actualDate = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _actualDate_initializers, void 0));
            this.paymentPercentage = (__runInitializers(this, _actualDate_extraInitializers), __runInitializers(this, _paymentPercentage_initializers, void 0));
            this.paymentAmount = (__runInitializers(this, _paymentPercentage_extraInitializers), __runInitializers(this, _paymentAmount_initializers, void 0));
            this.isPaid = (__runInitializers(this, _paymentAmount_extraInitializers), __runInitializers(this, _isPaid_initializers, void 0));
            this.deliverables = (__runInitializers(this, _isPaid_extraInitializers), __runInitializers(this, _deliverables_initializers, void 0));
            this.acceptanceCriteria = (__runInitializers(this, _deliverables_extraInitializers), __runInitializers(this, _acceptanceCriteria_initializers, void 0));
            this.verifiedBy = (__runInitializers(this, _acceptanceCriteria_extraInitializers), __runInitializers(this, _verifiedBy_initializers, void 0));
            this.verifiedDate = (__runInitializers(this, _verifiedBy_extraInitializers), __runInitializers(this, _verifiedDate_initializers, void 0));
            this.notes = (__runInitializers(this, _verifiedDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.contract = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _contract_initializers, void 0));
            __runInitializers(this, _contract_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ContractMilestone");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _contractId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => construction_contract_model_1.ConstructionContract), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _name_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(contract_types_1.MilestoneStatus.NOT_STARTED), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(contract_types_1.MilestoneStatus)),
            })];
        _scheduledDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _actualDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _paymentPercentage_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _paymentAmount_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _isPaid_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _deliverables_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _acceptanceCriteria_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _verifiedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _verifiedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _notes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _contract_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => construction_contract_model_1.ConstructionContract)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
        __esDecorate(null, null, _actualDate_decorators, { kind: "field", name: "actualDate", static: false, private: false, access: { has: obj => "actualDate" in obj, get: obj => obj.actualDate, set: (obj, value) => { obj.actualDate = value; } }, metadata: _metadata }, _actualDate_initializers, _actualDate_extraInitializers);
        __esDecorate(null, null, _paymentPercentage_decorators, { kind: "field", name: "paymentPercentage", static: false, private: false, access: { has: obj => "paymentPercentage" in obj, get: obj => obj.paymentPercentage, set: (obj, value) => { obj.paymentPercentage = value; } }, metadata: _metadata }, _paymentPercentage_initializers, _paymentPercentage_extraInitializers);
        __esDecorate(null, null, _paymentAmount_decorators, { kind: "field", name: "paymentAmount", static: false, private: false, access: { has: obj => "paymentAmount" in obj, get: obj => obj.paymentAmount, set: (obj, value) => { obj.paymentAmount = value; } }, metadata: _metadata }, _paymentAmount_initializers, _paymentAmount_extraInitializers);
        __esDecorate(null, null, _isPaid_decorators, { kind: "field", name: "isPaid", static: false, private: false, access: { has: obj => "isPaid" in obj, get: obj => obj.isPaid, set: (obj, value) => { obj.isPaid = value; } }, metadata: _metadata }, _isPaid_initializers, _isPaid_extraInitializers);
        __esDecorate(null, null, _deliverables_decorators, { kind: "field", name: "deliverables", static: false, private: false, access: { has: obj => "deliverables" in obj, get: obj => obj.deliverables, set: (obj, value) => { obj.deliverables = value; } }, metadata: _metadata }, _deliverables_initializers, _deliverables_extraInitializers);
        __esDecorate(null, null, _acceptanceCriteria_decorators, { kind: "field", name: "acceptanceCriteria", static: false, private: false, access: { has: obj => "acceptanceCriteria" in obj, get: obj => obj.acceptanceCriteria, set: (obj, value) => { obj.acceptanceCriteria = value; } }, metadata: _metadata }, _acceptanceCriteria_initializers, _acceptanceCriteria_extraInitializers);
        __esDecorate(null, null, _verifiedBy_decorators, { kind: "field", name: "verifiedBy", static: false, private: false, access: { has: obj => "verifiedBy" in obj, get: obj => obj.verifiedBy, set: (obj, value) => { obj.verifiedBy = value; } }, metadata: _metadata }, _verifiedBy_initializers, _verifiedBy_extraInitializers);
        __esDecorate(null, null, _verifiedDate_decorators, { kind: "field", name: "verifiedDate", static: false, private: false, access: { has: obj => "verifiedDate" in obj, get: obj => obj.verifiedDate, set: (obj, value) => { obj.verifiedDate = value; } }, metadata: _metadata }, _verifiedDate_initializers, _verifiedDate_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _contract_decorators, { kind: "field", name: "contract", static: false, private: false, access: { has: obj => "contract" in obj, get: obj => obj.contract, set: (obj, value) => { obj.contract = value; } }, metadata: _metadata }, _contract_initializers, _contract_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractMilestone = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractMilestone = _classThis;
})();
exports.ContractMilestone = ContractMilestone;
//# sourceMappingURL=contract-milestone.model.js.map