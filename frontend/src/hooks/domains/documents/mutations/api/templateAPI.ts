// Template API functions
import { Document, DocumentTemplate } from '../../config';
import { CreateTemplateInput, UpdateTemplateInput } from '../types';

export const templateAPI = {
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
};
