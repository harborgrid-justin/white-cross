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
exports.CreateInventoryTransactionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const models_1 = require("../../../database/models");
class CreateInventoryTransactionDto {
    inventoryItemId;
    type;
    quantity;
    unitCost;
    reason;
    batchNumber;
    expirationDate;
    performedById;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { inventoryItemId: { required: true, type: () => String, format: "uuid" }, type: { required: true, enum: require("../../../database/models/inventory-transaction.model").InventoryTransactionType }, quantity: { required: true, type: () => Number }, unitCost: { required: false, type: () => Number }, reason: { required: false, type: () => String, maxLength: 255 }, batchNumber: { required: false, type: () => String, maxLength: 100 }, expirationDate: { required: false, type: () => String }, performedById: { required: true, type: () => String, format: "uuid" }, notes: { required: false, type: () => String } };
    }
}
exports.CreateInventoryTransactionDto = CreateInventoryTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Inventory item UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInventoryTransactionDto.prototype, "inventoryItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: models_1.InventoryTransactionType,
        description: 'Transaction type',
    }),
    (0, class_validator_1.IsEnum)(models_1.InventoryTransactionType),
    __metadata("design:type", String)
], CreateInventoryTransactionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity (positive for additions, negative for removals)',
        example: 100,
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateInventoryTransactionDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Unit cost at time of transaction',
        example: 5.99,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateInventoryTransactionDto.prototype, "unitCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for transaction',
        example: 'Annual restock',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateInventoryTransactionDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Batch number',
        example: 'BATCH-2024-001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateInventoryTransactionDto.prototype, "batchNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expiration date (ISO 8601)',
        example: '2025-12-31T00:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInventoryTransactionDto.prototype, "expirationDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User UUID who performed the transaction' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInventoryTransactionDto.prototype, "performedById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInventoryTransactionDto.prototype, "notes", void 0);
//# sourceMappingURL=create-inventory-transaction.dto.js.map