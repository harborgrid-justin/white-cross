import { ApiResponse } from '../types'

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

export interface DocumentsData {
  documents: Document[]
  total: number
}

export interface DocumentFilters {
  search?: string
  category?: string
  studentId?: string
  dateFrom?: string
  dateTo?: string
  tags?: string[]
}

class DocumentService {
  private baseURL = '/api/documents'

  async getDocuments(filters: DocumentFilters = {}): Promise<DocumentsData> {
    const params = new URLSearchParams()
    
    if (filters.search) params.append('search', filters.search)
    if (filters.category) params.append('category', filters.category)
    if (filters.studentId) params.append('studentId', filters.studentId)
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
    if (filters.dateTo) params.append('dateTo', filters.dateTo)
    if (filters.tags?.length) params.append('tags', filters.tags.join(','))

    const url = `${this.baseURL}${params.toString() ? `?${params}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<DocumentsData> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to fetch documents')
    }

    return result.data
  }

  async getDocument(id: string): Promise<Document> {
    const response = await fetch(`${this.baseURL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<{ document: Document }> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to fetch document')
    }

    return result.data.document
  }

  async uploadDocument(formData: FormData): Promise<{ id: string; name: string }> {
    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<{ id: string; name: string }> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to upload document')
    }

    return result.data
  }

  async deleteDocument(id: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<void> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to delete document')
    }
  }

  async downloadDocument(id: string): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/${id}/download`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.blob()
  }

  async previewDocument(id: string): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/${id}/preview`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.blob()
  }

  async getDocumentVersions(id: string): Promise<any[]> {
    const response = await fetch(`${this.baseURL}/${id}/versions`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<{ versions: any[] }> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to fetch document versions')
    }

    return result.data.versions
  }

  async uploadNewVersion(id: string, formData: FormData): Promise<{ version: number }> {
    const response = await fetch(`${this.baseURL}/${id}/versions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<{ version: number }> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to upload new version')
    }

    return result.data
  }

  async compareVersions(id: string, fromVersion: number, toVersion: number): Promise<any> {
    const response = await fetch(`${this.baseURL}/${id}/versions/compare?from=${fromVersion}&to=${toVersion}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<any> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to compare versions')
    }

    return result.data
  }

  async restoreVersion(id: string, version: number): Promise<void> {
    const response = await fetch(`${this.baseURL}/${id}/restore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ version })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<void> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to restore version')
    }
  }

  async addTags(id: string, tags: string[]): Promise<void> {
    const response = await fetch(`${this.baseURL}/${id}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ tags })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<void> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to add tags')
    }
  }

  async requestSignature(id: string, signerEmail: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/${id}/request-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ signerEmail })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<void> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to request signature')
    }
  }

  async getSignatures(id: string): Promise<any[]> {
    const response = await fetch(`${this.baseURL}/${id}/signatures`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<{ signatures: any[] }> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to fetch signatures')
    }

    return result.data.signatures
  }

  async verifySignature(id: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/${id}/verify-signature`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<any> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to verify signature')
    }

    return result.data
  }

  async performOCR(file: File): Promise<{ text: string; confidence: number }> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${this.baseURL}/ocr`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<{ text: string; confidence: number }> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to perform OCR')
    }

    return result.data
  }

  async searchContent(query: string): Promise<any[]> {
    const response = await fetch(`${this.baseURL}/search?q=${encodeURIComponent(query)}&content=true`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<{ documents: any[] }> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to search documents')
    }

    return result.data.documents
  }

  async bulkDownload(documentIds: string[]): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/bulk-download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ documentIds })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.blob()
  }

  async bulkCategorize(documentIds: string[], category: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/bulk-categorize`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ documentIds, category })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<void> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to categorize documents')
    }
  }

  async archiveExpired(): Promise<{ archived: number }> {
    const response = await fetch(`${this.baseURL}/archive-expired`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<{ archived: number }> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to archive expired documents')
    }

    return result.data
  }
}

export const documentService = new DocumentService()