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
exports.PrescriptionListResponseDto = exports.PrescriptionSummaryDto = exports.PrescriptionResponseDto = exports.ClinicalNoteResponseDto = exports.VitalSignsResponseDto = void 0;
exports.mapPrescriptionToResponseDto = mapPrescriptionToResponseDto;
exports.mapPrescriptionToSummaryDto = mapPrescriptionToSummaryDto;
exports.mapVitalSignsToResponseDto = mapVitalSignsToResponseDto;
exports.mapClinicalNoteToResponseDto = mapClinicalNoteToResponseDto;
exports.mapPrescriptionsToListResponse = mapPrescriptionsToListResponse;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const prescription_status_enum_1 = require("../enums/prescription-status.enum");
const note_type_enum_1 = require("../enums/note-type.enum");
const paginated_response_dto_1 = require("../../../common/dto/paginated-response.dto");
let VitalSignsResponseDto = class VitalSignsResponseDto {
    id;
    studentId;
    measurementDate;
    temperature;
    temperatureUnit;
    heartRate;
    respiratoryRate;
    bloodPressureSystolic;
    bloodPressureDiastolic;
    oxygenSaturation;
    weight;
    weightUnit;
    height;
    heightUnit;
    bmi;
    pain;
    isAbnormal;
    abnormalFlags;
    measuredBy;
    notes;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentId: { required: true, type: () => String }, measurementDate: { required: true, type: () => Date }, temperature: { required: false, type: () => Number }, temperatureUnit: { required: false, type: () => String }, heartRate: { required: false, type: () => Number }, respiratoryRate: { required: false, type: () => Number }, bloodPressureSystolic: { required: false, type: () => Number }, bloodPressureDiastolic: { required: false, type: () => Number }, oxygenSaturation: { required: false, type: () => Number }, weight: { required: false, type: () => Number }, weightUnit: { required: false, type: () => String }, height: { required: false, type: () => Number }, heightUnit: { required: false, type: () => String }, bmi: { required: false, type: () => Number }, pain: { required: false, type: () => Number }, isAbnormal: { required: true, type: () => Boolean }, abnormalFlags: { required: false, type: () => [String] }, measuredBy: { required: false, type: () => String }, notes: { required: false, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.VitalSignsResponseDto = VitalSignsResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the vital signs record',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], VitalSignsResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student ID this vital signs record belongs to',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], VitalSignsResponseDto.prototype, "studentId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Date and time when vital signs were measured',
        example: '2025-11-14T10:30:00Z',
        type: Date,
    }),
    __metadata("design:type", Date)
], VitalSignsResponseDto.prototype, "measurementDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Body temperature reading',
        example: 98.6,
        minimum: 90,
        maximum: 110,
        type: Number,
    }),
    __metadata("design:type", Number)
], VitalSignsResponseDto.prototype, "temperature", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Temperature unit of measurement',
        example: 'F',
        enum: ['F', 'C'],
        default: 'F',
    }),
    __metadata("design:type", String)
], VitalSignsResponseDto.prototype, "temperatureUnit", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Heart rate in beats per minute (bpm)',
        example: 72,
        minimum: 30,
        maximum: 220,
        type: Number,
    }),
    __metadata("design:type", Number)
], VitalSignsResponseDto.prototype, "heartRate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Respiratory rate in breaths per minute',
        example: 16,
        minimum: 8,
        maximum: 60,
        type: Number,
    }),
    __metadata("design:type", Number)
], VitalSignsResponseDto.prototype, "respiratoryRate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Systolic blood pressure in mmHg (upper number)',
        example: 120,
        minimum: 60,
        maximum: 250,
        type: Number,
    }),
    __metadata("design:type", Number)
], VitalSignsResponseDto.prototype, "bloodPressureSystolic", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Diastolic blood pressure in mmHg (lower number)',
        example: 80,
        minimum: 40,
        maximum: 150,
        type: Number,
    }),
    __metadata("design:type", Number)
], VitalSignsResponseDto.prototype, "bloodPressureDiastolic", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Oxygen saturation percentage (SpO2)',
        example: 98,
        minimum: 70,
        maximum: 100,
        type: Number,
    }),
    __metadata("design:type", Number)
], VitalSignsResponseDto.prototype, "oxygenSaturation", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Body weight measurement',
        example: 150,
        type: Number,
    }),
    __metadata("design:type", Number)
], VitalSignsResponseDto.prototype, "weight", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Weight unit of measurement',
        example: 'lbs',
        enum: ['lbs', 'kg'],
        default: 'lbs',
    }),
    __metadata("design:type", String)
], VitalSignsResponseDto.prototype, "weightUnit", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Height measurement',
        example: 68,
        type: Number,
    }),
    __metadata("design:type", Number)
], VitalSignsResponseDto.prototype, "height", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Height unit of measurement',
        example: 'inches',
        enum: ['inches', 'cm'],
        default: 'inches',
    }),
    __metadata("design:type", String)
], VitalSignsResponseDto.prototype, "heightUnit", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Body Mass Index (BMI) - automatically calculated from height and weight',
        example: 22.8,
        type: Number,
    }),
    __metadata("design:type", Number)
], VitalSignsResponseDto.prototype, "bmi", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Pain level on 0-10 scale (0 = no pain, 10 = worst pain)',
        example: 3,
        minimum: 0,
        maximum: 10,
        type: Number,
    }),
    __metadata("design:type", Number)
], VitalSignsResponseDto.prototype, "pain", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if any vital signs are outside normal ranges',
        example: false,
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], VitalSignsResponseDto.prototype, "isAbnormal", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Array of specific vital signs that are abnormal',
        example: ['temperature', 'heartRate'],
        type: [String],
        isArray: true,
    }),
    __metadata("design:type", Array)
], VitalSignsResponseDto.prototype, "abnormalFlags", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name or ID of staff member who measured the vital signs',
        example: 'Nurse Jane Smith',
    }),
    __metadata("design:type", String)
], VitalSignsResponseDto.prototype, "measuredBy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional clinical notes or observations',
        example: 'Patient appeared alert and oriented x3',
    }),
    __metadata("design:type", String)
], VitalSignsResponseDto.prototype, "notes", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when record was created',
        example: '2025-11-14T10:30:00Z',
        type: Date,
    }),
    __metadata("design:type", Date)
], VitalSignsResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when record was last updated',
        example: '2025-11-14T10:30:00Z',
        type: Date,
    }),
    __metadata("design:type", Date)
], VitalSignsResponseDto.prototype, "updatedAt", void 0);
exports.VitalSignsResponseDto = VitalSignsResponseDto = __decorate([
    (0, class_transformer_1.Exclude)()
], VitalSignsResponseDto);
let ClinicalNoteResponseDto = class ClinicalNoteResponseDto {
    id;
    studentId;
    visitId;
    type;
    createdBy;
    title;
    content;
    subjective;
    objective;
    assessment;
    plan;
    tags;
    isConfidential;
    isSigned;
    signedAt;
    amended;
    amendmentReason;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentId: { required: true, type: () => String }, visitId: { required: false, type: () => String }, type: { required: true, enum: require("../enums/note-type.enum").NoteType }, createdBy: { required: true, type: () => String }, title: { required: true, type: () => String }, content: { required: true, type: () => String }, subjective: { required: false, type: () => String }, objective: { required: false, type: () => String }, assessment: { required: false, type: () => String }, plan: { required: false, type: () => String }, tags: { required: false, type: () => [String] }, isConfidential: { required: true, type: () => Boolean }, isSigned: { required: true, type: () => Boolean }, signedAt: { required: false, type: () => Date }, amended: { required: true, type: () => Boolean }, amendmentReason: { required: false, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.ClinicalNoteResponseDto = ClinicalNoteResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the clinical note',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student ID this clinical note belongs to',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "studentId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Associated clinic visit ID',
        example: '789e0123-e45b-67c8-d901-234567890abc',
        format: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "visitId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Type of clinical note',
        example: note_type_enum_1.NoteType.SOAP,
        enum: note_type_enum_1.NoteType,
    }),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'User ID of the note author (provider/nurse)',
        example: '456e7890-a12b-34c5-d678-901234567def',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Note title/subject line',
        example: 'Follow-up Visit - Headache Management',
    }),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "title", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Main note content/body',
        example: 'Patient presents for follow-up visit regarding ongoing headaches...',
    }),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "content", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Subjective component of SOAP note - patient\'s reported symptoms and concerns',
        example: 'Patient complains of persistent headaches for the past 3 days, worse in the morning',
        nullable: true,
    }),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "subjective", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Objective component of SOAP note - observable/measurable findings',
        example: 'Vital signs: T 98.6F, BP 120/80, HR 72, RR 16. Patient alert and oriented x3',
        nullable: true,
    }),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "objective", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Assessment component of SOAP note - clinical diagnosis/impression',
        example: 'Tension headache, likely stress-related. No signs of migraine or neurological deficit',
        nullable: true,
    }),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "assessment", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Plan component of SOAP note - treatment plan and follow-up',
        example: 'OTC ibuprofen 400mg q6h PRN. Encourage stress management. Follow up in 1 week if not improved',
        nullable: true,
    }),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "plan", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Categorical tags for note organization and filtering',
        example: ['headache', 'follow-up', 'medication'],
        type: [String],
        isArray: true,
        nullable: true,
    }),
    __metadata("design:type", Array)
], ClinicalNoteResponseDto.prototype, "tags", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if note contains sensitive/confidential information requiring restricted access',
        example: false,
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], ClinicalNoteResponseDto.prototype, "isConfidential", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if note has been digitally signed by the author',
        example: true,
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], ClinicalNoteResponseDto.prototype, "isSigned", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Timestamp when note was digitally signed',
        example: '2025-11-14T15:00:00Z',
        type: Date,
        nullable: true,
    }),
    __metadata("design:type", Date)
], ClinicalNoteResponseDto.prototype, "signedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if note has been amended after initial signing',
        example: false,
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], ClinicalNoteResponseDto.prototype, "amended", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason/justification for amendment (required when amended=true)',
        example: 'Added clarification regarding medication dosage',
        nullable: true,
    }),
    __metadata("design:type", String)
], ClinicalNoteResponseDto.prototype, "amendmentReason", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when note was created',
        example: '2025-11-14T14:00:00Z',
        type: Date,
    }),
    __metadata("design:type", Date)
], ClinicalNoteResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when note was last updated',
        example: '2025-11-14T14:30:00Z',
        type: Date,
    }),
    __metadata("design:type", Date)
], ClinicalNoteResponseDto.prototype, "updatedAt", void 0);
exports.ClinicalNoteResponseDto = ClinicalNoteResponseDto = __decorate([
    (0, class_transformer_1.Exclude)()
], ClinicalNoteResponseDto);
let PrescriptionResponseDto = class PrescriptionResponseDto {
    id;
    studentId;
    visitId;
    treatmentPlanId;
    prescribedBy;
    drugName;
    drugCode;
    dosage;
    frequency;
    route;
    quantity;
    quantityFilled;
    refillsAuthorized;
    refillsUsed;
    startDate;
    endDate;
    instructions;
    status;
    pharmacyName;
    filledDate;
    pickedUpDate;
    notes;
    createdAt;
    updatedAt;
    isActive;
    hasRefillsRemaining;
    remainingRefills;
    daysSupply;
    student;
    visit;
    treatmentPlan;
    prescriber;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentId: { required: true, type: () => String }, visitId: { required: false, type: () => String }, treatmentPlanId: { required: false, type: () => String }, prescribedBy: { required: true, type: () => String }, drugName: { required: true, type: () => String }, drugCode: { required: false, type: () => String }, dosage: { required: true, type: () => String }, frequency: { required: true, type: () => String }, route: { required: true, type: () => String }, quantity: { required: true, type: () => Number }, quantityFilled: { required: true, type: () => Number }, refillsAuthorized: { required: true, type: () => Number }, refillsUsed: { required: true, type: () => Number }, startDate: { required: true, type: () => Date }, endDate: { required: false, type: () => Date }, instructions: { required: false, type: () => String }, status: { required: true, enum: require("../enums/prescription-status.enum").PrescriptionStatus }, pharmacyName: { required: false, type: () => String }, filledDate: { required: false, type: () => Date }, pickedUpDate: { required: false, type: () => Date }, notes: { required: false, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, isActive: { required: true, type: () => Boolean }, hasRefillsRemaining: { required: true, type: () => Boolean }, remainingRefills: { required: true, type: () => Number }, daysSupply: { required: false, type: () => Number, nullable: true }, student: { required: false, type: () => Object }, visit: { required: false, type: () => Object }, treatmentPlan: { required: false, type: () => Object }, prescriber: { required: false, type: () => Object } };
    }
};
exports.PrescriptionResponseDto = PrescriptionResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the prescription',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student ID (patient) this prescription is for',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "studentId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Associated clinic visit ID where prescription was written',
        example: '789e0123-e45b-67c8-d901-234567890abc',
        format: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "visitId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Associated treatment plan ID if part of ongoing treatment',
        example: '012e3456-f78g-90h1-i234-567890123jkl',
        format: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "treatmentPlanId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'User ID of the prescribing provider (physician, NP, PA)',
        example: '456e7890-a12b-34c5-d678-901234567def',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "prescribedBy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Generic or brand name of the medication',
        example: 'Amoxicillin',
    }),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "drugName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'National Drug Code (NDC) in format XXXXX-XXXX-XX or XXXX-XXXX-XX. FDA identifier for specific drug product.',
        example: '00093-4155-73',
        pattern: '^\\d{4,5}-\\d{4}-\\d{1,2}$',
        nullable: true,
    }),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "drugCode", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Dosage strength and form (e.g., 500mg, 10mg/5mL, 0.5mg)',
        example: '500mg',
    }),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "dosage", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Frequency of administration using medical abbreviations or plain language',
        example: 'TID (three times daily)',
    }),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "frequency", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Route of administration - how the medication is given to the patient',
        example: 'oral',
        enum: [
            'oral',
            'topical',
            'sublingual',
            'injection',
            'IM',
            'IV',
            'SC',
            'inhalation',
            'ophthalmic',
            'otic',
            'rectal',
            'transdermal',
            'nasal',
            'vaginal',
        ],
    }),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "route", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Total quantity of medication units prescribed (tablets, mL, etc.)',
        example: 30,
        minimum: 1,
        type: Number,
    }),
    __metadata("design:type", Number)
], PrescriptionResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Actual quantity dispensed by pharmacy (may differ from quantity for partial fills)',
        example: 30,
        minimum: 0,
        type: Number,
    }),
    __metadata("design:type", Number)
], PrescriptionResponseDto.prototype, "quantityFilled", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Number of refills authorized by prescriber (0 = no refills)',
        example: 2,
        minimum: 0,
        type: Number,
    }),
    __metadata("design:type", Number)
], PrescriptionResponseDto.prototype, "refillsAuthorized", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Number of refills already used/filled',
        example: 0,
        minimum: 0,
        type: Number,
    }),
    __metadata("design:type", Number)
], PrescriptionResponseDto.prototype, "refillsUsed", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Date when prescription becomes valid/active (YYYY-MM-DD)',
        example: '2025-11-14',
        type: Date,
    }),
    __metadata("design:type", Date)
], PrescriptionResponseDto.prototype, "startDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when prescription expires or therapy should end (YYYY-MM-DD)',
        example: '2025-11-24',
        type: Date,
        nullable: true,
    }),
    __metadata("design:type", Date)
], PrescriptionResponseDto.prototype, "endDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Special instructions for patient (e.g., "Take with food", "Avoid alcohol")',
        example: 'Take with food to reduce stomach upset. Complete entire course even if feeling better.',
        nullable: true,
    }),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "instructions", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Current status of prescription in the fulfillment workflow',
        example: prescription_status_enum_1.PrescriptionStatus.PICKED_UP,
        enum: prescription_status_enum_1.PrescriptionStatus,
    }),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name and optional location of pharmacy filling the prescription',
        example: 'CVS Pharmacy #1234 - Main Street',
        nullable: true,
    }),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "pharmacyName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date and time when pharmacy filled the prescription',
        example: '2025-11-14T10:00:00Z',
        type: Date,
        nullable: true,
    }),
    __metadata("design:type", Date)
], PrescriptionResponseDto.prototype, "filledDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date and time when patient picked up the medication from pharmacy',
        example: '2025-11-14T15:30:00Z',
        type: Date,
        nullable: true,
    }),
    __metadata("design:type", Date)
], PrescriptionResponseDto.prototype, "pickedUpDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Clinical notes, pharmacy notes, or special handling instructions',
        example: 'Patient allergic to penicillin - verified safe alternative',
        nullable: true,
    }),
    __metadata("design:type", String)
], PrescriptionResponseDto.prototype, "notes", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when prescription was created in system',
        example: '2025-11-14T09:00:00Z',
        type: Date,
    }),
    __metadata("design:type", Date)
], PrescriptionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when prescription was last modified',
        example: '2025-11-14T15:30:00Z',
        type: Date,
    }),
    __metadata("design:type", Date)
], PrescriptionResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if prescription is currently active (FILLED or PICKED_UP status, not expired)',
        example: true,
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], PrescriptionResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if prescription has unused refills remaining',
        example: true,
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], PrescriptionResponseDto.prototype, "hasRefillsRemaining", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Number of refills remaining (refillsAuthorized - refillsUsed)',
        example: 2,
        minimum: 0,
        type: Number,
    }),
    __metadata("design:type", Number)
], PrescriptionResponseDto.prototype, "remainingRefills", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Calculated days supply from start to end date (null if no end date)',
        example: 10,
        minimum: 0,
        type: Number,
        nullable: true,
    }),
    __metadata("design:type", Number)
], PrescriptionResponseDto.prototype, "daysSupply", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Associated student/patient record',
        type: () => Object,
        nullable: true,
    }),
    __metadata("design:type", Object)
], PrescriptionResponseDto.prototype, "student", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Associated clinic visit record',
        type: () => Object,
        nullable: true,
    }),
    __metadata("design:type", Object)
], PrescriptionResponseDto.prototype, "visit", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Associated treatment plan record',
        type: () => Object,
        nullable: true,
    }),
    __metadata("design:type", Object)
], PrescriptionResponseDto.prototype, "treatmentPlan", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Prescriber user record (physician, NP, PA)',
        type: () => Object,
        nullable: true,
    }),
    __metadata("design:type", Object)
], PrescriptionResponseDto.prototype, "prescriber", void 0);
exports.PrescriptionResponseDto = PrescriptionResponseDto = __decorate([
    (0, class_transformer_1.Exclude)()
], PrescriptionResponseDto);
let PrescriptionSummaryDto = class PrescriptionSummaryDto {
    id;
    studentId;
    drugName;
    drugCode;
    dosage;
    frequency;
    route;
    status;
    startDate;
    endDate;
    remainingRefills;
    isActive;
    createdAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentId: { required: true, type: () => String }, drugName: { required: true, type: () => String }, drugCode: { required: false, type: () => String }, dosage: { required: true, type: () => String }, frequency: { required: true, type: () => String }, route: { required: true, type: () => String }, status: { required: true, enum: require("../enums/prescription-status.enum").PrescriptionStatus }, startDate: { required: true, type: () => Date }, endDate: { required: false, type: () => Date }, remainingRefills: { required: true, type: () => Number }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date } };
    }
};
exports.PrescriptionSummaryDto = PrescriptionSummaryDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the prescription',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], PrescriptionSummaryDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student ID this prescription belongs to',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], PrescriptionSummaryDto.prototype, "studentId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Medication name',
        example: 'Amoxicillin',
    }),
    __metadata("design:type", String)
], PrescriptionSummaryDto.prototype, "drugName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'National Drug Code (NDC)',
        example: '00093-4155-73',
        nullable: true,
    }),
    __metadata("design:type", String)
], PrescriptionSummaryDto.prototype, "drugCode", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Dosage strength',
        example: '500mg',
    }),
    __metadata("design:type", String)
], PrescriptionSummaryDto.prototype, "dosage", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Frequency of administration',
        example: 'TID',
    }),
    __metadata("design:type", String)
], PrescriptionSummaryDto.prototype, "frequency", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Route of administration',
        example: 'oral',
    }),
    __metadata("design:type", String)
], PrescriptionSummaryDto.prototype, "route", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Prescription status',
        example: prescription_status_enum_1.PrescriptionStatus.PICKED_UP,
        enum: prescription_status_enum_1.PrescriptionStatus,
    }),
    __metadata("design:type", String)
], PrescriptionSummaryDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Start date',
        example: '2025-11-14',
        type: Date,
    }),
    __metadata("design:type", Date)
], PrescriptionSummaryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date',
        example: '2025-11-24',
        type: Date,
        nullable: true,
    }),
    __metadata("design:type", Date)
], PrescriptionSummaryDto.prototype, "endDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Refills remaining',
        example: 2,
        type: Number,
    }),
    __metadata("design:type", Number)
], PrescriptionSummaryDto.prototype, "remainingRefills", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Is prescription currently active',
        example: true,
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], PrescriptionSummaryDto.prototype, "isActive", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when created',
        example: '2025-11-14T09:00:00Z',
        type: Date,
    }),
    __metadata("design:type", Date)
], PrescriptionSummaryDto.prototype, "createdAt", void 0);
exports.PrescriptionSummaryDto = PrescriptionSummaryDto = __decorate([
    (0, class_transformer_1.Exclude)()
], PrescriptionSummaryDto);
class PrescriptionListResponseDto extends paginated_response_dto_1.PaginatedResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("./prescription-response.dto").PrescriptionSummaryDto] } };
    }
}
exports.PrescriptionListResponseDto = PrescriptionListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of prescription summaries for current page',
        type: [PrescriptionSummaryDto],
        isArray: true,
    }),
    (0, class_transformer_1.Type)(() => PrescriptionSummaryDto),
    __metadata("design:type", Array)
], PrescriptionListResponseDto.prototype, "data", void 0);
function mapPrescriptionToResponseDto(prescription) {
    return {
        id: prescription.id,
        studentId: prescription.studentId,
        visitId: prescription.visitId,
        treatmentPlanId: prescription.treatmentPlanId,
        prescribedBy: prescription.prescribedBy,
        drugName: prescription.drugName,
        drugCode: prescription.drugCode,
        dosage: prescription.dosage,
        frequency: prescription.frequency,
        route: prescription.route,
        quantity: prescription.quantity,
        quantityFilled: prescription.quantityFilled,
        refillsAuthorized: prescription.refillsAuthorized,
        refillsUsed: prescription.refillsUsed,
        startDate: prescription.startDate,
        endDate: prescription.endDate,
        instructions: prescription.instructions,
        status: prescription.status,
        pharmacyName: prescription.pharmacyName,
        filledDate: prescription.filledDate,
        pickedUpDate: prescription.pickedUpDate,
        notes: prescription.notes,
        createdAt: prescription.createdAt,
        updatedAt: prescription.updatedAt,
        isActive: prescription.isActive(),
        hasRefillsRemaining: prescription.hasRefillsRemaining(),
        remainingRefills: prescription.getRemainingRefills(),
        daysSupply: prescription.getDaysSupply(),
        student: prescription.student,
        visit: prescription.visit,
        treatmentPlan: prescription.treatmentPlan,
        prescriber: prescription.prescriber,
    };
}
function mapPrescriptionToSummaryDto(prescription) {
    return {
        id: prescription.id,
        studentId: prescription.studentId,
        drugName: prescription.drugName,
        drugCode: prescription.drugCode,
        dosage: prescription.dosage,
        frequency: prescription.frequency,
        route: prescription.route,
        status: prescription.status,
        startDate: prescription.startDate,
        endDate: prescription.endDate,
        remainingRefills: prescription.getRemainingRefills(),
        isActive: prescription.isActive(),
        createdAt: prescription.createdAt,
    };
}
function mapVitalSignsToResponseDto(vitalSigns) {
    return {
        id: vitalSigns.id,
        studentId: vitalSigns.studentId,
        measurementDate: vitalSigns.measurementDate,
        temperature: vitalSigns.temperature,
        temperatureUnit: vitalSigns.temperatureUnit,
        heartRate: vitalSigns.heartRate,
        respiratoryRate: vitalSigns.respiratoryRate,
        bloodPressureSystolic: vitalSigns.bloodPressureSystolic,
        bloodPressureDiastolic: vitalSigns.bloodPressureDiastolic,
        oxygenSaturation: vitalSigns.oxygenSaturation,
        weight: vitalSigns.weight,
        weightUnit: vitalSigns.weightUnit,
        height: vitalSigns.height,
        heightUnit: vitalSigns.heightUnit,
        bmi: vitalSigns.bmi,
        pain: vitalSigns.pain,
        isAbnormal: vitalSigns.isAbnormal,
        abnormalFlags: vitalSigns.abnormalFlags,
        measuredBy: vitalSigns.measuredBy,
        notes: vitalSigns.notes,
        createdAt: vitalSigns.createdAt,
        updatedAt: vitalSigns.updatedAt,
    };
}
function mapClinicalNoteToResponseDto(clinicalNote) {
    return {
        id: clinicalNote.id,
        studentId: clinicalNote.studentId,
        visitId: clinicalNote.visitId,
        type: clinicalNote.type,
        createdBy: clinicalNote.createdBy,
        title: clinicalNote.title,
        content: clinicalNote.content,
        subjective: clinicalNote.subjective,
        objective: clinicalNote.objective,
        assessment: clinicalNote.assessment,
        plan: clinicalNote.plan,
        tags: clinicalNote.tags,
        isConfidential: clinicalNote.isConfidential,
        isSigned: clinicalNote.isSigned,
        signedAt: clinicalNote.signedAt,
        amended: clinicalNote.amended,
        amendmentReason: clinicalNote.amendmentReason,
        createdAt: clinicalNote.createdAt,
        updatedAt: clinicalNote.updatedAt,
    };
}
function mapPrescriptionsToListResponse(prescriptions, page, limit, total) {
    const summaries = prescriptions.map(mapPrescriptionToSummaryDto);
    return paginated_response_dto_1.PaginatedResponseDto.create({
        data: summaries,
        page,
        limit,
        total,
    });
}
//# sourceMappingURL=prescription-response.dto.js.map