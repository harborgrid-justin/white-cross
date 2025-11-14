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
exports.PHIAccessFilterDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const audit_log_filter_dto_1 = require("./audit-log-filter.dto");
const phi_access_type_enum_1 = require("../enums/phi-access-type.enum");
const phi_data_category_enum_1 = require("../enums/phi-data-category.enum");
class PHIAccessFilterDto extends audit_log_filter_dto_1.AuditLogFilterDto {
    studentId;
    accessType;
    dataCategory;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: false, type: () => String }, accessType: { required: false, enum: require("../enums/phi-access-type.enum").PHIAccessType }, dataCategory: { required: false, enum: require("../enums/phi-data-category.enum").PHIDataCategory } };
    }
}
exports.PHIAccessFilterDto = PHIAccessFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by student ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PHIAccessFilterDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: phi_access_type_enum_1.PHIAccessType,
        description: 'Filter by access type',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(phi_access_type_enum_1.PHIAccessType),
    __metadata("design:type", String)
], PHIAccessFilterDto.prototype, "accessType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: phi_data_category_enum_1.PHIDataCategory,
        description: 'Filter by data category',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(phi_data_category_enum_1.PHIDataCategory),
    __metadata("design:type", String)
], PHIAccessFilterDto.prototype, "dataCategory", void 0);
//# sourceMappingURL=phi-access-filter.dto.js.map