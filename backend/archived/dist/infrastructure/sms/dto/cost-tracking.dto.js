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
exports.SmsCostAnalyticsDto = exports.CostAnalyticsQueryDto = exports.SmsCostEntryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SmsCostEntryDto {
    to;
    countryCode;
    segmentCount;
    costPerSegment;
    totalCost;
    timestamp;
    messageId;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { to: { required: true, type: () => String }, countryCode: { required: true, type: () => String }, segmentCount: { required: true, type: () => Number, minimum: 1 }, costPerSegment: { required: true, type: () => Number, minimum: 0 }, totalCost: { required: true, type: () => Number, minimum: 0 }, timestamp: { required: true, type: () => String }, messageId: { required: false, type: () => String }, metadata: { required: false, type: () => Object } };
    }
}
exports.SmsCostEntryDto = SmsCostEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recipient phone number',
        example: '+15551234567',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsCostEntryDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country code',
        example: 'US',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsCostEntryDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of message segments',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SmsCostEntryDto.prototype, "segmentCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cost per segment in USD',
        example: 0.0075,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SmsCostEntryDto.prototype, "costPerSegment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total cost in USD',
        example: 0.0075,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SmsCostEntryDto.prototype, "totalCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of SMS',
        example: '2025-10-28T15:30:00Z',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsCostEntryDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Provider message ID',
        example: 'SM1234567890abcdef',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsCostEntryDto.prototype, "messageId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom metadata',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SmsCostEntryDto.prototype, "metadata", void 0);
class CostAnalyticsQueryDto {
    startDate;
    endDate;
    countryCode;
    static _OPENAPI_METADATA_FACTORY() {
        return { startDate: { required: true, type: () => String }, endDate: { required: true, type: () => String }, countryCode: { required: false, type: () => String } };
    }
}
exports.CostAnalyticsQueryDto = CostAnalyticsQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date (ISO 8601)',
        example: '2025-10-01T00:00:00Z',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CostAnalyticsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End date (ISO 8601)',
        example: '2025-10-31T23:59:59Z',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CostAnalyticsQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by country code',
        example: 'US',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CostAnalyticsQueryDto.prototype, "countryCode", void 0);
class SmsCostAnalyticsDto {
    totalMessages;
    totalCost;
    averageCostPerMessage;
    costByCountry;
    startDate;
    endDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { totalMessages: { required: true, type: () => Number }, totalCost: { required: true, type: () => Number }, averageCostPerMessage: { required: true, type: () => Number }, costByCountry: { required: true, type: () => Object }, startDate: { required: true, type: () => String }, endDate: { required: true, type: () => String } };
    }
}
exports.SmsCostAnalyticsDto = SmsCostAnalyticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total messages sent',
        example: 1250,
    }),
    __metadata("design:type", Number)
], SmsCostAnalyticsDto.prototype, "totalMessages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total cost in USD',
        example: 9.38,
    }),
    __metadata("design:type", Number)
], SmsCostAnalyticsDto.prototype, "totalCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average cost per message in USD',
        example: 0.0075,
    }),
    __metadata("design:type", Number)
], SmsCostAnalyticsDto.prototype, "averageCostPerMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cost breakdown by country',
        example: {
            US: { messages: 1000, cost: 7.5 },
            CA: { messages: 250, cost: 1.88 },
        },
    }),
    __metadata("design:type", Object)
], SmsCostAnalyticsDto.prototype, "costByCountry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Query start date',
        example: '2025-10-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], SmsCostAnalyticsDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Query end date',
        example: '2025-10-31T23:59:59Z',
    }),
    __metadata("design:type", String)
], SmsCostAnalyticsDto.prototype, "endDate", void 0);
//# sourceMappingURL=cost-tracking.dto.js.map