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
exports.ConstructionProject = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const project_types_1 = require("../types/project.types");
const project_baseline_model_1 = require("./project-baseline.model");
const change_order_model_1 = require("./change-order.model");
let ConstructionProject = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'construction_projects',
            timestamps: true,
            indexes: [
                { fields: ['projectNumber'], unique: true },
                { fields: ['status'] },
                { fields: ['currentPhase'] },
                { fields: ['priority'] },
                { fields: ['projectManagerId'] },
                { fields: ['districtCode'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _projectNumber_decorators;
    let _projectNumber_initializers = [];
    let _projectNumber_extraInitializers = [];
    let _projectName_decorators;
    let _projectName_initializers = [];
    let _projectName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _currentPhase_decorators;
    let _currentPhase_initializers = [];
    let _currentPhase_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _deliveryMethod_decorators;
    let _deliveryMethod_initializers = [];
    let _deliveryMethod_extraInitializers = [];
    let _projectManagerId_decorators;
    let _projectManagerId_initializers = [];
    let _projectManagerId_extraInitializers = [];
    let _sponsorId_decorators;
    let _sponsorId_initializers = [];
    let _sponsorId_extraInitializers = [];
    let _contractorId_decorators;
    let _contractorId_initializers = [];
    let _contractorId_extraInitializers = [];
    let _totalBudget_decorators;
    let _totalBudget_initializers = [];
    let _totalBudget_extraInitializers = [];
    let _committedCost_decorators;
    let _committedCost_initializers = [];
    let _committedCost_extraInitializers = [];
    let _actualCost_decorators;
    let _actualCost_initializers = [];
    let _actualCost_extraInitializers = [];
    let _forecastedCost_decorators;
    let _forecastedCost_initializers = [];
    let _forecastedCost_extraInitializers = [];
    let _contingencyReserve_decorators;
    let _contingencyReserve_initializers = [];
    let _contingencyReserve_extraInitializers = [];
    let _managementReserve_decorators;
    let _managementReserve_initializers = [];
    let _managementReserve_extraInitializers = [];
    let _baselineEndDate_decorators;
    let _baselineEndDate_initializers = [];
    let _baselineEndDate_extraInitializers = [];
    let _actualStartDate_decorators;
    let _actualStartDate_initializers = [];
    let _actualStartDate_extraInitializers = [];
    let _actualEndDate_decorators;
    let _actualEndDate_initializers = [];
    let _actualEndDate_extraInitializers = [];
    let _progressPercentage_decorators;
    let _progressPercentage_initializers = [];
    let _progressPercentage_extraInitializers = [];
    let _earnedValue_decorators;
    let _earnedValue_initializers = [];
    let _earnedValue_extraInitializers = [];
    let _plannedValue_decorators;
    let _plannedValue_initializers = [];
    let _plannedValue_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _baselines_decorators;
    let _baselines_initializers = [];
    let _baselines_extraInitializers = [];
    let _changeOrders_decorators;
    let _changeOrders_initializers = [];
    let _changeOrders_extraInitializers = [];
    var ConstructionProject = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectNumber_initializers, void 0));
            this.projectName = (__runInitializers(this, _projectNumber_extraInitializers), __runInitializers(this, _projectName_initializers, void 0));
            this.description = (__runInitializers(this, _projectName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.currentPhase = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _currentPhase_initializers, void 0));
            this.priority = (__runInitializers(this, _currentPhase_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.deliveryMethod = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _deliveryMethod_initializers, void 0));
            this.projectManagerId = (__runInitializers(this, _deliveryMethod_extraInitializers), __runInitializers(this, _projectManagerId_initializers, void 0));
            this.sponsorId = (__runInitializers(this, _projectManagerId_extraInitializers), __runInitializers(this, _sponsorId_initializers, void 0));
            this.contractorId = (__runInitializers(this, _sponsorId_extraInitializers), __runInitializers(this, _contractorId_initializers, void 0));
            this.totalBudget = (__runInitializers(this, _contractorId_extraInitializers), __runInitializers(this, _totalBudget_initializers, void 0));
            this.committedCost = (__runInitializers(this, _totalBudget_extraInitializers), __runInitializers(this, _committedCost_initializers, void 0));
            this.actualCost = (__runInitializers(this, _committedCost_extraInitializers), __runInitializers(this, _actualCost_initializers, void 0));
            this.forecastedCost = (__runInitializers(this, _actualCost_extraInitializers), __runInitializers(this, _forecastedCost_initializers, void 0));
            this.contingencyReserve = (__runInitializers(this, _forecastedCost_extraInitializers), __runInitializers(this, _contingencyReserve_initializers, void 0));
            this.managementReserve = (__runInitializers(this, _contingencyReserve_extraInitializers), __runInitializers(this, _managementReserve_initializers, void 0));
            this.baselineEndDate = (__runInitializers(this, _managementReserve_extraInitializers), __runInitializers(this, _baselineEndDate_initializers, void 0));
            this.actualStartDate = (__runInitializers(this, _baselineEndDate_extraInitializers), __runInitializers(this, _actualStartDate_initializers, void 0));
            this.actualEndDate = (__runInitializers(this, _actualStartDate_extraInitializers), __runInitializers(this, _actualEndDate_initializers, void 0));
            this.progressPercentage = (__runInitializers(this, _actualEndDate_extraInitializers), __runInitializers(this, _progressPercentage_initializers, void 0));
            this.earnedValue = (__runInitializers(this, _progressPercentage_extraInitializers), __runInitializers(this, _earnedValue_initializers, void 0));
            this.plannedValue = (__runInitializers(this, _earnedValue_extraInitializers), __runInitializers(this, _plannedValue_initializers, void 0));
            this.metadata = (__runInitializers(this, _plannedValue_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdBy = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.baselines = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _baselines_initializers, void 0));
            this.changeOrders = (__runInitializers(this, _baselines_extraInitializers), __runInitializers(this, _changeOrders_initializers, void 0));
            __runInitializers(this, _changeOrders_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConstructionProject");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _projectNumber_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _projectName_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(project_types_1.ConstructionProjectStatus.PRE_PLANNING), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(project_types_1.ConstructionProjectStatus)),
            })];
        _currentPhase_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(project_types_1.ProjectPhase.INITIATION), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(project_types_1.ProjectPhase)),
            })];
        _priority_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(project_types_1.ProjectPriority.MEDIUM), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(project_types_1.ProjectPriority)),
            })];
        _deliveryMethod_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(project_types_1.DeliveryMethod)),
            })];
        _projectManagerId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _sponsorId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _contractorId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _totalBudget_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _committedCost_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _actualCost_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _forecastedCost_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _contingencyReserve_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _managementReserve_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _baselineEndDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _actualStartDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _actualEndDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _progressPercentage_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _earnedValue_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _plannedValue_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _createdBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _updatedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _baselines_decorators = [(0, sequelize_typescript_1.HasMany)(() => project_baseline_model_1.ProjectBaseline)];
        _changeOrders_decorators = [(0, sequelize_typescript_1.HasMany)(() => change_order_model_1.ChangeOrder)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _projectNumber_decorators, { kind: "field", name: "projectNumber", static: false, private: false, access: { has: obj => "projectNumber" in obj, get: obj => obj.projectNumber, set: (obj, value) => { obj.projectNumber = value; } }, metadata: _metadata }, _projectNumber_initializers, _projectNumber_extraInitializers);
        __esDecorate(null, null, _projectName_decorators, { kind: "field", name: "projectName", static: false, private: false, access: { has: obj => "projectName" in obj, get: obj => obj.projectName, set: (obj, value) => { obj.projectName = value; } }, metadata: _metadata }, _projectName_initializers, _projectName_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _currentPhase_decorators, { kind: "field", name: "currentPhase", static: false, private: false, access: { has: obj => "currentPhase" in obj, get: obj => obj.currentPhase, set: (obj, value) => { obj.currentPhase = value; } }, metadata: _metadata }, _currentPhase_initializers, _currentPhase_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _deliveryMethod_decorators, { kind: "field", name: "deliveryMethod", static: false, private: false, access: { has: obj => "deliveryMethod" in obj, get: obj => obj.deliveryMethod, set: (obj, value) => { obj.deliveryMethod = value; } }, metadata: _metadata }, _deliveryMethod_initializers, _deliveryMethod_extraInitializers);
        __esDecorate(null, null, _projectManagerId_decorators, { kind: "field", name: "projectManagerId", static: false, private: false, access: { has: obj => "projectManagerId" in obj, get: obj => obj.projectManagerId, set: (obj, value) => { obj.projectManagerId = value; } }, metadata: _metadata }, _projectManagerId_initializers, _projectManagerId_extraInitializers);
        __esDecorate(null, null, _sponsorId_decorators, { kind: "field", name: "sponsorId", static: false, private: false, access: { has: obj => "sponsorId" in obj, get: obj => obj.sponsorId, set: (obj, value) => { obj.sponsorId = value; } }, metadata: _metadata }, _sponsorId_initializers, _sponsorId_extraInitializers);
        __esDecorate(null, null, _contractorId_decorators, { kind: "field", name: "contractorId", static: false, private: false, access: { has: obj => "contractorId" in obj, get: obj => obj.contractorId, set: (obj, value) => { obj.contractorId = value; } }, metadata: _metadata }, _contractorId_initializers, _contractorId_extraInitializers);
        __esDecorate(null, null, _totalBudget_decorators, { kind: "field", name: "totalBudget", static: false, private: false, access: { has: obj => "totalBudget" in obj, get: obj => obj.totalBudget, set: (obj, value) => { obj.totalBudget = value; } }, metadata: _metadata }, _totalBudget_initializers, _totalBudget_extraInitializers);
        __esDecorate(null, null, _committedCost_decorators, { kind: "field", name: "committedCost", static: false, private: false, access: { has: obj => "committedCost" in obj, get: obj => obj.committedCost, set: (obj, value) => { obj.committedCost = value; } }, metadata: _metadata }, _committedCost_initializers, _committedCost_extraInitializers);
        __esDecorate(null, null, _actualCost_decorators, { kind: "field", name: "actualCost", static: false, private: false, access: { has: obj => "actualCost" in obj, get: obj => obj.actualCost, set: (obj, value) => { obj.actualCost = value; } }, metadata: _metadata }, _actualCost_initializers, _actualCost_extraInitializers);
        __esDecorate(null, null, _forecastedCost_decorators, { kind: "field", name: "forecastedCost", static: false, private: false, access: { has: obj => "forecastedCost" in obj, get: obj => obj.forecastedCost, set: (obj, value) => { obj.forecastedCost = value; } }, metadata: _metadata }, _forecastedCost_initializers, _forecastedCost_extraInitializers);
        __esDecorate(null, null, _contingencyReserve_decorators, { kind: "field", name: "contingencyReserve", static: false, private: false, access: { has: obj => "contingencyReserve" in obj, get: obj => obj.contingencyReserve, set: (obj, value) => { obj.contingencyReserve = value; } }, metadata: _metadata }, _contingencyReserve_initializers, _contingencyReserve_extraInitializers);
        __esDecorate(null, null, _managementReserve_decorators, { kind: "field", name: "managementReserve", static: false, private: false, access: { has: obj => "managementReserve" in obj, get: obj => obj.managementReserve, set: (obj, value) => { obj.managementReserve = value; } }, metadata: _metadata }, _managementReserve_initializers, _managementReserve_extraInitializers);
        __esDecorate(null, null, _baselineEndDate_decorators, { kind: "field", name: "baselineEndDate", static: false, private: false, access: { has: obj => "baselineEndDate" in obj, get: obj => obj.baselineEndDate, set: (obj, value) => { obj.baselineEndDate = value; } }, metadata: _metadata }, _baselineEndDate_initializers, _baselineEndDate_extraInitializers);
        __esDecorate(null, null, _actualStartDate_decorators, { kind: "field", name: "actualStartDate", static: false, private: false, access: { has: obj => "actualStartDate" in obj, get: obj => obj.actualStartDate, set: (obj, value) => { obj.actualStartDate = value; } }, metadata: _metadata }, _actualStartDate_initializers, _actualStartDate_extraInitializers);
        __esDecorate(null, null, _actualEndDate_decorators, { kind: "field", name: "actualEndDate", static: false, private: false, access: { has: obj => "actualEndDate" in obj, get: obj => obj.actualEndDate, set: (obj, value) => { obj.actualEndDate = value; } }, metadata: _metadata }, _actualEndDate_initializers, _actualEndDate_extraInitializers);
        __esDecorate(null, null, _progressPercentage_decorators, { kind: "field", name: "progressPercentage", static: false, private: false, access: { has: obj => "progressPercentage" in obj, get: obj => obj.progressPercentage, set: (obj, value) => { obj.progressPercentage = value; } }, metadata: _metadata }, _progressPercentage_initializers, _progressPercentage_extraInitializers);
        __esDecorate(null, null, _earnedValue_decorators, { kind: "field", name: "earnedValue", static: false, private: false, access: { has: obj => "earnedValue" in obj, get: obj => obj.earnedValue, set: (obj, value) => { obj.earnedValue = value; } }, metadata: _metadata }, _earnedValue_initializers, _earnedValue_extraInitializers);
        __esDecorate(null, null, _plannedValue_decorators, { kind: "field", name: "plannedValue", static: false, private: false, access: { has: obj => "plannedValue" in obj, get: obj => obj.plannedValue, set: (obj, value) => { obj.plannedValue = value; } }, metadata: _metadata }, _plannedValue_initializers, _plannedValue_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _baselines_decorators, { kind: "field", name: "baselines", static: false, private: false, access: { has: obj => "baselines" in obj, get: obj => obj.baselines, set: (obj, value) => { obj.baselines = value; } }, metadata: _metadata }, _baselines_initializers, _baselines_extraInitializers);
        __esDecorate(null, null, _changeOrders_decorators, { kind: "field", name: "changeOrders", static: false, private: false, access: { has: obj => "changeOrders" in obj, get: obj => obj.changeOrders, set: (obj, value) => { obj.changeOrders = value; } }, metadata: _metadata }, _changeOrders_initializers, _changeOrders_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConstructionProject = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConstructionProject = _classThis;
})();
exports.ConstructionProject = ConstructionProject;
//# sourceMappingURL=project.model.js.map