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
