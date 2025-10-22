/**
 * Documents Slice
 * 
 * Redux slice for managing documents using the slice factory.
 * Handles CRUD operations for document management and storage.
 */

import { createEntitySlice, EntityApiService } from '../../../stores/sliceFactory';
import { documentsApi } from '../../../services';

// Document interface
interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  studentId?: string;
  uploadedBy: string;
  uploadedAt: string;
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Document creation data
interface CreateDocumentData {
  name: string;
  type: string;
  size: number;
  url: string;
  studentId?: string;
  tags?: string[];
}

// Document update data
interface UpdateDocumentData {
  name?: string;
  tags?: string[];
  isActive?: boolean;
}

// Document filters
interface DocumentFilters {
  studentId?: string;
  type?: string;
  uploadedBy?: string;
  tags?: string[];
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// Create API service adapter for documents
const documentsApiService: EntityApiService<Document, CreateDocumentData, UpdateDocumentData> = {
  async getAll(params?: DocumentFilters) {
    const response = await documentsApi.getDocuments(params);
    return {
      data: response.documents || [],
      total: response.pagination?.total || 0,
      pagination: response.pagination,
    };
  },

  async getById(id: string) {
    const response = await documentsApi.getDocumentById(id);
    return { data: response.document };
  },

  async create(data: CreateDocumentData) {
    const response = await documentsApi.createDocument(data as any);
    return { data: response.document };
  },

  async update(id: string, data: UpdateDocumentData) {
    const response = await documentsApi.updateDocument(id, data as any);
    return { data: response.document };
  },

  async delete(id: string) {
    await documentsApi.deleteDocument(id);
    return { success: true };
  },
};

// Create the documents slice using the entity factory
const documentsSliceFactory = createEntitySlice<Document, CreateDocumentData, UpdateDocumentData>(
  'documents',
  documentsApiService,
  {
    enableBulkOperations: true,
  }
);

// Export the slice and its components
export const documentsSlice = documentsSliceFactory.slice;
export const documentsReducer = documentsSlice.reducer;
export const documentsActions = documentsSliceFactory.actions;
export const documentsSelectors = documentsSliceFactory.adapter.getSelectors((state: any) => state.documents);
export const documentsThunks = documentsSliceFactory.thunks;

// Export custom selectors
export const selectDocumentsByStudent = (state: any, studentId: string): Document[] => {
  const allDocuments = documentsSelectors.selectAll(state) as Document[];
  return allDocuments.filter(document => document.studentId === studentId);
};

export const selectActiveDocuments = (state: any): Document[] => {
  const allDocuments = documentsSelectors.selectAll(state) as Document[];
  return allDocuments.filter(document => document.isActive);
};

export const selectDocumentsByType = (state: any, type: string): Document[] => {
  const allDocuments = documentsSelectors.selectAll(state) as Document[];
  return allDocuments.filter(document => document.type === type);
};

export const selectDocumentsByUploader = (state: any, uploadedBy: string): Document[] => {
  const allDocuments = documentsSelectors.selectAll(state) as Document[];
  return allDocuments.filter(document => document.uploadedBy === uploadedBy);
};

export const selectDocumentsByTag = (state: any, tag: string): Document[] => {
  const allDocuments = documentsSelectors.selectAll(state) as Document[];
  return allDocuments.filter(document => 
    document.tags && document.tags.includes(tag)
  );
};

export const selectRecentDocuments = (state: any, days: number = 7): Document[] => {
  const allDocuments = documentsSelectors.selectAll(state) as Document[];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return allDocuments.filter(document => {
    const uploadDate = new Date(document.uploadedAt);
    return uploadDate >= cutoffDate;
  }).sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
};
