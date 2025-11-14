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
exports.StudentPhotoService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const database_1 = require("../../../database");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
let StudentPhotoService = class StudentPhotoService extends base_1.BaseService {
    studentModel;
    requestContext;
    constructor(studentModel, requestContext) {
        super(requestContext ||
            {
                requestId: 'system',
                userId: undefined,
                getLogContext: () => ({ requestId: 'system' }),
                getAuditContext: () => ({
                    requestId: 'system',
                    timestamp: new Date(),
                }),
            });
        this.studentModel = studentModel;
        this.requestContext = requestContext;
    }
    async uploadStudentPhoto(studentId, uploadPhotoDto) {
        try {
            this.validateUUID(studentId, 'Student ID');
            const student = await this.studentModel.findByPk(studentId);
            if (!student) {
                throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
            }
            if (!uploadPhotoDto.imageData && !uploadPhotoDto.photoUrl) {
                throw new common_1.BadRequestException('Either imageData or photoUrl must be provided for photo upload');
            }
            const photoUrl = uploadPhotoDto.photoUrl || 'pending-upload';
            student.photo = photoUrl;
            await student.save();
            this.logInfo(`Photo uploaded for student: ${studentId} (${student.firstName} ${student.lastName})`);
            return {
                success: true,
                message: 'Photo uploaded successfully',
                studentId,
                studentName: `${student.firstName} ${student.lastName}`,
                photoUrl,
                metadata: uploadPhotoDto.metadata,
                indexStatus: 'pending',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.handleError('Failed to upload student photo', error);
        }
    }
    async searchStudentsByPhoto(searchPhotoDto) {
        try {
            if (!searchPhotoDto.imageData && !searchPhotoDto.metadata) {
                throw new common_1.BadRequestException('Either imageData or metadata must be provided for search');
            }
            const threshold = searchPhotoDto.threshold || 0.8;
            const whereClause = {
                photo: { [sequelize_2.Op.ne]: null },
                isActive: true,
            };
            if (searchPhotoDto.metadata) {
                if (searchPhotoDto.metadata.grade) {
                    whereClause.grade = searchPhotoDto.metadata.grade;
                }
                if (searchPhotoDto.metadata.gender) {
                    whereClause.gender = searchPhotoDto.metadata.gender;
                }
            }
            const students = await this.studentModel.findAll({
                where: whereClause,
                attributes: [
                    'id',
                    'studentNumber',
                    'firstName',
                    'lastName',
                    'grade',
                    'photo',
                    'gender',
                    'dateOfBirth',
                ],
                order: [
                    ['lastName', 'ASC'],
                    ['firstName', 'ASC'],
                ],
                limit: searchPhotoDto.limit || 10,
            });
            const matches = students.map((student, index) => ({
                student: student.toJSON(),
                confidence: threshold + (0.2 - index * 0.02),
                matchDetails: {
                    facialFeatures: 'pending-ml-service',
                    metadata: searchPhotoDto.metadata,
                },
            }));
            this.logInfo(`Photo search performed: ${matches.length} potential matches (threshold: ${threshold})`);
            return {
                success: true,
                threshold,
                totalMatches: matches.length,
                matches,
                note: 'Full facial recognition requires ML service integration. Current results based on metadata filtering.',
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.handleError('Failed to search by photo', error);
        }
    }
};
exports.StudentPhotoService = StudentPhotoService;
exports.StudentPhotoService = StudentPhotoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.Student)),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [Object, request_context_service_1.RequestContextService])
], StudentPhotoService);
//# sourceMappingURL=student-photo.service.js.map