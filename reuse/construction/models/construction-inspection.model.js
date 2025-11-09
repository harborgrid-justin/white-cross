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
exports.ConstructionInspection = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const inspection_types_1 = require("../types/inspection.types");
const inspection_deficiency_model_1 = require("./inspection-deficiency.model");
const inspection_checklist_item_model_1 = require("./inspection-checklist-item.model");
let ConstructionInspection = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'construction_inspections', timestamps: true, paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _inspectionNumber_decorators;
    let _inspectionNumber_initializers = [];
    let _inspectionNumber_extraInitializers = [];
    let _inspectionType_decorators;
    let _inspectionType_initializers = [];
    let _inspectionType_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _building_decorators;
    let _building_initializers = [];
    let _building_extraInitializers = [];
    let _level_decorators;
    let _level_initializers = [];
    let _level_extraInitializers = [];
    let _zone_decorators;
    let _zone_initializers = [];
    let _zone_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _actualStartTime_decorators;
    let _actualStartTime_initializers = [];
    let _actualStartTime_extraInitializers = [];
    let _actualEndTime_decorators;
    let _actualEndTime_initializers = [];
    let _actualEndTime_extraInitializers = [];
    let _inspectorId_decorators;
    let _inspectorId_initializers = [];
    let _inspectorId_extraInitializers = [];
    let _inspectorName_decorators;
    let _inspectorName_initializers = [];
    let _inspectorName_extraInitializers = [];
    let _inspectorType_decorators;
    let _inspectorType_initializers = [];
    let _inspectorType_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _requestedAt_decorators;
    let _requestedAt_initializers = [];
    let _requestedAt_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _result_decorators;
    let _result_initializers = [];
    let _result_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _permitId_decorators;
    let _permitId_initializers = [];
    let _permitId_extraInitializers = [];
    let _checklistTemplateId_decorators;
    let _checklistTemplateId_initializers = [];
    let _checklistTemplateId_extraInitializers = [];
    let _requiresReinspection_decorators;
    let _requiresReinspection_initializers = [];
    let _requiresReinspection_extraInitializers = [];
    let _reinspectionOfId_decorators;
    let _reinspectionOfId_initializers = [];
    let _reinspectionOfId_extraInitializers = [];
    let _deficiencyCount_decorators;
    let _deficiencyCount_initializers = [];
    let _deficiencyCount_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _deficiencies_decorators;
    let _deficiencies_initializers = [];
    let _deficiencies_extraInitializers = [];
    let _checklistItems_decorators;
    let _checklistItems_initializers = [];
    let _checklistItems_extraInitializers = [];
    var ConstructionInspection = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.inspectionNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _inspectionNumber_initializers, void 0));
            this.inspectionType = (__runInitializers(this, _inspectionNumber_extraInitializers), __runInitializers(this, _inspectionType_initializers, void 0));
            this.projectId = (__runInitializers(this, _inspectionType_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.location = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.building = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _building_initializers, void 0));
            this.level = (__runInitializers(this, _building_extraInitializers), __runInitializers(this, _level_initializers, void 0));
            this.zone = (__runInitializers(this, _level_extraInitializers), __runInitializers(this, _zone_initializers, void 0));
            this.status = (__runInitializers(this, _zone_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.scheduledDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
            this.actualStartTime = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _actualStartTime_initializers, void 0));
            this.actualEndTime = (__runInitializers(this, _actualStartTime_extraInitializers), __runInitializers(this, _actualEndTime_initializers, void 0));
            this.inspectorId = (__runInitializers(this, _actualEndTime_extraInitializers), __runInitializers(this, _inspectorId_initializers, void 0));
            this.inspectorName = (__runInitializers(this, _inspectorId_extraInitializers), __runInitializers(this, _inspectorName_initializers, void 0));
            this.inspectorType = (__runInitializers(this, _inspectorName_extraInitializers), __runInitializers(this, _inspectorType_initializers, void 0));
            this.requestedBy = (__runInitializers(this, _inspectorType_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
            this.requestedAt = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _requestedAt_initializers, void 0));
            this.description = (__runInitializers(this, _requestedAt_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.result = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _result_initializers, void 0));
            this.notes = (__runInitializers(this, _result_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.comments = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
            this.attachments = (__runInitializers(this, _comments_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.permitId = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _permitId_initializers, void 0));
            this.checklistTemplateId = (__runInitializers(this, _permitId_extraInitializers), __runInitializers(this, _checklistTemplateId_initializers, void 0));
            this.requiresReinspection = (__runInitializers(this, _checklistTemplateId_extraInitializers), __runInitializers(this, _requiresReinspection_initializers, void 0));
            this.reinspectionOfId = (__runInitializers(this, _requiresReinspection_extraInitializers), __runInitializers(this, _reinspectionOfId_initializers, void 0));
            this.deficiencyCount = (__runInitializers(this, _reinspectionOfId_extraInitializers), __runInitializers(this, _deficiencyCount_initializers, void 0));
            this.metadata = (__runInitializers(this, _deficiencyCount_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.deficiencies = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _deficiencies_initializers, void 0));
            this.checklistItems = (__runInitializers(this, _deficiencies_extraInitializers), __runInitializers(this, _checklistItems_initializers, void 0));
            __runInitializers(this, _checklistItems_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConstructionInspection");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _inspectionNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _inspectionType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(inspection_types_1.InspectionType)),
            })];
        _projectId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _location_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500))];
        _building_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _level_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _zone_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(inspection_types_1.InspectionStatus.SCHEDULED), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(inspection_types_1.InspectionStatus)),
            })];
        _scheduledDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _actualStartTime_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _actualEndTime_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _inspectorId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _inspectorName_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _inspectorType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(inspection_types_1.InspectorType)),
            })];
        _requestedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _requestedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _description_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _result_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(inspection_types_1.InspectionResult)),
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _comments_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _attachments_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _permitId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _checklistTemplateId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _requiresReinspection_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _reinspectionOfId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _deficiencyCount_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _deficiencies_decorators = [(0, sequelize_typescript_1.HasMany)(() => inspection_deficiency_model_1.InspectionDeficiency, 'inspectionId')];
        _checklistItems_decorators = [(0, sequelize_typescript_1.HasMany)(() => inspection_checklist_item_model_1.InspectionChecklistItem, 'inspectionId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _inspectionNumber_decorators, { kind: "field", name: "inspectionNumber", static: false, private: false, access: { has: obj => "inspectionNumber" in obj, get: obj => obj.inspectionNumber, set: (obj, value) => { obj.inspectionNumber = value; } }, metadata: _metadata }, _inspectionNumber_initializers, _inspectionNumber_extraInitializers);
        __esDecorate(null, null, _inspectionType_decorators, { kind: "field", name: "inspectionType", static: false, private: false, access: { has: obj => "inspectionType" in obj, get: obj => obj.inspectionType, set: (obj, value) => { obj.inspectionType = value; } }, metadata: _metadata }, _inspectionType_initializers, _inspectionType_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _building_decorators, { kind: "field", name: "building", static: false, private: false, access: { has: obj => "building" in obj, get: obj => obj.building, set: (obj, value) => { obj.building = value; } }, metadata: _metadata }, _building_initializers, _building_extraInitializers);
        __esDecorate(null, null, _level_decorators, { kind: "field", name: "level", static: false, private: false, access: { has: obj => "level" in obj, get: obj => obj.level, set: (obj, value) => { obj.level = value; } }, metadata: _metadata }, _level_initializers, _level_extraInitializers);
        __esDecorate(null, null, _zone_decorators, { kind: "field", name: "zone", static: false, private: false, access: { has: obj => "zone" in obj, get: obj => obj.zone, set: (obj, value) => { obj.zone = value; } }, metadata: _metadata }, _zone_initializers, _zone_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
        __esDecorate(null, null, _actualStartTime_decorators, { kind: "field", name: "actualStartTime", static: false, private: false, access: { has: obj => "actualStartTime" in obj, get: obj => obj.actualStartTime, set: (obj, value) => { obj.actualStartTime = value; } }, metadata: _metadata }, _actualStartTime_initializers, _actualStartTime_extraInitializers);
        __esDecorate(null, null, _actualEndTime_decorators, { kind: "field", name: "actualEndTime", static: false, private: false, access: { has: obj => "actualEndTime" in obj, get: obj => obj.actualEndTime, set: (obj, value) => { obj.actualEndTime = value; } }, metadata: _metadata }, _actualEndTime_initializers, _actualEndTime_extraInitializers);
        __esDecorate(null, null, _inspectorId_decorators, { kind: "field", name: "inspectorId", static: false, private: false, access: { has: obj => "inspectorId" in obj, get: obj => obj.inspectorId, set: (obj, value) => { obj.inspectorId = value; } }, metadata: _metadata }, _inspectorId_initializers, _inspectorId_extraInitializers);
        __esDecorate(null, null, _inspectorName_decorators, { kind: "field", name: "inspectorName", static: false, private: false, access: { has: obj => "inspectorName" in obj, get: obj => obj.inspectorName, set: (obj, value) => { obj.inspectorName = value; } }, metadata: _metadata }, _inspectorName_initializers, _inspectorName_extraInitializers);
        __esDecorate(null, null, _inspectorType_decorators, { kind: "field", name: "inspectorType", static: false, private: false, access: { has: obj => "inspectorType" in obj, get: obj => obj.inspectorType, set: (obj, value) => { obj.inspectorType = value; } }, metadata: _metadata }, _inspectorType_initializers, _inspectorType_extraInitializers);
        __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
        __esDecorate(null, null, _requestedAt_decorators, { kind: "field", name: "requestedAt", static: false, private: false, access: { has: obj => "requestedAt" in obj, get: obj => obj.requestedAt, set: (obj, value) => { obj.requestedAt = value; } }, metadata: _metadata }, _requestedAt_initializers, _requestedAt_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _result_decorators, { kind: "field", name: "result", static: false, private: false, access: { has: obj => "result" in obj, get: obj => obj.result, set: (obj, value) => { obj.result = value; } }, metadata: _metadata }, _result_initializers, _result_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _permitId_decorators, { kind: "field", name: "permitId", static: false, private: false, access: { has: obj => "permitId" in obj, get: obj => obj.permitId, set: (obj, value) => { obj.permitId = value; } }, metadata: _metadata }, _permitId_initializers, _permitId_extraInitializers);
        __esDecorate(null, null, _checklistTemplateId_decorators, { kind: "field", name: "checklistTemplateId", static: false, private: false, access: { has: obj => "checklistTemplateId" in obj, get: obj => obj.checklistTemplateId, set: (obj, value) => { obj.checklistTemplateId = value; } }, metadata: _metadata }, _checklistTemplateId_initializers, _checklistTemplateId_extraInitializers);
        __esDecorate(null, null, _requiresReinspection_decorators, { kind: "field", name: "requiresReinspection", static: false, private: false, access: { has: obj => "requiresReinspection" in obj, get: obj => obj.requiresReinspection, set: (obj, value) => { obj.requiresReinspection = value; } }, metadata: _metadata }, _requiresReinspection_initializers, _requiresReinspection_extraInitializers);
        __esDecorate(null, null, _reinspectionOfId_decorators, { kind: "field", name: "reinspectionOfId", static: false, private: false, access: { has: obj => "reinspectionOfId" in obj, get: obj => obj.reinspectionOfId, set: (obj, value) => { obj.reinspectionOfId = value; } }, metadata: _metadata }, _reinspectionOfId_initializers, _reinspectionOfId_extraInitializers);
        __esDecorate(null, null, _deficiencyCount_decorators, { kind: "field", name: "deficiencyCount", static: false, private: false, access: { has: obj => "deficiencyCount" in obj, get: obj => obj.deficiencyCount, set: (obj, value) => { obj.deficiencyCount = value; } }, metadata: _metadata }, _deficiencyCount_initializers, _deficiencyCount_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _deficiencies_decorators, { kind: "field", name: "deficiencies", static: false, private: false, access: { has: obj => "deficiencies" in obj, get: obj => obj.deficiencies, set: (obj, value) => { obj.deficiencies = value; } }, metadata: _metadata }, _deficiencies_initializers, _deficiencies_extraInitializers);
        __esDecorate(null, null, _checklistItems_decorators, { kind: "field", name: "checklistItems", static: false, private: false, access: { has: obj => "checklistItems" in obj, get: obj => obj.checklistItems, set: (obj, value) => { obj.checklistItems = value; } }, metadata: _metadata }, _checklistItems_initializers, _checklistItems_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConstructionInspection = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConstructionInspection = _classThis;
})();
exports.ConstructionInspection = ConstructionInspection;
//# sourceMappingURL=construction-inspection.model.js.map