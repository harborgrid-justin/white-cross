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
exports.AttendanceReportsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_2 = require("sequelize");
const database_1 = require("../../database");
const base_1 = require("../../common/base");
let AttendanceReportsService = class AttendanceReportsService extends base_1.BaseService {
    chronicConditionModel;
    studentModel;
    sequelize;
    constructor(chronicConditionModel, studentModel, sequelize) {
        super("AttendanceReportsService");
        this.chronicConditionModel = chronicConditionModel;
        this.studentModel = studentModel;
        this.sequelize = sequelize;
    }
    async getAttendanceCorrelation(dto) {
        try {
            const { startDate, endDate, limit = 50 } = dto;
            const healthVisitsRaw = await this.sequelize.query(`SELECT
          "studentId",
          COUNT(*)::integer as count
        FROM health_records
        ${startDate || endDate ? 'WHERE' : ''}
        ${startDate ? `"createdAt" >= $1` : ''}
        ${startDate && endDate ? 'AND' : ''}
        ${endDate && startDate ? `"createdAt" <= $2` : endDate ? `"createdAt" <= $1` : ''}
        GROUP BY "studentId"
        ORDER BY count DESC
        LIMIT $${startDate && endDate ? 3 : startDate || endDate ? 2 : 1}`, {
                bind: [startDate, endDate, limit].filter((v) => v !== undefined),
                type: sequelize_2.QueryTypes.SELECT,
            });
            const healthVisitsWithStudents = await Promise.all(healthVisitsRaw.map(async (record) => {
                const student = await this.studentModel.findByPk(record.studentId, {
                    attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade'],
                });
                return {
                    studentId: record.studentId,
                    count: parseInt(String(record.count), 10),
                    student: student,
                };
            }));
            const incidentVisitsRaw = await this.sequelize.query(`SELECT
          "studentId",
          COUNT(*)::integer as count
        FROM incident_reports
        ${startDate || endDate ? 'WHERE' : ''}
        ${startDate ? `"occurredAt" >= $1` : ''}
        ${startDate && endDate ? 'AND' : ''}
        ${endDate && startDate ? `"occurredAt" <= $2` : endDate ? `"occurredAt" <= $1` : ''}
        GROUP BY "studentId"
        ORDER BY count DESC
        LIMIT $${startDate && endDate ? 3 : startDate || endDate ? 2 : 1}`, {
                bind: [startDate, endDate, limit].filter((v) => v !== undefined),
                type: sequelize_2.QueryTypes.SELECT,
            });
            const incidentVisitsWithStudents = await Promise.all(incidentVisitsRaw.map(async (record) => {
                const student = await this.studentModel.findByPk(record.studentId, {
                    attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade'],
                });
                return {
                    studentId: record.studentId,
                    count: parseInt(String(record.count), 10),
                    student: student,
                };
            }));
            const chronicStudents = await this.chronicConditionModel.findAll({
                include: ['student'],
            });
            const appointmentFrequencyRaw = await this.sequelize.query(`SELECT
          "studentId",
          COUNT(*)::integer as count
        FROM appointments
        ${startDate || endDate ? 'WHERE' : ''}
        ${startDate ? `"scheduledAt" >= $1` : ''}
        ${startDate && endDate ? 'AND' : ''}
        ${endDate && startDate ? `"scheduledAt" <= $2` : endDate ? `"scheduledAt" <= $1` : ''}
        GROUP BY "studentId"
        ORDER BY count DESC
        LIMIT $${startDate && endDate ? 3 : startDate || endDate ? 2 : 1}`, {
                bind: [startDate, endDate, limit].filter((v) => v !== undefined),
                type: sequelize_2.QueryTypes.SELECT,
            });
            const appointmentFrequencyWithStudents = await Promise.all(appointmentFrequencyRaw.map(async (record) => {
                const student = await this.studentModel.findByPk(record.studentId, {
                    attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade'],
                });
                return {
                    studentId: record.studentId,
                    count: parseInt(String(record.count), 10),
                    student: student,
                };
            }));
            this.logInfo(`Attendance correlation report generated: ${healthVisitsWithStudents.length} health visit patterns, ${incidentVisitsWithStudents.length} incident patterns, ${chronicStudents.length} chronic students, ${appointmentFrequencyWithStudents.length} appointment patterns`);
            return {
                healthVisits: healthVisitsWithStudents,
                incidentVisits: incidentVisitsWithStudents,
                chronicStudents,
                appointmentFrequency: appointmentFrequencyWithStudents,
            };
        }
        catch (error) {
            this.logError('Error getting attendance correlation:', error);
            throw error;
        }
    }
};
exports.AttendanceReportsService = AttendanceReportsService;
exports.AttendanceReportsService = AttendanceReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.ChronicCondition)),
    __param(1, (0, sequelize_1.InjectModel)(database_1.Student)),
    __metadata("design:paramtypes", [Object, Object, sequelize_typescript_1.Sequelize])
], AttendanceReportsService);
//# sourceMappingURL=attendance-reports.service.js.map