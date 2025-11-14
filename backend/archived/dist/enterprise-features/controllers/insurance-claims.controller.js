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
exports.InsuranceClaimsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const insurance_claim_service_1 = require("../insurance-claim.service");
const dto_1 = require("../dto");
const base_1 = require("../../common/base");
let InsuranceClaimsController = class InsuranceClaimsController extends base_1.BaseController {
    insuranceClaimService;
    constructor(insuranceClaimService) {
        super();
        this.insuranceClaimService = insuranceClaimService;
    }
    generateClaim(dto) {
        return this.insuranceClaimService.createClaim(dto.incidentId, dto.studentId);
    }
    exportClaimToFormat(claimId, format) {
        return this.insuranceClaimService.exportClaim(claimId, format);
    }
    submitClaimElectronically(claimId) {
        return this.insuranceClaimService.submitClaimElectronically(claimId);
    }
};
exports.InsuranceClaimsController = InsuranceClaimsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate insurance claim' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Claim generated',
        type: dto_1.InsuranceClaimResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GenerateClaimDto]),
    __metadata("design:returntype", void 0)
], InsuranceClaimsController.prototype, "generateClaim", null);
__decorate([
    (0, common_1.Get)(':claimId/export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export insurance claim' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claim exported' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('claimId')),
    __param(1, (0, common_1.Query)('format')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InsuranceClaimsController.prototype, "exportClaimToFormat", null);
__decorate([
    (0, common_1.Post)(':claimId/submit'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit insurance claim electronically' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claim submitted' }),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Param)('claimId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InsuranceClaimsController.prototype, "submitClaimElectronically", null);
exports.InsuranceClaimsController = InsuranceClaimsController = __decorate([
    (0, swagger_1.ApiTags)('Insurance Claims'),
    (0, common_1.Controller)('enterprise-features/insurance-claims'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [insurance_claim_service_1.InsuranceClaimService])
], InsuranceClaimsController);
//# sourceMappingURL=insurance-claims.controller.js.map