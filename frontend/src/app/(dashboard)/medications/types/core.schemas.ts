import { z } from 'zod';

/**
 * Zod validation schema for Medication
 */
export const MedicationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  genericName: z.string().optional(),
  brandName: z.string().optional(),
  ndc: z.string().optional(),
  type: z.enum(['prescription', 'over_the_counter', 'supplement', 'emergency', 'inhaler', 'epipen', 'insulin', 'controlled_substance']),
  status: z.enum(['active', 'discontinued', 'expired', 'on_hold', 'completed', 'cancelled']),
  strength: z.string().min(1),
  dosageForm: z.string().min(1),
  administrationRoute: z.enum(['oral', 'injection', 'topical', 'inhaled', 'nasal', 'rectal', 'sublingual', 'transdermal']),
  frequency: z.enum(['as_needed', 'once_daily', 'twice_daily', 'three_times_daily', 'four_times_daily', 'every_4_hours', 'every_6_hours', 'every_8_hours', 'every_12_hours', 'weekly', 'monthly', 'custom']),
  dosageInstructions: z.string().min(1),
  startDate: z.date(),
  endDate: z.date().optional(),
  studentId: z.string().uuid(),
  createdBy: z.string().uuid(),
  isControlled: z.boolean(),
  requiresParentConsent: z.boolean(),
  requiresPhysicianOrder: z.boolean(),
});
