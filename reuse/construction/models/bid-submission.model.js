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
exports.BidSubmission = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const bid_types_1 = require("../types/bid.types");
const bid_solicitation_model_1 = require("./bid-solicitation.model");
let BidSubmission = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'bid_submissions',
            timestamps: true,
            indexes: [
                { fields: ['solicitationId'] },
                { fields: ['vendorId'] },
                { fields: ['status'] },
                { fields: ['rank'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _solicitationId_decorators;
    let _solicitationId_initializers = [];
    let _solicitationId_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _vendorName_decorators;
    let _vendorName_initializers = [];
    let _vendorName_extraInitializers = [];
    let _bidNumber_decorators;
    let _bidNumber_initializers = [];
    let _bidNumber_extraInitializers = [];
    let _submittalDate_decorators;
    let _submittalDate_initializers = [];
    let _submittalDate_extraInitializers = [];
    let _bidAmount_decorators;
    let _bidAmount_initializers = [];
    let _bidAmount_extraInitializers = [];
    let _bidBondAmount_decorators;
    let _bidBondAmount_initializers = [];
    let _bidBondAmount_extraInitializers = [];
    let _bidBondProvider_decorators;
    let _bidBondProvider_initializers = [];
    let _bidBondProvider_extraInitializers = [];
    let _technicalScore_decorators;
    let _technicalScore_initializers = [];
    let _technicalScore_extraInitializers = [];
    let _financialScore_decorators;
    let _financialScore_initializers = [];
    let _financialScore_extraInitializers = [];
    let _totalScore_decorators;
    let _totalScore_initializers = [];
    let _totalScore_extraInitializers = [];
    let _rank_decorators;
    let _rank_initializers = [];
    let _rank_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _responsiveness_decorators;
    let _responsiveness_initializers = [];
    let _responsiveness_extraInitializers = [];
    let _responsibility_decorators;
    let _responsibility_initializers = [];
    let _responsibility_extraInitializers = [];
    let _scheduleProposed_decorators;
    let _scheduleProposed_initializers = [];
    let _scheduleProposed_extraInitializers = [];
    let _alternatesProvided_decorators;
    let _alternatesProvided_initializers = [];
    let _alternatesProvided_extraInitializers = [];
    let _valueEngineeringProposals_decorators;
    let _valueEngineeringProposals_initializers = [];
    let _valueEngineeringProposals_extraInitializers = [];
    let _clarifications_decorators;
    let _clarifications_initializers = [];
    let _clarifications_extraInitializers = [];
    let _evaluationNotes_decorators;
    let _evaluationNotes_initializers = [];
    let _evaluationNotes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _solicitation_decorators;
    let _solicitation_initializers = [];
    let _solicitation_extraInitializers = [];
    var BidSubmission = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.solicitationId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _solicitationId_initializers, void 0));
            this.vendorId = (__runInitializers(this, _solicitationId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.vendorName = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _vendorName_initializers, void 0));
            this.bidNumber = (__runInitializers(this, _vendorName_extraInitializers), __runInitializers(this, _bidNumber_initializers, void 0));
            this.submittalDate = (__runInitializers(this, _bidNumber_extraInitializers), __runInitializers(this, _submittalDate_initializers, void 0));
            this.bidAmount = (__runInitializers(this, _submittalDate_extraInitializers), __runInitializers(this, _bidAmount_initializers, void 0));
            this.bidBondAmount = (__runInitializers(this, _bidAmount_extraInitializers), __runInitializers(this, _bidBondAmount_initializers, void 0));
            this.bidBondProvider = (__runInitializers(this, _bidBondAmount_extraInitializers), __runInitializers(this, _bidBondProvider_initializers, void 0));
            this.technicalScore = (__runInitializers(this, _bidBondProvider_extraInitializers), __runInitializers(this, _technicalScore_initializers, void 0));
            this.financialScore = (__runInitializers(this, _technicalScore_extraInitializers), __runInitializers(this, _financialScore_initializers, void 0));
            this.totalScore = (__runInitializers(this, _financialScore_extraInitializers), __runInitializers(this, _totalScore_initializers, void 0));
            this.rank = (__runInitializers(this, _totalScore_extraInitializers), __runInitializers(this, _rank_initializers, void 0));
            this.status = (__runInitializers(this, _rank_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.responsiveness = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _responsiveness_initializers, void 0));
            this.responsibility = (__runInitializers(this, _responsiveness_extraInitializers), __runInitializers(this, _responsibility_initializers, void 0));
            this.scheduleProposed = (__runInitializers(this, _responsibility_extraInitializers), __runInitializers(this, _scheduleProposed_initializers, void 0)); // in days
            this.alternatesProvided = (__runInitializers(this, _scheduleProposed_extraInitializers), __runInitializers(this, _alternatesProvided_initializers, void 0));
            this.valueEngineeringProposals = (__runInitializers(this, _alternatesProvided_extraInitializers), __runInitializers(this, _valueEngineeringProposals_initializers, void 0));
            this.clarifications = (__runInitializers(this, _valueEngineeringProposals_extraInitializers), __runInitializers(this, _clarifications_initializers, void 0));
            this.evaluationNotes = (__runInitializers(this, _clarifications_extraInitializers), __runInitializers(this, _evaluationNotes_initializers, void 0));
            this.metadata = (__runInitializers(this, _evaluationNotes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.solicitation = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _solicitation_initializers, void 0));
            __runInitializers(this, _solicitation_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "BidSubmission");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _solicitationId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => bid_solicitation_model_1.BidSolicitation), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _vendorId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _vendorName_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _bidNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _submittalDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _bidAmount_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _bidBondAmount_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _bidBondProvider_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _technicalScore_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _financialScore_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _totalScore_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _rank_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(bid_types_1.BidStatus.DRAFT), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(bid_types_1.BidStatus)),
            })];
        _responsiveness_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _responsibility_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _scheduleProposed_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _alternatesProvided_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _valueEngineeringProposals_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _clarifications_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _evaluationNotes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _solicitation_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => bid_solicitation_model_1.BidSolicitation)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _solicitationId_decorators, { kind: "field", name: "solicitationId", static: false, private: false, access: { has: obj => "solicitationId" in obj, get: obj => obj.solicitationId, set: (obj, value) => { obj.solicitationId = value; } }, metadata: _metadata }, _solicitationId_initializers, _solicitationId_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _vendorName_decorators, { kind: "field", name: "vendorName", static: false, private: false, access: { has: obj => "vendorName" in obj, get: obj => obj.vendorName, set: (obj, value) => { obj.vendorName = value; } }, metadata: _metadata }, _vendorName_initializers, _vendorName_extraInitializers);
        __esDecorate(null, null, _bidNumber_decorators, { kind: "field", name: "bidNumber", static: false, private: false, access: { has: obj => "bidNumber" in obj, get: obj => obj.bidNumber, set: (obj, value) => { obj.bidNumber = value; } }, metadata: _metadata }, _bidNumber_initializers, _bidNumber_extraInitializers);
        __esDecorate(null, null, _submittalDate_decorators, { kind: "field", name: "submittalDate", static: false, private: false, access: { has: obj => "submittalDate" in obj, get: obj => obj.submittalDate, set: (obj, value) => { obj.submittalDate = value; } }, metadata: _metadata }, _submittalDate_initializers, _submittalDate_extraInitializers);
        __esDecorate(null, null, _bidAmount_decorators, { kind: "field", name: "bidAmount", static: false, private: false, access: { has: obj => "bidAmount" in obj, get: obj => obj.bidAmount, set: (obj, value) => { obj.bidAmount = value; } }, metadata: _metadata }, _bidAmount_initializers, _bidAmount_extraInitializers);
        __esDecorate(null, null, _bidBondAmount_decorators, { kind: "field", name: "bidBondAmount", static: false, private: false, access: { has: obj => "bidBondAmount" in obj, get: obj => obj.bidBondAmount, set: (obj, value) => { obj.bidBondAmount = value; } }, metadata: _metadata }, _bidBondAmount_initializers, _bidBondAmount_extraInitializers);
        __esDecorate(null, null, _bidBondProvider_decorators, { kind: "field", name: "bidBondProvider", static: false, private: false, access: { has: obj => "bidBondProvider" in obj, get: obj => obj.bidBondProvider, set: (obj, value) => { obj.bidBondProvider = value; } }, metadata: _metadata }, _bidBondProvider_initializers, _bidBondProvider_extraInitializers);
        __esDecorate(null, null, _technicalScore_decorators, { kind: "field", name: "technicalScore", static: false, private: false, access: { has: obj => "technicalScore" in obj, get: obj => obj.technicalScore, set: (obj, value) => { obj.technicalScore = value; } }, metadata: _metadata }, _technicalScore_initializers, _technicalScore_extraInitializers);
        __esDecorate(null, null, _financialScore_decorators, { kind: "field", name: "financialScore", static: false, private: false, access: { has: obj => "financialScore" in obj, get: obj => obj.financialScore, set: (obj, value) => { obj.financialScore = value; } }, metadata: _metadata }, _financialScore_initializers, _financialScore_extraInitializers);
        __esDecorate(null, null, _totalScore_decorators, { kind: "field", name: "totalScore", static: false, private: false, access: { has: obj => "totalScore" in obj, get: obj => obj.totalScore, set: (obj, value) => { obj.totalScore = value; } }, metadata: _metadata }, _totalScore_initializers, _totalScore_extraInitializers);
        __esDecorate(null, null, _rank_decorators, { kind: "field", name: "rank", static: false, private: false, access: { has: obj => "rank" in obj, get: obj => obj.rank, set: (obj, value) => { obj.rank = value; } }, metadata: _metadata }, _rank_initializers, _rank_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _responsiveness_decorators, { kind: "field", name: "responsiveness", static: false, private: false, access: { has: obj => "responsiveness" in obj, get: obj => obj.responsiveness, set: (obj, value) => { obj.responsiveness = value; } }, metadata: _metadata }, _responsiveness_initializers, _responsiveness_extraInitializers);
        __esDecorate(null, null, _responsibility_decorators, { kind: "field", name: "responsibility", static: false, private: false, access: { has: obj => "responsibility" in obj, get: obj => obj.responsibility, set: (obj, value) => { obj.responsibility = value; } }, metadata: _metadata }, _responsibility_initializers, _responsibility_extraInitializers);
        __esDecorate(null, null, _scheduleProposed_decorators, { kind: "field", name: "scheduleProposed", static: false, private: false, access: { has: obj => "scheduleProposed" in obj, get: obj => obj.scheduleProposed, set: (obj, value) => { obj.scheduleProposed = value; } }, metadata: _metadata }, _scheduleProposed_initializers, _scheduleProposed_extraInitializers);
        __esDecorate(null, null, _alternatesProvided_decorators, { kind: "field", name: "alternatesProvided", static: false, private: false, access: { has: obj => "alternatesProvided" in obj, get: obj => obj.alternatesProvided, set: (obj, value) => { obj.alternatesProvided = value; } }, metadata: _metadata }, _alternatesProvided_initializers, _alternatesProvided_extraInitializers);
        __esDecorate(null, null, _valueEngineeringProposals_decorators, { kind: "field", name: "valueEngineeringProposals", static: false, private: false, access: { has: obj => "valueEngineeringProposals" in obj, get: obj => obj.valueEngineeringProposals, set: (obj, value) => { obj.valueEngineeringProposals = value; } }, metadata: _metadata }, _valueEngineeringProposals_initializers, _valueEngineeringProposals_extraInitializers);
        __esDecorate(null, null, _clarifications_decorators, { kind: "field", name: "clarifications", static: false, private: false, access: { has: obj => "clarifications" in obj, get: obj => obj.clarifications, set: (obj, value) => { obj.clarifications = value; } }, metadata: _metadata }, _clarifications_initializers, _clarifications_extraInitializers);
        __esDecorate(null, null, _evaluationNotes_decorators, { kind: "field", name: "evaluationNotes", static: false, private: false, access: { has: obj => "evaluationNotes" in obj, get: obj => obj.evaluationNotes, set: (obj, value) => { obj.evaluationNotes = value; } }, metadata: _metadata }, _evaluationNotes_initializers, _evaluationNotes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _solicitation_decorators, { kind: "field", name: "solicitation", static: false, private: false, access: { has: obj => "solicitation" in obj, get: obj => obj.solicitation, set: (obj, value) => { obj.solicitation = value; } }, metadata: _metadata }, _solicitation_initializers, _solicitation_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BidSubmission = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BidSubmission = _classThis;
})();
exports.BidSubmission = BidSubmission;
//# sourceMappingURL=bid-submission.model.js.map