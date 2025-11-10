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
exports.ConstructionWorker = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const labor_types_1 = require("../types/labor.types");
let ConstructionWorker = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'construction_workers', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _firstName_decorators;
    let _firstName_initializers = [];
    let _firstName_extraInitializers = [];
    let _lastName_decorators;
    let _lastName_initializers = [];
    let _lastName_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _primaryCraft_decorators;
    let _primaryCraft_initializers = [];
    let _primaryCraft_extraInitializers = [];
    let _secondaryCrafts_decorators;
    let _secondaryCrafts_initializers = [];
    let _secondaryCrafts_extraInitializers = [];
    let _unionStatus_decorators;
    let _unionStatus_initializers = [];
    let _unionStatus_extraInitializers = [];
    let _unionLocal_decorators;
    let _unionLocal_initializers = [];
    let _unionLocal_extraInitializers = [];
    let _unionCardNumber_decorators;
    let _unionCardNumber_initializers = [];
    let _unionCardNumber_extraInitializers = [];
    let _isApprentice_decorators;
    let _isApprentice_initializers = [];
    let _isApprentice_extraInitializers = [];
    let _apprenticeshipYear_decorators;
    let _apprenticeshipYear_initializers = [];
    let _apprenticeshipYear_extraInitializers = [];
    let _certifications_decorators;
    let _certifications_initializers = [];
    let _certifications_extraInitializers = [];
    let _safetyTraining_decorators;
    let _safetyTraining_initializers = [];
    let _safetyTraining_extraInitializers = [];
    let _baseHourlyRate_decorators;
    let _baseHourlyRate_initializers = [];
    let _baseHourlyRate_extraInitializers = [];
    let _emergencyContact_decorators;
    let _emergencyContact_initializers = [];
    let _emergencyContact_extraInitializers = [];
    let _emergencyPhone_decorators;
    let _emergencyPhone_initializers = [];
    let _emergencyPhone_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ConstructionWorker = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.firstName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _firstName_initializers, void 0));
            this.lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
            this.email = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
            this.primaryCraft = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _primaryCraft_initializers, void 0));
            this.secondaryCrafts = (__runInitializers(this, _primaryCraft_extraInitializers), __runInitializers(this, _secondaryCrafts_initializers, void 0));
            this.unionStatus = (__runInitializers(this, _secondaryCrafts_extraInitializers), __runInitializers(this, _unionStatus_initializers, void 0));
            this.unionLocal = (__runInitializers(this, _unionStatus_extraInitializers), __runInitializers(this, _unionLocal_initializers, void 0));
            this.unionCardNumber = (__runInitializers(this, _unionLocal_extraInitializers), __runInitializers(this, _unionCardNumber_initializers, void 0));
            this.isApprentice = (__runInitializers(this, _unionCardNumber_extraInitializers), __runInitializers(this, _isApprentice_initializers, void 0));
            this.apprenticeshipYear = (__runInitializers(this, _isApprentice_extraInitializers), __runInitializers(this, _apprenticeshipYear_initializers, void 0));
            this.certifications = (__runInitializers(this, _apprenticeshipYear_extraInitializers), __runInitializers(this, _certifications_initializers, void 0));
            this.safetyTraining = (__runInitializers(this, _certifications_extraInitializers), __runInitializers(this, _safetyTraining_initializers, void 0));
            this.baseHourlyRate = (__runInitializers(this, _safetyTraining_extraInitializers), __runInitializers(this, _baseHourlyRate_initializers, void 0));
            this.emergencyContact = (__runInitializers(this, _baseHourlyRate_extraInitializers), __runInitializers(this, _emergencyContact_initializers, void 0));
            this.emergencyPhone = (__runInitializers(this, _emergencyContact_extraInitializers), __runInitializers(this, _emergencyPhone_initializers, void 0));
            this.isActive = (__runInitializers(this, _emergencyPhone_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConstructionWorker");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _firstName_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _lastName_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _email_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING })];
        _phone_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING })];
        _primaryCraft_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(labor_types_1.LaborCraft)), allowNull: false })];
        _secondaryCrafts_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON })];
        _unionStatus_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(labor_types_1.UnionStatus)), defaultValue: labor_types_1.UnionStatus.NON_UNION })];
        _unionLocal_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING })];
        _unionCardNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING })];
        _isApprentice_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _apprenticeshipYear_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _certifications_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON })];
        _safetyTraining_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON })];
        _baseHourlyRate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(8, 2) })];
        _emergencyContact_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING })];
        _emergencyPhone_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING })];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: obj => "firstName" in obj, get: obj => obj.firstName, set: (obj, value) => { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
        __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: obj => "lastName" in obj, get: obj => obj.lastName, set: (obj, value) => { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _primaryCraft_decorators, { kind: "field", name: "primaryCraft", static: false, private: false, access: { has: obj => "primaryCraft" in obj, get: obj => obj.primaryCraft, set: (obj, value) => { obj.primaryCraft = value; } }, metadata: _metadata }, _primaryCraft_initializers, _primaryCraft_extraInitializers);
        __esDecorate(null, null, _secondaryCrafts_decorators, { kind: "field", name: "secondaryCrafts", static: false, private: false, access: { has: obj => "secondaryCrafts" in obj, get: obj => obj.secondaryCrafts, set: (obj, value) => { obj.secondaryCrafts = value; } }, metadata: _metadata }, _secondaryCrafts_initializers, _secondaryCrafts_extraInitializers);
        __esDecorate(null, null, _unionStatus_decorators, { kind: "field", name: "unionStatus", static: false, private: false, access: { has: obj => "unionStatus" in obj, get: obj => obj.unionStatus, set: (obj, value) => { obj.unionStatus = value; } }, metadata: _metadata }, _unionStatus_initializers, _unionStatus_extraInitializers);
        __esDecorate(null, null, _unionLocal_decorators, { kind: "field", name: "unionLocal", static: false, private: false, access: { has: obj => "unionLocal" in obj, get: obj => obj.unionLocal, set: (obj, value) => { obj.unionLocal = value; } }, metadata: _metadata }, _unionLocal_initializers, _unionLocal_extraInitializers);
        __esDecorate(null, null, _unionCardNumber_decorators, { kind: "field", name: "unionCardNumber", static: false, private: false, access: { has: obj => "unionCardNumber" in obj, get: obj => obj.unionCardNumber, set: (obj, value) => { obj.unionCardNumber = value; } }, metadata: _metadata }, _unionCardNumber_initializers, _unionCardNumber_extraInitializers);
        __esDecorate(null, null, _isApprentice_decorators, { kind: "field", name: "isApprentice", static: false, private: false, access: { has: obj => "isApprentice" in obj, get: obj => obj.isApprentice, set: (obj, value) => { obj.isApprentice = value; } }, metadata: _metadata }, _isApprentice_initializers, _isApprentice_extraInitializers);
        __esDecorate(null, null, _apprenticeshipYear_decorators, { kind: "field", name: "apprenticeshipYear", static: false, private: false, access: { has: obj => "apprenticeshipYear" in obj, get: obj => obj.apprenticeshipYear, set: (obj, value) => { obj.apprenticeshipYear = value; } }, metadata: _metadata }, _apprenticeshipYear_initializers, _apprenticeshipYear_extraInitializers);
        __esDecorate(null, null, _certifications_decorators, { kind: "field", name: "certifications", static: false, private: false, access: { has: obj => "certifications" in obj, get: obj => obj.certifications, set: (obj, value) => { obj.certifications = value; } }, metadata: _metadata }, _certifications_initializers, _certifications_extraInitializers);
        __esDecorate(null, null, _safetyTraining_decorators, { kind: "field", name: "safetyTraining", static: false, private: false, access: { has: obj => "safetyTraining" in obj, get: obj => obj.safetyTraining, set: (obj, value) => { obj.safetyTraining = value; } }, metadata: _metadata }, _safetyTraining_initializers, _safetyTraining_extraInitializers);
        __esDecorate(null, null, _baseHourlyRate_decorators, { kind: "field", name: "baseHourlyRate", static: false, private: false, access: { has: obj => "baseHourlyRate" in obj, get: obj => obj.baseHourlyRate, set: (obj, value) => { obj.baseHourlyRate = value; } }, metadata: _metadata }, _baseHourlyRate_initializers, _baseHourlyRate_extraInitializers);
        __esDecorate(null, null, _emergencyContact_decorators, { kind: "field", name: "emergencyContact", static: false, private: false, access: { has: obj => "emergencyContact" in obj, get: obj => obj.emergencyContact, set: (obj, value) => { obj.emergencyContact = value; } }, metadata: _metadata }, _emergencyContact_initializers, _emergencyContact_extraInitializers);
        __esDecorate(null, null, _emergencyPhone_decorators, { kind: "field", name: "emergencyPhone", static: false, private: false, access: { has: obj => "emergencyPhone" in obj, get: obj => obj.emergencyPhone, set: (obj, value) => { obj.emergencyPhone = value; } }, metadata: _metadata }, _emergencyPhone_initializers, _emergencyPhone_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConstructionWorker = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConstructionWorker = _classThis;
})();
exports.ConstructionWorker = ConstructionWorker;
//# sourceMappingURL=construction-worker.model.js.map