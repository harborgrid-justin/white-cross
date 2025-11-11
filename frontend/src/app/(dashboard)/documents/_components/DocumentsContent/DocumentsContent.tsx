'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Import server actions
import { 
  getDocuments, 
  type DocumentInfo 
} from '@/lib/actions/documents.actions';

// Import modular components
import { DocumentStatsComponent, DocumentStats } from './DocumentStats';
import { DocumentFiltersComponent } from './DocumentFilters';
import { DocumentActionsComponent, ViewMode } from './DocumentActions';
import { DocumentGridComponent } from './DocumentGrid';
import { DocumentListComponent } from './DocumentList';
import { Document, DocumentType, DocumentStatus, AccessLevel } from './types';

interface DocumentsContentProps {
  initialDocuments?: Document[];
  userRole?: string;
}

const DocumentsContent: React.FC<DocumentsContentProps> = ({ 
  initialDocuments = []
}) => {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');
  const [accessFilter, setAccessFilter] = useState<AccessLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load documents from server actions
  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoading(true);
        
        // Load documents from server actions
        const documentInfos = await getDocuments();
        
        // Transform DocumentInfo[] to Document[] for UI compatibility
        const transformedData: Document[] = documentInfos.map((doc: DocumentInfo) => ({
          id: doc.id,
          studentId: undefined,
          studentName: 'Unknown Student',
          fileName: doc.filename,
          title: doc.title,
          description: doc.description,
          documentType: (doc.category as DocumentType) || 'other',
          mimeType: doc.mimeType,
          fileSize: doc.size,
          status: 'active' as DocumentStatus,
          accessLevel: doc.isPHI ? 'nurse_only' : 'staff_only' as AccessLevel,
          tags: doc.category ? [doc.category] : [],
          isStarred: false,
          isEncrypted: doc.isPHI,
          uploadedBy: 'System',
          uploadedAt: doc.uploadedAt,
          lastModified: doc.uploadedAt,
          version: 1,
          downloadCount: 0,
          sharingEnabled: !doc.isPHI,
          auditLog: []
        }));
        
        setDocuments(transformedData);
      } catch (error) {
        console.error('Failed to load documents:', error);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    }

    if (initialDocuments.length > 0) {
      setDocuments(initialDocuments);
      setLoading(false);
    } else {
      fetchDocuments();
    }
  }, [initialDocuments]);

  // Keep mock data as fallback for now
  React.useEffect(() => {
    if (initialDocuments.length === 0 && documents.length === 0 && !loading) {
      // Mock data for development - replace with real API calls
      const now = new Date();
      const mockDocuments: Document[] = [
        {
          id: 'doc-001',
          studentId: 'student-001',
          studentName: 'Emily Johnson',
          fileName: 'emily_johnson_medical_record_2024.pdf',
          title: 'Annual Medical Record',
          description: 'Complete medical history and current health status',
          documentType: 'medical_record',
          mimeType: 'application/pdf',
          fileSize: 2.5 * 1024 * 1024,
          status: 'active',
          accessLevel: 'nurse_only',
          tags: ['medical', 'annual', 'complete'],
          isStarred: true,
          isEncrypted: true,
          uploadedBy: 'Nurse Williams',
          uploadedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          lastModified: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          version: 2,
          downloadCount: 8,
          sharingEnabled: false,
          auditLog: []
        },
        {
          id: 'doc-002',
          studentId: 'student-002',
          studentName: 'Michael Chen',
          fileName: 'covid_vaccine_card.jpg',
          title: 'COVID-19 Vaccination Record',
          description: 'Completed vaccination series documentation',
          documentType: 'immunization_record',
          mimeType: 'image/jpeg',
          fileSize: 1.2 * 1024 * 1024,
          status: 'active',
          accessLevel: 'staff_only',
          tags: ['immunization', 'covid', 'vaccination'],
          isStarred: false,
          isEncrypted: true,
          uploadedBy: 'Parent - Lisa Chen',
          uploadedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          lastModified: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          version: 1,
          downloadCount: 3,
          sharingEnabled: true,
          auditLog: []
        }
      ];

      setDocuments(mockDocuments);
      setLoading(false);
    }
  }, [initialDocuments]);

  // Calculate document statistics
  const stats: DocumentStats = React.useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return {
      totalDocuments: documents.length,
      activeDocuments: documents.filter(doc => doc.status === 'active').length,
      pendingReview: documents.filter(doc => doc.status === 'pending_review').length,
      expiringSoon: documents.filter(doc => 
        doc.expirationDate && 
        new Date(doc.expirationDate) <= sevenDaysFromNow &&
        new Date(doc.expirationDate) > now
      ).length,
      confidentialDocs: documents.filter(doc => 
        doc.accessLevel === 'nurse_only' || 
        doc.accessLevel === 'admin_only' || 
        doc.accessLevel === 'restricted'
      ).length,
      storageUsed: Math.round(documents.reduce((total, doc) => total + doc.fileSize, 0) / (1024 * 1024)),
      documentsThisMonth: documents.filter(doc => 
        new Date(doc.uploadedAt) >= thirtyDaysAgo
      ).length,
      averageFileSize: documents.length > 0 
        ? Math.round(documents.reduce((total, doc) => total + doc.fileSize, 0) / documents.length / (1024 * 1024) * 10) / 10 
        : 0
    };
  }, [documents]);

  // Filter and sort documents
  const filteredAndSortedDocuments = React.useMemo(() => {
    let filtered = documents;

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.documentType === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    // Apply access level filter
    if (accessFilter !== 'all') {
      filtered = filtered.filter(doc => doc.accessLevel === accessFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(query) ||
        doc.fileName.toLowerCase().includes(query) ||
        doc.studentName?.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort documents
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.lastModified).getTime();
          bValue = new Date(b.lastModified).getTime();
          break;
        case 'size':
          aValue = a.fileSize;
          bValue = b.fileSize;
          break;
        case 'type':
          aValue = a.documentType;
          bValue = b.documentType;
          break;
        default:
          aValue = new Date(a.lastModified).getTime();
          bValue = new Date(b.lastModified).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [documents, typeFilter, statusFilter, accessFilter, searchQuery, sortBy, sortOrder]);

  // Event handlers
  const handleDocumentSelect = (documentId: string, selected: boolean) => {
    const newSelected = new Set(selectedDocuments);
    if (selected) {
      newSelected.add(documentId);
    } else {
      newSelected.delete(documentId);
    }
    setSelectedDocuments(newSelected);
  };

  const handleBulkDownload = () => {
    console.log('Bulk download:', Array.from(selectedDocuments));
  };

  const handleBulkShare = () => {
    console.log('Bulk share:', Array.from(selectedDocuments));
  };

  const handleBulkArchive = () => {
    console.log('Bulk archive:', Array.from(selectedDocuments));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <div className="p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <div className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Document Statistics */}
      <DocumentStatsComponent stats={stats} />

      {/* Document Management Controls */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <DocumentActionsComponent
            selectedDocuments={selectedDocuments}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onBulkDownload={handleBulkDownload}
            onBulkShare={handleBulkShare}
            onBulkArchive={handleBulkArchive}
          />

          <DocumentFiltersComponent
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            accessFilter={accessFilter}
            setAccessFilter={setAccessFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
        </div>
      </Card>

      {/* Documents Display */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Documents ({filteredAndSortedDocuments.length})
            </h2>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-sm text-gray-500 hover:text-gray-700"
              title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'} {sortBy}
            </button>
          </div>
          
          {filteredAndSortedDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-2">No documents found</p>
              <p className="text-sm text-gray-400 mb-4">
                Try adjusting your filters or upload a new document.
              </p>
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <DocumentGridComponent
                  documents={filteredAndSortedDocuments}
                  selectedDocuments={selectedDocuments}
                  onDocumentSelect={handleDocumentSelect}
                />
              ) : (
                <DocumentListComponent
                  documents={filteredAndSortedDocuments}
                  selectedDocuments={selectedDocuments}
                  onDocumentSelect={handleDocumentSelect}
                />
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DocumentsContent;
