import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  DOCUMENTS_QUERY_KEYS,
  invalidateDocumentQueries,
  invalidateCategoryQueries,
  invalidateTemplateQueries,
  invalidateShareQueries,
  Document,
  DocumentCategory,
  DocumentTemplate,
  DocumentShare,
  DocumentComment,
} from '../config';

// Additional interfaces for mutations
interface CreateDocumentInput {
  title: string;
  description?: string;
  categoryId: string;
  file: File;
  tags?: string[];
  visibility?: 'PRIVATE' | 'INTERNAL' | 'PUBLIC';
  metadata?: Record<string, any>;
}

interface UpdateDocumentInput {
  id: string;
  title?: string;
  description?: string;
  categoryId?: string;
  tags?: string[];
  visibility?: 'PRIVATE' | 'INTERNAL' | 'PUBLIC';
  metadata?: Record<string, any>;
}

interface CreateCategoryInput {
  name: string;
  description?: string;
  parentId?: string;
  color?: string;
  icon?: string;
}

interface UpdateCategoryInput {
  id: string;
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

interface CreateTemplateInput {
  name: string;
  description?: string;
  category: string;
  templateFile: File;
  thumbnailFile?: File;
  fields: any[];
  isPublic?: boolean;
}

interface UpdateTemplateInput {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  fields?: any[];
  isPublic?: boolean;
}

interface CreateShareInput {
  documentId: string;
  shareType: 'LINK' | 'EMAIL' | 'INTERNAL';
  recipients?: Array<{ email: string; name?: string }>;
  expiresAt?: string;
  password?: string;
  allowDownload?: boolean;
  allowComments?: boolean;
  maxAccessCount?: number;
}

interface UpdateShareInput {
  id: string;
  expiresAt?: string;
  allowDownload?: boolean;
  allowComments?: boolean;
  maxAccessCount?: number;
}

interface CreateCommentInput {
  documentId: string;
  content: string;
  page?: number;
  position?: { x: number; y: number; width?: number; height?: number };
  parentId?: string;
}

interface UpdateCommentInput {
  id: string;
  content: string;
}

// Mock API functions (replace with actual API calls)
const mockDocumentMutationAPI = {
  // Document CRUD
  createDocument: async (data: CreateDocumentInput): Promise<Document> => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate file upload
    return {
      id: 'new-doc-id',
      title: data.title,
      description: data.description,
      fileName: data.file.name,
      fileSize: data.file.size,
      mimeType: data.file.type,
      fileUrl: `https://example.com/files/${data.file.name}`,
      thumbnailUrl: `https://example.com/thumbnails/${data.file.name}.jpg`,
      category: {
        id: data.categoryId,
        name: 'Sample Category',
        path: '/sample-category',
        isActive: true
      },
      tags: data.tags || [],
      status: 'DRAFT' as const,
      visibility: data.visibility || 'PRIVATE' as const,
      version: 1,
      isLatestVersion: true,
      metadata: {
        customFields: data.metadata || {}
      },
      permissions: [],
      createdBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  updateDocument: async (data: UpdateDocumentInput): Promise<Document> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: data.id,
      title: data.title || 'Updated Document',
      description: data.description,
      fileName: 'document.pdf',
      fileSize: 1024000,
      mimeType: 'application/pdf',
      fileUrl: 'https://example.com/files/document.pdf',
      category: {
        id: data.categoryId || 'default-category',
        name: 'Updated Category',
        path: '/updated-category',
        isActive: true
      },
      tags: data.tags || [],
      status: 'DRAFT' as const,
      visibility: data.visibility || 'PRIVATE' as const,
      version: 2,
      isLatestVersion: true,
      metadata: {
        customFields: data.metadata || {}
      },
      permissions: [],
      createdBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      updatedBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  deleteDocument: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  duplicateDocument: async (id: string): Promise<Document> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: 'duplicated-doc-id',
      title: 'Copy of Document',
      description: 'Duplicated document',
      fileName: 'document-copy.pdf',
      fileSize: 1024000,
      mimeType: 'application/pdf',
      fileUrl: 'https://example.com/files/document-copy.pdf',
      category: {
        id: 'default-category',
        name: 'Default Category',
        path: '/default-category',
        isActive: true
      },
      tags: [],
      status: 'DRAFT' as const,
      visibility: 'PRIVATE' as const,
      version: 1,
      isLatestVersion: true,
      metadata: {
        customFields: {}
      },
      permissions: [],
      createdBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  uploadNewVersion: async (docId: string, file: File, changes: string): Promise<Document> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      id: docId,
      title: 'Updated Document',
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      fileUrl: `https://example.com/files/${file.name}`,
      category: {
        id: 'default-category',
        name: 'Default Category',
        path: '/default-category',
        isActive: true
      },
      tags: [],
      status: 'DRAFT' as const,
      visibility: 'PRIVATE' as const,
      version: 2,
      isLatestVersion: true,
      metadata: {
        customFields: {}
      },
      permissions: [],
      createdBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      updatedBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  // Document Actions
  favoriteDocument: async (docId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  unfavoriteDocument: async (docId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  moveDocument: async (docId: string, categoryId: string): Promise<Document> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      id: docId,
      title: 'Moved Document',
      fileName: 'document.pdf',
      fileSize: 1024000,
      mimeType: 'application/pdf',
      fileUrl: 'https://example.com/files/document.pdf',
      category: {
        id: categoryId,
        name: 'New Category',
        path: '/new-category',
        isActive: true
      },
      tags: [],
      status: 'DRAFT' as const,
      visibility: 'PRIVATE' as const,
      version: 1,
      isLatestVersion: true,
      metadata: {
        customFields: {}
      },
      permissions: [],
      createdBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  restoreDocument: async (docId: string): Promise<Document> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: docId,
      title: 'Restored Document',
      fileName: 'document.pdf',
      fileSize: 1024000,
      mimeType: 'application/pdf',
      fileUrl: 'https://example.com/files/document.pdf',
      category: {
        id: 'default-category',
        name: 'Default Category',
        path: '/default-category',
        isActive: true
      },
      tags: [],
      status: 'PUBLISHED' as const,
      visibility: 'PRIVATE' as const,
      version: 1,
      isLatestVersion: true,
      metadata: {
        customFields: {}
      },
      permissions: [],
      createdBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  // Category CRUD
  createCategory: async (data: CreateCategoryInput): Promise<DocumentCategory> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      id: 'new-category-id',
      name: data.name,
      description: data.description,
      parentId: data.parentId,
      color: data.color || '#007bff',
      icon: data.icon || 'folder',
      path: data.parentId ? `/parent/${data.name}` : `/${data.name}`,
      isActive: true
    };
  },

  updateCategory: async (data: UpdateCategoryInput): Promise<DocumentCategory> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: data.id,
      name: data.name || 'Updated Category',
      description: data.description,
      color: data.color || '#007bff',
      icon: data.icon || 'folder',
      path: `/${data.name || 'updated-category'}`,
      isActive: data.isActive !== undefined ? data.isActive : true
    };
  },

  deleteCategory: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
  },

  // Template CRUD
  createTemplate: async (data: CreateTemplateInput): Promise<DocumentTemplate> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      id: 'new-template-id',
      name: data.name,
      description: data.description,
      category: data.category,
      templateUrl: `https://example.com/templates/${data.name}.template`,
      thumbnailUrl: `https://example.com/templates/${data.name}.jpg`,
      fields: data.fields,
      isPublic: data.isPublic || false,
      usageCount: 0,
      createdBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  updateTemplate: async (data: UpdateTemplateInput): Promise<DocumentTemplate> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: data.id,
      name: data.name || 'Updated Template',
      description: data.description,
      category: data.category || 'default',
      templateUrl: `https://example.com/templates/${data.name || 'template'}.template`,
      fields: data.fields || [],
      isPublic: data.isPublic !== undefined ? data.isPublic : false,
      usageCount: 5,
      createdBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
  },

  createFromTemplate: async (templateId: string, data: any): Promise<Document> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return {
      id: 'new-doc-from-template-id',
      title: data.title || 'Document from Template',
      fileName: 'template-document.pdf',
      fileSize: 1024000,
      mimeType: 'application/pdf',
      fileUrl: 'https://example.com/files/template-document.pdf',
      category: {
        id: 'default-category',
        name: 'Default Category',
        path: '/default-category',
        isActive: true
      },
      tags: [],
      status: 'DRAFT' as const,
      visibility: 'PRIVATE' as const,
      version: 1,
      isLatestVersion: true,
      metadata: {
        customFields: data
      },
      permissions: [],
      createdBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  // Share CRUD
  createShare: async (data: CreateShareInput): Promise<DocumentShare> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      id: 'new-share-id',
      documentId: data.documentId,
      document: {
        id: data.documentId,
        title: 'Shared Document',
        fileName: 'document.pdf',
        fileSize: 1024000,
        mimeType: 'application/pdf',
        fileUrl: 'https://example.com/files/document.pdf',
        category: {
          id: 'default-category',
          name: 'Default Category',
          path: '/default-category',
          isActive: true
        },
        tags: [],
        status: 'PUBLISHED' as const,
        visibility: 'INTERNAL' as const,
        version: 1,
        isLatestVersion: true,
        metadata: { customFields: {} },
        permissions: [],
        createdBy: {
          id: 'current-user',
          name: 'Current User',
          email: 'user@example.com'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      shareType: data.shareType,
      shareToken: 'share-token-123',
      expiresAt: data.expiresAt,
      password: !!data.password,
      allowDownload: data.allowDownload !== false,
      allowComments: data.allowComments !== false,
      accessCount: 0,
      maxAccessCount: data.maxAccessCount,
      recipients: (data.recipients || []).map((r, i) => ({
        id: `recipient-${i}`,
        email: r.email,
        name: r.name,
        accessCount: 0
      })),
      createdBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date().toISOString()
    };
  },

  updateShare: async (data: UpdateShareInput): Promise<DocumentShare> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: data.id,
      documentId: 'doc-id',
      document: {
        id: 'doc-id',
        title: 'Shared Document',
        fileName: 'document.pdf',
        fileSize: 1024000,
        mimeType: 'application/pdf',
        fileUrl: 'https://example.com/files/document.pdf',
        category: {
          id: 'default-category',
          name: 'Default Category',
          path: '/default-category',
          isActive: true
        },
        tags: [],
        status: 'PUBLISHED' as const,
        visibility: 'INTERNAL' as const,
        version: 1,
        isLatestVersion: true,
        metadata: { customFields: {} },
        permissions: [],
        createdBy: {
          id: 'current-user',
          name: 'Current User',
          email: 'user@example.com'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      shareType: 'LINK' as const,
      shareToken: 'share-token-123',
      expiresAt: data.expiresAt,
      password: false,
      allowDownload: data.allowDownload !== false,
      allowComments: data.allowComments !== false,
      accessCount: 5,
      maxAccessCount: data.maxAccessCount,
      recipients: [],
      createdBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date(Date.now() - 86400000).toISOString()
    };
  },

  deleteShare: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  // Comment CRUD
  createComment: async (data: CreateCommentInput): Promise<DocumentComment> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      id: 'new-comment-id',
      documentId: data.documentId,
      content: data.content,
      page: data.page,
      position: data.position,
      parentId: data.parentId,
      replies: [],
      author: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isResolved: false
    };
  },

  updateComment: async (data: UpdateCommentInput): Promise<DocumentComment> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: data.id,
      documentId: 'doc-id',
      content: data.content,
      replies: [],
      author: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      isResolved: false
    };
  },

  deleteComment: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  resolveComment: async (id: string): Promise<DocumentComment> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      documentId: 'doc-id',
      content: 'Resolved comment',
      replies: [],
      author: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      isResolved: true
    };
  },

  // Bulk Operations
  bulkDelete: async (docIds: string[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  bulkMove: async (docIds: string[], categoryId: string): Promise<Document[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return docIds.map(id => ({
      id,
      title: 'Moved Document',
      fileName: 'document.pdf',
      fileSize: 1024000,
      mimeType: 'application/pdf',
      fileUrl: 'https://example.com/files/document.pdf',
      category: {
        id: categoryId,
        name: 'New Category',
        path: '/new-category',
        isActive: true
      },
      tags: [],
      status: 'DRAFT' as const,
      visibility: 'PRIVATE' as const,
      version: 1,
      isLatestVersion: true,
      metadata: { customFields: {} },
      permissions: [],
      createdBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    }));
  },

  bulkUpdateTags: async (docIds: string[], tags: string[]): Promise<Document[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return docIds.map(id => ({
      id,
      title: 'Tagged Document',
      fileName: 'document.pdf',
      fileSize: 1024000,
      mimeType: 'application/pdf',
      fileUrl: 'https://example.com/files/document.pdf',
      category: {
        id: 'default-category',
        name: 'Default Category',
        path: '/default-category',
        isActive: true
      },
      tags,
      status: 'DRAFT' as const,
      visibility: 'PRIVATE' as const,
      version: 1,
      isLatestVersion: true,
      metadata: { customFields: {} },
      permissions: [],
      createdBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    }));
  },

  // Export
  exportDocuments: async (docIds: string[], format: 'PDF' | 'ZIP'): Promise<{ downloadUrl: string }> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return { downloadUrl: `https://example.com/export/documents.${format.toLowerCase()}` };
  },
};

// Document Mutations
export const useCreateDocument = (
  options?: UseMutationOptions<Document, Error, CreateDocumentInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.createDocument,
    onSuccess: (newDocument) => {
      invalidateDocumentQueries(queryClient);
      toast.success(`Document "${newDocument.title}" uploaded successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload document: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdateDocument = (
  options?: UseMutationOptions<Document, Error, UpdateDocumentInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.updateDocument,
    onSuccess: (updatedDocument) => {
      queryClient.setQueryData(
        DOCUMENTS_QUERY_KEYS.documentDetails(updatedDocument.id),
        updatedDocument
      );
      invalidateDocumentQueries(queryClient);
      toast.success('Document updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update document: ${error.message}`);
    },
    ...options,
  });
};

export const useDeleteDocument = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.deleteDocument,
    onSuccess: (_, docId) => {
      invalidateDocumentQueries(queryClient);
      toast.success('Document deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete document: ${error.message}`);
    },
    ...options,
  });
};

export const useDuplicateDocument = (
  options?: UseMutationOptions<Document, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.duplicateDocument,
    onSuccess: (duplicatedDoc) => {
      invalidateDocumentQueries(queryClient);
      toast.success('Document duplicated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to duplicate document: ${error.message}`);
    },
    ...options,
  });
};

export const useUploadNewVersion = (
  options?: UseMutationOptions<Document, Error, { docId: string; file: File; changes: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ docId, file, changes }) => mockDocumentMutationAPI.uploadNewVersion(docId, file, changes),
    onSuccess: (_, { docId }) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.documentDetails(docId) });
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.documentVersions(docId) });
      toast.success('New version uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload new version: ${error.message}`);
    },
    ...options,
  });
};

// Document Actions
export const useFavoriteDocument = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.favoriteDocument,
    onSuccess: (_, docId) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.documentDetails(docId) });
      queryClient.invalidateQueries({ queryKey: ['documents', 'favorites'] });
      toast.success('Document added to favorites');
    },
    onError: (error: Error) => {
      toast.error(`Failed to favorite document: ${error.message}`);
    },
    ...options,
  });
};

export const useUnfavoriteDocument = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.unfavoriteDocument,
    onSuccess: (_, docId) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.documentDetails(docId) });
      queryClient.invalidateQueries({ queryKey: ['documents', 'favorites'] });
      toast.success('Document removed from favorites');
    },
    onError: (error: Error) => {
      toast.error(`Failed to unfavorite document: ${error.message}`);
    },
    ...options,
  });
};

export const useMoveDocument = (
  options?: UseMutationOptions<Document, Error, { docId: string; categoryId: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ docId, categoryId }) => mockDocumentMutationAPI.moveDocument(docId, categoryId),
    onSuccess: (_, { docId }) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.documentDetails(docId) });
      invalidateDocumentQueries(queryClient);
      toast.success('Document moved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to move document: ${error.message}`);
    },
    ...options,
  });
};

// Category Mutations
export const useCreateCategory = (
  options?: UseMutationOptions<DocumentCategory, Error, CreateCategoryInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.createCategory,
    onSuccess: (newCategory) => {
      invalidateCategoryQueries(queryClient);
      toast.success(`Category "${newCategory.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create category: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdateCategory = (
  options?: UseMutationOptions<DocumentCategory, Error, UpdateCategoryInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.updateCategory,
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData(
        DOCUMENTS_QUERY_KEYS.categoryDetails(updatedCategory.id),
        updatedCategory
      );
      invalidateCategoryQueries(queryClient);
      toast.success('Category updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update category: ${error.message}`);
    },
    ...options,
  });
};

export const useDeleteCategory = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.deleteCategory,
    onSuccess: () => {
      invalidateCategoryQueries(queryClient);
      toast.success('Category deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
    ...options,
  });
};

// Template Mutations
export const useCreateTemplate = (
  options?: UseMutationOptions<DocumentTemplate, Error, CreateTemplateInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.createTemplate,
    onSuccess: (newTemplate) => {
      invalidateTemplateQueries(queryClient);
      toast.success(`Template "${newTemplate.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create template: ${error.message}`);
    },
    ...options,
  });
};

export const useCreateFromTemplate = (
  options?: UseMutationOptions<Document, Error, { templateId: string; data: any }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ templateId, data }) => mockDocumentMutationAPI.createFromTemplate(templateId, data),
    onSuccess: (newDocument) => {
      invalidateDocumentQueries(queryClient);
      toast.success('Document created from template successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create document from template: ${error.message}`);
    },
    ...options,
  });
};

// Share Mutations
export const useCreateShare = (
  options?: UseMutationOptions<DocumentShare, Error, CreateShareInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.createShare,
    onSuccess: (newShare) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.sharesList(newShare.documentId) });
      toast.success('Document shared successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to share document: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdateShare = (
  options?: UseMutationOptions<DocumentShare, Error, UpdateShareInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.updateShare,
    onSuccess: (updatedShare) => {
      queryClient.setQueryData(
        DOCUMENTS_QUERY_KEYS.shareDetails(updatedShare.id),
        updatedShare
      );
      invalidateShareQueries(queryClient);
      toast.success('Share settings updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update share: ${error.message}`);
    },
    ...options,
  });
};

export const useDeleteShare = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.deleteShare,
    onSuccess: () => {
      invalidateShareQueries(queryClient);
      toast.success('Share removed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove share: ${error.message}`);
    },
    ...options,
  });
};

// Comment Mutations
export const useCreateComment = (
  options?: UseMutationOptions<DocumentComment, Error, CreateCommentInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.createComment,
    onSuccess: (_, { documentId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents', documentId, 'comments'] });
      toast.success('Comment added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add comment: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdateComment = (
  options?: UseMutationOptions<DocumentComment, Error, UpdateCommentInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.updateComment,
    onSuccess: (updatedComment) => {
      // Invalidate comments for the document
      queryClient.invalidateQueries({ queryKey: ['documents', 'comments'] });
      toast.success('Comment updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update comment: ${error.message}`);
    },
    ...options,
  });
};

export const useDeleteComment = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', 'comments'] });
      toast.success('Comment deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete comment: ${error.message}`);
    },
    ...options,
  });
};

export const useResolveComment = (
  options?: UseMutationOptions<DocumentComment, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.resolveComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', 'comments'] });
      toast.success('Comment resolved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to resolve comment: ${error.message}`);
    },
    ...options,
  });
};

// Bulk Operations
export const useBulkDeleteDocuments = (
  options?: UseMutationOptions<void, Error, string[]>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.bulkDelete,
    onSuccess: (_, docIds) => {
      invalidateDocumentQueries(queryClient);
      toast.success(`${docIds.length} documents deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete documents: ${error.message}`);
    },
    ...options,
  });
};

export const useBulkMoveDocuments = (
  options?: UseMutationOptions<Document[], Error, { docIds: string[]; categoryId: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ docIds, categoryId }) => mockDocumentMutationAPI.bulkMove(docIds, categoryId),
    onSuccess: (_, { docIds }) => {
      invalidateDocumentQueries(queryClient);
      toast.success(`${docIds.length} documents moved successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to move documents: ${error.message}`);
    },
    ...options,
  });
};

// Export Operations
export const useExportDocuments = (
  options?: UseMutationOptions<{ downloadUrl: string }, Error, { docIds: string[]; format: 'PDF' | 'ZIP' }>
) => {
  return useMutation({
    mutationFn: ({ docIds, format }) => mockDocumentMutationAPI.exportDocuments(docIds, format),
    onSuccess: (result, { docIds, format }) => {
      // Trigger download
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = `documents-export.${format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${docIds.length} documents exported successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to export documents: ${error.message}`);
    },
    ...options,
  });
};

// Combined mutations object for easy import
export const documentMutations = {
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useDuplicateDocument,
  useUploadNewVersion,
  useFavoriteDocument,
  useUnfavoriteDocument,
  useMoveDocument,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCreateTemplate,
  useCreateFromTemplate,
  useCreateShare,
  useUpdateShare,
  useDeleteShare,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useResolveComment,
  useBulkDeleteDocuments,
  useBulkMoveDocuments,
  useExportDocuments,
};
