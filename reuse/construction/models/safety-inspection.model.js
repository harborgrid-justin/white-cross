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
exports.SafetyInspection = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const safety_types_1 = require("../types/safety.types");
let SafetyInspection = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'safety_inspections',
            timestamps: true,
            indexes: [
                { fields: ['inspectionNumber'], unique: true },
                { fields: ['safetyPlanId'] },
                { fields: ['projectId'] },
                { fields: ['inspectionType'] },
                { fields: ['inspectionDate'] },
                { fields: ['inspector'] },
                { fields: ['followUpRequired'] },
            ],
        })];
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
    let _safetyPlanId_decorators;
    let _safetyPlanId_initializers = [];
    let _safetyPlanId_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _inspectionType_decorators;
    let _inspectionType_initializers = [];
    let _inspectionType_extraInitializers = [];
    let _inspectionDate_decorators;
    let _inspectionDate_initializers = [];
    let _inspectionDate_extraInitializers = [];
    let _inspectionTime_decorators;
    let _inspectionTime_initializers = [];
    let _inspectionTime_extraInitializers = [];
    let _inspector_decorators;
    let _inspector_initializers = [];
    let _inspector_extraInitializers = [];
    let _inspectorQualification_decorators;
    let _inspectorQualification_initializers = [];
    let _inspectorQualification_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _areasInspected_decorators;
    let _areasInspected_initializers = [];
    let _areasInspected_extraInitializers = [];
    let _checklistUsed_decorators;
    let _checklistUsed_initializers = [];
    let _checklistUsed_extraInitializers = [];
    let _weatherConditions_decorators;
    let _weatherConditions_initializers = [];
    let _weatherConditions_extraInitializers = [];
    let _workActivities_decorators;
    let _workActivities_initializers = [];
    let _workActivities_extraInitializers = [];
    let _safeItems_decorators;
    let _safeItems_initializers = [];
    let _safeItems_extraInitializers = [];
    let _unsafeItems_decorators;
    let _unsafeItems_initializers = [];
    let _unsafeItems_extraInitializers = [];
    let _totalItems_decorators;
    let _totalItems_initializers = [];
    let _totalItems_extraInitializers = [];
    let _complianceRate_decorators;
    let _complianceRate_initializers = [];
    let _complianceRate_extraInitializers = [];
    let _findings_decorators;
    let _findings_initializers = [];
    let _findings_extraInitializers = [];
    let _violations_decorators;
    let _violations_initializers = [];
    let _violations_extraInitializers = [];
    let _hazardsIdentified_decorators;
    let _hazardsIdentified_initializers = [];
    let _hazardsIdentified_extraInitializers = [];
    let _immediateCorrections_decorators;
    let _immediateCorrections_initializers = [];
    let _immediateCorrections_extraInitializers = [];
    let _followUpRequired_decorators;
    let _followUpRequired_initializers = [];
    let _followUpRequired_extraInitializers = [];
    let _followUpItems_decorators;
    let _followUpItems_initializers = [];
    let _followUpItems_extraInitializers = [];
    let _responsiblePersons_decorators;
    let _responsiblePersons_initializers = [];
    let _responsiblePersons_extraInitializers = [];
    let _nextInspectionDate_decorators;
    let _nextInspectionDate_initializers = [];
    let _nextInspectionDate_extraInitializers = [];
    let _completedDate_decorators;
    let _completedDate_initializers = [];
    let _completedDate_extraInitializers = [];
    let _reviewedBy_decorators;
    let _reviewedBy_initializers = [];
    let _reviewedBy_extraInitializers = [];
    let _reviewedDate_decorators;
    let _reviewedDate_initializers = [];
    let _reviewedDate_extraInitializers = [];
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
    var SafetyInspection = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.inspectionNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _inspectionNumber_initializers, void 0));
            this.safetyPlanId = (__runInitializers(this, _inspectionNumber_extraInitializers), __runInitializers(this, _safetyPlanId_initializers, void 0));
            this.projectId = (__runInitializers(this, _safetyPlanId_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.inspectionType = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _inspectionType_initializers, void 0));
            this.inspectionDate = (__runInitializers(this, _inspectionType_extraInitializers), __runInitializers(this, _inspectionDate_initializers, void 0));
            this.inspectionTime = (__runInitializers(this, _inspectionDate_extraInitializers), __runInitializers(this, _inspectionTime_initializers, void 0));
            this.inspector = (__runInitializers(this, _inspectionTime_extraInitializers), __runInitializers(this, _inspector_initializers, void 0));
            this.inspectorQualification = (__runInitializers(this, _inspector_extraInitializers), __runInitializers(this, _inspectorQualification_initializers, void 0));
            this.location = (__runInitializers(this, _inspectorQualification_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.areasInspected = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _areasInspected_initializers, void 0));
            this.checklistUsed = (__runInitializers(this, _areasInspected_extraInitializers), __runInitializers(this, _checklistUsed_initializers, void 0));
            this.weatherConditions = (__runInitializers(this, _checklistUsed_extraInitializers), __runInitializers(this, _weatherConditions_initializers, void 0));
            this.workActivities = (__runInitializers(this, _weatherConditions_extraInitializers), __runInitializers(this, _workActivities_initializers, void 0));
            this.safeItems = (__runInitializers(this, _workActivities_extraInitializers), __runInitializers(this, _safeItems_initializers, void 0));
            this.unsafeItems = (__runInitializers(this, _safeItems_extraInitializers), __runInitializers(this, _unsafeItems_initializers, void 0));
            this.totalItems = (__runInitializers(this, _unsafeItems_extraInitializers), __runInitializers(this, _totalItems_initializers, void 0));
            this.complianceRate = (__runInitializers(this, _totalItems_extraInitializers), __runInitializers(this, _complianceRate_initializers, void 0));
            this.findings = (__runInitializers(this, _complianceRate_extraInitializers), __runInitializers(this, _findings_initializers, void 0));
            this.violations = (__runInitializers(this, _findings_extraInitializers), __runInitializers(this, _violations_initializers, void 0));
            this.hazardsIdentified = (__runInitializers(this, _violations_extraInitializers), __runInitializers(this, _hazardsIdentified_initializers, void 0));
            this.immediateCorrections = (__runInitializers(this, _hazardsIdentified_extraInitializers), __runInitializers(this, _immediateCorrections_initializers, void 0));
            this.followUpRequired = (__runInitializers(this, _immediateCorrections_extraInitializers), __runInitializers(this, _followUpRequired_initializers, void 0));
            this.followUpItems = (__runInitializers(this, _followUpRequired_extraInitializers), __runInitializers(this, _followUpItems_initializers, void 0));
            this.responsiblePersons = (__runInitializers(this, _followUpItems_extraInitializers), __runInitializers(this, _responsiblePersons_initializers, void 0));
            this.nextInspectionDate = (__runInitializers(this, _responsiblePersons_extraInitializers), __runInitializers(this, _nextInspectionDate_initializers, void 0));
            this.completedDate = (__runInitializers(this, _nextInspectionDate_extraInitializers), __runInitializers(this, _completedDate_initializers, void 0));
            this.reviewedBy = (__runInitializers(this, _completedDate_extraInitializers), __runInitializers(this, _reviewedBy_initializers, void 0));
            this.reviewedDate = (__runInitializers(this, _reviewedBy_extraInitializers), __runInitializers(this, _reviewedDate_initializers, void 0));
            this.attachments = (__runInitializers(this, _reviewedDate_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.metadata = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdBy = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SafetyInspection");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.INTEGER), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _inspectionNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _safetyPlanId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _projectId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _inspectionType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(safety_types_1.InspectionType)),
            })];
        _inspectionDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _inspectionTime_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20))];
        _inspector_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _inspectorQualification_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _location_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _areasInspected_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _checklistUsed_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _weatherConditions_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _workActivities_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _safeItems_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _unsafeItems_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _totalItems_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _complianceRate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _findings_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _violations_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _hazardsIdentified_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _immediateCorrections_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _followUpRequired_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _followUpItems_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _responsiblePersons_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _nextInspectionDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _completedDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _reviewedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _reviewedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _attachments_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _createdBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _updatedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _inspectionNumber_decorators, { kind: "field", name: "inspectionNumber", static: false, private: false, access: { has: obj => "inspectionNumber" in obj, get: obj => obj.inspectionNumber, set: (obj, value) => { obj.inspectionNumber = value; } }, metadata: _metadata }, _inspectionNumber_initializers, _inspectionNumber_extraInitializers);
        __esDecorate(null, null, _safetyPlanId_decorators, { kind: "field", name: "safetyPlanId", static: false, private: false, access: { has: obj => "safetyPlanId" in obj, get: obj => obj.safetyPlanId, set: (obj, value) => { obj.safetyPlanId = value; } }, metadata: _metadata }, _safetyPlanId_initializers, _safetyPlanId_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _inspectionType_decorators, { kind: "field", name: "inspectionType", static: false, private: false, access: { has: obj => "inspectionType" in obj, get: obj => obj.inspectionType, set: (obj, value) => { obj.inspectionType = value; } }, metadata: _metadata }, _inspectionType_initializers, _inspectionType_extraInitializers);
        __esDecorate(null, null, _inspectionDate_decorators, { kind: "field", name: "inspectionDate", static: false, private: false, access: { has: obj => "inspectionDate" in obj, get: obj => obj.inspectionDate, set: (obj, value) => { obj.inspectionDate = value; } }, metadata: _metadata }, _inspectionDate_initializers, _inspectionDate_extraInitializers);
        __esDecorate(null, null, _inspectionTime_decorators, { kind: "field", name: "inspectionTime", static: false, private: false, access: { has: obj => "inspectionTime" in obj, get: obj => obj.inspectionTime, set: (obj, value) => { obj.inspectionTime = value; } }, metadata: _metadata }, _inspectionTime_initializers, _inspectionTime_extraInitializers);
        __esDecorate(null, null, _inspector_decorators, { kind: "field", name: "inspector", static: false, private: false, access: { has: obj => "inspector" in obj, get: obj => obj.inspector, set: (obj, value) => { obj.inspector = value; } }, metadata: _metadata }, _inspector_initializers, _inspector_extraInitializers);
        __esDecorate(null, null, _inspectorQualification_decorators, { kind: "field", name: "inspectorQualification", static: false, private: false, access: { has: obj => "inspectorQualification" in obj, get: obj => obj.inspectorQualification, set: (obj, value) => { obj.inspectorQualification = value; } }, metadata: _metadata }, _inspectorQualification_initializers, _inspectorQualification_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _areasInspected_decorators, { kind: "field", name: "areasInspected", static: false, private: false, access: { has: obj => "areasInspected" in obj, get: obj => obj.areasInspected, set: (obj, value) => { obj.areasInspected = value; } }, metadata: _metadata }, _areasInspected_initializers, _areasInspected_extraInitializers);
        __esDecorate(null, null, _checklistUsed_decorators, { kind: "field", name: "checklistUsed", static: false, private: false, access: { has: obj => "checklistUsed" in obj, get: obj => obj.checklistUsed, set: (obj, value) => { obj.checklistUsed = value; } }, metadata: _metadata }, _checklistUsed_initializers, _checklistUsed_extraInitializers);
        __esDecorate(null, null, _weatherConditions_decorators, { kind: "field", name: "weatherConditions", static: false, private: false, access: { has: obj => "weatherConditions" in obj, get: obj => obj.weatherConditions, set: (obj, value) => { obj.weatherConditions = value; } }, metadata: _metadata }, _weatherConditions_initializers, _weatherConditions_extraInitializers);
        __esDecorate(null, null, _workActivities_decorators, { kind: "field", name: "workActivities", static: false, private: false, access: { has: obj => "workActivities" in obj, get: obj => obj.workActivities, set: (obj, value) => { obj.workActivities = value; } }, metadata: _metadata }, _workActivities_initializers, _workActivities_extraInitializers);
        __esDecorate(null, null, _safeItems_decorators, { kind: "field", name: "safeItems", static: false, private: false, access: { has: obj => "safeItems" in obj, get: obj => obj.safeItems, set: (obj, value) => { obj.safeItems = value; } }, metadata: _metadata }, _safeItems_initializers, _safeItems_extraInitializers);
        __esDecorate(null, null, _unsafeItems_decorators, { kind: "field", name: "unsafeItems", static: false, private: false, access: { has: obj => "unsafeItems" in obj, get: obj => obj.unsafeItems, set: (obj, value) => { obj.unsafeItems = value; } }, metadata: _metadata }, _unsafeItems_initializers, _unsafeItems_extraInitializers);
        __esDecorate(null, null, _totalItems_decorators, { kind: "field", name: "totalItems", static: false, private: false, access: { has: obj => "totalItems" in obj, get: obj => obj.totalItems, set: (obj, value) => { obj.totalItems = value; } }, metadata: _metadata }, _totalItems_initializers, _totalItems_extraInitializers);
        __esDecorate(null, null, _complianceRate_decorators, { kind: "field", name: "complianceRate", static: false, private: false, access: { has: obj => "complianceRate" in obj, get: obj => obj.complianceRate, set: (obj, value) => { obj.complianceRate = value; } }, metadata: _metadata }, _complianceRate_initializers, _complianceRate_extraInitializers);
        __esDecorate(null, null, _findings_decorators, { kind: "field", name: "findings", static: false, private: false, access: { has: obj => "findings" in obj, get: obj => obj.findings, set: (obj, value) => { obj.findings = value; } }, metadata: _metadata }, _findings_initializers, _findings_extraInitializers);
        __esDecorate(null, null, _violations_decorators, { kind: "field", name: "violations", static: false, private: false, access: { has: obj => "violations" in obj, get: obj => obj.violations, set: (obj, value) => { obj.violations = value; } }, metadata: _metadata }, _violations_initializers, _violations_extraInitializers);
        __esDecorate(null, null, _hazardsIdentified_decorators, { kind: "field", name: "hazardsIdentified", static: false, private: false, access: { has: obj => "hazardsIdentified" in obj, get: obj => obj.hazardsIdentified, set: (obj, value) => { obj.hazardsIdentified = value; } }, metadata: _metadata }, _hazardsIdentified_initializers, _hazardsIdentified_extraInitializers);
        __esDecorate(null, null, _immediateCorrections_decorators, { kind: "field", name: "immediateCorrections", static: false, private: false, access: { has: obj => "immediateCorrections" in obj, get: obj => obj.immediateCorrections, set: (obj, value) => { obj.immediateCorrections = value; } }, metadata: _metadata }, _immediateCorrections_initializers, _immediateCorrections_extraInitializers);
        __esDecorate(null, null, _followUpRequired_decorators, { kind: "field", name: "followUpRequired", static: false, private: false, access: { has: obj => "followUpRequired" in obj, get: obj => obj.followUpRequired, set: (obj, value) => { obj.followUpRequired = value; } }, metadata: _metadata }, _followUpRequired_initializers, _followUpRequired_extraInitializers);
        __esDecorate(null, null, _followUpItems_decorators, { kind: "field", name: "followUpItems", static: false, private: false, access: { has: obj => "followUpItems" in obj, get: obj => obj.followUpItems, set: (obj, value) => { obj.followUpItems = value; } }, metadata: _metadata }, _followUpItems_initializers, _followUpItems_extraInitializers);
        __esDecorate(null, null, _responsiblePersons_decorators, { kind: "field", name: "responsiblePersons", static: false, private: false, access: { has: obj => "responsiblePersons" in obj, get: obj => obj.responsiblePersons, set: (obj, value) => { obj.responsiblePersons = value; } }, metadata: _metadata }, _responsiblePersons_initializers, _responsiblePersons_extraInitializers);
        __esDecorate(null, null, _nextInspectionDate_decorators, { kind: "field", name: "nextInspectionDate", static: false, private: false, access: { has: obj => "nextInspectionDate" in obj, get: obj => obj.nextInspectionDate, set: (obj, value) => { obj.nextInspectionDate = value; } }, metadata: _metadata }, _nextInspectionDate_initializers, _nextInspectionDate_extraInitializers);
        __esDecorate(null, null, _completedDate_decorators, { kind: "field", name: "completedDate", static: false, private: false, access: { has: obj => "completedDate" in obj, get: obj => obj.completedDate, set: (obj, value) => { obj.completedDate = value; } }, metadata: _metadata }, _completedDate_initializers, _completedDate_extraInitializers);
        __esDecorate(null, null, _reviewedBy_decorators, { kind: "field", name: "reviewedBy", static: false, private: false, access: { has: obj => "reviewedBy" in obj, get: obj => obj.reviewedBy, set: (obj, value) => { obj.reviewedBy = value; } }, metadata: _metadata }, _reviewedBy_initializers, _reviewedBy_extraInitializers);
        __esDecorate(null, null, _reviewedDate_decorators, { kind: "field", name: "reviewedDate", static: false, private: false, access: { has: obj => "reviewedDate" in obj, get: obj => obj.reviewedDate, set: (obj, value) => { obj.reviewedDate = value; } }, metadata: _metadata }, _reviewedDate_initializers, _reviewedDate_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SafetyInspection = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SafetyInspection = _classThis;
})();
exports.SafetyInspection = SafetyInspection;
//# sourceMappingURL=safety-inspection.model.js.map