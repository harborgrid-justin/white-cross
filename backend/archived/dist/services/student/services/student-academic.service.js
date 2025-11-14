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
exports.StudentAcademicService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../../../database");
const academic_transcript_service_1 = require("../../academic-transcript/academic-transcript.service");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
let StudentAcademicService = class StudentAcademicService extends base_1.BaseService {
    studentModel;
    academicTranscriptService;
    requestContext;
    constructor(studentModel, academicTranscriptService, requestContext) {
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
        this.academicTranscriptService = academicTranscriptService;
        this.requestContext = requestContext;
    }
    async importAcademicTranscript(studentId, importTranscriptDto) {
        try {
            this.validateUUID(studentId, 'Student ID');
            const student = await this.studentModel.findByPk(studentId);
            if (!student) {
                throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
            }
            if (!importTranscriptDto.grades || importTranscriptDto.grades.length === 0) {
                throw new common_1.BadRequestException('Transcript must include at least one course grade');
            }
            const transcriptData = {
                studentId,
                academicYear: importTranscriptDto.academicYear,
                semester: 'N/A',
                subjects: importTranscriptDto.grades.map((grade) => ({
                    subjectName: grade.courseName,
                    subjectCode: grade.courseName,
                    grade: grade.grade,
                    percentage: grade.numericGrade || 0,
                    credits: grade.credits || 0,
                    teacher: 'N/A',
                })),
                attendance: {
                    totalDays: (importTranscriptDto.daysPresent || 0) + (importTranscriptDto.daysAbsent || 0),
                    presentDays: importTranscriptDto.daysPresent || 0,
                    absentDays: importTranscriptDto.daysAbsent || 0,
                    tardyDays: 0,
                    attendanceRate: importTranscriptDto.daysPresent &&
                        importTranscriptDto.daysPresent + (importTranscriptDto.daysAbsent || 0) > 0
                        ? Math.round((importTranscriptDto.daysPresent /
                            (importTranscriptDto.daysPresent + (importTranscriptDto.daysAbsent || 0))) *
                            1000) / 10
                        : 100,
                },
                behavior: {
                    conductGrade: 'N/A',
                    incidents: 0,
                    commendations: 0,
                },
                importedBy: 'system',
            };
            const transcript = await this.academicTranscriptService.importTranscript(transcriptData);
            this.logInfo(`Academic transcript imported for student: ${studentId} (${student.firstName} ${student.lastName}), ` +
                `Year: ${importTranscriptDto.academicYear}, Courses: ${importTranscriptDto.grades.length}, GPA: ${transcript.gpa}`);
            return {
                success: true,
                message: 'Academic transcript imported successfully',
                studentId,
                studentName: `${student.firstName} ${student.lastName}`,
                transcript: {
                    id: transcript.id,
                    academicYear: transcript.academicYear,
                    semester: transcript.semester,
                    gpa: transcript.gpa,
                    courseCount: transcript.subjects.length,
                    totalCredits: importTranscriptDto.totalCredits,
                    achievements: importTranscriptDto.achievements,
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.handleError('Failed to import academic transcript', error);
        }
    }
    async getAcademicHistory(studentId, query) {
        try {
            this.validateUUID(studentId, 'Student ID');
            const student = await this.studentModel.findByPk(studentId);
            if (!student) {
                throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
            }
            const transcripts = await this.academicTranscriptService.getAcademicHistory(studentId);
            const filteredTranscripts = query.academicYear
                ? transcripts.filter((t) => t.academicYear === query.academicYear)
                : transcripts;
            const summary = {
                totalTranscripts: filteredTranscripts.length,
                averageGPA: filteredTranscripts.length > 0
                    ? Math.round((filteredTranscripts.reduce((sum, t) => sum + t.gpa, 0) /
                        filteredTranscripts.length) *
                        100) / 100
                    : 0,
                highestGPA: filteredTranscripts.length > 0 ? Math.max(...filteredTranscripts.map((t) => t.gpa)) : 0,
                lowestGPA: filteredTranscripts.length > 0 ? Math.min(...filteredTranscripts.map((t) => t.gpa)) : 0,
            };
            this.logInfo(`Academic history retrieved for student: ${studentId} (${filteredTranscripts.length} records, Avg GPA: ${summary.averageGPA})`);
            return {
                success: true,
                studentId,
                studentName: `${student.firstName} ${student.lastName}`,
                filters: query,
                summary,
                transcripts: filteredTranscripts,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to retrieve academic history', error);
        }
    }
    async getPerformanceTrends(studentId, query) {
        try {
            this.validateUUID(studentId, 'Student ID');
            const student = await this.studentModel.findByPk(studentId);
            if (!student) {
                throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
            }
            const analysis = await this.academicTranscriptService.analyzePerformanceTrends(studentId);
            const enhancedAnalysis = {
                ...analysis,
                analysisParams: {
                    yearsToAnalyze: query.yearsToAnalyze,
                    semestersToAnalyze: query.semestersToAnalyze,
                },
                student: {
                    id: studentId,
                    name: `${student.firstName} ${student.lastName}`,
                    currentGrade: student.grade,
                },
            };
            this.logInfo(`Performance trends analyzed for student: ${studentId} - ` +
                `GPA Trend: ${enhancedAnalysis.gpa?.trend || 'N/A'}, ` +
                `Attendance Trend: ${enhancedAnalysis.attendance?.trend || 'N/A'}`);
            return {
                success: true,
                ...enhancedAnalysis,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to analyze performance trends', error);
        }
    }
    async performBulkGradeTransition(bulkGradeTransitionDto) {
        try {
            const isDryRun = bulkGradeTransitionDto.dryRun || false;
            const effectiveDate = new Date(bulkGradeTransitionDto.effectiveDate);
            const criteria = bulkGradeTransitionDto.criteria || {};
            const minimumGpa = criteria.minimumGpa || 2.0;
            const minimumAttendance = criteria.minimumAttendance || 0.9;
            const requirePassingGrades = criteria.requirePassingGrades !== false;
            const students = await this.studentModel.findAll({
                where: { isActive: true },
                order: [
                    ['grade', 'ASC'],
                    ['lastName', 'ASC'],
                ],
            });
            const gradeProgression = {
                K: '1',
                '1': '2',
                '2': '3',
                '3': '4',
                '4': '5',
                '5': '6',
                '6': '7',
                '7': '8',
                '8': '9',
                '9': '10',
                '10': '11',
                '11': '12',
                '12': 'GRADUATED',
            };
            const results = {
                total: students.length,
                promoted: 0,
                retained: 0,
                graduated: 0,
                details: [],
            };
            for (const student of students) {
                const studentId = student.id;
                const currentGrade = student.grade;
                const nextGrade = gradeProgression[currentGrade] || currentGrade;
                const meetsGpaCriteria = true;
                const meetsAttendanceCriteria = true;
                const hasPassingGrades = true;
                const meetsCriteria = meetsGpaCriteria &&
                    meetsAttendanceCriteria &&
                    (!requirePassingGrades || hasPassingGrades);
                let action;
                let newGrade;
                if (meetsCriteria) {
                    if (nextGrade === 'GRADUATED') {
                        action = 'graduated';
                        newGrade = '12';
                        results.graduated++;
                    }
                    else {
                        action = 'promoted';
                        newGrade = nextGrade;
                        results.promoted++;
                    }
                }
                else {
                    action = 'retained';
                    newGrade = currentGrade;
                    results.retained++;
                }
                results.details.push({
                    studentId,
                    studentNumber: student.studentNumber,
                    studentName: `${student.firstName} ${student.lastName}`,
                    currentGrade,
                    newGrade,
                    action,
                    meetsCriteria: {
                        gpa: meetsGpaCriteria,
                        attendance: meetsAttendanceCriteria,
                        passingGrades: hasPassingGrades,
                    },
                });
                if (!isDryRun && action !== 'retained') {
                    student.grade = newGrade;
                    await student.save();
                    this.logInfo(`Student ${action}: ${studentId} (${student.studentNumber}) from ${currentGrade} to ${newGrade}`);
                }
            }
            const summaryMessage = isDryRun
                ? `Bulk grade transition DRY RUN completed`
                : `Bulk grade transition executed successfully`;
            this.logInfo(`${summaryMessage}: ${results.total} students processed, ` +
                `${results.promoted} promoted, ${results.retained} retained, ${results.graduated} graduated ` +
                `(Effective: ${effectiveDate.toISOString()})`);
            return {
                success: true,
                message: summaryMessage,
                effectiveDate: effectiveDate.toISOString(),
                dryRun: isDryRun,
                criteria: {
                    minimumGpa,
                    minimumAttendance,
                    requirePassingGrades,
                },
                results: {
                    total: results.total,
                    promoted: results.promoted,
                    retained: results.retained,
                    graduated: results.graduated,
                },
                details: results.details,
            };
        }
        catch (error) {
            this.handleError('Failed to perform bulk grade transition', error);
        }
    }
    async getGraduatingStudents(query) {
        try {
            const academicYear = query.academicYear || new Date().getFullYear().toString();
            const minimumGpa = query.minimumGpa || 2.0;
            const minimumCredits = query.minimumCredits || 24;
            const students = await this.studentModel.findAll({
                where: {
                    grade: '12',
                    isActive: true,
                },
                order: [
                    ['lastName', 'ASC'],
                    ['firstName', 'ASC'],
                ],
            });
            const studentIds = students.map((s) => s.id);
            const allTranscriptsMap = studentIds.length > 0
                ? await this.academicTranscriptService.batchGetAcademicHistories(studentIds)
                : new Map();
            const eligibleStudents = [];
            const ineligibleStudents = [];
            for (const student of students) {
                const transcripts = allTranscriptsMap.get(student.id) || [];
                let cumulativeGpa = 0;
                let totalCredits = 0;
                let totalTranscripts = 0;
                for (const transcript of transcripts) {
                    if (transcript.gpa && transcript.gpa > 0) {
                        cumulativeGpa += transcript.gpa;
                        totalTranscripts++;
                    }
                    if (transcript.subjects && Array.isArray(transcript.subjects)) {
                        totalCredits += transcript.subjects.reduce((sum, subject) => sum + (subject.credits || 0), 0);
                    }
                }
                const averageGpa = totalTranscripts > 0 ? cumulativeGpa / totalTranscripts : 0;
                const meetsGpaRequirement = averageGpa >= minimumGpa;
                const meetsCreditsRequirement = totalCredits >= minimumCredits;
                const isEligible = meetsGpaRequirement && meetsCreditsRequirement;
                const studentData = {
                    studentId: student.id,
                    studentNumber: student.studentNumber,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    fullName: `${student.firstName} ${student.lastName}`,
                    dateOfBirth: student.dateOfBirth,
                    grade: student.grade,
                    academicMetrics: {
                        cumulativeGpa: Math.round(averageGpa * 100) / 100,
                        totalCredits,
                        transcriptCount: totalTranscripts,
                    },
                    eligibilityCriteria: {
                        gpa: {
                            required: minimumGpa,
                            actual: Math.round(averageGpa * 100) / 100,
                            meets: meetsGpaRequirement,
                        },
                        credits: {
                            required: minimumCredits,
                            actual: totalCredits,
                            meets: meetsCreditsRequirement,
                        },
                    },
                    isEligible,
                };
                if (isEligible) {
                    eligibleStudents.push(studentData);
                }
                else {
                    ineligibleStudents.push(studentData);
                }
            }
            this.logInfo(`Graduating students query: ${eligibleStudents.length} eligible, ${ineligibleStudents.length} ineligible ` +
                `(Year: ${academicYear}, Min GPA: ${minimumGpa}, Min Credits: ${minimumCredits})`);
            return {
                success: true,
                academicYear,
                criteria: {
                    minimumGpa,
                    minimumCredits,
                },
                summary: {
                    totalStudents: students.length,
                    eligible: eligibleStudents.length,
                    ineligible: ineligibleStudents.length,
                },
                eligibleStudents,
                ineligibleStudents,
            };
        }
        catch (error) {
            this.handleError('Failed to retrieve graduating students', error);
        }
    }
    async advanceStudentGrade(id, gradeTransitionDto) {
        try {
            this.validateUUID(id, 'Student ID');
            const student = await this.studentModel.findByPk(id);
            if (!student) {
                throw new common_1.NotFoundException(`Student with ID ${id} not found`);
            }
            const currentGrade = student.grade;
            const newGrade = gradeTransitionDto.newGrade;
            const effectiveDate = gradeTransitionDto.effectiveDate ? new Date(gradeTransitionDto.effectiveDate) : new Date();
            student.grade = newGrade;
            await student.save();
            this.logInfo(`Student advanced: ${id} (${student.firstName} ${student.lastName}) from ${currentGrade} to ${newGrade}`);
            return {
                success: true,
                studentId: id,
                studentName: `${student.firstName} ${student.lastName}`,
                previousGrade: currentGrade,
                newGrade,
                effectiveDate,
                reason: gradeTransitionDto.reason,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to advance student grade', error);
        }
    }
    async retainStudentGrade(id, gradeTransitionDto) {
        try {
            this.validateUUID(id, 'Student ID');
            const student = await this.studentModel.findByPk(id);
            if (!student) {
                throw new common_1.NotFoundException(`Student with ID ${id} not found`);
            }
            const currentGrade = student.grade;
            const effectiveDate = gradeTransitionDto.effectiveDate ? new Date(gradeTransitionDto.effectiveDate) : new Date();
            this.logInfo(`Student retained: ${id} (${student.firstName} ${student.lastName}) in grade ${currentGrade}`);
            return {
                success: true,
                studentId: id,
                studentName: `${student.firstName} ${student.lastName}`,
                grade: currentGrade,
                effectiveDate,
                reason: gradeTransitionDto.reason,
                action: 'retained',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to retain student grade', error);
        }
    }
    async processStudentGraduation(id, graduationDto) {
        try {
            this.validateUUID(id, 'Student ID');
            const student = await this.studentModel.findByPk(id);
            if (!student) {
                throw new common_1.NotFoundException(`Student with ID ${id} not found`);
            }
            const graduationDate = graduationDto.graduationDate ? new Date(graduationDto.graduationDate) : new Date();
            student.grade = 'GRADUATED';
            student.isActive = false;
            await student.save();
            this.logInfo(`Student graduated: ${id} (${student.firstName} ${student.lastName}) on ${graduationDate.toISOString().split('T')[0]}`);
            return {
                success: true,
                studentId: id,
                studentName: `${student.firstName} ${student.lastName}`,
                graduationDate,
                diplomaNumber: graduationDto.diplomaNumber,
                honors: graduationDto.honors,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to process student graduation', error);
        }
    }
    async getGradeTransitionHistory(id) {
        try {
            this.validateUUID(id, 'Student ID');
            const student = await this.studentModel.findByPk(id);
            if (!student) {
                throw new common_1.NotFoundException(`Student with ID ${id} not found`);
            }
            const history = [
                {
                    date: student.createdAt,
                    action: 'enrolled',
                    grade: student.grade,
                    reason: 'Initial enrollment',
                },
            ];
            this.logInfo(`Grade transition history retrieved for student: ${id}`);
            return {
                success: true,
                studentId: id,
                studentName: `${student.firstName} ${student.lastName}`,
                currentGrade: student.grade,
                history,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to retrieve grade transition history', error);
        }
    }
};
exports.StudentAcademicService = StudentAcademicService;
exports.StudentAcademicService = StudentAcademicService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.Student)),
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [Object, academic_transcript_service_1.AcademicTranscriptService,
        request_context_service_1.RequestContextService])
], StudentAcademicService);
//# sourceMappingURL=student-academic.service.js.map