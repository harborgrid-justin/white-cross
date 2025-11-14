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
exports.FollowUpFiltersDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const follow_up_status_enum_1 = require("../../enums/follow-up-status.enum");
class FollowUpFiltersDto {
    studentId;
    originalVisitId;
    status;
    assignedTo;
    pendingOnly;
    upcomingOnly;
    dateFrom;
    dateTo;
    limit = 20;
    offset = 0;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: false, type: () => String, format: "uuid" }, originalVisitId: { required: false, type: () => String, format: "uuid" }, status: { required: false, enum: require("../../enums/follow-up-status.enum").FollowUpStatus }, assignedTo: { required: false, type: () => String, format: "uuid" }, pendingOnly: { required: false, type: () => Boolean }, upcomingOnly: { required: false, type: () => Boolean }, dateFrom: { required: false, type: () => Date }, dateTo: { required: false, type: () => Date }, limit: { required: false, type: () => Number, default: 20, minimum: 1, maximum: 100 }, offset: { required: false, type: () => Number, default: 0, minimum: 0 } };
    }
}
exports.FollowUpFiltersDto = FollowUpFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by student ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FollowUpFiltersDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by original visit ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FollowUpFiltersDto.prototype, "originalVisitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by status',
        enum: follow_up_status_enum_1.FollowUpStatus,
    }),
    (0, class_validator_1.IsEnum)(follow_up_status_enum_1.FollowUpStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FollowUpFiltersDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by assigned staff member' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FollowUpFiltersDto.prototype, "assignedTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Show only pending (scheduled/reminded/confirmed)',
        default: false,
    }),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FollowUpFiltersDto.prototype, "pendingOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Show only upcoming appointments',
        default: false,
    }),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FollowUpFiltersDto.prototype, "upcomingOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start date for date range filter' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], FollowUpFiltersDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date for date range filter' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], FollowUpFiltersDto.prototype, "dateTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of results to return',
        minimum: 1,
        maximum: 100,
        default: 20,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FollowUpFiltersDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of results to skip',
        minimum: 0,
        default: 0,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FollowUpFiltersDto.prototype, "offset", void 0);
//# sourceMappingURL=follow-up-filters.dto.js.map