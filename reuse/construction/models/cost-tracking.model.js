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
exports.CostTracking = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const cost_types_1 = require("../types/cost.types");
let CostTracking = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'cost_tracking',
            timestamps: true,
            indexes: [
                { fields: ['projectId'] },
                { fields: ['costCodeId'] },
                { fields: ['category'] },
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
    let _costCodeId_decorators;
    let _costCodeId_initializers = [];
    let _costCodeId_extraInitializers = [];
    let _costCode_decorators;
    let _costCode_initializers = [];
    let _costCode_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _phase_decorators;
    let _phase_initializers = [];
    let _phase_extraInitializers = [];
    let _transactionDate_decorators;
    let _transactionDate_initializers = [];
    let _transactionDate_extraInitializers = [];
    let _budgetedCost_decorators;
    let _budgetedCost_initializers = [];
    let _budgetedCost_extraInitializers = [];
    let _originalBudget_decorators;
    let _originalBudget_initializers = [];
    let _originalBudget_extraInitializers = [];
    let _revisedBudget_decorators;
    let _revisedBudget_initializers = [];
    let _revisedBudget_extraInitializers = [];
    let _committedCost_decorators;
    let _committedCost_initializers = [];
    let _committedCost_extraInitializers = [];
    let _actualCost_decorators;
    let _actualCost_initializers = [];
    let _actualCost_extraInitializers = [];
    let _projectedCost_decorators;
    let _projectedCost_initializers = [];
    let _projectedCost_extraInitializers = [];
    let _costVariance_decorators;
    let _costVariance_initializers = [];
    let _costVariance_extraInitializers = [];
    let _variancePercent_decorators;
    let _variancePercent_initializers = [];
    let _variancePercent_extraInitializers = [];
    let _earnedValue_decorators;
    let _earnedValue_initializers = [];
    let _earnedValue_extraInitializers = [];
    let _percentComplete_decorators;
    let _percentComplete_initializers = [];
    let _percentComplete_extraInitializers = [];
    let _costPerformanceIndex_decorators;
    let _costPerformanceIndex_initializers = [];
    let _costPerformanceIndex_extraInitializers = [];
    let _estimateAtCompletion_decorators;
    let _estimateAtCompletion_initializers = [];
    let _estimateAtCompletion_extraInitializers = [];
    let _estimateToComplete_decorators;
    let _estimateToComplete_initializers = [];
    let _estimateToComplete_extraInitializers = [];
    let _fiscalPeriod_decorators;
    let _fiscalPeriod_initializers = [];
    let _fiscalPeriod_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _lastUpdatedBy_decorators;
    let _lastUpdatedBy_initializers = [];
    let _lastUpdatedBy_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var CostTracking = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.costCodeId = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _costCodeId_initializers, void 0));
            this.costCode = (__runInitializers(this, _costCodeId_extraInitializers), __runInitializers(this, _costCode_initializers, void 0));
            this.description = (__runInitializers(this, _costCode_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.phase = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _phase_initializers, void 0));
            this.transactionDate = (__runInitializers(this, _phase_extraInitializers), __runInitializers(this, _transactionDate_initializers, void 0));
            this.budgetedCost = (__runInitializers(this, _transactionDate_extraInitializers), __runInitializers(this, _budgetedCost_initializers, void 0));
            this.originalBudget = (__runInitializers(this, _budgetedCost_extraInitializers), __runInitializers(this, _originalBudget_initializers, void 0));
            this.revisedBudget = (__runInitializers(this, _originalBudget_extraInitializers), __runInitializers(this, _revisedBudget_initializers, void 0));
            this.committedCost = (__runInitializers(this, _revisedBudget_extraInitializers), __runInitializers(this, _committedCost_initializers, void 0));
            this.actualCost = (__runInitializers(this, _committedCost_extraInitializers), __runInitializers(this, _actualCost_initializers, void 0));
            this.projectedCost = (__runInitializers(this, _actualCost_extraInitializers), __runInitializers(this, _projectedCost_initializers, void 0));
            this.costVariance = (__runInitializers(this, _projectedCost_extraInitializers), __runInitializers(this, _costVariance_initializers, void 0));
            this.variancePercent = (__runInitializers(this, _costVariance_extraInitializers), __runInitializers(this, _variancePercent_initializers, void 0));
            this.earnedValue = (__runInitializers(this, _variancePercent_extraInitializers), __runInitializers(this, _earnedValue_initializers, void 0));
            this.percentComplete = (__runInitializers(this, _earnedValue_extraInitializers), __runInitializers(this, _percentComplete_initializers, void 0));
            this.costPerformanceIndex = (__runInitializers(this, _percentComplete_extraInitializers), __runInitializers(this, _costPerformanceIndex_initializers, void 0));
            this.estimateAtCompletion = (__runInitializers(this, _costPerformanceIndex_extraInitializers), __runInitializers(this, _estimateAtCompletion_initializers, void 0));
            this.estimateToComplete = (__runInitializers(this, _estimateAtCompletion_extraInitializers), __runInitializers(this, _estimateToComplete_initializers, void 0));
            this.fiscalPeriod = (__runInitializers(this, _estimateToComplete_extraInitializers), __runInitializers(this, _fiscalPeriod_initializers, void 0));
            this.fiscalYear = (__runInitializers(this, _fiscalPeriod_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
            this.lastUpdatedBy = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _lastUpdatedBy_initializers, void 0));
            this.metadata = (__runInitializers(this, _lastUpdatedBy_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CostTracking");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _projectId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _costCodeId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _costCode_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500))];
        _category_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(cost_types_1.CostCategory)),
            })];
        _phase_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(''), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _transactionDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _budgetedCost_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _originalBudget_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _revisedBudget_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _committedCost_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _actualCost_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _projectedCost_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _costVariance_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _variancePercent_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(7, 4))];
        _earnedValue_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _percentComplete_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _costPerformanceIndex_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(1), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(7, 4))];
        _estimateAtCompletion_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _estimateToComplete_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _fiscalPeriod_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _fiscalYear_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _lastUpdatedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _costCodeId_decorators, { kind: "field", name: "costCodeId", static: false, private: false, access: { has: obj => "costCodeId" in obj, get: obj => obj.costCodeId, set: (obj, value) => { obj.costCodeId = value; } }, metadata: _metadata }, _costCodeId_initializers, _costCodeId_extraInitializers);
        __esDecorate(null, null, _costCode_decorators, { kind: "field", name: "costCode", static: false, private: false, access: { has: obj => "costCode" in obj, get: obj => obj.costCode, set: (obj, value) => { obj.costCode = value; } }, metadata: _metadata }, _costCode_initializers, _costCode_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _phase_decorators, { kind: "field", name: "phase", static: false, private: false, access: { has: obj => "phase" in obj, get: obj => obj.phase, set: (obj, value) => { obj.phase = value; } }, metadata: _metadata }, _phase_initializers, _phase_extraInitializers);
        __esDecorate(null, null, _transactionDate_decorators, { kind: "field", name: "transactionDate", static: false, private: false, access: { has: obj => "transactionDate" in obj, get: obj => obj.transactionDate, set: (obj, value) => { obj.transactionDate = value; } }, metadata: _metadata }, _transactionDate_initializers, _transactionDate_extraInitializers);
        __esDecorate(null, null, _budgetedCost_decorators, { kind: "field", name: "budgetedCost", static: false, private: false, access: { has: obj => "budgetedCost" in obj, get: obj => obj.budgetedCost, set: (obj, value) => { obj.budgetedCost = value; } }, metadata: _metadata }, _budgetedCost_initializers, _budgetedCost_extraInitializers);
        __esDecorate(null, null, _originalBudget_decorators, { kind: "field", name: "originalBudget", static: false, private: false, access: { has: obj => "originalBudget" in obj, get: obj => obj.originalBudget, set: (obj, value) => { obj.originalBudget = value; } }, metadata: _metadata }, _originalBudget_initializers, _originalBudget_extraInitializers);
        __esDecorate(null, null, _revisedBudget_decorators, { kind: "field", name: "revisedBudget", static: false, private: false, access: { has: obj => "revisedBudget" in obj, get: obj => obj.revisedBudget, set: (obj, value) => { obj.revisedBudget = value; } }, metadata: _metadata }, _revisedBudget_initializers, _revisedBudget_extraInitializers);
        __esDecorate(null, null, _committedCost_decorators, { kind: "field", name: "committedCost", static: false, private: false, access: { has: obj => "committedCost" in obj, get: obj => obj.committedCost, set: (obj, value) => { obj.committedCost = value; } }, metadata: _metadata }, _committedCost_initializers, _committedCost_extraInitializers);
        __esDecorate(null, null, _actualCost_decorators, { kind: "field", name: "actualCost", static: false, private: false, access: { has: obj => "actualCost" in obj, get: obj => obj.actualCost, set: (obj, value) => { obj.actualCost = value; } }, metadata: _metadata }, _actualCost_initializers, _actualCost_extraInitializers);
        __esDecorate(null, null, _projectedCost_decorators, { kind: "field", name: "projectedCost", static: false, private: false, access: { has: obj => "projectedCost" in obj, get: obj => obj.projectedCost, set: (obj, value) => { obj.projectedCost = value; } }, metadata: _metadata }, _projectedCost_initializers, _projectedCost_extraInitializers);
        __esDecorate(null, null, _costVariance_decorators, { kind: "field", name: "costVariance", static: false, private: false, access: { has: obj => "costVariance" in obj, get: obj => obj.costVariance, set: (obj, value) => { obj.costVariance = value; } }, metadata: _metadata }, _costVariance_initializers, _costVariance_extraInitializers);
        __esDecorate(null, null, _variancePercent_decorators, { kind: "field", name: "variancePercent", static: false, private: false, access: { has: obj => "variancePercent" in obj, get: obj => obj.variancePercent, set: (obj, value) => { obj.variancePercent = value; } }, metadata: _metadata }, _variancePercent_initializers, _variancePercent_extraInitializers);
        __esDecorate(null, null, _earnedValue_decorators, { kind: "field", name: "earnedValue", static: false, private: false, access: { has: obj => "earnedValue" in obj, get: obj => obj.earnedValue, set: (obj, value) => { obj.earnedValue = value; } }, metadata: _metadata }, _earnedValue_initializers, _earnedValue_extraInitializers);
        __esDecorate(null, null, _percentComplete_decorators, { kind: "field", name: "percentComplete", static: false, private: false, access: { has: obj => "percentComplete" in obj, get: obj => obj.percentComplete, set: (obj, value) => { obj.percentComplete = value; } }, metadata: _metadata }, _percentComplete_initializers, _percentComplete_extraInitializers);
        __esDecorate(null, null, _costPerformanceIndex_decorators, { kind: "field", name: "costPerformanceIndex", static: false, private: false, access: { has: obj => "costPerformanceIndex" in obj, get: obj => obj.costPerformanceIndex, set: (obj, value) => { obj.costPerformanceIndex = value; } }, metadata: _metadata }, _costPerformanceIndex_initializers, _costPerformanceIndex_extraInitializers);
        __esDecorate(null, null, _estimateAtCompletion_decorators, { kind: "field", name: "estimateAtCompletion", static: false, private: false, access: { has: obj => "estimateAtCompletion" in obj, get: obj => obj.estimateAtCompletion, set: (obj, value) => { obj.estimateAtCompletion = value; } }, metadata: _metadata }, _estimateAtCompletion_initializers, _estimateAtCompletion_extraInitializers);
        __esDecorate(null, null, _estimateToComplete_decorators, { kind: "field", name: "estimateToComplete", static: false, private: false, access: { has: obj => "estimateToComplete" in obj, get: obj => obj.estimateToComplete, set: (obj, value) => { obj.estimateToComplete = value; } }, metadata: _metadata }, _estimateToComplete_initializers, _estimateToComplete_extraInitializers);
        __esDecorate(null, null, _fiscalPeriod_decorators, { kind: "field", name: "fiscalPeriod", static: false, private: false, access: { has: obj => "fiscalPeriod" in obj, get: obj => obj.fiscalPeriod, set: (obj, value) => { obj.fiscalPeriod = value; } }, metadata: _metadata }, _fiscalPeriod_initializers, _fiscalPeriod_extraInitializers);
        __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
        __esDecorate(null, null, _lastUpdatedBy_decorators, { kind: "field", name: "lastUpdatedBy", static: false, private: false, access: { has: obj => "lastUpdatedBy" in obj, get: obj => obj.lastUpdatedBy, set: (obj, value) => { obj.lastUpdatedBy = value; } }, metadata: _metadata }, _lastUpdatedBy_initializers, _lastUpdatedBy_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CostTracking = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CostTracking = _classThis;
})();
exports.CostTracking = CostTracking;
//# sourceMappingURL=cost-tracking.model.js.map