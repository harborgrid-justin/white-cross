/**
 * @fileoverview Document signature schemas
 * @module schemas/documents.signatures
 *
 * Schemas for signature workflows, capture, and parental consent.
 */

import { z } from 'zod';
import {
  SignatureType,
  SignaturePartyRole,
} from '@/types/documents';

/**
 * Signature workflow creation schema
 */
export const signatureWorkflowSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(1000).optional(),
  documentId: z.string().uuid(),
  parties: z.array(z.object({
    userId: z.string().uuid().optional(),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    role: z.nativeEnum(SignaturePartyRole),
    order: z.number().int().min(0),
    required: z.boolean().default(true),
    accessCode: z.string().min(4).max(20).optional(),
    requireIdVerification: z.boolean().default(false),
    message: z.string().max(500).optional()
  })).min(1, 'At least one signature party is required'),
  sequentialSigning: z.boolean().default(false),
  requireAllSignatures: z.boolean().default(true),
  message: z.string().max(1000).optional(),
  expiresAt: z.date().optional(),
  enableReminders: z.boolean().default(true),
  reminderIntervalDays: z.number().int().positive().default(3),
  allowDecline: z.boolean().default(true),
  requireWitness: z.boolean().default(false),
  redirectUrl: z.string().url().optional(),
  webhookUrl: z.string().url().optional(),
  studentId: z.string().uuid().optional(),
  schoolId: z.string().uuid().optional(),
  districtId: z.string().uuid().optional()
}).refine(
  (data) => {
    if (data.sequentialSigning) {
      const orders = data.parties.map(p => p.order);
      return orders.every((order, index) => order === index);
    }
    return true;
  },
  {
    message: 'Sequential signing requires sequential order numbers starting from 0',
    path: ['parties']
  }
).refine(
  (data) => {
    if (data.requireWitness) {
      return data.parties.some(p => p.role === SignaturePartyRole.WITNESS);
    }
    return true;
  },
  {
    message: 'At least one witness is required when witness is required',
    path: ['parties']
  }
);

export type SignatureWorkflowFormData = z.infer<typeof signatureWorkflowSchema>;

/**
 * Signature capture schema
 */
export const signatureCaptureSchema = z.object({
  signatureId: z.string().uuid(),
  type: z.nativeEnum(SignatureType),
  signatureData: z.string().optional(),
  signatureText: z.string().optional(),
  reason: z.string().max(500).optional(),
  location: z.string().max(255).optional(),
  accessCode: z.string().optional()
}).refine(
  (data) => {
    if (data.type === SignatureType.DRAWN || data.type === SignatureType.UPLOADED) {
      return !!data.signatureData;
    }
    if (data.type === SignatureType.TYPED) {
      return !!data.signatureText;
    }
    return true;
  },
  {
    message: 'Signature data or text is required based on signature type',
    path: ['signatureData']
  }
);

export type SignatureCaptureFormData = z.infer<typeof signatureCaptureSchema>;

/**
 * Signature decline schema
 */
export const signatureDeclineSchema = z.object({
  signatureId: z.string().uuid(),
  reason: z.string().min(10, 'Please provide a reason for declining').max(1000)
});

export type SignatureDeclineFormData = z.infer<typeof signatureDeclineSchema>;

/**
 * Witness signature schema
 */
export const witnessSignatureSchema = z.object({
  primarySignatureId: z.string().uuid(),
  witnessName: z.string().min(1, 'Witness name is required'),
  witnessEmail: z.string().email('Valid email is required'),
  signatureData: z.string().min(1, 'Signature is required'),
  statement: z.string().min(10, 'Witness statement is required').max(1000),
  credentials: z.object({
    licenseNumber: z.string().optional(),
    licenseType: z.string().optional(),
    issuer: z.string().optional()
  }).optional()
});

export type WitnessSignatureFormData = z.infer<typeof witnessSignatureSchema>;

/**
 * Parental consent signature schema
 */
export const parentalConsentSchema = z.object({
  studentId: z.string().uuid(),
  relationship: z.enum(['parent', 'guardian', 'custodian']),
  signatureData: z.string().min(1, 'Signature is required'),
  emergencyContactConsent: z.boolean(),
  medicalTreatmentConsent: z.boolean(),
  photoVideoConsent: z.boolean(),
  consentValidUntil: z.date().optional(),
  accessCode: z.string().optional()
}).refine(
  (data) => data.emergencyContactConsent || data.medicalTreatmentConsent || data.photoVideoConsent,
  {
    message: 'At least one consent type must be granted',
    path: ['emergencyContactConsent']
  }
);

export type ParentalConsentFormData = z.infer<typeof parentalConsentSchema>;
