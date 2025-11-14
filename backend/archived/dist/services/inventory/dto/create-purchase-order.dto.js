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
exports.CreatePurchaseOrderDto = exports.PurchaseOrderItemDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class PurchaseOrderItemDto {
    inventoryItemId;
    quantity;
    unitCost;
    static _OPENAPI_METADATA_FACTORY() {
        return { inventoryItemId: { required: true, type: () => String, format: "uuid" }, quantity: { required: true, type: () => Number, minimum: 1 }, unitCost: { required: true, type: () => Number, minimum: 0 } };
    }
}
exports.PurchaseOrderItemDto = PurchaseOrderItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Inventory item UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PurchaseOrderItemDto.prototype, "inventoryItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order quantity', example: 100 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PurchaseOrderItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit cost', example: 5.99 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PurchaseOrderItemDto.prototype, "unitCost", void 0);
class CreatePurchaseOrderDto {
    orderNumber;
    vendorId;
    orderDate;
    expectedDate;
    notes;
    items;
    static _OPENAPI_METADATA_FACTORY() {
        return { orderNumber: { required: true, type: () => String, maxLength: 100 }, vendorId: { required: true, type: () => String, format: "uuid" }, orderDate: { required: true, type: () => String }, expectedDate: { required: false, type: () => String }, notes: { required: false, type: () => String }, items: { required: true, type: () => [require("./create-purchase-order.dto").PurchaseOrderItemDto] } };
    }
}
exports.CreatePurchaseOrderDto = CreatePurchaseOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique order number', example: 'PO-2024-001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreatePurchaseOrderDto.prototype, "orderNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Vendor UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePurchaseOrderDto.prototype, "vendorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order date (ISO 8601)',
        example: '2024-10-28T00:00:00Z',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePurchaseOrderDto.prototype, "orderDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expected delivery date (ISO 8601)',
        example: '2024-11-15T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePurchaseOrderDto.prototype, "expectedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Order notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePurchaseOrderDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order line items',
        type: [PurchaseOrderItemDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PurchaseOrderItemDto),
    __metadata("design:type", Array)
], CreatePurchaseOrderDto.prototype, "items", void 0);
//# sourceMappingURL=create-purchase-order.dto.js.map