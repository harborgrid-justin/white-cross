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
exports.CreateBaselineDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let CreateBaselineDto = (() => {
    var _a;
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _baselineType_decorators;
    let _baselineType_initializers = [];
    let _baselineType_extraInitializers = [];
    let _budget_decorators;
    let _budget_initializers = [];
    let _budget_extraInitializers = [];
    let _schedule_decorators;
    let _schedule_initializers = [];
    let _schedule_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    return _a = class CreateBaselineDto {
            constructor() {
                this.projectId = __runInitializers(this, _projectId_initializers, void 0);
                this.baselineType = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _baselineType_initializers, void 0));
                this.budget = (__runInitializers(this, _baselineType_extraInitializers), __runInitializers(this, _budget_initializers, void 0));
                this.schedule = (__runInitializers(this, _budget_extraInitializers), __runInitializers(this, _schedule_initializers, void 0));
                this.scope = (__runInitializers(this, _schedule_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
                __runInitializers(this, _scope_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID (UUID). Should match the URL parameter.' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            _baselineType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['INITIAL', 'REVISED', 'RE_BASELINE'], example: 'INITIAL' }), (0, class_validator_1.IsEnum)(['INITIAL', 'REVISED', 'RE_BASELINE'])];
            _budget_decorators = [(0, swagger_1.ApiProperty)({ description: 'Baseline budget amount', example: 5000000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _schedule_decorators = [(0, swagger_1.ApiProperty)({ description: 'Baseline schedule completion date', example: '2026-12-31' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _scope_decorators = [(0, swagger_1.ApiProperty)({ description: 'High-level scope description for this baseline', example: 'Complete renovation of west wing, 3rd floor, as per drawings A1-A5.' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _baselineType_decorators, { kind: "field", name: "baselineType", static: false, private: false, access: { has: obj => "baselineType" in obj, get: obj => obj.baselineType, set: (obj, value) => { obj.baselineType = value; } }, metadata: _metadata }, _baselineType_initializers, _baselineType_extraInitializers);
            __esDecorate(null, null, _budget_decorators, { kind: "field", name: "budget", static: false, private: false, access: { has: obj => "budget" in obj, get: obj => obj.budget, set: (obj, value) => { obj.budget = value; } }, metadata: _metadata }, _budget_initializers, _budget_extraInitializers);
            __esDecorate(null, null, _schedule_decorators, { kind: "field", name: "schedule", static: false, private: false, access: { has: obj => "schedule" in obj, get: obj => obj.schedule, set: (obj, value) => { obj.schedule = value; } }, metadata: _metadata }, _schedule_initializers, _schedule_extraInitializers);
            __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateBaselineDto = CreateBaselineDto;
//# sourceMappingURL=create-baseline.dto.js.map