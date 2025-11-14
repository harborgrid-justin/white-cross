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
exports.InteractionCheckResultDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const drug_interaction_dto_1 = require("./drug-interaction.dto");
class InteractionCheckResultDto {
    hasInteractions;
    interactions;
    safetyScore;
    static _OPENAPI_METADATA_FACTORY() {
        return { hasInteractions: { required: true, type: () => Boolean }, interactions: { required: true, type: () => [require("./drug-interaction.dto").DrugInteractionDto] }, safetyScore: { required: true, type: () => Number, minimum: 0, maximum: 100 } };
    }
}
exports.InteractionCheckResultDto = InteractionCheckResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether any drug interactions were found',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], InteractionCheckResultDto.prototype, "hasInteractions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of identified drug interactions',
        type: [drug_interaction_dto_1.DrugInteractionDto],
        example: [
            {
                severity: 'moderate',
                medication1: 'Warfarin',
                medication2: 'Aspirin',
                description: 'Concurrent use may increase bleeding risk',
                recommendation: 'Monitor INR levels more frequently',
            },
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => drug_interaction_dto_1.DrugInteractionDto),
    __metadata("design:type", Array)
], InteractionCheckResultDto.prototype, "interactions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Overall safety score (0-100, higher is safer)',
        example: 75,
        minimum: 0,
        maximum: 100,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], InteractionCheckResultDto.prototype, "safetyScore", void 0);
//# sourceMappingURL=interaction-check-result.dto.js.map