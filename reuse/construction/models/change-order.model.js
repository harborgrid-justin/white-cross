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
exports.ChangeOrder = exports.ChangeOrderType = exports.ChangeOrderStatus = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const project_model_1 = require("./project.model");
var ChangeOrderStatus;
(function (ChangeOrderStatus) {
    ChangeOrderStatus["DRAFT"] = "DRAFT";
    ChangeOrderStatus["SUBMITTED"] = "SUBMITTED";
    ChangeOrderStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    ChangeOrderStatus["APPROVED"] = "APPROVED";
    ChangeOrderStatus["REJECTED"] = "REJECTED";
    ChangeOrderStatus["IMPLEMENTED"] = "IMPLEMENTED";
})(ChangeOrderStatus || (exports.ChangeOrderStatus = ChangeOrderStatus = {}));
var ChangeOrderType;
(function (ChangeOrderType) {
    ChangeOrderType["SCOPE"] = "SCOPE";
    ChangeOrderType["SCHEDULE"] = "SCHEDULE";
    ChangeOrderType["COST"] = "COST";
    ChangeOrderType["COMBINED"] = "COMBINED";
})(ChangeOrderType || (exports.ChangeOrderType = ChangeOrderType = {}));
let ChangeOrder = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'change_orders',
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
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _changeType_decorators;
    let _changeType_initializers = [];
    let _changeType_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _costImpact_decorators;
    let _costImpact_initializers = [];
    let _costImpact_extraInitializers = [];
    let _scheduleImpact_decorators;
    let _scheduleImpact_initializers = [];
    let _scheduleImpact_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _implementedDate_decorators;
    let _implementedDate_initializers = [];
    let _implementedDate_extraInitializers = [];
    let _project_decorators;
    let _project_initializers = [];
    let _project_extraInitializers = [];
    var ChangeOrder = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.changeOrderNumber = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _changeOrderNumber_initializers, void 0));
            this.title = (__runInitializers(this, _changeOrderNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.changeType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _changeType_initializers, void 0));
            this.requestedBy = (__runInitializers(this, _changeType_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
            this.costImpact = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _costImpact_initializers, void 0));
            this.scheduleImpact = (__runInitializers(this, _costImpact_extraInitializers), __runInitializers(this, _scheduleImpact_initializers, void 0)); // in days
            this.status = (__runInitializers(this, _scheduleImpact_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.implementedDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _implementedDate_initializers, void 0));
            this.project = (__runInitializers(this, _implementedDate_extraInitializers), __runInitializers(this, _project_initializers, void 0));
            __runInitializers(this, _project_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ChangeOrder");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _projectId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => project_model_1.ConstructionProject), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _changeOrderNumber_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _title_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _changeType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ChangeOrderType)),
            })];
        _requestedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _costImpact_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _scheduleImpact_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(ChangeOrderStatus.DRAFT), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ChangeOrderStatus)),
            })];
        _implementedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _project_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => project_model_1.ConstructionProject)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _changeOrderNumber_decorators, { kind: "field", name: "changeOrderNumber", static: false, private: false, access: { has: obj => "changeOrderNumber" in obj, get: obj => obj.changeOrderNumber, set: (obj, value) => { obj.changeOrderNumber = value; } }, metadata: _metadata }, _changeOrderNumber_initializers, _changeOrderNumber_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _changeType_decorators, { kind: "field", name: "changeType", static: false, private: false, access: { has: obj => "changeType" in obj, get: obj => obj.changeType, set: (obj, value) => { obj.changeType = value; } }, metadata: _metadata }, _changeType_initializers, _changeType_extraInitializers);
        __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
        __esDecorate(null, null, _costImpact_decorators, { kind: "field", name: "costImpact", static: false, private: false, access: { has: obj => "costImpact" in obj, get: obj => obj.costImpact, set: (obj, value) => { obj.costImpact = value; } }, metadata: _metadata }, _costImpact_initializers, _costImpact_extraInitializers);
        __esDecorate(null, null, _scheduleImpact_decorators, { kind: "field", name: "scheduleImpact", static: false, private: false, access: { has: obj => "scheduleImpact" in obj, get: obj => obj.scheduleImpact, set: (obj, value) => { obj.scheduleImpact = value; } }, metadata: _metadata }, _scheduleImpact_initializers, _scheduleImpact_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _implementedDate_decorators, { kind: "field", name: "implementedDate", static: false, private: false, access: { has: obj => "implementedDate" in obj, get: obj => obj.implementedDate, set: (obj, value) => { obj.implementedDate = value; } }, metadata: _metadata }, _implementedDate_initializers, _implementedDate_extraInitializers);
        __esDecorate(null, null, _project_decorators, { kind: "field", name: "project", static: false, private: false, access: { has: obj => "project" in obj, get: obj => obj.project, set: (obj, value) => { obj.project = value; } }, metadata: _metadata }, _project_initializers, _project_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ChangeOrder = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ChangeOrder = _classThis;
})();
exports.ChangeOrder = ChangeOrder;
//# sourceMappingURL=change-order.model.js.map