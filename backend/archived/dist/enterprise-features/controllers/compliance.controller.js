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
exports.ComplianceController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const hipaa_compliance_service_1 = require("../hipaa-compliance.service");
const regulation_tracking_service_1 = require("../regulation-tracking.service");
const dto_1 = require("../dto");
const base_1 = require("../../common/base");
let ComplianceController = class ComplianceController extends base_1.BaseController {
    hipaaComplianceService;
    regulationTrackingService;
    constructor(hipaaComplianceService, regulationTrackingService) {
        super();
        this.hipaaComplianceService = hipaaComplianceService;
        this.regulationTrackingService = regulationTrackingService;
    }
    performComplianceAudit() {
        return this.hipaaComplianceService.performComplianceAudit();
    }
    generateComplianceReport(dto) {
        return this.hipaaComplianceService.generateComplianceReport(new Date(dto.startDate), new Date(dto.endDate));
    }
    trackRegulationChanges(state) {
        return this.regulationTrackingService.trackRegulationChanges(state);
    }
    assessImpact(regulationId) {
        return this.regulationTrackingService.assessImpact(regulationId);
    }
};
exports.ComplianceController = ComplianceController;
__decorate([
    (0, common_1.Get)('compliance/audit'),
    (0, swagger_1.ApiOperation)({ summary: 'Perform HIPAA compliance audit' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Compliance audit completed',
        type: [dto_1.HIPAAComplianceCheckResponseDto],
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "performComplianceAudit", null);
__decorate([
    (0, common_1.Get)('compliance/report'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate compliance report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Compliance report generated' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GenerateComplianceReportDto]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "generateComplianceReport", null);
__decorate([
    (0, common_1.Get)('regulations/:state'),
    (0, swagger_1.ApiOperation)({ summary: 'Track regulation changes for state' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Regulation changes retrieved',
        type: [dto_1.RegulationUpdateResponseDto],
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('state')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "trackRegulationChanges", null);
__decorate([
    (0, common_1.Get)('regulations/:regulationId/impact'),
    (0, swagger_1.ApiOperation)({ summary: 'Assess regulation impact' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Impact assessment completed' }),
    openapi.ApiResponse({ status: 200, type: [String] }),
    __param(0, (0, common_1.Param)('regulationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "assessImpact", null);
exports.ComplianceController = ComplianceController = __decorate([
    (0, swagger_1.ApiTags)('Compliance & Regulations'),
    (0, common_1.Controller)('enterprise-features'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [hipaa_compliance_service_1.HipaaComplianceService,
        regulation_tracking_service_1.RegulationTrackingService])
], ComplianceController);
//# sourceMappingURL=compliance.controller.js.map