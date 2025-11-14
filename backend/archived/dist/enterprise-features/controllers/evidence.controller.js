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
exports.EvidenceController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const photo_video_evidence_service_1 = require("../photo-video-evidence.service");
const dto_1 = require("../dto");
const base_1 = require("../../common/base");
let EvidenceController = class EvidenceController extends base_1.BaseController {
    evidenceService;
    constructor(evidenceService) {
        super();
        this.evidenceService = evidenceService;
    }
    uploadEvidence(dto) {
        return this.evidenceService.uploadEvidence(dto.incidentId, dto.fileData, dto.type, dto.uploadedBy);
    }
    getEvidenceWithAudit(evidenceId, accessedBy) {
        return this.evidenceService.getEvidenceWithAudit(evidenceId, accessedBy);
    }
    deleteEvidence(evidenceId, dto) {
        return this.evidenceService.deleteEvidence(evidenceId, dto.deletedBy, dto.reason);
    }
};
exports.EvidenceController = EvidenceController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Upload evidence file' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Evidence uploaded',
        type: dto_1.EvidenceFileResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.UploadEvidenceDto]),
    __metadata("design:returntype", void 0)
], EvidenceController.prototype, "uploadEvidence", null);
__decorate([
    (0, common_1.Get)(':evidenceId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get evidence with audit trail' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Evidence retrieved' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('evidenceId')),
    __param(1, (0, common_1.Query)('accessedBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EvidenceController.prototype, "getEvidenceWithAudit", null);
__decorate([
    (0, common_1.Delete)(':evidenceId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete evidence file' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Evidence deleted' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Boolean }),
    __param(0, (0, common_1.Param)('evidenceId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.DeleteEvidenceDto]),
    __metadata("design:returntype", void 0)
], EvidenceController.prototype, "deleteEvidence", null);
exports.EvidenceController = EvidenceController = __decorate([
    (0, swagger_1.ApiTags)('Evidence Management'),
    (0, common_1.Controller)('enterprise-features/evidence'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [photo_video_evidence_service_1.PhotoVideoEvidenceService])
], EvidenceController);
//# sourceMappingURL=evidence.controller.js.map