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
exports.WatermarkPdfDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class WatermarkPdfDto {
    pdfBuffer;
    watermarkText;
    x;
    y;
    size;
    opacity;
    rotate;
    static _OPENAPI_METADATA_FACTORY() {
        return { pdfBuffer: { required: true, type: () => String }, watermarkText: { required: true, type: () => String }, x: { required: false, type: () => Number }, y: { required: false, type: () => Number }, size: { required: false, type: () => Number, minimum: 1, maximum: 200 }, opacity: { required: false, type: () => Number, minimum: 0, maximum: 1 }, rotate: { required: false, type: () => Number, minimum: 0, maximum: 360 } };
    }
}
exports.WatermarkPdfDto = WatermarkPdfDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Base64-encoded PDF buffer' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WatermarkPdfDto.prototype, "pdfBuffer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Watermark text' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WatermarkPdfDto.prototype, "watermarkText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'X position', default: 'center' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], WatermarkPdfDto.prototype, "x", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Y position', default: 'center' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], WatermarkPdfDto.prototype, "y", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Font size', default: 50 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", Number)
], WatermarkPdfDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Opacity (0-1)', default: 0.3 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], WatermarkPdfDto.prototype, "opacity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rotation angle', default: 45 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(360),
    __metadata("design:type", Number)
], WatermarkPdfDto.prototype, "rotate", void 0);
//# sourceMappingURL=watermark-pdf.dto.js.map