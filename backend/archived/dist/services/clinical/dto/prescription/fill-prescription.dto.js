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
exports.FillPrescriptionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class FillPrescriptionDto {
    pharmacyName;
    quantityFilled;
    filledDate;
    refillNumber = 0;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { pharmacyName: { required: true, type: () => String }, quantityFilled: { required: true, type: () => Number, minimum: 1 }, filledDate: { required: true, type: () => Date }, refillNumber: { required: false, type: () => Number, default: 0, minimum: 0 }, notes: { required: false, type: () => String } };
    }
}
exports.FillPrescriptionDto = FillPrescriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pharmacy name', example: 'CVS Pharmacy #1234' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FillPrescriptionDto.prototype, "pharmacyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity actually filled',
        example: 30,
        minimum: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FillPrescriptionDto.prototype, "quantityFilled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date prescription was filled',
        example: '2025-10-28T10:30:00Z',
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], FillPrescriptionDto.prototype, "filledDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Refill number (0 for initial fill)',
        example: 0,
        minimum: 0,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FillPrescriptionDto.prototype, "refillNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes about the fill' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FillPrescriptionDto.prototype, "notes", void 0);
//# sourceMappingURL=fill-prescription.dto.js.map