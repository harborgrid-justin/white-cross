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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateConstructionCloseoutDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
let CreateConstructionCloseoutDto = (() => {
    var _a;
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _projectName_decorators;
    let _projectName_initializers = [];
    let _projectName_extraInitializers = [];
    let _contractorId_decorators;
    let _contractorId_initializers = [];
    let _contractorId_extraInitializers = [];
    let _contractorName_decorators;
    let _contractorName_initializers = [];
    let _contractorName_extraInitializers = [];
    let _contractValue_decorators;
    let _contractValue_initializers = [];
    let _contractValue_extraInitializers = [];
    let _retainageAmount_decorators;
    let _retainageAmount_initializers = [];
    let _retainageAmount_extraInitializers = [];
    let _retainagePercentage_decorators;
    let _retainagePercentage_initializers = [];
    let _retainagePercentage_extraInitializers = [];
    let _warrantyPeriodMonths_decorators;
    let _warrantyPeriodMonths_initializers = [];
    let _warrantyPeriodMonths_extraInitializers = [];
    let _finalPaymentAmount_decorators;
    let _finalPaymentAmount_initializers = [];
    let _finalPaymentAmount_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateConstructionCloseoutDto {
            constructor() {
                this.projectId = __runInitializers(this, _projectId_initializers, void 0);
                this.projectName = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _projectName_initializers, void 0));
                this.contractorId = (__runInitializers(this, _projectName_extraInitializers), __runInitializers(this, _contractorId_initializers, void 0));
                this.contractorName = (__runInitializers(this, _contractorId_extraInitializers), __runInitializers(this, _contractorName_initializers, void 0));
                this.contractValue = (__runInitializers(this, _contractorName_extraInitializers), __runInitializers(this, _contractValue_initializers, void 0));
                this.retainageAmount = (__runInitializers(this, _contractValue_extraInitializers), __runInitializers(this, _retainageAmount_initializers, void 0));
                this.retainagePercentage = (__runInitializers(this, _retainageAmount_extraInitializers), __runInitializers(this, _retainagePercentage_initializers, void 0));
                this.warrantyPeriodMonths = (__runInitializers(this, _retainagePercentage_extraInitializers), __runInitializers(this, _warrantyPeriodMonths_initializers, void 0));
                this.finalPaymentAmount = (__runInitializers(this, _warrantyPeriodMonths_extraInitializers), __runInitializers(this, _finalPaymentAmount_initializers, void 0));
                this.notes = (__runInitializers(this, _finalPaymentAmount_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsUUID)()];
            _projectName_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _contractorId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsUUID)()];
            _contractorName_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _contractValue_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _retainageAmount_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _retainagePercentage_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _warrantyPeriodMonths_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _finalPaymentAmount_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _projectName_decorators, { kind: "field", name: "projectName", static: false, private: false, access: { has: obj => "projectName" in obj, get: obj => obj.projectName, set: (obj, value) => { obj.projectName = value; } }, metadata: _metadata }, _projectName_initializers, _projectName_extraInitializers);
            __esDecorate(null, null, _contractorId_decorators, { kind: "field", name: "contractorId", static: false, private: false, access: { has: obj => "contractorId" in obj, get: obj => obj.contractorId, set: (obj, value) => { obj.contractorId = value; } }, metadata: _metadata }, _contractorId_initializers, _contractorId_extraInitializers);
            __esDecorate(null, null, _contractorName_decorators, { kind: "field", name: "contractorName", static: false, private: false, access: { has: obj => "contractorName" in obj, get: obj => obj.contractorName, set: (obj, value) => { obj.contractorName = value; } }, metadata: _metadata }, _contractorName_initializers, _contractorName_extraInitializers);
            __esDecorate(null, null, _contractValue_decorators, { kind: "field", name: "contractValue", static: false, private: false, access: { has: obj => "contractValue" in obj, get: obj => obj.contractValue, set: (obj, value) => { obj.contractValue = value; } }, metadata: _metadata }, _contractValue_initializers, _contractValue_extraInitializers);
            __esDecorate(null, null, _retainageAmount_decorators, { kind: "field", name: "retainageAmount", static: false, private: false, access: { has: obj => "retainageAmount" in obj, get: obj => obj.retainageAmount, set: (obj, value) => { obj.retainageAmount = value; } }, metadata: _metadata }, _retainageAmount_initializers, _retainageAmount_extraInitializers);
            __esDecorate(null, null, _retainagePercentage_decorators, { kind: "field", name: "retainagePercentage", static: false, private: false, access: { has: obj => "retainagePercentage" in obj, get: obj => obj.retainagePercentage, set: (obj, value) => { obj.retainagePercentage = value; } }, metadata: _metadata }, _retainagePercentage_initializers, _retainagePercentage_extraInitializers);
            __esDecorate(null, null, _warrantyPeriodMonths_decorators, { kind: "field", name: "warrantyPeriodMonths", static: false, private: false, access: { has: obj => "warrantyPeriodMonths" in obj, get: obj => obj.warrantyPeriodMonths, set: (obj, value) => { obj.warrantyPeriodMonths = value; } }, metadata: _metadata }, _warrantyPeriodMonths_initializers, _warrantyPeriodMonths_extraInitializers);
            __esDecorate(null, null, _finalPaymentAmount_decorators, { kind: "field", name: "finalPaymentAmount", static: false, private: false, access: { has: obj => "finalPaymentAmount" in obj, get: obj => obj.finalPaymentAmount, set: (obj, value) => { obj.finalPaymentAmount = value; } }, metadata: _metadata }, _finalPaymentAmount_initializers, _finalPaymentAmount_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateConstructionCloseoutDto = CreateConstructionCloseoutDto;
//# sourceMappingURL=create-construction-closeout.dto.js.map