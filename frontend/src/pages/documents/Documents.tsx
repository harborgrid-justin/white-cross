import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Upload, 
  Download, 
  Eye, 
  FileText, 
  Image, 
  File,
  Calendar,
  User,
  Shield,
  Archive,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { documentsApi } from '../../services';

interface Document {
  id: string;
  name: string;
  type: 'medical' | 'administrative' | 'legal' | 'emergency' | 'other';
  category: string;
  fileType: 'pdf' | 'doc' | 'docx' | 'jpg' | 'png' | 'other';
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
  tags: string[];
  confidentialityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  studentId?: string;
  studentName?: string;
}

interface DocumentFilters {
  type: string;
  category: string;
  confidentialityLevel: string;
  dateRange: string;
  fileType: string;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<DocumentFilters>({
    type: '',
    category: '',
    confidentialityLevel: '',
    dateRange: '',
    fileType: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchTerm, filters]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockDocuments: Document[] = [
        {
          id: '1',
          name: 'Student Health Policy 2024',
          type: 'administrative',
          category: 'Policy',
          fileType: 'pdf',
          size: 2048000,
          uploadedBy: 'Admin User',
          uploadedAt: '2024-01-15T10:30:00Z',
          lastModified: '2024-01-20T14:45:00Z',
          tags: ['policy', 'health', '2024'],
          confidentialityLevel: 'internal'
        },
        {
          id: '2',
          name: 'Emergency Contact Form Template',
          type: 'administrative',
          category: 'Template',
          fileType: 'docx',
          size: 512000,
          uploadedBy: 'HR Department',
          uploadedAt: '2024-02-01T09:15:00Z',
          lastModified: '2024-02-01T09:15:00Z',
          tags: ['template', 'emergency', 'contact'],
          confidentialityLevel: 'internal'
        }
      ];
      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.studentName && doc.studentName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(doc => doc.type === filters.type);
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(doc => doc.category === filters.category);
    }

    // Confidentiality level filter
    if (filters.confidentialityLevel) {
      filtered = filtered.filter(doc => doc.confidentialityLevel === filters.confidentialityLevel);
    }

    // File type filter
    if (filters.fileType) {
      filtered = filtered.filter(doc => doc.fileType === filters.fileType);
    }

    setFilteredDocuments(filtered);
  };

  const handleDownload = (document: Document) => {
    // TODO: Implement actual download functionality
    console.log('Downloading document:', document.name);
  };

  const handleView = (document: Document) => {
    // TODO: Implement document viewer
    console.log('Viewing document:', document.name);
  };

  const handleDeleteClick = (document: Document, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedDocument(document);
    setShowDeleteModal(true);
  };

  const handleDeleteDocument = async () => {
    if (!selectedDocument) return;

    try {
      setDeleteLoading(true);
      await documentsApi.deleteDocument(selectedDocument.id);
      setShowDeleteModal(false);
      setDeleteLoading(false);

      // Remove from local state
      setDocuments(prevDocs => prevDocs.filter(d => d.id !== selectedDocument.id));
      setSelectedDocument(null);
    } catch (err) {
      console.error('Failed to delete document:', err);
      setDeleteLoading(false);
      // TODO: Show error toast
    }
  };

  const handleUpload = () => {
    setUploadModalOpen(true);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'jpg':
      case 'png':
        return <Image className="w-5 h-5 text-green-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const getConfidentialityBadge = (level: string) => {
    const colors = {
      public: 'bg-green-100 text-green-800',
      internal: 'bg-blue-100 text-blue-800',
      confidential: 'bg-yellow-100 text-yellow-800',
      restricted: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[level as keyof typeof colors]}`}>
        <Shield className="w-3 h-3 inline mr-1" />
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Document Management</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage and organize institutional documents with proper security controls
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={handleUpload}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search documents by name, category, tags, or student..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="medical">Medical</option>
                    <option value="administrative">Administrative</option>
                    <option value="legal">Legal</option>
                    <option value="emergency">Emergency</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="Policy">Policy</option>
                    <option value="Template">Template</option>
                    <option value="Form">Form</option>
                    <option value="Report">Report</option>
                    <option value="Record">Record</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Security Level</label>
                  <select
                    value={filters.confidentialityLevel}
                    onChange={(e) => setFilters({ ...filters, confidentialityLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Levels</option>
                    <option value="public">Public</option>
                    <option value="internal">Internal</option>
                    <option value="confidential">Confidential</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
                  <select
                    value={filters.fileType}
                    onChange={(e) => setFilters({ ...filters, fileType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="pdf">PDF</option>
                    <option value="doc">Word Document</option>
                    <option value="docx">Word Document (New)</option>
                    <option value="jpg">JPEG Image</option>
                    <option value="png">PNG Image</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({
                      type: '',
                      category: '',
                      confidentialityLevel: '',
                      dateRange: '',
                      fileType: ''
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Documents Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Documents ({filteredDocuments.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Security Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getFileIcon(document.fileType)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {document.name}
                          </div>
                          {document.studentName && (
                            <div className="text-sm text-gray-500">
                              Student: {document.studentName}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {document.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{document.type}</div>
                      <div className="text-sm text-gray-500">{document.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getConfidentialityBadge(document.confidentialityLevel)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {formatDate(document.lastModified)}
                      </div>
                      <div className="text-sm text-gray-500">
                        <User className="w-4 h-4 inline mr-1" />
                        by {document.uploadedBy}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(document.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleView(document)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(document)}
                          className="text-green-600 hover:text-green-900"
                          title="Download Document"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(document, e)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-500">
                  {searchTerm || Object.values(filters).some(f => f)
                    ? 'Try adjusting your search criteria or filters'
                    : 'Upload your first document to get started'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDocument && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => {
                if (!deleteLoading) {
                  setShowDeleteModal(false);
                  setSelectedDocument(null);
                }
              }}
            ></div>

            {/* Center modal */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Document
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete <strong>{selectedDocument.name}</strong>?
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      This action cannot be undone. The document will be permanently removed from the system.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteDocument}
                  disabled={deleteLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Document'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedDocument(null);
                  }}
                  disabled={deleteLoading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
