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
exports.VerifyMedicationAdministrationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class VerifyMedicationAdministrationDto {
    studentBarcode;
    medicationBarcode;
    nurseBarcode;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentBarcode: { required: true, type: () => String }, medicationBarcode: { required: true, type: () => String }, nurseBarcode: { required: true, type: () => String } };
    }
}
exports.VerifyMedicationAdministrationDto = VerifyMedicationAdministrationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student barcode',
        example: 'STU123456789',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Student barcode is required' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyMedicationAdministrationDto.prototype, "studentBarcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Medication barcode',
        example: 'MED987654321',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Medication barcode is required' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyMedicationAdministrationDto.prototype, "medicationBarcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nurse barcode',
        example: 'NRS456789123',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nurse barcode is required' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyMedicationAdministrationDto.prototype, "nurseBarcode", void 0);
//# sourceMappingURL=verify-medication-administration.dto.js.map