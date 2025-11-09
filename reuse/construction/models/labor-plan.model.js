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
exports.LaborPlan = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let LaborPlan = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'labor_plans', timestamps: true })];
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
    let _planName_decorators;
    let _planName_initializers = [];
    let _planName_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _totalLaborHours_decorators;
    let _totalLaborHours_initializers = [];
    let _totalLaborHours_extraInitializers = [];
    let _budgetedLaborCost_decorators;
    let _budgetedLaborCost_initializers = [];
    let _budgetedLaborCost_extraInitializers = [];
    let _actualLaborCost_decorators;
    let _actualLaborCost_initializers = [];
    let _actualLaborCost_extraInitializers = [];
    let _craftMix_decorators;
    let _craftMix_initializers = [];
    let _craftMix_extraInitializers = [];
    let _skillRequirements_decorators;
    let _skillRequirements_initializers = [];
    let _skillRequirements_extraInitializers = [];
    let _peakHeadcount_decorators;
    let _peakHeadcount_initializers = [];
    let _peakHeadcount_extraInitializers = [];
    let _isPrevailingWage_decorators;
    let _isPrevailingWage_initializers = [];
    let _isPrevailingWage_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var LaborPlan = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.planName = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _planName_initializers, void 0));
            this.startDate = (__runInitializers(this, _planName_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.totalLaborHours = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _totalLaborHours_initializers, void 0));
            this.budgetedLaborCost = (__runInitializers(this, _totalLaborHours_extraInitializers), __runInitializers(this, _budgetedLaborCost_initializers, void 0));
            this.actualLaborCost = (__runInitializers(this, _budgetedLaborCost_extraInitializers), __runInitializers(this, _actualLaborCost_initializers, void 0));
            this.craftMix = (__runInitializers(this, _actualLaborCost_extraInitializers), __runInitializers(this, _craftMix_initializers, void 0));
            this.skillRequirements = (__runInitializers(this, _craftMix_extraInitializers), __runInitializers(this, _skillRequirements_initializers, void 0));
            this.peakHeadcount = (__runInitializers(this, _skillRequirements_extraInitializers), __runInitializers(this, _peakHeadcount_initializers, void 0));
            this.isPrevailingWage = (__runInitializers(this, _peakHeadcount_extraInitializers), __runInitializers(this, _isPrevailingWage_initializers, void 0));
            this.createdBy = (__runInitializers(this, _isPrevailingWage_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "LaborPlan");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _projectId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _planName_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _startDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _endDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _totalLaborHours_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false })];
        _budgetedLaborCost_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2), allowNull: false })];
        _actualLaborCost_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2), defaultValue: 0 })];
        _craftMix_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON })];
        _skillRequirements_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON })];
        _peakHeadcount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _isPrevailingWage_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _planName_decorators, { kind: "field", name: "planName", static: false, private: false, access: { has: obj => "planName" in obj, get: obj => obj.planName, set: (obj, value) => { obj.planName = value; } }, metadata: _metadata }, _planName_initializers, _planName_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _totalLaborHours_decorators, { kind: "field", name: "totalLaborHours", static: false, private: false, access: { has: obj => "totalLaborHours" in obj, get: obj => obj.totalLaborHours, set: (obj, value) => { obj.totalLaborHours = value; } }, metadata: _metadata }, _totalLaborHours_initializers, _totalLaborHours_extraInitializers);
        __esDecorate(null, null, _budgetedLaborCost_decorators, { kind: "field", name: "budgetedLaborCost", static: false, private: false, access: { has: obj => "budgetedLaborCost" in obj, get: obj => obj.budgetedLaborCost, set: (obj, value) => { obj.budgetedLaborCost = value; } }, metadata: _metadata }, _budgetedLaborCost_initializers, _budgetedLaborCost_extraInitializers);
        __esDecorate(null, null, _actualLaborCost_decorators, { kind: "field", name: "actualLaborCost", static: false, private: false, access: { has: obj => "actualLaborCost" in obj, get: obj => obj.actualLaborCost, set: (obj, value) => { obj.actualLaborCost = value; } }, metadata: _metadata }, _actualLaborCost_initializers, _actualLaborCost_extraInitializers);
        __esDecorate(null, null, _craftMix_decorators, { kind: "field", name: "craftMix", static: false, private: false, access: { has: obj => "craftMix" in obj, get: obj => obj.craftMix, set: (obj, value) => { obj.craftMix = value; } }, metadata: _metadata }, _craftMix_initializers, _craftMix_extraInitializers);
        __esDecorate(null, null, _skillRequirements_decorators, { kind: "field", name: "skillRequirements", static: false, private: false, access: { has: obj => "skillRequirements" in obj, get: obj => obj.skillRequirements, set: (obj, value) => { obj.skillRequirements = value; } }, metadata: _metadata }, _skillRequirements_initializers, _skillRequirements_extraInitializers);
        __esDecorate(null, null, _peakHeadcount_decorators, { kind: "field", name: "peakHeadcount", static: false, private: false, access: { has: obj => "peakHeadcount" in obj, get: obj => obj.peakHeadcount, set: (obj, value) => { obj.peakHeadcount = value; } }, metadata: _metadata }, _peakHeadcount_initializers, _peakHeadcount_extraInitializers);
        __esDecorate(null, null, _isPrevailingWage_decorators, { kind: "field", name: "isPrevailingWage", static: false, private: false, access: { has: obj => "isPrevailingWage" in obj, get: obj => obj.isPrevailingWage, set: (obj, value) => { obj.isPrevailingWage = value; } }, metadata: _metadata }, _isPrevailingWage_initializers, _isPrevailingWage_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LaborPlan = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LaborPlan = _classThis;
})();
exports.LaborPlan = LaborPlan;
//# sourceMappingURL=labor-plan.model.js.map