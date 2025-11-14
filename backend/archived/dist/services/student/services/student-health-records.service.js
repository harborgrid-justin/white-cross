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
exports.StudentHealthRecordsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../../../database");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
let StudentHealthRecordsService = class StudentHealthRecordsService extends base_1.BaseService {
    studentModel;
    healthRecordModel;
    mentalHealthRecordModel;
    userModel;
    requestContext;
    constructor(studentModel, healthRecordModel, mentalHealthRecordModel, userModel, requestContext) {
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
        this.healthRecordModel = healthRecordModel;
        this.mentalHealthRecordModel = mentalHealthRecordModel;
        this.userModel = userModel;
        this.requestContext = requestContext;
    }
    async getStudentHealthRecords(studentId, page = 1, limit = 20) {
        try {
            this.validateUUID(studentId, 'Student ID');
            await this.verifyStudentExists(studentId);
            const offset = (page - 1) * limit;
            const { rows: healthRecords, count: total } = await this.healthRecordModel.findAndCountAll({
                where: { studentId },
                offset,
                limit,
                order: [
                    ['recordDate', 'DESC'],
                    ['createdAt', 'DESC'],
                ],
                attributes: {
                    exclude: ['updatedBy'],
                },
            });
            const pages = Math.ceil(total / limit);
            this.logInfo(`Health records retrieved for student: ${studentId} (${total} total, page ${page}/${pages})`);
            return {
                data: healthRecords,
                meta: {
                    page,
                    limit,
                    total,
                    pages,
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to retrieve health records', error);
        }
    }
    async getStudentMentalHealthRecords(studentId, page = 1, limit = 20) {
        try {
            this.validateUUID(studentId, 'Student ID');
            await this.verifyStudentExists(studentId);
            const offset = (page - 1) * limit;
            const { rows: mentalHealthRecords, count: total } = await this.mentalHealthRecordModel.findAndCountAll({
                where: { studentId },
                offset,
                limit,
                distinct: true,
                order: [
                    ['recordDate', 'DESC'],
                    ['createdAt', 'DESC'],
                ],
                attributes: {
                    exclude: ['updatedBy', 'sessionNotes'],
                },
                include: [
                    {
                        model: this.userModel,
                        as: 'counselor',
                        required: false,
                        attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
                    },
                    {
                        model: this.userModel,
                        as: 'creator',
                        required: false,
                        attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
                    },
                ],
            });
            const pages = Math.ceil(total / limit);
            this.logInfo(`Mental health records retrieved for student: ${studentId} (${total} total, page ${page}/${pages}) - Access requires appropriate authorization`);
            return {
                data: mentalHealthRecords,
                meta: {
                    page,
                    limit,
                    total,
                    pages,
                },
                accessControl: {
                    requiresAuthorization: true,
                    permittedRoles: ['COUNSELOR', 'MENTAL_HEALTH_SPECIALIST', 'ADMIN'],
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to retrieve mental health records', error);
        }
    }
    async verifyStudentExists(studentId) {
        const student = await this.studentModel.findByPk(studentId);
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
        }
        return student;
    }
};
exports.StudentHealthRecordsService = StudentHealthRecordsService;
exports.StudentHealthRecordsService = StudentHealthRecordsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.Student)),
    __param(1, (0, sequelize_1.InjectModel)(database_1.HealthRecord)),
    __param(2, (0, sequelize_1.InjectModel)(database_1.MentalHealthRecord)),
    __param(3, (0, sequelize_1.InjectModel)(database_1.User)),
    __param(4, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [Object, Object, Object, Object, request_context_service_1.RequestContextService])
], StudentHealthRecordsService);
//# sourceMappingURL=student-health-records.service.js.map