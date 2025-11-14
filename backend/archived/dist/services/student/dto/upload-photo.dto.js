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
exports.UploadPhotoDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UploadPhotoDto {
    imageData;
    photoUrl;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { imageData: { required: false, type: () => String }, photoUrl: { required: false, type: () => String }, metadata: { required: false, type: () => Object } };
    }
}
exports.UploadPhotoDto = UploadPhotoDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Base64 encoded image data (JPEG, PNG, or GIF)',
        example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadPhotoDto.prototype, "imageData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Photo URL/path (alternative to imageData)',
        example: 'https://example.com/photos/student-123.jpg',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadPhotoDto.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Photo metadata including capture date, device info, location',
        example: {
            captureDate: '2025-10-28T10:30:00Z',
            device: 'iPad Pro',
            location: 'School Nurse Office',
            photographer: 'Nurse Smith',
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UploadPhotoDto.prototype, "metadata", void 0);
//# sourceMappingURL=upload-photo.dto.js.map