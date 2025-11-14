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
exports.StudentBarcodeController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../auth");
const student_service_1 = require("../student.service");
const generate_barcode_dto_1 = require("../dto/generate-barcode.dto");
const verify_barcode_dto_1 = require("../dto/verify-barcode.dto");
const base_1 = require("../../../common/base");
let StudentBarcodeController = class StudentBarcodeController extends base_1.BaseController {
    studentService;
    constructor(studentService) {
        super();
        this.studentService = studentService;
    }
    async generateBarcode(id, generateBarcodeDto) {
        return await this.studentService.generateStudentBarcode(id, generateBarcodeDto);
    }
    async verifyBarcode(verifyBarcodeDto) {
        return await this.studentService.verifyStudentBarcode(verifyBarcodeDto);
    }
    async getBarcodeInfo(id) {
        return await this.studentService.getStudentBarcodeInfo(id);
    }
    async deactivateBarcode(id) {
        return await this.studentService.deactivateStudentBarcode(id);
    }
};
exports.StudentBarcodeController = StudentBarcodeController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Generate barcode for student", summary: 'Generate barcode for student',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Generates a unique barcode for student identification. Used for attendance tracking, cafeteria access, and library systems. Requires ADMIN or COUNSELOR role.' }),
    (0, common_1.Post)(':id/barcode'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Barcode generated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error or barcode generation failed',
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
        description: 'Student already has an active barcode',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, generate_barcode_dto_1.GenerateBarcodeDto]),
    __metadata("design:returntype", Promise)
], StudentBarcodeController.prototype, "generateBarcode", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Verify barcode scan", summary: 'Verify barcode scan for student identification',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Verifies a barcode scan and returns student information. Used by attendance systems, cafeteria POS, and security checkpoints.' }),
    (0, common_1.Post)('verify-barcode'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Barcode verified successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid barcode or verification failed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Barcode not found or inactive',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_barcode_dto_1.VerifyBarcodeDto]),
    __metadata("design:returntype", Promise)
], StudentBarcodeController.prototype, "verifyBarcode", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get barcode information", summary: 'Get barcode information for student',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Returns current barcode information including status, generation date, and usage statistics.' }),
    (0, common_1.Get)(':id/barcode'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Barcode information retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found or no barcode assigned',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentBarcodeController.prototype, "getBarcodeInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Deactivate barcode", summary: 'Deactivate student barcode',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Deactivates a student barcode. Used when barcode is lost, stolen, or student graduates/transfers. Requires ADMIN or COUNSELOR role.' }),
    (0, common_1.Put)(':id/barcode/deactivate'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Barcode deactivated successfully',
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
        description: 'Student not found or no active barcode',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentBarcodeController.prototype, "deactivateBarcode", null);
exports.StudentBarcodeController = StudentBarcodeController = __decorate([
    (0, swagger_1.ApiTags)('students'),
    (0, common_1.Controller)('students'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard),
    __metadata("design:paramtypes", [student_service_1.StudentService])
], StudentBarcodeController);
//# sourceMappingURL=student-barcode.controller.js.map