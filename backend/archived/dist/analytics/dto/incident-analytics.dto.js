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
exports.GetIncidentsByLocationQueryDto = exports.GetIncidentTrendsQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class GetIncidentTrendsQueryDto {
    schoolId;
    startDate;
    endDate;
    incidentType;
    severity;
    groupBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: false, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, incidentType: { required: false, type: () => String }, severity: { required: false, type: () => String }, groupBy: { required: false, type: () => String } };
    }
}
exports.GetIncidentTrendsQueryDto = GetIncidentTrendsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'School ID', default: 'default-school' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetIncidentTrendsQueryDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date for incident trends' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetIncidentTrendsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date for incident trends' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetIncidentTrendsQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by incident type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetIncidentTrendsQueryDto.prototype, "incidentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by severity level' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetIncidentTrendsQueryDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Group results by',
        enum: ['TYPE', 'LOCATION', 'TIME', 'SEVERITY'],
        default: 'TYPE',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetIncidentTrendsQueryDto.prototype, "groupBy", void 0);
class GetIncidentsByLocationQueryDto {
    schoolId;
    startDate;
    endDate;
    location;
    includeHeatMap;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: false, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, location: { required: false, type: () => String }, includeHeatMap: { required: false, type: () => Boolean } };
    }
}
exports.GetIncidentsByLocationQueryDto = GetIncidentsByLocationQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'School ID', default: 'default-school' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetIncidentsByLocationQueryDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date for location analysis' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetIncidentsByLocationQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date for location analysis' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetIncidentsByLocationQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by specific location' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetIncidentsByLocationQueryDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include heat map visualization data',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], GetIncidentsByLocationQueryDto.prototype, "includeHeatMap", void 0);
//# sourceMappingURL=incident-analytics.dto.js.map