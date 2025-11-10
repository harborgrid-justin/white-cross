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
exports.UpdateCloseoutDocumentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const closeout_types_1 = require("../types/closeout.types");
let UpdateCloseoutDocumentDto = (() => {
    var _a;
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _fileUrl_decorators;
    let _fileUrl_initializers = [];
    let _fileUrl_extraInitializers = [];
    let _fileName_decorators;
    let _fileName_initializers = [];
    let _fileName_extraInitializers = [];
    let _fileSize_decorators;
    let _fileSize_initializers = [];
    let _fileSize_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _reviewComments_decorators;
    let _reviewComments_initializers = [];
    let _reviewComments_extraInitializers = [];
    let _rejectionReason_decorators;
    let _rejectionReason_initializers = [];
    let _rejectionReason_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _warrantyStartDate_decorators;
    let _warrantyStartDate_initializers = [];
    let _warrantyStartDate_extraInitializers = [];
    let _warrantyEndDate_decorators;
    let _warrantyEndDate_initializers = [];
    let _warrantyEndDate_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class UpdateCloseoutDocumentDto {
            constructor() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.fileUrl = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _fileUrl_initializers, void 0));
                this.fileName = (__runInitializers(this, _fileUrl_extraInitializers), __runInitializers(this, _fileName_initializers, void 0));
                this.fileSize = (__runInitializers(this, _fileName_extraInitializers), __runInitializers(this, _fileSize_initializers, void 0));
                this.version = (__runInitializers(this, _fileSize_extraInitializers), __runInitializers(this, _version_initializers, void 0));
                this.reviewComments = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _reviewComments_initializers, void 0));
                this.rejectionReason = (__runInitializers(this, _reviewComments_extraInitializers), __runInitializers(this, _rejectionReason_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _rejectionReason_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                this.warrantyStartDate = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _warrantyStartDate_initializers, void 0));
                this.warrantyEndDate = (__runInitializers(this, _warrantyStartDate_extraInitializers), __runInitializers(this, _warrantyEndDate_initializers, void 0));
                this.metadata = (__runInitializers(this, _warrantyEndDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: closeout_types_1.DocumentStatus }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(closeout_types_1.DocumentStatus)];
            _fileUrl_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _fileName_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _fileSize_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _version_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _reviewComments_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _rejectionReason_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _expirationDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _warrantyStartDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _warrantyEndDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _fileUrl_decorators, { kind: "field", name: "fileUrl", static: false, private: false, access: { has: obj => "fileUrl" in obj, get: obj => obj.fileUrl, set: (obj, value) => { obj.fileUrl = value; } }, metadata: _metadata }, _fileUrl_initializers, _fileUrl_extraInitializers);
            __esDecorate(null, null, _fileName_decorators, { kind: "field", name: "fileName", static: false, private: false, access: { has: obj => "fileName" in obj, get: obj => obj.fileName, set: (obj, value) => { obj.fileName = value; } }, metadata: _metadata }, _fileName_initializers, _fileName_extraInitializers);
            __esDecorate(null, null, _fileSize_decorators, { kind: "field", name: "fileSize", static: false, private: false, access: { has: obj => "fileSize" in obj, get: obj => obj.fileSize, set: (obj, value) => { obj.fileSize = value; } }, metadata: _metadata }, _fileSize_initializers, _fileSize_extraInitializers);
            __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
            __esDecorate(null, null, _reviewComments_decorators, { kind: "field", name: "reviewComments", static: false, private: false, access: { has: obj => "reviewComments" in obj, get: obj => obj.reviewComments, set: (obj, value) => { obj.reviewComments = value; } }, metadata: _metadata }, _reviewComments_initializers, _reviewComments_extraInitializers);
            __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: obj => "rejectionReason" in obj, get: obj => obj.rejectionReason, set: (obj, value) => { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            __esDecorate(null, null, _warrantyStartDate_decorators, { kind: "field", name: "warrantyStartDate", static: false, private: false, access: { has: obj => "warrantyStartDate" in obj, get: obj => obj.warrantyStartDate, set: (obj, value) => { obj.warrantyStartDate = value; } }, metadata: _metadata }, _warrantyStartDate_initializers, _warrantyStartDate_extraInitializers);
            __esDecorate(null, null, _warrantyEndDate_decorators, { kind: "field", name: "warrantyEndDate", static: false, private: false, access: { has: obj => "warrantyEndDate" in obj, get: obj => obj.warrantyEndDate, set: (obj, value) => { obj.warrantyEndDate = value; } }, metadata: _metadata }, _warrantyEndDate_initializers, _warrantyEndDate_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateCloseoutDocumentDto = UpdateCloseoutDocumentDto;
//# sourceMappingURL=update-closeout-document.dto.js.map