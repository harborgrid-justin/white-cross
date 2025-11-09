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
exports.ProjectBaseline = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const project_model_1 = require("./project.model");
let ProjectBaseline = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'project_baselines',
            timestamps: true,
            updatedAt: false,
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
    let _baselineNumber_decorators;
    let _baselineNumber_initializers = [];
    let _baselineNumber_extraInitializers = [];
    let _baselineType_decorators;
    let _baselineType_initializers = [];
    let _baselineType_extraInitializers = [];
    let _budget_decorators;
    let _budget_initializers = [];
    let _budget_extraInitializers = [];
    let _schedule_decorators;
    let _schedule_initializers = [];
    let _schedule_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _changeReason_decorators;
    let _changeReason_initializers = [];
    let _changeReason_extraInitializers = [];
    let _project_decorators;
    let _project_initializers = [];
    let _project_extraInitializers = [];
    var ProjectBaseline = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.baselineNumber = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _baselineNumber_initializers, void 0));
            this.baselineType = (__runInitializers(this, _baselineNumber_extraInitializers), __runInitializers(this, _baselineType_initializers, void 0));
            this.budget = (__runInitializers(this, _baselineType_extraInitializers), __runInitializers(this, _budget_initializers, void 0));
            this.schedule = (__runInitializers(this, _budget_extraInitializers), __runInitializers(this, _schedule_initializers, void 0));
            this.scope = (__runInitializers(this, _schedule_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.changeReason = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _changeReason_initializers, void 0));
            this.project = (__runInitializers(this, _changeReason_extraInitializers), __runInitializers(this, _project_initializers, void 0));
            __runInitializers(this, _project_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ProjectBaseline");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _projectId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => project_model_1.ConstructionProject), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _baselineNumber_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _baselineType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('INITIAL', 'REVISED', 'RE_BASELINE'))];
        _budget_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _schedule_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _scope_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _approvedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _changeReason_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _project_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => project_model_1.ConstructionProject)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _baselineNumber_decorators, { kind: "field", name: "baselineNumber", static: false, private: false, access: { has: obj => "baselineNumber" in obj, get: obj => obj.baselineNumber, set: (obj, value) => { obj.baselineNumber = value; } }, metadata: _metadata }, _baselineNumber_initializers, _baselineNumber_extraInitializers);
        __esDecorate(null, null, _baselineType_decorators, { kind: "field", name: "baselineType", static: false, private: false, access: { has: obj => "baselineType" in obj, get: obj => obj.baselineType, set: (obj, value) => { obj.baselineType = value; } }, metadata: _metadata }, _baselineType_initializers, _baselineType_extraInitializers);
        __esDecorate(null, null, _budget_decorators, { kind: "field", name: "budget", static: false, private: false, access: { has: obj => "budget" in obj, get: obj => obj.budget, set: (obj, value) => { obj.budget = value; } }, metadata: _metadata }, _budget_initializers, _budget_extraInitializers);
        __esDecorate(null, null, _schedule_decorators, { kind: "field", name: "schedule", static: false, private: false, access: { has: obj => "schedule" in obj, get: obj => obj.schedule, set: (obj, value) => { obj.schedule = value; } }, metadata: _metadata }, _schedule_initializers, _schedule_extraInitializers);
        __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _changeReason_decorators, { kind: "field", name: "changeReason", static: false, private: false, access: { has: obj => "changeReason" in obj, get: obj => obj.changeReason, set: (obj, value) => { obj.changeReason = value; } }, metadata: _metadata }, _changeReason_initializers, _changeReason_extraInitializers);
        __esDecorate(null, null, _project_decorators, { kind: "field", name: "project", static: false, private: false, access: { has: obj => "project" in obj, get: obj => obj.project, set: (obj, value) => { obj.project = value; } }, metadata: _metadata }, _project_initializers, _project_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProjectBaseline = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProjectBaseline = _classThis;
})();
exports.ProjectBaseline = ProjectBaseline;
//# sourceMappingURL=project-baseline.model.js.map