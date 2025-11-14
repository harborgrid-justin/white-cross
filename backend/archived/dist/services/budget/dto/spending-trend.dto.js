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
exports.SpendingTrendDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class SpendingTrendDto {
    month;
    totalSpent;
    transactionCount;
    static _OPENAPI_METADATA_FACTORY() {
        return { month: { required: true, type: () => Date }, totalSpent: { required: true, type: () => Number }, transactionCount: { required: true, type: () => Number } };
    }
}
exports.SpendingTrendDto = SpendingTrendDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Month for this spending trend data point',
        example: '2025-10-01T00:00:00Z',
        type: 'string',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], SpendingTrendDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount spent during this month in dollars',
        example: 12450.75,
    }),
    __metadata("design:type", Number)
], SpendingTrendDto.prototype, "totalSpent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of transactions in this month',
        example: 38,
    }),
    __metadata("design:type", Number)
], SpendingTrendDto.prototype, "transactionCount", void 0);
//# sourceMappingURL=spending-trend.dto.js.map