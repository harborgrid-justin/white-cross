import { Document } from '../types';

export interface DocumentFilters {
  search?: string;
  category?: string;
}

export interface DocumentService {
  getDocuments(filters?: DocumentFilters): Promise<{ documents: Document[] }>;
}

declare const documentService: DocumentService;
export { documentService };
