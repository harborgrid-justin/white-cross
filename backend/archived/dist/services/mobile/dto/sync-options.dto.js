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
exports.SyncOptionsDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../enums");
class SyncOptionsDto {
    forceSync;
    batchSize;
    retryFailed;
    conflictStrategy;
    static _OPENAPI_METADATA_FACTORY() {
        return { forceSync: { required: false, type: () => Boolean }, batchSize: { required: false, type: () => Number }, retryFailed: { required: false, type: () => Boolean }, conflictStrategy: { required: false, enum: require("../enums/sync.enum").ConflictResolution } };
    }
}
exports.SyncOptionsDto = SyncOptionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Force synchronization',
        required: false,
        default: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SyncOptionsDto.prototype, "forceSync", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Batch size for sync',
        required: false,
        default: 50,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SyncOptionsDto.prototype, "batchSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Retry failed items',
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SyncOptionsDto.prototype, "retryFailed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Conflict resolution strategy',
        enum: enums_1.ConflictResolution,
        required: false,
    }),
    (0, class_validator_1.IsEnum)(enums_1.ConflictResolution),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SyncOptionsDto.prototype, "conflictStrategy", void 0);
//# sourceMappingURL=sync-options.dto.js.map