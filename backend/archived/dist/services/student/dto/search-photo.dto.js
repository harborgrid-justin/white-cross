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
exports.SearchPhotoDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SearchPhotoDto {
    imageData;
    threshold = 0.85;
    limit;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { imageData: { required: false, type: () => String }, threshold: { required: false, type: () => Number, default: 0.85, minimum: 0, maximum: 1 }, limit: { required: false, type: () => Number, minimum: 1 }, metadata: { required: false, type: () => ({ grade: { required: false, type: () => String }, gender: { required: false, type: () => String } }) } };
    }
}
exports.SearchPhotoDto = SearchPhotoDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Base64 encoded image data for facial recognition search',
        example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchPhotoDto.prototype, "imageData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Confidence threshold for matches (0.0 to 1.0, default: 0.85)',
        example: 0.85,
        minimum: 0,
        maximum: 1,
        default: 0.85,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], SearchPhotoDto.prototype, "threshold", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum number of results to return',
        example: 10,
        default: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SearchPhotoDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Metadata filters for narrowing search',
        example: { grade: '5', gender: 'M' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SearchPhotoDto.prototype, "metadata", void 0);
//# sourceMappingURL=search-photo.dto.js.map