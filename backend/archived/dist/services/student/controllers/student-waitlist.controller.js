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
exports.StudentWaitlistController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../auth");
const student_service_1 = require("../student.service");
const add_waitlist_dto_1 = require("../dto/add-waitlist.dto");
const waitlist_priority_dto_1 = require("../dto/waitlist-priority.dto");
const base_1 = require("../../../common/base");
let StudentWaitlistController = class StudentWaitlistController extends base_1.BaseController {
    studentService;
    constructor(studentService) {
        super();
        this.studentService = studentService;
    }
    async addToWaitlist(id, addToWaitlistDto) {
        return await this.studentService.addStudentToWaitlist(id, addToWaitlistDto);
    }
    async updateWaitlistPriority(id, priorityDto) {
        return await this.studentService.updateWaitlistPriority(id, priorityDto);
    }
    async admitFromWaitlist(id) {
        return await this.studentService.admitStudentFromWaitlist(id);
    }
    async removeFromWaitlist(id) {
        return await this.studentService.removeStudentFromWaitlist(id);
    }
    async getWaitlistStatus(id) {
        return await this.studentService.getStudentWaitlistStatus(id);
    }
    async getWaitlistOverview(grade) {
        return await this.studentService.getWaitlistOverview(grade);
    }
};
exports.StudentWaitlistController = StudentWaitlistController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Add student to waitlist", summary: 'Add student to enrollment waitlist',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Adds a student to the enrollment waitlist with priority ranking. Used when school capacity is reached. Requires ADMIN or COUNSELOR role.' }),
    (0, common_1.Post)(':id/waitlist'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Student added to waitlist successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error or student already enrolled',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Requires ADMIN or COUNSELOR role',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Student already on waitlist',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_waitlist_dto_1.AddWaitlistDto]),
    __metadata("design:returntype", Promise)
], StudentWaitlistController.prototype, "addToWaitlist", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update waitlist priority", summary: 'Update student waitlist priority',
        description: "HIGHLY SENSITIVE PHI ENDPOINT - Updates a student's priority position on the waitlist. Used for special circumstances or sibling preferences. Requires ADMIN role." }),
    (0, common_1.Put)(':id/waitlist/priority'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Waitlist priority updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error or invalid priority',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Requires ADMIN role',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found on waitlist',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, waitlist_priority_dto_1.WaitlistPriorityDto]),
    __metadata("design:returntype", Promise)
], StudentWaitlistController.prototype, "updateWaitlistPriority", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Admit student from waitlist", summary: 'Admit student from waitlist to enrollment',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Processes admission of a student from the waitlist to active enrollment. Updates enrollment records and removes from waitlist. Requires ADMIN role.' }),
    (0, common_1.Post)(':id/waitlist/admit'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student admitted from waitlist successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error or admission failed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Requires ADMIN role',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found on waitlist',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentWaitlistController.prototype, "admitFromWaitlist", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Remove student from waitlist", summary: 'Remove student from waitlist',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Removes a student from the enrollment waitlist. Used when student enrolls elsewhere or family withdraws application. Requires ADMIN or COUNSELOR role.' }),
    (0, common_1.Delete)(':id/waitlist'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student removed from waitlist successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Requires ADMIN or COUNSELOR role',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found on waitlist',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentWaitlistController.prototype, "removeFromWaitlist", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get waitlist status", summary: 'Get student waitlist status and position',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Returns current waitlist status, position, priority, and estimated admission timeline for a student.' }),
    (0, common_1.Get)(':id/waitlist'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Waitlist status retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found on waitlist',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentWaitlistController.prototype, "getWaitlistStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get waitlist overview", summary: 'Get waitlist overview and statistics',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Returns comprehensive waitlist statistics including total students, grade distribution, priority breakdown, and estimated wait times. Requires ADMIN role.' }),
    (0, common_1.Get)('waitlist/overview'),
    (0, swagger_1.ApiQuery)({
        name: 'grade',
        required: false,
        description: 'Filter by grade level',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Waitlist overview retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Requires ADMIN role',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('grade')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentWaitlistController.prototype, "getWaitlistOverview", null);
exports.StudentWaitlistController = StudentWaitlistController = __decorate([
    (0, swagger_1.ApiTags)('students'),
    (0, common_1.Controller)('students'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard),
    __metadata("design:paramtypes", [student_service_1.StudentService])
], StudentWaitlistController);
//# sourceMappingURL=student-waitlist.controller.js.map