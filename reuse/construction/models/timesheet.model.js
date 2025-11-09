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
exports.Timesheet = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const labor_types_1 = require("../types/labor.types");
let Timesheet = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'timesheets', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _workerId_decorators;
    let _workerId_initializers = [];
    let _workerId_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _weekEnding_decorators;
    let _weekEnding_initializers = [];
    let _weekEnding_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _regularHours_decorators;
    let _regularHours_initializers = [];
    let _regularHours_extraInitializers = [];
    let _overtimeHours_decorators;
    let _overtimeHours_initializers = [];
    let _overtimeHours_extraInitializers = [];
    let _doubleTimeHours_decorators;
    let _doubleTimeHours_initializers = [];
    let _doubleTimeHours_extraInitializers = [];
    let _totalWages_decorators;
    let _totalWages_initializers = [];
    let _totalWages_extraInitializers = [];
    let _craft_decorators;
    let _craft_initializers = [];
    let _craft_extraInitializers = [];
    let _hourlyRate_decorators;
    let _hourlyRate_initializers = [];
    let _hourlyRate_extraInitializers = [];
    let _prevailingWageRate_decorators;
    let _prevailingWageRate_initializers = [];
    let _prevailingWageRate_extraInitializers = [];
    let _isPrevailingWage_decorators;
    let _isPrevailingWage_initializers = [];
    let _isPrevailingWage_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _rejectionReason_decorators;
    let _rejectionReason_initializers = [];
    let _rejectionReason_extraInitializers = [];
    let _dailyEntries_decorators;
    let _dailyEntries_initializers = [];
    let _dailyEntries_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var Timesheet = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.workerId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _workerId_initializers, void 0));
            this.projectId = (__runInitializers(this, _workerId_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.weekEnding = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _weekEnding_initializers, void 0));
            this.status = (__runInitializers(this, _weekEnding_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.regularHours = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _regularHours_initializers, void 0));
            this.overtimeHours = (__runInitializers(this, _regularHours_extraInitializers), __runInitializers(this, _overtimeHours_initializers, void 0));
            this.doubleTimeHours = (__runInitializers(this, _overtimeHours_extraInitializers), __runInitializers(this, _doubleTimeHours_initializers, void 0));
            this.totalWages = (__runInitializers(this, _doubleTimeHours_extraInitializers), __runInitializers(this, _totalWages_initializers, void 0));
            this.craft = (__runInitializers(this, _totalWages_extraInitializers), __runInitializers(this, _craft_initializers, void 0));
            this.hourlyRate = (__runInitializers(this, _craft_extraInitializers), __runInitializers(this, _hourlyRate_initializers, void 0));
            this.prevailingWageRate = (__runInitializers(this, _hourlyRate_extraInitializers), __runInitializers(this, _prevailingWageRate_initializers, void 0));
            this.isPrevailingWage = (__runInitializers(this, _prevailingWageRate_extraInitializers), __runInitializers(this, _isPrevailingWage_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _isPrevailingWage_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
            this.rejectionReason = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _rejectionReason_initializers, void 0));
            this.dailyEntries = (__runInitializers(this, _rejectionReason_extraInitializers), __runInitializers(this, _dailyEntries_initializers, void 0));
            this.createdAt = (__runInitializers(this, _dailyEntries_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Timesheet");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _workerId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _projectId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _weekEnding_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(labor_types_1.TimesheetStatus)), defaultValue: labor_types_1.TimesheetStatus.DRAFT })];
        _regularHours_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(8, 2), defaultValue: 0 })];
        _overtimeHours_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(8, 2), defaultValue: 0 })];
        _doubleTimeHours_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(8, 2), defaultValue: 0 })];
        _totalWages_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), defaultValue: 0 })];
        _craft_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(labor_types_1.LaborCraft)) })];
        _hourlyRate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(8, 2) })];
        _prevailingWageRate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(8, 2) })];
        _isPrevailingWage_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _approvedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _rejectionReason_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _dailyEntries_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _workerId_decorators, { kind: "field", name: "workerId", static: false, private: false, access: { has: obj => "workerId" in obj, get: obj => obj.workerId, set: (obj, value) => { obj.workerId = value; } }, metadata: _metadata }, _workerId_initializers, _workerId_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _weekEnding_decorators, { kind: "field", name: "weekEnding", static: false, private: false, access: { has: obj => "weekEnding" in obj, get: obj => obj.weekEnding, set: (obj, value) => { obj.weekEnding = value; } }, metadata: _metadata }, _weekEnding_initializers, _weekEnding_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _regularHours_decorators, { kind: "field", name: "regularHours", static: false, private: false, access: { has: obj => "regularHours" in obj, get: obj => obj.regularHours, set: (obj, value) => { obj.regularHours = value; } }, metadata: _metadata }, _regularHours_initializers, _regularHours_extraInitializers);
        __esDecorate(null, null, _overtimeHours_decorators, { kind: "field", name: "overtimeHours", static: false, private: false, access: { has: obj => "overtimeHours" in obj, get: obj => obj.overtimeHours, set: (obj, value) => { obj.overtimeHours = value; } }, metadata: _metadata }, _overtimeHours_initializers, _overtimeHours_extraInitializers);
        __esDecorate(null, null, _doubleTimeHours_decorators, { kind: "field", name: "doubleTimeHours", static: false, private: false, access: { has: obj => "doubleTimeHours" in obj, get: obj => obj.doubleTimeHours, set: (obj, value) => { obj.doubleTimeHours = value; } }, metadata: _metadata }, _doubleTimeHours_initializers, _doubleTimeHours_extraInitializers);
        __esDecorate(null, null, _totalWages_decorators, { kind: "field", name: "totalWages", static: false, private: false, access: { has: obj => "totalWages" in obj, get: obj => obj.totalWages, set: (obj, value) => { obj.totalWages = value; } }, metadata: _metadata }, _totalWages_initializers, _totalWages_extraInitializers);
        __esDecorate(null, null, _craft_decorators, { kind: "field", name: "craft", static: false, private: false, access: { has: obj => "craft" in obj, get: obj => obj.craft, set: (obj, value) => { obj.craft = value; } }, metadata: _metadata }, _craft_initializers, _craft_extraInitializers);
        __esDecorate(null, null, _hourlyRate_decorators, { kind: "field", name: "hourlyRate", static: false, private: false, access: { has: obj => "hourlyRate" in obj, get: obj => obj.hourlyRate, set: (obj, value) => { obj.hourlyRate = value; } }, metadata: _metadata }, _hourlyRate_initializers, _hourlyRate_extraInitializers);
        __esDecorate(null, null, _prevailingWageRate_decorators, { kind: "field", name: "prevailingWageRate", static: false, private: false, access: { has: obj => "prevailingWageRate" in obj, get: obj => obj.prevailingWageRate, set: (obj, value) => { obj.prevailingWageRate = value; } }, metadata: _metadata }, _prevailingWageRate_initializers, _prevailingWageRate_extraInitializers);
        __esDecorate(null, null, _isPrevailingWage_decorators, { kind: "field", name: "isPrevailingWage", static: false, private: false, access: { has: obj => "isPrevailingWage" in obj, get: obj => obj.isPrevailingWage, set: (obj, value) => { obj.isPrevailingWage = value; } }, metadata: _metadata }, _isPrevailingWage_initializers, _isPrevailingWage_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
        __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: obj => "rejectionReason" in obj, get: obj => obj.rejectionReason, set: (obj, value) => { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
        __esDecorate(null, null, _dailyEntries_decorators, { kind: "field", name: "dailyEntries", static: false, private: false, access: { has: obj => "dailyEntries" in obj, get: obj => obj.dailyEntries, set: (obj, value) => { obj.dailyEntries = value; } }, metadata: _metadata }, _dailyEntries_initializers, _dailyEntries_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Timesheet = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Timesheet = _classThis;
})();
exports.Timesheet = Timesheet;
//# sourceMappingURL=timesheet.model.js.map