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
exports.CreateDocumentDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const document_enums_1 = require("../enums/document.enums");
class CreateDocumentDto {
    title;
    description;
    category;
    fileType;
    fileName;
    fileSize;
    fileUrl;
    uploadedBy;
    studentId;
    tags;
    isTemplate;
    templateData;
    accessLevel;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String, minLength: 3, maxLength: 255 }, description: { required: false, type: () => String, maxLength: 5000 }, category: { required: true, enum: require("../enums/document.enums").DocumentCategory }, fileType: { required: true, type: () => String }, fileName: { required: true, type: () => String, maxLength: 255 }, fileSize: { required: true, type: () => Number, minimum: 1024, maximum: 52428800 }, fileUrl: { required: true, type: () => String, format: "uri" }, uploadedBy: { required: true, type: () => String }, studentId: { required: false, type: () => String, format: "uuid" }, tags: { required: false, type: () => [String], maxItems: 10 }, isTemplate: { required: false, type: () => Boolean }, templateData: { required: false, type: () => Object }, accessLevel: { required: false, enum: require("../enums/document.enums").DocumentAccessLevel } };
    }
}
exports.CreateDocumentDto = CreateDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Document title',
        minLength: 3,
        maxLength: 255,
        example: 'Annual Physical Examination 2024',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Detailed document description',
        maxLength: 5000,
        example: 'Complete physical examination results for student',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Document category - determines retention and compliance requirements',
        enum: document_enums_1.DocumentCategory,
        example: document_enums_1.DocumentCategory.MEDICAL_RECORD,
    }),
    (0, class_validator_1.IsEnum)(document_enums_1.DocumentCategory),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'MIME type of the file',
        example: 'application/pdf',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "fileType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Original filename with extension',
        maxLength: 255,
        example: 'physical_exam_2024.pdf',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File size in bytes (1KB - 50MB)',
        minimum: 1024,
        maximum: 52428800,
        example: 524288,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1024),
    (0, class_validator_1.Max)(52428800),
    __metadata("design:type", Number)
], CreateDocumentDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Storage URL or file path for document retrieval (HTTPS required for PHI)',
        example: 'https://secure.storage/docs/abc123.pdf',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "fileUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID of the uploader',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "uploadedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Student ID for student-specific documents',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Searchable tags (maximum 10)',
        type: [String],
        maxItems: 10,
        example: ['physical', 'annual', '2024'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayMaxSize)(10),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateDocumentDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is this a reusable template for creating similar documents',
        default: false,
        example: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateDocumentDto.prototype, "isTemplate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Template configuration and field definitions (JSON)',
        example: { fields: ['studentName', 'examDate', 'findings'] },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDocumentDto.prototype, "templateData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Access control level (auto-adjusted for PHI documents)',
        enum: document_enums_1.DocumentAccessLevel,
        default: document_enums_1.DocumentAccessLevel.STAFF_ONLY,
        example: document_enums_1.DocumentAccessLevel.STAFF_ONLY,
    }),
    (0, class_validator_1.IsEnum)(document_enums_1.DocumentAccessLevel),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "accessLevel", void 0);
//# sourceMappingURL=create-document.dto.js.map