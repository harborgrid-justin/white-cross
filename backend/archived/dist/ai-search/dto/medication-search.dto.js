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
exports.MedicationSearchDto = exports.MedicationSearchType = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var MedicationSearchType;
(function (MedicationSearchType) {
    MedicationSearchType["INTERACTIONS"] = "interactions";
    MedicationSearchType["ALTERNATIVES"] = "alternatives";
    MedicationSearchType["SIDE_EFFECTS"] = "side_effects";
    MedicationSearchType["CONTRAINDICATIONS"] = "contraindications";
})(MedicationSearchType || (exports.MedicationSearchType = MedicationSearchType = {}));
class MedicationSearchDto {
    searchType;
    medications;
    patientId;
    static _OPENAPI_METADATA_FACTORY() {
        return { searchType: { required: true, enum: require("./medication-search.dto").MedicationSearchType }, medications: { required: true, type: () => [String] }, patientId: { required: false, type: () => String } };
    }
}
exports.MedicationSearchDto = MedicationSearchDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of medication search',
        enum: MedicationSearchType,
        example: MedicationSearchType.INTERACTIONS,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(MedicationSearchType),
    __metadata("design:type", String)
], MedicationSearchDto.prototype, "searchType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of medications to search',
        example: ['aspirin', 'warfarin'],
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], MedicationSearchDto.prototype, "medications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Patient ID for contraindication searches',
        required: false,
        example: 'uuid-123',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MedicationSearchDto.prototype, "patientId", void 0);
//# sourceMappingURL=medication-search.dto.js.map