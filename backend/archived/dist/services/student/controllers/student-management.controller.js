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
exports.StudentManagementController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../auth");
const student_service_1 = require("../student.service");
const bulk_update_dto_1 = require("../dto/bulk-update.dto");
const transfer_student_dto_1 = require("../dto/transfer-student.dto");
const base_1 = require("../../../common/base");
let StudentManagementController = class StudentManagementController extends base_1.BaseController {
    studentService;
    constructor(studentService) {
        super();
        this.studentService = studentService;
    }
    async deactivate(id, reason) {
        return this.studentService.deactivate(id, reason);
    }
    async reactivate(id) {
        return this.studentService.reactivate(id);
    }
    async transfer(id, transferDto) {
        return this.studentService.transfer(id, transferDto);
    }
    async bulkUpdate(bulkUpdateDto) {
        return this.studentService.bulkUpdate(bulkUpdateDto);
    }
};
exports.StudentManagementController = StudentManagementController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Deactivate student", summary: 'Deactivate student',
        description: 'Deactivates a student by setting isActive to false. Optional reason can be provided.' }),
    (0, common_1.Patch)(':id/deactivate'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'reason',
        description: 'Reason for deactivation',
        required: false,
        type: 'string',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student deactivated successfully',
        type: 'Student',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/student.model").Student }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Query)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StudentManagementController.prototype, "deactivate", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Reactivate student", summary: 'Reactivate student',
        description: 'Reactivates a previously deactivated student by setting isActive to true.' }),
    (0, common_1.Patch)(':id/reactivate'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student reactivated successfully',
        type: 'Student',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/student.model").Student }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentManagementController.prototype, "reactivate", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Transfer student", summary: 'Transfer student',
        description: 'Transfers student to a different nurse and/or grade level.' }),
    (0, common_1.Patch)(':id/transfer'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student transferred successfully',
        type: 'Student',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student or nurse not found',
    }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/student.model").Student }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, transfer_student_dto_1.TransferStudentDto]),
    __metadata("design:returntype", Promise)
], StudentManagementController.prototype, "transfer", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Bulk update students", summary: 'Bulk update students',
        description: 'Updates multiple students with the same data (nurse, grade, or active status).' }),
    (0, common_1.Post)('bulk-update'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Students updated successfully',
        schema: {
            type: 'object',
            properties: {
                updated: { type: 'number', example: 15 },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_update_dto_1.StudentBulkUpdateDto]),
    __metadata("design:returntype", Promise)
], StudentManagementController.prototype, "bulkUpdate", null);
exports.StudentManagementController = StudentManagementController = __decorate([
    (0, swagger_1.ApiTags)('students'),
    (0, common_1.Controller)('students'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard),
    __metadata("design:paramtypes", [student_service_1.StudentService])
], StudentManagementController);
//# sourceMappingURL=student-management.controller.js.map