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
exports.DailySiteLog = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const construction_site_model_1 = require("./construction-site.model");
let DailySiteLog = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'daily_site_logs',
            timestamps: true,
            indexes: [
                { fields: ['siteId'] },
                { fields: ['logDate'] },
                { fields: ['submittedBy'] },
                { fields: ['siteId', 'logDate'], unique: true },
                { fields: ['weatherImpact'] },
                { fields: ['approvedBy'] },
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
    let _logDate_decorators;
    let _logDate_initializers = [];
    let _logDate_extraInitializers = [];
    let _submittedBy_decorators;
    let _submittedBy_initializers = [];
    let _submittedBy_extraInitializers = [];
    let _workPerformed_decorators;
    let _workPerformed_initializers = [];
    let _workPerformed_extraInitializers = [];
    let _crewCount_decorators;
    let _crewCount_initializers = [];
    let _crewCount_extraInitializers = [];
    let _equipmentUsed_decorators;
    let _equipmentUsed_initializers = [];
    let _equipmentUsed_extraInitializers = [];
    let _materialsDelivered_decorators;
    let _materialsDelivered_initializers = [];
    let _materialsDelivered_extraInitializers = [];
    let _inspections_decorators;
    let _inspections_initializers = [];
    let _inspections_extraInitializers = [];
    let _visitorLog_decorators;
    let _visitorLog_initializers = [];
    let _visitorLog_extraInitializers = [];
    let _delaysEncountered_decorators;
    let _delaysEncountered_initializers = [];
    let _delaysEncountered_extraInitializers = [];
    let _safetyObservations_decorators;
    let _safetyObservations_initializers = [];
    let _safetyObservations_extraInitializers = [];
    let _weatherConditions_decorators;
    let _weatherConditions_initializers = [];
    let _weatherConditions_extraInitializers = [];
    let _weatherImpact_decorators;
    let _weatherImpact_initializers = [];
    let _weatherImpact_extraInitializers = [];
    let _hoursWorked_decorators;
    let _hoursWorked_initializers = [];
    let _hoursWorked_extraInitializers = [];
    let _overtimeHours_decorators;
    let _overtimeHours_initializers = [];
    let _overtimeHours_extraInitializers = [];
    let _productivityRating_decorators;
    let _productivityRating_initializers = [];
    let _productivityRating_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _photoUrls_decorators;
    let _photoUrls_initializers = [];
    let _photoUrls_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _submittedAt_decorators;
    let _submittedAt_initializers = [];
    let _submittedAt_extraInitializers = [];
    var DailySiteLog = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.siteId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _siteId_initializers, void 0));
            this.logDate = (__runInitializers(this, _siteId_extraInitializers), __runInitializers(this, _logDate_initializers, void 0));
            this.submittedBy = (__runInitializers(this, _logDate_extraInitializers), __runInitializers(this, _submittedBy_initializers, void 0));
            this.workPerformed = (__runInitializers(this, _submittedBy_extraInitializers), __runInitializers(this, _workPerformed_initializers, void 0));
            this.crewCount = (__runInitializers(this, _workPerformed_extraInitializers), __runInitializers(this, _crewCount_initializers, void 0));
            this.equipmentUsed = (__runInitializers(this, _crewCount_extraInitializers), __runInitializers(this, _equipmentUsed_initializers, void 0));
            this.materialsDelivered = (__runInitializers(this, _equipmentUsed_extraInitializers), __runInitializers(this, _materialsDelivered_initializers, void 0));
            this.inspections = (__runInitializers(this, _materialsDelivered_extraInitializers), __runInitializers(this, _inspections_initializers, void 0));
            this.visitorLog = (__runInitializers(this, _inspections_extraInitializers), __runInitializers(this, _visitorLog_initializers, void 0));
            this.delaysEncountered = (__runInitializers(this, _visitorLog_extraInitializers), __runInitializers(this, _delaysEncountered_initializers, void 0));
            this.safetyObservations = (__runInitializers(this, _delaysEncountered_extraInitializers), __runInitializers(this, _safetyObservations_initializers, void 0));
            this.weatherConditions = (__runInitializers(this, _safetyObservations_extraInitializers), __runInitializers(this, _weatherConditions_initializers, void 0));
            this.weatherImpact = (__runInitializers(this, _weatherConditions_extraInitializers), __runInitializers(this, _weatherImpact_initializers, void 0));
            this.hoursWorked = (__runInitializers(this, _weatherImpact_extraInitializers), __runInitializers(this, _hoursWorked_initializers, void 0));
            this.overtimeHours = (__runInitializers(this, _hoursWorked_extraInitializers), __runInitializers(this, _overtimeHours_initializers, void 0));
            this.productivityRating = (__runInitializers(this, _overtimeHours_extraInitializers), __runInitializers(this, _productivityRating_initializers, void 0));
            this.notes = (__runInitializers(this, _productivityRating_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.photoUrls = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _photoUrls_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _photoUrls_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
            this.submittedAt = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _submittedAt_initializers, void 0));
            __runInitializers(this, _submittedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DailySiteLog");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _siteId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => construction_site_model_1.ConstructionSite), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _logDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATEONLY)];
        _submittedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _workPerformed_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _crewCount_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _equipmentUsed_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _materialsDelivered_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _inspections_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _visitorLog_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _delaysEncountered_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _safetyObservations_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _weatherConditions_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _weatherImpact_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _hoursWorked_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _overtimeHours_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _productivityRating_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _notes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _photoUrls_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _approvedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _submittedAt_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _siteId_decorators, { kind: "field", name: "siteId", static: false, private: false, access: { has: obj => "siteId" in obj, get: obj => obj.siteId, set: (obj, value) => { obj.siteId = value; } }, metadata: _metadata }, _siteId_initializers, _siteId_extraInitializers);
        __esDecorate(null, null, _logDate_decorators, { kind: "field", name: "logDate", static: false, private: false, access: { has: obj => "logDate" in obj, get: obj => obj.logDate, set: (obj, value) => { obj.logDate = value; } }, metadata: _metadata }, _logDate_initializers, _logDate_extraInitializers);
        __esDecorate(null, null, _submittedBy_decorators, { kind: "field", name: "submittedBy", static: false, private: false, access: { has: obj => "submittedBy" in obj, get: obj => obj.submittedBy, set: (obj, value) => { obj.submittedBy = value; } }, metadata: _metadata }, _submittedBy_initializers, _submittedBy_extraInitializers);
        __esDecorate(null, null, _workPerformed_decorators, { kind: "field", name: "workPerformed", static: false, private: false, access: { has: obj => "workPerformed" in obj, get: obj => obj.workPerformed, set: (obj, value) => { obj.workPerformed = value; } }, metadata: _metadata }, _workPerformed_initializers, _workPerformed_extraInitializers);
        __esDecorate(null, null, _crewCount_decorators, { kind: "field", name: "crewCount", static: false, private: false, access: { has: obj => "crewCount" in obj, get: obj => obj.crewCount, set: (obj, value) => { obj.crewCount = value; } }, metadata: _metadata }, _crewCount_initializers, _crewCount_extraInitializers);
        __esDecorate(null, null, _equipmentUsed_decorators, { kind: "field", name: "equipmentUsed", static: false, private: false, access: { has: obj => "equipmentUsed" in obj, get: obj => obj.equipmentUsed, set: (obj, value) => { obj.equipmentUsed = value; } }, metadata: _metadata }, _equipmentUsed_initializers, _equipmentUsed_extraInitializers);
        __esDecorate(null, null, _materialsDelivered_decorators, { kind: "field", name: "materialsDelivered", static: false, private: false, access: { has: obj => "materialsDelivered" in obj, get: obj => obj.materialsDelivered, set: (obj, value) => { obj.materialsDelivered = value; } }, metadata: _metadata }, _materialsDelivered_initializers, _materialsDelivered_extraInitializers);
        __esDecorate(null, null, _inspections_decorators, { kind: "field", name: "inspections", static: false, private: false, access: { has: obj => "inspections" in obj, get: obj => obj.inspections, set: (obj, value) => { obj.inspections = value; } }, metadata: _metadata }, _inspections_initializers, _inspections_extraInitializers);
        __esDecorate(null, null, _visitorLog_decorators, { kind: "field", name: "visitorLog", static: false, private: false, access: { has: obj => "visitorLog" in obj, get: obj => obj.visitorLog, set: (obj, value) => { obj.visitorLog = value; } }, metadata: _metadata }, _visitorLog_initializers, _visitorLog_extraInitializers);
        __esDecorate(null, null, _delaysEncountered_decorators, { kind: "field", name: "delaysEncountered", static: false, private: false, access: { has: obj => "delaysEncountered" in obj, get: obj => obj.delaysEncountered, set: (obj, value) => { obj.delaysEncountered = value; } }, metadata: _metadata }, _delaysEncountered_initializers, _delaysEncountered_extraInitializers);
        __esDecorate(null, null, _safetyObservations_decorators, { kind: "field", name: "safetyObservations", static: false, private: false, access: { has: obj => "safetyObservations" in obj, get: obj => obj.safetyObservations, set: (obj, value) => { obj.safetyObservations = value; } }, metadata: _metadata }, _safetyObservations_initializers, _safetyObservations_extraInitializers);
        __esDecorate(null, null, _weatherConditions_decorators, { kind: "field", name: "weatherConditions", static: false, private: false, access: { has: obj => "weatherConditions" in obj, get: obj => obj.weatherConditions, set: (obj, value) => { obj.weatherConditions = value; } }, metadata: _metadata }, _weatherConditions_initializers, _weatherConditions_extraInitializers);
        __esDecorate(null, null, _weatherImpact_decorators, { kind: "field", name: "weatherImpact", static: false, private: false, access: { has: obj => "weatherImpact" in obj, get: obj => obj.weatherImpact, set: (obj, value) => { obj.weatherImpact = value; } }, metadata: _metadata }, _weatherImpact_initializers, _weatherImpact_extraInitializers);
        __esDecorate(null, null, _hoursWorked_decorators, { kind: "field", name: "hoursWorked", static: false, private: false, access: { has: obj => "hoursWorked" in obj, get: obj => obj.hoursWorked, set: (obj, value) => { obj.hoursWorked = value; } }, metadata: _metadata }, _hoursWorked_initializers, _hoursWorked_extraInitializers);
        __esDecorate(null, null, _overtimeHours_decorators, { kind: "field", name: "overtimeHours", static: false, private: false, access: { has: obj => "overtimeHours" in obj, get: obj => obj.overtimeHours, set: (obj, value) => { obj.overtimeHours = value; } }, metadata: _metadata }, _overtimeHours_initializers, _overtimeHours_extraInitializers);
        __esDecorate(null, null, _productivityRating_decorators, { kind: "field", name: "productivityRating", static: false, private: false, access: { has: obj => "productivityRating" in obj, get: obj => obj.productivityRating, set: (obj, value) => { obj.productivityRating = value; } }, metadata: _metadata }, _productivityRating_initializers, _productivityRating_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _photoUrls_decorators, { kind: "field", name: "photoUrls", static: false, private: false, access: { has: obj => "photoUrls" in obj, get: obj => obj.photoUrls, set: (obj, value) => { obj.photoUrls = value; } }, metadata: _metadata }, _photoUrls_initializers, _photoUrls_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
        __esDecorate(null, null, _submittedAt_decorators, { kind: "field", name: "submittedAt", static: false, private: false, access: { has: obj => "submittedAt" in obj, get: obj => obj.submittedAt, set: (obj, value) => { obj.submittedAt = value; } }, metadata: _metadata }, _submittedAt_initializers, _submittedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DailySiteLog = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DailySiteLog = _classThis;
})();
exports.DailySiteLog = DailySiteLog;
//# sourceMappingURL=daily-site-log.model.js.map