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
exports.ChangeRequest = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const project_model_1 = require("./project.model");
const change_order_types_1 = require("../types/change-order.types");
let ChangeRequest = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'change_requests',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _changeRequestNumber_decorators;
    let _changeRequestNumber_initializers = [];
    let _changeRequestNumber_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _projectName_decorators;
    let _projectName_initializers = [];
    let _projectName_extraInitializers = [];
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _contractNumber_decorators;
    let _contractNumber_initializers = [];
    let _contractNumber_extraInitializers = [];
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
    let _changeCategory_decorators;
    let _changeCategory_initializers = [];
    let _changeCategory_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _requestedByName_decorators;
    let _requestedByName_initializers = [];
    let _requestedByName_extraInitializers = [];
    let _requestDate_decorators;
    let _requestDate_initializers = [];
    let _requestDate_extraInitializers = [];
    let _requiredByDate_decorators;
    let _requiredByDate_initializers = [];
    let _requiredByDate_extraInitializers = [];
    let _justification_decorators;
    let _justification_initializers = [];
    let _justification_extraInitializers = [];
    let _affectedAreas_decorators;
    let _affectedAreas_initializers = [];
    let _affectedAreas_extraInitializers = [];
    let _relatedDrawings_decorators;
    let _relatedDrawings_initializers = [];
    let _relatedDrawings_extraInitializers = [];
    let _relatedSpecifications_decorators;
    let _relatedSpecifications_initializers = [];
    let _relatedSpecifications_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _urgency_decorators;
    let _urgency_initializers = [];
    let _urgency_extraInitializers = [];
    let _estimatedCostImpact_decorators;
    let _estimatedCostImpact_initializers = [];
    let _estimatedCostImpact_extraInitializers = [];
    let _estimatedTimeImpact_decorators;
    let _estimatedTimeImpact_initializers = [];
    let _estimatedTimeImpact_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _project_decorators;
    let _project_initializers = [];
    let _project_extraInitializers = [];
    var ChangeRequest = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.changeRequestNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _changeRequestNumber_initializers, void 0));
            this.projectId = (__runInitializers(this, _changeRequestNumber_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.projectName = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _projectName_initializers, void 0));
            this.contractId = (__runInitializers(this, _projectName_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
            this.contractNumber = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _contractNumber_initializers, void 0));
            this.title = (__runInitializers(this, _contractNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.changeType = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _changeType_initializers, void 0));
            this.changeCategory = (__runInitializers(this, _changeType_extraInitializers), __runInitializers(this, _changeCategory_initializers, void 0));
            this.requestedBy = (__runInitializers(this, _changeCategory_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
            this.requestedByName = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _requestedByName_initializers, void 0));
            this.requestDate = (__runInitializers(this, _requestedByName_extraInitializers), __runInitializers(this, _requestDate_initializers, void 0));
            this.requiredByDate = (__runInitializers(this, _requestDate_extraInitializers), __runInitializers(this, _requiredByDate_initializers, void 0));
            this.justification = (__runInitializers(this, _requiredByDate_extraInitializers), __runInitializers(this, _justification_initializers, void 0));
            this.affectedAreas = (__runInitializers(this, _justification_extraInitializers), __runInitializers(this, _affectedAreas_initializers, void 0));
            this.relatedDrawings = (__runInitializers(this, _affectedAreas_extraInitializers), __runInitializers(this, _relatedDrawings_initializers, void 0));
            this.relatedSpecifications = (__runInitializers(this, _relatedDrawings_extraInitializers), __runInitializers(this, _relatedSpecifications_initializers, void 0));
            this.attachments = (__runInitializers(this, _relatedSpecifications_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.urgency = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _urgency_initializers, void 0));
            this.estimatedCostImpact = (__runInitializers(this, _urgency_extraInitializers), __runInitializers(this, _estimatedCostImpact_initializers, void 0));
            this.estimatedTimeImpact = (__runInitializers(this, _estimatedCostImpact_extraInitializers), __runInitializers(this, _estimatedTimeImpact_initializers, void 0)); // in days
            this.metadata = (__runInitializers(this, _estimatedTimeImpact_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.project = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _project_initializers, void 0));
            __runInitializers(this, _project_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ChangeRequest");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _changeRequestNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _projectId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => project_model_1.ConstructionProject), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _projectName_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _contractId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _contractNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _title_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(change_order_types_1.ChangeRequestStatus.DRAFT), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(change_order_types_1.ChangeRequestStatus)),
            })];
        _changeType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(change_order_types_1.ChangeOrderType)),
            })];
        _changeCategory_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(change_order_types_1.ChangeCategory)),
            })];
        _requestedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _requestedByName_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _requestDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _requiredByDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _justification_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _affectedAreas_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _relatedDrawings_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _relatedSpecifications_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _attachments_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _urgency_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('low', 'medium', 'high', 'critical'))];
        _estimatedCostImpact_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _estimatedTimeImpact_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _project_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => project_model_1.ConstructionProject)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _changeRequestNumber_decorators, { kind: "field", name: "changeRequestNumber", static: false, private: false, access: { has: obj => "changeRequestNumber" in obj, get: obj => obj.changeRequestNumber, set: (obj, value) => { obj.changeRequestNumber = value; } }, metadata: _metadata }, _changeRequestNumber_initializers, _changeRequestNumber_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _projectName_decorators, { kind: "field", name: "projectName", static: false, private: false, access: { has: obj => "projectName" in obj, get: obj => obj.projectName, set: (obj, value) => { obj.projectName = value; } }, metadata: _metadata }, _projectName_initializers, _projectName_extraInitializers);
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _contractNumber_decorators, { kind: "field", name: "contractNumber", static: false, private: false, access: { has: obj => "contractNumber" in obj, get: obj => obj.contractNumber, set: (obj, value) => { obj.contractNumber = value; } }, metadata: _metadata }, _contractNumber_initializers, _contractNumber_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _changeType_decorators, { kind: "field", name: "changeType", static: false, private: false, access: { has: obj => "changeType" in obj, get: obj => obj.changeType, set: (obj, value) => { obj.changeType = value; } }, metadata: _metadata }, _changeType_initializers, _changeType_extraInitializers);
        __esDecorate(null, null, _changeCategory_decorators, { kind: "field", name: "changeCategory", static: false, private: false, access: { has: obj => "changeCategory" in obj, get: obj => obj.changeCategory, set: (obj, value) => { obj.changeCategory = value; } }, metadata: _metadata }, _changeCategory_initializers, _changeCategory_extraInitializers);
        __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
        __esDecorate(null, null, _requestedByName_decorators, { kind: "field", name: "requestedByName", static: false, private: false, access: { has: obj => "requestedByName" in obj, get: obj => obj.requestedByName, set: (obj, value) => { obj.requestedByName = value; } }, metadata: _metadata }, _requestedByName_initializers, _requestedByName_extraInitializers);
        __esDecorate(null, null, _requestDate_decorators, { kind: "field", name: "requestDate", static: false, private: false, access: { has: obj => "requestDate" in obj, get: obj => obj.requestDate, set: (obj, value) => { obj.requestDate = value; } }, metadata: _metadata }, _requestDate_initializers, _requestDate_extraInitializers);
        __esDecorate(null, null, _requiredByDate_decorators, { kind: "field", name: "requiredByDate", static: false, private: false, access: { has: obj => "requiredByDate" in obj, get: obj => obj.requiredByDate, set: (obj, value) => { obj.requiredByDate = value; } }, metadata: _metadata }, _requiredByDate_initializers, _requiredByDate_extraInitializers);
        __esDecorate(null, null, _justification_decorators, { kind: "field", name: "justification", static: false, private: false, access: { has: obj => "justification" in obj, get: obj => obj.justification, set: (obj, value) => { obj.justification = value; } }, metadata: _metadata }, _justification_initializers, _justification_extraInitializers);
        __esDecorate(null, null, _affectedAreas_decorators, { kind: "field", name: "affectedAreas", static: false, private: false, access: { has: obj => "affectedAreas" in obj, get: obj => obj.affectedAreas, set: (obj, value) => { obj.affectedAreas = value; } }, metadata: _metadata }, _affectedAreas_initializers, _affectedAreas_extraInitializers);
        __esDecorate(null, null, _relatedDrawings_decorators, { kind: "field", name: "relatedDrawings", static: false, private: false, access: { has: obj => "relatedDrawings" in obj, get: obj => obj.relatedDrawings, set: (obj, value) => { obj.relatedDrawings = value; } }, metadata: _metadata }, _relatedDrawings_initializers, _relatedDrawings_extraInitializers);
        __esDecorate(null, null, _relatedSpecifications_decorators, { kind: "field", name: "relatedSpecifications", static: false, private: false, access: { has: obj => "relatedSpecifications" in obj, get: obj => obj.relatedSpecifications, set: (obj, value) => { obj.relatedSpecifications = value; } }, metadata: _metadata }, _relatedSpecifications_initializers, _relatedSpecifications_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _urgency_decorators, { kind: "field", name: "urgency", static: false, private: false, access: { has: obj => "urgency" in obj, get: obj => obj.urgency, set: (obj, value) => { obj.urgency = value; } }, metadata: _metadata }, _urgency_initializers, _urgency_extraInitializers);
        __esDecorate(null, null, _estimatedCostImpact_decorators, { kind: "field", name: "estimatedCostImpact", static: false, private: false, access: { has: obj => "estimatedCostImpact" in obj, get: obj => obj.estimatedCostImpact, set: (obj, value) => { obj.estimatedCostImpact = value; } }, metadata: _metadata }, _estimatedCostImpact_initializers, _estimatedCostImpact_extraInitializers);
        __esDecorate(null, null, _estimatedTimeImpact_decorators, { kind: "field", name: "estimatedTimeImpact", static: false, private: false, access: { has: obj => "estimatedTimeImpact" in obj, get: obj => obj.estimatedTimeImpact, set: (obj, value) => { obj.estimatedTimeImpact = value; } }, metadata: _metadata }, _estimatedTimeImpact_initializers, _estimatedTimeImpact_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _project_decorators, { kind: "field", name: "project", static: false, private: false, access: { has: obj => "project" in obj, get: obj => obj.project, set: (obj, value) => { obj.project = value; } }, metadata: _metadata }, _project_initializers, _project_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ChangeRequest = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ChangeRequest = _classThis;
})();
exports.ChangeRequest = ChangeRequest;
//# sourceMappingURL=change-request.model.js.map