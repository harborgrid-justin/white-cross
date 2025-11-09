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
exports.ResourceAssignment = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const schedule_types_1 = require("../types/schedule.types");
let ResourceAssignment = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'resource_assignments',
            timestamps: true,
            indexes: [
                { fields: ['projectId'] },
                { fields: ['activityId'] },
                { fields: ['resourceId'] },
                { fields: ['resourceType'] },
                { fields: ['isOverallocated'] },
                { fields: ['startDate'] },
                { fields: ['endDate'] },
                { fields: ['projectId', 'resourceId'] },
                { fields: ['activityId', 'resourceId'], unique: true },
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
    let _activityId_decorators;
    let _activityId_initializers = [];
    let _activityId_extraInitializers = [];
    let _resourceId_decorators;
    let _resourceId_initializers = [];
    let _resourceId_extraInitializers = [];
    let _resourceName_decorators;
    let _resourceName_initializers = [];
    let _resourceName_extraInitializers = [];
    let _resourceType_decorators;
    let _resourceType_initializers = [];
    let _resourceType_extraInitializers = [];
    let _unitsRequired_decorators;
    let _unitsRequired_initializers = [];
    let _unitsRequired_extraInitializers = [];
    let _unitsAvailable_decorators;
    let _unitsAvailable_initializers = [];
    let _unitsAvailable_extraInitializers = [];
    let _utilizationPercent_decorators;
    let _utilizationPercent_initializers = [];
    let _utilizationPercent_extraInitializers = [];
    let _costPerUnit_decorators;
    let _costPerUnit_initializers = [];
    let _costPerUnit_extraInitializers = [];
    let _totalCost_decorators;
    let _totalCost_initializers = [];
    let _totalCost_extraInitializers = [];
    let _assignmentDate_decorators;
    let _assignmentDate_initializers = [];
    let _assignmentDate_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _isOverallocated_decorators;
    let _isOverallocated_initializers = [];
    let _isOverallocated_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var ResourceAssignment = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.activityId = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _activityId_initializers, void 0));
            this.resourceId = (__runInitializers(this, _activityId_extraInitializers), __runInitializers(this, _resourceId_initializers, void 0));
            this.resourceName = (__runInitializers(this, _resourceId_extraInitializers), __runInitializers(this, _resourceName_initializers, void 0));
            this.resourceType = (__runInitializers(this, _resourceName_extraInitializers), __runInitializers(this, _resourceType_initializers, void 0));
            this.unitsRequired = (__runInitializers(this, _resourceType_extraInitializers), __runInitializers(this, _unitsRequired_initializers, void 0));
            this.unitsAvailable = (__runInitializers(this, _unitsRequired_extraInitializers), __runInitializers(this, _unitsAvailable_initializers, void 0));
            this.utilizationPercent = (__runInitializers(this, _unitsAvailable_extraInitializers), __runInitializers(this, _utilizationPercent_initializers, void 0));
            this.costPerUnit = (__runInitializers(this, _utilizationPercent_extraInitializers), __runInitializers(this, _costPerUnit_initializers, void 0));
            this.totalCost = (__runInitializers(this, _costPerUnit_extraInitializers), __runInitializers(this, _totalCost_initializers, void 0));
            this.assignmentDate = (__runInitializers(this, _totalCost_extraInitializers), __runInitializers(this, _assignmentDate_initializers, void 0));
            this.startDate = (__runInitializers(this, _assignmentDate_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.isOverallocated = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _isOverallocated_initializers, void 0));
            this.metadata = (__runInitializers(this, _isOverallocated_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ResourceAssignment");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _projectId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _activityId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _resourceId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _resourceName_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _resourceType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(schedule_types_1.ResourceType)),
            })];
        _unitsRequired_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _unitsAvailable_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _utilizationPercent_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _costPerUnit_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _totalCost_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _assignmentDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _startDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _endDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _isOverallocated_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _activityId_decorators, { kind: "field", name: "activityId", static: false, private: false, access: { has: obj => "activityId" in obj, get: obj => obj.activityId, set: (obj, value) => { obj.activityId = value; } }, metadata: _metadata }, _activityId_initializers, _activityId_extraInitializers);
        __esDecorate(null, null, _resourceId_decorators, { kind: "field", name: "resourceId", static: false, private: false, access: { has: obj => "resourceId" in obj, get: obj => obj.resourceId, set: (obj, value) => { obj.resourceId = value; } }, metadata: _metadata }, _resourceId_initializers, _resourceId_extraInitializers);
        __esDecorate(null, null, _resourceName_decorators, { kind: "field", name: "resourceName", static: false, private: false, access: { has: obj => "resourceName" in obj, get: obj => obj.resourceName, set: (obj, value) => { obj.resourceName = value; } }, metadata: _metadata }, _resourceName_initializers, _resourceName_extraInitializers);
        __esDecorate(null, null, _resourceType_decorators, { kind: "field", name: "resourceType", static: false, private: false, access: { has: obj => "resourceType" in obj, get: obj => obj.resourceType, set: (obj, value) => { obj.resourceType = value; } }, metadata: _metadata }, _resourceType_initializers, _resourceType_extraInitializers);
        __esDecorate(null, null, _unitsRequired_decorators, { kind: "field", name: "unitsRequired", static: false, private: false, access: { has: obj => "unitsRequired" in obj, get: obj => obj.unitsRequired, set: (obj, value) => { obj.unitsRequired = value; } }, metadata: _metadata }, _unitsRequired_initializers, _unitsRequired_extraInitializers);
        __esDecorate(null, null, _unitsAvailable_decorators, { kind: "field", name: "unitsAvailable", static: false, private: false, access: { has: obj => "unitsAvailable" in obj, get: obj => obj.unitsAvailable, set: (obj, value) => { obj.unitsAvailable = value; } }, metadata: _metadata }, _unitsAvailable_initializers, _unitsAvailable_extraInitializers);
        __esDecorate(null, null, _utilizationPercent_decorators, { kind: "field", name: "utilizationPercent", static: false, private: false, access: { has: obj => "utilizationPercent" in obj, get: obj => obj.utilizationPercent, set: (obj, value) => { obj.utilizationPercent = value; } }, metadata: _metadata }, _utilizationPercent_initializers, _utilizationPercent_extraInitializers);
        __esDecorate(null, null, _costPerUnit_decorators, { kind: "field", name: "costPerUnit", static: false, private: false, access: { has: obj => "costPerUnit" in obj, get: obj => obj.costPerUnit, set: (obj, value) => { obj.costPerUnit = value; } }, metadata: _metadata }, _costPerUnit_initializers, _costPerUnit_extraInitializers);
        __esDecorate(null, null, _totalCost_decorators, { kind: "field", name: "totalCost", static: false, private: false, access: { has: obj => "totalCost" in obj, get: obj => obj.totalCost, set: (obj, value) => { obj.totalCost = value; } }, metadata: _metadata }, _totalCost_initializers, _totalCost_extraInitializers);
        __esDecorate(null, null, _assignmentDate_decorators, { kind: "field", name: "assignmentDate", static: false, private: false, access: { has: obj => "assignmentDate" in obj, get: obj => obj.assignmentDate, set: (obj, value) => { obj.assignmentDate = value; } }, metadata: _metadata }, _assignmentDate_initializers, _assignmentDate_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _isOverallocated_decorators, { kind: "field", name: "isOverallocated", static: false, private: false, access: { has: obj => "isOverallocated" in obj, get: obj => obj.isOverallocated, set: (obj, value) => { obj.isOverallocated = value; } }, metadata: _metadata }, _isOverallocated_initializers, _isOverallocated_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ResourceAssignment = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ResourceAssignment = _classThis;
})();
exports.ResourceAssignment = ResourceAssignment;
//# sourceMappingURL=resource-assignment.model.js.map