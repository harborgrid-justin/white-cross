// Share API functions
import { DocumentShare } from '../../config';
import { CreateShareInput, UpdateShareInput } from '../types';

export const shareAPI = {
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
};
