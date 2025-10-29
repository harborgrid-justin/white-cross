import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

// Import Sequelize models
import { Student } from '../database/models/student.model';
import { Allergy } from '../database/models/allergy.model';
import { ChronicCondition } from '../database/models/chronic-condition.model';
import { StudentMedication } from '../database/models/student-medication.model';
import { IncidentReport } from '../database/models/incident-report.model';

import {
  HealthRiskScoreDto,
  RiskFactorDto,
  RiskLevel,
  HighRiskStudentDto,
} from './dto';

/**
 * Health Risk Assessment Service
 *
 * Calculates comprehensive health risk scores for students based on:
 * - Allergy severity and count
 * - Chronic conditions (especially critical ones like asthma, diabetes, epilepsy)
 * - Medication complexity
 * - Recent incident history
 *
 * Each factor is weighted and combined to produce an overall risk score (0-100)
 * with corresponding risk level (low, moderate, high, critical) and recommendations.
 */
@Injectable()
export class HealthRiskAssessmentService {
  private readonly logger = new Logger(HealthRiskAssessmentService.name);

  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectModel(Allergy)
    private readonly allergyModel: typeof Allergy,
    @InjectModel(ChronicCondition)
    private readonly chronicConditionModel: typeof ChronicCondition,
    @InjectModel(StudentMedication)
    private readonly studentMedicationModel: typeof StudentMedication,
    @InjectModel(IncidentReport)
    private readonly incidentReportModel: typeof IncidentReport,
  ) {}

  /**
   * Calculate comprehensive health risk score for a student
   */
  async calculateRiskScore(studentId: string): Promise<HealthRiskScoreDto> {
    try {
      // Get student with related data
      const student = await this.studentModel.findByPk(studentId, {
        include: [
          { model: this.allergyModel, as: 'allergies' },
          { model: this.chronicConditionModel, as: 'chronicConditions' },
          { model: this.studentMedicationModel, as: 'medications' },
          { model: this.incidentReportModel, as: 'incidentReports' },
        ],
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      const factors: RiskFactorDto[] = [];

      // Assess allergy risk
      const allergyRisk = await this.assessAllergyRisk(student);
      if (allergyRisk.severity > 0) factors.push(allergyRisk);

      // Assess chronic condition risk
      const chronicRisk = await this.assessChronicConditionRisk(student);
      if (chronicRisk.severity > 0) factors.push(chronicRisk);

      // Assess medication complexity risk
      const medicationRisk = await this.assessMedicationRisk(student);
      if (medicationRisk.severity > 0) factors.push(medicationRisk);

      // Assess incident history risk
      const incidentRisk = await this.assessIncidentRisk(student);
      if (incidentRisk.severity > 0) factors.push(incidentRisk);

      // Calculate weighted overall score
      const overallScore = this.calculateWeightedScore(factors);
      const riskLevel = this.determineRiskLevel(overallScore);
      const recommendations = this.generateRecommendations(factors, riskLevel);

      const assessment: HealthRiskScoreDto = {
        studentId,
        overallScore,
        riskLevel,
        factors,
        recommendations,
        calculatedAt: new Date(),
      };

      this.logger.log(
        `Health risk assessment completed for student ${studentId}: ${riskLevel} (score: ${overallScore})`,
      );

      return assessment;
    } catch (error) {
      this.logger.error(
        `Error calculating health risk score for student ${studentId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Assess allergy-related risk
   */
  private async assessAllergyRisk(student: any): Promise<RiskFactorDto> {
    const allergies = student.allergies || [];

    let severity = 0;
    const severeAllergies = allergies.filter(
      (a: any) =>
        a.severity === 'severe' ||
        a.reaction?.toLowerCase().includes('anaphylaxis'),
    );

    if (severeAllergies.length > 0) {
      severity = 8;
    } else if (allergies.length > 3) {
      severity = 5;
    } else if (allergies.length > 0) {
      severity = 3;
    }

    return {
      category: 'Allergies',
      severity,
      description: `${allergies.length} allergies documented${severeAllergies.length > 0 ? ', including severe reactions' : ''}`,
      weight: 0.3,
    };
  }

  /**
   * Assess chronic condition risk
   */
  private async assessChronicConditionRisk(
    student: any,
  ): Promise<RiskFactorDto> {
    const conditions = student.chronicConditions || [];

    let severity = 0;
    const criticalConditions = [
      'asthma',
      'diabetes',
      'epilepsy',
      'heart condition',
    ];

    const hasCritical = conditions.some((c: any) =>
      criticalConditions.some((critical) =>
        c.conditionName?.toLowerCase().includes(critical),
      ),
    );

    if (hasCritical) {
      severity = 9;
    } else if (conditions.length > 2) {
      severity = 6;
    } else if (conditions.length > 0) {
      severity = 4;
    }

    return {
      category: 'Chronic Conditions',
      severity,
      description: `${conditions.length} chronic condition(s)${hasCritical ? ' including critical conditions' : ''}`,
      weight: 0.35,
    };
  }

  /**
   * Assess medication-related risk
   */
  private async assessMedicationRisk(student: any): Promise<RiskFactorDto> {
    const medications = student.medications || [];

    let severity = 0;

    if (medications.length > 5) {
      severity = 7;
    } else if (medications.length > 3) {
      severity = 5;
    } else if (medications.length > 0) {
      severity = 2;
    }

    return {
      category: 'Medications',
      severity,
      description: `Currently on ${medications.length} medication(s)`,
      weight: 0.2,
    };
  }

  /**
   * Assess incident history risk
   */
  private async assessIncidentRisk(student: any): Promise<RiskFactorDto> {
    const incidents = student.incidentReports || [];

    // Count recent incidents (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentIncidents = incidents.filter(
      (i: any) => new Date(i.incidentDate) >= sixMonthsAgo,
    );

    let severity = 0;

    if (recentIncidents.length > 5) {
      severity = 8;
    } else if (recentIncidents.length > 2) {
      severity = 5;
    } else if (recentIncidents.length > 0) {
      severity = 2;
    }

    return {
      category: 'Incident History',
      severity,
      description: `${recentIncidents.length} incidents in last 6 months`,
      weight: 0.15,
    };
  }

  /**
   * Calculate weighted overall score
   */
  private calculateWeightedScore(factors: RiskFactorDto[]): number {
    if (factors.length === 0) return 0;

    let weightedSum = 0;
    let totalWeight = 0;

    factors.forEach((factor) => {
      weightedSum += factor.severity * factor.weight;
      totalWeight += factor.weight;
    });

    // Normalize to 0-100 scale
    const normalizedScore = (weightedSum / totalWeight) * 10;
    return Math.min(Math.round(normalizedScore), 100);
  }

  /**
   * Determine risk level from score
   */
  private determineRiskLevel(score: number): RiskLevel {
    if (score >= 75) return RiskLevel.CRITICAL;
    if (score >= 50) return RiskLevel.HIGH;
    if (score >= 25) return RiskLevel.MODERATE;
    return RiskLevel.LOW;
  }

  /**
   * Generate risk-based recommendations
   */
  private generateRecommendations(
    factors: RiskFactorDto[],
    riskLevel: RiskLevel,
  ): string[] {
    const recommendations: string[] = [];

    if (riskLevel === RiskLevel.CRITICAL || riskLevel === RiskLevel.HIGH) {
      recommendations.push('Schedule immediate consultation with school nurse');
      recommendations.push('Ensure emergency action plans are up to date');
      recommendations.push('Brief all relevant staff on student health needs');
    }

    factors.forEach((factor) => {
      if (factor.category === 'Allergies' && factor.severity >= 7) {
        recommendations.push(
          'Ensure EpiPen is accessible and staff are trained',
        );
      }
      if (factor.category === 'Chronic Conditions' && factor.severity >= 7) {
        recommendations.push(
          'Review and update chronic condition management plan',
        );
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

  /**
   * Get high-risk students
   * Returns students whose risk score meets or exceeds the minimum threshold
   */
  async getHighRiskStudents(
    minScore: number = 50,
  ): Promise<HighRiskStudentDto[]> {
    try {
      // Get all active students
      const students = await this.studentModel.findAll({
        where: { isActive: true },
      });

      const highRiskStudents: HighRiskStudentDto[] = [];

      for (const student of students) {
        if (!student.id) continue;

        const assessment = await this.calculateRiskScore(student.id);

        if (assessment.overallScore >= minScore) {
          highRiskStudents.push({
            student: student.toJSON(),
            assessment,
          });
        }
      }

      // Sort by score descending
      highRiskStudents.sort(
        (a, b) => b.assessment.overallScore - a.assessment.overallScore,
      );

      this.logger.log(
        `Identified ${highRiskStudents.length} high-risk students (minScore: ${minScore})`,
      );

      return highRiskStudents;
    } catch (error) {
      this.logger.error('Error getting high-risk students', error.stack);
      throw error;
    }
  }
}
