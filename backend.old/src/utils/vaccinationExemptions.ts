/**
 * LOC: EXEMPTION-001
 * WC-UTIL-EXEMP-001 | Vaccination Exemption Tracking
 *
 * Purpose: Track and manage vaccination exemptions with state-specific rules
 * Compliance: State health department regulations, school enrollment requirements
 */

import { logger } from './logger';

/**
 * Exemption types recognized across US states
 */
export enum ExemptionType {
  MEDICAL = 'MEDICAL',           // Medical contraindication
  RELIGIOUS = 'RELIGIOUS',       // Religious beliefs
  PHILOSOPHICAL = 'PHILOSOPHICAL', // Personal/philosophical beliefs
  TEMPORARY_MEDICAL = 'TEMPORARY_MEDICAL' // Temporary medical deferral
}

/**
 * Exemption status
 */
export enum ExemptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
  PENDING_REVIEW = 'PENDING_REVIEW',
  DENIED = 'DENIED'
}

/**
 * Vaccination exemption data
 */
export interface VaccinationExemption {
  id?: string;
  studentId: string;
  vaccineType: string;  // Specific vaccine or 'ALL' for blanket exemption
  exemptionType: ExemptionType;
  status: ExemptionStatus;
  reason: string;
  startDate: Date;
  endDate?: Date;  // For temporary exemptions
  expirationDate?: Date;  // For required renewals
  documentationUrl?: string;  // Link to supporting documents
  providerId?: string;  // Healthcare provider for medical exemptions
  providerName?: string;
  providerLicense?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * State exemption policies
 */
export interface StateExemptionPolicy {
  state: string;
  allowsMedical: boolean;
  allowsReligious: boolean;
  allowsPhilosophical: boolean;
  requiresProviderSignature: boolean;
  requiresAnnualRenewal: boolean;
  requiresNotarization: boolean;
  requiresEducationSession: boolean;
  exemptionFormUrl?: string;
  additionalRequirements?: string[];
}

/**
 * State-specific exemption policies by US state
 * Based on current state regulations as of 2024
 */
const STATE_POLICIES: Record<string, StateExemptionPolicy> = {
  'CA': {
    state: 'California',
    allowsMedical: true,
    allowsReligious: false,
    allowsPhilosophical: false,
    requiresProviderSignature: true,
    requiresAnnualRenewal: false,
    requiresNotarization: false,
    requiresEducationSession: false,
    additionalRequirements: ['Medical exemptions must be on standardized state form']
  },
  'NY': {
    state: 'New York',
    allowsMedical: true,
    allowsReligious: false,
    allowsPhilosophical: false,
    requiresProviderSignature: true,
    requiresAnnualRenewal: false,
    requiresNotarization: false,
    requiresEducationSession: false
  },
  'TX': {
    state: 'Texas',
    allowsMedical: true,
    allowsReligious: true,
    allowsPhilosophical: true,
    requiresProviderSignature: true,
    requiresAnnualRenewal: true,
    requiresNotarization: true,
    requiresEducationSession: false
  },
  'FL': {
    state: 'Florida',
    allowsMedical: true,
    allowsReligious: true,
    allowsPhilosophical: false,
    requiresProviderSignature: true,
    requiresAnnualRenewal: false,
    requiresNotarization: false,
    requiresEducationSession: false
  },
  'PA': {
    state: 'Pennsylvania',
    allowsMedical: true,
    allowsReligious: true,
    allowsPhilosophical: false,
    requiresProviderSignature: true,
    requiresAnnualRenewal: false,
    requiresNotarization: false,
    requiresEducationSession: false
  },
  'WA': {
    state: 'Washington',
    allowsMedical: true,
    allowsReligious: true,
    allowsPhilosophical: false,
    requiresProviderSignature: true,
    requiresAnnualRenewal: false,
    requiresNotarization: false,
    requiresEducationSession: true,
    additionalRequirements: ['Certificate of Exemption form required']
  },
  // Default policy for states not explicitly listed
  'DEFAULT': {
    state: 'Default',
    allowsMedical: true,
    allowsReligious: true,
    allowsPhilosophical: true,
    requiresProviderSignature: true,
    requiresAnnualRenewal: false,
    requiresNotarization: false,
    requiresEducationSession: false
  }
};

/**
 * Vaccination Exemption Service
 */
export class VaccinationExemptionService {
  /**
   * Get state exemption policy
   */
  static getStatePolicy(stateCode: string): StateExemptionPolicy {
    return STATE_POLICIES[stateCode.toUpperCase()] || STATE_POLICIES['DEFAULT'];
  }

  /**
   * Check if exemption type is allowed in state
   */
  static isExemptionAllowed(stateCode: string, exemptionType: ExemptionType): boolean {
    const policy = this.getStatePolicy(stateCode);
    
    switch (exemptionType) {
      case ExemptionType.MEDICAL:
      case ExemptionType.TEMPORARY_MEDICAL:
        return policy.allowsMedical;
      
      case ExemptionType.RELIGIOUS:
        return policy.allowsReligious;
      
      case ExemptionType.PHILOSOPHICAL:
        return policy.allowsPhilosophical;
      
      default:
        return false;
    }
  }

  /**
   * Validate exemption request
   */
  static validateExemption(
    exemption: Partial<VaccinationExemption>,
    stateCode: string
  ): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const policy = this.getStatePolicy(stateCode);

    // Check if exemption type is allowed
    if (exemption.exemptionType && !this.isExemptionAllowed(stateCode, exemption.exemptionType)) {
      errors.push(`${exemption.exemptionType} exemptions are not allowed in ${policy.state}`);
    }

    // Medical exemptions require provider information
    if (exemption.exemptionType === ExemptionType.MEDICAL) {
      if (!exemption.providerId && !exemption.providerName) {
        errors.push('Medical exemptions require healthcare provider information');
      }
      
      if (policy.requiresProviderSignature && !exemption.documentationUrl) {
        warnings.push('Provider signature documentation should be uploaded');
      }
    }

    // Check required documentation
    if (!exemption.documentationUrl) {
      warnings.push('Supporting documentation should be provided');
    }

    // Validate dates
    if (exemption.startDate && exemption.endDate) {
      if (exemption.endDate <= exemption.startDate) {
        errors.push('End date must be after start date');
      }
    }

    // Check expiration for annual renewal states
    if (policy.requiresAnnualRenewal && !exemption.expirationDate) {
      errors.push(`${policy.state} requires annual renewal of exemptions`);
    }

    // Temporary medical exemptions must have end date
    if (exemption.exemptionType === ExemptionType.TEMPORARY_MEDICAL && !exemption.endDate) {
      errors.push('Temporary medical exemptions must specify an end date');
    }

    // Education session requirement
    if (policy.requiresEducationSession) {
      warnings.push(`${policy.state} requires completion of vaccine education session`);
    }

    // Notarization requirement
    if (policy.requiresNotarization) {
      warnings.push(`${policy.state} requires notarized exemption forms`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Check if exemption is currently active
   */
  static isExemptionActive(exemption: VaccinationExemption): boolean {
    const now = new Date();

    // Check status
    if (exemption.status !== ExemptionStatus.ACTIVE) {
      return false;
    }

    // Check if started
    if (exemption.startDate > now) {
      return false;
    }

    // Check end date (for temporary exemptions)
    if (exemption.endDate && exemption.endDate < now) {
      return false;
    }

    // Check expiration date (for renewal requirements)
    if (exemption.expirationDate && exemption.expirationDate < now) {
      return false;
    }

    return true;
  }

  /**
   * Get exemptions for student
   * This would query the database in production
   */
  static async getStudentExemptions(studentId: string): Promise<VaccinationExemption[]> {
    try {
      // TODO: Query database for exemptions
      // const exemptions = await VaccinationExemption.findAll({
      //   where: { studentId },
      //   order: [['createdAt', 'DESC']]
      // });
      
      logger.info(`Retrieving exemptions for student ${studentId}`);
      return [];
    } catch (error) {
      logger.error('Failed to retrieve exemptions', error);
      throw error;
    }
  }

  /**
   * Get active exemptions for student
   */
  static async getActiveExemptions(studentId: string): Promise<VaccinationExemption[]> {
    const exemptions = await this.getStudentExemptions(studentId);
    return exemptions.filter(e => this.isExemptionActive(e));
  }

  /**
   * Check if student has exemption for specific vaccine
   */
  static async hasExemptionForVaccine(
    studentId: string,
    vaccineType: string
  ): Promise<boolean> {
    const exemptions = await this.getActiveExemptions(studentId);
    
    return exemptions.some(e => 
      e.vaccineType === 'ALL' || 
      e.vaccineType.toLowerCase() === vaccineType.toLowerCase()
    );
  }

  /**
   * Create exemption request
   */
  static async createExemption(
    exemptionData: Partial<VaccinationExemption>,
    stateCode: string
  ): Promise<{ success: boolean; exemption?: VaccinationExemption; errors?: string[] }> {
    try {
      // Validate exemption
      const validation = this.validateExemption(exemptionData, stateCode);
      
      if (!validation.valid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      // Log warnings
      if (validation.warnings.length > 0) {
        logger.warn('Exemption validation warnings', {
          studentId: exemptionData.studentId,
          warnings: validation.warnings
        });
      }

      // TODO: Save to database
      // const exemption = await VaccinationExemption.create({
      //   ...exemptionData,
      //   status: ExemptionStatus.PENDING_REVIEW,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // });

      logger.info('Exemption created', {
        studentId: exemptionData.studentId,
        type: exemptionData.exemptionType,
        vaccine: exemptionData.vaccineType
      });

      return {
        success: true,
        // exemption
      };
    } catch (error) {
      logger.error('Failed to create exemption', error);
      throw error;
    }
  }

  /**
   * Update exemption status
   */
  static async updateExemptionStatus(
    exemptionId: string,
    status: ExemptionStatus,
    reviewerId: string,
    notes?: string
  ): Promise<void> {
    try {
      // TODO: Update in database
      // await VaccinationExemption.update(
      //   {
      //     status,
      //     reviewedBy: reviewerId,
      //     reviewedAt: new Date(),
      //     notes,
      //     updatedAt: new Date()
      //   },
      //   { where: { id: exemptionId } }
      // );

      logger.info('Exemption status updated', {
        exemptionId,
        status,
        reviewerId
      });
    } catch (error) {
      logger.error('Failed to update exemption status', error);
      throw error;
    }
  }

  /**
   * Check expiring exemptions (for renewal reminders)
   */
  static async getExpiringExemptions(daysBeforeExpiration: number = 30): Promise<VaccinationExemption[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysBeforeExpiration);

    try {
      // TODO: Query database
      // const exemptions = await VaccinationExemption.findAll({
      //   where: {
      //     status: ExemptionStatus.ACTIVE,
      //     expirationDate: {
      //       [Op.lte]: futureDate,
      //       [Op.gte]: new Date()
      //     }
      //   }
      // });

      logger.info(`Checking for exemptions expiring within ${daysBeforeExpiration} days`);
      return [];
    } catch (error) {
      logger.error('Failed to check expiring exemptions', error);
      throw error;
    }
  }

  /**
   * Generate exemption summary for compliance reports
   */
  static async getExemptionSummary(studentId: string): Promise<{
    totalExemptions: number;
    activeExemptions: number;
    exemptionsByType: Record<string, number>;
    exemptedVaccines: string[];
  }> {
    const exemptions = await this.getStudentExemptions(studentId);
    const active = exemptions.filter(e => this.isExemptionActive(e));

    const exemptionsByType: Record<string, number> = {};
    const exemptedVaccines = new Set<string>();

    for (const exemption of active) {
      // Count by type
      exemptionsByType[exemption.exemptionType] = 
        (exemptionsByType[exemption.exemptionType] || 0) + 1;

      // Track exempted vaccines
      if (exemption.vaccineType === 'ALL') {
        exemptedVaccines.add('ALL_VACCINES');
      } else {
        exemptedVaccines.add(exemption.vaccineType);
      }
    }

    return {
      totalExemptions: exemptions.length,
      activeExemptions: active.length,
      exemptionsByType,
      exemptedVaccines: Array.from(exemptedVaccines)
    };
  }
}
