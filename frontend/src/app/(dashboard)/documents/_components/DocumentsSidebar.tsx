'use client';

/**
 * Force dynamic rendering for real-time document data
 */


import React from 'react';
import { 
  FileText,
  AlertTriangle,
  Clock,
  TrendingUp,
  Upload,
  Download,
  Shield,
  Users,
  Activity,
  Plus,
  Filter,
  RefreshCw,
  Eye,
  Star,
  Lock,
  Archive,
  Calendar,
  User,
  FileImage,
  File,
  BarChart3,
  Edit
} from 'lucide-react';
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// Document types and statuses
type DocumentType = 'medical_record' | 'immunization_record' | 'medication_record' | 'incident_report' | 'emergency_contact' | 'consent_form' | 'allergy_record' | 'insurance_card' | 'iep_504' | 'health_plan' | 'prescription' | 'lab_result' | 'x_ray' | 'photo' | 'video' | 'other';
type DocumentStatus = 'active' | 'archived' | 'pending_review' | 'expired' | 'requires_update' | 'confidential';
type AccessLevel = 'public' | 'staff_only' | 'nurse_only' | 'admin_only' | 'restricted';

interface RecentDocument {
  id: string;
  title: string;
  fileName: string;
  documentType: DocumentType;
  studentName?: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: number;
  status: DocumentStatus;
  accessLevel: AccessLevel;
  isStarred: boolean;
  isEncrypted: boolean;
}

interface DocumentActivity {
  id: string;
  type: 'uploaded' | 'downloaded' | 'shared' | 'modified' | 'reviewed' | 'expired';
  documentTitle: string;
  studentName?: string;
  user: string;
  timestamp: string;
  description: string;
}

interface DocumentAlert {
  id: string;
  type: 'expiring_soon' | 'pending_review' | 'access_violation' | 'storage_warning';
  title: string;
  description: string;
  count?: number;
  severity: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
}

interface DocumentsSidebarProps {
  className?: string;
}

const DocumentsSidebar: React.FC<DocumentsSidebarProps> = ({ 
  className = "" 
}) => {
  // Mock data - replace with real API calls or props
  const recentDocuments: RecentDocument[] = React.useMemo(() => {
    const now = new Date();
    return [
      {
        id: 'doc-001',
        title: 'Annual Medical Record',
        fileName: 'emily_johnson_medical_record_2024.pdf',
        documentType: 'medical_record',
        studentName: 'Emily Johnson',
        uploadedBy: 'Nurse Williams',
        uploadedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        fileSize: 2.5 * 1024 * 1024,
        status: 'active',
        accessLevel: 'nurse_only',
        isStarred: true,
        isEncrypted: true
      },
      {
        id: 'doc-002',
        title: 'COVID-19 Vaccination Record',
        fileName: 'covid_vaccine_card.jpg',
        documentType: 'immunization_record',
        studentName: 'Michael Chen',
        uploadedBy: 'Parent - Lisa Chen',
        uploadedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
        fileSize: 1.2 * 1024 * 1024,
        status: 'active',
        accessLevel: 'staff_only',
        isStarred: false,
        isEncrypted: true
      },
      {
        id: 'doc-003',
        title: 'Severe Allergy Action Plan',
        fileName: 'allergy_action_plan.pdf',
        documentType: 'allergy_record',
        studentName: 'Sarah Martinez',
        uploadedBy: 'Dr. Rodriguez',
        uploadedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        fileSize: 800 * 1024,
        status: 'active',
        accessLevel: 'staff_only',
        isStarred: true,
        isEncrypted: true
      },
      {
        id: 'doc-004',
        title: 'Individual Education Plan (IEP)',
        fileName: 'iep_plan_2024_2025.pdf',
        documentType: 'iep_504',
        studentName: 'Jessica Lee',
        uploadedBy: 'Special Ed Coordinator',
        uploadedAt: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
        fileSize: 3.2 * 1024 * 1024,
        status: 'pending_review',
        accessLevel: 'restricted',
        isStarred: true,
        isEncrypted: true
      },
      {
        id: 'doc-005',
        title: 'School Health Policies',
        fileName: 'school_health_policies_2024.pdf',
        documentType: 'other',
        uploadedBy: 'Principal Davis',
        uploadedAt: new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString(),
        fileSize: 5.1 * 1024 * 1024,
        status: 'active',
        accessLevel: 'public',
        isStarred: false,
        isEncrypted: false
      }
    ];
  }, []);

  const recentActivity: DocumentActivity[] = React.useMemo(() => {
    const now = new Date();
    return [
      {
        id: 'activity-001',
        type: 'uploaded',
        documentTitle: 'Annual Medical Record',
        studentName: 'Emily Johnson',
        user: 'Nurse Williams',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        description: 'New medical record uploaded with current health assessment'
      },
      {
        id: 'activity-002',
        type: 'reviewed',
        documentTitle: 'Severe Allergy Action Plan',
        studentName: 'Sarah Martinez',
        user: 'Nurse Johnson',
        timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        description: 'Allergy plan reviewed and approved for emergency use'
      },
      {
        id: 'activity-003',
        type: 'downloaded',
        documentTitle: 'COVID-19 Vaccination Record',
        studentName: 'Michael Chen',
        user: 'Teacher Smith',
        timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
        description: 'Vaccination record accessed for field trip approval'
      },
      {
        id: 'activity-004',
        type: 'modified',
        documentTitle: 'Individual Education Plan (IEP)',
        studentName: 'Jessica Lee',
        user: 'Special Ed Coordinator',
        timestamp: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(),
        description: 'IEP document updated with new accommodations'
      },
      {
        id: 'activity-005',
        type: 'shared',
        documentTitle: 'School Health Policies',
        user: 'Principal Davis',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        description: 'Health policies shared with all staff members'
      }
    ];
  }, []);

  const documentAlerts: DocumentAlert[] = React.useMemo(() => {
    const now = new Date();
    return [
      {
        id: 'alert-001',
        type: 'pending_review',
        title: 'Pending Reviews',
        description: '5 documents require immediate review and approval',
        count: 5,
        severity: 'urgent',
        timestamp: now.toISOString()
      },
      {
        id: 'alert-002',
        type: 'expiring_soon',
        title: 'Expiring Documents',
        description: '8 documents will expire within the next 7 days',
        count: 8,
        severity: 'high',
        timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 'alert-003',
        type: 'storage_warning',
        title: 'Storage Space',
        description: 'Document storage is approaching 85% capacity',
        severity: 'medium',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'alert-004',
        type: 'access_violation',
        title: 'Access Attempt',
        description: 'Unauthorized access attempt to restricted documents',
        severity: 'high',
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()
      }
    ];
  }, []);

  // Calculate quick statistics
  const quickStats = React.useMemo(() => {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return {
      recentUploads: recentDocuments.filter(doc => {
        const uploadTime = new Date(doc.uploadedAt);
        return uploadTime >= dayAgo;
      }).length,
      pendingReview: recentDocuments.filter(doc => doc.status === 'pending_review').length,
      encryptedDocs: recentDocuments.filter(doc => doc.isEncrypted).length,
      starredDocs: recentDocuments.filter(doc => doc.isStarred).length
    };
  }, [recentDocuments]);

  // Utility functions
  const formatRelativeTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getSeverityColor = (severity: string): string => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      uploaded: Upload,
      downloaded: Download,
      shared: Users,
      modified: Edit,
      reviewed: Eye,
      expired: AlertTriangle
    };
    return icons[type as keyof typeof icons] || Activity;
  };

  const getDocumentTypeIcon = (type: DocumentType) => {
    const icons = {
      medical_record: Shield,
      immunization_record: Shield,
      medication_record: Shield,
      incident_report: AlertTriangle,
      emergency_contact: Users,
      consent_form: FileText,
      allergy_record: AlertTriangle,
      insurance_card: FileText,
      iep_504: FileText,
      health_plan: Shield,
      prescription: FileText,
      lab_result: BarChart3,
      x_ray: FileImage,
      photo: FileImage,
      video: FileImage,
      other: File
    };
    return icons[type] || FileText;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Quick Statistics */}
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Quick Stats
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{quickStats.recentUploads}</div>
              <div className="text-xs text-blue-600 font-medium">Today</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-600">{quickStats.pendingReview}</div>
              <div className="text-xs text-orange-600 font-medium">Pending</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">{quickStats.encryptedDocs}</div>
              <div className="text-xs text-green-600 font-medium">Encrypted</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-xl font-bold text-yellow-600">{quickStats.starredDocs}</div>
              <div className="text-xs text-yellow-600 font-medium">Starred</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Document Alerts */}
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
            Document Alerts
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {documentAlerts.map((alert) => (
              <div key={alert.id} className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{alert.title}</h4>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{alert.description}</p>
                {alert.count && (
                  <div className="flex items-center text-xs text-gray-500">
                    <FileText className="h-3 w-3 mr-1" />
                    {alert.count} documents
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {formatRelativeTime(alert.timestamp)}
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" size="sm" className="w-full mt-3">
            View All Alerts
          </Button>
        </div>
      </Card>

      {/* Recent Documents */}
      <Card>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Recent Documents
            </h3>
            <Button variant="ghost" size="sm" title="Refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentDocuments.slice(0, 8).map((document) => {
              const TypeIcon = getDocumentTypeIcon(document.documentType);
              return (
                <div key={document.id} className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center min-w-0 flex-1">
                      <TypeIcon className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 text-sm truncate" title={document.title}>
                          {document.title}
                        </h4>
                        {document.studentName && (
                          <p className="text-xs text-gray-600 truncate">{document.studentName}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      {document.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                      {document.isEncrypted && <Lock className="h-3 w-3 text-gray-500" />}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600 truncate">{document.uploadedBy}</span>
                    </div>
                    <span className="text-gray-500">{formatFileSize(document.fileSize)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <Badge className={
                      document.status === 'pending_review' 
                        ? 'bg-orange-100 text-orange-800'
                        : document.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                    }>
                      {document.status.replace('_', ' ')}
                    </Badge>
                    <div className="text-xs text-gray-400">
                      {formatRelativeTime(document.uploadedAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" className="flex-1">
              <Upload className="h-4 w-4 mr-1" />
              Upload
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-green-600" />
            Recent Activity
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivity.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type);
              
              return (
                <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                  <div className={`p-1.5 rounded-full ${
                    activity.type === 'uploaded' ? 'bg-blue-100' :
                    activity.type === 'downloaded' ? 'bg-green-100' :
                    activity.type === 'shared' ? 'bg-purple-100' :
                    activity.type === 'modified' ? 'bg-orange-100' :
                    activity.type === 'reviewed' ? 'bg-yellow-100' :
                    'bg-gray-100'
                  }`}>
                    <ActivityIcon className={`h-3 w-3 ${
                      activity.type === 'uploaded' ? 'text-blue-600' :
                      activity.type === 'downloaded' ? 'text-green-600' :
                      activity.type === 'shared' ? 'text-purple-600' :
                      activity.type === 'modified' ? 'text-orange-600' :
                      activity.type === 'reviewed' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.documentTitle}
                      </p>
                    </div>
                    {activity.studentName && (
                      <p className="text-xs text-gray-600 mb-1">
                        Student: {activity.studentName}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mb-1">{activity.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        by {activity.user}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <Button variant="outline" size="sm" className="w-full mt-3">
            View Activity Log
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Plus className="h-5 w-5 mr-2 text-purple-600" />
            Quick Actions
          </h3>
          
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Create Template
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Bulk Export
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Archive className="h-4 w-4 mr-2" />
              Archive Old Documents
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Review Permissions
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Cleanup
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DocumentsSidebar;