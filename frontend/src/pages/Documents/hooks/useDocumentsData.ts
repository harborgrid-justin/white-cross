/**
 * WF-COMP-171 | useDocumentsData.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../../services/documentService | Dependencies: @tanstack/react-query, ../../../services/documentService
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import { useQuery } from '@tanstack/react-query'
import { documentService } from '../../../services/documentService'
import type { DocumentFilters } from '../types'

export const useDocumentsData = (
  filters: DocumentFilters,
  page: number,
  pageSize: number,
  isRestored: boolean
) => {
  const { data: documentsData, isLoading, error } = useQuery({
    queryKey: ['documents', filters.searchTerm, filters.categoryFilter, page, pageSize],
    queryFn: async () => {
      const result = await documentService.getDocuments({
        search: filters.searchTerm,
        category: filters.categoryFilter,
        page,
        limit: pageSize
      })
      return result
    },
    enabled: isRestored
  })

  return {
    documentsData,
    isLoading: isLoading || !isRestored,
    error
  }
}
