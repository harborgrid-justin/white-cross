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
exports.CreatePhiDisclosureDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const index_1 = require("../enums/index");
class CreatePhiDisclosureDto {
    studentId;
    disclosureType;
    purpose;
    method;
    disclosureDate;
    informationDisclosed;
    minimumNecessary;
    recipientType;
    recipientName;
    recipientOrganization;
    recipientAddress;
    recipientPhone;
    recipientEmail;
    authorizationObtained;
    authorizationDate;
    authorizationExpiryDate;
    patientRequested;
    followUpRequired;
    followUpDate;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String }, disclosureType: { required: true, enum: require("../enums/index").DisclosureType }, purpose: { required: true, enum: require("../enums/index").DisclosurePurpose }, method: { required: true, enum: require("../enums/index").DisclosureMethod }, disclosureDate: { required: true, type: () => Date }, informationDisclosed: { required: true, type: () => [String] }, minimumNecessary: { required: true, type: () => String, minLength: 10 }, recipientType: { required: true, enum: require("../enums/index").RecipientType }, recipientName: { required: true, type: () => String }, recipientOrganization: { required: false, type: () => String }, recipientAddress: { required: false, type: () => String }, recipientPhone: { required: false, type: () => String }, recipientEmail: { required: false, type: () => String, format: "email" }, authorizationObtained: { required: true, type: () => Boolean }, authorizationDate: { required: false, type: () => Date }, authorizationExpiryDate: { required: false, type: () => Date }, patientRequested: { required: true, type: () => Boolean }, followUpRequired: { required: true, type: () => Boolean }, followUpDate: { required: false, type: () => Date }, notes: { required: false, type: () => String } };
    }
}
exports.CreatePhiDisclosureDto = CreatePhiDisclosureDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the student whose PHI is being disclosed',
        example: 'student-uuid-123',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePhiDisclosureDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of disclosure',
        enum: index_1.DisclosureType,
        example: index_1.DisclosureType.TREATMENT,
    }),
    (0, class_validator_1.IsEnum)(index_1.DisclosureType),
    __metadata("design:type", String)
], CreatePhiDisclosureDto.prototype, "disclosureType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Purpose of the disclosure',
        enum: index_1.DisclosurePurpose,
        example: index_1.DisclosurePurpose.TREATMENT,
    }),
    (0, class_validator_1.IsEnum)(index_1.DisclosurePurpose),
    __metadata("design:type", String)
], CreatePhiDisclosureDto.prototype, "purpose", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Method of disclosure',
        enum: index_1.DisclosureMethod,
        example: index_1.DisclosureMethod.ELECTRONIC,
    }),
    (0, class_validator_1.IsEnum)(index_1.DisclosureMethod),
    __metadata("design:type", String)
], CreatePhiDisclosureDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of disclosure',
        type: Date,
        example: '2025-01-15T10:30:00Z',
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreatePhiDisclosureDto.prototype, "disclosureDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of information types disclosed',
        type: [String],
        example: ['Medications', 'Immunization Records', 'Allergies'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePhiDisclosureDto.prototype, "informationDisclosed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Minimum necessary justification (HIPAA requirement, min 10 characters)',
        example: 'Information required for emergency treatment coordination with external provider',
        minLength: 10,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10, {
        message: 'Minimum necessary justification must be at least 10 characters',
    }),
    __metadata("design:type", String)
], CreatePhiDisclosureDto.prototype, "minimumNecessary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of recipient',
        enum: index_1.RecipientType,
        example: index_1.RecipientType.HEALTHCARE_PROVIDER,
    }),
    (0, class_validator_1.IsEnum)(index_1.RecipientType),
    __metadata("design:type", String)
], CreatePhiDisclosureDto.prototype, "recipientType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the recipient',
        example: 'Dr. John Smith',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePhiDisclosureDto.prototype, "recipientName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Organization of the recipient',
        example: 'City General Hospital',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePhiDisclosureDto.prototype, "recipientOrganization", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Address of the recipient',
        example: '123 Medical Center Drive, City, ST 12345',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePhiDisclosureDto.prototype, "recipientAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Phone number of the recipient',
        example: '(555) 123-4567',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePhiDisclosureDto.prototype, "recipientPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email address of the recipient',
        example: 'dr.smith@hospital.org',
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePhiDisclosureDto.prototype, "recipientEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether patient authorization was obtained',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePhiDisclosureDto.prototype, "authorizationObtained", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date authorization was obtained',
        type: Date,
        example: '2025-01-14T09:00:00Z',
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreatePhiDisclosureDto.prototype, "authorizationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Authorization expiry date',
        type: Date,
        example: '2026-01-14T09:00:00Z',
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreatePhiDisclosureDto.prototype, "authorizationExpiryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether disclosure was requested by patient',
        example: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePhiDisclosureDto.prototype, "patientRequested", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether follow-up is required',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePhiDisclosureDto.prototype, "followUpRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date follow-up is due',
        type: Date,
        example: '2025-02-15T10:30:00Z',
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreatePhiDisclosureDto.prototype, "followUpDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about the disclosure',
        example: 'Emergency situation required immediate disclosure to treating physician',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePhiDisclosureDto.prototype, "notes", void 0);
//# sourceMappingURL=create-phi-disclosure.dto.js.map