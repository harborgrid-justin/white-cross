/**
 * Allergy Module
 *
 * Comprehensive allergy management with HIPAA compliance, patient safety focus,
 * and medication-allergy cross-checking capabilities.
 *
 * PATIENT SAFETY CRITICAL - This module manages life-threatening allergy information
 * that directly impacts medication administration and emergency response.
 *
 * @module AllergyModule
 * @compliance HIPAA, Healthcare Allergy Documentation Standards
 */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// Models
import { Allergy } from '@/database';
import { Student } from '@/student/models';

// Services
import { AllergyCrudService } from '@/allergy/services';
import { AllergyQueryService } from '@/allergy/services';
import { AllergySafetyService } from '@/allergy/services';

// Controllers
import { AllergyController } from './allergy.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Allergy,
      Student, // Required for student validation
    ]),
  ],
  controllers: [AllergyController],
  providers: [
    // Core Services
    AllergyCrudService,
    AllergyQueryService,
    AllergySafetyService,
  ],
  exports: [
    // Export services for use in other modules (e.g., Medication module)
    AllergyCrudService,
    AllergyQueryService,
    AllergySafetyService,
  ],
})
export class AllergyModule {}
