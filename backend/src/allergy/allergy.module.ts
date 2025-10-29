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
import { Allergy } from './models/allergy.model';
import { Student } from '../student/models/student.model';

// Services
import { AllergyCrudService } from './services/allergy-crud.service';
import { AllergyQueryService } from './services/allergy-query.service';
import { AllergySafetyService } from './services/allergy-safety.service';

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
