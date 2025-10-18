import { Student, Allergy, ChronicCondition, StudentMedication, IncidentReport } from '../database/models';
import { logger } from '../utils/logger';
import { Op } from 'sequelize';

/**
 * Student Health Risk Assessment Service
 * Calculates health risk scores based on multiple factors
 */

export interface HealthRiskScore {
  studentId: string;
  overallScore: number; // 0-100, higher = higher risk
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  factors: RiskFactor[];
  recommendations: string[];
  calculatedAt: Date;
}

export interface RiskFactor {
  category: string;
  severity: number; // 0-10
  description: string;
  weight: number; // Importance weight
}

export class HealthRiskAssessmentService {
  /**
   * Calculate comprehensive health risk score for a student
   */
  static async calculateRiskScore(studentId: string): Promise<HealthRiskScore> {
    try {
      const student = await Student.findByPk(studentId, {
        include: [
          { model: Allergy, as: 'allergies' },
          { model: ChronicCondition, as: 'chronicConditions' },
          { model: StudentMedication, as: 'medications' },
          { model: IncidentReport, as: 'incidentReports' },
        ],
      });

      if (!student) {
        throw new Error('Student not found');
      }

      const factors: RiskFactor[] = [];

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

      const assessment: HealthRiskScore = {
        studentId,
        overallScore,
        riskLevel,
        factors,
        recommendations,
        calculatedAt: new Date(),
      };

      logger.info('Health risk assessment completed', { studentId, riskLevel, overallScore });

      return assessment;
    } catch (error) {
      logger.error('Error calculating health risk score', { error, studentId });
      throw error;
    }
  }

  /**
   * Assess allergy-related risk
   */
  private static async assessAllergyRisk(student: any): Promise<RiskFactor> {
    const allergies = student.allergies || [];
    
    let severity = 0;
    const severeAllergies = allergies.filter((a: any) => 
      a.severity === 'severe' || a.reaction?.toLowerCase().includes('anaphylaxis')
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
  private static async assessChronicConditionRisk(student: any): Promise<RiskFactor> {
    const conditions = student.chronicConditions || [];
    
    let severity = 0;
    const criticalConditions = ['asthma', 'diabetes', 'epilepsy', 'heart condition'];
    
    const hasCritical = conditions.some((c: any) => 
      criticalConditions.some(critical => 
        c.conditionName?.toLowerCase().includes(critical)
      )
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
  private static async assessMedicationRisk(student: any): Promise<RiskFactor> {
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
  private static async assessIncidentRisk(student: any): Promise<RiskFactor> {
    const incidents = student.incidentReports || [];
    
    // Count recent incidents (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentIncidents = incidents.filter((i: any) => 
      new Date(i.incidentDate) >= sixMonthsAgo
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
  private static calculateWeightedScore(factors: RiskFactor[]): number {
    if (factors.length === 0) return 0;

    let weightedSum = 0;
    let totalWeight = 0;

    factors.forEach(factor => {
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
  private static determineRiskLevel(score: number): 'low' | 'moderate' | 'high' | 'critical' {
    if (score >= 75) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 25) return 'moderate';
    return 'low';
  }

  /**
   * Generate risk-based recommendations
   */
  private static generateRecommendations(factors: RiskFactor[], riskLevel: string): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'critical' || riskLevel === 'high') {
      recommendations.push('Schedule immediate consultation with school nurse');
      recommendations.push('Ensure emergency action plans are up to date');
      recommendations.push('Brief all relevant staff on student health needs');
    }

    factors.forEach(factor => {
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

  /**
   * Get high-risk students
   */
  static async getHighRiskStudents(
    minScore: number = 50
  ): Promise<Array<{ student: Student; assessment: HealthRiskScore }>> {
    try {
      const students = await Student.findAll({
        where: { isActive: true },
      });

      const highRiskStudents: Array<{ student: Student; assessment: HealthRiskScore }> = [];

      for (const student of students) {
        const assessment = await this.calculateRiskScore(student.id);
        
        if (assessment.overallScore >= minScore) {
          highRiskStudents.push({ student, assessment });
        }
      }

      // Sort by score descending
      highRiskStudents.sort((a, b) => b.assessment.overallScore - a.assessment.overallScore);

      logger.info('High-risk students identified', { count: highRiskStudents.length, minScore });

      return highRiskStudents;
    } catch (error) {
      logger.error('Error getting high-risk students', { error });
      throw error;
    }
  }
}
