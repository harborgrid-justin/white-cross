/**
 * WF-COMP-173 | types.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces, types | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

export interface Document {
  id: string
  name: string
  category: string
  studentId: string
  studentName: string
  uploadedAt: string
  size: number
  version: number
  tags?: string[]
}

export interface DocumentFilters {
  searchTerm: string
  categoryFilter: string
  dateFrom: string
  dateTo: string
}

export type DocumentSortColumn = 'name' | 'uploadedAt' | 'size' | 'category'
