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
exports.CreateChangeOrderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const change_order_model_1 = require("../models/change-order.model");
let CreateChangeOrderDto = (() => {
    var _a;
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _changeType_decorators;
    let _changeType_initializers = [];
    let _changeType_extraInitializers = [];
    let _costImpact_decorators;
    let _costImpact_initializers = [];
    let _costImpact_extraInitializers = [];
    let _scheduleImpact_decorators;
    let _scheduleImpact_initializers = [];
    let _scheduleImpact_extraInitializers = [];
    return _a = class CreateChangeOrderDto {
            constructor() {
                this.projectId = __runInitializers(this, _projectId_initializers, void 0);
                this.title = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.changeType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _changeType_initializers, void 0));
                this.costImpact = (__runInitializers(this, _changeType_extraInitializers), __runInitializers(this, _costImpact_initializers, void 0));
                this.scheduleImpact = (__runInitializers(this, _costImpact_extraInitializers), __runInitializers(this, _scheduleImpact_initializers, void 0));
                __runInitializers(this, _scheduleImpact_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID (UUID). Should match the URL parameter.' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Title of the change order', example: 'Add Emergency Generator' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Detailed description of the change', example: 'Install a 500kW backup generator as per revised electrical plan E-2.' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            _changeType_decorators = [(0, swagger_1.ApiProperty)({ enum: change_order_model_1.ChangeOrderType, example: change_order_model_1.ChangeOrderType.SCOPE }), (0, class_validator_1.IsEnum)(change_order_model_1.ChangeOrderType)];
            _costImpact_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost impact of the change', example: 150000 }), (0, class_validator_1.IsNumber)()];
            _scheduleImpact_decorators = [(0, swagger_1.ApiProperty)({ description: 'Schedule impact in days', example: 14 }), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _changeType_decorators, { kind: "field", name: "changeType", static: false, private: false, access: { has: obj => "changeType" in obj, get: obj => obj.changeType, set: (obj, value) => { obj.changeType = value; } }, metadata: _metadata }, _changeType_initializers, _changeType_extraInitializers);
            __esDecorate(null, null, _costImpact_decorators, { kind: "field", name: "costImpact", static: false, private: false, access: { has: obj => "costImpact" in obj, get: obj => obj.costImpact, set: (obj, value) => { obj.costImpact = value; } }, metadata: _metadata }, _costImpact_initializers, _costImpact_extraInitializers);
            __esDecorate(null, null, _scheduleImpact_decorators, { kind: "field", name: "scheduleImpact", static: false, private: false, access: { has: obj => "scheduleImpact" in obj, get: obj => obj.scheduleImpact, set: (obj, value) => { obj.scheduleImpact = value; } }, metadata: _metadata }, _scheduleImpact_initializers, _scheduleImpact_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateChangeOrderDto = CreateChangeOrderDto;
//# sourceMappingURL=create-change-order.dto.js.map