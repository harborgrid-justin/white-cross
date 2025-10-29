/**
 * Healthcare V1 Module
 *
 * Provides healthcare-related endpoints for the v1 API:
 * - Medications management
 * - Medical records (future)
 * - Immunizations (future)
 * - Health assessments (future)
 *
 * @module routes/v1/healthcare
 */

import { Module } from '@nestjs/common';
import { MedicationsV1Controller } from './medications.controller';
import { MedicationModule } from '../../../medication/medication.module';

@Module({
  imports: [MedicationModule],
  controllers: [MedicationsV1Controller],
})
export class HealthcareV1Module {}
