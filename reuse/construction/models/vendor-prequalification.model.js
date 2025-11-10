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
exports.VendorPrequalification = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const bid_types_1 = require("../types/bid.types");
let VendorPrequalification = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'vendor_prequalifications',
            timestamps: true,
            indexes: [
                { fields: ['vendorId'] },
                { fields: ['qualificationStatus'] },
                { fields: ['workCategories'], using: 'gin' },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _vendorName_decorators;
    let _vendorName_initializers = [];
    let _vendorName_extraInitializers = [];
    let _qualificationNumber_decorators;
    let _qualificationNumber_initializers = [];
    let _qualificationNumber_extraInitializers = [];
    let _workCategories_decorators;
    let _workCategories_initializers = [];
    let _workCategories_extraInitializers = [];
    let _maxProjectValue_decorators;
    let _maxProjectValue_initializers = [];
    let _maxProjectValue_extraInitializers = [];
    let _bondingCapacity_decorators;
    let _bondingCapacity_initializers = [];
    let _bondingCapacity_extraInitializers = [];
    let _insuranceCoverage_decorators;
    let _insuranceCoverage_initializers = [];
    let _insuranceCoverage_extraInitializers = [];
    let _pastProjectCount_decorators;
    let _pastProjectCount_initializers = [];
    let _pastProjectCount_extraInitializers = [];
    let _pastProjectValue_decorators;
    let _pastProjectValue_initializers = [];
    let _pastProjectValue_extraInitializers = [];
    let _safetyRating_decorators;
    let _safetyRating_initializers = [];
    let _safetyRating_extraInitializers = [];
    let _qualityRating_decorators;
    let _qualityRating_initializers = [];
    let _qualityRating_extraInitializers = [];
    let _performanceRating_decorators;
    let _performanceRating_initializers = [];
    let _performanceRating_extraInitializers = [];
    let _financialStrength_decorators;
    let _financialStrength_initializers = [];
    let _financialStrength_extraInitializers = [];
    let _qualificationStatus_decorators;
    let _qualificationStatus_initializers = [];
    let _qualificationStatus_extraInitializers = [];
    let _qualifiedDate_decorators;
    let _qualifiedDate_initializers = [];
    let _qualifiedDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _certifications_decorators;
    let _certifications_initializers = [];
    let _certifications_extraInitializers = [];
    let _licenses_decorators;
    let _licenses_initializers = [];
    let _licenses_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var VendorPrequalification = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.vendorId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.vendorName = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _vendorName_initializers, void 0));
            this.qualificationNumber = (__runInitializers(this, _vendorName_extraInitializers), __runInitializers(this, _qualificationNumber_initializers, void 0));
            this.workCategories = (__runInitializers(this, _qualificationNumber_extraInitializers), __runInitializers(this, _workCategories_initializers, void 0));
            this.maxProjectValue = (__runInitializers(this, _workCategories_extraInitializers), __runInitializers(this, _maxProjectValue_initializers, void 0));
            this.bondingCapacity = (__runInitializers(this, _maxProjectValue_extraInitializers), __runInitializers(this, _bondingCapacity_initializers, void 0));
            this.insuranceCoverage = (__runInitializers(this, _bondingCapacity_extraInitializers), __runInitializers(this, _insuranceCoverage_initializers, void 0));
            this.pastProjectCount = (__runInitializers(this, _insuranceCoverage_extraInitializers), __runInitializers(this, _pastProjectCount_initializers, void 0));
            this.pastProjectValue = (__runInitializers(this, _pastProjectCount_extraInitializers), __runInitializers(this, _pastProjectValue_initializers, void 0));
            this.safetyRating = (__runInitializers(this, _pastProjectValue_extraInitializers), __runInitializers(this, _safetyRating_initializers, void 0));
            this.qualityRating = (__runInitializers(this, _safetyRating_extraInitializers), __runInitializers(this, _qualityRating_initializers, void 0));
            this.performanceRating = (__runInitializers(this, _qualityRating_extraInitializers), __runInitializers(this, _performanceRating_initializers, void 0));
            this.financialStrength = (__runInitializers(this, _performanceRating_extraInitializers), __runInitializers(this, _financialStrength_initializers, void 0));
            this.qualificationStatus = (__runInitializers(this, _financialStrength_extraInitializers), __runInitializers(this, _qualificationStatus_initializers, void 0));
            this.qualifiedDate = (__runInitializers(this, _qualificationStatus_extraInitializers), __runInitializers(this, _qualifiedDate_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _qualifiedDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.certifications = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _certifications_initializers, void 0));
            this.licenses = (__runInitializers(this, _certifications_extraInitializers), __runInitializers(this, _licenses_initializers, void 0));
            this.metadata = (__runInitializers(this, _licenses_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "VendorPrequalification");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _vendorId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _vendorName_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _qualificationNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _workCategories_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _maxProjectValue_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _bondingCapacity_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _insuranceCoverage_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _pastProjectCount_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _pastProjectValue_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(19, 2))];
        _safetyRating_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _qualityRating_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _performanceRating_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _financialStrength_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('FAIR'), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR'))];
        _qualificationStatus_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(bid_types_1.VendorQualificationStatus.PENDING), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(bid_types_1.VendorQualificationStatus)),
            })];
        _qualifiedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _expirationDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _certifications_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _licenses_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _vendorName_decorators, { kind: "field", name: "vendorName", static: false, private: false, access: { has: obj => "vendorName" in obj, get: obj => obj.vendorName, set: (obj, value) => { obj.vendorName = value; } }, metadata: _metadata }, _vendorName_initializers, _vendorName_extraInitializers);
        __esDecorate(null, null, _qualificationNumber_decorators, { kind: "field", name: "qualificationNumber", static: false, private: false, access: { has: obj => "qualificationNumber" in obj, get: obj => obj.qualificationNumber, set: (obj, value) => { obj.qualificationNumber = value; } }, metadata: _metadata }, _qualificationNumber_initializers, _qualificationNumber_extraInitializers);
        __esDecorate(null, null, _workCategories_decorators, { kind: "field", name: "workCategories", static: false, private: false, access: { has: obj => "workCategories" in obj, get: obj => obj.workCategories, set: (obj, value) => { obj.workCategories = value; } }, metadata: _metadata }, _workCategories_initializers, _workCategories_extraInitializers);
        __esDecorate(null, null, _maxProjectValue_decorators, { kind: "field", name: "maxProjectValue", static: false, private: false, access: { has: obj => "maxProjectValue" in obj, get: obj => obj.maxProjectValue, set: (obj, value) => { obj.maxProjectValue = value; } }, metadata: _metadata }, _maxProjectValue_initializers, _maxProjectValue_extraInitializers);
        __esDecorate(null, null, _bondingCapacity_decorators, { kind: "field", name: "bondingCapacity", static: false, private: false, access: { has: obj => "bondingCapacity" in obj, get: obj => obj.bondingCapacity, set: (obj, value) => { obj.bondingCapacity = value; } }, metadata: _metadata }, _bondingCapacity_initializers, _bondingCapacity_extraInitializers);
        __esDecorate(null, null, _insuranceCoverage_decorators, { kind: "field", name: "insuranceCoverage", static: false, private: false, access: { has: obj => "insuranceCoverage" in obj, get: obj => obj.insuranceCoverage, set: (obj, value) => { obj.insuranceCoverage = value; } }, metadata: _metadata }, _insuranceCoverage_initializers, _insuranceCoverage_extraInitializers);
        __esDecorate(null, null, _pastProjectCount_decorators, { kind: "field", name: "pastProjectCount", static: false, private: false, access: { has: obj => "pastProjectCount" in obj, get: obj => obj.pastProjectCount, set: (obj, value) => { obj.pastProjectCount = value; } }, metadata: _metadata }, _pastProjectCount_initializers, _pastProjectCount_extraInitializers);
        __esDecorate(null, null, _pastProjectValue_decorators, { kind: "field", name: "pastProjectValue", static: false, private: false, access: { has: obj => "pastProjectValue" in obj, get: obj => obj.pastProjectValue, set: (obj, value) => { obj.pastProjectValue = value; } }, metadata: _metadata }, _pastProjectValue_initializers, _pastProjectValue_extraInitializers);
        __esDecorate(null, null, _safetyRating_decorators, { kind: "field", name: "safetyRating", static: false, private: false, access: { has: obj => "safetyRating" in obj, get: obj => obj.safetyRating, set: (obj, value) => { obj.safetyRating = value; } }, metadata: _metadata }, _safetyRating_initializers, _safetyRating_extraInitializers);
        __esDecorate(null, null, _qualityRating_decorators, { kind: "field", name: "qualityRating", static: false, private: false, access: { has: obj => "qualityRating" in obj, get: obj => obj.qualityRating, set: (obj, value) => { obj.qualityRating = value; } }, metadata: _metadata }, _qualityRating_initializers, _qualityRating_extraInitializers);
        __esDecorate(null, null, _performanceRating_decorators, { kind: "field", name: "performanceRating", static: false, private: false, access: { has: obj => "performanceRating" in obj, get: obj => obj.performanceRating, set: (obj, value) => { obj.performanceRating = value; } }, metadata: _metadata }, _performanceRating_initializers, _performanceRating_extraInitializers);
        __esDecorate(null, null, _financialStrength_decorators, { kind: "field", name: "financialStrength", static: false, private: false, access: { has: obj => "financialStrength" in obj, get: obj => obj.financialStrength, set: (obj, value) => { obj.financialStrength = value; } }, metadata: _metadata }, _financialStrength_initializers, _financialStrength_extraInitializers);
        __esDecorate(null, null, _qualificationStatus_decorators, { kind: "field", name: "qualificationStatus", static: false, private: false, access: { has: obj => "qualificationStatus" in obj, get: obj => obj.qualificationStatus, set: (obj, value) => { obj.qualificationStatus = value; } }, metadata: _metadata }, _qualificationStatus_initializers, _qualificationStatus_extraInitializers);
        __esDecorate(null, null, _qualifiedDate_decorators, { kind: "field", name: "qualifiedDate", static: false, private: false, access: { has: obj => "qualifiedDate" in obj, get: obj => obj.qualifiedDate, set: (obj, value) => { obj.qualifiedDate = value; } }, metadata: _metadata }, _qualifiedDate_initializers, _qualifiedDate_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _certifications_decorators, { kind: "field", name: "certifications", static: false, private: false, access: { has: obj => "certifications" in obj, get: obj => obj.certifications, set: (obj, value) => { obj.certifications = value; } }, metadata: _metadata }, _certifications_initializers, _certifications_extraInitializers);
        __esDecorate(null, null, _licenses_decorators, { kind: "field", name: "licenses", static: false, private: false, access: { has: obj => "licenses" in obj, get: obj => obj.licenses, set: (obj, value) => { obj.licenses = value; } }, metadata: _metadata }, _licenses_initializers, _licenses_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VendorPrequalification = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VendorPrequalification = _classThis;
})();
exports.VendorPrequalification = VendorPrequalification;
//# sourceMappingURL=vendor-prequalification.model.js.map