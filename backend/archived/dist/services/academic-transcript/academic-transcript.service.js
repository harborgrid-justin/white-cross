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
exports.AcademicTranscriptService = void 0;
const common_1 = require("@nestjs/common");
const request_context_service_1 = require("../../common/context/request-context.service");
const base_1 = require("../../common/base");
const academic_transcript_repository_1 = require("../../database/repositories/impl/academic-transcript.repository");
const student_repository_1 = require("../../database/repositories/impl/student.repository");
let AcademicTranscriptService = class AcademicTranscriptService extends base_1.BaseService {
    requestContext;
    academicTranscriptRepository;
    studentRepository;
    constructor(requestContext, academicTranscriptRepository, studentRepository) {
        super(requestContext);
        this.requestContext = requestContext;
        this.academicTranscriptRepository = academicTranscriptRepository;
        this.studentRepository = studentRepository;
    }
    async importTranscript(data) {
        try {
            const { studentId, academicYear, semester, subjects, attendance, behavior, importedBy, } = data;
            const student = await this.studentRepository.findById(studentId);
            if (!student) {
                throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
            }
            const existingResults = await this.academicTranscriptRepository.findMany({
                where: {
                    studentId,
                    academicYear,
                    semester,
                },
                pagination: { page: 1, limit: 1 },
            });
            const existingTranscript = existingResults.data.length > 0 ? existingResults.data[0] : null;
            if (existingTranscript) {
                throw new common_1.ConflictException(`Academic transcript already exists for student ${studentId}, ${academicYear} ${semester}. Use update operation instead.`);
            }
            const gpa = this.calculateGPA(subjects);
            const transcript = await this.academicTranscriptRepository.create({
                studentId,
                academicYear,
                semester,
                grade: student.grade,
                gpa,
                subjects: subjects,
                attendance: attendance,
                behavior: behavior || {
                    conductGrade: 'N/A',
                    incidents: 0,
                    commendations: 0,
                },
                importedBy,
                importedAt: new Date(),
                importSource: 'API',
            }, {
                userId: importedBy || 'system',
                userRole: 'SYSTEM',
                timestamp: new Date(),
            });
            this.logger.log(`Academic transcript imported: Student ${studentId}, ${academicYear} ${semester}, GPA: ${gpa}, imported by ${importedBy}`);
            return {
                id: transcript.id,
                studentId: transcript.studentId,
                academicYear: transcript.academicYear,
                semester: transcript.semester,
                grade: transcript.grade,
                gpa: transcript.gpa,
                subjects: transcript.subjects,
                attendance: transcript.attendance,
                behavior: transcript.behavior,
                createdAt: transcript.createdAt || new Date(),
                updatedAt: transcript.updatedAt || new Date(),
            };
        }
        catch (error) {
            this.logger.error(`Error importing academic transcript: ${error.message}`, error.stack);
            throw error;
        }
    }
    calculateGPA(subjects) {
        if (subjects.length === 0)
            return 0;
        const gradePoints = {
            'A+': 4.0,
            A: 4.0,
            'A-': 3.7,
            'B+': 3.3,
            B: 3.0,
            'B-': 2.7,
            'C+': 2.3,
            C: 2.0,
            'C-': 1.7,
            'D+': 1.3,
            D: 1.0,
            'D-': 0.7,
            F: 0.0,
        };
        let totalPoints = 0;
        let totalCredits = 0;
        subjects.forEach((subject) => {
            const points = gradePoints[subject.grade] || 0;
            totalPoints += points * subject.credits;
            totalCredits += subject.credits;
        });
        return totalCredits > 0
            ? Math.round((totalPoints / totalCredits) * 100) / 100
            : 0;
    }
    async getAcademicHistory(studentId) {
        try {
            const student = await this.studentRepository.findById(studentId);
            if (!student) {
                throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
            }
            const transcriptResults = await this.academicTranscriptRepository.findMany({
                where: { studentId },
                orderBy: { academicYear: 'DESC', semester: 'DESC' },
            });
            const transcripts = transcriptResults.data;
            this.logger.log(`Fetching academic history for student ${studentId}: ${transcripts.length} records found`);
            return transcripts.map((transcript) => ({
                id: transcript.id,
                studentId: transcript.studentId,
                academicYear: transcript.academicYear,
                semester: transcript.semester,
                grade: transcript.grade,
                gpa: transcript.gpa,
                subjects: transcript.subjects,
                attendance: transcript.attendance,
                behavior: transcript.behavior,
                createdAt: transcript.createdAt || new Date(),
                updatedAt: transcript.updatedAt || new Date(),
            }));
        }
        catch (error) {
            this.logger.error(`Error fetching academic history: ${error.message}`, error.stack);
            throw error;
        }
    }
    async batchGetAcademicHistories(studentIds) {
        try {
            if (!studentIds || studentIds.length === 0) {
                return new Map();
            }
            this.logger.log(`Batch fetching academic histories for ${studentIds.length} students`);
            const transcriptResults = await this.academicTranscriptRepository.findMany({
                where: {
                    studentId: { in: studentIds },
                },
                orderBy: { academicYear: 'DESC', semester: 'DESC' },
            });
            const allTranscripts = transcriptResults.data;
            const transcriptsByStudent = new Map();
            studentIds.forEach((id) => transcriptsByStudent.set(id, []));
            allTranscripts.forEach((transcript) => {
                const studentId = transcript.studentId;
                const academicRecord = {
                    id: transcript.id,
                    studentId: transcript.studentId,
                    academicYear: transcript.academicYear,
                    semester: transcript.semester,
                    grade: transcript.grade,
                    gpa: transcript.gpa,
                    subjects: transcript.subjects,
                    attendance: transcript.attendance,
                    behavior: transcript.behavior,
                    createdAt: transcript.createdAt || new Date(),
                    updatedAt: transcript.updatedAt || new Date(),
                };
                const studentTranscripts = transcriptsByStudent.get(studentId);
                if (studentTranscripts) {
                    studentTranscripts.push(academicRecord);
                }
            });
            this.logger.log(`Batch fetched ${allTranscripts.length} transcripts for ${studentIds.length} students`);
            return transcriptsByStudent;
        }
        catch (error) {
            this.logger.error(`Error batch fetching academic histories: ${error.message}`, error.stack);
            throw error;
        }
    }
    async generateTranscriptReport(studentId, format = 'json') {
        try {
            const student = await this.studentRepository.findById(studentId);
            if (!student) {
                throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
            }
            const academicHistory = await this.getAcademicHistory(studentId);
            const totalCredits = academicHistory.reduce((sum, record) => sum + record.subjects.reduce((s, subj) => s + subj.credits, 0), 0);
            const cumulativeGPA = academicHistory.length > 0
                ? Math.round((academicHistory.reduce((sum, record) => sum + record.gpa, 0) /
                    academicHistory.length) *
                    100) / 100
                : 0;
            const report = {
                student: {
                    id: studentId,
                    name: `${student.firstName} ${student.lastName}`,
                    studentNumber: student.studentNumber,
                    grade: student.grade,
                    dateOfBirth: student.dateOfBirth,
                    enrollmentDate: student.enrollmentDate,
                },
                summary: {
                    totalRecords: academicHistory.length,
                    totalCredits,
                    cumulativeGPA,
                },
                academicRecords: academicHistory,
                generatedAt: new Date(),
                format,
            };
            this.logger.log(`Transcript report generated for student ${studentId} (${student.firstName} ${student.lastName}) in ${format} format: ${academicHistory.length} records, GPA: ${cumulativeGPA}`);
            if (format === 'pdf') {
                return {
                    ...report,
                    pdfData: 'base64-encoded-pdf-data',
                    downloadUrl: `/api/reports/transcripts/${studentId}.pdf`,
                    note: 'PDF generation requires integration with PDF library (pdfkit, puppeteer, etc.)',
                };
            }
            else if (format === 'html') {
                const htmlContent = this.generateHtmlTranscript(report);
                return {
                    ...report,
                    htmlContent,
                    note: 'HTML template can be customized based on school branding requirements',
                };
            }
            return report;
        }
        catch (error) {
            this.logger.error(`Error generating transcript report: ${error.message}`, error.stack);
            throw error;
        }
    }
    generateHtmlTranscript(report) {
        const { student, summary, academicRecords } = report;
        return `
<!DOCTYPE html>
<html>
<head>
  <title>Academic Transcript - ${student.name}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
    .student-info { margin: 20px 0; }
    .record { margin: 20px 0; border: 1px solid #ddd; padding: 15px; }
    .subjects { margin-top: 10px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Academic Transcript</h1>
    <p>Generated: ${new Date().toLocaleDateString()}</p>
  </div>

  <div class="student-info">
    <h2>Student Information</h2>
    <p><strong>Name:</strong> ${student.name}</p>
    <p><strong>Student Number:</strong> ${student.studentNumber}</p>
    <p><strong>Current Grade:</strong> ${student.grade}</p>
    <p><strong>Cumulative GPA:</strong> ${summary.cumulativeGPA}</p>
    <p><strong>Total Credits:</strong> ${summary.totalCredits}</p>
  </div>

  ${academicRecords
            .map((record) => `
    <div class="record">
      <h3>${record.academicYear} - ${record.semester}</h3>
      <p><strong>Grade Level:</strong> ${record.grade}</p>
      <p><strong>GPA:</strong> ${record.gpa}</p>
      <p><strong>Attendance Rate:</strong> ${record.attendance.attendanceRate}%</p>

      <div class="subjects">
        <h4>Courses</h4>
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Teacher</th>
              <th>Grade</th>
              <th>Percentage</th>
              <th>Credits</th>
            </tr>
          </thead>
          <tbody>
            ${record.subjects
            .map((subj) => `
              <tr>
                <td>${subj.subjectName}</td>
                <td>${subj.teacher || 'N/A'}</td>
                <td>${subj.grade}</td>
                <td>${subj.percentage}%</td>
                <td>${subj.credits}</td>
              </tr>
            `)
            .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `)
            .join('')}
</body>
</html>
    `.trim();
    }
    async syncWithSIS(studentId, sisApiEndpoint) {
        try {
            this.logger.log(`Syncing with external SIS for student ${studentId} at ${sisApiEndpoint}`);
            const mockTranscriptData = {
                studentId,
                academicYear: '2024-2025',
                semester: 'Fall',
                subjects: [
                    {
                        subjectName: 'Mathematics',
                        subjectCode: 'MATH101',
                        grade: 'A',
                        percentage: 92,
                        credits: 3,
                        teacher: 'Ms. Johnson',
                    },
                    {
                        subjectName: 'English',
                        subjectCode: 'ENG101',
                        grade: 'B+',
                        percentage: 87,
                        credits: 3,
                        teacher: 'Mr. Smith',
                    },
                    {
                        subjectName: 'Science',
                        subjectCode: 'SCI101',
                        grade: 'A-',
                        percentage: 90,
                        credits: 3,
                        teacher: 'Dr. Williams',
                    },
                ],
                attendance: {
                    totalDays: 180,
                    presentDays: 175,
                    absentDays: 5,
                    tardyDays: 3,
                    attendanceRate: 97.2,
                },
                behavior: {
                    conductGrade: 'Excellent',
                    incidents: 0,
                    commendations: 2,
                },
                importedBy: 'system',
            };
            await this.importTranscript(mockTranscriptData);
            return true;
        }
        catch (error) {
            this.logger.error(`Error syncing with SIS: ${error.message}`, error.stack);
            throw error;
        }
    }
    async analyzePerformanceTrends(studentId) {
        try {
            const academicHistory = await this.getAcademicHistory(studentId);
            if (academicHistory.length === 0) {
                return {
                    trend: 'insufficient_data',
                    message: 'Not enough data to analyze trends',
                };
            }
            const gpaTrend = academicHistory.map((record) => record.gpa);
            const attendanceTrend = academicHistory.map((record) => record.attendance.attendanceRate);
            const analysis = {
                gpa: {
                    current: gpaTrend[gpaTrend.length - 1],
                    average: gpaTrend.reduce((a, b) => a + b, 0) / gpaTrend.length,
                    trend: this.calculateTrend(gpaTrend),
                },
                attendance: {
                    current: attendanceTrend[attendanceTrend.length - 1],
                    average: attendanceTrend.reduce((a, b) => a + b, 0) / attendanceTrend.length,
                    trend: this.calculateTrend(attendanceTrend),
                },
                recommendations: this.generateRecommendations(gpaTrend, attendanceTrend),
            };
            this.logger.log(`Performance trends analyzed for student ${studentId}`);
            return analysis;
        }
        catch (error) {
            this.logger.error(`Error analyzing performance trends: ${error.message}`, error.stack);
            throw error;
        }
    }
    calculateTrend(values) {
        if (values.length < 2)
            return 'stable';
        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.floor(values.length / 2));
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        const diff = secondAvg - firstAvg;
        if (diff > 0.1)
            return 'improving';
        if (diff < -0.1)
            return 'declining';
        return 'stable';
    }
    generateRecommendations(gpaTrend, attendanceTrend) {
        const recommendations = [];
        const currentGPA = gpaTrend[gpaTrend.length - 1];
        const currentAttendance = attendanceTrend[attendanceTrend.length - 1];
        if (currentGPA < 2.0) {
            recommendations.push('Consider academic support services and tutoring');
        }
        if (currentAttendance < 90) {
            recommendations.push('Attendance is below recommended levels - investigate potential health or social issues');
        }
        if (this.calculateTrend(gpaTrend) === 'declining') {
            recommendations.push('Academic performance is declining - schedule conference with parents and teachers');
        }
        return recommendations;
    }
};
exports.AcademicTranscriptService = AcademicTranscriptService;
exports.AcademicTranscriptService = AcademicTranscriptService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(academic_transcript_repository_1.AcademicTranscriptRepository)),
    __param(2, (0, common_1.Inject)(student_repository_1.StudentRepository)),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService,
        academic_transcript_repository_1.AcademicTranscriptRepository,
        student_repository_1.StudentRepository])
], AcademicTranscriptService);
//# sourceMappingURL=academic-transcript.service.js.map