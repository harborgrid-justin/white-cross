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
exports.SafetyIncident = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const safety_types_1 = require("../types/safety.types");
let SafetyIncident = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'safety_incidents',
            timestamps: true,
            indexes: [
                { fields: ['incidentNumber'], unique: true },
                { fields: ['projectId'] },
                { fields: ['safetyPlanId'] },
                { fields: ['incidentType'] },
                { fields: ['severity'] },
                { fields: ['status'] },
                { fields: ['occurredDate'] },
                { fields: ['oshaRecordable'] },
                { fields: ['contractor'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _incidentNumber_decorators;
    let _incidentNumber_initializers = [];
    let _incidentNumber_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _safetyPlanId_decorators;
    let _safetyPlanId_initializers = [];
    let _safetyPlanId_extraInitializers = [];
    let _incidentType_decorators;
    let _incidentType_initializers = [];
    let _incidentType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _occurredDate_decorators;
    let _occurredDate_initializers = [];
    let _occurredDate_extraInitializers = [];
    let _occurredTime_decorators;
    let _occurredTime_initializers = [];
    let _occurredTime_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _injuredPersons_decorators;
    let _injuredPersons_initializers = [];
    let _injuredPersons_extraInitializers = [];
    let _witnesses_decorators;
    let _witnesses_initializers = [];
    let _witnesses_extraInitializers = [];
    let _immediateActions_decorators;
    let _immediateActions_initializers = [];
    let _immediateActions_extraInitializers = [];
    let _reportedBy_decorators;
    let _reportedBy_initializers = [];
    let _reportedBy_extraInitializers = [];
    let _reportedDate_decorators;
    let _reportedDate_initializers = [];
    let _reportedDate_extraInitializers = [];
    let _contractor_decorators;
    let _contractor_initializers = [];
    let _contractor_extraInitializers = [];
    let _trade_decorators;
    let _trade_initializers = [];
    let _trade_extraInitializers = [];
    let _activity_decorators;
    let _activity_initializers = [];
    let _activity_extraInitializers = [];
    let _oshaRecordable_decorators;
    let _oshaRecordable_initializers = [];
    let _oshaRecordable_extraInitializers = [];
    let _workersCompClaim_decorators;
    let _workersCompClaim_initializers = [];
    let _workersCompClaim_extraInitializers = [];
    let _lostWorkDays_decorators;
    let _lostWorkDays_initializers = [];
    let _lostWorkDays_extraInitializers = [];
    let _restrictedWorkDays_decorators;
    let _restrictedWorkDays_initializers = [];
    let _restrictedWorkDays_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _investigationRequired_decorators;
    let _investigationRequired_initializers = [];
    let _investigationRequired_extraInitializers = [];
    let _investigationId_decorators;
    let _investigationId_initializers = [];
    let _investigationId_extraInitializers = [];
    let _rootCause_decorators;
    let _rootCause_initializers = [];
    let _rootCause_extraInitializers = [];
    let _correctiveActions_decorators;
    let _correctiveActions_initializers = [];
    let _correctiveActions_extraInitializers = [];
    let _closedBy_decorators;
    let _closedBy_initializers = [];
    let _closedBy_extraInitializers = [];
    let _closedDate_decorators;
    let _closedDate_initializers = [];
    let _closedDate_extraInitializers = [];
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
    var SafetyIncident = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.incidentNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _incidentNumber_initializers, void 0));
            this.projectId = (__runInitializers(this, _incidentNumber_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.safetyPlanId = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _safetyPlanId_initializers, void 0));
            this.incidentType = (__runInitializers(this, _safetyPlanId_extraInitializers), __runInitializers(this, _incidentType_initializers, void 0));
            this.severity = (__runInitializers(this, _incidentType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.occurredDate = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _occurredDate_initializers, void 0));
            this.occurredTime = (__runInitializers(this, _occurredDate_extraInitializers), __runInitializers(this, _occurredTime_initializers, void 0));
            this.location = (__runInitializers(this, _occurredTime_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.description = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.injuredPersons = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _injuredPersons_initializers, void 0));
            this.witnesses = (__runInitializers(this, _injuredPersons_extraInitializers), __runInitializers(this, _witnesses_initializers, void 0));
            this.immediateActions = (__runInitializers(this, _witnesses_extraInitializers), __runInitializers(this, _immediateActions_initializers, void 0));
            this.reportedBy = (__runInitializers(this, _immediateActions_extraInitializers), __runInitializers(this, _reportedBy_initializers, void 0));
            this.reportedDate = (__runInitializers(this, _reportedBy_extraInitializers), __runInitializers(this, _reportedDate_initializers, void 0));
            this.contractor = (__runInitializers(this, _reportedDate_extraInitializers), __runInitializers(this, _contractor_initializers, void 0));
            this.trade = (__runInitializers(this, _contractor_extraInitializers), __runInitializers(this, _trade_initializers, void 0));
            this.activity = (__runInitializers(this, _trade_extraInitializers), __runInitializers(this, _activity_initializers, void 0));
            this.oshaRecordable = (__runInitializers(this, _activity_extraInitializers), __runInitializers(this, _oshaRecordable_initializers, void 0));
            this.workersCompClaim = (__runInitializers(this, _oshaRecordable_extraInitializers), __runInitializers(this, _workersCompClaim_initializers, void 0));
            this.lostWorkDays = (__runInitializers(this, _workersCompClaim_extraInitializers), __runInitializers(this, _lostWorkDays_initializers, void 0));
            this.restrictedWorkDays = (__runInitializers(this, _lostWorkDays_extraInitializers), __runInitializers(this, _restrictedWorkDays_initializers, void 0));
            this.status = (__runInitializers(this, _restrictedWorkDays_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.investigationRequired = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _investigationRequired_initializers, void 0));
            this.investigationId = (__runInitializers(this, _investigationRequired_extraInitializers), __runInitializers(this, _investigationId_initializers, void 0));
            this.rootCause = (__runInitializers(this, _investigationId_extraInitializers), __runInitializers(this, _rootCause_initializers, void 0));
            this.correctiveActions = (__runInitializers(this, _rootCause_extraInitializers), __runInitializers(this, _correctiveActions_initializers, void 0));
            this.closedBy = (__runInitializers(this, _correctiveActions_extraInitializers), __runInitializers(this, _closedBy_initializers, void 0));
            this.closedDate = (__runInitializers(this, _closedBy_extraInitializers), __runInitializers(this, _closedDate_initializers, void 0));
            this.attachments = (__runInitializers(this, _closedDate_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.metadata = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdBy = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SafetyIncident");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.INTEGER), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _incidentNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _projectId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _safetyPlanId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _incidentType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(safety_types_1.IncidentType)),
            })];
        _severity_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(safety_types_1.IncidentSeverity)),
            })];
        _occurredDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _occurredTime_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20))];
        _location_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _injuredPersons_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _witnesses_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _immediateActions_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _reportedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _reportedDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _contractor_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _trade_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _activity_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _oshaRecordable_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _workersCompClaim_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _lostWorkDays_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _restrictedWorkDays_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(safety_types_1.IncidentStatus.REPORTED), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(safety_types_1.IncidentStatus)),
            })];
        _investigationRequired_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _investigationId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _rootCause_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _correctiveActions_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _closedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _closedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _attachments_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _createdBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _updatedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _incidentNumber_decorators, { kind: "field", name: "incidentNumber", static: false, private: false, access: { has: obj => "incidentNumber" in obj, get: obj => obj.incidentNumber, set: (obj, value) => { obj.incidentNumber = value; } }, metadata: _metadata }, _incidentNumber_initializers, _incidentNumber_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _safetyPlanId_decorators, { kind: "field", name: "safetyPlanId", static: false, private: false, access: { has: obj => "safetyPlanId" in obj, get: obj => obj.safetyPlanId, set: (obj, value) => { obj.safetyPlanId = value; } }, metadata: _metadata }, _safetyPlanId_initializers, _safetyPlanId_extraInitializers);
        __esDecorate(null, null, _incidentType_decorators, { kind: "field", name: "incidentType", static: false, private: false, access: { has: obj => "incidentType" in obj, get: obj => obj.incidentType, set: (obj, value) => { obj.incidentType = value; } }, metadata: _metadata }, _incidentType_initializers, _incidentType_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _occurredDate_decorators, { kind: "field", name: "occurredDate", static: false, private: false, access: { has: obj => "occurredDate" in obj, get: obj => obj.occurredDate, set: (obj, value) => { obj.occurredDate = value; } }, metadata: _metadata }, _occurredDate_initializers, _occurredDate_extraInitializers);
        __esDecorate(null, null, _occurredTime_decorators, { kind: "field", name: "occurredTime", static: false, private: false, access: { has: obj => "occurredTime" in obj, get: obj => obj.occurredTime, set: (obj, value) => { obj.occurredTime = value; } }, metadata: _metadata }, _occurredTime_initializers, _occurredTime_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _injuredPersons_decorators, { kind: "field", name: "injuredPersons", static: false, private: false, access: { has: obj => "injuredPersons" in obj, get: obj => obj.injuredPersons, set: (obj, value) => { obj.injuredPersons = value; } }, metadata: _metadata }, _injuredPersons_initializers, _injuredPersons_extraInitializers);
        __esDecorate(null, null, _witnesses_decorators, { kind: "field", name: "witnesses", static: false, private: false, access: { has: obj => "witnesses" in obj, get: obj => obj.witnesses, set: (obj, value) => { obj.witnesses = value; } }, metadata: _metadata }, _witnesses_initializers, _witnesses_extraInitializers);
        __esDecorate(null, null, _immediateActions_decorators, { kind: "field", name: "immediateActions", static: false, private: false, access: { has: obj => "immediateActions" in obj, get: obj => obj.immediateActions, set: (obj, value) => { obj.immediateActions = value; } }, metadata: _metadata }, _immediateActions_initializers, _immediateActions_extraInitializers);
        __esDecorate(null, null, _reportedBy_decorators, { kind: "field", name: "reportedBy", static: false, private: false, access: { has: obj => "reportedBy" in obj, get: obj => obj.reportedBy, set: (obj, value) => { obj.reportedBy = value; } }, metadata: _metadata }, _reportedBy_initializers, _reportedBy_extraInitializers);
        __esDecorate(null, null, _reportedDate_decorators, { kind: "field", name: "reportedDate", static: false, private: false, access: { has: obj => "reportedDate" in obj, get: obj => obj.reportedDate, set: (obj, value) => { obj.reportedDate = value; } }, metadata: _metadata }, _reportedDate_initializers, _reportedDate_extraInitializers);
        __esDecorate(null, null, _contractor_decorators, { kind: "field", name: "contractor", static: false, private: false, access: { has: obj => "contractor" in obj, get: obj => obj.contractor, set: (obj, value) => { obj.contractor = value; } }, metadata: _metadata }, _contractor_initializers, _contractor_extraInitializers);
        __esDecorate(null, null, _trade_decorators, { kind: "field", name: "trade", static: false, private: false, access: { has: obj => "trade" in obj, get: obj => obj.trade, set: (obj, value) => { obj.trade = value; } }, metadata: _metadata }, _trade_initializers, _trade_extraInitializers);
        __esDecorate(null, null, _activity_decorators, { kind: "field", name: "activity", static: false, private: false, access: { has: obj => "activity" in obj, get: obj => obj.activity, set: (obj, value) => { obj.activity = value; } }, metadata: _metadata }, _activity_initializers, _activity_extraInitializers);
        __esDecorate(null, null, _oshaRecordable_decorators, { kind: "field", name: "oshaRecordable", static: false, private: false, access: { has: obj => "oshaRecordable" in obj, get: obj => obj.oshaRecordable, set: (obj, value) => { obj.oshaRecordable = value; } }, metadata: _metadata }, _oshaRecordable_initializers, _oshaRecordable_extraInitializers);
        __esDecorate(null, null, _workersCompClaim_decorators, { kind: "field", name: "workersCompClaim", static: false, private: false, access: { has: obj => "workersCompClaim" in obj, get: obj => obj.workersCompClaim, set: (obj, value) => { obj.workersCompClaim = value; } }, metadata: _metadata }, _workersCompClaim_initializers, _workersCompClaim_extraInitializers);
        __esDecorate(null, null, _lostWorkDays_decorators, { kind: "field", name: "lostWorkDays", static: false, private: false, access: { has: obj => "lostWorkDays" in obj, get: obj => obj.lostWorkDays, set: (obj, value) => { obj.lostWorkDays = value; } }, metadata: _metadata }, _lostWorkDays_initializers, _lostWorkDays_extraInitializers);
        __esDecorate(null, null, _restrictedWorkDays_decorators, { kind: "field", name: "restrictedWorkDays", static: false, private: false, access: { has: obj => "restrictedWorkDays" in obj, get: obj => obj.restrictedWorkDays, set: (obj, value) => { obj.restrictedWorkDays = value; } }, metadata: _metadata }, _restrictedWorkDays_initializers, _restrictedWorkDays_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _investigationRequired_decorators, { kind: "field", name: "investigationRequired", static: false, private: false, access: { has: obj => "investigationRequired" in obj, get: obj => obj.investigationRequired, set: (obj, value) => { obj.investigationRequired = value; } }, metadata: _metadata }, _investigationRequired_initializers, _investigationRequired_extraInitializers);
        __esDecorate(null, null, _investigationId_decorators, { kind: "field", name: "investigationId", static: false, private: false, access: { has: obj => "investigationId" in obj, get: obj => obj.investigationId, set: (obj, value) => { obj.investigationId = value; } }, metadata: _metadata }, _investigationId_initializers, _investigationId_extraInitializers);
        __esDecorate(null, null, _rootCause_decorators, { kind: "field", name: "rootCause", static: false, private: false, access: { has: obj => "rootCause" in obj, get: obj => obj.rootCause, set: (obj, value) => { obj.rootCause = value; } }, metadata: _metadata }, _rootCause_initializers, _rootCause_extraInitializers);
        __esDecorate(null, null, _correctiveActions_decorators, { kind: "field", name: "correctiveActions", static: false, private: false, access: { has: obj => "correctiveActions" in obj, get: obj => obj.correctiveActions, set: (obj, value) => { obj.correctiveActions = value; } }, metadata: _metadata }, _correctiveActions_initializers, _correctiveActions_extraInitializers);
        __esDecorate(null, null, _closedBy_decorators, { kind: "field", name: "closedBy", static: false, private: false, access: { has: obj => "closedBy" in obj, get: obj => obj.closedBy, set: (obj, value) => { obj.closedBy = value; } }, metadata: _metadata }, _closedBy_initializers, _closedBy_extraInitializers);
        __esDecorate(null, null, _closedDate_decorators, { kind: "field", name: "closedDate", static: false, private: false, access: { has: obj => "closedDate" in obj, get: obj => obj.closedDate, set: (obj, value) => { obj.closedDate = value; } }, metadata: _metadata }, _closedDate_initializers, _closedDate_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SafetyIncident = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SafetyIncident = _classThis;
})();
exports.SafetyIncident = SafetyIncident;
//# sourceMappingURL=safety-incident.model.js.map