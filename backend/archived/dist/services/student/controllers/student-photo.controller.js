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
exports.StudentPhotoController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const auth_1 = require("../../auth");
const interceptors_1 = require("../../../health-record/interceptors");
const student_service_1 = require("../student.service");
const search_photo_dto_1 = require("../dto/search-photo.dto");
const upload_photo_dto_1 = require("../dto/upload-photo.dto");
const base_1 = require("../../../common/base");
let StudentPhotoController = class StudentPhotoController extends base_1.BaseController {
    studentService;
    constructor(studentService) {
        super();
        this.studentService = studentService;
    }
    async uploadPhoto(id, uploadPhotoDto) {
        return this.studentService.uploadStudentPhoto(id, uploadPhotoDto);
    }
    async searchByPhoto(searchPhotoDto) {
        return this.studentService.searchStudentsByPhoto(searchPhotoDto);
    }
};
exports.StudentPhotoController = StudentPhotoController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Upload student photo", summary: 'Upload student photo',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Uploads and stores student photo with metadata. Includes facial recognition indexing for identification purposes. Requires NURSE or ADMIN role. All photo uploads are audited.' }),
    (0, common_1.Post)(':id/photo'),
    (0, common_1.UseInterceptors)(interceptors_1.HealthRecordAuditInterceptor),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Student photo uploaded successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error or invalid image format',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Requires NURSE or ADMIN role',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, upload_photo_dto_1.UploadPhotoDto]),
    __metadata("design:returntype", Promise)
], StudentPhotoController.prototype, "uploadPhoto", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Search students by photo using facial recognition", summary: 'Search for student by photo using facial recognition',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Uses facial recognition to identify students from uploaded photos. Returns potential matches with confidence scores. Used for student identification in emergency situations or when student ID is unknown.' }),
    (0, common_1.Post)('photo/search'),
    (0, common_1.UseInterceptors)(interceptors_1.HealthRecordAuditInterceptor),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Photo search completed successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error or invalid image format',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Requires NURSE or ADMIN role',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_photo_dto_1.SearchPhotoDto]),
    __metadata("design:returntype", Promise)
], StudentPhotoController.prototype, "searchByPhoto", null);
exports.StudentPhotoController = StudentPhotoController = __decorate([
    (0, swagger_1.ApiTags)('students'),
    (0, common_1.Controller)('students'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard),
    __metadata("design:paramtypes", [student_service_1.StudentService])
], StudentPhotoController);
//# sourceMappingURL=student-photo.controller.js.map