"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAbacPolicyDto = exports.AbacConditionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const abac_policy_interface_1 = require("../interfaces/abac-policy.interface");
class AbacConditionDto {
    attribute;
    operator;
    value;
    static _OPENAPI_METADATA_FACTORY() {
        return { attribute: { required: true, type: () => String }, operator: { required: true, enum: require("../interfaces/abac-policy.interface").AbacOperator }, value: { required: true, type: () => Object } };
    }
}
exports.AbacConditionDto = AbacConditionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Attribute path', example: 'user.department' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AbacConditionDto.prototype, "attribute", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Comparison operator', enum: abac_policy_interface_1.AbacOperator }),
    (0, class_validator_1.IsEnum)(abac_policy_interface_1.AbacOperator),
    __metadata("design:type", String)
], AbacConditionDto.prototype, "operator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Value to compare against' }),
    __metadata("design:type", Object)
], AbacConditionDto.prototype, "value", void 0);
class CreateAbacPolicyDto {
    name;
    description;
    effect;
    conditions;
    priority;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, description: { required: false, type: () => String }, effect: { required: true, type: () => Object }, conditions: { required: true, type: () => [require("./create-abac-policy.dto").AbacConditionDto] }, priority: { required: true, type: () => Number }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.CreateAbacPolicyDto = CreateAbacPolicyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Policy name',
        example: 'Allow access during business hours',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAbacPolicyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy description', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAbacPolicyDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy effect', enum: ['allow', 'deny'] }),
    (0, class_validator_1.IsEnum)(['allow', 'deny']),
    __metadata("design:type", String)
], CreateAbacPolicyDto.prototype, "effect", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy conditions', type: [AbacConditionDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AbacConditionDto),
    __metadata("design:type", Array)
], CreateAbacPolicyDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Policy priority (higher = evaluated first)',
        example: 100,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAbacPolicyDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether policy is active', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAbacPolicyDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-abac-policy.dto.js.map