/**
 * @fileoverview Certifications and licenses panel component
 * @module app/(dashboard)/profile/_components/CertificationsPanel
 * @category Profile - Components
 */

'use client';

import { Award, Upload, FileText, Download, Trash2 } from 'lucide-react';
import type { UserProfile } from '@/lib/actions/profile.actions';

interface CertificationsPanelProps {
  profile: UserProfile;
  onUpload?: () => void;
  onView?: (certId: string) => void;
  onDownload?: (certId: string) => void;
  onDelete?: (certId: string) => void;
}

/**
 * Certifications panel component
 * Displays user certifications and licenses with management actions
 *
 * @component
 * @example
 * ```tsx
 * <CertificationsPanel
 *   profile={userProfile}
 *   onUpload={handleUpload}
 *   onView={handleView}
 *   onDownload={handleDownload}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export function CertificationsPanel({
  profile,
  onUpload,
  onView,
  onDownload,
  onDelete
}: CertificationsPanelProps) {
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

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Certifications & Licenses</h2>
        </div>
        {onUpload && (
          <button
            onClick={onUpload}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="h-4 w-4 mr-2 inline" />
            Upload Certificate
          </button>
        )}
      </div>

      <div className="space-y-3">
        {profile.certifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No certifications on file</p>
            {onUpload && (
              <button
                onClick={onUpload}
                className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Upload your first certificate
              </button>
            )}
          </div>
        ) : (
          profile.certifications.map((cert) => (
            <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium">{cert.name}</h3>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCertificationStatusColor(cert.status)}`}>
                    {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>Issued: {formatDate(cert.issueDate)}</span>
                  <span>Expires: {formatDate(cert.expiryDate)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {onView && (
                  <button
                    onClick={() => onView(cert.id)}
                    title="View certificate details"
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    aria-label={`View ${cert.name} details`}
                  >
                    <FileText className="h-4 w-4" />
                  </button>
                )}
                {onDownload && (
                  <button
                    onClick={() => onDownload(cert.id)}
                    title="Download certificate"
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    aria-label={`Download ${cert.name}`}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(cert.id)}
                    title="Delete certificate"
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    aria-label={`Delete ${cert.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
