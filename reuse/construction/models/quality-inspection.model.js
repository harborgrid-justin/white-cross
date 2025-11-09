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
exports.QualityInspection = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const quality_types_1 = require("../types/quality.types");
let QualityInspection = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'quality_inspections',
            timestamps: true,
            indexes: [
                { fields: ['inspectionNumber'], unique: true },
                { fields: ['qualityPlanId'] },
                { fields: ['projectId'] },
                { fields: ['inspectionType'] },
                { fields: ['status'] },
                { fields: ['scheduledDate'] },
                { fields: ['inspector'] },
                { fields: ['actualDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _qualityPlanId_decorators;
    let _qualityPlanId_initializers = [];
    let _qualityPlanId_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _inspectionNumber_decorators;
    let _inspectionNumber_initializers = [];
    let _inspectionNumber_extraInitializers = [];
    let _inspectionType_decorators;
    let _inspectionType_initializers = [];
    let _inspectionType_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _scheduledTime_decorators;
    let _scheduledTime_initializers = [];
    let _scheduledTime_extraInitializers = [];
    let _inspector_decorators;
    let _inspector_initializers = [];
    let _inspector_extraInitializers = [];
    let _participants_decorators;
    let _participants_initializers = [];
    let _participants_extraInitializers = [];
    let _checklistId_decorators;
    let _checklistId_initializers = [];
    let _checklistId_extraInitializers = [];
    let _actualDate_decorators;
    let _actualDate_initializers = [];
    let _actualDate_extraInitializers = [];
    let _actualStartTime_decorators;
    let _actualStartTime_initializers = [];
    let _actualStartTime_extraInitializers = [];
    let _actualEndTime_decorators;
    let _actualEndTime_initializers = [];
    let _actualEndTime_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _passedItems_decorators;
    let _passedItems_initializers = [];
    let _passedItems_extraInitializers = [];
    let _failedItems_decorators;
    let _failedItems_initializers = [];
    let _failedItems_extraInitializers = [];
    let _totalItems_decorators;
    let _totalItems_initializers = [];
    let _totalItems_extraInitializers = [];
    let _passRate_decorators;
    let _passRate_initializers = [];
    let _passRate_extraInitializers = [];
    let _findings_decorators;
    let _findings_initializers = [];
    let _findings_extraInitializers = [];
    let _observations_decorators;
    let _observations_initializers = [];
    let _observations_extraInitializers = [];
    let _deficienciesFound_decorators;
    let _deficienciesFound_initializers = [];
    let _deficienciesFound_extraInitializers = [];
    let _recommendations_decorators;
    let _recommendations_initializers = [];
    let _recommendations_extraInitializers = [];
    let _nextInspectionDate_decorators;
    let _nextInspectionDate_initializers = [];
    let _nextInspectionDate_extraInitializers = [];
    let _requiresFollowUp_decorators;
    let _requiresFollowUp_initializers = [];
    let _requiresFollowUp_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
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
    var QualityInspection = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.qualityPlanId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _qualityPlanId_initializers, void 0));
            this.projectId = (__runInitializers(this, _qualityPlanId_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.inspectionNumber = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _inspectionNumber_initializers, void 0));
            this.inspectionType = (__runInitializers(this, _inspectionNumber_extraInitializers), __runInitializers(this, _inspectionType_initializers, void 0));
            this.title = (__runInitializers(this, _inspectionType_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.location = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.scope = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
            this.scheduledDate = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
            this.scheduledTime = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _scheduledTime_initializers, void 0));
            this.inspector = (__runInitializers(this, _scheduledTime_extraInitializers), __runInitializers(this, _inspector_initializers, void 0));
            this.participants = (__runInitializers(this, _inspector_extraInitializers), __runInitializers(this, _participants_initializers, void 0));
            this.checklistId = (__runInitializers(this, _participants_extraInitializers), __runInitializers(this, _checklistId_initializers, void 0));
            this.actualDate = (__runInitializers(this, _checklistId_extraInitializers), __runInitializers(this, _actualDate_initializers, void 0));
            this.actualStartTime = (__runInitializers(this, _actualDate_extraInitializers), __runInitializers(this, _actualStartTime_initializers, void 0));
            this.actualEndTime = (__runInitializers(this, _actualStartTime_extraInitializers), __runInitializers(this, _actualEndTime_initializers, void 0));
            this.status = (__runInitializers(this, _actualEndTime_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.passedItems = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _passedItems_initializers, void 0));
            this.failedItems = (__runInitializers(this, _passedItems_extraInitializers), __runInitializers(this, _failedItems_initializers, void 0));
            this.totalItems = (__runInitializers(this, _failedItems_extraInitializers), __runInitializers(this, _totalItems_initializers, void 0));
            this.passRate = (__runInitializers(this, _totalItems_extraInitializers), __runInitializers(this, _passRate_initializers, void 0));
            this.findings = (__runInitializers(this, _passRate_extraInitializers), __runInitializers(this, _findings_initializers, void 0));
            this.observations = (__runInitializers(this, _findings_extraInitializers), __runInitializers(this, _observations_initializers, void 0));
            this.deficienciesFound = (__runInitializers(this, _observations_extraInitializers), __runInitializers(this, _deficienciesFound_initializers, void 0));
            this.recommendations = (__runInitializers(this, _deficienciesFound_extraInitializers), __runInitializers(this, _recommendations_initializers, void 0));
            this.nextInspectionDate = (__runInitializers(this, _recommendations_extraInitializers), __runInitializers(this, _nextInspectionDate_initializers, void 0));
            this.requiresFollowUp = (__runInitializers(this, _nextInspectionDate_extraInitializers), __runInitializers(this, _requiresFollowUp_initializers, void 0));
            this.attachments = (__runInitializers(this, _requiresFollowUp_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.metadata = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdBy = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "QualityInspection");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.INTEGER), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _qualityPlanId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _projectId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _inspectionNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _inspectionType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(quality_types_1.InspectionType)),
            })];
        _title_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _location_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _scope_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _scheduledDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _scheduledTime_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20))];
        _inspector_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _participants_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _checklistId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _actualDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _actualStartTime_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20))];
        _actualEndTime_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20))];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(quality_types_1.InspectionStatus.SCHEDULED), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(quality_types_1.InspectionStatus)),
            })];
        _passedItems_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _failedItems_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _totalItems_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _passRate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _findings_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _observations_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _deficienciesFound_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _recommendations_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _nextInspectionDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _requiresFollowUp_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _attachments_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _createdBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _updatedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _qualityPlanId_decorators, { kind: "field", name: "qualityPlanId", static: false, private: false, access: { has: obj => "qualityPlanId" in obj, get: obj => obj.qualityPlanId, set: (obj, value) => { obj.qualityPlanId = value; } }, metadata: _metadata }, _qualityPlanId_initializers, _qualityPlanId_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _inspectionNumber_decorators, { kind: "field", name: "inspectionNumber", static: false, private: false, access: { has: obj => "inspectionNumber" in obj, get: obj => obj.inspectionNumber, set: (obj, value) => { obj.inspectionNumber = value; } }, metadata: _metadata }, _inspectionNumber_initializers, _inspectionNumber_extraInitializers);
        __esDecorate(null, null, _inspectionType_decorators, { kind: "field", name: "inspectionType", static: false, private: false, access: { has: obj => "inspectionType" in obj, get: obj => obj.inspectionType, set: (obj, value) => { obj.inspectionType = value; } }, metadata: _metadata }, _inspectionType_initializers, _inspectionType_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
        __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
        __esDecorate(null, null, _scheduledTime_decorators, { kind: "field", name: "scheduledTime", static: false, private: false, access: { has: obj => "scheduledTime" in obj, get: obj => obj.scheduledTime, set: (obj, value) => { obj.scheduledTime = value; } }, metadata: _metadata }, _scheduledTime_initializers, _scheduledTime_extraInitializers);
        __esDecorate(null, null, _inspector_decorators, { kind: "field", name: "inspector", static: false, private: false, access: { has: obj => "inspector" in obj, get: obj => obj.inspector, set: (obj, value) => { obj.inspector = value; } }, metadata: _metadata }, _inspector_initializers, _inspector_extraInitializers);
        __esDecorate(null, null, _participants_decorators, { kind: "field", name: "participants", static: false, private: false, access: { has: obj => "participants" in obj, get: obj => obj.participants, set: (obj, value) => { obj.participants = value; } }, metadata: _metadata }, _participants_initializers, _participants_extraInitializers);
        __esDecorate(null, null, _checklistId_decorators, { kind: "field", name: "checklistId", static: false, private: false, access: { has: obj => "checklistId" in obj, get: obj => obj.checklistId, set: (obj, value) => { obj.checklistId = value; } }, metadata: _metadata }, _checklistId_initializers, _checklistId_extraInitializers);
        __esDecorate(null, null, _actualDate_decorators, { kind: "field", name: "actualDate", static: false, private: false, access: { has: obj => "actualDate" in obj, get: obj => obj.actualDate, set: (obj, value) => { obj.actualDate = value; } }, metadata: _metadata }, _actualDate_initializers, _actualDate_extraInitializers);
        __esDecorate(null, null, _actualStartTime_decorators, { kind: "field", name: "actualStartTime", static: false, private: false, access: { has: obj => "actualStartTime" in obj, get: obj => obj.actualStartTime, set: (obj, value) => { obj.actualStartTime = value; } }, metadata: _metadata }, _actualStartTime_initializers, _actualStartTime_extraInitializers);
        __esDecorate(null, null, _actualEndTime_decorators, { kind: "field", name: "actualEndTime", static: false, private: false, access: { has: obj => "actualEndTime" in obj, get: obj => obj.actualEndTime, set: (obj, value) => { obj.actualEndTime = value; } }, metadata: _metadata }, _actualEndTime_initializers, _actualEndTime_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _passedItems_decorators, { kind: "field", name: "passedItems", static: false, private: false, access: { has: obj => "passedItems" in obj, get: obj => obj.passedItems, set: (obj, value) => { obj.passedItems = value; } }, metadata: _metadata }, _passedItems_initializers, _passedItems_extraInitializers);
        __esDecorate(null, null, _failedItems_decorators, { kind: "field", name: "failedItems", static: false, private: false, access: { has: obj => "failedItems" in obj, get: obj => obj.failedItems, set: (obj, value) => { obj.failedItems = value; } }, metadata: _metadata }, _failedItems_initializers, _failedItems_extraInitializers);
        __esDecorate(null, null, _totalItems_decorators, { kind: "field", name: "totalItems", static: false, private: false, access: { has: obj => "totalItems" in obj, get: obj => obj.totalItems, set: (obj, value) => { obj.totalItems = value; } }, metadata: _metadata }, _totalItems_initializers, _totalItems_extraInitializers);
        __esDecorate(null, null, _passRate_decorators, { kind: "field", name: "passRate", static: false, private: false, access: { has: obj => "passRate" in obj, get: obj => obj.passRate, set: (obj, value) => { obj.passRate = value; } }, metadata: _metadata }, _passRate_initializers, _passRate_extraInitializers);
        __esDecorate(null, null, _findings_decorators, { kind: "field", name: "findings", static: false, private: false, access: { has: obj => "findings" in obj, get: obj => obj.findings, set: (obj, value) => { obj.findings = value; } }, metadata: _metadata }, _findings_initializers, _findings_extraInitializers);
        __esDecorate(null, null, _observations_decorators, { kind: "field", name: "observations", static: false, private: false, access: { has: obj => "observations" in obj, get: obj => obj.observations, set: (obj, value) => { obj.observations = value; } }, metadata: _metadata }, _observations_initializers, _observations_extraInitializers);
        __esDecorate(null, null, _deficienciesFound_decorators, { kind: "field", name: "deficienciesFound", static: false, private: false, access: { has: obj => "deficienciesFound" in obj, get: obj => obj.deficienciesFound, set: (obj, value) => { obj.deficienciesFound = value; } }, metadata: _metadata }, _deficienciesFound_initializers, _deficienciesFound_extraInitializers);
        __esDecorate(null, null, _recommendations_decorators, { kind: "field", name: "recommendations", static: false, private: false, access: { has: obj => "recommendations" in obj, get: obj => obj.recommendations, set: (obj, value) => { obj.recommendations = value; } }, metadata: _metadata }, _recommendations_initializers, _recommendations_extraInitializers);
        __esDecorate(null, null, _nextInspectionDate_decorators, { kind: "field", name: "nextInspectionDate", static: false, private: false, access: { has: obj => "nextInspectionDate" in obj, get: obj => obj.nextInspectionDate, set: (obj, value) => { obj.nextInspectionDate = value; } }, metadata: _metadata }, _nextInspectionDate_initializers, _nextInspectionDate_extraInitializers);
        __esDecorate(null, null, _requiresFollowUp_decorators, { kind: "field", name: "requiresFollowUp", static: false, private: false, access: { has: obj => "requiresFollowUp" in obj, get: obj => obj.requiresFollowUp, set: (obj, value) => { obj.requiresFollowUp = value; } }, metadata: _metadata }, _requiresFollowUp_initializers, _requiresFollowUp_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        QualityInspection = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return QualityInspection = _classThis;
})();
exports.QualityInspection = QualityInspection;
//# sourceMappingURL=quality-inspection.model.js.map