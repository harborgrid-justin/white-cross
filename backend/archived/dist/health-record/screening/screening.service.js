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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreeningService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
let ScreeningService = class ScreeningService extends base_1.BaseService {
    screenings = new Map();
    constructor() {
        super('ScreeningService');
    }
    async getStudentScreenings(studentId) {
        this.logInfo(`Getting screenings for student ${studentId}`);
        const studentScreenings = Array.from(this.screenings.values()).filter((s) => s.studentId === studentId);
        this.logInfo(`PHI Access: Retrieved ${studentScreenings.length} screenings for student ${studentId}`);
        return studentScreenings.sort((a, b) => new Date(b.screeningDate).getTime() -
            new Date(a.screeningDate).getTime());
    }
    async batchCreate(screenings) {
        this.logInfo(`Batch creating ${screenings.length} screenings`);
        const results = {
            successCount: 0,
            errorCount: 0,
            createdIds: [],
            errors: [],
        };
        for (const screeningData of screenings) {
            try {
                const screening = await this.createScreening(screeningData);
                results.successCount++;
                results.createdIds.push(screening.id);
            }
            catch (error) {
                results.errorCount++;
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                results.errors.push(`Failed to create screening for student ${screeningData.studentId}: ${errorMessage}`);
                this.logError(`Batch create error: ${errorMessage}`);
            }
        }
        this.logInfo(`Batch create completed: ${results.successCount} successful, ${results.errorCount} failed`);
        return results;
    }
    async getOverdueScreenings(query) {
        this.logInfo('Getting overdue screenings');
        const overdueScreenings = [
            {
                studentId: '550e8400-e29b-41d4-a716-446655440000',
                studentName: 'Sample Student',
                screeningType: 'VISION',
                lastScreeningDate: null,
                daysOverdue: 45,
                requiredDate: new Date('2024-09-20'),
                gradeLevel: '5',
            },
        ];
        this.logInfo(`PHI Access: Retrieved ${overdueScreenings.length} overdue screenings`);
        return overdueScreenings;
    }
    getScreeningSchedule(query) {
        const { gradeLevel, stateCode } = query;
        const schedules = [
            {
                grade: 'K',
                required: ['VISION', 'HEARING', 'DENTAL', 'DEVELOPMENTAL'],
                frequency: 'Annual',
            },
            {
                grade: '1',
                required: ['VISION', 'HEARING', 'DENTAL'],
                frequency: 'Annual',
            },
            {
                grade: '2',
                required: ['VISION', 'HEARING', 'DENTAL'],
                frequency: 'Annual',
            },
            {
                grade: '3',
                required: ['VISION', 'HEARING', 'DENTAL'],
                frequency: 'Annual',
            },
            {
                grade: '5',
                required: ['VISION', 'HEARING', 'DENTAL', 'SCOLIOSIS'],
                frequency: 'Annual',
            },
            {
                grade: '7',
                required: ['VISION', 'HEARING', 'DENTAL', 'SCOLIOSIS'],
                frequency: 'Annual',
            },
            {
                grade: '9',
                required: ['VISION', 'HEARING', 'DENTAL', 'TB'],
                frequency: 'Annual',
            },
        ];
        const filteredSchedules = gradeLevel
            ? schedules.filter((s) => s.grade === gradeLevel)
            : schedules;
        return {
            stateCode: stateCode || 'CA',
            gradeLevel: gradeLevel || 'All grades',
            schedules: filteredSchedules,
            lastUpdated: '2024-01-01',
            notes: 'State requirements may vary. Consult state health department for specific guidelines.',
        };
    }
    async createReferral(screeningId, referralData) {
        this.logInfo(`Creating referral for screening ${screeningId}`);
        const screening = this.screenings.get(screeningId);
        if (!screening) {
            throw new common_1.NotFoundException(`Screening with ID ${screeningId} not found`);
        }
        const referral = {
            id: this.generateId(),
            screeningId,
            studentId: screening.studentId,
            providerName: referralData.providerName,
            reason: referralData.reason,
            urgency: referralData.urgency || 'ROUTINE',
            parentNotified: referralData.parentNotified || false,
            notificationDate: referralData.notificationDate || new Date().toISOString(),
            status: 'PENDING',
            createdAt: new Date(),
        };
        this.logInfo(`PHI Created: Referral created for screening ${screeningId}, student ${screening.studentId}`);
        return referral;
    }
    async getScreeningStatistics(query) {
        const { schoolId, startDate, endDate, screeningType } = query;
        this.logInfo('Generating screening statistics');
        const statistics = {
            reportPeriod: {
                startDate: startDate || '2024-01-01',
                endDate: endDate || new Date().toISOString(),
            },
            filters: { schoolId, screeningType },
            totalScreenings: 1250,
            byType: {
                VISION: { total: 450, pass: 420, fail: 20, refer: 10 },
                HEARING: { total: 430, pass: 415, fail: 10, refer: 5 },
                BMI: { total: 200, pass: 150, fail: 40, refer: 10 },
                DENTAL: { total: 100, pass: 85, fail: 10, refer: 5 },
                SCOLIOSIS: { total: 50, pass: 48, fail: 2, refer: 0 },
                TB: { total: 20, pass: 20, fail: 0, refer: 0 },
            },
            byGrade: {
                K: 200,
                '1': 180,
                '2': 175,
                '3': 170,
                '4': 160,
                '5': 155,
                '6': 100,
                '7': 60,
                '8': 30,
                '9': 20,
            },
            compliance: {
                compliant: 85,
                partiallyCompliant: 10,
                nonCompliant: 5,
            },
            referrals: {
                total: 45,
                pending: 12,
                completed: 30,
                cancelled: 3,
            },
        };
        this.logInfo('Screening statistics generated');
        return statistics;
    }
    async createScreening(data) {
        const id = this.generateId();
        const screening = {
            id,
            studentId: data.studentId,
            screeningType: data.screeningType,
            screeningDate: new Date(data.screeningDate),
            results: data.result || data.results,
            passed: data.passed ?? true,
            notes: data.notes,
            conductedBy: data.screenerName || data.conductedBy,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.screenings.set(id, screening);
        this.logInfo(`PHI Created: Screening ${screening.screeningType} created for student ${screening.studentId}`);
        return screening;
    }
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
};
exports.ScreeningService = ScreeningService;
exports.ScreeningService = ScreeningService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ScreeningService);
//# sourceMappingURL=screening.service.js.map