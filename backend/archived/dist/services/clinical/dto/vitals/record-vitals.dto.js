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
exports.RecordVitalsDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class RecordVitalsDto {
    studentId;
    visitId;
    recordedBy;
    recordedAt;
    systolicBP;
    diastolicBP;
    bpPosition;
    heartRate;
    temperature;
    tempMethod;
    respiratoryRate;
    oxygenSaturation;
    onOxygen;
    oxygenFlowRate;
    height;
    weight;
    painScale;
    painLocation;
    headCircumference;
    notes;
    abnormalFlags;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, visitId: { required: false, type: () => String, format: "uuid" }, recordedBy: { required: true, type: () => String, format: "uuid" }, recordedAt: { required: true, type: () => Date }, systolicBP: { required: false, type: () => Number, minimum: 60, maximum: 250 }, diastolicBP: { required: false, type: () => Number, minimum: 40, maximum: 150 }, bpPosition: { required: false, type: () => String }, heartRate: { required: false, type: () => Number, minimum: 30, maximum: 220 }, temperature: { required: false, type: () => Number, minimum: 90, maximum: 110 }, tempMethod: { required: false, type: () => String }, respiratoryRate: { required: false, type: () => Number, minimum: 8, maximum: 60 }, oxygenSaturation: { required: false, type: () => Number, minimum: 70, maximum: 100 }, onOxygen: { required: false, type: () => Boolean }, oxygenFlowRate: { required: false, type: () => Number }, height: { required: false, type: () => Number }, weight: { required: false, type: () => Number }, painScale: { required: false, type: () => Number, minimum: 0, maximum: 10 }, painLocation: { required: false, type: () => String }, headCircumference: { required: false, type: () => Number }, notes: { required: false, type: () => String }, abnormalFlags: { required: false, type: () => [String] } };
    }
}
exports.RecordVitalsDto = RecordVitalsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RecordVitalsDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Associated clinic visit ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecordVitalsDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff member recording vitals' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RecordVitalsDto.prototype, "recordedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recording timestamp',
        example: '2025-10-28T10:00:00Z',
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], RecordVitalsDto.prototype, "recordedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Systolic blood pressure (mmHg)',
        example: 120,
        minimum: 60,
        maximum: 250,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(60),
    (0, class_validator_1.Max)(250),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RecordVitalsDto.prototype, "systolicBP", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Diastolic blood pressure (mmHg)',
        example: 80,
        minimum: 40,
        maximum: 150,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(40),
    (0, class_validator_1.Max)(150),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RecordVitalsDto.prototype, "diastolicBP", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patient position during BP reading',
        example: 'sitting',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecordVitalsDto.prototype, "bpPosition", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Heart rate (bpm)',
        example: 72,
        minimum: 30,
        maximum: 220,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(220),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RecordVitalsDto.prototype, "heartRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Temperature (°F)',
        example: 98.6,
        minimum: 90,
        maximum: 110,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(90),
    (0, class_validator_1.Max)(110),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RecordVitalsDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Temperature measurement method',
        example: 'oral',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecordVitalsDto.prototype, "tempMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Respiratory rate (breaths/min)',
        example: 16,
        minimum: 8,
        maximum: 60,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(8),
    (0, class_validator_1.Max)(60),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RecordVitalsDto.prototype, "respiratoryRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Oxygen saturation (%)',
        example: 98,
        minimum: 70,
        maximum: 100,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(70),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RecordVitalsDto.prototype, "oxygenSaturation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is patient on supplemental oxygen?',
        default: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], RecordVitalsDto.prototype, "onOxygen", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Oxygen flow rate (L/min)', example: 2 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RecordVitalsDto.prototype, "oxygenFlowRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Height (inches)', example: 68 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RecordVitalsDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Weight (pounds)', example: 150 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RecordVitalsDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Pain scale (0-10)',
        example: 3,
        minimum: 0,
        maximum: 10,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RecordVitalsDto.prototype, "painScale", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Location of pain',
        example: 'lower back',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecordVitalsDto.prototype, "painLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Head circumference (cm)', example: 55 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RecordVitalsDto.prototype, "headCircumference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecordVitalsDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Abnormal vital sign flags',
        example: ['high_bp', 'fever'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], RecordVitalsDto.prototype, "abnormalFlags", void 0);
//# sourceMappingURL=record-vitals.dto.js.map