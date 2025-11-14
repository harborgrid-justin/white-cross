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
exports.PaginatedAuditLogsDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const models_1 = require("../../../database/models");
class PaginationMeta {
    page;
    limit;
    total;
    totalPages;
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: true, type: () => Number }, limit: { required: true, type: () => Number }, total: { required: true, type: () => Number }, totalPages: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PaginationMeta.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PaginationMeta.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PaginationMeta.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PaginationMeta.prototype, "totalPages", void 0);
class PaginatedAuditLogsDto {
    data;
    pagination;
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("../../../database/models/audit-log.model").AuditLog] }, pagination: { required: true, type: () => PaginationMeta } };
    }
}
exports.PaginatedAuditLogsDto = PaginatedAuditLogsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [models_1.AuditLog], description: 'Array of audit logs' }),
    __metadata("design:type", Array)
], PaginatedAuditLogsDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PaginationMeta, description: 'Pagination metadata' }),
    __metadata("design:type", PaginationMeta)
], PaginatedAuditLogsDto.prototype, "pagination", void 0);
//# sourceMappingURL=paginated-audit-logs.dto.js.map