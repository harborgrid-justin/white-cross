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
exports.StudentScanBarcodeDto = exports.BarcodeScanType = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var BarcodeScanType;
(function (BarcodeScanType) {
    BarcodeScanType["STUDENT"] = "student";
    BarcodeScanType["MEDICATION"] = "medication";
    BarcodeScanType["EQUIPMENT"] = "equipment";
    BarcodeScanType["GENERAL"] = "general";
})(BarcodeScanType || (exports.BarcodeScanType = BarcodeScanType = {}));
class StudentScanBarcodeDto {
    barcodeString;
    scanType = BarcodeScanType.GENERAL;
    static _OPENAPI_METADATA_FACTORY() {
        return { barcodeString: { required: true, type: () => String }, scanType: { required: false, default: BarcodeScanType.GENERAL, enum: require("./scan-barcode.dto").BarcodeScanType } };
    }
}
exports.StudentScanBarcodeDto = StudentScanBarcodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Barcode string data (alphanumeric)',
        example: 'STU-2024-12345',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StudentScanBarcodeDto.prototype, "barcodeString", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of barcode scan for context-specific processing',
        enum: BarcodeScanType,
        example: BarcodeScanType.STUDENT,
        default: BarcodeScanType.GENERAL,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(BarcodeScanType),
    __metadata("design:type", String)
], StudentScanBarcodeDto.prototype, "scanType", void 0);
//# sourceMappingURL=scan-barcode.dto.js.map