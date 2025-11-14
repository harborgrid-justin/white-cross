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
exports.IntegrationStatisticsDto = exports.SyncStatisticsDto = exports.IntegrationStatsByTypeDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class IntegrationStatsByTypeDto {
    success;
    failed;
    total;
    static _OPENAPI_METADATA_FACTORY() {
        return { success: { required: true, type: () => Number }, failed: { required: true, type: () => Number }, total: { required: true, type: () => Number } };
    }
}
exports.IntegrationStatsByTypeDto = IntegrationStatsByTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of successful syncs' }),
    __metadata("design:type", Number)
], IntegrationStatsByTypeDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of failed syncs' }),
    __metadata("design:type", Number)
], IntegrationStatsByTypeDto.prototype, "failed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total syncs' }),
    __metadata("design:type", Number)
], IntegrationStatsByTypeDto.prototype, "total", void 0);
class SyncStatisticsDto {
    totalSyncs;
    successfulSyncs;
    failedSyncs;
    successRate;
    totalRecordsProcessed;
    totalRecordsSucceeded;
    totalRecordsFailed;
    static _OPENAPI_METADATA_FACTORY() {
        return { totalSyncs: { required: true, type: () => Number }, successfulSyncs: { required: true, type: () => Number }, failedSyncs: { required: true, type: () => Number }, successRate: { required: true, type: () => Number }, totalRecordsProcessed: { required: true, type: () => Number }, totalRecordsSucceeded: { required: true, type: () => Number }, totalRecordsFailed: { required: true, type: () => Number } };
    }
}
exports.SyncStatisticsDto = SyncStatisticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of syncs' }),
    __metadata("design:type", Number)
], SyncStatisticsDto.prototype, "totalSyncs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of successful syncs' }),
    __metadata("design:type", Number)
], SyncStatisticsDto.prototype, "successfulSyncs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of failed syncs' }),
    __metadata("design:type", Number)
], SyncStatisticsDto.prototype, "failedSyncs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Success rate percentage' }),
    __metadata("design:type", Number)
], SyncStatisticsDto.prototype, "successRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total records processed' }),
    __metadata("design:type", Number)
], SyncStatisticsDto.prototype, "totalRecordsProcessed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total records succeeded' }),
    __metadata("design:type", Number)
], SyncStatisticsDto.prototype, "totalRecordsSucceeded", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total records failed' }),
    __metadata("design:type", Number)
], SyncStatisticsDto.prototype, "totalRecordsFailed", void 0);
class IntegrationStatisticsDto {
    totalIntegrations;
    activeIntegrations;
    inactiveIntegrations;
    syncStatistics;
    statsByType;
    static _OPENAPI_METADATA_FACTORY() {
        return { totalIntegrations: { required: true, type: () => Number }, activeIntegrations: { required: true, type: () => Number }, inactiveIntegrations: { required: true, type: () => Number }, syncStatistics: { required: true, type: () => require("./integration-statistics.dto").SyncStatisticsDto }, statsByType: { required: true, type: () => Object } };
    }
}
exports.IntegrationStatisticsDto = IntegrationStatisticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of integrations' }),
    __metadata("design:type", Number)
], IntegrationStatisticsDto.prototype, "totalIntegrations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of active integrations' }),
    __metadata("design:type", Number)
], IntegrationStatisticsDto.prototype, "activeIntegrations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of inactive integrations' }),
    __metadata("design:type", Number)
], IntegrationStatisticsDto.prototype, "inactiveIntegrations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sync statistics' }),
    __metadata("design:type", SyncStatisticsDto)
], IntegrationStatisticsDto.prototype, "syncStatistics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Statistics by integration type' }),
    __metadata("design:type", Object)
], IntegrationStatisticsDto.prototype, "statsByType", void 0);
//# sourceMappingURL=integration-statistics.dto.js.map