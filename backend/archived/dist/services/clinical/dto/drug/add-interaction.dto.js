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
exports.AddInteractionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const interaction_severity_enum_1 = require("../../enums/interaction-severity.enum");
class AddInteractionDto {
    drug1Id;
    drug2Id;
    severity;
    description;
    clinicalEffects;
    management;
    references;
    evidenceLevel;
    static _OPENAPI_METADATA_FACTORY() {
        return { drug1Id: { required: true, type: () => String, format: "uuid" }, drug2Id: { required: true, type: () => String, format: "uuid" }, severity: { required: true, enum: require("../../enums/interaction-severity.enum").InteractionSeverity }, description: { required: true, type: () => String, minLength: 10 }, clinicalEffects: { required: false, type: () => String }, management: { required: false, type: () => String }, references: { required: false, type: () => [String] }, evidenceLevel: { required: false, type: () => String } };
    }
}
exports.AddInteractionDto = AddInteractionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'First drug ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], AddInteractionDto.prototype, "drug1Id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Second drug ID',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], AddInteractionDto.prototype, "drug2Id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Interaction severity level',
        enum: interaction_severity_enum_1.InteractionSeverity,
        example: interaction_severity_enum_1.InteractionSeverity.MODERATE,
    }),
    (0, class_validator_1.IsEnum)(interaction_severity_enum_1.InteractionSeverity),
    __metadata("design:type", String)
], AddInteractionDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of the interaction',
        example: 'May increase risk of gastrointestinal bleeding',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], AddInteractionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Clinical effects of the interaction',
        example: 'Increased bleeding risk, gastric irritation',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddInteractionDto.prototype, "clinicalEffects", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Management recommendations',
        example: 'Monitor for signs of bleeding, consider alternative therapy',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddInteractionDto.prototype, "management", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reference citations',
        example: ['DrugBank', 'FDA Drug Interactions Database'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AddInteractionDto.prototype, "references", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Evidence level (e.g., Level A, Level B)',
        example: 'Level A',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddInteractionDto.prototype, "evidenceLevel", void 0);
//# sourceMappingURL=add-interaction.dto.js.map