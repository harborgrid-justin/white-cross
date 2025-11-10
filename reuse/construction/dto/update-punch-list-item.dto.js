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
exports.UpdatePunchListItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const closeout_types_1 = require("../types/closeout.types");
let UpdatePunchListItemDto = (() => {
    var _a;
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _assignedToId_decorators;
    let _assignedToId_initializers = [];
    let _assignedToId_extraInitializers = [];
    let _assignedToName_decorators;
    let _assignedToName_initializers = [];
    let _assignedToName_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _actualHours_decorators;
    let _actualHours_initializers = [];
    let _actualHours_extraInitializers = [];
    let _actualCost_decorators;
    let _actualCost_initializers = [];
    let _actualCost_extraInitializers = [];
    let _resolutionNotes_decorators;
    let _resolutionNotes_initializers = [];
    let _resolutionNotes_extraInitializers = [];
    let _rejectionReason_decorators;
    let _rejectionReason_initializers = [];
    let _rejectionReason_extraInitializers = [];
    let _requiresReinspection_decorators;
    let _requiresReinspection_initializers = [];
    let _requiresReinspection_extraInitializers = [];
    let _photoUrls_decorators;
    let _photoUrls_initializers = [];
    let _photoUrls_extraInitializers = [];
    let _attachmentUrls_decorators;
    let _attachmentUrls_initializers = [];
    let _attachmentUrls_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class UpdatePunchListItemDto {
            constructor() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.assignedToId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _assignedToId_initializers, void 0));
                this.assignedToName = (__runInitializers(this, _assignedToId_extraInitializers), __runInitializers(this, _assignedToName_initializers, void 0));
                this.dueDate = (__runInitializers(this, _assignedToName_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.actualHours = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _actualHours_initializers, void 0));
                this.actualCost = (__runInitializers(this, _actualHours_extraInitializers), __runInitializers(this, _actualCost_initializers, void 0));
                this.resolutionNotes = (__runInitializers(this, _actualCost_extraInitializers), __runInitializers(this, _resolutionNotes_initializers, void 0));
                this.rejectionReason = (__runInitializers(this, _resolutionNotes_extraInitializers), __runInitializers(this, _rejectionReason_initializers, void 0));
                this.requiresReinspection = (__runInitializers(this, _rejectionReason_extraInitializers), __runInitializers(this, _requiresReinspection_initializers, void 0));
                this.photoUrls = (__runInitializers(this, _requiresReinspection_extraInitializers), __runInitializers(this, _photoUrls_initializers, void 0));
                this.attachmentUrls = (__runInitializers(this, _photoUrls_extraInitializers), __runInitializers(this, _attachmentUrls_initializers, void 0));
                this.metadata = (__runInitializers(this, _attachmentUrls_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: closeout_types_1.PunchListItemStatus }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(closeout_types_1.PunchListItemStatus)];
            _assignedToId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _assignedToName_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _dueDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _actualHours_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _actualCost_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _resolutionNotes_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _rejectionReason_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _requiresReinspection_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _photoUrls_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _attachmentUrls_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _assignedToId_decorators, { kind: "field", name: "assignedToId", static: false, private: false, access: { has: obj => "assignedToId" in obj, get: obj => obj.assignedToId, set: (obj, value) => { obj.assignedToId = value; } }, metadata: _metadata }, _assignedToId_initializers, _assignedToId_extraInitializers);
            __esDecorate(null, null, _assignedToName_decorators, { kind: "field", name: "assignedToName", static: false, private: false, access: { has: obj => "assignedToName" in obj, get: obj => obj.assignedToName, set: (obj, value) => { obj.assignedToName = value; } }, metadata: _metadata }, _assignedToName_initializers, _assignedToName_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _actualHours_decorators, { kind: "field", name: "actualHours", static: false, private: false, access: { has: obj => "actualHours" in obj, get: obj => obj.actualHours, set: (obj, value) => { obj.actualHours = value; } }, metadata: _metadata }, _actualHours_initializers, _actualHours_extraInitializers);
            __esDecorate(null, null, _actualCost_decorators, { kind: "field", name: "actualCost", static: false, private: false, access: { has: obj => "actualCost" in obj, get: obj => obj.actualCost, set: (obj, value) => { obj.actualCost = value; } }, metadata: _metadata }, _actualCost_initializers, _actualCost_extraInitializers);
            __esDecorate(null, null, _resolutionNotes_decorators, { kind: "field", name: "resolutionNotes", static: false, private: false, access: { has: obj => "resolutionNotes" in obj, get: obj => obj.resolutionNotes, set: (obj, value) => { obj.resolutionNotes = value; } }, metadata: _metadata }, _resolutionNotes_initializers, _resolutionNotes_extraInitializers);
            __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: obj => "rejectionReason" in obj, get: obj => obj.rejectionReason, set: (obj, value) => { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
            __esDecorate(null, null, _requiresReinspection_decorators, { kind: "field", name: "requiresReinspection", static: false, private: false, access: { has: obj => "requiresReinspection" in obj, get: obj => obj.requiresReinspection, set: (obj, value) => { obj.requiresReinspection = value; } }, metadata: _metadata }, _requiresReinspection_initializers, _requiresReinspection_extraInitializers);
            __esDecorate(null, null, _photoUrls_decorators, { kind: "field", name: "photoUrls", static: false, private: false, access: { has: obj => "photoUrls" in obj, get: obj => obj.photoUrls, set: (obj, value) => { obj.photoUrls = value; } }, metadata: _metadata }, _photoUrls_initializers, _photoUrls_extraInitializers);
            __esDecorate(null, null, _attachmentUrls_decorators, { kind: "field", name: "attachmentUrls", static: false, private: false, access: { has: obj => "attachmentUrls" in obj, get: obj => obj.attachmentUrls, set: (obj, value) => { obj.attachmentUrls = value; } }, metadata: _metadata }, _attachmentUrls_initializers, _attachmentUrls_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdatePunchListItemDto = UpdatePunchListItemDto;
//# sourceMappingURL=update-punch-list-item.dto.js.map