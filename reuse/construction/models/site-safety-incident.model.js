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
exports.SiteSafetyIncident = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const construction_site_model_1 = require("./construction-site.model");
const site_types_1 = require("../types/site.types");
let SiteSafetyIncident = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'site_safety_incidents',
            timestamps: true,
            indexes: [
                { fields: ['siteId'] },
                { fields: ['incidentDate'] },
                { fields: ['incidentType'] },
                { fields: ['severity'] },
                { fields: ['investigationStatus'] },
                { fields: ['oshaRecordable'] },
                { fields: ['siteId', 'incidentDate'] },
                { fields: ['siteId', 'incidentType', 'severity'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _siteId_decorators;
    let _siteId_initializers = [];
    let _siteId_extraInitializers = [];
    let _incidentDate_decorators;
    let _incidentDate_initializers = [];
    let _incidentDate_extraInitializers = [];
    let _incidentTime_decorators;
    let _incidentTime_initializers = [];
    let _incidentTime_extraInitializers = [];
    let _incidentType_decorators;
    let _incidentType_initializers = [];
    let _incidentType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _personnelInvolved_decorators;
    let _personnelInvolved_initializers = [];
    let _personnelInvolved_extraInitializers = [];
    let _witnessIds_decorators;
    let _witnessIds_initializers = [];
    let _witnessIds_extraInitializers = [];
    let _immediateAction_decorators;
    let _immediateAction_initializers = [];
    let _immediateAction_extraInitializers = [];
    let _reportedBy_decorators;
    let _reportedBy_initializers = [];
    let _reportedBy_extraInitializers = [];
    let _reportedAt_decorators;
    let _reportedAt_initializers = [];
    let _reportedAt_extraInitializers = [];
    let _investigationStatus_decorators;
    let _investigationStatus_initializers = [];
    let _investigationStatus_extraInitializers = [];
    let _investigator_decorators;
    let _investigator_initializers = [];
    let _investigator_extraInitializers = [];
    let _investigationStartDate_decorators;
    let _investigationStartDate_initializers = [];
    let _investigationStartDate_extraInitializers = [];
    let _investigationCompletedDate_decorators;
    let _investigationCompletedDate_initializers = [];
    let _investigationCompletedDate_extraInitializers = [];
    let _rootCause_decorators;
    let _rootCause_initializers = [];
    let _rootCause_extraInitializers = [];
    let _contributingFactors_decorators;
    let _contributingFactors_initializers = [];
    let _contributingFactors_extraInitializers = [];
    let _correctiveActions_decorators;
    let _correctiveActions_initializers = [];
    let _correctiveActions_extraInitializers = [];
    let _preventiveActions_decorators;
    let _preventiveActions_initializers = [];
    let _preventiveActions_extraInitializers = [];
    let _oshaRecordable_decorators;
    let _oshaRecordable_initializers = [];
    let _oshaRecordable_extraInitializers = [];
    let _oshaReportNumber_decorators;
    let _oshaReportNumber_initializers = [];
    let _oshaReportNumber_extraInitializers = [];
    let _lostTimeDays_decorators;
    let _lostTimeDays_initializers = [];
    let _lostTimeDays_extraInitializers = [];
    let _medicalTreatmentRequired_decorators;
    let _medicalTreatmentRequired_initializers = [];
    let _medicalTreatmentRequired_extraInitializers = [];
    let _costEstimate_decorators;
    let _costEstimate_initializers = [];
    let _costEstimate_extraInitializers = [];
    let _photoUrls_decorators;
    let _photoUrls_initializers = [];
    let _photoUrls_extraInitializers = [];
    let _documentUrls_decorators;
    let _documentUrls_initializers = [];
    let _documentUrls_extraInitializers = [];
    let _closedAt_decorators;
    let _closedAt_initializers = [];
    let _closedAt_extraInitializers = [];
    let _closedBy_decorators;
    let _closedBy_initializers = [];
    let _closedBy_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var SiteSafetyIncident = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.siteId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _siteId_initializers, void 0));
            this.incidentDate = (__runInitializers(this, _siteId_extraInitializers), __runInitializers(this, _incidentDate_initializers, void 0));
            this.incidentTime = (__runInitializers(this, _incidentDate_extraInitializers), __runInitializers(this, _incidentTime_initializers, void 0));
            this.incidentType = (__runInitializers(this, _incidentTime_extraInitializers), __runInitializers(this, _incidentType_initializers, void 0));
            this.severity = (__runInitializers(this, _incidentType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.location = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.description = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.personnelInvolved = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _personnelInvolved_initializers, void 0));
            this.witnessIds = (__runInitializers(this, _personnelInvolved_extraInitializers), __runInitializers(this, _witnessIds_initializers, void 0));
            this.immediateAction = (__runInitializers(this, _witnessIds_extraInitializers), __runInitializers(this, _immediateAction_initializers, void 0));
            this.reportedBy = (__runInitializers(this, _immediateAction_extraInitializers), __runInitializers(this, _reportedBy_initializers, void 0));
            this.reportedAt = (__runInitializers(this, _reportedBy_extraInitializers), __runInitializers(this, _reportedAt_initializers, void 0));
            this.investigationStatus = (__runInitializers(this, _reportedAt_extraInitializers), __runInitializers(this, _investigationStatus_initializers, void 0));
            this.investigator = (__runInitializers(this, _investigationStatus_extraInitializers), __runInitializers(this, _investigator_initializers, void 0));
            this.investigationStartDate = (__runInitializers(this, _investigator_extraInitializers), __runInitializers(this, _investigationStartDate_initializers, void 0));
            this.investigationCompletedDate = (__runInitializers(this, _investigationStartDate_extraInitializers), __runInitializers(this, _investigationCompletedDate_initializers, void 0));
            this.rootCause = (__runInitializers(this, _investigationCompletedDate_extraInitializers), __runInitializers(this, _rootCause_initializers, void 0));
            this.contributingFactors = (__runInitializers(this, _rootCause_extraInitializers), __runInitializers(this, _contributingFactors_initializers, void 0));
            this.correctiveActions = (__runInitializers(this, _contributingFactors_extraInitializers), __runInitializers(this, _correctiveActions_initializers, void 0));
            this.preventiveActions = (__runInitializers(this, _correctiveActions_extraInitializers), __runInitializers(this, _preventiveActions_initializers, void 0));
            this.oshaRecordable = (__runInitializers(this, _preventiveActions_extraInitializers), __runInitializers(this, _oshaRecordable_initializers, void 0));
            this.oshaReportNumber = (__runInitializers(this, _oshaRecordable_extraInitializers), __runInitializers(this, _oshaReportNumber_initializers, void 0));
            this.lostTimeDays = (__runInitializers(this, _oshaReportNumber_extraInitializers), __runInitializers(this, _lostTimeDays_initializers, void 0));
            this.medicalTreatmentRequired = (__runInitializers(this, _lostTimeDays_extraInitializers), __runInitializers(this, _medicalTreatmentRequired_initializers, void 0));
            this.costEstimate = (__runInitializers(this, _medicalTreatmentRequired_extraInitializers), __runInitializers(this, _costEstimate_initializers, void 0));
            this.photoUrls = (__runInitializers(this, _costEstimate_extraInitializers), __runInitializers(this, _photoUrls_initializers, void 0));
            this.documentUrls = (__runInitializers(this, _photoUrls_extraInitializers), __runInitializers(this, _documentUrls_initializers, void 0));
            this.closedAt = (__runInitializers(this, _documentUrls_extraInitializers), __runInitializers(this, _closedAt_initializers, void 0));
            this.closedBy = (__runInitializers(this, _closedAt_extraInitializers), __runInitializers(this, _closedBy_initializers, void 0));
            this.metadata = (__runInitializers(this, _closedBy_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SiteSafetyIncident");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _siteId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => construction_site_model_1.ConstructionSite), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _incidentDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATEONLY)];
        _incidentTime_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TIME)];
        _incidentType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(site_types_1.IncidentType)),
            })];
        _severity_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(site_types_1.IncidentSeverity)),
            })];
        _location_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _personnelInvolved_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _witnessIds_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _immediateAction_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _reportedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _reportedAt_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _investigationStatus_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(site_types_1.InvestigationStatus.PENDING), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(site_types_1.InvestigationStatus)),
            })];
        _investigator_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _investigationStartDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _investigationCompletedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _rootCause_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _contributingFactors_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _correctiveActions_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _preventiveActions_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _oshaRecordable_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _oshaReportNumber_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _lostTimeDays_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _medicalTreatmentRequired_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _costEstimate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _photoUrls_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _documentUrls_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _closedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _closedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _siteId_decorators, { kind: "field", name: "siteId", static: false, private: false, access: { has: obj => "siteId" in obj, get: obj => obj.siteId, set: (obj, value) => { obj.siteId = value; } }, metadata: _metadata }, _siteId_initializers, _siteId_extraInitializers);
        __esDecorate(null, null, _incidentDate_decorators, { kind: "field", name: "incidentDate", static: false, private: false, access: { has: obj => "incidentDate" in obj, get: obj => obj.incidentDate, set: (obj, value) => { obj.incidentDate = value; } }, metadata: _metadata }, _incidentDate_initializers, _incidentDate_extraInitializers);
        __esDecorate(null, null, _incidentTime_decorators, { kind: "field", name: "incidentTime", static: false, private: false, access: { has: obj => "incidentTime" in obj, get: obj => obj.incidentTime, set: (obj, value) => { obj.incidentTime = value; } }, metadata: _metadata }, _incidentTime_initializers, _incidentTime_extraInitializers);
        __esDecorate(null, null, _incidentType_decorators, { kind: "field", name: "incidentType", static: false, private: false, access: { has: obj => "incidentType" in obj, get: obj => obj.incidentType, set: (obj, value) => { obj.incidentType = value; } }, metadata: _metadata }, _incidentType_initializers, _incidentType_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _personnelInvolved_decorators, { kind: "field", name: "personnelInvolved", static: false, private: false, access: { has: obj => "personnelInvolved" in obj, get: obj => obj.personnelInvolved, set: (obj, value) => { obj.personnelInvolved = value; } }, metadata: _metadata }, _personnelInvolved_initializers, _personnelInvolved_extraInitializers);
        __esDecorate(null, null, _witnessIds_decorators, { kind: "field", name: "witnessIds", static: false, private: false, access: { has: obj => "witnessIds" in obj, get: obj => obj.witnessIds, set: (obj, value) => { obj.witnessIds = value; } }, metadata: _metadata }, _witnessIds_initializers, _witnessIds_extraInitializers);
        __esDecorate(null, null, _immediateAction_decorators, { kind: "field", name: "immediateAction", static: false, private: false, access: { has: obj => "immediateAction" in obj, get: obj => obj.immediateAction, set: (obj, value) => { obj.immediateAction = value; } }, metadata: _metadata }, _immediateAction_initializers, _immediateAction_extraInitializers);
        __esDecorate(null, null, _reportedBy_decorators, { kind: "field", name: "reportedBy", static: false, private: false, access: { has: obj => "reportedBy" in obj, get: obj => obj.reportedBy, set: (obj, value) => { obj.reportedBy = value; } }, metadata: _metadata }, _reportedBy_initializers, _reportedBy_extraInitializers);
        __esDecorate(null, null, _reportedAt_decorators, { kind: "field", name: "reportedAt", static: false, private: false, access: { has: obj => "reportedAt" in obj, get: obj => obj.reportedAt, set: (obj, value) => { obj.reportedAt = value; } }, metadata: _metadata }, _reportedAt_initializers, _reportedAt_extraInitializers);
        __esDecorate(null, null, _investigationStatus_decorators, { kind: "field", name: "investigationStatus", static: false, private: false, access: { has: obj => "investigationStatus" in obj, get: obj => obj.investigationStatus, set: (obj, value) => { obj.investigationStatus = value; } }, metadata: _metadata }, _investigationStatus_initializers, _investigationStatus_extraInitializers);
        __esDecorate(null, null, _investigator_decorators, { kind: "field", name: "investigator", static: false, private: false, access: { has: obj => "investigator" in obj, get: obj => obj.investigator, set: (obj, value) => { obj.investigator = value; } }, metadata: _metadata }, _investigator_initializers, _investigator_extraInitializers);
        __esDecorate(null, null, _investigationStartDate_decorators, { kind: "field", name: "investigationStartDate", static: false, private: false, access: { has: obj => "investigationStartDate" in obj, get: obj => obj.investigationStartDate, set: (obj, value) => { obj.investigationStartDate = value; } }, metadata: _metadata }, _investigationStartDate_initializers, _investigationStartDate_extraInitializers);
        __esDecorate(null, null, _investigationCompletedDate_decorators, { kind: "field", name: "investigationCompletedDate", static: false, private: false, access: { has: obj => "investigationCompletedDate" in obj, get: obj => obj.investigationCompletedDate, set: (obj, value) => { obj.investigationCompletedDate = value; } }, metadata: _metadata }, _investigationCompletedDate_initializers, _investigationCompletedDate_extraInitializers);
        __esDecorate(null, null, _rootCause_decorators, { kind: "field", name: "rootCause", static: false, private: false, access: { has: obj => "rootCause" in obj, get: obj => obj.rootCause, set: (obj, value) => { obj.rootCause = value; } }, metadata: _metadata }, _rootCause_initializers, _rootCause_extraInitializers);
        __esDecorate(null, null, _contributingFactors_decorators, { kind: "field", name: "contributingFactors", static: false, private: false, access: { has: obj => "contributingFactors" in obj, get: obj => obj.contributingFactors, set: (obj, value) => { obj.contributingFactors = value; } }, metadata: _metadata }, _contributingFactors_initializers, _contributingFactors_extraInitializers);
        __esDecorate(null, null, _correctiveActions_decorators, { kind: "field", name: "correctiveActions", static: false, private: false, access: { has: obj => "correctiveActions" in obj, get: obj => obj.correctiveActions, set: (obj, value) => { obj.correctiveActions = value; } }, metadata: _metadata }, _correctiveActions_initializers, _correctiveActions_extraInitializers);
        __esDecorate(null, null, _preventiveActions_decorators, { kind: "field", name: "preventiveActions", static: false, private: false, access: { has: obj => "preventiveActions" in obj, get: obj => obj.preventiveActions, set: (obj, value) => { obj.preventiveActions = value; } }, metadata: _metadata }, _preventiveActions_initializers, _preventiveActions_extraInitializers);
        __esDecorate(null, null, _oshaRecordable_decorators, { kind: "field", name: "oshaRecordable", static: false, private: false, access: { has: obj => "oshaRecordable" in obj, get: obj => obj.oshaRecordable, set: (obj, value) => { obj.oshaRecordable = value; } }, metadata: _metadata }, _oshaRecordable_initializers, _oshaRecordable_extraInitializers);
        __esDecorate(null, null, _oshaReportNumber_decorators, { kind: "field", name: "oshaReportNumber", static: false, private: false, access: { has: obj => "oshaReportNumber" in obj, get: obj => obj.oshaReportNumber, set: (obj, value) => { obj.oshaReportNumber = value; } }, metadata: _metadata }, _oshaReportNumber_initializers, _oshaReportNumber_extraInitializers);
        __esDecorate(null, null, _lostTimeDays_decorators, { kind: "field", name: "lostTimeDays", static: false, private: false, access: { has: obj => "lostTimeDays" in obj, get: obj => obj.lostTimeDays, set: (obj, value) => { obj.lostTimeDays = value; } }, metadata: _metadata }, _lostTimeDays_initializers, _lostTimeDays_extraInitializers);
        __esDecorate(null, null, _medicalTreatmentRequired_decorators, { kind: "field", name: "medicalTreatmentRequired", static: false, private: false, access: { has: obj => "medicalTreatmentRequired" in obj, get: obj => obj.medicalTreatmentRequired, set: (obj, value) => { obj.medicalTreatmentRequired = value; } }, metadata: _metadata }, _medicalTreatmentRequired_initializers, _medicalTreatmentRequired_extraInitializers);
        __esDecorate(null, null, _costEstimate_decorators, { kind: "field", name: "costEstimate", static: false, private: false, access: { has: obj => "costEstimate" in obj, get: obj => obj.costEstimate, set: (obj, value) => { obj.costEstimate = value; } }, metadata: _metadata }, _costEstimate_initializers, _costEstimate_extraInitializers);
        __esDecorate(null, null, _photoUrls_decorators, { kind: "field", name: "photoUrls", static: false, private: false, access: { has: obj => "photoUrls" in obj, get: obj => obj.photoUrls, set: (obj, value) => { obj.photoUrls = value; } }, metadata: _metadata }, _photoUrls_initializers, _photoUrls_extraInitializers);
        __esDecorate(null, null, _documentUrls_decorators, { kind: "field", name: "documentUrls", static: false, private: false, access: { has: obj => "documentUrls" in obj, get: obj => obj.documentUrls, set: (obj, value) => { obj.documentUrls = value; } }, metadata: _metadata }, _documentUrls_initializers, _documentUrls_extraInitializers);
        __esDecorate(null, null, _closedAt_decorators, { kind: "field", name: "closedAt", static: false, private: false, access: { has: obj => "closedAt" in obj, get: obj => obj.closedAt, set: (obj, value) => { obj.closedAt = value; } }, metadata: _metadata }, _closedAt_initializers, _closedAt_extraInitializers);
        __esDecorate(null, null, _closedBy_decorators, { kind: "field", name: "closedBy", static: false, private: false, access: { has: obj => "closedBy" in obj, get: obj => obj.closedBy, set: (obj, value) => { obj.closedBy = value; } }, metadata: _metadata }, _closedBy_initializers, _closedBy_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SiteSafetyIncident = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SiteSafetyIncident = _classThis;
})();
exports.SiteSafetyIncident = SiteSafetyIncident;
//# sourceMappingURL=site-safety-incident.model.js.map