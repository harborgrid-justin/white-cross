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
exports.SearchDocumentsDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const document_enums_1 = require("../enums/document.enums");
class SearchDocumentsDto {
    query;
    category;
    status;
    studentId;
    limit = 50;
    static _OPENAPI_METADATA_FACTORY() {
        return { query: { required: false, type: () => String, minLength: 1 }, category: { required: false, type: () => String }, status: { required: false, enum: require("../enums/document.enums").DocumentStatus }, studentId: { required: false, type: () => String, format: "uuid" }, limit: { required: false, type: () => Number, default: 50 } };
    }
}
exports.SearchDocumentsDto = SearchDocumentsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search query (min 1 character)',
        example: 'consent form',
        minLength: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], SearchDocumentsDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by document category',
        example: 'CONSENT_FORM',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchDocumentsDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by document status',
        enum: document_enums_1.DocumentStatus,
        example: document_enums_1.DocumentStatus.APPROVED,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(document_enums_1.DocumentStatus),
    __metadata("design:type", String)
], SearchDocumentsDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by student ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SearchDocumentsDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum results to return',
        example: 50,
        default: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchDocumentsDto.prototype, "limit", void 0);
//# sourceMappingURL=search-documents.dto.js.map