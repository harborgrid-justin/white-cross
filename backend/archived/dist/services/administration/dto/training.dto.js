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
exports.TrainingQueryDto = exports.UpdateTrainingModuleDto = exports.CreateTrainingModuleDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const administration_enums_1 = require("../enums/administration.enums");
class CreateTrainingModuleDto {
    title;
    description;
    content;
    duration;
    category;
    isRequired;
    order;
    attachments;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String, minLength: 2, maxLength: 255 }, description: { required: false, type: () => String }, content: { required: true, type: () => String }, duration: { required: false, type: () => Number, minimum: 1 }, category: { required: true, enum: require("../enums/administration.enums").TrainingCategory }, isRequired: { required: false, type: () => Boolean }, order: { required: false, type: () => Number }, attachments: { required: false, type: () => [String] } };
    }
}
exports.CreateTrainingModuleDto = CreateTrainingModuleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Training module title',
        minLength: 2,
        maxLength: 255,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateTrainingModuleDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Training module description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrainingModuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Training content (HTML, Markdown, etc.)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrainingModuleDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Duration in minutes',
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateTrainingModuleDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Training category',
        enum: administration_enums_1.TrainingCategory,
    }),
    (0, class_validator_1.IsEnum)(administration_enums_1.TrainingCategory),
    __metadata("design:type", String)
], CreateTrainingModuleDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is this training required for all staff',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTrainingModuleDto.prototype, "isRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Display order in training list',
        default: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTrainingModuleDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URLs to attachment files',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTrainingModuleDto.prototype, "attachments", void 0);
class UpdateTrainingModuleDto extends (0, swagger_1.PartialType)(CreateTrainingModuleDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateTrainingModuleDto = UpdateTrainingModuleDto;
class TrainingQueryDto {
    category;
    isRequired;
    page = 1;
    limit = 20;
    static _OPENAPI_METADATA_FACTORY() {
        return { category: { required: false, enum: require("../enums/administration.enums").TrainingCategory }, isRequired: { required: false, type: () => Boolean }, page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 20, minimum: 1 } };
    }
}
exports.TrainingQueryDto = TrainingQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by category',
        enum: administration_enums_1.TrainingCategory,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(administration_enums_1.TrainingCategory),
    __metadata("design:type", String)
], TrainingQueryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by required status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TrainingQueryDto.prototype, "isRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', default: 1, minimum: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], TrainingQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Items per page',
        default: 20,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], TrainingQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=training.dto.js.map