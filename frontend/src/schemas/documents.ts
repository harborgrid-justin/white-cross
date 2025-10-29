/**
 * Document Zod schemas for form validation
 *
 * @module schemas/documents
 * @description Zod schemas for document management forms
 */

import { z } from 'zod';
import {
  DocumentStatus,
  DocumentAccessLevel,
  DocumentCategory,
  SignatureType,
  SignaturePartyRole,
  TemplateFieldType,
  TemplateStatus
} from '@/types/documents';

/**
 * File upload schema
 */
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
  folderId: z.string().uuid().optional(),
  metadata: z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().max(1000).optional(),
    category: z.nativeEnum(DocumentCategory),
    accessLevel: z.nativeEnum(DocumentAccessLevel),
    tags: z.array(z.string()).default([]),
    customFields: z.record(z.unknown()).default({}),
    studentId: z.string().uuid().optional(),
    schoolId: z.string().uuid().optional(),
    districtId: z.string().uuid().optional(),
    retentionDays: z.number().int().positive().optional(),
    autoDelete: z.boolean().default(false),
    requiresSignature: z.boolean().default(false),
    isPHI: z.boolean().default(false)
  })
});

export type FileUploadFormData = z.infer<typeof fileUploadSchema>;

/**
 * Bulk upload schema
 */
export const bulkUploadSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, 'At least one file is required').max(50, 'Maximum 50 files allowed'),
  folderId: z.string().uuid().optional(),
  defaultMetadata: z.object({
    category: z.nativeEnum(DocumentCategory),
    accessLevel: z.nativeEnum(DocumentAccessLevel),
    tags: z.array(z.string()).default([]),
    schoolId: z.string().uuid().optional(),
    districtId: z.string().uuid().optional(),
    autoDelete: z.boolean().default(false),
    requiresSignature: z.boolean().default(false),
    isPHI: z.boolean().default(false)
  })
});

export type BulkUploadFormData = z.infer<typeof bulkUploadSchema>;

/**
 * Document metadata update schema
 */
export const documentMetadataSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(1000).optional(),
  category: z.nativeEnum(DocumentCategory),
  accessLevel: z.nativeEnum(DocumentAccessLevel),
  tags: z.array(z.string()).default([]),
  customFields: z.record(z.unknown()).default({}),
  retentionDays: z.number().int().positive().optional(),
  autoDelete: z.boolean().default(false),
  requiresSignature: z.boolean().default(false),
  isPHI: z.boolean().default(false)
});

export type DocumentMetadataFormData = z.infer<typeof documentMetadataSchema>;

/**
 * Folder creation schema
 */
export const folderCreateSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(255),
  description: z.string().max(1000).optional(),
  parentId: z.string().uuid().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().optional(),
  defaultAccessLevel: z.nativeEnum(DocumentAccessLevel),
  schoolId: z.string().uuid().optional(),
  districtId: z.string().uuid().optional()
});

export type FolderCreateFormData = z.infer<typeof folderCreateSchema>;

/**
 * Folder update schema
 */
export const folderUpdateSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(255).optional(),
  description: z.string().max(1000).optional(),
  parentId: z.string().uuid().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().optional(),
  defaultAccessLevel: z.nativeEnum(DocumentAccessLevel).optional()
});

export type FolderUpdateFormData = z.infer<typeof folderUpdateSchema>;

/**
 * Document share schema
 */
export const documentShareSchema = z.object({
  documentId: z.string().uuid(),
  sharedWith: z.string().uuid(),
  canView: z.boolean().default(true),
  canDownload: z.boolean().default(true),
  canEdit: z.boolean().default(false),
  canShare: z.boolean().default(false),
  expiresAt: z.date().optional(),
  message: z.string().max(500).optional(),
  requiresPassword: z.boolean().default(false),
  password: z.string().min(8).optional()
}).refine(
  (data) => !data.requiresPassword || data.password,
  {
    message: 'Password is required when password protection is enabled',
    path: ['password']
  }
);

export type DocumentShareFormData = z.infer<typeof documentShareSchema>;

/**
 * Document search schema
 */
export const documentSearchSchema = z.object({
  query: z.string().optional(),
  category: z.array(z.nativeEnum(DocumentCategory)).optional(),
  status: z.array(z.nativeEnum(DocumentStatus)).optional(),
  accessLevel: z.array(z.nativeEnum(DocumentAccessLevel)).optional(),
  tags: z.array(z.string()).optional(),
  folderId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  schoolId: z.string().uuid().optional(),
  districtId: z.string().uuid().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  fileType: z.array(z.string()).optional(),
  createdBy: z.string().uuid().optional(),
  includeDeleted: z.boolean().default(false),
  requiresSignature: z.boolean().optional(),
  isPHI: z.boolean().optional(),
  sortBy: z.enum(['name', 'date', 'size', 'category', 'status']).default('date'),
  sortDirection: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20)
});

export type DocumentSearchFormData = z.infer<typeof documentSearchSchema>;

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
 * Document template creation schema
 */
export const documentTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(255),
  description: z.string().max(1000).optional(),
  category: z.nativeEnum(DocumentCategory),
  status: z.nativeEnum(TemplateStatus).default(TemplateStatus.DRAFT),
  sections: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, 'Section title is required'),
    description: z.string().optional(),
    order: z.number().int().min(0),
    collapsible: z.boolean().default(false),
    defaultCollapsed: z.boolean().default(false),
    fields: z.array(z.object({
      id: z.string(),
      label: z.string().min(1, 'Field label is required'),
      type: z.nativeEnum(TemplateFieldType),
      required: z.boolean().default(false),
      defaultValue: z.unknown().optional(),
      placeholder: z.string().optional(),
      helpText: z.string().optional(),
      readonly: z.boolean().default(false),
      order: z.number().int().min(0),
      validation: z.object({
        pattern: z.string().optional(),
        min: z.number().optional(),
        max: z.number().optional(),
        minLength: z.number().int().optional(),
        maxLength: z.number().int().optional()
      }).optional(),
      options: z.array(z.object({
        label: z.string(),
        value: z.union([z.string(), z.number()])
      })).optional()
    }))
  })),
  defaultAccessLevel: z.nativeEnum(DocumentAccessLevel),
  requiresSignature: z.boolean().default(false),
  signatureTemplateId: z.string().uuid().optional(),
  autoGenerate: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  schoolId: z.string().uuid().optional(),
  districtId: z.string().uuid().optional()
});

export type DocumentTemplateFormData = z.infer<typeof documentTemplateSchema>;

/**
 * Template instance (document creation from template) schema
 */
export const templateInstanceSchema = z.object({
  templateId: z.string().uuid(),
  fieldValues: z.record(z.unknown()),
  studentId: z.string().uuid().optional(),
  folderId: z.string().uuid().optional(),
  isDraft: z.boolean().default(false)
});

export type TemplateInstanceFormData = z.infer<typeof templateInstanceSchema>;

/**
 * Version restore schema
 */
export const versionRestoreSchema = z.object({
  versionId: z.string().uuid(),
  reason: z.string().min(10, 'Please provide a reason for restoring this version').max(500)
});

export type VersionRestoreFormData = z.infer<typeof versionRestoreSchema>;

/**
 * Folder permission schema
 */
export const folderPermissionSchema = z.object({
  principalId: z.string().uuid(),
  principalType: z.enum(['user', 'role', 'group']),
  canView: z.boolean().default(true),
  canAdd: z.boolean().default(false),
  canEdit: z.boolean().default(false),
  canDelete: z.boolean().default(false),
  canManage: z.boolean().default(false)
}).refine(
  (data) => {
    // If can manage, must have all other permissions
    if (data.canManage) {
      return data.canView && data.canAdd && data.canEdit && data.canDelete;
    }
    // At least one permission must be granted
    return data.canView || data.canAdd || data.canEdit || data.canDelete;
  },
  {
    message: 'Invalid permission combination',
    path: ['canManage']
  }
);

export type FolderPermissionFormData = z.infer<typeof folderPermissionSchema>;

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
