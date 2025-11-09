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
exports.QualityDeficiency = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const quality_types_1 = require("../types/quality.types");
let QualityDeficiency = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'quality_deficiencies',
            timestamps: true,
            indexes: [
                { fields: ['deficiencyNumber'], unique: true },
                { fields: ['inspectionId'] },
                { fields: ['projectId'] },
                { fields: ['severity'] },
                { fields: ['status'] },
                { fields: ['assignedTo'] },
                { fields: ['dueDate'] },
                { fields: ['identifiedDate'] },
                { fields: ['isPunchListItem'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _deficiencyNumber_decorators;
    let _deficiencyNumber_initializers = [];
    let _deficiencyNumber_extraInitializers = [];
    let _inspectionId_decorators;
    let _inspectionId_initializers = [];
    let _inspectionId_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _trade_decorators;
    let _trade_initializers = [];
    let _trade_extraInitializers = [];
    let _specification_decorators;
    let _specification_initializers = [];
    let _specification_extraInitializers = [];
    let _identifiedBy_decorators;
    let _identifiedBy_initializers = [];
    let _identifiedBy_extraInitializers = [];
    let _identifiedDate_decorators;
    let _identifiedDate_initializers = [];
    let _identifiedDate_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _assignedDate_decorators;
    let _assignedDate_initializers = [];
    let _assignedDate_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _rootCause_decorators;
    let _rootCause_initializers = [];
    let _rootCause_extraInitializers = [];
    let _correctiveAction_decorators;
    let _correctiveAction_initializers = [];
    let _correctiveAction_extraInitializers = [];
    let _resolvedBy_decorators;
    let _resolvedBy_initializers = [];
    let _resolvedBy_extraInitializers = [];
    let _resolvedDate_decorators;
    let _resolvedDate_initializers = [];
    let _resolvedDate_extraInitializers = [];
    let _verifiedBy_decorators;
    let _verifiedBy_initializers = [];
    let _verifiedBy_extraInitializers = [];
    let _verifiedDate_decorators;
    let _verifiedDate_initializers = [];
    let _verifiedDate_extraInitializers = [];
    let _photos_decorators;
    let _photos_initializers = [];
    let _photos_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _cost_decorators;
    let _cost_initializers = [];
    let _cost_extraInitializers = [];
    let _isPunchListItem_decorators;
    let _isPunchListItem_initializers = [];
    let _isPunchListItem_extraInitializers = [];
    let _requiresRetest_decorators;
    let _requiresRetest_initializers = [];
    let _requiresRetest_extraInitializers = [];
    let _escalationLevel_decorators;
    let _escalationLevel_initializers = [];
    let _escalationLevel_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var QualityDeficiency = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.deficiencyNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _deficiencyNumber_initializers, void 0));
            this.inspectionId = (__runInitializers(this, _deficiencyNumber_extraInitializers), __runInitializers(this, _inspectionId_initializers, void 0));
            this.projectId = (__runInitializers(this, _inspectionId_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.location = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.description = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.severity = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.category = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.trade = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _trade_initializers, void 0));
            this.specification = (__runInitializers(this, _trade_extraInitializers), __runInitializers(this, _specification_initializers, void 0));
            this.identifiedBy = (__runInitializers(this, _specification_extraInitializers), __runInitializers(this, _identifiedBy_initializers, void 0));
            this.identifiedDate = (__runInitializers(this, _identifiedBy_extraInitializers), __runInitializers(this, _identifiedDate_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _identifiedDate_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.assignedDate = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _assignedDate_initializers, void 0));
            this.dueDate = (__runInitializers(this, _assignedDate_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.status = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.rootCause = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _rootCause_initializers, void 0));
            this.correctiveAction = (__runInitializers(this, _rootCause_extraInitializers), __runInitializers(this, _correctiveAction_initializers, void 0));
            this.resolvedBy = (__runInitializers(this, _correctiveAction_extraInitializers), __runInitializers(this, _resolvedBy_initializers, void 0));
            this.resolvedDate = (__runInitializers(this, _resolvedBy_extraInitializers), __runInitializers(this, _resolvedDate_initializers, void 0));
            this.verifiedBy = (__runInitializers(this, _resolvedDate_extraInitializers), __runInitializers(this, _verifiedBy_initializers, void 0));
            this.verifiedDate = (__runInitializers(this, _verifiedBy_extraInitializers), __runInitializers(this, _verifiedDate_initializers, void 0));
            this.photos = (__runInitializers(this, _verifiedDate_extraInitializers), __runInitializers(this, _photos_initializers, void 0));
            this.attachments = (__runInitializers(this, _photos_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.cost = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _cost_initializers, void 0));
            this.isPunchListItem = (__runInitializers(this, _cost_extraInitializers), __runInitializers(this, _isPunchListItem_initializers, void 0));
            this.requiresRetest = (__runInitializers(this, _isPunchListItem_extraInitializers), __runInitializers(this, _requiresRetest_initializers, void 0));
            this.escalationLevel = (__runInitializers(this, _requiresRetest_extraInitializers), __runInitializers(this, _escalationLevel_initializers, void 0));
            this.metadata = (__runInitializers(this, _escalationLevel_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdBy = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "QualityDeficiency");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.INTEGER), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _deficiencyNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _inspectionId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _projectId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _location_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _severity_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(quality_types_1.DeficiencySeverity)),
            })];
        _category_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _trade_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _specification_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _identifiedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _identifiedDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _assignedTo_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _assignedDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _dueDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(quality_types_1.DeficiencyStatus.OPEN), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(quality_types_1.DeficiencyStatus)),
            })];
        _rootCause_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _correctiveAction_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _resolvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _resolvedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _verifiedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _verifiedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _photos_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _attachments_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _cost_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(12, 2))];
        _isPunchListItem_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _requiresRetest_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _escalationLevel_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _createdBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _updatedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _deficiencyNumber_decorators, { kind: "field", name: "deficiencyNumber", static: false, private: false, access: { has: obj => "deficiencyNumber" in obj, get: obj => obj.deficiencyNumber, set: (obj, value) => { obj.deficiencyNumber = value; } }, metadata: _metadata }, _deficiencyNumber_initializers, _deficiencyNumber_extraInitializers);
        __esDecorate(null, null, _inspectionId_decorators, { kind: "field", name: "inspectionId", static: false, private: false, access: { has: obj => "inspectionId" in obj, get: obj => obj.inspectionId, set: (obj, value) => { obj.inspectionId = value; } }, metadata: _metadata }, _inspectionId_initializers, _inspectionId_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _trade_decorators, { kind: "field", name: "trade", static: false, private: false, access: { has: obj => "trade" in obj, get: obj => obj.trade, set: (obj, value) => { obj.trade = value; } }, metadata: _metadata }, _trade_initializers, _trade_extraInitializers);
        __esDecorate(null, null, _specification_decorators, { kind: "field", name: "specification", static: false, private: false, access: { has: obj => "specification" in obj, get: obj => obj.specification, set: (obj, value) => { obj.specification = value; } }, metadata: _metadata }, _specification_initializers, _specification_extraInitializers);
        __esDecorate(null, null, _identifiedBy_decorators, { kind: "field", name: "identifiedBy", static: false, private: false, access: { has: obj => "identifiedBy" in obj, get: obj => obj.identifiedBy, set: (obj, value) => { obj.identifiedBy = value; } }, metadata: _metadata }, _identifiedBy_initializers, _identifiedBy_extraInitializers);
        __esDecorate(null, null, _identifiedDate_decorators, { kind: "field", name: "identifiedDate", static: false, private: false, access: { has: obj => "identifiedDate" in obj, get: obj => obj.identifiedDate, set: (obj, value) => { obj.identifiedDate = value; } }, metadata: _metadata }, _identifiedDate_initializers, _identifiedDate_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _assignedDate_decorators, { kind: "field", name: "assignedDate", static: false, private: false, access: { has: obj => "assignedDate" in obj, get: obj => obj.assignedDate, set: (obj, value) => { obj.assignedDate = value; } }, metadata: _metadata }, _assignedDate_initializers, _assignedDate_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _rootCause_decorators, { kind: "field", name: "rootCause", static: false, private: false, access: { has: obj => "rootCause" in obj, get: obj => obj.rootCause, set: (obj, value) => { obj.rootCause = value; } }, metadata: _metadata }, _rootCause_initializers, _rootCause_extraInitializers);
        __esDecorate(null, null, _correctiveAction_decorators, { kind: "field", name: "correctiveAction", static: false, private: false, access: { has: obj => "correctiveAction" in obj, get: obj => obj.correctiveAction, set: (obj, value) => { obj.correctiveAction = value; } }, metadata: _metadata }, _correctiveAction_initializers, _correctiveAction_extraInitializers);
        __esDecorate(null, null, _resolvedBy_decorators, { kind: "field", name: "resolvedBy", static: false, private: false, access: { has: obj => "resolvedBy" in obj, get: obj => obj.resolvedBy, set: (obj, value) => { obj.resolvedBy = value; } }, metadata: _metadata }, _resolvedBy_initializers, _resolvedBy_extraInitializers);
        __esDecorate(null, null, _resolvedDate_decorators, { kind: "field", name: "resolvedDate", static: false, private: false, access: { has: obj => "resolvedDate" in obj, get: obj => obj.resolvedDate, set: (obj, value) => { obj.resolvedDate = value; } }, metadata: _metadata }, _resolvedDate_initializers, _resolvedDate_extraInitializers);
        __esDecorate(null, null, _verifiedBy_decorators, { kind: "field", name: "verifiedBy", static: false, private: false, access: { has: obj => "verifiedBy" in obj, get: obj => obj.verifiedBy, set: (obj, value) => { obj.verifiedBy = value; } }, metadata: _metadata }, _verifiedBy_initializers, _verifiedBy_extraInitializers);
        __esDecorate(null, null, _verifiedDate_decorators, { kind: "field", name: "verifiedDate", static: false, private: false, access: { has: obj => "verifiedDate" in obj, get: obj => obj.verifiedDate, set: (obj, value) => { obj.verifiedDate = value; } }, metadata: _metadata }, _verifiedDate_initializers, _verifiedDate_extraInitializers);
        __esDecorate(null, null, _photos_decorators, { kind: "field", name: "photos", static: false, private: false, access: { has: obj => "photos" in obj, get: obj => obj.photos, set: (obj, value) => { obj.photos = value; } }, metadata: _metadata }, _photos_initializers, _photos_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _cost_decorators, { kind: "field", name: "cost", static: false, private: false, access: { has: obj => "cost" in obj, get: obj => obj.cost, set: (obj, value) => { obj.cost = value; } }, metadata: _metadata }, _cost_initializers, _cost_extraInitializers);
        __esDecorate(null, null, _isPunchListItem_decorators, { kind: "field", name: "isPunchListItem", static: false, private: false, access: { has: obj => "isPunchListItem" in obj, get: obj => obj.isPunchListItem, set: (obj, value) => { obj.isPunchListItem = value; } }, metadata: _metadata }, _isPunchListItem_initializers, _isPunchListItem_extraInitializers);
        __esDecorate(null, null, _requiresRetest_decorators, { kind: "field", name: "requiresRetest", static: false, private: false, access: { has: obj => "requiresRetest" in obj, get: obj => obj.requiresRetest, set: (obj, value) => { obj.requiresRetest = value; } }, metadata: _metadata }, _requiresRetest_initializers, _requiresRetest_extraInitializers);
        __esDecorate(null, null, _escalationLevel_decorators, { kind: "field", name: "escalationLevel", static: false, private: false, access: { has: obj => "escalationLevel" in obj, get: obj => obj.escalationLevel, set: (obj, value) => { obj.escalationLevel = value; } }, metadata: _metadata }, _escalationLevel_initializers, _escalationLevel_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        QualityDeficiency = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return QualityDeficiency = _classThis;
})();
exports.QualityDeficiency = QualityDeficiency;
//# sourceMappingURL=quality-deficiency.model.js.map