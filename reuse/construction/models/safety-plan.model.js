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
exports.SafetyPlan = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const safety_types_1 = require("../types/safety.types");
let SafetyPlan = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'safety_plans',
            timestamps: true,
            indexes: [
                { fields: ['planNumber'], unique: true },
                { fields: ['projectId'] },
                { fields: ['status'] },
                { fields: ['effectiveDate'] },
                { fields: ['safetyOfficer'] },
            ],
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
    let _projectName_decorators;
    let _projectName_initializers = [];
    let _projectName_extraInitializers = [];
    let _planNumber_decorators;
    let _planNumber_initializers = [];
    let _planNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _applicableRegulations_decorators;
    let _applicableRegulations_initializers = [];
    let _applicableRegulations_extraInitializers = [];
    let _safetyObjectives_decorators;
    let _safetyObjectives_initializers = [];
    let _safetyObjectives_extraInitializers = [];
    let _emergencyContacts_decorators;
    let _emergencyContacts_initializers = [];
    let _emergencyContacts_extraInitializers = [];
    let _evacuationProcedures_decorators;
    let _evacuationProcedures_initializers = [];
    let _evacuationProcedures_extraInitializers = [];
    let _ppeRequirements_decorators;
    let _ppeRequirements_initializers = [];
    let _ppeRequirements_extraInitializers = [];
    let _hazardMitigationStrategies_decorators;
    let _hazardMitigationStrategies_initializers = [];
    let _hazardMitigationStrategies_extraInitializers = [];
    let _trainingRequirements_decorators;
    let _trainingRequirements_initializers = [];
    let _trainingRequirements_extraInitializers = [];
    let _inspectionSchedule_decorators;
    let _inspectionSchedule_initializers = [];
    let _inspectionSchedule_extraInitializers = [];
    let _safetyOfficer_decorators;
    let _safetyOfficer_initializers = [];
    let _safetyOfficer_extraInitializers = [];
    let _competentPersons_decorators;
    let _competentPersons_initializers = [];
    let _competentPersons_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _reviewDate_decorators;
    let _reviewDate_initializers = [];
    let _reviewDate_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
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
    var SafetyPlan = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.projectName = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _projectName_initializers, void 0));
            this.planNumber = (__runInitializers(this, _projectName_extraInitializers), __runInitializers(this, _planNumber_initializers, void 0));
            this.title = (__runInitializers(this, _planNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.scope = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
            this.applicableRegulations = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _applicableRegulations_initializers, void 0));
            this.safetyObjectives = (__runInitializers(this, _applicableRegulations_extraInitializers), __runInitializers(this, _safetyObjectives_initializers, void 0));
            this.emergencyContacts = (__runInitializers(this, _safetyObjectives_extraInitializers), __runInitializers(this, _emergencyContacts_initializers, void 0));
            this.evacuationProcedures = (__runInitializers(this, _emergencyContacts_extraInitializers), __runInitializers(this, _evacuationProcedures_initializers, void 0));
            this.ppeRequirements = (__runInitializers(this, _evacuationProcedures_extraInitializers), __runInitializers(this, _ppeRequirements_initializers, void 0));
            this.hazardMitigationStrategies = (__runInitializers(this, _ppeRequirements_extraInitializers), __runInitializers(this, _hazardMitigationStrategies_initializers, void 0));
            this.trainingRequirements = (__runInitializers(this, _hazardMitigationStrategies_extraInitializers), __runInitializers(this, _trainingRequirements_initializers, void 0));
            this.inspectionSchedule = (__runInitializers(this, _trainingRequirements_extraInitializers), __runInitializers(this, _inspectionSchedule_initializers, void 0));
            this.safetyOfficer = (__runInitializers(this, _inspectionSchedule_extraInitializers), __runInitializers(this, _safetyOfficer_initializers, void 0));
            this.competentPersons = (__runInitializers(this, _safetyOfficer_extraInitializers), __runInitializers(this, _competentPersons_initializers, void 0));
            this.status = (__runInitializers(this, _competentPersons_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.reviewDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _reviewDate_initializers, void 0));
            this.version = (__runInitializers(this, _reviewDate_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.metadata = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdBy = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SafetyPlan");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.INTEGER), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _projectId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _projectName_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _planNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _title_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _scope_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _applicableRegulations_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _safetyObjectives_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _emergencyContacts_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _evacuationProcedures_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _ppeRequirements_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _hazardMitigationStrategies_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _trainingRequirements_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _inspectionSchedule_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _safetyOfficer_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _competentPersons_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(safety_types_1.SafetyPlanStatus.DRAFT), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(safety_types_1.SafetyPlanStatus)),
            })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _approvedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _effectiveDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _reviewDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _version_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(1), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _createdBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _updatedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _projectName_decorators, { kind: "field", name: "projectName", static: false, private: false, access: { has: obj => "projectName" in obj, get: obj => obj.projectName, set: (obj, value) => { obj.projectName = value; } }, metadata: _metadata }, _projectName_initializers, _projectName_extraInitializers);
        __esDecorate(null, null, _planNumber_decorators, { kind: "field", name: "planNumber", static: false, private: false, access: { has: obj => "planNumber" in obj, get: obj => obj.planNumber, set: (obj, value) => { obj.planNumber = value; } }, metadata: _metadata }, _planNumber_initializers, _planNumber_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
        __esDecorate(null, null, _applicableRegulations_decorators, { kind: "field", name: "applicableRegulations", static: false, private: false, access: { has: obj => "applicableRegulations" in obj, get: obj => obj.applicableRegulations, set: (obj, value) => { obj.applicableRegulations = value; } }, metadata: _metadata }, _applicableRegulations_initializers, _applicableRegulations_extraInitializers);
        __esDecorate(null, null, _safetyObjectives_decorators, { kind: "field", name: "safetyObjectives", static: false, private: false, access: { has: obj => "safetyObjectives" in obj, get: obj => obj.safetyObjectives, set: (obj, value) => { obj.safetyObjectives = value; } }, metadata: _metadata }, _safetyObjectives_initializers, _safetyObjectives_extraInitializers);
        __esDecorate(null, null, _emergencyContacts_decorators, { kind: "field", name: "emergencyContacts", static: false, private: false, access: { has: obj => "emergencyContacts" in obj, get: obj => obj.emergencyContacts, set: (obj, value) => { obj.emergencyContacts = value; } }, metadata: _metadata }, _emergencyContacts_initializers, _emergencyContacts_extraInitializers);
        __esDecorate(null, null, _evacuationProcedures_decorators, { kind: "field", name: "evacuationProcedures", static: false, private: false, access: { has: obj => "evacuationProcedures" in obj, get: obj => obj.evacuationProcedures, set: (obj, value) => { obj.evacuationProcedures = value; } }, metadata: _metadata }, _evacuationProcedures_initializers, _evacuationProcedures_extraInitializers);
        __esDecorate(null, null, _ppeRequirements_decorators, { kind: "field", name: "ppeRequirements", static: false, private: false, access: { has: obj => "ppeRequirements" in obj, get: obj => obj.ppeRequirements, set: (obj, value) => { obj.ppeRequirements = value; } }, metadata: _metadata }, _ppeRequirements_initializers, _ppeRequirements_extraInitializers);
        __esDecorate(null, null, _hazardMitigationStrategies_decorators, { kind: "field", name: "hazardMitigationStrategies", static: false, private: false, access: { has: obj => "hazardMitigationStrategies" in obj, get: obj => obj.hazardMitigationStrategies, set: (obj, value) => { obj.hazardMitigationStrategies = value; } }, metadata: _metadata }, _hazardMitigationStrategies_initializers, _hazardMitigationStrategies_extraInitializers);
        __esDecorate(null, null, _trainingRequirements_decorators, { kind: "field", name: "trainingRequirements", static: false, private: false, access: { has: obj => "trainingRequirements" in obj, get: obj => obj.trainingRequirements, set: (obj, value) => { obj.trainingRequirements = value; } }, metadata: _metadata }, _trainingRequirements_initializers, _trainingRequirements_extraInitializers);
        __esDecorate(null, null, _inspectionSchedule_decorators, { kind: "field", name: "inspectionSchedule", static: false, private: false, access: { has: obj => "inspectionSchedule" in obj, get: obj => obj.inspectionSchedule, set: (obj, value) => { obj.inspectionSchedule = value; } }, metadata: _metadata }, _inspectionSchedule_initializers, _inspectionSchedule_extraInitializers);
        __esDecorate(null, null, _safetyOfficer_decorators, { kind: "field", name: "safetyOfficer", static: false, private: false, access: { has: obj => "safetyOfficer" in obj, get: obj => obj.safetyOfficer, set: (obj, value) => { obj.safetyOfficer = value; } }, metadata: _metadata }, _safetyOfficer_initializers, _safetyOfficer_extraInitializers);
        __esDecorate(null, null, _competentPersons_decorators, { kind: "field", name: "competentPersons", static: false, private: false, access: { has: obj => "competentPersons" in obj, get: obj => obj.competentPersons, set: (obj, value) => { obj.competentPersons = value; } }, metadata: _metadata }, _competentPersons_initializers, _competentPersons_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _reviewDate_decorators, { kind: "field", name: "reviewDate", static: false, private: false, access: { has: obj => "reviewDate" in obj, get: obj => obj.reviewDate, set: (obj, value) => { obj.reviewDate = value; } }, metadata: _metadata }, _reviewDate_initializers, _reviewDate_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SafetyPlan = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SafetyPlan = _classThis;
})();
exports.SafetyPlan = SafetyPlan;
//# sourceMappingURL=safety-plan.model.js.map