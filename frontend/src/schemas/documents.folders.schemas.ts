/**
 * @fileoverview Folder management schemas
 * @module schemas/documents.folders
 *
 * Schemas for folder creation, updates, and permissions.
 */

import { z } from 'zod';
import { DocumentAccessLevel } from '@/types/documents';

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
 * Version restore schema
 */
export const versionRestoreSchema = z.object({
  versionId: z.string().uuid(),
  reason: z.string().min(10, 'Please provide a reason for restoring this version').max(500)
});

export type VersionRestoreFormData = z.infer<typeof versionRestoreSchema>;
