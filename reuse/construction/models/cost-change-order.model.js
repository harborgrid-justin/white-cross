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
exports.CostChangeOrder = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const cost_types_1 = require("../types/cost.types");
let CostChangeOrder = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'cost_change_orders',
            timestamps: true,
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
    let _changeOrderNumber_decorators;
    let _changeOrderNumber_initializers = [];
    let _changeOrderNumber_extraInitializers = [];
    let _changeOrderDate_decorators;
    let _changeOrderDate_initializers = [];
    let _changeOrderDate_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _justification_decorators;
    let _justification_initializers = [];
    let _justification_extraInitializers = [];
    let _costImpact_decorators;
    let _costImpact_initializers = [];
    let _costImpact_extraInitializers = [];
    let _scheduleImpact_decorators;
    let _scheduleImpact_initializers = [];
    let _scheduleImpact_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvalDate_decorators;
    let _approvalDate_initializers = [];
    let _approvalDate_extraInitializers = [];
    let _rejectedBy_decorators;
    let _rejectedBy_initializers = [];
    let _rejectedBy_extraInitializers = [];
    let _rejectionReason_decorators;
    let _rejectionReason_initializers = [];
    let _rejectionReason_extraInitializers = [];
    let _affectedCostCodes_decorators;
    let _affectedCostCodes_initializers = [];
    let _affectedCostCodes_extraInitializers = [];
    let _originalEstimate_decorators;
    let _originalEstimate_initializers = [];
    let _originalEstimate_extraInitializers = [];
    let _revisedEstimate_decorators;
    let _revisedEstimate_initializers = [];
    let _revisedEstimate_extraInitializers = [];
    let _actualCost_decorators;
    let _actualCost_initializers = [];
    let _actualCost_extraInitializers = [];
    let _incorporatedDate_decorators;
    let _incorporatedDate_initializers = [];
    let _incorporatedDate_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var CostChangeOrder = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.changeOrderNumber = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _changeOrderNumber_initializers, void 0));
            this.changeOrderDate = (__runInitializers(this, _changeOrderNumber_extraInitializers), __runInitializers(this, _changeOrderDate_initializers, void 0));
            this.requestedBy = (__runInitializers(this, _changeOrderDate_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
            this.description = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.justification = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _justification_initializers, void 0));
            this.costImpact = (__runInitializers(this, _justification_extraInitializers), __runInitializers(this, _costImpact_initializers, void 0));
            this.scheduleImpact = (__runInitializers(this, _costImpact_extraInitializers), __runInitializers(this, _scheduleImpact_initializers, void 0)); // in days
            this.status = (__runInitializers(this, _scheduleImpact_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvalDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
            this.rejectedBy = (__runInitializers(this, _approvalDate_extraInitializers), __runInitializers(this, _rejectedBy_initializers, void 0));
            this.rejectionReason = (__runInitializers(this, _rejectedBy_extraInitializers), __runInitializers(this, _rejectionReason_initializers, void 0));
            this.affectedCostCodes = (__runInitializers(this, _rejectionReason_extraInitializers), __runInitializers(this, _affectedCostCodes_initializers, void 0));
            this.originalEstimate = (__runInitializers(this, _affectedCostCodes_extraInitializers), __runInitializers(this, _originalEstimate_initializers, void 0));
            this.revisedEstimate = (__runInitializers(this, _originalEstimate_extraInitializers), __runInitializers(this, _revisedEstimate_initializers, void 0));
            this.actualCost = (__runInitializers(this, _revisedEstimate_extraInitializers), __runInitializers(this, _actualCost_initializers, void 0));
            this.incorporatedDate = (__runInitializers(this, _actualCost_extraInitializers), __runInitializers(this, _incorporatedDate_initializers, void 0));
            this.metadata = (__runInitializers(this, _incorporatedDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CostChangeOrder");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _projectId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _changeOrderNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _changeOrderDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _requestedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _justification_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _costImpact_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _scheduleImpact_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(cost_types_1.ChangeOrderStatus.PENDING), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(cost_types_1.ChangeOrderStatus)),
            })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _approvalDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _rejectedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _rejectionReason_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _affectedCostCodes_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _originalEstimate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _revisedEstimate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _actualCost_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _incorporatedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _changeOrderNumber_decorators, { kind: "field", name: "changeOrderNumber", static: false, private: false, access: { has: obj => "changeOrderNumber" in obj, get: obj => obj.changeOrderNumber, set: (obj, value) => { obj.changeOrderNumber = value; } }, metadata: _metadata }, _changeOrderNumber_initializers, _changeOrderNumber_extraInitializers);
        __esDecorate(null, null, _changeOrderDate_decorators, { kind: "field", name: "changeOrderDate", static: false, private: false, access: { has: obj => "changeOrderDate" in obj, get: obj => obj.changeOrderDate, set: (obj, value) => { obj.changeOrderDate = value; } }, metadata: _metadata }, _changeOrderDate_initializers, _changeOrderDate_extraInitializers);
        __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _justification_decorators, { kind: "field", name: "justification", static: false, private: false, access: { has: obj => "justification" in obj, get: obj => obj.justification, set: (obj, value) => { obj.justification = value; } }, metadata: _metadata }, _justification_initializers, _justification_extraInitializers);
        __esDecorate(null, null, _costImpact_decorators, { kind: "field", name: "costImpact", static: false, private: false, access: { has: obj => "costImpact" in obj, get: obj => obj.costImpact, set: (obj, value) => { obj.costImpact = value; } }, metadata: _metadata }, _costImpact_initializers, _costImpact_extraInitializers);
        __esDecorate(null, null, _scheduleImpact_decorators, { kind: "field", name: "scheduleImpact", static: false, private: false, access: { has: obj => "scheduleImpact" in obj, get: obj => obj.scheduleImpact, set: (obj, value) => { obj.scheduleImpact = value; } }, metadata: _metadata }, _scheduleImpact_initializers, _scheduleImpact_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: obj => "approvalDate" in obj, get: obj => obj.approvalDate, set: (obj, value) => { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
        __esDecorate(null, null, _rejectedBy_decorators, { kind: "field", name: "rejectedBy", static: false, private: false, access: { has: obj => "rejectedBy" in obj, get: obj => obj.rejectedBy, set: (obj, value) => { obj.rejectedBy = value; } }, metadata: _metadata }, _rejectedBy_initializers, _rejectedBy_extraInitializers);
        __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: obj => "rejectionReason" in obj, get: obj => obj.rejectionReason, set: (obj, value) => { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
        __esDecorate(null, null, _affectedCostCodes_decorators, { kind: "field", name: "affectedCostCodes", static: false, private: false, access: { has: obj => "affectedCostCodes" in obj, get: obj => obj.affectedCostCodes, set: (obj, value) => { obj.affectedCostCodes = value; } }, metadata: _metadata }, _affectedCostCodes_initializers, _affectedCostCodes_extraInitializers);
        __esDecorate(null, null, _originalEstimate_decorators, { kind: "field", name: "originalEstimate", static: false, private: false, access: { has: obj => "originalEstimate" in obj, get: obj => obj.originalEstimate, set: (obj, value) => { obj.originalEstimate = value; } }, metadata: _metadata }, _originalEstimate_initializers, _originalEstimate_extraInitializers);
        __esDecorate(null, null, _revisedEstimate_decorators, { kind: "field", name: "revisedEstimate", static: false, private: false, access: { has: obj => "revisedEstimate" in obj, get: obj => obj.revisedEstimate, set: (obj, value) => { obj.revisedEstimate = value; } }, metadata: _metadata }, _revisedEstimate_initializers, _revisedEstimate_extraInitializers);
        __esDecorate(null, null, _actualCost_decorators, { kind: "field", name: "actualCost", static: false, private: false, access: { has: obj => "actualCost" in obj, get: obj => obj.actualCost, set: (obj, value) => { obj.actualCost = value; } }, metadata: _metadata }, _actualCost_initializers, _actualCost_extraInitializers);
        __esDecorate(null, null, _incorporatedDate_decorators, { kind: "field", name: "incorporatedDate", static: false, private: false, access: { has: obj => "incorporatedDate" in obj, get: obj => obj.incorporatedDate, set: (obj, value) => { obj.incorporatedDate = value; } }, metadata: _metadata }, _incorporatedDate_initializers, _incorporatedDate_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CostChangeOrder = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CostChangeOrder = _classThis;
})();
exports.CostChangeOrder = CostChangeOrder;
//# sourceMappingURL=cost-change-order.model.js.map