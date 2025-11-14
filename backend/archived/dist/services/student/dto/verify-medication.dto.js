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
exports.VerifyMedicationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class VerifyMedicationDto {
    studentBarcode;
    medicationBarcode;
    nurseBarcode;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentBarcode: { required: true, type: () => String }, medicationBarcode: { required: true, type: () => String }, nurseBarcode: { required: true, type: () => String } };
    }
}
exports.VerifyMedicationDto = VerifyMedicationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID barcode string',
        example: 'STU-2024-12345',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyMedicationDto.prototype, "studentBarcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Medication barcode string (NDC or custom code)',
        example: 'MED-12345-ASPIRIN-100MG',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyMedicationDto.prototype, "medicationBarcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nurse ID barcode string for verification',
        example: 'NURSE-2024-789',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyMedicationDto.prototype, "nurseBarcode", void 0);
//# sourceMappingURL=verify-medication.dto.js.map