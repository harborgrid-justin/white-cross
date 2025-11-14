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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptQueryService = void 0;
const common_1 = require("@nestjs/common");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
const academic_transcript_repository_1 = require("../../database/repositories/impl/academic-transcript.repository");
const student_repository_1 = require("../../database/repositories/impl/student.repository");
let TranscriptQueryService = class TranscriptQueryService extends base_1.BaseService {
    requestContext;
    academicTranscriptRepository;
    studentRepository;
    constructor(requestContext, academicTranscriptRepository, studentRepository) {
        super(requestContext);
        this.requestContext = requestContext;
        this.academicTranscriptRepository = academicTranscriptRepository;
        this.studentRepository = studentRepository;
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
            return transcripts.map((transcript) => this.mapToAcademicRecord(transcript));
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
                const academicRecord = this.mapToAcademicRecord(transcript);
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
    async getAcademicRecord(recordId) {
        try {
            const transcript = await this.academicTranscriptRepository.findById(recordId);
            if (!transcript) {
                return null;
            }
            return this.mapToAcademicRecord(transcript);
        }
        catch (error) {
            this.logger.error(`Error fetching academic record: ${error.message}`, error.stack);
            throw error;
        }
    }
    async transcriptExists(studentId, academicYear, semester) {
        try {
            const existingResults = await this.academicTranscriptRepository.findMany({
                where: {
                    studentId,
                    academicYear,
                    semester,
                },
                pagination: { page: 1, limit: 1 },
            });
            return existingResults.data.length > 0;
        }
        catch (error) {
            this.logger.error(`Error checking transcript existence: ${error.message}`, error.stack);
            throw error;
        }
    }
    mapToAcademicRecord(transcript) {
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
};
exports.TranscriptQueryService = TranscriptQueryService;
exports.TranscriptQueryService = TranscriptQueryService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(academic_transcript_repository_1.AcademicTranscriptRepository)),
    __param(2, (0, common_1.Inject)(student_repository_1.StudentRepository)),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService, typeof (_a = typeof academic_transcript_repository_1.AcademicTranscriptRepository !== "undefined" && academic_transcript_repository_1.AcademicTranscriptRepository) === "function" ? _a : Object, typeof (_b = typeof student_repository_1.StudentRepository !== "undefined" && student_repository_1.StudentRepository) === "function" ? _b : Object])
], TranscriptQueryService);
//# sourceMappingURL=transcript-query.service.js.map