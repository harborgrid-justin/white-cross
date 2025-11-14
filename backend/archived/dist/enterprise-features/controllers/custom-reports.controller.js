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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomReportsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const custom_report_builder_service_1 = require("../custom-report-builder.service");
const dto_1 = require("../dto");
const base_1 = require("../../common/base");
let CustomReportsController = class CustomReportsController extends base_1.BaseController {
    reportBuilderService;
    constructor(reportBuilderService) {
        super();
        this.reportBuilderService = reportBuilderService;
    }
    createReportDefinition(dto) {
        return this.reportBuilderService.createReport({
            name: dto.name,
            dataSource: dto.dataSource,
            fields: dto.fields,
            filters: dto.filters,
            grouping: dto.grouping,
            sorting: dto.sorting,
            visualization: dto.visualization,
            schedule: dto.schedule,
        });
    }
    executeReport(reportId) {
        return this.reportBuilderService.executeReport(reportId);
    }
    exportReport(reportId, format) {
        return this.reportBuilderService.exportReport(reportId, format);
    }
};
exports.CustomReportsController = CustomReportsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create custom report definition' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Report definition created',
        type: dto_1.ReportDefinitionResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateReportDefinitionDto]),
    __metadata("design:returntype", void 0)
], CustomReportsController.prototype, "createReportDefinition", null);
__decorate([
    (0, common_1.Post)(':reportId/execute'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute custom report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report executed' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('reportId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomReportsController.prototype, "executeReport", null);
__decorate([
    (0, common_1.Get)(':reportId/export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export custom report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report exported' }),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('reportId')),
    __param(1, (0, common_1.Query)('format')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CustomReportsController.prototype, "exportReport", null);
exports.CustomReportsController = CustomReportsController = __decorate([
    (0, swagger_1.ApiTags)('Custom Reports'),
    (0, common_1.Controller)('enterprise-features/custom-reports'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [custom_report_builder_service_1.CustomReportBuilderService])
], CustomReportsController);
//# sourceMappingURL=custom-reports.controller.js.map