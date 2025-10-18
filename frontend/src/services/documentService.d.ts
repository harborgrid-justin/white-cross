/**
 * WF-COMP-260 | documentService.d.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../types | Dependencies: ../types
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces, named exports | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

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
