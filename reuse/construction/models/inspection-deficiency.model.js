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
exports.InspectionDeficiency = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const inspection_types_1 = require("../types/inspection.types");
const construction_inspection_model_1 = require("./construction-inspection.model");
let InspectionDeficiency = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'inspection_deficiencies', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _inspectionId_decorators;
    let _inspectionId_initializers = [];
    let _inspectionId_extraInitializers = [];
    let _deficiencyNumber_decorators;
    let _deficiencyNumber_initializers = [];
    let _deficiencyNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _codeReference_decorators;
    let _codeReference_initializers = [];
    let _codeReference_extraInitializers = [];
    let _requiredAction_decorators;
    let _requiredAction_initializers = [];
    let _requiredAction_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _assignedToName_decorators;
    let _assignedToName_initializers = [];
    let _assignedToName_extraInitializers = [];
    let _assignedAt_decorators;
    let _assignedAt_initializers = [];
    let _assignedAt_extraInitializers = [];
    let _resolvedAt_decorators;
    let _resolvedAt_initializers = [];
    let _resolvedAt_extraInitializers = [];
    let _resolvedBy_decorators;
    let _resolvedBy_initializers = [];
    let _resolvedBy_extraInitializers = [];
    let _resolutionNotes_decorators;
    let _resolutionNotes_initializers = [];
    let _resolutionNotes_extraInitializers = [];
    let _photos_decorators;
    let _photos_initializers = [];
    let _photos_extraInitializers = [];
    let _verifiedAt_decorators;
    let _verifiedAt_initializers = [];
    let _verifiedAt_extraInitializers = [];
    let _verifiedBy_decorators;
    let _verifiedBy_initializers = [];
    let _verifiedBy_extraInitializers = [];
    let _verificationNotes_decorators;
    let _verificationNotes_initializers = [];
    let _verificationNotes_extraInitializers = [];
    let _inspection_decorators;
    let _inspection_initializers = [];
    let _inspection_extraInitializers = [];
    var InspectionDeficiency = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.inspectionId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _inspectionId_initializers, void 0));
            this.deficiencyNumber = (__runInitializers(this, _inspectionId_extraInitializers), __runInitializers(this, _deficiencyNumber_initializers, void 0));
            this.title = (__runInitializers(this, _deficiencyNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.location = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.severity = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.status = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.codeReference = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _codeReference_initializers, void 0));
            this.requiredAction = (__runInitializers(this, _codeReference_extraInitializers), __runInitializers(this, _requiredAction_initializers, void 0));
            this.dueDate = (__runInitializers(this, _requiredAction_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.assignedToName = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _assignedToName_initializers, void 0));
            this.assignedAt = (__runInitializers(this, _assignedToName_extraInitializers), __runInitializers(this, _assignedAt_initializers, void 0));
            this.resolvedAt = (__runInitializers(this, _assignedAt_extraInitializers), __runInitializers(this, _resolvedAt_initializers, void 0));
            this.resolvedBy = (__runInitializers(this, _resolvedAt_extraInitializers), __runInitializers(this, _resolvedBy_initializers, void 0));
            this.resolutionNotes = (__runInitializers(this, _resolvedBy_extraInitializers), __runInitializers(this, _resolutionNotes_initializers, void 0));
            this.photos = (__runInitializers(this, _resolutionNotes_extraInitializers), __runInitializers(this, _photos_initializers, void 0));
            this.verifiedAt = (__runInitializers(this, _photos_extraInitializers), __runInitializers(this, _verifiedAt_initializers, void 0));
            this.verifiedBy = (__runInitializers(this, _verifiedAt_extraInitializers), __runInitializers(this, _verifiedBy_initializers, void 0));
            this.verificationNotes = (__runInitializers(this, _verifiedBy_extraInitializers), __runInitializers(this, _verificationNotes_initializers, void 0));
            this.inspection = (__runInitializers(this, _verificationNotes_extraInitializers), __runInitializers(this, _inspection_initializers, void 0));
            __runInitializers(this, _inspection_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "InspectionDeficiency");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _inspectionId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => construction_inspection_model_1.ConstructionInspection), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _deficiencyNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _title_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _location_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500))];
        _severity_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(inspection_types_1.DeficiencySeverity)),
            })];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(inspection_types_1.DeficiencyStatus.OPEN), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(inspection_types_1.DeficiencyStatus)),
            })];
        _codeReference_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500))];
        _requiredAction_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _dueDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _assignedTo_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _assignedToName_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _assignedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _resolvedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _resolvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _resolutionNotes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _photos_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _verifiedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _verifiedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _verificationNotes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _inspection_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => construction_inspection_model_1.ConstructionInspection)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _inspectionId_decorators, { kind: "field", name: "inspectionId", static: false, private: false, access: { has: obj => "inspectionId" in obj, get: obj => obj.inspectionId, set: (obj, value) => { obj.inspectionId = value; } }, metadata: _metadata }, _inspectionId_initializers, _inspectionId_extraInitializers);
        __esDecorate(null, null, _deficiencyNumber_decorators, { kind: "field", name: "deficiencyNumber", static: false, private: false, access: { has: obj => "deficiencyNumber" in obj, get: obj => obj.deficiencyNumber, set: (obj, value) => { obj.deficiencyNumber = value; } }, metadata: _metadata }, _deficiencyNumber_initializers, _deficiencyNumber_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _codeReference_decorators, { kind: "field", name: "codeReference", static: false, private: false, access: { has: obj => "codeReference" in obj, get: obj => obj.codeReference, set: (obj, value) => { obj.codeReference = value; } }, metadata: _metadata }, _codeReference_initializers, _codeReference_extraInitializers);
        __esDecorate(null, null, _requiredAction_decorators, { kind: "field", name: "requiredAction", static: false, private: false, access: { has: obj => "requiredAction" in obj, get: obj => obj.requiredAction, set: (obj, value) => { obj.requiredAction = value; } }, metadata: _metadata }, _requiredAction_initializers, _requiredAction_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _assignedToName_decorators, { kind: "field", name: "assignedToName", static: false, private: false, access: { has: obj => "assignedToName" in obj, get: obj => obj.assignedToName, set: (obj, value) => { obj.assignedToName = value; } }, metadata: _metadata }, _assignedToName_initializers, _assignedToName_extraInitializers);
        __esDecorate(null, null, _assignedAt_decorators, { kind: "field", name: "assignedAt", static: false, private: false, access: { has: obj => "assignedAt" in obj, get: obj => obj.assignedAt, set: (obj, value) => { obj.assignedAt = value; } }, metadata: _metadata }, _assignedAt_initializers, _assignedAt_extraInitializers);
        __esDecorate(null, null, _resolvedAt_decorators, { kind: "field", name: "resolvedAt", static: false, private: false, access: { has: obj => "resolvedAt" in obj, get: obj => obj.resolvedAt, set: (obj, value) => { obj.resolvedAt = value; } }, metadata: _metadata }, _resolvedAt_initializers, _resolvedAt_extraInitializers);
        __esDecorate(null, null, _resolvedBy_decorators, { kind: "field", name: "resolvedBy", static: false, private: false, access: { has: obj => "resolvedBy" in obj, get: obj => obj.resolvedBy, set: (obj, value) => { obj.resolvedBy = value; } }, metadata: _metadata }, _resolvedBy_initializers, _resolvedBy_extraInitializers);
        __esDecorate(null, null, _resolutionNotes_decorators, { kind: "field", name: "resolutionNotes", static: false, private: false, access: { has: obj => "resolutionNotes" in obj, get: obj => obj.resolutionNotes, set: (obj, value) => { obj.resolutionNotes = value; } }, metadata: _metadata }, _resolutionNotes_initializers, _resolutionNotes_extraInitializers);
        __esDecorate(null, null, _photos_decorators, { kind: "field", name: "photos", static: false, private: false, access: { has: obj => "photos" in obj, get: obj => obj.photos, set: (obj, value) => { obj.photos = value; } }, metadata: _metadata }, _photos_initializers, _photos_extraInitializers);
        __esDecorate(null, null, _verifiedAt_decorators, { kind: "field", name: "verifiedAt", static: false, private: false, access: { has: obj => "verifiedAt" in obj, get: obj => obj.verifiedAt, set: (obj, value) => { obj.verifiedAt = value; } }, metadata: _metadata }, _verifiedAt_initializers, _verifiedAt_extraInitializers);
        __esDecorate(null, null, _verifiedBy_decorators, { kind: "field", name: "verifiedBy", static: false, private: false, access: { has: obj => "verifiedBy" in obj, get: obj => obj.verifiedBy, set: (obj, value) => { obj.verifiedBy = value; } }, metadata: _metadata }, _verifiedBy_initializers, _verifiedBy_extraInitializers);
        __esDecorate(null, null, _verificationNotes_decorators, { kind: "field", name: "verificationNotes", static: false, private: false, access: { has: obj => "verificationNotes" in obj, get: obj => obj.verificationNotes, set: (obj, value) => { obj.verificationNotes = value; } }, metadata: _metadata }, _verificationNotes_initializers, _verificationNotes_extraInitializers);
        __esDecorate(null, null, _inspection_decorators, { kind: "field", name: "inspection", static: false, private: false, access: { has: obj => "inspection" in obj, get: obj => obj.inspection, set: (obj, value) => { obj.inspection = value; } }, metadata: _metadata }, _inspection_initializers, _inspection_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InspectionDeficiency = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InspectionDeficiency = _classThis;
})();
exports.InspectionDeficiency = InspectionDeficiency;
//# sourceMappingURL=inspection-deficiency.model.js.map