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
exports.DrugInteractionDto = exports.InteractionSeverity = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var InteractionSeverity;
(function (InteractionSeverity) {
    InteractionSeverity["MINOR"] = "minor";
    InteractionSeverity["MODERATE"] = "moderate";
    InteractionSeverity["MAJOR"] = "major";
    InteractionSeverity["CONTRAINDICATED"] = "contraindicated";
})(InteractionSeverity || (exports.InteractionSeverity = InteractionSeverity = {}));
class DrugInteractionDto {
    severity;
    medication1;
    medication2;
    description;
    recommendation;
    static _OPENAPI_METADATA_FACTORY() {
        return { severity: { required: true, enum: require("./drug-interaction.dto").InteractionSeverity }, medication1: { required: true, type: () => String }, medication2: { required: true, type: () => String }, description: { required: true, type: () => String }, recommendation: { required: true, type: () => String } };
    }
}
exports.DrugInteractionDto = DrugInteractionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Severity level of the drug interaction',
        enum: InteractionSeverity,
        example: InteractionSeverity.MODERATE,
    }),
    (0, class_validator_1.IsEnum)(InteractionSeverity),
    __metadata("design:type", String)
], DrugInteractionDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the first medication in the interaction',
        example: 'Warfarin',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugInteractionDto.prototype, "medication1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the second medication in the interaction',
        example: 'Aspirin',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugInteractionDto.prototype, "medication2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed description of the interaction and its effects',
        example: 'Concurrent use may increase bleeding risk due to additive anticoagulant effects',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugInteractionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Clinical recommendation for managing this interaction',
        example: 'Monitor INR levels more frequently. Consider alternative pain management options.',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugInteractionDto.prototype, "recommendation", void 0);
//# sourceMappingURL=drug-interaction.dto.js.map