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
exports.CostEstimate = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const cost_types_1 = require("../types/cost.types");
let CostEstimate = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'cost_estimates',
            timestamps: true,
            indexes: [
                { fields: ['projectId'] },
                { fields: ['estimateNumber'], unique: true },
                { fields: ['estimateType'] },
                { fields: ['status'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _estimateNumber_decorators;
    let _estimateNumber_initializers = [];
    let _estimateNumber_extraInitializers = [];
    let _estimateType_decorators;
    let _estimateType_initializers = [];
    let _estimateType_extraInitializers = [];
    let _estimateDate_decorators;
    let _estimateDate_initializers = [];
    let _estimateDate_extraInitializers = [];
    let _totalEstimatedCost_decorators;
    let _totalEstimatedCost_initializers = [];
    let _totalEstimatedCost_extraInitializers = [];
    let _directCosts_decorators;
    let _directCosts_initializers = [];
    let _directCosts_extraInitializers = [];
    let _indirectCosts_decorators;
    let _indirectCosts_initializers = [];
    let _indirectCosts_extraInitializers = [];
    let _contingency_decorators;
    let _contingency_initializers = [];
    let _contingency_extraInitializers = [];
    let _contingencyPercent_decorators;
    let _contingencyPercent_initializers = [];
    let _contingencyPercent_extraInitializers = [];
    let _escalation_decorators;
    let _escalation_initializers = [];
    let _escalation_extraInitializers = [];
    let _estimatedBy_decorators;
    let _estimatedBy_initializers = [];
    let _estimatedBy_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _baselineDate_decorators;
    let _baselineDate_initializers = [];
    let _baselineDate_extraInitializers = [];
    let _revisedEstimate_decorators;
    let _revisedEstimate_initializers = [];
    let _revisedEstimate_extraInitializers = [];
    let _revisionNumber_decorators;
    let _revisionNumber_initializers = [];
    let _revisionNumber_extraInitializers = [];
    let _revisionReason_decorators;
    let _revisionReason_initializers = [];
    let _revisionReason_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvalDate_decorators;
    let _approvalDate_initializers = [];
    let _approvalDate_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var CostEstimate = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.estimateNumber = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _estimateNumber_initializers, void 0));
            this.estimateType = (__runInitializers(this, _estimateNumber_extraInitializers), __runInitializers(this, _estimateType_initializers, void 0));
            this.estimateDate = (__runInitializers(this, _estimateType_extraInitializers), __runInitializers(this, _estimateDate_initializers, void 0));
            this.totalEstimatedCost = (__runInitializers(this, _estimateDate_extraInitializers), __runInitializers(this, _totalEstimatedCost_initializers, void 0));
            this.directCosts = (__runInitializers(this, _totalEstimatedCost_extraInitializers), __runInitializers(this, _directCosts_initializers, void 0));
            this.indirectCosts = (__runInitializers(this, _directCosts_extraInitializers), __runInitializers(this, _indirectCosts_initializers, void 0));
            this.contingency = (__runInitializers(this, _indirectCosts_extraInitializers), __runInitializers(this, _contingency_initializers, void 0));
            this.contingencyPercent = (__runInitializers(this, _contingency_extraInitializers), __runInitializers(this, _contingencyPercent_initializers, void 0));
            this.escalation = (__runInitializers(this, _contingencyPercent_extraInitializers), __runInitializers(this, _escalation_initializers, void 0));
            this.estimatedBy = (__runInitializers(this, _escalation_extraInitializers), __runInitializers(this, _estimatedBy_initializers, void 0));
            this.status = (__runInitializers(this, _estimatedBy_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.baselineDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _baselineDate_initializers, void 0));
            this.revisedEstimate = (__runInitializers(this, _baselineDate_extraInitializers), __runInitializers(this, _revisedEstimate_initializers, void 0));
            this.revisionNumber = (__runInitializers(this, _revisedEstimate_extraInitializers), __runInitializers(this, _revisionNumber_initializers, void 0));
            this.revisionReason = (__runInitializers(this, _revisionNumber_extraInitializers), __runInitializers(this, _revisionReason_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _revisionReason_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvalDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
            this.metadata = (__runInitializers(this, _approvalDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CostEstimate");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _projectId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _estimateNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _estimateType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(cost_types_1.EstimateType)),
            })];
        _estimateDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _totalEstimatedCost_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _directCosts_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _indirectCosts_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _contingency_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _contingencyPercent_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _escalation_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _estimatedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('draft'), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('draft', 'submitted', 'approved', 'baseline', 'superseded'))];
        _baselineDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _revisedEstimate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _revisionNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _revisionReason_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _approvalDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _estimateNumber_decorators, { kind: "field", name: "estimateNumber", static: false, private: false, access: { has: obj => "estimateNumber" in obj, get: obj => obj.estimateNumber, set: (obj, value) => { obj.estimateNumber = value; } }, metadata: _metadata }, _estimateNumber_initializers, _estimateNumber_extraInitializers);
        __esDecorate(null, null, _estimateType_decorators, { kind: "field", name: "estimateType", static: false, private: false, access: { has: obj => "estimateType" in obj, get: obj => obj.estimateType, set: (obj, value) => { obj.estimateType = value; } }, metadata: _metadata }, _estimateType_initializers, _estimateType_extraInitializers);
        __esDecorate(null, null, _estimateDate_decorators, { kind: "field", name: "estimateDate", static: false, private: false, access: { has: obj => "estimateDate" in obj, get: obj => obj.estimateDate, set: (obj, value) => { obj.estimateDate = value; } }, metadata: _metadata }, _estimateDate_initializers, _estimateDate_extraInitializers);
        __esDecorate(null, null, _totalEstimatedCost_decorators, { kind: "field", name: "totalEstimatedCost", static: false, private: false, access: { has: obj => "totalEstimatedCost" in obj, get: obj => obj.totalEstimatedCost, set: (obj, value) => { obj.totalEstimatedCost = value; } }, metadata: _metadata }, _totalEstimatedCost_initializers, _totalEstimatedCost_extraInitializers);
        __esDecorate(null, null, _directCosts_decorators, { kind: "field", name: "directCosts", static: false, private: false, access: { has: obj => "directCosts" in obj, get: obj => obj.directCosts, set: (obj, value) => { obj.directCosts = value; } }, metadata: _metadata }, _directCosts_initializers, _directCosts_extraInitializers);
        __esDecorate(null, null, _indirectCosts_decorators, { kind: "field", name: "indirectCosts", static: false, private: false, access: { has: obj => "indirectCosts" in obj, get: obj => obj.indirectCosts, set: (obj, value) => { obj.indirectCosts = value; } }, metadata: _metadata }, _indirectCosts_initializers, _indirectCosts_extraInitializers);
        __esDecorate(null, null, _contingency_decorators, { kind: "field", name: "contingency", static: false, private: false, access: { has: obj => "contingency" in obj, get: obj => obj.contingency, set: (obj, value) => { obj.contingency = value; } }, metadata: _metadata }, _contingency_initializers, _contingency_extraInitializers);
        __esDecorate(null, null, _contingencyPercent_decorators, { kind: "field", name: "contingencyPercent", static: false, private: false, access: { has: obj => "contingencyPercent" in obj, get: obj => obj.contingencyPercent, set: (obj, value) => { obj.contingencyPercent = value; } }, metadata: _metadata }, _contingencyPercent_initializers, _contingencyPercent_extraInitializers);
        __esDecorate(null, null, _escalation_decorators, { kind: "field", name: "escalation", static: false, private: false, access: { has: obj => "escalation" in obj, get: obj => obj.escalation, set: (obj, value) => { obj.escalation = value; } }, metadata: _metadata }, _escalation_initializers, _escalation_extraInitializers);
        __esDecorate(null, null, _estimatedBy_decorators, { kind: "field", name: "estimatedBy", static: false, private: false, access: { has: obj => "estimatedBy" in obj, get: obj => obj.estimatedBy, set: (obj, value) => { obj.estimatedBy = value; } }, metadata: _metadata }, _estimatedBy_initializers, _estimatedBy_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _baselineDate_decorators, { kind: "field", name: "baselineDate", static: false, private: false, access: { has: obj => "baselineDate" in obj, get: obj => obj.baselineDate, set: (obj, value) => { obj.baselineDate = value; } }, metadata: _metadata }, _baselineDate_initializers, _baselineDate_extraInitializers);
        __esDecorate(null, null, _revisedEstimate_decorators, { kind: "field", name: "revisedEstimate", static: false, private: false, access: { has: obj => "revisedEstimate" in obj, get: obj => obj.revisedEstimate, set: (obj, value) => { obj.revisedEstimate = value; } }, metadata: _metadata }, _revisedEstimate_initializers, _revisedEstimate_extraInitializers);
        __esDecorate(null, null, _revisionNumber_decorators, { kind: "field", name: "revisionNumber", static: false, private: false, access: { has: obj => "revisionNumber" in obj, get: obj => obj.revisionNumber, set: (obj, value) => { obj.revisionNumber = value; } }, metadata: _metadata }, _revisionNumber_initializers, _revisionNumber_extraInitializers);
        __esDecorate(null, null, _revisionReason_decorators, { kind: "field", name: "revisionReason", static: false, private: false, access: { has: obj => "revisionReason" in obj, get: obj => obj.revisionReason, set: (obj, value) => { obj.revisionReason = value; } }, metadata: _metadata }, _revisionReason_initializers, _revisionReason_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: obj => "approvalDate" in obj, get: obj => obj.approvalDate, set: (obj, value) => { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CostEstimate = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CostEstimate = _classThis;
})();
exports.CostEstimate = CostEstimate;
//# sourceMappingURL=cost-estimate.model.js.map