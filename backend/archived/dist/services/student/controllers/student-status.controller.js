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
exports.StudentStatusController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../auth");
const interceptors_1 = require("../../../health-record/interceptors");
const student_status_service_1 = require("../services/student-status.service");
const transfer_student_dto_1 = require("../dto/transfer-student.dto");
const database_1 = require("../../../database");
const base_1 = require("../../../common/base");
let StudentStatusController = class StudentStatusController extends base_1.BaseController {
    statusService;
    constructor(statusService) {
        super();
        this.statusService = statusService;
    }
    async deactivate(id, reason) {
        return await this.statusService.deactivate(id, reason);
    }
    async reactivate(id) {
        return await this.statusService.reactivate(id);
    }
    async transfer(id, transferDto) {
        return await this.statusService.transfer(id, transferDto);
    }
};
exports.StudentStatusController = StudentStatusController;
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a student' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Student deactivated successfully', type: database_1.Student }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/student.model").Student }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StudentStatusController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/reactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Reactivate a student' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Student reactivated successfully', type: database_1.Student }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/student.model").Student }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentStatusController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Patch)(':id/transfer'),
    (0, swagger_1.ApiOperation)({ summary: 'Transfer a student to another school' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Student transferred successfully', type: database_1.Student }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/student.model").Student }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, transfer_student_dto_1.TransferStudentDto]),
    __metadata("design:returntype", Promise)
], StudentStatusController.prototype, "transfer", null);
exports.StudentStatusController = StudentStatusController = __decorate([
    (0, swagger_1.ApiTags)('students-status'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('students'),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)(interceptors_1.HealthRecordAuditInterceptor),
    __metadata("design:paramtypes", [student_status_service_1.StudentStatusService])
], StudentStatusController);
//# sourceMappingURL=student-status.controller.js.map