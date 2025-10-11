import React, { useState, useEffect } from 'react'
import {
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Plus,
  Calendar,
  User,
  Tag,
  Star,
  Archive,
  Printer,
  Share2,
  MoreHorizontal,
  AlertCircle
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { documentService } from '../services/documentService'
import LoadingSpinner from '../components/LoadingSpinner'
import { usePersistedFilters, usePageState, useSortState } from '@/hooks/useRouteState'

interface Document {
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

interface DocumentsData {
  documents: Document[]
  total: number
}

interface DocumentFilters {
  searchTerm: string
  categoryFilter: string
  dateFrom: string
  dateTo: string
}

type DocumentSortColumn = 'name' | 'uploadedAt' | 'size' | 'category'

export default function Documents() {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)

  // State persistence hooks
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

  const { data: documentsData, isLoading, error } = useQuery({
    queryKey: ['documents', filters.searchTerm, filters.categoryFilter, page, pageSize],
    queryFn: async () => {
      const result = await documentService.getDocuments({
        search: filters.searchTerm,
        category: filters.categoryFilter,
        page,
        limit: pageSize
      })
      return result as DocumentsData
    },
  })

  const documents = (documentsData?.documents || []) as Document[]
  const isLoadingState = isLoading || !isRestored

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

  if (isLoadingState) return (
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
      {/* Header */}
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
          <button
            className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            data-testid="scan-document-button"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Scan Document
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              data-testid="document-search"
            />
          </div>

          <div>
            <select
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={filters.categoryFilter}
              onChange={(e) => updateFilter('categoryFilter', e.target.value)}
              data-testid="category-filter"
            >
              <option value="">All Categories</option>
              <option value="HEALTH_FORMS">Health Forms</option>
              <option value="VACCINATION_RECORDS">Vaccination Records</option>
              <option value="CONSENT_FORMS">Consent Forms</option>
              <option value="MEDICAL_REPORTS">Medical Reports</option>
              <option value="PRESCRIPTIONS">Prescriptions</option>
              <option value="INSURANCE_DOCUMENTS">Insurance Documents</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              data-testid="advanced-search"
            >
              <Filter className="h-4 w-4 mr-1" />
              Advanced
            </button>
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              data-testid="archive-expired-documents"
            >
              <Archive className="h-4 w-4 mr-1" />
              Archive
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedDocuments.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-md p-4" data-testid="bulk-actions">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium text-primary-700">
                {selectedDocuments.length} document{selectedDocuments.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                className="inline-flex items-center px-3 py-1.5 border border-primary-300 text-xs font-medium rounded text-primary-700 bg-white hover:bg-primary-50"
                data-testid="bulk-download"
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </button>
              <button
                className="inline-flex items-center px-3 py-1.5 border border-primary-300 text-xs font-medium rounded text-primary-700 bg-white hover:bg-primary-50"
                data-testid="bulk-categorize"
              >
                <Tag className="h-3 w-3 mr-1" />
                Categorize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documents List */}
      <div className="bg-white shadow rounded-lg overflow-hidden" data-testid="document-list">
        {documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by uploading a document.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Upload className="-ml-1 mr-2 h-5 w-5" />
                Upload Document
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={selectedDocuments.length === documents.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((document: any) => (
                  <tr key={document.id} className="hover:bg-gray-50" data-testid={`document-${document.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={selectedDocuments.includes(document.id)}
                        onChange={() => handleSelectDocument(document.id)}
                        data-testid={`select-document-${document.id}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{document.name}</div>
                          <div className="text-sm text-gray-500">Version {document.version}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{document.studentName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        data-testid="category-badge"
                      >
                        {document.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(document.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {formatDate(document.uploadedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-primary-600 hover:text-primary-900"
                          data-testid={`preview-document-${document.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          data-testid={`download-document-${document.id}`}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          data-testid={`edit-document-${document.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <div className="relative">
                          <button
                            className="text-gray-600 hover:text-gray-900"
                            data-testid={`view-versions-${document.id}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" data-testid="upload-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Document</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student</label>
                  <select 
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    data-testid="student-select"
                  >
                    <option value="">Select Student</option>
                    <option value="STU001">Emma Wilson</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select 
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    data-testid="category-select"
                  >
                    <option value="">Select Category</option>
                    <option value="HEALTH_FORMS">Health Forms</option>
                    <option value="VACCINATION_RECORDS">Vaccination Records</option>
                    <option value="CONSENT_FORMS">Consent Forms</option>
                    <option value="MEDICAL_REPORTS">Medical Reports</option>
                    <option value="PRESCRIPTIONS">Prescriptions</option>
                    <option value="INSURANCE_DOCUMENTS">Insurance Documents</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">File</label>
                  <input
                    type="file"
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    data-testid="file-input"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                  data-testid="submit-upload"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}