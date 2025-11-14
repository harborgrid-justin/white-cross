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
exports.CreateNoteDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const note_type_enum_1 = require("../../enums/note-type.enum");
class CreateNoteDto {
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
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, visitId: { required: false, type: () => String, format: "uuid" }, type: { required: true, enum: require("../../enums/note-type.enum").NoteType }, createdBy: { required: true, type: () => String, format: "uuid" }, title: { required: true, type: () => String, maxLength: 500 }, content: { required: true, type: () => String, maxLength: 10000 }, subjective: { required: false, type: () => String, maxLength: 5000 }, objective: { required: false, type: () => String, maxLength: 5000 }, assessment: { required: false, type: () => String, maxLength: 5000 }, plan: { required: false, type: () => String, maxLength: 5000 }, tags: { required: false, type: () => [String], maxLength: 50 }, isConfidential: { required: false, type: () => Boolean } };
    }
}
exports.CreateNoteDto = CreateNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateNoteDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Associated clinic visit ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNoteDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Note type',
        enum: note_type_enum_1.NoteType,
        default: note_type_enum_1.NoteType.GENERAL,
    }),
    (0, class_validator_1.IsEnum)(note_type_enum_1.NoteType),
    __metadata("design:type", String)
], CreateNoteDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff member creating note' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateNoteDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Note title',
        example: 'Follow-up Visit Note',
        maxLength: 500,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Note title cannot exceed 500 characters' }),
    __metadata("design:type", String)
], CreateNoteDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Note content', maxLength: 10000 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10000, { message: 'Note content cannot exceed 10000 characters' }),
    __metadata("design:type", String)
], CreateNoteDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Subjective findings (SOAP note)',
        example: 'Patient reports headache for 2 days',
        maxLength: 5000,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(5000, {
        message: 'Subjective findings cannot exceed 5000 characters',
    }),
    __metadata("design:type", String)
], CreateNoteDto.prototype, "subjective", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Objective findings (SOAP note)',
        example: 'BP 120/80, Temp 98.6°F',
        maxLength: 5000,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(5000, {
        message: 'Objective findings cannot exceed 5000 characters',
    }),
    __metadata("design:type", String)
], CreateNoteDto.prototype, "objective", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Assessment (SOAP note)',
        example: 'Tension headache likely',
        maxLength: 5000,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(5000, { message: 'Assessment cannot exceed 5000 characters' }),
    __metadata("design:type", String)
], CreateNoteDto.prototype, "assessment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Plan (SOAP note)',
        example: 'OTC pain relief, follow up in 1 week',
        maxLength: 5000,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(5000, { message: 'Plan cannot exceed 5000 characters' }),
    __metadata("design:type", String)
], CreateNoteDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tags for categorization',
        example: ['headache', 'follow-up'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(50, {
        each: true,
        message: 'Each tag cannot exceed 50 characters',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateNoteDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is this note confidential?',
        default: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateNoteDto.prototype, "isConfidential", void 0);
//# sourceMappingURL=create-note.dto.js.map