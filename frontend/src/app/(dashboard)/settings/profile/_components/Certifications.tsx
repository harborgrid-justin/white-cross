/**
 * @fileoverview Certifications Component - Certifications and licenses management
 * @module app/(dashboard)/profile/_components/Certifications
 * @category Profile - Components
 */

'use client';

import { useState } from 'react';
import { 
  Award, 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Calendar,
  AlertTriangle,
  Plus,
  X
} from 'lucide-react';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  status: 'active' | 'expiring' | 'expired';
  issueDate: string;
  expiryDate: string;
  certificateUrl?: string;
}

interface CertificationsProps {
  certifications: Certification[];
  onUploadCertificate: (file: File, metadata: {
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate: string;
  }) => Promise<void>;
  onDeleteCertification: (id: string) => Promise<void>;
  onDownloadCertificate: (id: string) => Promise<void>;
  isUploading?: boolean;
}

export function Certifications({
  certifications,
  onUploadCertificate,
  onDeleteCertification,
  onDownloadCertificate,
  isUploading = false
}: CertificationsProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    file: null as File | null
  });

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCertificationStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCertificationStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Award className="h-4 w-4 text-green-600" />;
      case 'expiring':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'expired':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    return expiry <= thirtyDaysFromNow && expiry > today;
  };

  // Form handlers
  const handleUploadSubmit = async () => {
    if (!uploadForm.file || !uploadForm.name || !uploadForm.issuer || 
        !uploadForm.issueDate || !uploadForm.expiryDate) {
      return;
    }

    try {
      await onUploadCertificate(uploadForm.file, {
        name: uploadForm.name,
        issuer: uploadForm.issuer,
        issueDate: uploadForm.issueDate,
        expiryDate: uploadForm.expiryDate
      });
      
      // Reset form
      setUploadForm({
        name: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        file: null
      });
      setShowUploadModal(false);
    } catch (error) {
      console.error('Failed to upload certificate:', error);
      // Error handling is managed by parent component
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const isFormValid = uploadForm.name.trim() !== '' && 
                      uploadForm.issuer.trim() !== '' && 
                      uploadForm.issueDate !== '' && 
                      uploadForm.expiryDate !== '' && 
                      uploadForm.file !== null;

  // Count certifications by status
  const activeCertifications = certifications.filter(cert => cert.status === 'active').length;
  const expiringCertifications = certifications.filter(cert => cert.status === 'expiring').length;
  const expiredCertifications = certifications.filter(cert => cert.status === 'expired').length;

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Certifications & Licenses</h2>
          <div className="ml-2 text-sm text-gray-500">
            ({certifications.length} total)
          </div>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Certificate
        </button>
      </div>

      {/* Status Summary */}
      {certifications.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-lg font-semibold text-green-900">{activeCertifications}</div>
                <div className="text-sm text-green-700">Active</div>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-lg font-semibold text-yellow-900">{expiringCertifications}</div>
                <div className="text-sm text-yellow-700">Expiring Soon</div>
              </div>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-lg font-semibold text-red-900">{expiredCertifications}</div>
                <div className="text-sm text-red-700">Expired</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certifications List */}
      {certifications.length === 0 ? (
        <div className="text-center py-8">
          <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Certifications</h3>
          <p className="text-gray-600 mb-4">Upload your first certification to get started.</p>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4 mr-2 inline" />
            Upload Certificate
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getCertificationStatusIcon(cert.status)}
                      <h3 className="font-medium">{cert.name}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCertificationStatusColor(cert.status)}`}>
                        {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{cert.issuer}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Issued: {formatDate(cert.issueDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Expires: {formatDate(cert.expiryDate)}</span>
                      </div>
                    </div>
                    {isExpiringSoon(cert.expiryDate) && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-yellow-700">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Expires within 30 days</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button 
                  title="View certificate details" 
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                </button>
                <button 
                  title="Download certificate" 
                  onClick={() => onDownloadCertificate(cert.id)}
                  className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button 
                  title="Delete certificate" 
                  onClick={() => onDeleteCertification(cert.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Certificate</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
                title="Close upload modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="cert-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Certificate Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="cert-name"
                  type="text"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., AWS Solutions Architect"
                  required
                />
              </div>

              <div>
                <label htmlFor="cert-issuer" className="block text-sm font-medium text-gray-700 mb-1">
                  Issuing Organization <span className="text-red-500">*</span>
                </label>
                <input
                  id="cert-issuer"
                  type="text"
                  value={uploadForm.issuer}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, issuer: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Amazon Web Services"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="cert-issue-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cert-issue-date"
                    type="date"
                    value={uploadForm.issueDate}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, issueDate: e.target.value }))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cert-expiry-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cert-expiry-date"
                    type="date"
                    value={uploadForm.expiryDate}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cert-file" className="block text-sm font-medium text-gray-700 mb-1">
                  Certificate File <span className="text-red-500">*</span>
                </label>
                <input
                  id="cert-file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, JPG, PNG (max 10MB)
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUploadSubmit}
                  disabled={!isFormValid || isUploading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {isUploading ? 'Uploading...' : 'Upload Certificate'}
                </button>
                <button
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
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
}
