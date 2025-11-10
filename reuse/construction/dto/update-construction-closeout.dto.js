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
exports.UpdateConstructionCloseoutDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const closeout_types_1 = require("../types/closeout.types");
let UpdateConstructionCloseoutDto = (() => {
    var _a;
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _substantialCompletionDate_decorators;
    let _substantialCompletionDate_initializers = [];
    let _substantialCompletionDate_extraInitializers = [];
    let _finalCompletionDate_decorators;
    let _finalCompletionDate_initializers = [];
    let _finalCompletionDate_extraInitializers = [];
    let _certificateOfOccupancyDate_decorators;
    let _certificateOfOccupancyDate_initializers = [];
    let _certificateOfOccupancyDate_extraInitializers = [];
    let _finalInspectionScheduled_decorators;
    let _finalInspectionScheduled_initializers = [];
    let _finalInspectionScheduled_extraInitializers = [];
    let _finalInspectionDate_decorators;
    let _finalInspectionDate_initializers = [];
    let _finalInspectionDate_extraInitializers = [];
    let _finalInspectionResult_decorators;
    let _finalInspectionResult_initializers = [];
    let _finalInspectionResult_extraInitializers = [];
    let _ownerTrainingRequired_decorators;
    let _ownerTrainingRequired_initializers = [];
    let _ownerTrainingRequired_extraInitializers = [];
    let _ownerTrainingCompleted_decorators;
    let _ownerTrainingCompleted_initializers = [];
    let _ownerTrainingCompleted_extraInitializers = [];
    let _ownerTrainingDate_decorators;
    let _ownerTrainingDate_initializers = [];
    let _ownerTrainingDate_extraInitializers = [];
    let _finalPaymentStatus_decorators;
    let _finalPaymentStatus_initializers = [];
    let _finalPaymentStatus_extraInitializers = [];
    let _finalPaymentDate_decorators;
    let _finalPaymentDate_initializers = [];
    let _finalPaymentDate_extraInitializers = [];
    let _lessonsLearnedCompleted_decorators;
    let _lessonsLearnedCompleted_initializers = [];
    let _lessonsLearnedCompleted_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class UpdateConstructionCloseoutDto {
            constructor() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.substantialCompletionDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _substantialCompletionDate_initializers, void 0));
                this.finalCompletionDate = (__runInitializers(this, _substantialCompletionDate_extraInitializers), __runInitializers(this, _finalCompletionDate_initializers, void 0));
                this.certificateOfOccupancyDate = (__runInitializers(this, _finalCompletionDate_extraInitializers), __runInitializers(this, _certificateOfOccupancyDate_initializers, void 0));
                this.finalInspectionScheduled = (__runInitializers(this, _certificateOfOccupancyDate_extraInitializers), __runInitializers(this, _finalInspectionScheduled_initializers, void 0));
                this.finalInspectionDate = (__runInitializers(this, _finalInspectionScheduled_extraInitializers), __runInitializers(this, _finalInspectionDate_initializers, void 0));
                this.finalInspectionResult = (__runInitializers(this, _finalInspectionDate_extraInitializers), __runInitializers(this, _finalInspectionResult_initializers, void 0));
                this.ownerTrainingRequired = (__runInitializers(this, _finalInspectionResult_extraInitializers), __runInitializers(this, _ownerTrainingRequired_initializers, void 0));
                this.ownerTrainingCompleted = (__runInitializers(this, _ownerTrainingRequired_extraInitializers), __runInitializers(this, _ownerTrainingCompleted_initializers, void 0));
                this.ownerTrainingDate = (__runInitializers(this, _ownerTrainingCompleted_extraInitializers), __runInitializers(this, _ownerTrainingDate_initializers, void 0));
                this.finalPaymentStatus = (__runInitializers(this, _ownerTrainingDate_extraInitializers), __runInitializers(this, _finalPaymentStatus_initializers, void 0));
                this.finalPaymentDate = (__runInitializers(this, _finalPaymentStatus_extraInitializers), __runInitializers(this, _finalPaymentDate_initializers, void 0));
                this.lessonsLearnedCompleted = (__runInitializers(this, _finalPaymentDate_extraInitializers), __runInitializers(this, _lessonsLearnedCompleted_initializers, void 0));
                this.notes = (__runInitializers(this, _lessonsLearnedCompleted_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: closeout_types_1.CloseoutStatus }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(closeout_types_1.CloseoutStatus)];
            _substantialCompletionDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _finalCompletionDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _certificateOfOccupancyDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _finalInspectionScheduled_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _finalInspectionDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _finalInspectionResult_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: closeout_types_1.InspectionResult }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(closeout_types_1.InspectionResult)];
            _ownerTrainingRequired_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _ownerTrainingCompleted_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _ownerTrainingDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _finalPaymentStatus_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: closeout_types_1.PaymentStatus }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(closeout_types_1.PaymentStatus)];
            _finalPaymentDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _lessonsLearnedCompleted_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _substantialCompletionDate_decorators, { kind: "field", name: "substantialCompletionDate", static: false, private: false, access: { has: obj => "substantialCompletionDate" in obj, get: obj => obj.substantialCompletionDate, set: (obj, value) => { obj.substantialCompletionDate = value; } }, metadata: _metadata }, _substantialCompletionDate_initializers, _substantialCompletionDate_extraInitializers);
            __esDecorate(null, null, _finalCompletionDate_decorators, { kind: "field", name: "finalCompletionDate", static: false, private: false, access: { has: obj => "finalCompletionDate" in obj, get: obj => obj.finalCompletionDate, set: (obj, value) => { obj.finalCompletionDate = value; } }, metadata: _metadata }, _finalCompletionDate_initializers, _finalCompletionDate_extraInitializers);
            __esDecorate(null, null, _certificateOfOccupancyDate_decorators, { kind: "field", name: "certificateOfOccupancyDate", static: false, private: false, access: { has: obj => "certificateOfOccupancyDate" in obj, get: obj => obj.certificateOfOccupancyDate, set: (obj, value) => { obj.certificateOfOccupancyDate = value; } }, metadata: _metadata }, _certificateOfOccupancyDate_initializers, _certificateOfOccupancyDate_extraInitializers);
            __esDecorate(null, null, _finalInspectionScheduled_decorators, { kind: "field", name: "finalInspectionScheduled", static: false, private: false, access: { has: obj => "finalInspectionScheduled" in obj, get: obj => obj.finalInspectionScheduled, set: (obj, value) => { obj.finalInspectionScheduled = value; } }, metadata: _metadata }, _finalInspectionScheduled_initializers, _finalInspectionScheduled_extraInitializers);
            __esDecorate(null, null, _finalInspectionDate_decorators, { kind: "field", name: "finalInspectionDate", static: false, private: false, access: { has: obj => "finalInspectionDate" in obj, get: obj => obj.finalInspectionDate, set: (obj, value) => { obj.finalInspectionDate = value; } }, metadata: _metadata }, _finalInspectionDate_initializers, _finalInspectionDate_extraInitializers);
            __esDecorate(null, null, _finalInspectionResult_decorators, { kind: "field", name: "finalInspectionResult", static: false, private: false, access: { has: obj => "finalInspectionResult" in obj, get: obj => obj.finalInspectionResult, set: (obj, value) => { obj.finalInspectionResult = value; } }, metadata: _metadata }, _finalInspectionResult_initializers, _finalInspectionResult_extraInitializers);
            __esDecorate(null, null, _ownerTrainingRequired_decorators, { kind: "field", name: "ownerTrainingRequired", static: false, private: false, access: { has: obj => "ownerTrainingRequired" in obj, get: obj => obj.ownerTrainingRequired, set: (obj, value) => { obj.ownerTrainingRequired = value; } }, metadata: _metadata }, _ownerTrainingRequired_initializers, _ownerTrainingRequired_extraInitializers);
            __esDecorate(null, null, _ownerTrainingCompleted_decorators, { kind: "field", name: "ownerTrainingCompleted", static: false, private: false, access: { has: obj => "ownerTrainingCompleted" in obj, get: obj => obj.ownerTrainingCompleted, set: (obj, value) => { obj.ownerTrainingCompleted = value; } }, metadata: _metadata }, _ownerTrainingCompleted_initializers, _ownerTrainingCompleted_extraInitializers);
            __esDecorate(null, null, _ownerTrainingDate_decorators, { kind: "field", name: "ownerTrainingDate", static: false, private: false, access: { has: obj => "ownerTrainingDate" in obj, get: obj => obj.ownerTrainingDate, set: (obj, value) => { obj.ownerTrainingDate = value; } }, metadata: _metadata }, _ownerTrainingDate_initializers, _ownerTrainingDate_extraInitializers);
            __esDecorate(null, null, _finalPaymentStatus_decorators, { kind: "field", name: "finalPaymentStatus", static: false, private: false, access: { has: obj => "finalPaymentStatus" in obj, get: obj => obj.finalPaymentStatus, set: (obj, value) => { obj.finalPaymentStatus = value; } }, metadata: _metadata }, _finalPaymentStatus_initializers, _finalPaymentStatus_extraInitializers);
            __esDecorate(null, null, _finalPaymentDate_decorators, { kind: "field", name: "finalPaymentDate", static: false, private: false, access: { has: obj => "finalPaymentDate" in obj, get: obj => obj.finalPaymentDate, set: (obj, value) => { obj.finalPaymentDate = value; } }, metadata: _metadata }, _finalPaymentDate_initializers, _finalPaymentDate_extraInitializers);
            __esDecorate(null, null, _lessonsLearnedCompleted_decorators, { kind: "field", name: "lessonsLearnedCompleted", static: false, private: false, access: { has: obj => "lessonsLearnedCompleted" in obj, get: obj => obj.lessonsLearnedCompleted, set: (obj, value) => { obj.lessonsLearnedCompleted = value; } }, metadata: _metadata }, _lessonsLearnedCompleted_initializers, _lessonsLearnedCompleted_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateConstructionCloseoutDto = UpdateConstructionCloseoutDto;
//# sourceMappingURL=update-construction-closeout.dto.js.map