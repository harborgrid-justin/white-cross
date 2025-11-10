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
exports.CreateCloseoutDocumentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const closeout_types_1 = require("../types/closeout.types");
let CreateCloseoutDocumentDto = (() => {
    var _a;
    let _closeoutId_decorators;
    let _closeoutId_initializers = [];
    let _closeoutId_extraInitializers = [];
    let _documentType_decorators;
    let _documentType_initializers = [];
    let _documentType_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _documentNumber_decorators;
    let _documentNumber_initializers = [];
    let _documentNumber_extraInitializers = [];
    let _required_decorators;
    let _required_initializers = [];
    let _required_extraInitializers = [];
    let _relatedEquipment_decorators;
    let _relatedEquipment_initializers = [];
    let _relatedEquipment_extraInitializers = [];
    let _relatedSystem_decorators;
    let _relatedSystem_initializers = [];
    let _relatedSystem_extraInitializers = [];
    let _manufacturer_decorators;
    let _manufacturer_initializers = [];
    let _manufacturer_extraInitializers = [];
    let _modelNumber_decorators;
    let _modelNumber_initializers = [];
    let _modelNumber_extraInitializers = [];
    let _trainingTopic_decorators;
    let _trainingTopic_initializers = [];
    let _trainingTopic_extraInitializers = [];
    let _trainingDuration_decorators;
    let _trainingDuration_initializers = [];
    let _trainingDuration_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateCloseoutDocumentDto {
            constructor() {
                this.closeoutId = __runInitializers(this, _closeoutId_initializers, void 0);
                this.documentType = (__runInitializers(this, _closeoutId_extraInitializers), __runInitializers(this, _documentType_initializers, void 0));
                this.title = (__runInitializers(this, _documentType_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.documentNumber = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _documentNumber_initializers, void 0));
                this.required = (__runInitializers(this, _documentNumber_extraInitializers), __runInitializers(this, _required_initializers, void 0));
                this.relatedEquipment = (__runInitializers(this, _required_extraInitializers), __runInitializers(this, _relatedEquipment_initializers, void 0));
                this.relatedSystem = (__runInitializers(this, _relatedEquipment_extraInitializers), __runInitializers(this, _relatedSystem_initializers, void 0));
                this.manufacturer = (__runInitializers(this, _relatedSystem_extraInitializers), __runInitializers(this, _manufacturer_initializers, void 0));
                this.modelNumber = (__runInitializers(this, _manufacturer_extraInitializers), __runInitializers(this, _modelNumber_initializers, void 0));
                this.trainingTopic = (__runInitializers(this, _modelNumber_extraInitializers), __runInitializers(this, _trainingTopic_initializers, void 0));
                this.trainingDuration = (__runInitializers(this, _trainingTopic_extraInitializers), __runInitializers(this, _trainingDuration_initializers, void 0));
                this.tags = (__runInitializers(this, _trainingDuration_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _closeoutId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsUUID)()];
            _documentType_decorators = [(0, swagger_1.ApiProperty)({ enum: closeout_types_1.CloseoutDocumentType }), (0, class_validator_1.IsEnum)(closeout_types_1.CloseoutDocumentType)];
            _title_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _documentNumber_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _required_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _relatedEquipment_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _relatedSystem_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _manufacturer_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _modelNumber_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _trainingTopic_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _trainingDuration_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _tags_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _closeoutId_decorators, { kind: "field", name: "closeoutId", static: false, private: false, access: { has: obj => "closeoutId" in obj, get: obj => obj.closeoutId, set: (obj, value) => { obj.closeoutId = value; } }, metadata: _metadata }, _closeoutId_initializers, _closeoutId_extraInitializers);
            __esDecorate(null, null, _documentType_decorators, { kind: "field", name: "documentType", static: false, private: false, access: { has: obj => "documentType" in obj, get: obj => obj.documentType, set: (obj, value) => { obj.documentType = value; } }, metadata: _metadata }, _documentType_initializers, _documentType_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _documentNumber_decorators, { kind: "field", name: "documentNumber", static: false, private: false, access: { has: obj => "documentNumber" in obj, get: obj => obj.documentNumber, set: (obj, value) => { obj.documentNumber = value; } }, metadata: _metadata }, _documentNumber_initializers, _documentNumber_extraInitializers);
            __esDecorate(null, null, _required_decorators, { kind: "field", name: "required", static: false, private: false, access: { has: obj => "required" in obj, get: obj => obj.required, set: (obj, value) => { obj.required = value; } }, metadata: _metadata }, _required_initializers, _required_extraInitializers);
            __esDecorate(null, null, _relatedEquipment_decorators, { kind: "field", name: "relatedEquipment", static: false, private: false, access: { has: obj => "relatedEquipment" in obj, get: obj => obj.relatedEquipment, set: (obj, value) => { obj.relatedEquipment = value; } }, metadata: _metadata }, _relatedEquipment_initializers, _relatedEquipment_extraInitializers);
            __esDecorate(null, null, _relatedSystem_decorators, { kind: "field", name: "relatedSystem", static: false, private: false, access: { has: obj => "relatedSystem" in obj, get: obj => obj.relatedSystem, set: (obj, value) => { obj.relatedSystem = value; } }, metadata: _metadata }, _relatedSystem_initializers, _relatedSystem_extraInitializers);
            __esDecorate(null, null, _manufacturer_decorators, { kind: "field", name: "manufacturer", static: false, private: false, access: { has: obj => "manufacturer" in obj, get: obj => obj.manufacturer, set: (obj, value) => { obj.manufacturer = value; } }, metadata: _metadata }, _manufacturer_initializers, _manufacturer_extraInitializers);
            __esDecorate(null, null, _modelNumber_decorators, { kind: "field", name: "modelNumber", static: false, private: false, access: { has: obj => "modelNumber" in obj, get: obj => obj.modelNumber, set: (obj, value) => { obj.modelNumber = value; } }, metadata: _metadata }, _modelNumber_initializers, _modelNumber_extraInitializers);
            __esDecorate(null, null, _trainingTopic_decorators, { kind: "field", name: "trainingTopic", static: false, private: false, access: { has: obj => "trainingTopic" in obj, get: obj => obj.trainingTopic, set: (obj, value) => { obj.trainingTopic = value; } }, metadata: _metadata }, _trainingTopic_initializers, _trainingTopic_extraInitializers);
            __esDecorate(null, null, _trainingDuration_decorators, { kind: "field", name: "trainingDuration", static: false, private: false, access: { has: obj => "trainingDuration" in obj, get: obj => obj.trainingDuration, set: (obj, value) => { obj.trainingDuration = value; } }, metadata: _metadata }, _trainingDuration_initializers, _trainingDuration_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCloseoutDocumentDto = CreateCloseoutDocumentDto;
//# sourceMappingURL=create-closeout-document.dto.js.map