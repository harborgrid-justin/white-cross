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
exports.GradeTransitionService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../database/models");
const base_1 = require("../common/base");
let GradeTransitionService = class GradeTransitionService extends base_1.BaseService {
    studentModel;
    sequelize;
    GRADE_PROGRESSION = {
        'Pre-K': 'K',
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
        '12': 'Graduate',
    };
    constructor(studentModel, sequelize) {
        super("GradeTransitionService");
        this.studentModel = studentModel;
        this.sequelize = sequelize;
    }
    async performBulkTransition(effectiveDate = new Date(), dryRun = false) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_2.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        });
        try {
            const students = await this.studentModel.findAll({
                where: { isActive: true },
                transaction,
            });
            const results = [];
            let successful = 0;
            let failed = 0;
            for (const student of students) {
                try {
                    const oldGrade = student.grade;
                    const newGrade = this.GRADE_PROGRESSION[oldGrade];
                    if (!newGrade) {
                        results.push({
                            studentId: student.id,
                            studentName: `${student.firstName} ${student.lastName}`,
                            oldGrade,
                            newGrade: oldGrade,
                            success: false,
                            error: 'No transition rule found for grade',
                        });
                        failed++;
                        continue;
                    }
                    if (!dryRun) {
                        await student.update({
                            grade: newGrade,
                            updatedBy: 'system',
                        }, { transaction });
                    }
                    results.push({
                        studentId: student.id,
                        studentName: `${student.firstName} ${student.lastName}`,
                        oldGrade,
                        newGrade,
                        success: true,
                    });
                    successful++;
                }
                catch (error) {
                    results.push({
                        studentId: student.id,
                        studentName: `${student.firstName} ${student.lastName}`,
                        oldGrade: student.grade,
                        newGrade: student.grade,
                        success: false,
                        error: error instanceof Error ? error.message : 'Unknown error',
                    });
                    failed++;
                }
            }
            if (dryRun) {
                await transaction.rollback();
            }
            else {
                await transaction.commit();
            }
            this.logInfo('Grade transition completed', {
                total: students.length,
                successful,
                failed,
                dryRun,
            });
            return {
                total: students.length,
                successful,
                failed,
                results,
            };
        }
        catch (error) {
            await transaction.rollback();
            this.logError('Error performing grade transition', error);
            throw error;
        }
    }
    async transitionStudent(studentId, newGrade, transitionedBy) {
        try {
            const student = await this.studentModel.findOne({
                where: { id: studentId },
            });
            if (!student) {
                throw new common_1.NotFoundException('Student not found');
            }
            const oldGrade = student.grade;
            await student.update({
                grade: newGrade,
                updatedBy: transitionedBy,
            });
            this.logInfo('Student grade transitioned', {
                studentId,
                oldGrade,
                newGrade,
                transitionedBy,
            });
            return true;
        }
        catch (error) {
            this.logError('Error transitioning student', {
                error,
                studentId,
            });
            throw error;
        }
    }
    async getGraduatingStudents() {
        try {
            const students = await this.studentModel.findAll({
                where: {
                    grade: '12',
                    isActive: true,
                },
            });
            this.logInfo('Graduating students retrieved', {
                count: students.length,
            });
            return students;
        }
        catch (error) {
            this.logError('Error getting graduating students', { error });
            throw error;
        }
    }
};
exports.GradeTransitionService = GradeTransitionService;
exports.GradeTransitionService = GradeTransitionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Student)),
    __metadata("design:paramtypes", [Object, sequelize_typescript_1.Sequelize])
], GradeTransitionService);
//# sourceMappingURL=grade-transition.service.js.map