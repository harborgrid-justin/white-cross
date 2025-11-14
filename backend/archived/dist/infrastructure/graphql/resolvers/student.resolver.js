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
exports.StudentResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const guards_1 = require("../guards");
const auth_1 = require("../../../services/auth");
const database_1 = require("../../../database");
const dto_1 = require("../dto");
const student_1 = require("../../../services/student");
const guards_2 = require("../guards");
let StudentResolver = class StudentResolver {
    studentService;
    constructor(studentService) {
        this.studentService = studentService;
    }
    mapContactToDto(contact) {
        return {
            id: contact.id,
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email ?? undefined,
            phone: contact.phone ?? undefined,
            type: contact.type,
            relationTo: contact.relationTo ?? undefined,
            isActive: contact.isActive,
            createdAt: contact.createdAt,
            updatedAt: contact.updatedAt,
        };
    }
    async getStudents(page, limit, orderBy, orderDirection, filters, context) {
        const studentFilters = {};
        if (filters) {
            if (filters.isActive !== undefined)
                studentFilters.isActive = filters.isActive;
            if (filters.grade)
                studentFilters.grade = filters.grade;
            if (filters.nurseId)
                studentFilters.nurseId = filters.nurseId;
            if (filters.search)
                studentFilters.search = filters.search;
        }
        const result = await this.studentService.findAll({
            page,
            limit,
            orderBy,
            orderDirection,
            ...studentFilters,
        });
        const students = result.data || [];
        const paginationData = result.meta || {};
        return {
            students: students.map((student) => ({
                ...student,
                fullName: `${student.firstName} ${student.lastName}`,
            })),
            pagination: {
                page: paginationData.page || page,
                limit: paginationData.limit || limit,
                total: paginationData.total || 0,
                totalPages: paginationData.pages || 0,
            },
        };
    }
    async getStudent(id, context) {
        const student = await this.studentService.findOne(id);
        if (!student) {
            return null;
        }
        return {
            ...student,
            gender: student.gender,
            photo: student.photo || undefined,
            medicalRecordNum: student.medicalRecordNum || undefined,
            nurseId: student.nurseId || undefined,
            createdAt: student.createdAt,
            updatedAt: student.updatedAt,
            fullName: `${student.firstName} ${student.lastName}`,
        };
    }
    async contacts(student, context) {
        try {
            const contacts = await context.loaders.contactsByStudentLoader.load(student.id);
            return (contacts || []).map((contact) => this.mapContactToDto(contact));
        }
        catch (error) {
            console.error(`Error loading contacts for student ${student.id}:`, error);
            return [];
        }
    }
    async medications(student, context) {
        try {
            const studentMedications = await context.loaders.medicationsByStudentLoader.load(student.id);
            return (studentMedications || []).map((sm) => ({
                id: sm.id,
                studentId: sm.studentId,
                name: sm.medication?.name || sm.medicationName || 'Unknown',
                dosage: sm.dosage,
                frequency: sm.frequency,
                route: sm.route,
                instructions: sm.instructions,
                prescribedBy: sm.prescribedBy,
                startDate: sm.startDate,
                endDate: sm.endDate,
                isActive: sm.isActive,
                createdAt: sm.createdAt,
                updatedAt: sm.updatedAt,
            }));
        }
        catch (error) {
            console.error(`Error loading medications for student ${student.id}:`, error);
            return [];
        }
    }
    async healthRecord(student, context) {
        try {
            return await context.loaders.healthRecordsByStudentLoader.load(student.id);
        }
        catch (error) {
            console.error(`Error loading health record for student ${student.id}:`, error);
            return null;
        }
    }
    async contactCount(student, context) {
        const contacts = await this.contacts(student, context);
        return contacts.length;
    }
    async emergencyContacts(student, context) {
        try {
            const emergencyContacts = await context.loaders.emergencyContactsByStudentLoader.load(student.id);
            return emergencyContacts || [];
        }
        catch (error) {
            console.error(`Error loading emergency contacts for student ${student.id}:`, error);
            return [];
        }
    }
    async chronicConditions(student, context) {
        try {
            const chronicConditions = await context.loaders.chronicConditionsByStudentLoader.load(student.id);
            return chronicConditions || [];
        }
        catch (error) {
            console.error(`Error loading chronic conditions for student ${student.id}:`, error);
            return [];
        }
    }
    async recentIncidents(student, context) {
        try {
            const incidents = await context.loaders.incidentsByStudentLoader.load(student.id);
            return (incidents || []).slice(0, 5);
        }
        catch (error) {
            console.error(`Error loading recent incidents for student ${student.id}:`, error);
            return [];
        }
    }
};
exports.StudentResolver = StudentResolver;
__decorate([
    (0, graphql_1.Query)(() => dto_1.StudentListResponseDto, { name: 'students' }),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN, database_1.UserRole.NURSE, database_1.UserRole.COUNSELOR),
    __param(0, (0, graphql_1.Args)('page', { type: () => Number, defaultValue: 1 })),
    __param(1, (0, graphql_1.Args)('limit', { type: () => Number, defaultValue: 20 })),
    __param(2, (0, graphql_1.Args)('orderBy', { type: () => String, defaultValue: 'lastName' })),
    __param(3, (0, graphql_1.Args)('orderDirection', { type: () => String, defaultValue: 'ASC' })),
    __param(4, (0, graphql_1.Args)('filters', { type: () => dto_1.StudentFilterInputDto, nullable: true })),
    __param(5, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, dto_1.StudentFilterInputDto, Object]),
    __metadata("design:returntype", Promise)
], StudentResolver.prototype, "getStudents", null);
__decorate([
    (0, graphql_1.Query)(() => dto_1.StudentDto, { name: 'student', nullable: true }),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN, database_1.UserRole.NURSE, database_1.UserRole.COUNSELOR),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StudentResolver.prototype, "getStudent", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [dto_1.ContactDto], { name: 'contacts', nullable: 'items' }),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.StudentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentResolver.prototype, "contacts", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [dto_1.MedicationDto], {
        name: 'medications',
        nullable: 'items',
    }),
    (0, guards_2.PHIField)(),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.StudentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentResolver.prototype, "medications", null);
__decorate([
    (0, graphql_1.ResolveField)(() => dto_1.HealthRecordDto, { name: 'healthRecord', nullable: true }),
    (0, guards_2.PHIField)(),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.StudentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentResolver.prototype, "healthRecord", null);
__decorate([
    (0, graphql_1.ResolveField)(() => Number, { name: 'contactCount' }),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.StudentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentResolver.prototype, "contactCount", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [dto_1.EmergencyContactDto], {
        name: 'emergencyContacts',
        nullable: 'items',
    }),
    (0, guards_2.PHIField)(),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.StudentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentResolver.prototype, "emergencyContacts", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [dto_1.ChronicConditionDto], {
        name: 'chronicConditions',
        nullable: 'items',
    }),
    (0, guards_2.PHIField)(),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.StudentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentResolver.prototype, "chronicConditions", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [dto_1.IncidentReportDto], {
        name: 'recentIncidents',
        nullable: 'items',
    }),
    (0, guards_2.PHIField)(),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.StudentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentResolver.prototype, "recentIncidents", null);
exports.StudentResolver = StudentResolver = __decorate([
    (0, graphql_1.Resolver)(() => dto_1.StudentDto),
    __metadata("design:paramtypes", [student_1.StudentService])
], StudentResolver);
//# sourceMappingURL=student.resolver.js.map