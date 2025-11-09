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
exports.BidSolicitation = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const bid_types_1 = require("../types/bid.types");
const bid_submission_model_1 = require("./bid-submission.model");
let BidSolicitation = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'bid_solicitations',
            timestamps: true,
            indexes: [
                { fields: ['projectId'] },
                { fields: ['status'] },
                { fields: ['procurementMethod'] },
                { fields: ['openingDate'] },
                { fields: ['closingDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _solicitationNumber_decorators;
    let _solicitationNumber_initializers = [];
    let _solicitationNumber_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _procurementMethod_decorators;
    let _procurementMethod_initializers = [];
    let _procurementMethod_extraInitializers = [];
    let _awardMethod_decorators;
    let _awardMethod_initializers = [];
    let _awardMethod_extraInitializers = [];
    let _estimatedValue_decorators;
    let _estimatedValue_initializers = [];
    let _estimatedValue_extraInitializers = [];
    let _publishedDate_decorators;
    let _publishedDate_initializers = [];
    let _publishedDate_extraInitializers = [];
    let _openingDate_decorators;
    let _openingDate_initializers = [];
    let _openingDate_extraInitializers = [];
    let _closingDate_decorators;
    let _closingDate_initializers = [];
    let _closingDate_extraInitializers = [];
    let _prebidMeetingDate_decorators;
    let _prebidMeetingDate_initializers = [];
    let _prebidMeetingDate_extraInitializers = [];
    let _prebidMeetingLocation_decorators;
    let _prebidMeetingLocation_initializers = [];
    let _prebidMeetingLocation_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _bondRequirement_decorators;
    let _bondRequirement_initializers = [];
    let _bondRequirement_extraInitializers = [];
    let _bondPercentage_decorators;
    let _bondPercentage_initializers = [];
    let _bondPercentage_extraInitializers = [];
    let _insuranceRequirements_decorators;
    let _insuranceRequirements_initializers = [];
    let _insuranceRequirements_extraInitializers = [];
    let _evaluationCriteria_decorators;
    let _evaluationCriteria_initializers = [];
    let _evaluationCriteria_extraInitializers = [];
    let _smallBusinessGoals_decorators;
    let _smallBusinessGoals_initializers = [];
    let _smallBusinessGoals_extraInitializers = [];
    let _dbeGoals_decorators;
    let _dbeGoals_initializers = [];
    let _dbeGoals_extraInitializers = [];
    let _documents_decorators;
    let _documents_initializers = [];
    let _documents_extraInitializers = [];
    let _addenda_decorators;
    let _addenda_initializers = [];
    let _addenda_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _submissions_decorators;
    let _submissions_initializers = [];
    let _submissions_extraInitializers = [];
    var BidSolicitation = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.solicitationNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _solicitationNumber_initializers, void 0));
            this.projectId = (__runInitializers(this, _solicitationNumber_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.title = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.procurementMethod = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _procurementMethod_initializers, void 0));
            this.awardMethod = (__runInitializers(this, _procurementMethod_extraInitializers), __runInitializers(this, _awardMethod_initializers, void 0));
            this.estimatedValue = (__runInitializers(this, _awardMethod_extraInitializers), __runInitializers(this, _estimatedValue_initializers, void 0));
            this.publishedDate = (__runInitializers(this, _estimatedValue_extraInitializers), __runInitializers(this, _publishedDate_initializers, void 0));
            this.openingDate = (__runInitializers(this, _publishedDate_extraInitializers), __runInitializers(this, _openingDate_initializers, void 0));
            this.closingDate = (__runInitializers(this, _openingDate_extraInitializers), __runInitializers(this, _closingDate_initializers, void 0));
            this.prebidMeetingDate = (__runInitializers(this, _closingDate_extraInitializers), __runInitializers(this, _prebidMeetingDate_initializers, void 0));
            this.prebidMeetingLocation = (__runInitializers(this, _prebidMeetingDate_extraInitializers), __runInitializers(this, _prebidMeetingLocation_initializers, void 0));
            this.status = (__runInitializers(this, _prebidMeetingLocation_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.bondRequirement = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _bondRequirement_initializers, void 0));
            this.bondPercentage = (__runInitializers(this, _bondRequirement_extraInitializers), __runInitializers(this, _bondPercentage_initializers, void 0));
            this.insuranceRequirements = (__runInitializers(this, _bondPercentage_extraInitializers), __runInitializers(this, _insuranceRequirements_initializers, void 0));
            this.evaluationCriteria = (__runInitializers(this, _insuranceRequirements_extraInitializers), __runInitializers(this, _evaluationCriteria_initializers, void 0));
            this.smallBusinessGoals = (__runInitializers(this, _evaluationCriteria_extraInitializers), __runInitializers(this, _smallBusinessGoals_initializers, void 0));
            this.dbeGoals = (__runInitializers(this, _smallBusinessGoals_extraInitializers), __runInitializers(this, _dbeGoals_initializers, void 0));
            this.documents = (__runInitializers(this, _dbeGoals_extraInitializers), __runInitializers(this, _documents_initializers, void 0));
            this.addenda = (__runInitializers(this, _documents_extraInitializers), __runInitializers(this, _addenda_initializers, void 0));
            this.metadata = (__runInitializers(this, _addenda_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdBy = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.submissions = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _submissions_initializers, void 0));
            __runInitializers(this, _submissions_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "BidSolicitation");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _solicitationNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _projectId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _title_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _procurementMethod_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(bid_types_1.ProcurementMethod)),
            })];
        _awardMethod_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(bid_types_1.AwardMethod)),
            })];
        _estimatedValue_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _publishedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _openingDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _closingDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _prebidMeetingDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _prebidMeetingLocation_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(bid_types_1.BidSolicitationStatus.DRAFT), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(bid_types_1.BidSolicitationStatus)),
            })];
        _bondRequirement_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _bondPercentage_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _insuranceRequirements_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _evaluationCriteria_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _smallBusinessGoals_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _dbeGoals_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _documents_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _addenda_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _createdBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _updatedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _submissions_decorators = [(0, sequelize_typescript_1.HasMany)(() => bid_submission_model_1.BidSubmission)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _solicitationNumber_decorators, { kind: "field", name: "solicitationNumber", static: false, private: false, access: { has: obj => "solicitationNumber" in obj, get: obj => obj.solicitationNumber, set: (obj, value) => { obj.solicitationNumber = value; } }, metadata: _metadata }, _solicitationNumber_initializers, _solicitationNumber_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _procurementMethod_decorators, { kind: "field", name: "procurementMethod", static: false, private: false, access: { has: obj => "procurementMethod" in obj, get: obj => obj.procurementMethod, set: (obj, value) => { obj.procurementMethod = value; } }, metadata: _metadata }, _procurementMethod_initializers, _procurementMethod_extraInitializers);
        __esDecorate(null, null, _awardMethod_decorators, { kind: "field", name: "awardMethod", static: false, private: false, access: { has: obj => "awardMethod" in obj, get: obj => obj.awardMethod, set: (obj, value) => { obj.awardMethod = value; } }, metadata: _metadata }, _awardMethod_initializers, _awardMethod_extraInitializers);
        __esDecorate(null, null, _estimatedValue_decorators, { kind: "field", name: "estimatedValue", static: false, private: false, access: { has: obj => "estimatedValue" in obj, get: obj => obj.estimatedValue, set: (obj, value) => { obj.estimatedValue = value; } }, metadata: _metadata }, _estimatedValue_initializers, _estimatedValue_extraInitializers);
        __esDecorate(null, null, _publishedDate_decorators, { kind: "field", name: "publishedDate", static: false, private: false, access: { has: obj => "publishedDate" in obj, get: obj => obj.publishedDate, set: (obj, value) => { obj.publishedDate = value; } }, metadata: _metadata }, _publishedDate_initializers, _publishedDate_extraInitializers);
        __esDecorate(null, null, _openingDate_decorators, { kind: "field", name: "openingDate", static: false, private: false, access: { has: obj => "openingDate" in obj, get: obj => obj.openingDate, set: (obj, value) => { obj.openingDate = value; } }, metadata: _metadata }, _openingDate_initializers, _openingDate_extraInitializers);
        __esDecorate(null, null, _closingDate_decorators, { kind: "field", name: "closingDate", static: false, private: false, access: { has: obj => "closingDate" in obj, get: obj => obj.closingDate, set: (obj, value) => { obj.closingDate = value; } }, metadata: _metadata }, _closingDate_initializers, _closingDate_extraInitializers);
        __esDecorate(null, null, _prebidMeetingDate_decorators, { kind: "field", name: "prebidMeetingDate", static: false, private: false, access: { has: obj => "prebidMeetingDate" in obj, get: obj => obj.prebidMeetingDate, set: (obj, value) => { obj.prebidMeetingDate = value; } }, metadata: _metadata }, _prebidMeetingDate_initializers, _prebidMeetingDate_extraInitializers);
        __esDecorate(null, null, _prebidMeetingLocation_decorators, { kind: "field", name: "prebidMeetingLocation", static: false, private: false, access: { has: obj => "prebidMeetingLocation" in obj, get: obj => obj.prebidMeetingLocation, set: (obj, value) => { obj.prebidMeetingLocation = value; } }, metadata: _metadata }, _prebidMeetingLocation_initializers, _prebidMeetingLocation_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _bondRequirement_decorators, { kind: "field", name: "bondRequirement", static: false, private: false, access: { has: obj => "bondRequirement" in obj, get: obj => obj.bondRequirement, set: (obj, value) => { obj.bondRequirement = value; } }, metadata: _metadata }, _bondRequirement_initializers, _bondRequirement_extraInitializers);
        __esDecorate(null, null, _bondPercentage_decorators, { kind: "field", name: "bondPercentage", static: false, private: false, access: { has: obj => "bondPercentage" in obj, get: obj => obj.bondPercentage, set: (obj, value) => { obj.bondPercentage = value; } }, metadata: _metadata }, _bondPercentage_initializers, _bondPercentage_extraInitializers);
        __esDecorate(null, null, _insuranceRequirements_decorators, { kind: "field", name: "insuranceRequirements", static: false, private: false, access: { has: obj => "insuranceRequirements" in obj, get: obj => obj.insuranceRequirements, set: (obj, value) => { obj.insuranceRequirements = value; } }, metadata: _metadata }, _insuranceRequirements_initializers, _insuranceRequirements_extraInitializers);
        __esDecorate(null, null, _evaluationCriteria_decorators, { kind: "field", name: "evaluationCriteria", static: false, private: false, access: { has: obj => "evaluationCriteria" in obj, get: obj => obj.evaluationCriteria, set: (obj, value) => { obj.evaluationCriteria = value; } }, metadata: _metadata }, _evaluationCriteria_initializers, _evaluationCriteria_extraInitializers);
        __esDecorate(null, null, _smallBusinessGoals_decorators, { kind: "field", name: "smallBusinessGoals", static: false, private: false, access: { has: obj => "smallBusinessGoals" in obj, get: obj => obj.smallBusinessGoals, set: (obj, value) => { obj.smallBusinessGoals = value; } }, metadata: _metadata }, _smallBusinessGoals_initializers, _smallBusinessGoals_extraInitializers);
        __esDecorate(null, null, _dbeGoals_decorators, { kind: "field", name: "dbeGoals", static: false, private: false, access: { has: obj => "dbeGoals" in obj, get: obj => obj.dbeGoals, set: (obj, value) => { obj.dbeGoals = value; } }, metadata: _metadata }, _dbeGoals_initializers, _dbeGoals_extraInitializers);
        __esDecorate(null, null, _documents_decorators, { kind: "field", name: "documents", static: false, private: false, access: { has: obj => "documents" in obj, get: obj => obj.documents, set: (obj, value) => { obj.documents = value; } }, metadata: _metadata }, _documents_initializers, _documents_extraInitializers);
        __esDecorate(null, null, _addenda_decorators, { kind: "field", name: "addenda", static: false, private: false, access: { has: obj => "addenda" in obj, get: obj => obj.addenda, set: (obj, value) => { obj.addenda = value; } }, metadata: _metadata }, _addenda_initializers, _addenda_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _submissions_decorators, { kind: "field", name: "submissions", static: false, private: false, access: { has: obj => "submissions" in obj, get: obj => obj.submissions, set: (obj, value) => { obj.submissions = value; } }, metadata: _metadata }, _submissions_initializers, _submissions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BidSolicitation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BidSolicitation = _classThis;
})();
exports.BidSolicitation = BidSolicitation;
//# sourceMappingURL=bid-solicitation.model.js.map