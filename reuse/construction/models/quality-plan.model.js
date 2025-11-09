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
exports.QualityPlan = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const quality_types_1 = require("../types/quality.types");
let QualityPlan = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'quality_plans',
            timestamps: true,
            indexes: [
                { fields: ['planNumber'], unique: true },
                { fields: ['projectId'] },
                { fields: ['status'] },
                { fields: ['effectiveDate'] },
                { fields: ['responsiblePerson'] },
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
    let _applicableStandards_decorators;
    let _applicableStandards_initializers = [];
    let _applicableStandards_extraInitializers = [];
    let _qualityObjectives_decorators;
    let _qualityObjectives_initializers = [];
    let _qualityObjectives_extraInitializers = [];
    let _acceptanceCriteria_decorators;
    let _acceptanceCriteria_initializers = [];
    let _acceptanceCriteria_extraInitializers = [];
    let _inspectionFrequency_decorators;
    let _inspectionFrequency_initializers = [];
    let _inspectionFrequency_extraInitializers = [];
    let _testingRequirements_decorators;
    let _testingRequirements_initializers = [];
    let _testingRequirements_extraInitializers = [];
    let _documentationRequirements_decorators;
    let _documentationRequirements_initializers = [];
    let _documentationRequirements_extraInitializers = [];
    let _responsiblePerson_decorators;
    let _responsiblePerson_initializers = [];
    let _responsiblePerson_extraInitializers = [];
    let _contactInfo_decorators;
    let _contactInfo_initializers = [];
    let _contactInfo_extraInitializers = [];
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
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
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
    var QualityPlan = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.projectName = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _projectName_initializers, void 0));
            this.planNumber = (__runInitializers(this, _projectName_extraInitializers), __runInitializers(this, _planNumber_initializers, void 0));
            this.title = (__runInitializers(this, _planNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.scope = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
            this.applicableStandards = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _applicableStandards_initializers, void 0));
            this.qualityObjectives = (__runInitializers(this, _applicableStandards_extraInitializers), __runInitializers(this, _qualityObjectives_initializers, void 0));
            this.acceptanceCriteria = (__runInitializers(this, _qualityObjectives_extraInitializers), __runInitializers(this, _acceptanceCriteria_initializers, void 0));
            this.inspectionFrequency = (__runInitializers(this, _acceptanceCriteria_extraInitializers), __runInitializers(this, _inspectionFrequency_initializers, void 0));
            this.testingRequirements = (__runInitializers(this, _inspectionFrequency_extraInitializers), __runInitializers(this, _testingRequirements_initializers, void 0));
            this.documentationRequirements = (__runInitializers(this, _testingRequirements_extraInitializers), __runInitializers(this, _documentationRequirements_initializers, void 0));
            this.responsiblePerson = (__runInitializers(this, _documentationRequirements_extraInitializers), __runInitializers(this, _responsiblePerson_initializers, void 0));
            this.contactInfo = (__runInitializers(this, _responsiblePerson_extraInitializers), __runInitializers(this, _contactInfo_initializers, void 0));
            this.status = (__runInitializers(this, _contactInfo_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.version = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.metadata = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdBy = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "QualityPlan");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.INTEGER), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _projectId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _projectName_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _planNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _title_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _scope_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _applicableStandards_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _qualityObjectives_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _acceptanceCriteria_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _inspectionFrequency_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _testingRequirements_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _documentationRequirements_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _responsiblePerson_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _contactInfo_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(quality_types_1.QualityPlanStatus.DRAFT), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(quality_types_1.QualityPlanStatus)),
            })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _approvedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _effectiveDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _expirationDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
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
        __esDecorate(null, null, _applicableStandards_decorators, { kind: "field", name: "applicableStandards", static: false, private: false, access: { has: obj => "applicableStandards" in obj, get: obj => obj.applicableStandards, set: (obj, value) => { obj.applicableStandards = value; } }, metadata: _metadata }, _applicableStandards_initializers, _applicableStandards_extraInitializers);
        __esDecorate(null, null, _qualityObjectives_decorators, { kind: "field", name: "qualityObjectives", static: false, private: false, access: { has: obj => "qualityObjectives" in obj, get: obj => obj.qualityObjectives, set: (obj, value) => { obj.qualityObjectives = value; } }, metadata: _metadata }, _qualityObjectives_initializers, _qualityObjectives_extraInitializers);
        __esDecorate(null, null, _acceptanceCriteria_decorators, { kind: "field", name: "acceptanceCriteria", static: false, private: false, access: { has: obj => "acceptanceCriteria" in obj, get: obj => obj.acceptanceCriteria, set: (obj, value) => { obj.acceptanceCriteria = value; } }, metadata: _metadata }, _acceptanceCriteria_initializers, _acceptanceCriteria_extraInitializers);
        __esDecorate(null, null, _inspectionFrequency_decorators, { kind: "field", name: "inspectionFrequency", static: false, private: false, access: { has: obj => "inspectionFrequency" in obj, get: obj => obj.inspectionFrequency, set: (obj, value) => { obj.inspectionFrequency = value; } }, metadata: _metadata }, _inspectionFrequency_initializers, _inspectionFrequency_extraInitializers);
        __esDecorate(null, null, _testingRequirements_decorators, { kind: "field", name: "testingRequirements", static: false, private: false, access: { has: obj => "testingRequirements" in obj, get: obj => obj.testingRequirements, set: (obj, value) => { obj.testingRequirements = value; } }, metadata: _metadata }, _testingRequirements_initializers, _testingRequirements_extraInitializers);
        __esDecorate(null, null, _documentationRequirements_decorators, { kind: "field", name: "documentationRequirements", static: false, private: false, access: { has: obj => "documentationRequirements" in obj, get: obj => obj.documentationRequirements, set: (obj, value) => { obj.documentationRequirements = value; } }, metadata: _metadata }, _documentationRequirements_initializers, _documentationRequirements_extraInitializers);
        __esDecorate(null, null, _responsiblePerson_decorators, { kind: "field", name: "responsiblePerson", static: false, private: false, access: { has: obj => "responsiblePerson" in obj, get: obj => obj.responsiblePerson, set: (obj, value) => { obj.responsiblePerson = value; } }, metadata: _metadata }, _responsiblePerson_initializers, _responsiblePerson_extraInitializers);
        __esDecorate(null, null, _contactInfo_decorators, { kind: "field", name: "contactInfo", static: false, private: false, access: { has: obj => "contactInfo" in obj, get: obj => obj.contactInfo, set: (obj, value) => { obj.contactInfo = value; } }, metadata: _metadata }, _contactInfo_initializers, _contactInfo_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        QualityPlan = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return QualityPlan = _classThis;
})();
exports.QualityPlan = QualityPlan;
//# sourceMappingURL=quality-plan.model.js.map