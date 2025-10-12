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
