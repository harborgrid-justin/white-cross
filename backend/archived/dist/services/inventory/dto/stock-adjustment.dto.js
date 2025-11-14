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
exports.StockAdjustmentDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class StockAdjustmentDto {
    quantity;
    reason;
    performedById;
    static _OPENAPI_METADATA_FACTORY() {
        return { quantity: { required: true, type: () => Number }, reason: { required: true, type: () => String, maxLength: 255 }, performedById: { required: true, type: () => String, format: "uuid" } };
    }
}
exports.StockAdjustmentDto = StockAdjustmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Adjustment quantity (positive = add, negative = remove)',
        example: -5,
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], StockAdjustmentDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for adjustment',
        example: 'Damaged during inspection',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], StockAdjustmentDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User UUID performing the adjustment' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StockAdjustmentDto.prototype, "performedById", void 0);
//# sourceMappingURL=stock-adjustment.dto.js.map