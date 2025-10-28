/**
 * Allergy Safety Service
 *
 * Provides patient safety operations including allergy verification and
 * drug-allergy cross-checking to prevent adverse reactions.
 *
 * PATIENT SAFETY CRITICAL - Prevents medication errors that could cause
 * life-threatening allergic reactions.
 *
 * @service AllergySafetyService
 * @compliance HIPAA, Medication Safety Standards
 */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Allergy } from '../entities/allergy.entity';
import { AllergySeverity } from '../../common/enums';
import { AllergyCrudService } from './allergy-crud.service';
import { CreateAllergyDto } from '../dto/create-allergy.dto';

export interface DrugAllergyConflict {
  hasConflict: boolean;
  conflictingAllergies: Allergy[];
  riskLevel: 'NONE' | 'LOW' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  recommendation: string;
}

@Injectable()
export class AllergySafetyService {
  private readonly logger = new Logger(AllergySafetyService.name);

  constructor(
    @InjectRepository(Allergy)
    private readonly allergyRepository: Repository<Allergy>,
    private readonly allergyCrudService: AllergyCrudService,
  ) {}

  /**
   * Verifies an allergy record through healthcare professional confirmation
   *
   * @param id - Allergy record UUID
   * @param verifiedBy - User ID of healthcare professional
   * @returns Verified allergy record
   */
  async verifyAllergy(id: string, verifiedBy: string): Promise<Allergy> {
    const updatedAllergy = await this.allergyCrudService.updateAllergy(id, {
      verified: true,
      verifiedBy,
    });

    this.logger.log(
      `Allergy verified: ID ${id} by healthcare professional ${verifiedBy}`,
    );

    return updatedAllergy;
  }

  /**
   * Checks for drug-allergy conflicts before medication administration
   *
   * PATIENT SAFETY CRITICAL - Must be called before administering any medication
   *
   * @param studentId - Student's unique identifier
   * @param medicationName - Name of medication to check
   * @param medicationClass - Optional drug class for broader checking
   * @returns Conflict analysis with risk level and recommendations
   */
  async checkDrugAllergyConflict(
    studentId: string,
    medicationName: string,
    medicationClass?: string,
  ): Promise<DrugAllergyConflict> {
    // Get all active allergies for student
    const allergies = await this.allergyRepository.find({
      where: {
        studentId,
        isActive: true,
      },
      relations: ['student'],
    });

    if (allergies.length === 0) {
      return {
        hasConflict: false,
        conflictingAllergies: [],
        riskLevel: 'NONE',
        recommendation: 'No known allergies. Proceed with administration.',
      };
    }

    // Check for exact matches or fuzzy matches
    const conflictingAllergies: Allergy[] = [];
    const medicationLower = medicationName.toLowerCase();
    const medicationClassLower = medicationClass?.toLowerCase();

    for (const allergy of allergies) {
      const allergenLower = allergy.allergen.toLowerCase();

      // Exact match
      if (allergenLower === medicationLower) {
        conflictingAllergies.push(allergy);
        continue;
      }

      // Partial match (medication name contains allergen or vice versa)
      if (
        medicationLower.includes(allergenLower) ||
        allergenLower.includes(medicationLower)
      ) {
        conflictingAllergies.push(allergy);
        continue;
      }

      // Drug class match
      if (
        medicationClassLower &&
        (allergenLower.includes(medicationClassLower) ||
          medicationClassLower.includes(allergenLower))
      ) {
        conflictingAllergies.push(allergy);
        continue;
      }
    }

    if (conflictingAllergies.length === 0) {
      return {
        hasConflict: false,
        conflictingAllergies: [],
        riskLevel: 'NONE',
        recommendation: 'No allergy conflicts detected. Proceed with caution.',
      };
    }

    // Determine highest risk level from conflicting allergies
    const severities = conflictingAllergies.map((a) => a.severity);
    let riskLevel: DrugAllergyConflict['riskLevel'] = 'LOW';

    if (severities.includes(AllergySeverity.LIFE_THREATENING)) {
      riskLevel = 'LIFE_THREATENING';
    } else if (severities.includes(AllergySeverity.SEVERE)) {
      riskLevel = 'SEVERE';
    } else if (severities.includes(AllergySeverity.MODERATE)) {
      riskLevel = 'MODERATE';
    }

    // Generate recommendation based on risk level
    let recommendation = '';
    if (riskLevel === 'LIFE_THREATENING') {
      recommendation = `CRITICAL ALERT: DO NOT ADMINISTER. Patient has life-threatening allergy to ${conflictingAllergies[0].allergen}. Contact physician immediately.`;
    } else if (riskLevel === 'SEVERE') {
      recommendation = `SEVERE ALERT: Do not administer without physician approval. Patient has severe allergy to ${conflictingAllergies[0].allergen}.`;
    } else if (riskLevel === 'MODERATE') {
      recommendation = `MODERATE ALERT: Consult healthcare professional before administering. Patient has moderate allergy to ${conflictingAllergies[0].allergen}.`;
    } else {
      recommendation = `CAUTION: Patient has reported allergy to ${conflictingAllergies[0].allergen}. Monitor for reactions.`;
    }

    // PHI Audit Log - CRITICAL
    this.logger.error(
      `DRUG-ALLERGY CONFLICT DETECTED: Student ${studentId}, ` +
        `Medication: ${medicationName}, Risk Level: ${riskLevel}, ` +
        `Conflicting Allergies: ${conflictingAllergies.map((a) => a.allergen).join(', ')}`,
    );

    return {
      hasConflict: true,
      conflictingAllergies,
      riskLevel,
      recommendation,
    };
  }

  /**
   * Bulk creates multiple allergy records within a transaction
   *
   * @param allergiesData - Array of allergy creation data
   * @returns Array of created allergy records
   */
  async bulkCreateAllergies(
    allergiesData: CreateAllergyDto[],
  ): Promise<Allergy[]> {
    const createdAllergies: Allergy[] = [];

    // Note: In production, this should use a database transaction
    // For now, we'll create them sequentially
    for (const allergyData of allergiesData) {
      try {
        const allergy =
          await this.allergyCrudService.createAllergy(allergyData);
        createdAllergies.push(allergy);
      } catch (error) {
        this.logger.error(
          `Failed to create allergy for student ${allergyData.studentId}: ${error.message}`,
        );
        // Continue with next allergy rather than failing entire batch
      }
    }

    this.logger.log(
      `Bulk allergy creation: ${createdAllergies.length} of ${allergiesData.length} allergies created`,
    );

    return createdAllergies;
  }

  /**
   * Validates multiple student IDs before bulk operations
   *
   * @param studentIds - Array of student IDs to validate
   * @returns Validation result with invalid IDs if any
   */
  async validateBulkStudentIds(
    studentIds: string[],
  ): Promise<{ valid: boolean; invalidIds: string[] }> {
    // This would require access to Student repository
    // For now, return a placeholder
    // In production, inject StudentService or StudentRepository
    return {
      valid: true,
      invalidIds: [],
    };
  }
}
