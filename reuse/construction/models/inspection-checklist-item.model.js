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
exports.InspectionChecklistItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const construction_inspection_model_1 = require("./construction-inspection.model");
let InspectionChecklistItem = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'inspection_checklist_items', timestamps: true })];
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
    let _sequence_decorators;
    let _sequence_initializers = [];
    let _sequence_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _itemText_decorators;
    let _itemText_initializers = [];
    let _itemText_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _isRequired_decorators;
    let _isRequired_initializers = [];
    let _isRequired_extraInitializers = [];
    let _isCompliant_decorators;
    let _isCompliant_initializers = [];
    let _isCompliant_extraInitializers = [];
    let _isNotApplicable_decorators;
    let _isNotApplicable_initializers = [];
    let _isNotApplicable_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _codeReference_decorators;
    let _codeReference_initializers = [];
    let _codeReference_extraInitializers = [];
    let _photos_decorators;
    let _photos_initializers = [];
    let _photos_extraInitializers = [];
    let _checkedAt_decorators;
    let _checkedAt_initializers = [];
    let _checkedAt_extraInitializers = [];
    let _checkedBy_decorators;
    let _checkedBy_initializers = [];
    let _checkedBy_extraInitializers = [];
    let _inspection_decorators;
    let _inspection_initializers = [];
    let _inspection_extraInitializers = [];
    var InspectionChecklistItem = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.inspectionId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _inspectionId_initializers, void 0));
            this.sequence = (__runInitializers(this, _inspectionId_extraInitializers), __runInitializers(this, _sequence_initializers, void 0));
            this.category = (__runInitializers(this, _sequence_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.itemText = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _itemText_initializers, void 0));
            this.description = (__runInitializers(this, _itemText_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.isRequired = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _isRequired_initializers, void 0));
            this.isCompliant = (__runInitializers(this, _isRequired_extraInitializers), __runInitializers(this, _isCompliant_initializers, void 0));
            this.isNotApplicable = (__runInitializers(this, _isCompliant_extraInitializers), __runInitializers(this, _isNotApplicable_initializers, void 0));
            this.notes = (__runInitializers(this, _isNotApplicable_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.codeReference = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _codeReference_initializers, void 0));
            this.photos = (__runInitializers(this, _codeReference_extraInitializers), __runInitializers(this, _photos_initializers, void 0));
            this.checkedAt = (__runInitializers(this, _photos_extraInitializers), __runInitializers(this, _checkedAt_initializers, void 0));
            this.checkedBy = (__runInitializers(this, _checkedAt_extraInitializers), __runInitializers(this, _checkedBy_initializers, void 0));
            this.inspection = (__runInitializers(this, _checkedBy_extraInitializers), __runInitializers(this, _inspection_initializers, void 0));
            __runInitializers(this, _inspection_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "InspectionChecklistItem");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _inspectionId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => construction_inspection_model_1.ConstructionInspection), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _sequence_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _category_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _itemText_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500))];
        _description_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _isRequired_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _isCompliant_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _isNotApplicable_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _notes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _codeReference_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500))];
        _photos_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _checkedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _checkedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _inspection_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => construction_inspection_model_1.ConstructionInspection)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _inspectionId_decorators, { kind: "field", name: "inspectionId", static: false, private: false, access: { has: obj => "inspectionId" in obj, get: obj => obj.inspectionId, set: (obj, value) => { obj.inspectionId = value; } }, metadata: _metadata }, _inspectionId_initializers, _inspectionId_extraInitializers);
        __esDecorate(null, null, _sequence_decorators, { kind: "field", name: "sequence", static: false, private: false, access: { has: obj => "sequence" in obj, get: obj => obj.sequence, set: (obj, value) => { obj.sequence = value; } }, metadata: _metadata }, _sequence_initializers, _sequence_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _itemText_decorators, { kind: "field", name: "itemText", static: false, private: false, access: { has: obj => "itemText" in obj, get: obj => obj.itemText, set: (obj, value) => { obj.itemText = value; } }, metadata: _metadata }, _itemText_initializers, _itemText_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _isRequired_decorators, { kind: "field", name: "isRequired", static: false, private: false, access: { has: obj => "isRequired" in obj, get: obj => obj.isRequired, set: (obj, value) => { obj.isRequired = value; } }, metadata: _metadata }, _isRequired_initializers, _isRequired_extraInitializers);
        __esDecorate(null, null, _isCompliant_decorators, { kind: "field", name: "isCompliant", static: false, private: false, access: { has: obj => "isCompliant" in obj, get: obj => obj.isCompliant, set: (obj, value) => { obj.isCompliant = value; } }, metadata: _metadata }, _isCompliant_initializers, _isCompliant_extraInitializers);
        __esDecorate(null, null, _isNotApplicable_decorators, { kind: "field", name: "isNotApplicable", static: false, private: false, access: { has: obj => "isNotApplicable" in obj, get: obj => obj.isNotApplicable, set: (obj, value) => { obj.isNotApplicable = value; } }, metadata: _metadata }, _isNotApplicable_initializers, _isNotApplicable_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _codeReference_decorators, { kind: "field", name: "codeReference", static: false, private: false, access: { has: obj => "codeReference" in obj, get: obj => obj.codeReference, set: (obj, value) => { obj.codeReference = value; } }, metadata: _metadata }, _codeReference_initializers, _codeReference_extraInitializers);
        __esDecorate(null, null, _photos_decorators, { kind: "field", name: "photos", static: false, private: false, access: { has: obj => "photos" in obj, get: obj => obj.photos, set: (obj, value) => { obj.photos = value; } }, metadata: _metadata }, _photos_initializers, _photos_extraInitializers);
        __esDecorate(null, null, _checkedAt_decorators, { kind: "field", name: "checkedAt", static: false, private: false, access: { has: obj => "checkedAt" in obj, get: obj => obj.checkedAt, set: (obj, value) => { obj.checkedAt = value; } }, metadata: _metadata }, _checkedAt_initializers, _checkedAt_extraInitializers);
        __esDecorate(null, null, _checkedBy_decorators, { kind: "field", name: "checkedBy", static: false, private: false, access: { has: obj => "checkedBy" in obj, get: obj => obj.checkedBy, set: (obj, value) => { obj.checkedBy = value; } }, metadata: _metadata }, _checkedBy_initializers, _checkedBy_extraInitializers);
        __esDecorate(null, null, _inspection_decorators, { kind: "field", name: "inspection", static: false, private: false, access: { has: obj => "inspection" in obj, get: obj => obj.inspection, set: (obj, value) => { obj.inspection = value; } }, metadata: _metadata }, _inspection_initializers, _inspection_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InspectionChecklistItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InspectionChecklistItem = _classThis;
})();
exports.InspectionChecklistItem = InspectionChecklistItem;
//# sourceMappingURL=inspection-checklist-item.model.js.map