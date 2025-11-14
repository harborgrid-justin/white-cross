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
exports.CreatePHIAccessLogDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const create_audit_log_dto_1 = require("./create-audit-log.dto");
const phi_access_type_enum_1 = require("../enums/phi-access-type.enum");
const phi_data_category_enum_1 = require("../enums/phi-data-category.enum");
class CreatePHIAccessLogDto extends create_audit_log_dto_1.CreateBasicAuditLogDto {
    studentId;
    accessType;
    dataCategory;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String }, accessType: { required: true, enum: require("../enums/phi-access-type.enum").PHIAccessType }, dataCategory: { required: true, enum: require("../enums/phi-data-category.enum").PHIDataCategory } };
    }
}
exports.CreatePHIAccessLogDto = CreatePHIAccessLogDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Student ID whose PHI is being accessed' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePHIAccessLogDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: phi_access_type_enum_1.PHIAccessType, description: 'Type of PHI access' }),
    (0, class_validator_1.IsEnum)(phi_access_type_enum_1.PHIAccessType),
    __metadata("design:type", String)
], CreatePHIAccessLogDto.prototype, "accessType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: phi_data_category_enum_1.PHIDataCategory,
        description: 'Category of PHI data accessed',
    }),
    (0, class_validator_1.IsEnum)(phi_data_category_enum_1.PHIDataCategory),
    __metadata("design:type", String)
], CreatePHIAccessLogDto.prototype, "dataCategory", void 0);
//# sourceMappingURL=create-phi-access-log.dto.js.map