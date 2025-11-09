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
exports.CreateConstructionProjectDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const project_types_1 = require("../types/project.types");
let CreateConstructionProjectDto = (() => {
    var _a;
    let _projectName_decorators;
    let _projectName_initializers = [];
    let _projectName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _deliveryMethod_decorators;
    let _deliveryMethod_initializers = [];
    let _deliveryMethod_extraInitializers = [];
    let _projectManagerId_decorators;
    let _projectManagerId_initializers = [];
    let _projectManagerId_extraInitializers = [];
    let _totalBudget_decorators;
    let _totalBudget_initializers = [];
    let _totalBudget_extraInitializers = [];
    let _baselineEndDate_decorators;
    let _baselineEndDate_initializers = [];
    let _baselineEndDate_extraInitializers = [];
    let _districtCode_decorators;
    let _districtCode_initializers = [];
    let _districtCode_extraInitializers = [];
    return _a = class CreateConstructionProjectDto {
            constructor() {
                this.projectName = __runInitializers(this, _projectName_initializers, void 0);
                this.description = (__runInitializers(this, _projectName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.priority = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.deliveryMethod = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _deliveryMethod_initializers, void 0));
                this.projectManagerId = (__runInitializers(this, _deliveryMethod_extraInitializers), __runInitializers(this, _projectManagerId_initializers, void 0));
                this.totalBudget = (__runInitializers(this, _projectManagerId_extraInitializers), __runInitializers(this, _totalBudget_initializers, void 0));
                this.baselineEndDate = (__runInitializers(this, _totalBudget_extraInitializers), __runInitializers(this, _baselineEndDate_initializers, void 0));
                this.districtCode = (__runInitializers(this, _baselineEndDate_extraInitializers), __runInitializers(this, _districtCode_initializers, void 0));
                __runInitializers(this, _districtCode_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project name', example: 'Hospital Wing Renovation' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project description', example: 'Renovation of the west wing, 3rd floor.' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: project_types_1.ProjectPriority, example: project_types_1.ProjectPriority.HIGH }), (0, class_validator_1.IsEnum)(project_types_1.ProjectPriority)];
            _deliveryMethod_decorators = [(0, swagger_1.ApiProperty)({ enum: project_types_1.DeliveryMethod, example: project_types_1.DeliveryMethod.DESIGN_BUILD }), (0, class_validator_1.IsEnum)(project_types_1.DeliveryMethod)];
            _projectManagerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project manager ID (UUID)', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' }), (0, class_validator_1.IsUUID)()];
            _totalBudget_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total project budget', example: 5000000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _baselineEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Baseline end date', example: '2026-12-31' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _districtCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'District code', required: false, example: 'NWD' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _projectName_decorators, { kind: "field", name: "projectName", static: false, private: false, access: { has: obj => "projectName" in obj, get: obj => obj.projectName, set: (obj, value) => { obj.projectName = value; } }, metadata: _metadata }, _projectName_initializers, _projectName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _deliveryMethod_decorators, { kind: "field", name: "deliveryMethod", static: false, private: false, access: { has: obj => "deliveryMethod" in obj, get: obj => obj.deliveryMethod, set: (obj, value) => { obj.deliveryMethod = value; } }, metadata: _metadata }, _deliveryMethod_initializers, _deliveryMethod_extraInitializers);
            __esDecorate(null, null, _projectManagerId_decorators, { kind: "field", name: "projectManagerId", static: false, private: false, access: { has: obj => "projectManagerId" in obj, get: obj => obj.projectManagerId, set: (obj, value) => { obj.projectManagerId = value; } }, metadata: _metadata }, _projectManagerId_initializers, _projectManagerId_extraInitializers);
            __esDecorate(null, null, _totalBudget_decorators, { kind: "field", name: "totalBudget", static: false, private: false, access: { has: obj => "totalBudget" in obj, get: obj => obj.totalBudget, set: (obj, value) => { obj.totalBudget = value; } }, metadata: _metadata }, _totalBudget_initializers, _totalBudget_extraInitializers);
            __esDecorate(null, null, _baselineEndDate_decorators, { kind: "field", name: "baselineEndDate", static: false, private: false, access: { has: obj => "baselineEndDate" in obj, get: obj => obj.baselineEndDate, set: (obj, value) => { obj.baselineEndDate = value; } }, metadata: _metadata }, _baselineEndDate_initializers, _baselineEndDate_extraInitializers);
            __esDecorate(null, null, _districtCode_decorators, { kind: "field", name: "districtCode", static: false, private: false, access: { has: obj => "districtCode" in obj, get: obj => obj.districtCode, set: (obj, value) => { obj.districtCode = value; } }, metadata: _metadata }, _districtCode_initializers, _districtCode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateConstructionProjectDto = CreateConstructionProjectDto;
//# sourceMappingURL=create-project.dto.js.map