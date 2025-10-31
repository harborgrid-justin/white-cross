'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
  FileText, 
  Heart, 
  Activity, 
  Pill,
  Plus,
  Download,
  Eye,
  Edit,
  Clock,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Stethoscope,
  Ruler
} from 'lucide-react';

// Import server actions
import { getHealthRecordsAction } from '@/app/health-records/actions';

// Import types - interface that matches the server response structure
interface HealthRecord {
  id: string;
  studentId: string;
  recordType: string;
  title: string;
  description: string;
  recordDate: string;
  provider?: string;
  providerNpi?: string;
  facility?: string;
  facilityNpi?: string;
  diagnosis?: string;
  diagnosisCode?: string;
  treatment?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  followUpCompleted: boolean;
  isConfidential: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Optional properties for UI enhancement - not from server
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING_REVIEW' | 'ARCHIVED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  studentName?: string;
  recordedBy?: string;
  requiresFollowUp?: boolean;
  // Optional nested objects that may not be present
  student?: {
    firstName?: string;
    lastName?: string;
  };
  vitalSigns?: {
    temperature?: string;
    bloodPressure?: string;
    heartRate?: string;
    weight?: string;
  };
  expirationDate?: string;
}

interface HealthRecordsContentProps {
  searchParams: {
    page?: string;
    limit?: string;
    type?: string;
    status?: string;
    priority?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    studentId?: string;
    recordedBy?: string;
  };
}

export function HealthRecordsContent({ searchParams }: HealthRecordsContentProps) {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '20');

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        setIsLoading(true);
        
        // Use server action to fetch health records
        const result = await getHealthRecordsAction(
          searchParams.studentId, 
          searchParams.type
        );
        
        if (result.success && result.data) {
          // Transform server data to match our interface
          const transformedRecords: HealthRecord[] = result.data.map((record: HealthRecord) => ({
            ...record,
            // Set default values for optional fields
            status: 'ACTIVE' as const,
            priority: record.isConfidential ? 'HIGH' as const : 'MEDIUM' as const,
            studentName: record.student?.firstName && record.student?.lastName 
              ? `${record.student.firstName} ${record.student.lastName}` 
              : 'Unknown Student',
            recordedBy: record.provider || 'System',
            requiresFollowUp: record.followUpRequired,
          }));
          
          // Apply client-side filters for search params not handled by server
          let filteredRecords = transformedRecords;
          
          if (searchParams.search) {
            const searchTerm = searchParams.search.toLowerCase();
            filteredRecords = filteredRecords.filter(record =>
              record.title.toLowerCase().includes(searchTerm) ||
              record.description.toLowerCase().includes(searchTerm) ||
              (record.studentName || '').toLowerCase().includes(searchTerm) ||
              (record.recordedBy || '').toLowerCase().includes(searchTerm)
            );
          }
          
          setRecords(filteredRecords);
          setTotalCount(filteredRecords.length);
        } else {
          console.error('Failed to fetch health records:', result.error);
          setRecords([]);
          setTotalCount(0);
        }
      } catch (error) {
        console.error('Error fetching health records:', error);
        setRecords([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealthRecords();
  }, [searchParams]);

  const getStatusColor = (status: HealthRecord['status']) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'PENDING_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: HealthRecord['priority']) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: HealthRecord['recordType']) => {
    switch (type) {
      case 'MEDICAL_HISTORY': return <FileText className="h-4 w-4" />;
      case 'PHYSICAL_EXAM': return <Stethoscope className="h-4 w-4" />;
      case 'IMMUNIZATION': return <Heart className="h-4 w-4" />;
      case 'ALLERGY': return <AlertTriangle className="h-4 w-4" />;
      case 'MEDICATION': return <Pill className="h-4 w-4" />;
      case 'VITAL_SIGNS': return <Activity className="h-4 w-4" />;
      case 'GROWTH_CHART': return <Ruler className="h-4 w-4" />;
      case 'SCREENING': return <Eye className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-20" />
            </Card>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
          <p className="text-gray-600">
            Showing {records.length} of {totalCount} health records
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Record
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Records</p>
              <p className="text-2xl font-bold text-green-600">
                {records.filter(r => r.status === 'ACTIVE').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">
                {records.filter(r => r.status === 'PENDING_REVIEW').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Priority</p>
              <p className="text-2xl font-bold text-red-600">
                {records.filter(r => r.priority === 'CRITICAL').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Follow-ups Due</p>
              <p className="text-2xl font-bold text-orange-600">
                {records.filter(r => r.requiresFollowUp).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Health Records List */}
      <div className="space-y-4">
        {records.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No health records found
            </h3>
            <p className="text-gray-600 mb-4">
              No health records match your current filters.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create First Record
            </Button>
          </Card>
        ) : (
          records.map((record) => (
            <Card key={record.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getTypeIcon(record.recordType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {record.title}
                      </h3>
                      {record.isConfidential && (
                        <Badge variant="danger">
                          Confidential
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">
                      {record.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {record.studentName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Stethoscope className="h-3 w-3" />
                        {record.recordedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(record.recordDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={getPriorityColor(record.priority)}>
                    {record.priority || 'MEDIUM'}
                  </Badge>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status?.replace('_', ' ') || 'ACTIVE'}
                  </Badge>
                </div>
              </div>

              {/* Additional Information */}
              {record.vitalSigns && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Vital Signs
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {record.vitalSigns.temperature && (
                      <div>
                        <span className="text-gray-600">Temperature:</span>
                        <span className="font-medium ml-1">{record.vitalSigns.temperature}°F</span>
                      </div>
                    )}
                    {record.vitalSigns.bloodPressure && (
                      <div>
                        <span className="text-gray-600">BP:</span>
                        <span className="font-medium ml-1">{record.vitalSigns.bloodPressure}</span>
                      </div>
                    )}
                    {record.vitalSigns.heartRate && (
                      <div>
                        <span className="text-gray-600">Heart Rate:</span>
                        <span className="font-medium ml-1">{record.vitalSigns.heartRate} bpm</span>
                      </div>
                    )}
                    {record.vitalSigns.weight && (
                      <div>
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium ml-1">{record.vitalSigns.weight} lbs</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {record.requiresFollowUp && (
                    <Badge variant="warning">
                      Follow-up Required
                    </Badge>
                  )}
                  {record.expirationDate && (
                    <Badge variant="info">
                      Expires: {new Date(record.expirationDate).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalCount > limit && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} records
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page * limit >= totalCount}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
