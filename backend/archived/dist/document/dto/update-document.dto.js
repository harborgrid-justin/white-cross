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
exports.UpdateDocumentDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const document_enums_1 = require("../enums/document.enums");
class UpdateDocumentDto {
    title;
    description;
    status;
    tags;
    retentionDate;
    accessLevel;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String, minLength: 3, maxLength: 255 }, description: { required: false, type: () => String, maxLength: 5000 }, status: { required: false, enum: require("../enums/document.enums").DocumentStatus }, tags: { required: false, type: () => [String], maxItems: 10 }, retentionDate: { required: false, type: () => Date }, accessLevel: { required: false, enum: require("../enums/document.enums").DocumentAccessLevel } };
    }
}
exports.UpdateDocumentDto = UpdateDocumentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated document title',
        minLength: 3,
        maxLength: 255,
        example: 'Annual Physical Examination 2024 - Updated',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateDocumentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated description',
        maxLength: 5000,
        example: 'Updated physical examination results with additional notes',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], UpdateDocumentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'New document status (DRAFT → PENDING_REVIEW → APPROVED)',
        enum: document_enums_1.DocumentStatus,
        example: document_enums_1.DocumentStatus.APPROVED,
    }),
    (0, class_validator_1.IsEnum)(document_enums_1.DocumentStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDocumentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated searchable tags (maximum 10)',
        type: [String],
        maxItems: 10,
        example: ['physical', 'annual', '2024', 'updated'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayMaxSize)(10),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateDocumentDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Document retention/destruction date (ISO 8601 format)',
        example: '2031-12-31T23:59:59Z',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateDocumentDto.prototype, "retentionDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated access control level (cannot downgrade PHI documents to PUBLIC)',
        enum: document_enums_1.DocumentAccessLevel,
        example: document_enums_1.DocumentAccessLevel.STAFF_ONLY,
    }),
    (0, class_validator_1.IsEnum)(document_enums_1.DocumentAccessLevel),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDocumentDto.prototype, "accessLevel", void 0);
//# sourceMappingURL=update-document.dto.js.map