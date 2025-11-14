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
exports.VerifyBarcodeDto = exports.VerificationPurpose = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var VerificationPurpose;
(function (VerificationPurpose) {
    VerificationPurpose["STUDENT_ID"] = "STUDENT_ID";
    VerificationPurpose["MEDICATION"] = "MEDICATION";
    VerificationPurpose["ATTENDANCE"] = "ATTENDANCE";
    VerificationPurpose["CAFETERIA"] = "CAFETERIA";
    VerificationPurpose["LIBRARY"] = "LIBRARY";
    VerificationPurpose["CHECK_IN"] = "CHECK_IN";
    VerificationPurpose["CHECK_OUT"] = "CHECK_OUT";
})(VerificationPurpose || (exports.VerificationPurpose = VerificationPurpose = {}));
class VerifyBarcodeDto {
    barcode;
    purpose;
    location;
    deviceId;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { barcode: { required: true, type: () => String }, purpose: { required: false, enum: require("./verify-barcode.dto").VerificationPurpose }, location: { required: false, type: () => String }, deviceId: { required: false, type: () => String }, metadata: { required: false, type: () => Object } };
    }
}
exports.VerifyBarcodeDto = VerifyBarcodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Barcode string to verify',
        example: '123456789',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyBarcodeDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Purpose of verification',
        enum: VerificationPurpose,
        example: VerificationPurpose.STUDENT_ID,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(VerificationPurpose),
    __metadata("design:type", String)
], VerifyBarcodeDto.prototype, "purpose", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Location where verification is happening',
        example: 'Main Entrance',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyBarcodeDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Device or system performing verification',
        example: 'Attendance Terminal #1',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyBarcodeDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional verification metadata',
        example: { shift: 'morning', accessLevel: 'student' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], VerifyBarcodeDto.prototype, "metadata", void 0);
//# sourceMappingURL=verify-barcode.dto.js.map