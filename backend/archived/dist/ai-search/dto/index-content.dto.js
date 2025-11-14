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
exports.IndexContentDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class IndexContentDto {
    contentType;
    contentId;
    content;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { contentType: { required: true, type: () => String, maxLength: 100 }, contentId: { required: true, type: () => String, maxLength: 200 }, content: { required: true, type: () => String, maxLength: 10000 }, metadata: { required: false, type: () => Object } };
    }
}
exports.IndexContentDto = IndexContentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Content type to index',
        example: 'health-record',
        maxLength: 100,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Content type is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Content type cannot exceed 100 characters' }),
    __metadata("design:type", String)
], IndexContentDto.prototype, "contentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique content identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
        maxLength: 200,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Content ID is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200, { message: 'Content ID cannot exceed 200 characters' }),
    __metadata("design:type", String)
], IndexContentDto.prototype, "contentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Content text to index',
        example: 'Patient John Doe has asthma requiring daily inhaler...',
        maxLength: 10000,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Content is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10000, { message: 'Content cannot exceed 10000 characters' }),
    __metadata("design:type", String)
], IndexContentDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional metadata for filtering',
        required: false,
        example: { studentId: 'uuid', category: 'respiratory' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], IndexContentDto.prototype, "metadata", void 0);
//# sourceMappingURL=index-content.dto.js.map