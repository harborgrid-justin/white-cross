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
exports.SubmittalWorkflow = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const submittal_types_1 = require("../types/submittal.types");
const construction_submittal_model_1 = require("./construction-submittal.model");
let SubmittalWorkflow = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'submittal_workflows',
            timestamps: true,
            indexes: [
                { fields: ['submittalId'], unique: true },
                { fields: ['overallStatus'] },
                { fields: ['escalationRequired'] },
                { fields: ['targetCompletionDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _submittalId_decorators;
    let _submittalId_initializers = [];
    let _submittalId_extraInitializers = [];
    let _workflowType_decorators;
    let _workflowType_initializers = [];
    let _workflowType_extraInitializers = [];
    let _steps_decorators;
    let _steps_initializers = [];
    let _steps_extraInitializers = [];
    let _currentStepIndex_decorators;
    let _currentStepIndex_initializers = [];
    let _currentStepIndex_extraInitializers = [];
    let _overallStatus_decorators;
    let _overallStatus_initializers = [];
    let _overallStatus_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _targetCompletionDate_decorators;
    let _targetCompletionDate_initializers = [];
    let _targetCompletionDate_extraInitializers = [];
    let _actualCompletionDate_decorators;
    let _actualCompletionDate_initializers = [];
    let _actualCompletionDate_extraInitializers = [];
    let _escalationRequired_decorators;
    let _escalationRequired_initializers = [];
    let _escalationRequired_extraInitializers = [];
    let _escalatedAt_decorators;
    let _escalatedAt_initializers = [];
    let _escalatedAt_extraInitializers = [];
    let _escalatedTo_decorators;
    let _escalatedTo_initializers = [];
    let _escalatedTo_extraInitializers = [];
    let _pausedAt_decorators;
    let _pausedAt_initializers = [];
    let _pausedAt_extraInitializers = [];
    let _pauseReason_decorators;
    let _pauseReason_initializers = [];
    let _pauseReason_extraInitializers = [];
    let _resumedAt_decorators;
    let _resumedAt_initializers = [];
    let _resumedAt_extraInitializers = [];
    let _totalDaysActive_decorators;
    let _totalDaysActive_initializers = [];
    let _totalDaysActive_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var SubmittalWorkflow = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.submittalId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _submittalId_initializers, void 0));
            this.workflowType = (__runInitializers(this, _submittalId_extraInitializers), __runInitializers(this, _workflowType_initializers, void 0));
            this.steps = (__runInitializers(this, _workflowType_extraInitializers), __runInitializers(this, _steps_initializers, void 0));
            this.currentStepIndex = (__runInitializers(this, _steps_extraInitializers), __runInitializers(this, _currentStepIndex_initializers, void 0));
            this.overallStatus = (__runInitializers(this, _currentStepIndex_extraInitializers), __runInitializers(this, _overallStatus_initializers, void 0));
            this.startDate = (__runInitializers(this, _overallStatus_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.targetCompletionDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _targetCompletionDate_initializers, void 0));
            this.actualCompletionDate = (__runInitializers(this, _targetCompletionDate_extraInitializers), __runInitializers(this, _actualCompletionDate_initializers, void 0));
            this.escalationRequired = (__runInitializers(this, _actualCompletionDate_extraInitializers), __runInitializers(this, _escalationRequired_initializers, void 0));
            this.escalatedAt = (__runInitializers(this, _escalationRequired_extraInitializers), __runInitializers(this, _escalatedAt_initializers, void 0));
            this.escalatedTo = (__runInitializers(this, _escalatedAt_extraInitializers), __runInitializers(this, _escalatedTo_initializers, void 0));
            this.pausedAt = (__runInitializers(this, _escalatedTo_extraInitializers), __runInitializers(this, _pausedAt_initializers, void 0));
            this.pauseReason = (__runInitializers(this, _pausedAt_extraInitializers), __runInitializers(this, _pauseReason_initializers, void 0));
            this.resumedAt = (__runInitializers(this, _pauseReason_extraInitializers), __runInitializers(this, _resumedAt_initializers, void 0));
            this.totalDaysActive = (__runInitializers(this, _resumedAt_extraInitializers), __runInitializers(this, _totalDaysActive_initializers, void 0));
            this.metadata = (__runInitializers(this, _totalDaysActive_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SubmittalWorkflow");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _submittalId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => construction_submittal_model_1.ConstructionSubmittal), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _workflowType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(submittal_types_1.WorkflowType)),
            })];
        _steps_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _currentStepIndex_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _overallStatus_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(submittal_types_1.WorkflowStatus.PENDING), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(submittal_types_1.WorkflowStatus)),
            })];
        _startDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _targetCompletionDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _actualCompletionDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _escalationRequired_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _escalatedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _escalatedTo_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _pausedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _pauseReason_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _resumedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _totalDaysActive_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _submittalId_decorators, { kind: "field", name: "submittalId", static: false, private: false, access: { has: obj => "submittalId" in obj, get: obj => obj.submittalId, set: (obj, value) => { obj.submittalId = value; } }, metadata: _metadata }, _submittalId_initializers, _submittalId_extraInitializers);
        __esDecorate(null, null, _workflowType_decorators, { kind: "field", name: "workflowType", static: false, private: false, access: { has: obj => "workflowType" in obj, get: obj => obj.workflowType, set: (obj, value) => { obj.workflowType = value; } }, metadata: _metadata }, _workflowType_initializers, _workflowType_extraInitializers);
        __esDecorate(null, null, _steps_decorators, { kind: "field", name: "steps", static: false, private: false, access: { has: obj => "steps" in obj, get: obj => obj.steps, set: (obj, value) => { obj.steps = value; } }, metadata: _metadata }, _steps_initializers, _steps_extraInitializers);
        __esDecorate(null, null, _currentStepIndex_decorators, { kind: "field", name: "currentStepIndex", static: false, private: false, access: { has: obj => "currentStepIndex" in obj, get: obj => obj.currentStepIndex, set: (obj, value) => { obj.currentStepIndex = value; } }, metadata: _metadata }, _currentStepIndex_initializers, _currentStepIndex_extraInitializers);
        __esDecorate(null, null, _overallStatus_decorators, { kind: "field", name: "overallStatus", static: false, private: false, access: { has: obj => "overallStatus" in obj, get: obj => obj.overallStatus, set: (obj, value) => { obj.overallStatus = value; } }, metadata: _metadata }, _overallStatus_initializers, _overallStatus_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _targetCompletionDate_decorators, { kind: "field", name: "targetCompletionDate", static: false, private: false, access: { has: obj => "targetCompletionDate" in obj, get: obj => obj.targetCompletionDate, set: (obj, value) => { obj.targetCompletionDate = value; } }, metadata: _metadata }, _targetCompletionDate_initializers, _targetCompletionDate_extraInitializers);
        __esDecorate(null, null, _actualCompletionDate_decorators, { kind: "field", name: "actualCompletionDate", static: false, private: false, access: { has: obj => "actualCompletionDate" in obj, get: obj => obj.actualCompletionDate, set: (obj, value) => { obj.actualCompletionDate = value; } }, metadata: _metadata }, _actualCompletionDate_initializers, _actualCompletionDate_extraInitializers);
        __esDecorate(null, null, _escalationRequired_decorators, { kind: "field", name: "escalationRequired", static: false, private: false, access: { has: obj => "escalationRequired" in obj, get: obj => obj.escalationRequired, set: (obj, value) => { obj.escalationRequired = value; } }, metadata: _metadata }, _escalationRequired_initializers, _escalationRequired_extraInitializers);
        __esDecorate(null, null, _escalatedAt_decorators, { kind: "field", name: "escalatedAt", static: false, private: false, access: { has: obj => "escalatedAt" in obj, get: obj => obj.escalatedAt, set: (obj, value) => { obj.escalatedAt = value; } }, metadata: _metadata }, _escalatedAt_initializers, _escalatedAt_extraInitializers);
        __esDecorate(null, null, _escalatedTo_decorators, { kind: "field", name: "escalatedTo", static: false, private: false, access: { has: obj => "escalatedTo" in obj, get: obj => obj.escalatedTo, set: (obj, value) => { obj.escalatedTo = value; } }, metadata: _metadata }, _escalatedTo_initializers, _escalatedTo_extraInitializers);
        __esDecorate(null, null, _pausedAt_decorators, { kind: "field", name: "pausedAt", static: false, private: false, access: { has: obj => "pausedAt" in obj, get: obj => obj.pausedAt, set: (obj, value) => { obj.pausedAt = value; } }, metadata: _metadata }, _pausedAt_initializers, _pausedAt_extraInitializers);
        __esDecorate(null, null, _pauseReason_decorators, { kind: "field", name: "pauseReason", static: false, private: false, access: { has: obj => "pauseReason" in obj, get: obj => obj.pauseReason, set: (obj, value) => { obj.pauseReason = value; } }, metadata: _metadata }, _pauseReason_initializers, _pauseReason_extraInitializers);
        __esDecorate(null, null, _resumedAt_decorators, { kind: "field", name: "resumedAt", static: false, private: false, access: { has: obj => "resumedAt" in obj, get: obj => obj.resumedAt, set: (obj, value) => { obj.resumedAt = value; } }, metadata: _metadata }, _resumedAt_initializers, _resumedAt_extraInitializers);
        __esDecorate(null, null, _totalDaysActive_decorators, { kind: "field", name: "totalDaysActive", static: false, private: false, access: { has: obj => "totalDaysActive" in obj, get: obj => obj.totalDaysActive, set: (obj, value) => { obj.totalDaysActive = value; } }, metadata: _metadata }, _totalDaysActive_initializers, _totalDaysActive_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SubmittalWorkflow = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SubmittalWorkflow = _classThis;
})();
exports.SubmittalWorkflow = SubmittalWorkflow;
//# sourceMappingURL=submittal-workflow.model.js.map