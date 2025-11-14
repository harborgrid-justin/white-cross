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
exports.HealthRiskAssessmentService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const base_1 = require("../common/base");
const models_1 = require("../database/models");
const models_2 = require("../database/models");
const models_3 = require("../database/models");
const models_4 = require("../database/models");
const models_5 = require("../database/models");
const dto_1 = require("./dto");
let HealthRiskAssessmentService = class HealthRiskAssessmentService extends base_1.BaseService {
    studentModel;
    allergyModel;
    chronicConditionModel;
    studentMedicationModel;
    incidentReportModel;
    constructor(studentModel, allergyModel, chronicConditionModel, studentMedicationModel, incidentReportModel) {
        super('HealthRiskAssessmentService');
        this.studentModel = studentModel;
        this.allergyModel = allergyModel;
        this.chronicConditionModel = chronicConditionModel;
        this.studentMedicationModel = studentMedicationModel;
        this.incidentReportModel = incidentReportModel;
    }
    async calculateRiskScore(studentId) {
        try {
            const student = await this.studentModel.findByPk(studentId, {
                include: [
                    { model: this.allergyModel, as: 'allergies' },
                    { model: this.chronicConditionModel, as: 'chronicConditions' },
                    { model: this.studentMedicationModel, as: 'medications' },
                    { model: this.incidentReportModel, as: 'incidentReports' },
                ],
            });
            if (!student) {
                throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
            }
            const factors = [];
            const allergyRisk = await this.assessAllergyRisk(student);
            if (allergyRisk.severity > 0)
                factors.push(allergyRisk);
            const chronicRisk = await this.assessChronicConditionRisk(student);
            if (chronicRisk.severity > 0)
                factors.push(chronicRisk);
            const medicationRisk = await this.assessMedicationRisk(student);
            if (medicationRisk.severity > 0)
                factors.push(medicationRisk);
            const incidentRisk = await this.assessIncidentRisk(student);
            if (incidentRisk.severity > 0)
                factors.push(incidentRisk);
            const overallScore = this.calculateWeightedScore(factors);
            const riskLevel = this.determineRiskLevel(overallScore);
            const recommendations = this.generateRecommendations(factors, riskLevel);
            const assessment = {
                studentId,
                overallScore,
                riskLevel,
                factors,
                recommendations,
                calculatedAt: new Date(),
            };
            this.logInfo(`Health risk assessment completed for student ${studentId}: ${riskLevel} (score: ${overallScore})`);
            return assessment;
        }
        catch (error) {
            this.logError(`Error calculating health risk score for student ${studentId}`, error.stack);
            throw error;
        }
    }
    async assessAllergyRisk(student) {
        const allergies = student.allergies || [];
        let severity = 0;
        const severeAllergies = allergies.filter((a) => a.severity === 'severe' ||
            a.reaction?.toLowerCase().includes('anaphylaxis'));
        if (severeAllergies.length > 0) {
            severity = 8;
        }
        else if (allergies.length > 3) {
            severity = 5;
        }
        else if (allergies.length > 0) {
            severity = 3;
        }
        return {
            category: 'Allergies',
            severity,
            description: `${allergies.length} allergies documented${severeAllergies.length > 0 ? ', including severe reactions' : ''}`,
            weight: 0.3,
        };
    }
    async assessChronicConditionRisk(student) {
        const conditions = student.chronicConditions || [];
        let severity = 0;
        const criticalConditions = [
            'asthma',
            'diabetes',
            'epilepsy',
            'heart condition',
        ];
        const hasCritical = conditions.some((c) => criticalConditions.some((critical) => c.conditionName?.toLowerCase().includes(critical)));
        if (hasCritical) {
            severity = 9;
        }
        else if (conditions.length > 2) {
            severity = 6;
        }
        else if (conditions.length > 0) {
            severity = 4;
        }
        return {
            category: 'Chronic Conditions',
            severity,
            description: `${conditions.length} chronic condition(s)${hasCritical ? ' including critical conditions' : ''}`,
            weight: 0.35,
        };
    }
    async assessMedicationRisk(student) {
        const medications = student.medications || [];
        let severity = 0;
        if (medications.length > 5) {
            severity = 7;
        }
        else if (medications.length > 3) {
            severity = 5;
        }
        else if (medications.length > 0) {
            severity = 2;
        }
        return {
            category: 'Medications',
            severity,
            description: `Currently on ${medications.length} medication(s)`,
            weight: 0.2,
        };
    }
    async assessIncidentRisk(student) {
        const incidents = student.incidentReports || [];
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const recentIncidents = incidents.filter((i) => new Date(i.incidentDate) >= sixMonthsAgo);
        let severity = 0;
        if (recentIncidents.length > 5) {
            severity = 8;
        }
        else if (recentIncidents.length > 2) {
            severity = 5;
        }
        else if (recentIncidents.length > 0) {
            severity = 2;
        }
        return {
            category: 'Incident History',
            severity,
            description: `${recentIncidents.length} incidents in last 6 months`,
            weight: 0.15,
        };
    }
    calculateWeightedScore(factors) {
        if (factors.length === 0)
            return 0;
        let weightedSum = 0;
        let totalWeight = 0;
        factors.forEach((factor) => {
            weightedSum += factor.severity * factor.weight;
            totalWeight += factor.weight;
        });
        const normalizedScore = (weightedSum / totalWeight) * 10;
        return Math.min(Math.round(normalizedScore), 100);
    }
    determineRiskLevel(score) {
        if (score >= 75)
            return dto_1.RiskLevel.CRITICAL;
        if (score >= 50)
            return dto_1.RiskLevel.HIGH;
        if (score >= 25)
            return dto_1.RiskLevel.MODERATE;
        return dto_1.RiskLevel.LOW;
    }
    generateRecommendations(factors, riskLevel) {
        const recommendations = [];
        if (riskLevel === dto_1.RiskLevel.CRITICAL || riskLevel === dto_1.RiskLevel.HIGH) {
            recommendations.push('Schedule immediate consultation with school nurse');
            recommendations.push('Ensure emergency action plans are up to date');
            recommendations.push('Brief all relevant staff on student health needs');
        }
        factors.forEach((factor) => {
            if (factor.category === 'Allergies' && factor.severity >= 7) {
                recommendations.push('Ensure EpiPen is accessible and staff are trained');
            }
            if (factor.category === 'Chronic Conditions' && factor.severity >= 7) {
                recommendations.push('Review and update chronic condition management plan');
            }
            if (factor.category === 'Medications' && factor.severity >= 5) {
                recommendations.push('Schedule medication review with pharmacist');
            }
            if (factor.category === 'Incident History' && factor.severity >= 5) {
                recommendations.push('Investigate recurring incident patterns');
            }
        });
        if (recommendations.length === 0) {
            recommendations.push('Continue routine health monitoring');
        }
        return recommendations;
    }
    async getHighRiskStudents(minScore = 50) {
        try {
            const students = await this.studentModel.findAll({
                where: { isActive: true },
            });
            const highRiskStudents = [];
            for (const student of students) {
                if (!student.id)
                    continue;
                const assessment = await this.calculateRiskScore(student.id);
                if (assessment.overallScore >= minScore) {
                    highRiskStudents.push({
                        student: student.toJSON(),
                        assessment,
                    });
                }
            }
            highRiskStudents.sort((a, b) => b.assessment.overallScore - a.assessment.overallScore);
            this.logInfo(`Identified ${highRiskStudents.length} high-risk students (minScore: ${minScore})`);
            return highRiskStudents;
        }
        catch (error) {
            this.logError('Error getting high-risk students', error.stack);
            throw error;
        }
    }
};
exports.HealthRiskAssessmentService = HealthRiskAssessmentService;
exports.HealthRiskAssessmentService = HealthRiskAssessmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Student)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.Allergy)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.ChronicCondition)),
    __param(3, (0, sequelize_1.InjectModel)(models_4.StudentMedication)),
    __param(4, (0, sequelize_1.InjectModel)(models_5.IncidentReport)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], HealthRiskAssessmentService);
//# sourceMappingURL=health-risk-assessment.service.js.map