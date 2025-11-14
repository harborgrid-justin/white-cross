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
exports.MedicationLogListResponseDto = exports.MedicationListResponseDto = exports.DrugInteractionResponseDto = exports.MedicationLogResponseDto = exports.MedicationSummaryDto = exports.MedicationResponseDto = exports.MedicationLogStatus = exports.DEASchedule = void 0;
exports.toMedicationResponseDto = toMedicationResponseDto;
exports.toMedicationSummaryDto = toMedicationSummaryDto;
exports.toMedicationLogResponseDto = toMedicationLogResponseDto;
exports.toMedicationListResponseDto = toMedicationListResponseDto;
exports.toMedicationLogListResponseDto = toMedicationLogListResponseDto;
exports.createDrugInteractionDto = createDrugInteractionDto;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const paginated_response_dto_1 = require("../../../common/dto/paginated-response.dto");
var DEASchedule;
(function (DEASchedule) {
    DEASchedule["SCHEDULE_I"] = "I";
    DEASchedule["SCHEDULE_II"] = "II";
    DEASchedule["SCHEDULE_III"] = "III";
    DEASchedule["SCHEDULE_IV"] = "IV";
    DEASchedule["SCHEDULE_V"] = "V";
})(DEASchedule || (exports.DEASchedule = DEASchedule = {}));
var MedicationLogStatus;
(function (MedicationLogStatus) {
    MedicationLogStatus["PENDING"] = "PENDING";
    MedicationLogStatus["ADMINISTERED"] = "ADMINISTERED";
    MedicationLogStatus["MISSED"] = "MISSED";
    MedicationLogStatus["CANCELLED"] = "CANCELLED";
    MedicationLogStatus["REFUSED"] = "REFUSED";
})(MedicationLogStatus || (exports.MedicationLogStatus = MedicationLogStatus = {}));
let MedicationResponseDto = class MedicationResponseDto {
    id;
    name;
    genericName;
    dosageForm;
    strength;
    manufacturer;
    ndc;
    isControlled;
    deaSchedule;
    requiresWitness;
    isActive;
    createdAt;
    updatedAt;
    deletedAt;
    deletedBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, genericName: { required: false, type: () => String }, dosageForm: { required: true, type: () => String }, strength: { required: true, type: () => String }, manufacturer: { required: false, type: () => String }, ndc: { required: false, type: () => String }, isControlled: { required: true, type: () => Boolean }, deaSchedule: { required: false, enum: require("./medication-response.dto").DEASchedule }, requiresWitness: { required: true, type: () => Boolean }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, deletedAt: { required: false, type: () => Date }, deletedBy: { required: false, type: () => String } };
    }
};
exports.MedicationResponseDto = MedicationResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Unique medication identifier (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], MedicationResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Brand or trade name of the medication',
        example: 'Tylenol Extra Strength',
        minLength: 1,
        maxLength: 255,
    }),
    __metadata("design:type", String)
], MedicationResponseDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Generic (chemical) name of the medication',
        example: 'Acetaminophen',
        maxLength: 255,
    }),
    __metadata("design:type", String)
], MedicationResponseDto.prototype, "genericName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Physical form of the medication (tablet, capsule, liquid, injection, etc.)',
        example: 'Tablet',
        examples: [
            'Tablet',
            'Capsule',
            'Liquid',
            'Solution',
            'Suspension',
            'Injection',
            'Cream',
            'Ointment',
            'Patch',
            'Inhaler',
            'Suppository',
        ],
        maxLength: 255,
    }),
    __metadata("design:type", String)
], MedicationResponseDto.prototype, "dosageForm", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Strength/concentration of the active ingredient with units',
        example: '500mg',
        examples: ['500mg', '10mg/5mL', '0.5%', '100mcg', '20mg/mL'],
        maxLength: 255,
    }),
    __metadata("design:type", String)
], MedicationResponseDto.prototype, "strength", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Pharmaceutical manufacturer or distributor name',
        example: 'Johnson & Johnson',
        maxLength: 255,
    }),
    __metadata("design:type", String)
], MedicationResponseDto.prototype, "manufacturer", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'National Drug Code (NDC) - FDA-assigned product identifier',
        example: '00406-0486-01',
        pattern: '^(\\d{4}-\\d{4}-\\d{2}|\\d{5}-\\d{3}-\\d{2}|\\d{5}-\\d{4}-\\d{1}|\\d{10}|\\d{11})$',
        examples: [
            '1234-5678-90',
            '12345-678-90',
            '12345-6789-0',
            '1234567890',
            '12345678901',
        ],
        maxLength: 14,
    }),
    __metadata("design:type", String)
], MedicationResponseDto.prototype, "ndc", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether this medication is a DEA-controlled substance requiring special handling',
        example: false,
        default: false,
    }),
    __metadata("design:type", Boolean)
], MedicationResponseDto.prototype, "isControlled", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'DEA controlled substance schedule classification (I-V). Required if isControlled is true.',
        enum: DEASchedule,
        enumName: 'DEASchedule',
        example: 'II',
        examples: ['II', 'III', 'IV', 'V'],
    }),
    __metadata("design:type", String)
], MedicationResponseDto.prototype, "deaSchedule", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether administration requires witness verification (typically Schedule II-III controlled substances)',
        example: false,
        default: false,
    }),
    __metadata("design:type", Boolean)
], MedicationResponseDto.prototype, "requiresWitness", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether this medication is currently active in the formulary',
        example: true,
        default: true,
    }),
    __metadata("design:type", Boolean)
], MedicationResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when the medication record was created',
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], MedicationResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when the medication record was last updated',
        type: 'string',
        format: 'date-time',
        example: '2025-01-20T14:45:00Z',
    }),
    __metadata("design:type", Date)
], MedicationResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Timestamp when the medication was soft-deleted (null if active)',
        type: 'string',
        format: 'date-time',
        example: '2025-02-01T09:00:00Z',
        nullable: true,
    }),
    __metadata("design:type", Date)
], MedicationResponseDto.prototype, "deletedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User ID who deleted the medication record',
        format: 'uuid',
        example: '987e6543-e21b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], MedicationResponseDto.prototype, "deletedBy", void 0);
exports.MedicationResponseDto = MedicationResponseDto = __decorate([
    (0, class_transformer_1.Exclude)()
], MedicationResponseDto);
let MedicationSummaryDto = class MedicationSummaryDto {
    id;
    name;
    genericName;
    strength;
    dosageForm;
    isControlled;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, genericName: { required: false, type: () => String }, strength: { required: true, type: () => String }, dosageForm: { required: true, type: () => String }, isControlled: { required: true, type: () => Boolean }, isActive: { required: true, type: () => Boolean } };
    }
};
exports.MedicationSummaryDto = MedicationSummaryDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Unique medication identifier (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], MedicationSummaryDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Brand or trade name of the medication',
        example: 'Tylenol Extra Strength',
    }),
    __metadata("design:type", String)
], MedicationSummaryDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Generic (chemical) name of the medication',
        example: 'Acetaminophen',
    }),
    __metadata("design:type", String)
], MedicationSummaryDto.prototype, "genericName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Strength/concentration with units',
        example: '500mg',
    }),
    __metadata("design:type", String)
], MedicationSummaryDto.prototype, "strength", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Physical form of the medication',
        example: 'Tablet',
    }),
    __metadata("design:type", String)
], MedicationSummaryDto.prototype, "dosageForm", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether this is a controlled substance',
        example: false,
    }),
    __metadata("design:type", Boolean)
], MedicationSummaryDto.prototype, "isControlled", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether this medication is currently active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], MedicationSummaryDto.prototype, "isActive", void 0);
exports.MedicationSummaryDto = MedicationSummaryDto = __decorate([
    (0, class_transformer_1.Exclude)()
], MedicationSummaryDto);
let MedicationLogResponseDto = class MedicationLogResponseDto {
    id;
    studentId;
    medicationId;
    medication;
    dosage;
    dosageUnit;
    route;
    scheduledAt;
    administeredAt;
    administeredBy;
    status;
    notes;
    reasonNotGiven;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentId: { required: true, type: () => String }, medicationId: { required: true, type: () => String }, medication: { required: false, type: () => require("./medication-response.dto").MedicationSummaryDto }, dosage: { required: true, type: () => Number }, dosageUnit: { required: true, type: () => String }, route: { required: true, type: () => String }, scheduledAt: { required: false, type: () => Date }, administeredAt: { required: true, type: () => Date }, administeredBy: { required: true, type: () => String }, status: { required: true, enum: require("./medication-response.dto").MedicationLogStatus }, notes: { required: false, type: () => String }, reasonNotGiven: { required: false, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.MedicationLogResponseDto = MedicationLogResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Unique medication log entry identifier (UUID)',
        example: '456e7890-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], MedicationLogResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student/patient identifier (UUID)',
        example: '789e0123-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], MedicationLogResponseDto.prototype, "studentId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Medication identifier (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], MedicationLogResponseDto.prototype, "medicationId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Medication details (included when populated)',
        type: () => MedicationSummaryDto,
    }),
    (0, class_transformer_1.Type)(() => MedicationSummaryDto),
    __metadata("design:type", MedicationSummaryDto)
], MedicationLogResponseDto.prototype, "medication", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Dosage amount (numeric value)',
        example: 2,
        type: 'number',
        format: 'decimal',
    }),
    __metadata("design:type", Number)
], MedicationLogResponseDto.prototype, "dosage", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Unit of measurement for dosage',
        example: 'tablets',
        examples: ['tablets', 'capsules', 'mL', 'mg', 'puffs', 'drops', 'grams'],
    }),
    __metadata("design:type", String)
], MedicationLogResponseDto.prototype, "dosageUnit", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Route of administration',
        example: 'Oral',
        examples: [
            'Oral',
            'Sublingual',
            'Inhalation',
            'Topical',
            'Intravenous (IV)',
            'Intramuscular (IM)',
            'Subcutaneous (SubQ)',
            'Rectal',
            'Ophthalmic',
            'Otic',
            'Nasal',
            'Transdermal',
        ],
    }),
    __metadata("design:type", String)
], MedicationLogResponseDto.prototype, "route", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Scheduled time for administration (null if PRN/as-needed)',
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:00:00Z',
        nullable: true,
    }),
    __metadata("design:type", Date)
], MedicationLogResponseDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Actual time medication was administered (or action was taken)',
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:05:00Z',
    }),
    __metadata("design:type", Date)
], MedicationLogResponseDto.prototype, "administeredAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'User ID of the staff member who administered or documented the medication',
        example: '321e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], MedicationLogResponseDto.prototype, "administeredBy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Status of the medication administration event',
        enum: MedicationLogStatus,
        enumName: 'MedicationLogStatus',
        example: 'ADMINISTERED',
        default: 'ADMINISTERED',
    }),
    __metadata("design:type", String)
], MedicationLogResponseDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Clinical notes about administration, patient response, or observations',
        example: 'Patient tolerated medication well. No adverse effects observed.',
    }),
    __metadata("design:type", String)
], MedicationLogResponseDto.prototype, "notes", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason medication was not administered (required for MISSED, CANCELLED, or REFUSED status)',
        example: 'Patient refused due to nausea',
        examples: [
            'Patient refused',
            'Patient absent from school',
            'Contraindicated due to symptoms',
            'Medication unavailable',
            'Parent/guardian requested hold',
            'Physician order discontinued',
        ],
    }),
    __metadata("design:type", String)
], MedicationLogResponseDto.prototype, "reasonNotGiven", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when the log entry was created',
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:05:30Z',
    }),
    __metadata("design:type", Date)
], MedicationLogResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when the log entry was last updated',
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:05:30Z',
    }),
    __metadata("design:type", Date)
], MedicationLogResponseDto.prototype, "updatedAt", void 0);
exports.MedicationLogResponseDto = MedicationLogResponseDto = __decorate([
    (0, class_transformer_1.Exclude)()
], MedicationLogResponseDto);
let DrugInteractionResponseDto = class DrugInteractionResponseDto {
    medication1Id;
    medication1Name;
    medication2Id;
    medication2Name;
    severity;
    description;
    clinicalEffect;
    recommendation;
    evidenceLevel;
    references;
    static _OPENAPI_METADATA_FACTORY() {
        return { medication1Id: { required: true, type: () => String }, medication1Name: { required: true, type: () => String }, medication2Id: { required: true, type: () => String }, medication2Name: { required: true, type: () => String }, severity: { required: true, type: () => Object }, description: { required: true, type: () => String }, clinicalEffect: { required: false, type: () => String }, recommendation: { required: false, type: () => String }, evidenceLevel: { required: false, type: () => Object }, references: { required: false, type: () => [String] } };
    }
};
exports.DrugInteractionResponseDto = DrugInteractionResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'First medication identifier (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], DrugInteractionResponseDto.prototype, "medication1Id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Name of the first medication',
        example: 'Warfarin',
    }),
    __metadata("design:type", String)
], DrugInteractionResponseDto.prototype, "medication1Name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Second medication identifier (UUID)',
        example: '456e7890-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], DrugInteractionResponseDto.prototype, "medication2Id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Name of the second medication',
        example: 'Aspirin',
    }),
    __metadata("design:type", String)
], DrugInteractionResponseDto.prototype, "medication2Name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Clinical severity of the interaction',
        enum: ['MAJOR', 'MODERATE', 'MINOR'],
        example: 'MAJOR',
        examples: ['MAJOR', 'MODERATE', 'MINOR'],
    }),
    __metadata("design:type", String)
], DrugInteractionResponseDto.prototype, "severity", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Brief description of the interaction mechanism',
        example: 'Concurrent use increases risk of bleeding',
    }),
    __metadata("design:type", String)
], DrugInteractionResponseDto.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Detailed clinical effects and patient impact',
        example: 'Enhanced anticoagulant effect may lead to serious bleeding complications including GI bleeding, intracranial hemorrhage, and hematuria.',
    }),
    __metadata("design:type", String)
], DrugInteractionResponseDto.prototype, "clinicalEffect", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Clinical recommendations for managing the interaction',
        example: 'Monitor INR closely if concurrent use is necessary. Consider alternative antiplatelet therapy. Educate patient on bleeding precautions.',
    }),
    __metadata("design:type", String)
], DrugInteractionResponseDto.prototype, "recommendation", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Evidence level or documentation status',
        enum: ['ESTABLISHED', 'PROBABLE', 'THEORETICAL'],
        example: 'ESTABLISHED',
    }),
    __metadata("design:type", String)
], DrugInteractionResponseDto.prototype, "evidenceLevel", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'References to clinical literature or drug interaction databases',
        type: [String],
        example: ['Micromedex Drug Interactions', 'Lexicomp Interaction Monograph'],
    }),
    __metadata("design:type", Array)
], DrugInteractionResponseDto.prototype, "references", void 0);
exports.DrugInteractionResponseDto = DrugInteractionResponseDto = __decorate([
    (0, class_transformer_1.Exclude)()
], DrugInteractionResponseDto);
class MedicationListResponseDto extends paginated_response_dto_1.PaginatedResponseDto {
    data;
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("./medication-response.dto").MedicationResponseDto] } };
    }
}
exports.MedicationListResponseDto = MedicationListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of medication records for the current page',
        type: [MedicationResponseDto],
        isArray: true,
    }),
    (0, class_transformer_1.Type)(() => MedicationResponseDto),
    __metadata("design:type", Array)
], MedicationListResponseDto.prototype, "data", void 0);
class MedicationLogListResponseDto extends paginated_response_dto_1.PaginatedResponseDto {
    data;
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("./medication-response.dto").MedicationLogResponseDto] } };
    }
}
exports.MedicationLogListResponseDto = MedicationLogListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of medication log entries for the current page',
        type: [MedicationLogResponseDto],
        isArray: true,
    }),
    (0, class_transformer_1.Type)(() => MedicationLogResponseDto),
    __metadata("design:type", Array)
], MedicationLogListResponseDto.prototype, "data", void 0);
function toMedicationResponseDto(medication) {
    return {
        id: medication.id,
        name: medication.name,
        genericName: medication.genericName,
        dosageForm: medication.dosageForm,
        strength: medication.strength,
        manufacturer: medication.manufacturer,
        ndc: medication.ndc,
        isControlled: medication.isControlled,
        deaSchedule: medication.deaSchedule,
        requiresWitness: medication.requiresWitness,
        isActive: medication.isActive,
        createdAt: medication.createdAt,
        updatedAt: medication.updatedAt,
        deletedAt: medication.deletedAt,
        deletedBy: medication.deletedBy,
    };
}
function toMedicationSummaryDto(medication) {
    return {
        id: medication.id,
        name: medication.name,
        genericName: medication.genericName,
        strength: medication.strength,
        dosageForm: medication.dosageForm,
        isControlled: medication.isControlled,
        isActive: medication.isActive,
    };
}
function toMedicationLogResponseDto(log) {
    return {
        id: log.id,
        studentId: log.studentId,
        medicationId: log.medicationId,
        medication: log.medication ? toMedicationSummaryDto(log.medication) : undefined,
        dosage: log.dosage,
        dosageUnit: log.dosageUnit,
        route: log.route,
        scheduledAt: log.scheduledAt,
        administeredAt: log.administeredAt,
        administeredBy: log.administeredBy,
        status: log.status,
        notes: log.notes,
        reasonNotGiven: log.reasonNotGiven,
        createdAt: log.createdAt,
        updatedAt: log.updatedAt,
    };
}
function toMedicationListResponseDto(medications, page, limit, total) {
    return paginated_response_dto_1.PaginatedResponseDto.create({
        data: medications.map(toMedicationResponseDto),
        page,
        limit,
        total,
    });
}
function toMedicationLogListResponseDto(logs, page, limit, total) {
    return paginated_response_dto_1.PaginatedResponseDto.create({
        data: logs.map(toMedicationLogResponseDto),
        page,
        limit,
        total,
    });
}
function createDrugInteractionDto(params) {
    return {
        medication1Id: params.medication1.id,
        medication1Name: params.medication1.name,
        medication2Id: params.medication2.id,
        medication2Name: params.medication2.name,
        severity: params.severity,
        description: params.description,
        clinicalEffect: params.clinicalEffect,
        recommendation: params.recommendation,
        evidenceLevel: params.evidenceLevel,
        references: params.references,
    };
}
//# sourceMappingURL=medication-response.dto.js.map