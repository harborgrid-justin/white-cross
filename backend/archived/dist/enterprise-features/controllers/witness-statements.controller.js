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
exports.WitnessStatementsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const witness_statement_service_1 = require("../witness-statement.service");
const dto_1 = require("../dto");
const base_1 = require("../../common/base");
let WitnessStatementsController = class WitnessStatementsController extends base_1.BaseController {
    witnessStatementService;
    constructor(witnessStatementService) {
        super();
        this.witnessStatementService = witnessStatementService;
    }
    captureStatement(dto) {
        return this.witnessStatementService.captureStatement({
            incidentId: dto.incidentId,
            witnessName: dto.witnessName,
            witnessRole: dto.witnessRole,
            statement: dto.statement,
            captureMethod: dto.captureMethod,
            signature: dto.signature,
        });
    }
    verifyStatement(statementId, dto) {
        return this.witnessStatementService.verifyStatement(statementId, dto.verifiedBy);
    }
    transcribeVoiceStatement(dto) {
        return this.witnessStatementService.transcribeVoiceStatement(dto.audioData);
    }
};
exports.WitnessStatementsController = WitnessStatementsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Capture witness statement' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Statement captured',
        type: dto_1.WitnessStatementResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CaptureStatementDto]),
    __metadata("design:returntype", void 0)
], WitnessStatementsController.prototype, "captureStatement", null);
__decorate([
    (0, common_1.Put)(':statementId/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify witness statement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statement verified' }),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __param(0, (0, common_1.Param)('statementId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.VerifyStatementDto]),
    __metadata("design:returntype", void 0)
], WitnessStatementsController.prototype, "verifyStatement", null);
__decorate([
    (0, common_1.Post)('transcribe'),
    (0, swagger_1.ApiOperation)({ summary: 'Transcribe voice statement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Audio transcribed' }),
    openapi.ApiResponse({ status: 201, type: String }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TranscribeVoiceStatementDto]),
    __metadata("design:returntype", void 0)
], WitnessStatementsController.prototype, "transcribeVoiceStatement", null);
exports.WitnessStatementsController = WitnessStatementsController = __decorate([
    (0, swagger_1.ApiTags)('Witness Statements'),
    (0, common_1.Controller)('enterprise-features/witness-statements'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [witness_statement_service_1.WitnessStatementService])
], WitnessStatementsController);
//# sourceMappingURL=witness-statements.controller.js.map