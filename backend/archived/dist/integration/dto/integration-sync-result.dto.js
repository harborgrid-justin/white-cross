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
exports.IntegrationSyncResultDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class IntegrationSyncResultDto {
    success;
    recordsProcessed;
    recordsSucceeded;
    recordsFailed;
    duration;
    errors;
    static _OPENAPI_METADATA_FACTORY() {
        return { success: { required: true, type: () => Boolean }, recordsProcessed: { required: true, type: () => Number }, recordsSucceeded: { required: true, type: () => Number }, recordsFailed: { required: true, type: () => Number }, duration: { required: true, type: () => Number }, errors: { required: false, type: () => [String] } };
    }
}
exports.IntegrationSyncResultDto = IntegrationSyncResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the sync was successful' }),
    __metadata("design:type", Boolean)
], IntegrationSyncResultDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of records processed' }),
    __metadata("design:type", Number)
], IntegrationSyncResultDto.prototype, "recordsProcessed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of records succeeded' }),
    __metadata("design:type", Number)
], IntegrationSyncResultDto.prototype, "recordsSucceeded", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of records failed' }),
    __metadata("design:type", Number)
], IntegrationSyncResultDto.prototype, "recordsFailed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sync duration in milliseconds' }),
    __metadata("design:type", Number)
], IntegrationSyncResultDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Array of error messages' }),
    __metadata("design:type", Array)
], IntegrationSyncResultDto.prototype, "errors", void 0);
//# sourceMappingURL=integration-sync-result.dto.js.map