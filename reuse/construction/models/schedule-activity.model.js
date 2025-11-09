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
exports.ScheduleActivity = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const schedule_types_1 = require("../types/schedule.types");
let ScheduleActivity = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'schedule_activities',
            timestamps: true,
            indexes: [
                { fields: ['projectId'] },
                { fields: ['activityId'], unique: true },
                { fields: ['activityCode'] },
                { fields: ['status'] },
                { fields: ['isCritical'] },
                { fields: ['isMilestone'] },
                { fields: ['plannedStartDate'] },
                { fields: ['plannedFinishDate'] },
                { fields: ['projectId', 'status'] },
                { fields: ['projectId', 'isCritical'] },
                { fields: ['discipline'] },
                { fields: ['phase'] },
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
    let _activityId_decorators;
    let _activityId_initializers = [];
    let _activityId_extraInitializers = [];
    let _activityCode_decorators;
    let _activityCode_initializers = [];
    let _activityCode_extraInitializers = [];
    let _activityName_decorators;
    let _activityName_initializers = [];
    let _activityName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _discipline_decorators;
    let _discipline_initializers = [];
    let _discipline_extraInitializers = [];
    let _phase_decorators;
    let _phase_initializers = [];
    let _phase_extraInitializers = [];
    let _workPackageId_decorators;
    let _workPackageId_initializers = [];
    let _workPackageId_extraInitializers = [];
    let _duration_decorators;
    let _duration_initializers = [];
    let _duration_extraInitializers = [];
    let _durationType_decorators;
    let _durationType_initializers = [];
    let _durationType_extraInitializers = [];
    let _plannedStartDate_decorators;
    let _plannedStartDate_initializers = [];
    let _plannedStartDate_extraInitializers = [];
    let _plannedFinishDate_decorators;
    let _plannedFinishDate_initializers = [];
    let _plannedFinishDate_extraInitializers = [];
    let _actualStartDate_decorators;
    let _actualStartDate_initializers = [];
    let _actualStartDate_extraInitializers = [];
    let _actualFinishDate_decorators;
    let _actualFinishDate_initializers = [];
    let _actualFinishDate_extraInitializers = [];
    let _forecastStartDate_decorators;
    let _forecastStartDate_initializers = [];
    let _forecastStartDate_extraInitializers = [];
    let _forecastFinishDate_decorators;
    let _forecastFinishDate_initializers = [];
    let _forecastFinishDate_extraInitializers = [];
    let _earlyStartDate_decorators;
    let _earlyStartDate_initializers = [];
    let _earlyStartDate_extraInitializers = [];
    let _earlyFinishDate_decorators;
    let _earlyFinishDate_initializers = [];
    let _earlyFinishDate_extraInitializers = [];
    let _lateStartDate_decorators;
    let _lateStartDate_initializers = [];
    let _lateStartDate_extraInitializers = [];
    let _lateFinishDate_decorators;
    let _lateFinishDate_initializers = [];
    let _lateFinishDate_extraInitializers = [];
    let _totalFloat_decorators;
    let _totalFloat_initializers = [];
    let _totalFloat_extraInitializers = [];
    let _freeFloat_decorators;
    let _freeFloat_initializers = [];
    let _freeFloat_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _percentComplete_decorators;
    let _percentComplete_initializers = [];
    let _percentComplete_extraInitializers = [];
    let _constraintType_decorators;
    let _constraintType_initializers = [];
    let _constraintType_extraInitializers = [];
    let _constraintDate_decorators;
    let _constraintDate_initializers = [];
    let _constraintDate_extraInitializers = [];
    let _isCritical_decorators;
    let _isCritical_initializers = [];
    let _isCritical_extraInitializers = [];
    let _isMilestone_decorators;
    let _isMilestone_initializers = [];
    let _isMilestone_extraInitializers = [];
    let _baselineStartDate_decorators;
    let _baselineStartDate_initializers = [];
    let _baselineStartDate_extraInitializers = [];
    let _baselineFinishDate_decorators;
    let _baselineFinishDate_initializers = [];
    let _baselineFinishDate_extraInitializers = [];
    let _baselineDuration_decorators;
    let _baselineDuration_initializers = [];
    let _baselineDuration_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var ScheduleActivity = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.activityId = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _activityId_initializers, void 0));
            this.activityCode = (__runInitializers(this, _activityId_extraInitializers), __runInitializers(this, _activityCode_initializers, void 0));
            this.activityName = (__runInitializers(this, _activityCode_extraInitializers), __runInitializers(this, _activityName_initializers, void 0));
            this.description = (__runInitializers(this, _activityName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.discipline = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _discipline_initializers, void 0));
            this.phase = (__runInitializers(this, _discipline_extraInitializers), __runInitializers(this, _phase_initializers, void 0));
            this.workPackageId = (__runInitializers(this, _phase_extraInitializers), __runInitializers(this, _workPackageId_initializers, void 0));
            this.duration = (__runInitializers(this, _workPackageId_extraInitializers), __runInitializers(this, _duration_initializers, void 0));
            this.durationType = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _durationType_initializers, void 0));
            this.plannedStartDate = (__runInitializers(this, _durationType_extraInitializers), __runInitializers(this, _plannedStartDate_initializers, void 0));
            this.plannedFinishDate = (__runInitializers(this, _plannedStartDate_extraInitializers), __runInitializers(this, _plannedFinishDate_initializers, void 0));
            this.actualStartDate = (__runInitializers(this, _plannedFinishDate_extraInitializers), __runInitializers(this, _actualStartDate_initializers, void 0));
            this.actualFinishDate = (__runInitializers(this, _actualStartDate_extraInitializers), __runInitializers(this, _actualFinishDate_initializers, void 0));
            this.forecastStartDate = (__runInitializers(this, _actualFinishDate_extraInitializers), __runInitializers(this, _forecastStartDate_initializers, void 0));
            this.forecastFinishDate = (__runInitializers(this, _forecastStartDate_extraInitializers), __runInitializers(this, _forecastFinishDate_initializers, void 0));
            this.earlyStartDate = (__runInitializers(this, _forecastFinishDate_extraInitializers), __runInitializers(this, _earlyStartDate_initializers, void 0));
            this.earlyFinishDate = (__runInitializers(this, _earlyStartDate_extraInitializers), __runInitializers(this, _earlyFinishDate_initializers, void 0));
            this.lateStartDate = (__runInitializers(this, _earlyFinishDate_extraInitializers), __runInitializers(this, _lateStartDate_initializers, void 0));
            this.lateFinishDate = (__runInitializers(this, _lateStartDate_extraInitializers), __runInitializers(this, _lateFinishDate_initializers, void 0));
            this.totalFloat = (__runInitializers(this, _lateFinishDate_extraInitializers), __runInitializers(this, _totalFloat_initializers, void 0));
            this.freeFloat = (__runInitializers(this, _totalFloat_extraInitializers), __runInitializers(this, _freeFloat_initializers, void 0));
            this.status = (__runInitializers(this, _freeFloat_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.percentComplete = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _percentComplete_initializers, void 0));
            this.constraintType = (__runInitializers(this, _percentComplete_extraInitializers), __runInitializers(this, _constraintType_initializers, void 0));
            this.constraintDate = (__runInitializers(this, _constraintType_extraInitializers), __runInitializers(this, _constraintDate_initializers, void 0));
            this.isCritical = (__runInitializers(this, _constraintDate_extraInitializers), __runInitializers(this, _isCritical_initializers, void 0));
            this.isMilestone = (__runInitializers(this, _isCritical_extraInitializers), __runInitializers(this, _isMilestone_initializers, void 0));
            this.baselineStartDate = (__runInitializers(this, _isMilestone_extraInitializers), __runInitializers(this, _baselineStartDate_initializers, void 0));
            this.baselineFinishDate = (__runInitializers(this, _baselineStartDate_extraInitializers), __runInitializers(this, _baselineFinishDate_initializers, void 0));
            this.baselineDuration = (__runInitializers(this, _baselineFinishDate_extraInitializers), __runInitializers(this, _baselineDuration_initializers, void 0));
            this.metadata = (__runInitializers(this, _baselineDuration_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ScheduleActivity");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _projectId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _activityId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _activityCode_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _activityName_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(''), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _discipline_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(''), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _phase_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(''), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _workPackageId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _duration_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _durationType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(schedule_types_1.DurationType.WORKING_DAYS), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(schedule_types_1.DurationType)),
            })];
        _plannedStartDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _plannedFinishDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _actualStartDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _actualFinishDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _forecastStartDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _forecastFinishDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _earlyStartDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _earlyFinishDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _lateStartDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _lateFinishDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _totalFloat_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _freeFloat_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(schedule_types_1.ActivityStatus.NOT_STARTED), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(schedule_types_1.ActivityStatus)),
            })];
        _percentComplete_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _constraintType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(schedule_types_1.ConstraintType)),
            })];
        _constraintDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _isCritical_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _isMilestone_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _baselineStartDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _baselineFinishDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _baselineDuration_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _activityId_decorators, { kind: "field", name: "activityId", static: false, private: false, access: { has: obj => "activityId" in obj, get: obj => obj.activityId, set: (obj, value) => { obj.activityId = value; } }, metadata: _metadata }, _activityId_initializers, _activityId_extraInitializers);
        __esDecorate(null, null, _activityCode_decorators, { kind: "field", name: "activityCode", static: false, private: false, access: { has: obj => "activityCode" in obj, get: obj => obj.activityCode, set: (obj, value) => { obj.activityCode = value; } }, metadata: _metadata }, _activityCode_initializers, _activityCode_extraInitializers);
        __esDecorate(null, null, _activityName_decorators, { kind: "field", name: "activityName", static: false, private: false, access: { has: obj => "activityName" in obj, get: obj => obj.activityName, set: (obj, value) => { obj.activityName = value; } }, metadata: _metadata }, _activityName_initializers, _activityName_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _discipline_decorators, { kind: "field", name: "discipline", static: false, private: false, access: { has: obj => "discipline" in obj, get: obj => obj.discipline, set: (obj, value) => { obj.discipline = value; } }, metadata: _metadata }, _discipline_initializers, _discipline_extraInitializers);
        __esDecorate(null, null, _phase_decorators, { kind: "field", name: "phase", static: false, private: false, access: { has: obj => "phase" in obj, get: obj => obj.phase, set: (obj, value) => { obj.phase = value; } }, metadata: _metadata }, _phase_initializers, _phase_extraInitializers);
        __esDecorate(null, null, _workPackageId_decorators, { kind: "field", name: "workPackageId", static: false, private: false, access: { has: obj => "workPackageId" in obj, get: obj => obj.workPackageId, set: (obj, value) => { obj.workPackageId = value; } }, metadata: _metadata }, _workPackageId_initializers, _workPackageId_extraInitializers);
        __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
        __esDecorate(null, null, _durationType_decorators, { kind: "field", name: "durationType", static: false, private: false, access: { has: obj => "durationType" in obj, get: obj => obj.durationType, set: (obj, value) => { obj.durationType = value; } }, metadata: _metadata }, _durationType_initializers, _durationType_extraInitializers);
        __esDecorate(null, null, _plannedStartDate_decorators, { kind: "field", name: "plannedStartDate", static: false, private: false, access: { has: obj => "plannedStartDate" in obj, get: obj => obj.plannedStartDate, set: (obj, value) => { obj.plannedStartDate = value; } }, metadata: _metadata }, _plannedStartDate_initializers, _plannedStartDate_extraInitializers);
        __esDecorate(null, null, _plannedFinishDate_decorators, { kind: "field", name: "plannedFinishDate", static: false, private: false, access: { has: obj => "plannedFinishDate" in obj, get: obj => obj.plannedFinishDate, set: (obj, value) => { obj.plannedFinishDate = value; } }, metadata: _metadata }, _plannedFinishDate_initializers, _plannedFinishDate_extraInitializers);
        __esDecorate(null, null, _actualStartDate_decorators, { kind: "field", name: "actualStartDate", static: false, private: false, access: { has: obj => "actualStartDate" in obj, get: obj => obj.actualStartDate, set: (obj, value) => { obj.actualStartDate = value; } }, metadata: _metadata }, _actualStartDate_initializers, _actualStartDate_extraInitializers);
        __esDecorate(null, null, _actualFinishDate_decorators, { kind: "field", name: "actualFinishDate", static: false, private: false, access: { has: obj => "actualFinishDate" in obj, get: obj => obj.actualFinishDate, set: (obj, value) => { obj.actualFinishDate = value; } }, metadata: _metadata }, _actualFinishDate_initializers, _actualFinishDate_extraInitializers);
        __esDecorate(null, null, _forecastStartDate_decorators, { kind: "field", name: "forecastStartDate", static: false, private: false, access: { has: obj => "forecastStartDate" in obj, get: obj => obj.forecastStartDate, set: (obj, value) => { obj.forecastStartDate = value; } }, metadata: _metadata }, _forecastStartDate_initializers, _forecastStartDate_extraInitializers);
        __esDecorate(null, null, _forecastFinishDate_decorators, { kind: "field", name: "forecastFinishDate", static: false, private: false, access: { has: obj => "forecastFinishDate" in obj, get: obj => obj.forecastFinishDate, set: (obj, value) => { obj.forecastFinishDate = value; } }, metadata: _metadata }, _forecastFinishDate_initializers, _forecastFinishDate_extraInitializers);
        __esDecorate(null, null, _earlyStartDate_decorators, { kind: "field", name: "earlyStartDate", static: false, private: false, access: { has: obj => "earlyStartDate" in obj, get: obj => obj.earlyStartDate, set: (obj, value) => { obj.earlyStartDate = value; } }, metadata: _metadata }, _earlyStartDate_initializers, _earlyStartDate_extraInitializers);
        __esDecorate(null, null, _earlyFinishDate_decorators, { kind: "field", name: "earlyFinishDate", static: false, private: false, access: { has: obj => "earlyFinishDate" in obj, get: obj => obj.earlyFinishDate, set: (obj, value) => { obj.earlyFinishDate = value; } }, metadata: _metadata }, _earlyFinishDate_initializers, _earlyFinishDate_extraInitializers);
        __esDecorate(null, null, _lateStartDate_decorators, { kind: "field", name: "lateStartDate", static: false, private: false, access: { has: obj => "lateStartDate" in obj, get: obj => obj.lateStartDate, set: (obj, value) => { obj.lateStartDate = value; } }, metadata: _metadata }, _lateStartDate_initializers, _lateStartDate_extraInitializers);
        __esDecorate(null, null, _lateFinishDate_decorators, { kind: "field", name: "lateFinishDate", static: false, private: false, access: { has: obj => "lateFinishDate" in obj, get: obj => obj.lateFinishDate, set: (obj, value) => { obj.lateFinishDate = value; } }, metadata: _metadata }, _lateFinishDate_initializers, _lateFinishDate_extraInitializers);
        __esDecorate(null, null, _totalFloat_decorators, { kind: "field", name: "totalFloat", static: false, private: false, access: { has: obj => "totalFloat" in obj, get: obj => obj.totalFloat, set: (obj, value) => { obj.totalFloat = value; } }, metadata: _metadata }, _totalFloat_initializers, _totalFloat_extraInitializers);
        __esDecorate(null, null, _freeFloat_decorators, { kind: "field", name: "freeFloat", static: false, private: false, access: { has: obj => "freeFloat" in obj, get: obj => obj.freeFloat, set: (obj, value) => { obj.freeFloat = value; } }, metadata: _metadata }, _freeFloat_initializers, _freeFloat_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _percentComplete_decorators, { kind: "field", name: "percentComplete", static: false, private: false, access: { has: obj => "percentComplete" in obj, get: obj => obj.percentComplete, set: (obj, value) => { obj.percentComplete = value; } }, metadata: _metadata }, _percentComplete_initializers, _percentComplete_extraInitializers);
        __esDecorate(null, null, _constraintType_decorators, { kind: "field", name: "constraintType", static: false, private: false, access: { has: obj => "constraintType" in obj, get: obj => obj.constraintType, set: (obj, value) => { obj.constraintType = value; } }, metadata: _metadata }, _constraintType_initializers, _constraintType_extraInitializers);
        __esDecorate(null, null, _constraintDate_decorators, { kind: "field", name: "constraintDate", static: false, private: false, access: { has: obj => "constraintDate" in obj, get: obj => obj.constraintDate, set: (obj, value) => { obj.constraintDate = value; } }, metadata: _metadata }, _constraintDate_initializers, _constraintDate_extraInitializers);
        __esDecorate(null, null, _isCritical_decorators, { kind: "field", name: "isCritical", static: false, private: false, access: { has: obj => "isCritical" in obj, get: obj => obj.isCritical, set: (obj, value) => { obj.isCritical = value; } }, metadata: _metadata }, _isCritical_initializers, _isCritical_extraInitializers);
        __esDecorate(null, null, _isMilestone_decorators, { kind: "field", name: "isMilestone", static: false, private: false, access: { has: obj => "isMilestone" in obj, get: obj => obj.isMilestone, set: (obj, value) => { obj.isMilestone = value; } }, metadata: _metadata }, _isMilestone_initializers, _isMilestone_extraInitializers);
        __esDecorate(null, null, _baselineStartDate_decorators, { kind: "field", name: "baselineStartDate", static: false, private: false, access: { has: obj => "baselineStartDate" in obj, get: obj => obj.baselineStartDate, set: (obj, value) => { obj.baselineStartDate = value; } }, metadata: _metadata }, _baselineStartDate_initializers, _baselineStartDate_extraInitializers);
        __esDecorate(null, null, _baselineFinishDate_decorators, { kind: "field", name: "baselineFinishDate", static: false, private: false, access: { has: obj => "baselineFinishDate" in obj, get: obj => obj.baselineFinishDate, set: (obj, value) => { obj.baselineFinishDate = value; } }, metadata: _metadata }, _baselineFinishDate_initializers, _baselineFinishDate_extraInitializers);
        __esDecorate(null, null, _baselineDuration_decorators, { kind: "field", name: "baselineDuration", static: false, private: false, access: { has: obj => "baselineDuration" in obj, get: obj => obj.baselineDuration, set: (obj, value) => { obj.baselineDuration = value; } }, metadata: _metadata }, _baselineDuration_initializers, _baselineDuration_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ScheduleActivity = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ScheduleActivity = _classThis;
})();
exports.ScheduleActivity = ScheduleActivity;
//# sourceMappingURL=schedule-activity.model.js.map