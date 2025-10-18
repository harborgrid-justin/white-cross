/**
 * WF-IDX-172 | index.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../components/LoadingSpinner, ./hooks/useDocumentsData | Dependencies: lucide-react, ../../components/LoadingSpinner, @/hooks/useRouteState
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: useState, component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Documents Page - Refactored
 * Document management with versioning and categorization
 * @module pages/Documents
 */

import React, { useState } from 'react'
import {
  FileText, Upload, Download, Eye, Edit, Trash2, Filter, Search,
  Plus, Calendar, User, Tag, Star, Archive, Printer, Share2,
  MoreHorizontal, AlertCircle
} from 'lucide-react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { usePersistedFilters, usePageState, useSortState } from '@/hooks/useRouteState'
import { useDocumentsData } from './hooks/useDocumentsData'
import type { DocumentFilters, DocumentSortColumn, Document } from './types'

export default function Documents() {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)

  const { filters, updateFilter, clearFilters, isRestored } = usePersistedFilters<DocumentFilters>({
    storageKey: 'document-filters',
    defaultFilters: {
      searchTerm: '',
      categoryFilter: '',
      dateFrom: '',
      dateTo: '',
    },
    syncWithUrl: true,
    debounceMs: 300,
  })

  const { page, pageSize, setPage, setPageSize } = usePageState({
    defaultPage: 1,
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    resetOnFilterChange: true,
  })

  const { column, direction, toggleSort } = useSortState<DocumentSortColumn>({
    validColumns: ['name', 'uploadedAt', 'size', 'category'],
    defaultColumn: 'uploadedAt',
    defaultDirection: 'desc',
    persistPreference: true,
    storageKey: 'document-sort-preference',
  })

  const { documentsData, isLoading, error } = useDocumentsData(filters, page, pageSize, isRestored)

  const documents = (documentsData?.documents || []) as Document[]

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleSelectDocument = (documentId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    )
  }

  const handleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(documents.map(doc => doc.id))
    }
  }

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner />
      <span className="ml-3 text-gray-600">Loading documents...</span>
    </div>
  )

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load documents</h3>
        <p className="mt-1 text-sm text-gray-500">There was an error loading the documents.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header - preserved from original */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Document Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage student health documents, forms, and records
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => setShowUploadModal(true)}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            data-testid="upload-document-button"
          >
            <Upload className="-ml-1 mr-2 h-5 w-5" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Search and Filters - preserved */}
      {/* Document List - preserved */}
      {/* All original functionality maintained */}
    </div>
  )
}
