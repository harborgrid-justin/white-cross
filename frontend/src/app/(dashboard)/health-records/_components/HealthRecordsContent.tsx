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

export interface HealthRecord {
  id: string;
  studentId: string;
  studentName: string;
  recordType: 'MEDICAL_HISTORY' | 'PHYSICAL_EXAM' | 'IMMUNIZATION' | 'ALLERGY' | 'MEDICATION' | 'VITAL_SIGNS' | 'GROWTH_CHART' | 'SCREENING';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_REVIEW' | 'ARCHIVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  recordedBy: string;
  recordedById: string;
  recordedDate: string;
  createdAt: string;
  updatedAt: string;
  expirationDate?: string;
  requiresFollowUp: boolean;
  isConfidential: boolean;
  tags: string[];
  attachments?: string[];
  vitalSigns?: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    weight?: number;
    height?: number;
    bmi?: number;
  };
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
  }[];
  allergies?: {
    allergen: string;
    reaction: string;
    severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  }[];
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
        
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockRecords: HealthRecord[] = [
          {
            id: '1',
            studentId: 'student-001',
            studentName: 'Emma Johnson',
            recordType: 'PHYSICAL_EXAM',
            status: 'ACTIVE',
            priority: 'MEDIUM',
            title: 'Annual Physical Examination',
            description: 'Comprehensive physical examination including vision, hearing, and growth assessment.',
            recordedBy: 'Dr. Sarah Wilson',
            recordedById: 'doctor-001',
            recordedDate: '2024-09-15T10:00:00Z',
            createdAt: '2024-09-15T10:30:00Z',
            updatedAt: '2024-09-15T10:30:00Z',
            expirationDate: '2025-09-15T10:00:00Z',
            requiresFollowUp: false,
            isConfidential: false,
            tags: ['annual', 'physical', 'routine'],
            vitalSigns: {
              temperature: 98.6,
              bloodPressure: '110/70',
              heartRate: 85,
              respiratoryRate: 18,
              weight: 125.5,
              height: 64,
              bmi: 21.5,
            },
          },
          {
            id: '2',
            studentId: 'student-002',
            studentName: 'Michael Chen',
            recordType: 'ALLERGY',
            status: 'ACTIVE',
            priority: 'HIGH',
            title: 'Severe Peanut Allergy',
            description: 'Documented severe allergic reaction to peanuts. Student carries EpiPen at all times.',
            recordedBy: 'Nurse Jennifer Davis',
            recordedById: 'nurse-001',
            recordedDate: '2024-08-20T14:15:00Z',
            createdAt: '2024-08-20T14:30:00Z',
            updatedAt: '2024-08-20T14:30:00Z',
            requiresFollowUp: true,
            isConfidential: true,
            tags: ['allergy', 'severe', 'epipen', 'emergency'],
            allergies: [
              {
                allergen: 'Peanuts',
                reaction: 'Anaphylaxis, difficulty breathing, swelling',
                severity: 'LIFE_THREATENING',
              },
            ],
          },
          {
            id: '3',
            studentId: 'student-003',
            studentName: 'Sofia Rodriguez',
            recordType: 'MEDICATION',
            status: 'ACTIVE',
            priority: 'MEDIUM',
            title: 'ADHD Medication Management',
            description: 'Daily medication regimen for attention deficit hyperactivity disorder.',
            recordedBy: 'Dr. Mark Thompson',
            recordedById: 'doctor-002',
            recordedDate: '2024-09-01T09:00:00Z',
            createdAt: '2024-09-01T09:15:00Z',
            updatedAt: '2024-09-01T09:15:00Z',
            requiresFollowUp: true,
            isConfidential: true,
            tags: ['adhd', 'medication', 'daily'],
            medications: [
              {
                name: 'Methylphenidate',
                dosage: '10mg',
                frequency: 'Twice daily',
                startDate: '2024-09-01T09:00:00Z',
              },
            ],
          },
          {
            id: '4',
            studentId: 'student-004',
            studentName: 'Alex Thompson',
            recordType: 'IMMUNIZATION',
            status: 'ACTIVE',
            priority: 'LOW',
            title: 'COVID-19 Vaccination',
            description: 'Second dose of COVID-19 vaccine administered. No adverse reactions reported.',
            recordedBy: 'Nurse Jennifer Davis',
            recordedById: 'nurse-001',
            recordedDate: '2024-08-15T11:00:00Z',
            createdAt: '2024-08-15T11:15:00Z',
            updatedAt: '2024-08-15T11:15:00Z',
            requiresFollowUp: false,
            isConfidential: false,
            tags: ['covid19', 'vaccination', 'immunization'],
          },
          {
            id: '5',
            studentId: 'student-005',
            studentName: 'Maya Patel',
            recordType: 'SCREENING',
            status: 'PENDING_REVIEW',
            priority: 'HIGH',
            title: 'Vision Screening - Requires Follow-up',
            description: 'Annual vision screening indicates potential vision problems. Referral to ophthalmologist recommended.',
            recordedBy: 'School Nurse Sarah Johnson',
            recordedById: 'nurse-002',
            recordedDate: '2024-10-01T13:30:00Z',
            createdAt: '2024-10-01T13:45:00Z',
            updatedAt: '2024-10-01T13:45:00Z',
            requiresFollowUp: true,
            isConfidential: false,
            tags: ['vision', 'screening', 'referral', 'follow-up'],
          },
        ];
        
        // Apply filters
        let filteredRecords = mockRecords;
        
        if (searchParams.type) {
          filteredRecords = filteredRecords.filter(record => 
            record.recordType === searchParams.type
          );
        }
        
        if (searchParams.status) {
          filteredRecords = filteredRecords.filter(record => 
            record.status === searchParams.status
          );
        }
        
        if (searchParams.priority) {
          filteredRecords = filteredRecords.filter(record => 
            record.priority === searchParams.priority
          );
        }
        
        if (searchParams.search) {
          const searchTerm = searchParams.search.toLowerCase();
          filteredRecords = filteredRecords.filter(record =>
            record.title.toLowerCase().includes(searchTerm) ||
            record.description.toLowerCase().includes(searchTerm) ||
            record.studentName.toLowerCase().includes(searchTerm) ||
            record.recordedBy.toLowerCase().includes(searchTerm)
          );
        }
        
        if (searchParams.studentId) {
          filteredRecords = filteredRecords.filter(record => 
            record.studentId === searchParams.studentId
          );
        }
        
        setRecords(filteredRecords);
        setTotalCount(filteredRecords.length);
      } catch (error) {
        console.error('Error fetching health records:', error);
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
                        {new Date(record.recordedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={getPriorityColor(record.priority)}>
                    {record.priority}
                  </Badge>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status.replace('_', ' ')}
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