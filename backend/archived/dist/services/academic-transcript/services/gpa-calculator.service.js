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
exports.GpaCalculatorService = void 0;
const common_1 = require("@nestjs/common");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
let GpaCalculatorService = class GpaCalculatorService extends base_1.BaseService {
    requestContext;
    constructor(requestContext) {
        super(requestContext);
        this.requestContext = requestContext;
    }
    gradePoints = {
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
    calculateGPA(subjects) {
        if (subjects.length === 0) {
            this.logger.debug('No subjects provided, returning GPA of 0');
            return 0;
        }
        let totalPoints = 0;
        let totalCredits = 0;
        subjects.forEach((subject) => {
            const points = this.gradePoints[subject.grade] || 0;
            totalPoints += points * subject.credits;
            totalCredits += subject.credits;
            if (!this.gradePoints[subject.grade]) {
                this.logger.warn(`Unknown grade '${subject.grade}' for subject '${subject.subjectName}', defaulting to 0 points`);
            }
        });
        const gpa = totalCredits > 0
            ? Math.round((totalPoints / totalCredits) * 100) / 100
            : 0;
        this.logger.debug(`Calculated GPA: ${gpa} from ${subjects.length} subjects with ${totalCredits} total credits`);
        return gpa;
    }
    calculateCumulativeGPA(gpas) {
        if (gpas.length === 0)
            return 0;
        const sum = gpas.reduce((acc, gpa) => acc + gpa, 0);
        const average = sum / gpas.length;
        return Math.round(average * 100) / 100;
    }
    getGradePoint(grade) {
        return this.gradePoints[grade] || 0;
    }
    isValidGrade(grade) {
        return grade in this.gradePoints;
    }
};
exports.GpaCalculatorService = GpaCalculatorService;
exports.GpaCalculatorService = GpaCalculatorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService])
], GpaCalculatorService);
//# sourceMappingURL=gpa-calculator.service.js.map