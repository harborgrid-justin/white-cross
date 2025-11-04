// Bulk operations API functions
import { Document } from '../../config';

export const bulkAPI = {
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

  exportDocuments: async (docIds: string[], format: 'PDF' | 'ZIP'): Promise<{ downloadUrl: string }> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return { downloadUrl: `https://example.com/export/documents.${format.toLowerCase()}` };
  },
};
