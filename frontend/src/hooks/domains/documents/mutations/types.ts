// Type definitions for document mutations

export interface CreateDocumentInput {
  title: string;
  description?: string;
  categoryId: string;
  file: File;
  tags?: string[];
  visibility?: 'PRIVATE' | 'INTERNAL' | 'PUBLIC';
  metadata?: Record<string, any>;
}

export interface UpdateDocumentInput {
  id: string;
  title?: string;
  description?: string;
  categoryId?: string;
  tags?: string[];
  visibility?: 'PRIVATE' | 'INTERNAL' | 'PUBLIC';
  metadata?: Record<string, any>;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  parentId?: string;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryInput {
  id: string;
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

export interface CreateTemplateInput {
  name: string;
  description?: string;
  category: string;
  templateFile: File;
  thumbnailFile?: File;
  fields: any[];
  isPublic?: boolean;
}

export interface UpdateTemplateInput {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  fields?: any[];
  isPublic?: boolean;
}

export interface CreateShareInput {
  documentId: string;
  shareType: 'LINK' | 'EMAIL' | 'INTERNAL';
  recipients?: Array<{ email: string; name?: string }>;
  expiresAt?: string;
  password?: string;
  allowDownload?: boolean;
  allowComments?: boolean;
  maxAccessCount?: number;
}

export interface UpdateShareInput {
  id: string;
  expiresAt?: string;
  allowDownload?: boolean;
  allowComments?: boolean;
  maxAccessCount?: number;
}

export interface CreateCommentInput {
  documentId: string;
  content: string;
  page?: number;
  position?: { x: number; y: number; width?: number; height?: number };
  parentId?: string;
}

export interface UpdateCommentInput {
  id: string;
  content: string;
}
