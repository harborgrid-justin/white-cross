// Document CRUD API functions
import { Document } from '../../config';
import { CreateDocumentInput, UpdateDocumentInput } from '../types';

export const documentAPI = {
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
};
