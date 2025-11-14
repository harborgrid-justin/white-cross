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
exports.GenerateBarcodeDto = exports.BarcodePurpose = exports.BarcodeFormat = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var BarcodeFormat;
(function (BarcodeFormat) {
    BarcodeFormat["CODE128"] = "CODE128";
    BarcodeFormat["QR_CODE"] = "QR_CODE";
    BarcodeFormat["PDF417"] = "PDF417";
})(BarcodeFormat || (exports.BarcodeFormat = BarcodeFormat = {}));
var BarcodePurpose;
(function (BarcodePurpose) {
    BarcodePurpose["STUDENT_ID"] = "STUDENT_ID";
    BarcodePurpose["MEDICATION"] = "MEDICATION";
    BarcodePurpose["ATTENDANCE"] = "ATTENDANCE";
    BarcodePurpose["CAFETERIA"] = "CAFETERIA";
    BarcodePurpose["LIBRARY"] = "LIBRARY";
})(BarcodePurpose || (exports.BarcodePurpose = BarcodePurpose = {}));
class GenerateBarcodeDto {
    format = BarcodeFormat.CODE128;
    purpose = BarcodePurpose.STUDENT_ID;
    metadata;
    displayText;
    static _OPENAPI_METADATA_FACTORY() {
        return { format: { required: false, default: BarcodeFormat.CODE128, enum: require("./generate-barcode.dto").BarcodeFormat }, purpose: { required: false, default: BarcodePurpose.STUDENT_ID, enum: require("./generate-barcode.dto").BarcodePurpose }, metadata: { required: false, type: () => Object }, displayText: { required: false, type: () => String } };
    }
}
exports.GenerateBarcodeDto = GenerateBarcodeDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Barcode format',
        enum: BarcodeFormat,
        default: BarcodeFormat.CODE128,
        example: BarcodeFormat.CODE128,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(BarcodeFormat),
    __metadata("design:type", String)
], GenerateBarcodeDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Purpose of the barcode',
        enum: BarcodePurpose,
        default: BarcodePurpose.STUDENT_ID,
        example: BarcodePurpose.STUDENT_ID,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(BarcodePurpose),
    __metadata("design:type", String)
], GenerateBarcodeDto.prototype, "purpose", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional metadata for barcode generation',
        example: { expiresAt: '2024-12-31', accessLevel: 'FULL' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], GenerateBarcodeDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom display text for barcode',
        example: 'SMITH, JOHN - GRADE 9',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateBarcodeDto.prototype, "displayText", void 0);
//# sourceMappingURL=generate-barcode.dto.js.map