import { DocumentType, DocumentStatus, AccessLevel } from './DocumentFilters';

export interface Document {
  id: string;
  studentId?: string;
  studentName?: string;
  fileName: string;
  title: string;
  description?: string;
  documentType: DocumentType;
  mimeType: string;
  fileSize: number;
  status: DocumentStatus;
  accessLevel: AccessLevel;
  tags: string[];
  isStarred: boolean;
  isEncrypted: boolean;
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
  expirationDate?: string;
  version: number;
  downloadCount: number;
  sharingEnabled: boolean;
  auditLog: Array<{
    action: string;
    user: string;
    timestamp: string;
  }>;
}

export type { DocumentType, DocumentStatus, AccessLevel };
