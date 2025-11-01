'use client';

/**
 * Force dynamic rendering for real-time document data
 */


import React, { useState, useEffect } from 'react';
import { 
  FileText,
  Plus,
  Filter,
  List,
  Grid3x3,
  Download,
  Upload,
  Eye,
  Edit,
  Share2,
  Lock,
  Star,
  User,
  Tag,
  MoreVertical,
  FileImage,
  FileVideo,
  File,
  Shield,
  AlertTriangle,
  Clock,
  Archive
} from 'lucide-react';
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SearchInput } from '@/components/ui/SearchInput';

// Import server actions
import { 
  getDocuments, 
  getDocumentsDashboardData,
  getDocumentStats,
  type DocumentInfo 
} from '@/app/documents/actions';

// Document types and categories
type DocumentType = 'medical_record' | 'immunization_record' | 'medication_record' | 'incident_report' | 'emergency_contact' | 'consent_form' | 'allergy_record' | 'insurance_card' | 'iep_504' | 'health_plan' | 'prescription' | 'lab_result' | 'x_ray' | 'photo' | 'video' | 'other';
type DocumentStatus = 'active' | 'archived' | 'pending_review' | 'expired' | 'requires_update' | 'confidential';
type AccessLevel = 'public' | 'staff_only' | 'nurse_only' | 'admin_only' | 'restricted';
type ViewMode = 'grid' | 'list' | 'table';

interface Document {
  id: string;
  studentId?: string;
  studentName?: string;
  fileName: string;
  title: string;
  description?: string;
  documentType: DocumentType;
  mimeType: string;
  fileSize: number;
  status: DocumentStatus;
  accessLevel: AccessLevel;
  tags: string[];
  isStarred: boolean;
  isEncrypted: boolean;
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
  expirationDate?: string;
  version: number;
  downloadCount: number;
  sharingEnabled: boolean;
  auditLog: Array<{
    action: string;
    user: string;
    timestamp: string;
  }>;
}

interface DocumentStats {
  totalDocuments: number;
  activeDocuments: number;
  pendingReview: number;
  expiringSoon: number;
  confidentialDocs: number;
  storageUsed: number; // in MB
  documentsThisMonth: number;
  averageFileSize: number;
}

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
          studentId: undefined, // Not available in DocumentInfo
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
          fileSize: 2.5 * 1024 * 1024, // 2.5MB
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
          auditLog: [
            { action: 'created', user: 'Nurse Williams', timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString() },
            { action: 'updated', user: 'Nurse Williams', timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() }
          ]
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
          auditLog: [
            { action: 'uploaded', user: 'Parent - Lisa Chen', timestamp: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString() }
          ]
        },
        {
          id: 'doc-003',
          studentId: 'student-003',
          studentName: 'Sarah Martinez',
          fileName: 'allergy_action_plan.pdf',
          title: 'Severe Allergy Action Plan',
          description: 'Emergency action plan for severe peanut allergy',
          documentType: 'allergy_record',
          mimeType: 'application/pdf',
          fileSize: 800 * 1024,
          status: 'active',
          accessLevel: 'staff_only',
          tags: ['allergy', 'emergency', 'peanut', 'epipen'],
          isStarred: true,
          isEncrypted: true,
          uploadedBy: 'Dr. Rodriguez',
          uploadedAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          lastModified: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          expirationDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          version: 3,
          downloadCount: 15,
          sharingEnabled: false,
          auditLog: [
            { action: 'created', user: 'Dr. Rodriguez', timestamp: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString() },
            { action: 'reviewed', user: 'Nurse Johnson', timestamp: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString() },
            { action: 'updated', user: 'Dr. Rodriguez', timestamp: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString() }
          ]
        },
        {
          id: 'doc-004',
          studentId: 'student-004',
          studentName: 'David Thompson',
          fileName: 'incident_report_playground_2024_03_15.pdf',
          title: 'Playground Incident Report',
          description: 'Minor injury report from playground incident',
          documentType: 'incident_report',
          mimeType: 'application/pdf',
          fileSize: 1.5 * 1024 * 1024,
          status: 'archived',
          accessLevel: 'admin_only',
          tags: ['incident', 'playground', 'minor_injury'],
          isStarred: false,
          isEncrypted: true,
          uploadedBy: 'Nurse Williams',
          uploadedAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          lastModified: new Date(now.getTime() - 44 * 24 * 60 * 60 * 1000).toISOString(),
          version: 1,
          downloadCount: 5,
          sharingEnabled: false,
          auditLog: [
            { action: 'created', user: 'Nurse Williams', timestamp: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString() },
            { action: 'reviewed', user: 'Principal Davis', timestamp: new Date(now.getTime() - 44 * 24 * 60 * 60 * 1000).toISOString() }
          ]
        },
        {
          id: 'doc-005',
          studentId: 'student-005',
          studentName: 'Jessica Lee',
          fileName: 'iep_plan_2024_2025.pdf',
          title: 'Individual Education Plan (IEP)',
          description: 'Special education plan and accommodations',
          documentType: 'iep_504',
          mimeType: 'application/pdf',
          fileSize: 3.2 * 1024 * 1024,
          status: 'pending_review',
          accessLevel: 'restricted',
          tags: ['iep', 'special_education', 'accommodations'],
          isStarred: true,
          isEncrypted: true,
          uploadedBy: 'Special Ed Coordinator',
          uploadedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          lastModified: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          expirationDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          version: 1,
          downloadCount: 2,
          sharingEnabled: false,
          auditLog: [
            { action: 'uploaded', user: 'Special Ed Coordinator', timestamp: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString() },
            { action: 'modified', user: 'Special Ed Coordinator', timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString() }
          ]
        },
        {
          id: 'doc-006',
          studentName: 'General Documentation',
          fileName: 'school_health_policies_2024.pdf',
          title: 'School Health Policies',
          description: 'Updated health and safety policies for 2024-2025 school year',
          documentType: 'other',
          mimeType: 'application/pdf',
          fileSize: 5.1 * 1024 * 1024,
          status: 'active',
          accessLevel: 'public',
          tags: ['policy', 'health', 'safety', '2024'],
          isStarred: false,
          isEncrypted: false,
          uploadedBy: 'Principal Davis',
          uploadedAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          lastModified: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          version: 4,
          downloadCount: 127,
          sharingEnabled: true,
          auditLog: [
            { action: 'created', user: 'Principal Davis', timestamp: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString() },
            { action: 'updated', user: 'Principal Davis', timestamp: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString() }
          ]
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

  // Utility functions
  const getStatusBadge = (status: DocumentStatus) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800',
      pending_review: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-red-100 text-red-800',
      requires_update: 'bg-orange-100 text-orange-800',
      confidential: 'bg-purple-100 text-purple-800'
    };
    return <Badge className={variants[status]}>{status.replace('_', ' ')}</Badge>;
  };

  const getAccessLevelBadge = (accessLevel: AccessLevel) => {
    const variants = {
      public: 'bg-blue-100 text-blue-800',
      staff_only: 'bg-yellow-100 text-yellow-800',
      nurse_only: 'bg-orange-100 text-orange-800',
      admin_only: 'bg-red-100 text-red-800',
      restricted: 'bg-purple-100 text-purple-800'
    };
    return <Badge className={variants[accessLevel]}>{accessLevel.replace('_', ' ')}</Badge>;
  };

  const getFileIcon = (mimeType: string, documentType: DocumentType) => {
    if (mimeType.startsWith('image/')) return FileImage;
    if (mimeType.startsWith('video/')) return FileVideo;
    if (mimeType.includes('pdf')) return FileText;
    if (documentType === 'medical_record') return Shield;
    return File;
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpiringSoon = React.useMemo(() => {
    return (expirationDate?: string): boolean => {
      if (!expirationDate) return false;
      const now = new Date();
      const expiry = new Date(expirationDate);
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return expiry <= sevenDaysFromNow && expiry > now;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.totalDocuments}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.documentsThisMonth} added this month
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{stats.pendingReview}</p>
                <p className="text-xs text-gray-500 mt-1">Require attention</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.expiringSoon}</p>
                <p className="text-xs text-gray-500 mt-1">Within 7 days</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.storageUsed}MB</p>
                <p className="text-xs text-gray-500 mt-1">
                  Avg: {stats.averageFileSize}MB per file
                </p>
              </div>
              <Archive className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Document Management Controls */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Primary Actions */}
            <div className="flex items-center gap-3">
              <Button variant="primary">
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
              
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload
              </Button>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export List
              </Button>

              {selectedDocuments.size > 0 && (
                <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                  <span className="text-sm text-gray-600">
                    {selectedDocuments.size} selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Handle bulk download */}}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Handle bulk share */}}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Handle bulk archive */}}
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                </div>
              )}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-3">
              <div className="w-64">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search documents, students, or tags..."
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-gray-100' : ''}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <div className="flex rounded-lg border border-gray-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Grid view"
                  aria-label="Switch to grid view"
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm border-l border-gray-300 ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="List view"
                  aria-label="Switch to list view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid gap-4 md:grid-cols-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as DocumentType | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by document type"
                  >
                    <option value="all">All Types</option>
                    <option value="medical_record">Medical Records</option>
                    <option value="immunization_record">Immunization Records</option>
                    <option value="allergy_record">Allergy Records</option>
                    <option value="incident_report">Incident Reports</option>
                    <option value="iep_504">IEP/504 Plans</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by document status"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="archived">Archived</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Access Level
                  </label>
                  <select
                    value={accessFilter}
                    onChange={(e) => setAccessFilter(e.target.value as AccessLevel | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by access level"
                  >
                    <option value="all">All Levels</option>
                    <option value="public">Public</option>
                    <option value="staff_only">Staff Only</option>
                    <option value="nurse_only">Nurse Only</option>
                    <option value="admin_only">Admin Only</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size' | 'type')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Sort documents by"
                  >
                    <option value="date">Date Modified</option>
                    <option value="name">Name</option>
                    <option value="size">File Size</option>
                    <option value="type">Document Type</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTypeFilter('all');
                      setStatusFilter('all');
                      setAccessFilter('all');
                      setSearchQuery('');
                      setSortBy('date');
                      setSortOrder('desc');
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
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
              <Button variant="primary">
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-4'
            }>
              {filteredAndSortedDocuments.map((document) => {
                const FileIcon = getFileIcon(document.mimeType, document.documentType);
                
                return (
                  <div
                    key={document.id}
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      viewMode === 'grid' ? 'bg-white' : 'bg-white'
                    } ${
                      isExpiringSoon(document.expirationDate) 
                        ? 'border-orange-200 bg-orange-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    {viewMode === 'grid' ? (
                      // Grid view layout
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <input
                            type="checkbox"
                            checked={selectedDocuments.has(document.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedDocuments);
                              if (e.target.checked) {
                                newSelected.add(document.id);
                              } else {
                                newSelected.delete(document.id);
                              }
                              setSelectedDocuments(newSelected);
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            aria-label={`Select document: ${document.title}`}
                          />
                          
                          <div className="flex items-center space-x-1">
                            {document.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                            {document.isEncrypted && <Lock className="h-4 w-4 text-gray-500" />}
                            {isExpiringSoon(document.expirationDate) && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                          </div>
                        </div>

                        <div className="text-center">
                          <FileIcon className="h-12 w-12 mx-auto text-blue-500 mb-2" />
                          <h3 className="font-medium text-gray-900 text-sm truncate" title={document.title}>
                            {document.title}
                          </h3>
                          <p className="text-xs text-gray-500 truncate" title={document.fileName}>
                            {document.fileName}
                          </p>
                        </div>

                        <div className="space-y-2 text-xs">
                          {document.studentName && (
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1 text-gray-400" />
                              <span className="text-gray-600 truncate">{document.studentName}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">{formatFileSize(document.fileSize)}</span>
                            <span className="text-gray-500">v{document.version}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {getStatusBadge(document.status)}
                            {getAccessLevelBadge(document.accessLevel)}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" title="View document">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Download">
                              <Download className="h-3 w-3" />
                            </Button>
                            {document.sharingEnabled && (
                              <Button variant="ghost" size="sm" title="Share">
                                <Share2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          
                          <Button variant="ghost" size="sm" title="More options">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // List view layout
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedDocuments.has(document.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedDocuments);
                              if (e.target.checked) {
                                newSelected.add(document.id);
                              } else {
                                newSelected.delete(document.id);
                              }
                              setSelectedDocuments(newSelected);
                            }}
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            aria-label={`Select document: ${document.title}`}
                          />
                          
                          <FileIcon className="h-8 w-8 text-blue-500 mt-1" />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-gray-900 truncate">{document.title}</h3>
                              {document.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                              {document.isEncrypted && <Lock className="h-4 w-4 text-gray-500" />}
                              {isExpiringSoon(document.expirationDate) && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-1">{document.fileName}</p>
                            
                            {document.studentName && (
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                <User className="h-4 w-4 mr-1" />
                                {document.studentName}
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{formatFileSize(document.fileSize)}</span>
                              <span>v{document.version}</span>
                              <span>Modified {formatDate(document.lastModified)}</span>
                              <span>By {document.uploadedBy}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 mt-2">
                              {getStatusBadge(document.status)}
                              {getAccessLevelBadge(document.accessLevel)}
                              
                              {document.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} className="bg-gray-100 text-gray-700 text-xs">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                              
                              {document.tags.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{document.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="ghost" size="sm" title="View document">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Download">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {document.sharingEnabled && (
                            <Button variant="ghost" size="sm" title="Share">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" title="More options">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DocumentsContent;