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
exports.AdvancedFeaturesScanBarcodeDto = exports.ScanType = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ScanType;
(function (ScanType) {
    ScanType["STUDENT"] = "student";
    ScanType["MEDICATION"] = "medication";
    ScanType["NURSE"] = "nurse";
    ScanType["INVENTORY"] = "inventory";
    ScanType["EQUIPMENT"] = "equipment";
})(ScanType || (exports.ScanType = ScanType = {}));
class AdvancedFeaturesScanBarcodeDto {
    barcodeString;
    scanType;
    context;
    static _OPENAPI_METADATA_FACTORY() {
        return { barcodeString: { required: true, type: () => String }, scanType: { required: true, enum: require("./scan-barcode.dto").ScanType }, context: { required: false, type: () => String } };
    }
}
exports.AdvancedFeaturesScanBarcodeDto = AdvancedFeaturesScanBarcodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Barcode string to scan',
        example: '123456789012',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Barcode string is required' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdvancedFeaturesScanBarcodeDto.prototype, "barcodeString", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of barcode being scanned',
        enum: ScanType,
        example: ScanType.MEDICATION,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Scan type is required' }),
    (0, class_validator_1.IsEnum)(ScanType, { message: 'Invalid scan type' }),
    __metadata("design:type", String)
], AdvancedFeaturesScanBarcodeDto.prototype, "scanType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional context for the scan',
        example: 'medication_administration',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdvancedFeaturesScanBarcodeDto.prototype, "context", void 0);
//# sourceMappingURL=scan-barcode.dto.js.map