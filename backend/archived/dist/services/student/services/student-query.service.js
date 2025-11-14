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
exports.StudentQueryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const database_1 = require("../../../database");
const services_1 = require("../../../database/services");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
let StudentQueryService = class StudentQueryService extends base_1.BaseService {
    studentModel;
    queryCacheService;
    requestContext;
    constructor(studentModel, queryCacheService, requestContext) {
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
        this.queryCacheService = queryCacheService;
        this.requestContext = requestContext;
    }
    async findAll(filterDto) {
        try {
            const { page = 1, limit = 20, search, grade, isActive, nurseId, gender } = filterDto;
            const where = {};
            if (search) {
                where[sequelize_2.Op.or] = [
                    { firstName: { [sequelize_2.Op.iLike]: `%${search}%` } },
                    { lastName: { [sequelize_2.Op.iLike]: `%${search}%` } },
                    { studentNumber: { [sequelize_2.Op.iLike]: `%${search}%` } },
                ];
            }
            if (grade) {
                where.grade = grade;
            }
            if (isActive !== undefined) {
                where.isActive = isActive;
            }
            if (nurseId) {
                where.nurseId = nurseId;
            }
            if (gender) {
                where.gender = gender;
            }
            const offset = (page - 1) * limit;
            const { rows: data, count: total } = await this.studentModel.findAndCountAll({
                where,
                offset,
                limit,
                order: [
                    ['lastName', 'ASC'],
                    ['firstName', 'ASC'],
                ],
                include: [
                    {
                        model: database_1.User,
                        as: 'nurse',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
                        required: false,
                    },
                ],
                attributes: {
                    exclude: ['schoolId', 'districtId'],
                },
                distinct: true,
            });
            return {
                data,
                meta: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            this.handleError('Failed to fetch students', error);
        }
    }
    async search(query, limit = 20) {
        try {
            return await this.studentModel.findAll({
                where: {
                    isActive: true,
                    [sequelize_2.Op.or]: [
                        { firstName: { [sequelize_2.Op.iLike]: `%${query}%` } },
                        { lastName: { [sequelize_2.Op.iLike]: `%${query}%` } },
                        { studentNumber: { [sequelize_2.Op.iLike]: `%${query}%` } },
                    ],
                },
                order: [
                    ['lastName', 'ASC'],
                    ['firstName', 'ASC'],
                ],
                limit,
            });
        }
        catch (error) {
            this.handleError('Failed to search students', error);
        }
    }
    async findByGrade(grade) {
        try {
            return await this.queryCacheService.findWithCache(this.studentModel, {
                where: { grade, isActive: true },
                order: [
                    ['lastName', 'ASC'],
                    ['firstName', 'ASC'],
                ],
            }, {
                ttl: 300,
                keyPrefix: 'student_grade',
                invalidateOn: ['create', 'update', 'destroy'],
            });
        }
        catch (error) {
            this.handleError('Failed to fetch students by grade', error);
        }
    }
    async findAllGrades() {
        try {
            const result = await this.studentModel.findAll({
                attributes: [
                    [
                        this.studentModel.sequelize.fn('DISTINCT', this.studentModel.sequelize.col('grade')),
                        'grade',
                    ],
                ],
                where: { isActive: true },
                order: [['grade', 'ASC']],
                raw: true,
            });
            return result.map((r) => r.grade);
        }
        catch (error) {
            this.handleError('Failed to fetch grades', error);
        }
    }
    async findAssignedStudents(nurseId) {
        try {
            this.validateUUID(nurseId, 'Nurse ID');
            return await this.studentModel.findAll({
                where: { nurseId, isActive: true },
                attributes: [
                    'id',
                    'studentNumber',
                    'firstName',
                    'lastName',
                    'grade',
                    'dateOfBirth',
                    'gender',
                    'photo',
                ],
                order: [
                    ['lastName', 'ASC'],
                    ['firstName', 'ASC'],
                ],
            });
        }
        catch (error) {
            this.handleError('Failed to fetch assigned students', error);
        }
    }
    async findByIds(ids) {
        try {
            const students = await this.studentModel.findAll({
                where: {
                    id: { [sequelize_2.Op.in]: ids },
                },
            });
            const studentMap = new Map(students.map((s) => [s.id, s]));
            return ids.map((id) => studentMap.get(id) || null);
        }
        catch (error) {
            this.logger.error(`Failed to batch fetch students: ${error.message}`);
            throw new common_1.BadRequestException('Failed to batch fetch students');
        }
    }
    async findBySchoolIds(schoolIds) {
        try {
            const students = await this.studentModel.findAll({
                where: {
                    schoolId: { [sequelize_2.Op.in]: schoolIds },
                    isActive: true,
                },
                order: [
                    ['lastName', 'ASC'],
                    ['firstName', 'ASC'],
                ],
                include: [
                    {
                        model: database_1.User,
                        as: 'nurse',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
                        required: false,
                    },
                ],
            });
            const studentsBySchool = new Map();
            students.forEach((student) => {
                const schoolId = student.schoolId;
                if (schoolId) {
                    if (!studentsBySchool.has(schoolId)) {
                        studentsBySchool.set(schoolId, []);
                    }
                    studentsBySchool.get(schoolId).push(student);
                }
            });
            return schoolIds.map((id) => studentsBySchool.get(id) || []);
        }
        catch (error) {
            this.logger.error(`Failed to batch fetch students by school IDs: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to batch fetch students by school IDs');
        }
    }
};
exports.StudentQueryService = StudentQueryService;
exports.StudentQueryService = StudentQueryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.Student)),
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [Object, services_1.QueryCacheService,
        request_context_service_1.RequestContextService])
], StudentQueryService);
//# sourceMappingURL=student-query.service.js.map