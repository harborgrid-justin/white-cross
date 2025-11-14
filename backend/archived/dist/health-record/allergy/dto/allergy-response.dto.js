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
exports.MedicationInteractionResponseDto = exports.MedicationInteractionDto = exports.AllergyListResponseDto = exports.AllergyResponseDto = exports.AllergySummaryDto = exports.StudentSummaryDto = void 0;
exports.mapToAllergySummaryDto = mapToAllergySummaryDto;
exports.mapToAllergyResponseDto = mapToAllergyResponseDto;
exports.mapToAllergySummaryDtoArray = mapToAllergySummaryDtoArray;
exports.mapToAllergyResponseDtoArray = mapToAllergyResponseDtoArray;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const models_1 = require("../../../database/models");
const paginated_response_dto_1 = require("../../../common/dto/paginated-response.dto");
let StudentSummaryDto = class StudentSummaryDto {
    id;
    firstName;
    lastName;
    fullName;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, fullName: { required: false, type: () => String } };
    }
};
exports.StudentSummaryDto = StudentSummaryDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], StudentSummaryDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student first name',
        example: 'John',
        maxLength: 100,
    }),
    __metadata("design:type", String)
], StudentSummaryDto.prototype, "firstName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student last name',
        example: 'Doe',
        maxLength: 100,
    }),
    __metadata("design:type", String)
], StudentSummaryDto.prototype, "lastName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Student full name (computed)',
        example: 'John Doe',
        readOnly: true,
    }),
    __metadata("design:type", String)
], StudentSummaryDto.prototype, "fullName", void 0);
exports.StudentSummaryDto = StudentSummaryDto = __decorate([
    (0, class_transformer_1.Exclude)()
], StudentSummaryDto);
let AllergySummaryDto = class AllergySummaryDto {
    id;
    studentId;
    allergen;
    allergyType;
    severity;
    epiPenRequired;
    isEpiPenExpired;
    verified;
    active;
    createdAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentId: { required: true, type: () => String }, allergen: { required: true, type: () => String }, allergyType: { required: true, enum: require("../../../database/models/allergy.model").AllergyType }, severity: { required: true, enum: require("../../../database/models/allergy.model").AllergySeverity }, epiPenRequired: { required: true, type: () => Boolean }, isEpiPenExpired: { required: false, type: () => Boolean }, verified: { required: true, type: () => Boolean }, active: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date } };
    }
};
exports.AllergySummaryDto = AllergySummaryDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Allergy record unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440001',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], AllergySummaryDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], AllergySummaryDto.prototype, "studentId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Name or description of the allergen',
        example: 'Peanuts',
        maxLength: 255,
    }),
    __metadata("design:type", String)
], AllergySummaryDto.prototype, "allergen", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Category/type of allergy',
        enum: models_1.AllergyType,
        enumName: 'AllergyType',
        example: models_1.AllergyType.FOOD,
    }),
    __metadata("design:type", String)
], AllergySummaryDto.prototype, "allergyType", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Severity level of allergic reaction - CRITICAL FOR EMERGENCY RESPONSE',
        enum: models_1.AllergySeverity,
        enumName: 'AllergySeverity',
        example: models_1.AllergySeverity.LIFE_THREATENING,
    }),
    __metadata("design:type", String)
], AllergySummaryDto.prototype, "severity", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether this allergy requires EpiPen availability - SAFETY CRITICAL',
        example: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], AllergySummaryDto.prototype, "epiPenRequired", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'EpiPen expiration status - SAFETY CRITICAL: True if expired or expiring soon',
        example: false,
        readOnly: true,
    }),
    __metadata("design:type", Boolean)
], AllergySummaryDto.prototype, "isEpiPenExpired", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether allergy has been verified by healthcare provider',
        example: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], AllergySummaryDto.prototype, "verified", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether allergy is currently active/relevant',
        example: true,
        default: true,
    }),
    __metadata("design:type", Boolean)
], AllergySummaryDto.prototype, "active", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when allergy record was created',
        example: '2024-01-15T10:30:00Z',
        type: Date,
    }),
    __metadata("design:type", Date)
], AllergySummaryDto.prototype, "createdAt", void 0);
exports.AllergySummaryDto = AllergySummaryDto = __decorate([
    (0, class_transformer_1.Exclude)()
], AllergySummaryDto);
let AllergyResponseDto = class AllergyResponseDto {
    id;
    studentId;
    allergen;
    allergyType;
    severity;
    symptoms;
    reactions;
    treatment;
    emergencyProtocol;
    onsetDate;
    diagnosedDate;
    diagnosedBy;
    verified;
    verifiedBy;
    verificationDate;
    active;
    notes;
    epiPenRequired;
    epiPenLocation;
    epiPenExpiration;
    isEpiPenExpired;
    daysUntilEpiPenExpiration;
    healthRecordId;
    student;
    createdBy;
    updatedBy;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentId: { required: true, type: () => String }, allergen: { required: true, type: () => String }, allergyType: { required: true, enum: require("../../../database/models/allergy.model").AllergyType }, severity: { required: true, enum: require("../../../database/models/allergy.model").AllergySeverity }, symptoms: { required: false, type: () => String }, reactions: { required: false, type: () => Object }, treatment: { required: false, type: () => String }, emergencyProtocol: { required: false, type: () => String }, onsetDate: { required: false, type: () => Date }, diagnosedDate: { required: false, type: () => Date }, diagnosedBy: { required: false, type: () => String }, verified: { required: true, type: () => Boolean }, verifiedBy: { required: false, type: () => String }, verificationDate: { required: false, type: () => Date }, active: { required: true, type: () => Boolean }, notes: { required: false, type: () => String }, epiPenRequired: { required: true, type: () => Boolean }, epiPenLocation: { required: false, type: () => String }, epiPenExpiration: { required: false, type: () => Date }, isEpiPenExpired: { required: false, type: () => Boolean }, daysUntilEpiPenExpiration: { required: false, type: () => Number, nullable: true }, healthRecordId: { required: false, type: () => String }, student: { required: false, type: () => require("./allergy-response.dto").StudentSummaryDto }, createdBy: { required: false, type: () => String }, updatedBy: { required: false, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.AllergyResponseDto = AllergyResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Allergy record unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440001',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], AllergyResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], AllergyResponseDto.prototype, "studentId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Name or description of the allergen (e.g., specific food, medication, substance)',
        example: 'Peanuts',
        minLength: 1,
        maxLength: 255,
    }),
    __metadata("design:type", String)
], AllergyResponseDto.prototype, "allergen", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Category/type of allergy for classification and filtering',
        enum: models_1.AllergyType,
        enumName: 'AllergyType',
        example: models_1.AllergyType.FOOD,
        type: 'string',
    }),
    __metadata("design:type", String)
], AllergyResponseDto.prototype, "allergyType", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Severity level of allergic reaction - CRITICAL FOR EMERGENCY RESPONSE AND TRIAGE',
        enum: models_1.AllergySeverity,
        enumName: 'AllergySeverity',
        example: models_1.AllergySeverity.LIFE_THREATENING,
        type: 'string',
    }),
    __metadata("design:type", String)
], AllergyResponseDto.prototype, "severity", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Detailed description of symptoms experienced during allergic reaction',
        example: 'Hives, difficulty breathing, swelling of throat and tongue, rapid heartbeat',
        maxLength: 2000,
        nullable: true,
    }),
    __metadata("design:type", String)
], AllergyResponseDto.prototype, "symptoms", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Structured reaction data (JSONB) for complex symptom tracking',
        example: {
            respiratory: ['wheezing', 'difficulty breathing'],
            skin: ['hives', 'rash', 'swelling'],
            cardiovascular: ['rapid heartbeat'],
            gastrointestinal: [],
        },
        type: 'object',
        nullable: true,
    }),
    __metadata("design:type", Object)
], AllergyResponseDto.prototype, "reactions", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Treatment administered or recommended for allergic reactions',
        example: 'Administer EpiPen immediately, follow with antihistamines, call 911',
        maxLength: 2000,
        nullable: true,
    }),
    __metadata("design:type", String)
], AllergyResponseDto.prototype, "treatment", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SAFETY CRITICAL: Step-by-step emergency protocol to follow during severe reaction',
        example: '1. Administer EpiPen to outer thigh\n2. Call 911 immediately\n3. Keep student lying down\n4. Monitor breathing\n5. Administer second EpiPen after 5-15 minutes if no improvement',
        maxLength: 2000,
        nullable: true,
    }),
    __metadata("design:type", String)
], AllergyResponseDto.prototype, "emergencyProtocol", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when allergy symptoms first appeared',
        example: '2020-01-15T00:00:00Z',
        type: Date,
        nullable: true,
    }),
    __metadata("design:type", Date)
], AllergyResponseDto.prototype, "onsetDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when allergy was officially diagnosed by healthcare provider',
        example: '2020-02-01T00:00:00Z',
        type: Date,
        nullable: true,
    }),
    __metadata("design:type", Date)
], AllergyResponseDto.prototype, "diagnosedDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name and credentials of healthcare provider who diagnosed the allergy',
        example: 'Dr. Jane Smith, MD - Allergist',
        maxLength: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], AllergyResponseDto.prototype, "diagnosedBy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether allergy has been verified by qualified healthcare provider - REQUIRED FOR LEGAL COMPLIANCE',
        example: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], AllergyResponseDto.prototype, "verified", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'UUID of healthcare provider who verified the allergy',
        example: '550e8400-e29b-41d4-a716-446655440002',
        format: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], AllergyResponseDto.prototype, "verifiedBy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Timestamp when allergy was verified - AUTO-SET when verified=true',
        example: '2024-01-15T14:30:00Z',
        type: Date,
        nullable: true,
        readOnly: true,
    }),
    __metadata("design:type", Date)
], AllergyResponseDto.prototype, "verificationDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether allergy is currently active/relevant (soft delete flag)',
        example: true,
        default: true,
    }),
    __metadata("design:type", Boolean)
], AllergyResponseDto.prototype, "active", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes, observations, or special instructions',
        example: 'Severe reaction to even trace amounts. Must avoid all tree nuts.',
        maxLength: 2000,
        nullable: true,
    }),
    __metadata("design:type", String)
], AllergyResponseDto.prototype, "notes", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'SAFETY CRITICAL: Whether this allergy requires EpiPen availability at all times',
        example: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], AllergyResponseDto.prototype, "epiPenRequired", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SAFETY CRITICAL: Physical location where EpiPen is stored (required if epiPenRequired=true)',
        example: 'Main Nurse Office, First Aid Kit #3, Shelf B',
        maxLength: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], AllergyResponseDto.prototype, "epiPenLocation", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SAFETY CRITICAL: EpiPen expiration date - MUST BE MONITORED REGULARLY',
        example: '2025-12-31T23:59:59Z',
        type: Date,
        nullable: true,
    }),
    __metadata("design:type", Date)
], AllergyResponseDto.prototype, "epiPenExpiration", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'COMPUTED: Whether EpiPen is expired - SAFETY CRITICAL for emergency readiness',
        example: false,
        readOnly: true,
    }),
    __metadata("design:type", Boolean)
], AllergyResponseDto.prototype, "isEpiPenExpired", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'COMPUTED: Days until EpiPen expiration (negative if expired, null if no EpiPen)',
        example: 90,
        type: 'integer',
        nullable: true,
        readOnly: true,
    }),
    __metadata("design:type", Number)
], AllergyResponseDto.prototype, "daysUntilEpiPenExpiration", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional link to health record ID for integration',
        example: '550e8400-e29b-41d4-a716-446655440003',
        format: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], AllergyResponseDto.prototype, "healthRecordId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Student associated with this allergy',
        type: () => StudentSummaryDto,
        nullable: true,
    }),
    (0, class_transformer_1.Type)(() => StudentSummaryDto),
    __metadata("design:type", StudentSummaryDto)
], AllergyResponseDto.prototype, "student", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'UUID of user who created this allergy record',
        example: '550e8400-e29b-41d4-a716-446655440004',
        format: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], AllergyResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'UUID of user who last updated this allergy record',
        example: '550e8400-e29b-41d4-a716-446655440005',
        format: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], AllergyResponseDto.prototype, "updatedBy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when allergy record was created',
        example: '2024-01-15T10:30:00Z',
        type: Date,
    }),
    __metadata("design:type", Date)
], AllergyResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when allergy record was last updated',
        example: '2024-01-15T14:30:00Z',
        type: Date,
    }),
    __metadata("design:type", Date)
], AllergyResponseDto.prototype, "updatedAt", void 0);
exports.AllergyResponseDto = AllergyResponseDto = __decorate([
    (0, class_transformer_1.Exclude)()
], AllergyResponseDto);
class AllergyListResponseDto extends paginated_response_dto_1.PaginatedResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("./allergy-response.dto").AllergyResponseDto] } };
    }
}
exports.AllergyListResponseDto = AllergyListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of allergy records for the current page',
        type: [AllergyResponseDto],
        isArray: true,
    }),
    (0, class_transformer_1.Type)(() => AllergyResponseDto),
    __metadata("design:type", Array)
], AllergyListResponseDto.prototype, "data", void 0);
class MedicationInteractionDto {
    allergen;
    severity;
    reaction;
    static _OPENAPI_METADATA_FACTORY() {
        return { allergen: { required: true, type: () => String }, severity: { required: true, enum: require("../../../database/models/allergy.model").AllergySeverity }, reaction: { required: false, type: () => String } };
    }
}
exports.MedicationInteractionDto = MedicationInteractionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Allergen name (medication) that causes reaction',
        example: 'Penicillin',
    }),
    __metadata("design:type", String)
], MedicationInteractionDto.prototype, "allergen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Severity level of the medication allergy',
        enum: models_1.AllergySeverity,
        enumName: 'AllergySeverity',
        example: models_1.AllergySeverity.SEVERE,
    }),
    __metadata("design:type", String)
], MedicationInteractionDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Known reaction/symptoms to this medication',
        example: 'Severe rash, anaphylaxis',
        nullable: true,
    }),
    __metadata("design:type", String)
], MedicationInteractionDto.prototype, "reaction", void 0);
class MedicationInteractionResponseDto {
    hasInteractions;
    interactions;
    static _OPENAPI_METADATA_FACTORY() {
        return { hasInteractions: { required: true, type: () => Boolean }, interactions: { required: true, type: () => [require("./allergy-response.dto").MedicationInteractionDto] } };
    }
}
exports.MedicationInteractionResponseDto = MedicationInteractionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'SAFETY CRITICAL: Whether any medication allergies were found for this medication',
        example: true,
    }),
    __metadata("design:type", Boolean)
], MedicationInteractionResponseDto.prototype, "hasInteractions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of medication allergies that conflict with the queried medication',
        type: [MedicationInteractionDto],
        isArray: true,
        example: [
            {
                allergen: 'Penicillin',
                severity: models_1.AllergySeverity.SEVERE,
                reaction: 'Severe rash, anaphylaxis',
            },
        ],
    }),
    (0, class_transformer_1.Type)(() => MedicationInteractionDto),
    __metadata("design:type", Array)
], MedicationInteractionResponseDto.prototype, "interactions", void 0);
function mapToAllergySummaryDto(allergy) {
    const dto = new AllergySummaryDto();
    dto.id = allergy.id;
    dto.studentId = allergy.studentId;
    dto.allergen = allergy.allergen;
    dto.allergyType = allergy.allergyType;
    dto.severity = allergy.severity;
    dto.epiPenRequired = allergy.epiPenRequired;
    dto.isEpiPenExpired = allergy.isEpiPenExpired();
    dto.verified = allergy.verified;
    dto.active = allergy.active;
    dto.createdAt = allergy.createdAt;
    return dto;
}
function mapToAllergyResponseDto(allergy) {
    const dto = new AllergyResponseDto();
    dto.id = allergy.id;
    dto.studentId = allergy.studentId;
    dto.allergen = allergy.allergen;
    dto.allergyType = allergy.allergyType;
    dto.severity = allergy.severity;
    dto.symptoms = allergy.symptoms;
    dto.reactions = allergy.reactions;
    dto.treatment = allergy.treatment;
    dto.emergencyProtocol = allergy.emergencyProtocol;
    dto.onsetDate = allergy.onsetDate;
    dto.diagnosedDate = allergy.diagnosedDate;
    dto.diagnosedBy = allergy.diagnosedBy;
    dto.verified = allergy.verified;
    dto.verifiedBy = allergy.verifiedBy;
    dto.verificationDate = allergy.verificationDate;
    dto.active = allergy.active;
    dto.notes = allergy.notes;
    dto.epiPenRequired = allergy.epiPenRequired;
    dto.epiPenLocation = allergy.epiPenLocation;
    dto.epiPenExpiration = allergy.epiPenExpiration;
    dto.isEpiPenExpired = allergy.isEpiPenExpired();
    dto.daysUntilEpiPenExpiration = allergy.getDaysUntilEpiPenExpiration();
    dto.healthRecordId = allergy.healthRecordId;
    if (allergy.student) {
        dto.student = {
            id: allergy.student.id,
            firstName: allergy.student.firstName,
            lastName: allergy.student.lastName,
            fullName: `${allergy.student.firstName} ${allergy.student.lastName}`,
        };
    }
    dto.createdBy = allergy.createdBy;
    dto.updatedBy = allergy.updatedBy;
    dto.createdAt = allergy.createdAt;
    dto.updatedAt = allergy.updatedAt;
    return dto;
}
function mapToAllergySummaryDtoArray(allergies) {
    return allergies.map(mapToAllergySummaryDto);
}
function mapToAllergyResponseDtoArray(allergies) {
    return allergies.map(mapToAllergyResponseDto);
}
//# sourceMappingURL=allergy-response.dto.js.map