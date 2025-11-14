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
exports.PdfGenerateCustomReportDto = exports.CustomReportTableDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CustomReportTableDto {
    title;
    headers;
    rows;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String }, headers: { required: true, type: () => [String] }, rows: { required: true, type: () => [[Object]] } };
    }
}
exports.CustomReportTableDto = CustomReportTableDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Table title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CustomReportTableDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Table headers' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CustomReportTableDto.prototype, "headers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Table rows' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CustomReportTableDto.prototype, "rows", void 0);
class PdfGenerateCustomReportDto {
    title;
    subtitle;
    metadata;
    tables;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, subtitle: { required: false, type: () => String }, metadata: { required: false, type: () => Object }, tables: { required: false, type: () => [require("./generate-custom-report.dto").CustomReportTableDto] } };
    }
}
exports.PdfGenerateCustomReportDto = PdfGenerateCustomReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PdfGenerateCustomReportDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Report subtitle' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PdfGenerateCustomReportDto.prototype, "subtitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Report metadata' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], PdfGenerateCustomReportDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Report tables',
        type: [CustomReportTableDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CustomReportTableDto),
    __metadata("design:type", Array)
], PdfGenerateCustomReportDto.prototype, "tables", void 0);
//# sourceMappingURL=generate-custom-report.dto.js.map