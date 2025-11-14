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
exports.TrendDataDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class TrendDataDto {
    value;
    change;
    changeType;
    static _OPENAPI_METADATA_FACTORY() {
        return { value: { required: true, type: () => String }, change: { required: true, type: () => String }, changeType: { required: true, type: () => Object, enum: ['positive', 'negative', 'neutral'] } };
    }
}
exports.TrendDataDto = TrendDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Metric value as string',
        example: '125',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrendDataDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Percentage change with sign',
        example: '+12.5%',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrendDataDto.prototype, "change", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of change direction',
        enum: ['positive', 'negative', 'neutral'],
        example: 'positive',
    }),
    (0, class_validator_1.IsIn)(['positive', 'negative', 'neutral']),
    __metadata("design:type", String)
], TrendDataDto.prototype, "changeType", void 0);
//# sourceMappingURL=trend-data.dto.js.map