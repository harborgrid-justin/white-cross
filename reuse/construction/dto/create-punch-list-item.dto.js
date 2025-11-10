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
exports.CreatePunchListItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const closeout_types_1 = require("../types/closeout.types");
let CreatePunchListItemDto = (() => {
    var _a;
    let _closeoutId_decorators;
    let _closeoutId_initializers = [];
    let _closeoutId_extraInitializers = [];
    let _itemNumber_decorators;
    let _itemNumber_initializers = [];
    let _itemNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _reportedById_decorators;
    let _reportedById_initializers = [];
    let _reportedById_extraInitializers = [];
    let _reportedByName_decorators;
    let _reportedByName_initializers = [];
    let _reportedByName_extraInitializers = [];
    let _contractorResponsible_decorators;
    let _contractorResponsible_initializers = [];
    let _contractorResponsible_extraInitializers = [];
    let _assignedToId_decorators;
    let _assignedToId_initializers = [];
    let _assignedToId_extraInitializers = [];
    let _assignedToName_decorators;
    let _assignedToName_initializers = [];
    let _assignedToName_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _estimatedHours_decorators;
    let _estimatedHours_initializers = [];
    let _estimatedHours_extraInitializers = [];
    let _estimatedCost_decorators;
    let _estimatedCost_initializers = [];
    let _estimatedCost_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreatePunchListItemDto {
            constructor() {
                this.closeoutId = __runInitializers(this, _closeoutId_initializers, void 0);
                this.itemNumber = (__runInitializers(this, _closeoutId_extraInitializers), __runInitializers(this, _itemNumber_initializers, void 0));
                this.title = (__runInitializers(this, _itemNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.location = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.category = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.priority = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.reportedById = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _reportedById_initializers, void 0));
                this.reportedByName = (__runInitializers(this, _reportedById_extraInitializers), __runInitializers(this, _reportedByName_initializers, void 0));
                this.contractorResponsible = (__runInitializers(this, _reportedByName_extraInitializers), __runInitializers(this, _contractorResponsible_initializers, void 0));
                this.assignedToId = (__runInitializers(this, _contractorResponsible_extraInitializers), __runInitializers(this, _assignedToId_initializers, void 0));
                this.assignedToName = (__runInitializers(this, _assignedToId_extraInitializers), __runInitializers(this, _assignedToName_initializers, void 0));
                this.dueDate = (__runInitializers(this, _assignedToName_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.estimatedHours = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _estimatedHours_initializers, void 0));
                this.estimatedCost = (__runInitializers(this, _estimatedHours_extraInitializers), __runInitializers(this, _estimatedCost_initializers, void 0));
                this.tags = (__runInitializers(this, _estimatedCost_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _closeoutId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsUUID)()];
            _itemNumber_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _title_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _location_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _category_decorators = [(0, swagger_1.ApiProperty)({ enum: closeout_types_1.PunchListItemCategory }), (0, class_validator_1.IsEnum)(closeout_types_1.PunchListItemCategory)];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: closeout_types_1.PunchListItemPriority }), (0, class_validator_1.IsEnum)(closeout_types_1.PunchListItemPriority)];
            _reportedById_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsUUID)()];
            _reportedByName_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _contractorResponsible_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _assignedToId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _assignedToName_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _dueDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _estimatedHours_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _estimatedCost_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _tags_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _closeoutId_decorators, { kind: "field", name: "closeoutId", static: false, private: false, access: { has: obj => "closeoutId" in obj, get: obj => obj.closeoutId, set: (obj, value) => { obj.closeoutId = value; } }, metadata: _metadata }, _closeoutId_initializers, _closeoutId_extraInitializers);
            __esDecorate(null, null, _itemNumber_decorators, { kind: "field", name: "itemNumber", static: false, private: false, access: { has: obj => "itemNumber" in obj, get: obj => obj.itemNumber, set: (obj, value) => { obj.itemNumber = value; } }, metadata: _metadata }, _itemNumber_initializers, _itemNumber_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _reportedById_decorators, { kind: "field", name: "reportedById", static: false, private: false, access: { has: obj => "reportedById" in obj, get: obj => obj.reportedById, set: (obj, value) => { obj.reportedById = value; } }, metadata: _metadata }, _reportedById_initializers, _reportedById_extraInitializers);
            __esDecorate(null, null, _reportedByName_decorators, { kind: "field", name: "reportedByName", static: false, private: false, access: { has: obj => "reportedByName" in obj, get: obj => obj.reportedByName, set: (obj, value) => { obj.reportedByName = value; } }, metadata: _metadata }, _reportedByName_initializers, _reportedByName_extraInitializers);
            __esDecorate(null, null, _contractorResponsible_decorators, { kind: "field", name: "contractorResponsible", static: false, private: false, access: { has: obj => "contractorResponsible" in obj, get: obj => obj.contractorResponsible, set: (obj, value) => { obj.contractorResponsible = value; } }, metadata: _metadata }, _contractorResponsible_initializers, _contractorResponsible_extraInitializers);
            __esDecorate(null, null, _assignedToId_decorators, { kind: "field", name: "assignedToId", static: false, private: false, access: { has: obj => "assignedToId" in obj, get: obj => obj.assignedToId, set: (obj, value) => { obj.assignedToId = value; } }, metadata: _metadata }, _assignedToId_initializers, _assignedToId_extraInitializers);
            __esDecorate(null, null, _assignedToName_decorators, { kind: "field", name: "assignedToName", static: false, private: false, access: { has: obj => "assignedToName" in obj, get: obj => obj.assignedToName, set: (obj, value) => { obj.assignedToName = value; } }, metadata: _metadata }, _assignedToName_initializers, _assignedToName_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _estimatedHours_decorators, { kind: "field", name: "estimatedHours", static: false, private: false, access: { has: obj => "estimatedHours" in obj, get: obj => obj.estimatedHours, set: (obj, value) => { obj.estimatedHours = value; } }, metadata: _metadata }, _estimatedHours_initializers, _estimatedHours_extraInitializers);
            __esDecorate(null, null, _estimatedCost_decorators, { kind: "field", name: "estimatedCost", static: false, private: false, access: { has: obj => "estimatedCost" in obj, get: obj => obj.estimatedCost, set: (obj, value) => { obj.estimatedCost = value; } }, metadata: _metadata }, _estimatedCost_initializers, _estimatedCost_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePunchListItemDto = CreatePunchListItemDto;
//# sourceMappingURL=create-punch-list-item.dto.js.map